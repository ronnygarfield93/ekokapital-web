import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import type { DatabaseSync as DatabaseSyncType } from "node:sqlite";
import { hashPassword } from "./security";
import {
  SEED_DOCUMENTS,
  SEED_NOTICES,
  SEED_POSTS,
  SEED_WPPE_STAFF,
} from "./seed-data";

function loadNodeSqlite(): {
  DatabaseSync: new (path: string) => DatabaseSyncType;
} {
  const proc = process as unknown as {
    getBuiltinModule?: (id: string) => unknown;
  };
  const mod = proc.getBuiltinModule?.("node:sqlite") as
    | { DatabaseSync: new (path: string) => DatabaseSyncType }
    | undefined;
  if (!mod?.DatabaseSync) {
    throw new Error("Node.js v22.5+ with built-in node:sqlite is required.");
  }
  return mod;
}

function getDbPath(): string {
  const configured = process.env.DATABASE_PATH || "./data/ekokapital.db";
  const resolved = path.isAbsolute(configured)
    ? configured
    : path.join(/*turbopackIgnore: true*/ process.cwd(), configured);
  const dir = path.dirname(resolved);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  return resolved;
}

const globalForDb = globalThis as unknown as {
  __ekokapitalDb?: DatabaseSyncType;
};

export function getDb(): DatabaseSyncType {
  if (globalForDb.__ekokapitalDb) {
    return globalForDb.__ekokapitalDb;
  }

  const { DatabaseSync } = loadNodeSqlite();
  const db = new DatabaseSync(getDbPath());
  db.exec("PRAGMA journal_mode = WAL;");
  db.exec("PRAGMA foreign_keys = ON;");

  initSchema(db);
  seedInitialData(db);

  globalForDb.__ekokapitalDb = db;
  return db;
}

function initSchema(db: DatabaseSyncType) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS admin_users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT NOT NULL UNIQUE,
      name TEXT NOT NULL,
      password_hash TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'superadmin',
      must_change_password INTEGER NOT NULL DEFAULT 1,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      last_login_at TEXT
    );

    CREATE TABLE IF NOT EXISTS sessions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      token_hash TEXT NOT NULL UNIQUE,
      expires_at TEXT NOT NULL,
      ip_address TEXT NOT NULL DEFAULT '',
      user_agent TEXT NOT NULL DEFAULT '',
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (user_id) REFERENCES admin_users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS posts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      slug TEXT NOT NULL UNIQUE,
      category TEXT NOT NULL DEFAULT 'news',
      title_id TEXT NOT NULL,
      title_en TEXT NOT NULL,
      excerpt_id TEXT NOT NULL DEFAULT '',
      excerpt_en TEXT NOT NULL DEFAULT '',
      content_id TEXT NOT NULL,
      content_en TEXT NOT NULL,
      cover_image TEXT,
      published INTEGER NOT NULL DEFAULT 1,
      published_at TEXT NOT NULL DEFAULT (date('now')),
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS documents (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      category TEXT NOT NULL,
      year INTEGER,
      title_id TEXT NOT NULL,
      title_en TEXT NOT NULL,
      description_id TEXT NOT NULL DEFAULT '',
      description_en TEXT NOT NULL DEFAULT '',
      file_url TEXT NOT NULL,
      file_size TEXT NOT NULL DEFAULT 'PDF',
      published INTEGER NOT NULL DEFAULT 1,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS wppe_staff (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      license_type TEXT NOT NULL DEFAULT 'WPPE',
      license_number TEXT NOT NULL DEFAULT '-',
      position_id TEXT NOT NULL DEFAULT 'Wakil Perantara Pedagang Efek',
      position_en TEXT NOT NULL DEFAULT 'Securities Broker Representative',
      active INTEGER NOT NULL DEFAULT 1,
      sort_order INTEGER NOT NULL DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS notices (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      type TEXT NOT NULL DEFAULT 'fraud_alert',
      title_id TEXT NOT NULL,
      title_en TEXT NOT NULL,
      body_id TEXT NOT NULL,
      body_en TEXT NOT NULL,
      cta_label_id TEXT,
      cta_label_en TEXT,
      cta_url TEXT,
      show_as_modal INTEGER NOT NULL DEFAULT 0,
      active INTEGER NOT NULL DEFAULT 1,
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS submissions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      ticket_code TEXT NOT NULL UNIQUE,
      type TEXT NOT NULL,
      is_anonymous INTEGER NOT NULL DEFAULT 0,
      full_name TEXT,
      email TEXT,
      phone TEXT,
      client_code TEXT,
      subject TEXT NOT NULL,
      message TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'new',
      admin_notes TEXT,
      ip_hash TEXT NOT NULL DEFAULT '',
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS audit_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      admin_email TEXT NOT NULL,
      action TEXT NOT NULL,
      target TEXT NOT NULL DEFAULT '',
      ip_address TEXT NOT NULL DEFAULT '',
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS rate_limits (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      rate_key TEXT NOT NULL,
      created_at INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS used_captcha_nonces (
      nonce TEXT PRIMARY KEY,
      expires_at INTEGER NOT NULL
    );

    CREATE INDEX IF NOT EXISTS idx_posts_category_pub ON posts(category, published, published_at DESC);
    CREATE INDEX IF NOT EXISTS idx_documents_category_year ON documents(category, published, year DESC);
    CREATE INDEX IF NOT EXISTS idx_submissions_type_status ON submissions(type, status, created_at DESC);
    CREATE INDEX IF NOT EXISTS idx_sessions_token ON sessions(token_hash);
    CREATE INDEX IF NOT EXISTS idx_rate_limits_key_time ON rate_limits(rate_key, created_at);
  `);
}

function seedInitialData(db: DatabaseSyncType) {
  // 1. Seed initial admin user if none exists
  const adminCount = db
    .prepare("SELECT COUNT(*) as c FROM admin_users")
    .get() as { c: number };
  if (adminCount.c === 0) {
    const email = (
      process.env.INITIAL_ADMIN_EMAIL || "admin@ekokapital.com"
    ).toLowerCase();
    let password = process.env.INITIAL_ADMIN_PASSWORD?.trim();
    if (!password) {
      if (process.env.NODE_ENV === "production") {
        // VA-04: Never use a predictable hardcoded password in production
        password = `Ek!${crypto.randomBytes(12).toString("base64url")}9A`;
        console.warn(
          `[SECURITY] INITIAL_ADMIN_PASSWORD tidak diset. Kata sandi admin acak dibuat untuk ${email}: ${password} (Segera ganti setelah login!)`
        );
      } else {
        password = "EkoAdmin#2026!ChangeMe";
      }
    }
    db.prepare(
      `INSERT INTO admin_users (email, name, password_hash, role, must_change_password)
       VALUES (?, ?, ?, 'superadmin', 1)`
    ).run(email, "Administrator Ekokapital", hashPassword(password));
  }

  // 2. Seed posts
  const postCount = db.prepare("SELECT COUNT(*) as c FROM posts").get() as {
    c: number;
  };
  if (postCount.c === 0) {
    const stmt = db.prepare(`
      INSERT INTO posts (
        slug, category, title_id, title_en, excerpt_id, excerpt_en,
        content_id, content_en, cover_image, published, published_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 1, ?)
    `);
    for (const p of SEED_POSTS) {
      stmt.run(
        p.slug,
        p.category,
        p.title_id,
        p.title_en,
        p.excerpt_id,
        p.excerpt_en,
        p.content_id,
        p.content_en,
        p.cover_image ?? null,
        p.published_at
      );
    }
  }

  // 3. Seed documents
  const docCount = db.prepare("SELECT COUNT(*) as c FROM documents").get() as {
    c: number;
  };
  if (docCount.c === 0) {
    const stmt = db.prepare(`
      INSERT INTO documents (
        category, year, title_id, title_en, description_id, description_en,
        file_url, file_size, published
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1)
    `);
    for (const d of SEED_DOCUMENTS) {
      stmt.run(
        d.category,
        d.year ?? null,
        d.title_id,
        d.title_en,
        d.description_id,
        d.description_en,
        d.file_url,
        d.file_size
      );
    }
  }

  // 4. Seed WPPE staff
  const wppeCount = db
    .prepare("SELECT COUNT(*) as c FROM wppe_staff")
    .get() as { c: number };
  if (wppeCount.c === 0) {
    const stmt = db.prepare(`
      INSERT INTO wppe_staff (
        name, license_type, license_number, position_id, position_en, active, sort_order
      ) VALUES (?, ?, ?, ?, ?, 1, ?)
    `);
    SEED_WPPE_STAFF.forEach((s, idx) => {
      stmt.run(
        s.name,
        s.license_type,
        s.license_number,
        s.position_id,
        s.position_en,
        idx + 1
      );
    });
  }

  // 5. Seed notices
  const noticeCount = db.prepare("SELECT COUNT(*) as c FROM notices").get() as {
    c: number;
  };
  if (noticeCount.c === 0) {
    const stmt = db.prepare(`
      INSERT INTO notices (
        type, title_id, title_en, body_id, body_en,
        cta_label_id, cta_label_en, cta_url, show_as_modal, active
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 1)
    `);
    for (const n of SEED_NOTICES) {
      stmt.run(
        n.type,
        n.title_id,
        n.title_en,
        n.body_id,
        n.body_en,
        n.cta_label_id ?? null,
        n.cta_label_en ?? null,
        n.cta_url ?? null,
        n.show_as_modal ? 1 : 0
      );
    }
  }
}

export function logAdminAction(
  adminEmail: string,
  action: string,
  target: string,
  ipAddress: string
) {
  const db = getDb();
  db.prepare(
    `INSERT INTO audit_logs (admin_email, action, target, ip_address) VALUES (?, ?, ?, ?)`
  ).run(adminEmail, action, target, ipAddress);
}

// VA-03: Persistent SQLite sliding-window rate limiter (survives process restarts)
export function checkPersistentRateLimit(
  key: string,
  maxRequests: number,
  windowMs: number
): { allowed: boolean; remaining: number; retryAfterSec: number } {
  const db = getDb();
  const now = Date.now();
  const cutoff = now - windowMs;

  db.prepare(`DELETE FROM rate_limits WHERE rate_key = ? AND created_at <= ?`).run(
    key,
    cutoff
  );

  const rows = db
    .prepare(
      `SELECT created_at FROM rate_limits WHERE rate_key = ? ORDER BY created_at ASC`
    )
    .all(key) as Array<{ created_at: number }>;

  if (rows.length >= maxRequests) {
    const oldest = rows[0].created_at;
    const retryAfterSec = Math.max(1, Math.ceil((oldest + windowMs - now) / 1000));
    return { allowed: false, remaining: 0, retryAfterSec };
  }

  db.prepare(`INSERT INTO rate_limits (rate_key, created_at) VALUES (?, ?)`).run(
    key,
    now
  );

  return {
    allowed: true,
    remaining: Math.max(0, maxRequests - rows.length - 1),
    retryAfterSec: 0,
  };
}

export function clearPersistentRateLimit(key: string): void {
  const db = getDb();
  db.prepare(`DELETE FROM rate_limits WHERE rate_key = ?`).run(key);
}

// VA-01: One-time CAPTCHA nonce consumption
export function consumeCaptchaNonce(nonce: string, expiresAtMs: number): boolean {
  const db = getDb();
  const now = Date.now();
  db.prepare(`DELETE FROM used_captcha_nonces WHERE expires_at <= ?`).run(now);
  try {
    db.prepare(
      `INSERT INTO used_captcha_nonces (nonce, expires_at) VALUES (?, ?)`
    ).run(nonce, expiresAtMs);
    return true;
  } catch {
    return false;
  }
}
