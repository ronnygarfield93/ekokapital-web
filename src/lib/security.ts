import crypto from "node:crypto";
import type { NextRequest } from "next/server";

const SCRYPT_KEYLEN = 64;

export function getServerSecret(): string {
  const envSecret = process.env.SESSION_SECRET?.trim();
  if (envSecret && envSecret.length >= 32) {
    return envSecret;
  }
  // Ephemeral per-process fallback in development
  const g = globalThis as unknown as { __ekEphemeralSecret?: string };
  if (!g.__ekEphemeralSecret) {
    g.__ekEphemeralSecret = crypto.randomBytes(32).toString("hex");
  }
  return g.__ekEphemeralSecret;
}

export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString("hex");
  const derived = crypto.scryptSync(password, salt, SCRYPT_KEYLEN).toString("hex");
  return `scrypt:${salt}:${derived}`;
}

export function verifyPassword(password: string, storedHash: string): boolean {
  const parts = storedHash.split(":");
  if (parts.length !== 3 || parts[0] !== "scrypt") return false;
  const [, salt, hashHex] = parts;
  const expected = Buffer.from(hashHex, "hex");
  const actual = crypto.scryptSync(password, salt, SCRYPT_KEYLEN);
  if (expected.length !== actual.length) return false;
  return crypto.timingSafeEqual(expected, actual);
}

// Precomputed valid scrypt hash used for constant-time login when email does not exist (VA-06)
export const DUMMY_PASSWORD_HASH =
  "scrypt:0123456789abcdef0123456789abcdef:" +
  crypto
    .scryptSync("dummy-constant-time-check", "0123456789abcdef0123456789abcdef", SCRYPT_KEYLEN)
    .toString("hex");

export function generateSecureToken(bytes = 32): string {
  return crypto.randomBytes(bytes).toString("hex");
}

export function sha256(input: string): string {
  return crypto.createHash("sha256").update(input).digest("hex");
}

export function hmacSign(payload: string): string {
  return crypto
    .createHmac("sha256", getServerSecret())
    .update(payload)
    .digest("hex");
}

export function hmacVerify(payload: string, signatureHex: string): boolean {
  if (!/^[a-f0-9]{64}$/i.test(signatureHex)) return false;
  const expected = Buffer.from(hmacSign(payload), "hex");
  const actual = Buffer.from(signatureHex, "hex");
  if (expected.length !== actual.length) return false;
  return crypto.timingSafeEqual(expected, actual);
}

export function generateTicketCode(prefix: "PGD" | "WBS" | "MSG"): string {
  const year = new Date().getFullYear();
  const rand = crypto.randomBytes(3).toString("hex").toUpperCase();
  return `${prefix}-${year}-${rand}`;
}

// VA-03: Prefer X-Real-IP set by trusted reverse proxy ($remote_addr), avoiding spoofable leftmost X-Forwarded-For
export function getClientIp(req: NextRequest): string {
  const realIp = req.headers.get("x-real-ip");
  if (realIp && realIp.trim()) {
    return realIp.trim();
  }
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) {
    const parts = forwarded
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    if (parts.length > 0) {
      return parts[parts.length - 1];
    }
  }
  return "127.0.0.1";
}

// VA-02: Strict Same-Origin / CSRF guard for mutating endpoints
export function verifySameOrigin(req: NextRequest): boolean {
  const fetchSite = req.headers.get("sec-fetch-site");
  if (fetchSite && fetchSite !== "same-origin" && fetchSite !== "none") {
    return false;
  }

  const requestHost = (req.headers.get("host") || "").toLowerCase();
  if (!requestHost) return false;

  const allowedHosts = new Set<string>([requestHost]);
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    try {
      allowedHosts.add(new URL(process.env.NEXT_PUBLIC_SITE_URL).host.toLowerCase());
    } catch {
      // Ignore malformed env
    }
  }

  const origin = req.headers.get("origin");
  if (origin) {
    try {
      const originHost = new URL(origin).host.toLowerCase();
      return allowedHosts.has(originHost);
    } catch {
      return false;
    }
  }

  // Fallback to Referer only if Origin is absent
  const referer = req.headers.get("referer");
  if (referer) {
    try {
      const refHost = new URL(referer).host.toLowerCase();
      return allowedHosts.has(refHost);
    } catch {
      return false;
    }
  }

  return false;
}

export function isSafeUrl(url: string): boolean {
  const trimmed = url.trim();
  if (!trimmed) return false;
  if (trimmed.startsWith("/")) {
    return !trimmed.startsWith("//");
  }
  try {
    const parsed = new URL(trimmed);
    return parsed.protocol === "https:";
  } catch {
    return false;
  }
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 96);
}

export function verifyFileMagicBytes(
  buffer: Buffer,
  expectedKind: "pdf" | "image" | "installer",
  originalName = ""
): { valid: boolean; ext: string; mime: string } {
  if (expectedKind === "pdf") {
    if (
      buffer.length >= 5 &&
      buffer[0] === 0x25 &&
      buffer[1] === 0x50 &&
      buffer[2] === 0x44 &&
      buffer[3] === 0x46 &&
      buffer[4] === 0x2d
    ) {
      return { valid: true, ext: ".pdf", mime: "application/pdf" };
    }
    return { valid: false, ext: "", mime: "" };
  }

  if (expectedKind === "installer") {
    // ZIP archive (PK\x03\x04 or PK\x05\x06)
    if (
      buffer.length >= 4 &&
      buffer[0] === 0x50 &&
      buffer[1] === 0x4b &&
      (buffer[2] === 0x03 || buffer[2] === 0x05) &&
      (buffer[3] === 0x04 || buffer[3] === 0x06)
    ) {
      return { valid: true, ext: ".zip", mime: "application/zip" };
    }

    // Windows PE executable (.exe -> MZ)
    if (buffer.length >= 2 && buffer[0] === 0x4d && buffer[1] === 0x5a) {
      return {
        valid: true,
        ext: ".exe",
        mime: "application/vnd.microsoft.portable-executable",
      };
    }

    // Windows Installer (.msi -> OLE2 Compound File)
    if (
      buffer.length >= 8 &&
      buffer[0] === 0xd0 &&
      buffer[1] === 0xcf &&
      buffer[2] === 0x11 &&
      buffer[3] === 0xe0 &&
      buffer[4] === 0xa1 &&
      buffer[5] === 0xb1 &&
      buffer[6] === 0x1a &&
      buffer[7] === 0xe1
    ) {
      return { valid: true, ext: ".msi", mime: "application/x-msi" };
    }

    // macOS Installer package (.pkg -> xar!)
    if (
      buffer.length >= 4 &&
      buffer[0] === 0x78 &&
      buffer[1] === 0x61 &&
      buffer[2] === 0x72 &&
      buffer[3] === 0x21
    ) {
      return { valid: true, ext: ".pkg", mime: "application/octet-stream" };
    }

    // macOS Disk Image (.dmg -> Apple UDIF koly trailer at EOF-512, or zlib/bzip2 with .dmg extension)
    const isUdifDmg =
      buffer.length >= 512 &&
      buffer.subarray(buffer.length - 512, buffer.length - 508).toString("ascii") === "koly";
    const isCompressedDmg =
      originalName.toLowerCase().endsWith(".dmg") &&
      buffer.length >= 4 &&
      ((buffer[0] === 0x78 && (buffer[1] === 0x01 || buffer[1] === 0x9c || buffer[1] === 0xda)) ||
        (buffer[0] === 0x42 && buffer[1] === 0x5a && buffer[2] === 0x68));
    if (isUdifDmg || isCompressedDmg) {
      return { valid: true, ext: ".dmg", mime: "application/x-apple-diskimage" };
    }

    return { valid: false, ext: "", mime: "" };
  }

  if (
    buffer.length >= 8 &&
    buffer[0] === 0x89 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x4e &&
    buffer[3] === 0x47
  ) {
    return { valid: true, ext: ".png", mime: "image/png" };
  }

  if (
    buffer.length >= 3 &&
    buffer[0] === 0xff &&
    buffer[1] === 0xd8 &&
    buffer[2] === 0xff
  ) {
    return { valid: true, ext: ".jpg", mime: "image/jpeg" };
  }

  if (
    buffer.length >= 12 &&
    buffer.subarray(0, 4).toString("ascii") === "RIFF" &&
    buffer.subarray(8, 12).toString("ascii") === "WEBP"
  ) {
    return { valid: true, ext: ".webp", mime: "image/webp" };
  }

  return { valid: false, ext: "", mime: "" };
}
