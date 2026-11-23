import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createAdminSession } from "@/lib/auth";
import {
  checkPersistentRateLimit,
  clearPersistentRateLimit,
} from "@/lib/db";
import { RATE_LIMITS } from "@/lib/rate-limit-config";
import { getClientIp, sha256, verifySameOrigin } from "@/lib/security";

const loginSchema = z.object({
  email: z.string().trim().email(),
  password: z.string().min(6).max(128),
});

export async function POST(req: NextRequest) {
  if (!verifySameOrigin(req)) {
    return NextResponse.json({ error: "Invalid origin." }, { status: 403 });
  }

  const ip = getClientIp(req);
  const ipKey = `login_ip:${ip}`;
  const ipLimit = checkPersistentRateLimit(
    ipKey,
    RATE_LIMITS.adminLoginIp.maxRequests,
    RATE_LIMITS.adminLoginIp.windowMs
  );
  if (!ipLimit.allowed) {
    return NextResponse.json(
      {
        error: `Terlalu banyak percobaan login dari jaringan ini. Coba lagi dalam ${Math.ceil(
          ipLimit.retryAfterSec / 60
        )} menit.`,
        retryAfterSec: ipLimit.retryAfterSec,
      },
      {
        status: 429,
        headers: {
          "Retry-After": String(ipLimit.retryAfterSec),
          "X-RateLimit-Limit": String(RATE_LIMITS.adminLoginIp.maxRequests),
          "X-RateLimit-Remaining": "0",
        },
      }
    );
  }

  const raw = await req.json().catch(() => null);
  const parsed = loginSchema.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Masukkan email dan kata sandi yang valid." },
      { status: 400 }
    );
  }

  // VA-03: Per-account lockout (3 failed attempts per 5 minutes)
  const acctKey = `login_acct:${sha256(parsed.data.email.toLowerCase())}`;
  const acctLimit = checkPersistentRateLimit(
    acctKey,
    RATE_LIMITS.adminLoginAccount.maxRequests,
    RATE_LIMITS.adminLoginAccount.windowMs
  );
  if (!acctLimit.allowed) {
    return NextResponse.json(
      {
        error: `Akun dikunci sementara karena ${RATE_LIMITS.adminLoginAccount.maxRequests} kali percobaan gagal. Coba lagi dalam ${Math.ceil(
          acctLimit.retryAfterSec / 60
        )} menit.`,
        retryAfterSec: acctLimit.retryAfterSec,
      },
      {
        status: 429,
        headers: {
          "Retry-After": String(acctLimit.retryAfterSec),
          "X-RateLimit-Limit": String(RATE_LIMITS.adminLoginAccount.maxRequests),
          "X-RateLimit-Remaining": "0",
        },
      }
    );
  }

  const ua = req.headers.get("user-agent") || "";
  const result = await createAdminSession(
    parsed.data.email,
    parsed.data.password,
    ip,
    ua
  );

  if (!result.ok) {
    const remainingNote =
      acctLimit.remaining > 0
        ? ` Sisa ${acctLimit.remaining} percobaan sebelum dikunci 5 menit.`
        : " Batas 3 kali percobaan tercapai, akun dikunci sementara selama 5 menit.";
    return NextResponse.json(
      { error: `${result.error}${remainingNote}` },
      {
        status: 401,
        headers: {
          "X-RateLimit-Limit": String(RATE_LIMITS.adminLoginAccount.maxRequests),
          "X-RateLimit-Remaining": String(acctLimit.remaining),
        },
      }
    );
  }

  clearPersistentRateLimit(acctKey);
  clearPersistentRateLimit(ipKey);
  return NextResponse.json({ ok: true, user: result.user });
}
