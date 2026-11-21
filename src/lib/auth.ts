import { cookies } from "next/headers";
import { getDb, logAdminAction } from "./db";
import {
  DUMMY_PASSWORD_HASH,
  generateSecureToken,
  sha256,
  verifyPassword,
} from "./security";
import type { AdminUser } from "./types";

export const SESSION_COOKIE_NAME = "ek_admin_session";
const SESSION_TTL_HOURS = 12;

export async function createAdminSession(
  email: string,
  password: string,
  ipAddress: string,
  userAgent: string
): Promise<{ ok: true; user: AdminUser } | { ok: false; error: string }> {
  const db = getDb();
  const normalized = email.trim().toLowerCase();

  const row = db
    .prepare(
      `SELECT id, email, name, password_hash, role, must_change_password, created_at, last_login_at
       FROM admin_users WHERE email = ?`
    )
    .get(normalized) as
    | (AdminUser & { password_hash: string })
    | undefined;

  // VA-06: Constant-time password verification to prevent timing-based user enumeration
  const hashToCheck = row ? row.password_hash : DUMMY_PASSWORD_HASH;
  const passwordValid = verifyPassword(password, hashToCheck);

  if (!row || !passwordValid) {
    logAdminAction(normalized || "unknown", "LOGIN_FAILED", "admin_portal", ipAddress);
    return { ok: false, error: "Email atau kata sandi tidak valid." };
  }

  // Purge expired sessions
  db.prepare(`DELETE FROM sessions WHERE expires_at <= datetime('now')`).run();

  const rawToken = generateSecureToken(32);
  const tokenHash = sha256(rawToken);
  const expiresAt = new Date(
    Date.now() + SESSION_TTL_HOURS * 60 * 60 * 1000
  ).toISOString();

  db.prepare(
    `INSERT INTO sessions (user_id, token_hash, expires_at, ip_address, user_agent)
     VALUES (?, ?, ?, ?, ?)`
  ).run(row.id, tokenHash, expiresAt, ipAddress, userAgent.slice(0, 250));

  db.prepare(
    `UPDATE admin_users SET last_login_at = datetime('now') WHERE id = ?`
  ).run(row.id);

  logAdminAction(row.email, "LOGIN_SUCCESS", "admin_portal", ipAddress);

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, rawToken, {
    httpOnly: true,
    sameSite: "strict", // VA-05: Strict CSRF cookie isolation for admin portal
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_TTL_HOURS * 60 * 60,
  });

  const { password_hash: _ignored, ...safeUser } = { ...row };
  void _ignored;
  return { ok: true, user: { ...safeUser } };
}

export async function getCurrentSessionTokenHash(): Promise<string | null> {
  const cookieStore = await cookies();
  const rawToken = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  if (!rawToken || rawToken.length < 32) return null;
  return sha256(rawToken);
}

export async function getCurrentAdmin(): Promise<AdminUser | null> {
  const tokenHash = await getCurrentSessionTokenHash();
  if (!tokenHash) return null;

  const db = getDb();
  const row = db
    .prepare(
      `SELECT u.id, u.email, u.name, u.role, u.must_change_password, u.created_at, u.last_login_at, s.expires_at
       FROM sessions s
       JOIN admin_users u ON u.id = s.user_id
       WHERE s.token_hash = ?`
    )
    .get(tokenHash) as (AdminUser & { expires_at: string }) | undefined;

  if (!row) return null;
  if (new Date(row.expires_at).getTime() <= Date.now()) {
    db.prepare(`DELETE FROM sessions WHERE token_hash = ?`).run(tokenHash);
    return null;
  }

  const { expires_at: _exp, ...user } = { ...row };
  void _exp;
  return { ...user };
}

// VA-04: Revoke all other active sessions for an admin user (called on password change)
export function revokeOtherAdminSessions(
  userId: number,
  keepTokenHash: string | null
): number {
  const db = getDb();
  if (keepTokenHash) {
    const res = db
      .prepare(`DELETE FROM sessions WHERE user_id = ? AND token_hash != ?`)
      .run(userId, keepTokenHash);
    return Number(res.changes ?? 0);
  }
  const res = db.prepare(`DELETE FROM sessions WHERE user_id = ?`).run(userId);
  return Number(res.changes ?? 0);
}

export function isPasswordChangeRequired(admin: AdminUser): boolean {
  return process.env.NODE_ENV === "production" && admin.must_change_password === 1;
}

export async function destroyAdminSession(ipAddress: string): Promise<void> {
  const cookieStore = await cookies();
  const rawToken = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  if (rawToken) {
    const db = getDb();
    const admin = await getCurrentAdmin();
    db.prepare(`DELETE FROM sessions WHERE token_hash = ?`).run(
      sha256(rawToken)
    );
    if (admin) {
      logAdminAction(admin.email, "LOGOUT", "admin_portal", ipAddress);
    }
  }
  cookieStore.delete(SESSION_COOKIE_NAME);
}
