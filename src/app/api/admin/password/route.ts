import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import {
  getCurrentAdmin,
  getCurrentSessionTokenHash,
  revokeOtherAdminSessions,
} from "@/lib/auth";
import {
  checkPersistentRateLimit,
  clearPersistentRateLimit,
  getDb,
  logAdminAction,
} from "@/lib/db";
import { RATE_LIMITS } from "@/lib/rate-limit-config";
import {
  getClientIp,
  hashPassword,
  verifyPassword,
  verifySameOrigin,
} from "@/lib/security";

const passwordSchema = z.object({
  currentPassword: z.string().min(6),
  newPassword: z
    .string()
    .min(10, "Kata sandi baru minimal 10 karakter.")
    .max(128)
    .regex(/[A-Z]/, "Harus mengandung minimal 1 huruf besar.")
    .regex(/[a-z]/, "Harus mengandung minimal 1 huruf kecil.")
    .regex(/[0-9]/, "Harus mengandung minimal 1 angka."),
});

export async function POST(req: NextRequest) {
  if (!verifySameOrigin(req)) {
    return NextResponse.json({ error: "Invalid origin." }, { status: 403 });
  }

  const admin = await getCurrentAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const pwKey = `admin_pw:${admin.id}`;
  const pwLimit = checkPersistentRateLimit(
    pwKey,
    RATE_LIMITS.adminPasswordChange.maxRequests,
    RATE_LIMITS.adminPasswordChange.windowMs
  );
  if (!pwLimit.allowed) {
    return NextResponse.json(
      {
        error: `Terlalu banyak percobaan ubah kata sandi. Coba lagi dalam ${Math.ceil(
          pwLimit.retryAfterSec / 60
        )} menit.`,
        retryAfterSec: pwLimit.retryAfterSec,
      },
      {
        status: 429,
        headers: {
          "Retry-After": String(pwLimit.retryAfterSec),
          "X-RateLimit-Limit": String(RATE_LIMITS.adminPasswordChange.maxRequests),
          "X-RateLimit-Remaining": "0",
        },
      }
    );
  }

  const raw = await req.json().catch(() => null);
  const parsed = passwordSchema.safeParse(raw);
  if (!parsed.success) {
    const firstIssue =
      parsed.error.issues[0]?.message || "Kata sandi tidak memenuhi syarat.";
    return NextResponse.json({ error: firstIssue }, { status: 400 });
  }

  const db = getDb();
  const row = db
    .prepare("SELECT password_hash FROM admin_users WHERE id = ?")
    .get(admin.id) as { password_hash: string } | undefined;

  if (!row || !verifyPassword(parsed.data.currentPassword, row.password_hash)) {
    return NextResponse.json(
      { error: "Kata sandi saat ini tidak sesuai." },
      { status: 400 }
    );
  }

  clearPersistentRateLimit(pwKey);

  const newHash = hashPassword(parsed.data.newPassword);
  db.prepare(
    `UPDATE admin_users SET password_hash = ?, must_change_password = 0 WHERE id = ?`
  ).run(newHash, admin.id);

  // VA-04: Invalidate all other active sessions for this admin account
  const currentHash = await getCurrentSessionTokenHash();
  const revokedCount = revokeOtherAdminSessions(admin.id, currentHash);

  logAdminAction(
    admin.email,
    "CHANGE_PASSWORD",
    `user:${admin.id} (revoked:${revokedCount})`,
    getClientIp(req)
  );
  return NextResponse.json({ ok: true, revokedSessions: revokedCount });
}
