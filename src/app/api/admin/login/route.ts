import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createAdminSession } from "@/lib/auth";
import {
  checkPersistentRateLimit,
  clearPersistentRateLimit,
} from "@/lib/db";
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
  const ipLimit = checkPersistentRateLimit(`login_ip:${ip}`, 10, 15 * 60 * 1000);
  if (!ipLimit.allowed) {
    return NextResponse.json(
      {
        error: `Terlalu banyak percobaan login dari jaringan ini. Coba lagi dalam ${Math.ceil(
          ipLimit.retryAfterSec / 60
        )} menit.`,
      },
      { status: 429 }
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

  // VA-03: Secondary per-account lockout to mitigate distributed brute force
  const acctKey = `login_acct:${sha256(parsed.data.email.toLowerCase())}`;
  const acctLimit = checkPersistentRateLimit(acctKey, 5, 15 * 60 * 1000);
  if (!acctLimit.allowed) {
    return NextResponse.json(
      {
        error: `Akun dikunci sementara karena terlalu banyak percobaan gagal. Coba lagi dalam ${Math.ceil(
          acctLimit.retryAfterSec / 60
        )} menit.`,
      },
      { status: 429 }
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
    return NextResponse.json({ error: result.error }, { status: 401 });
  }

  clearPersistentRateLimit(acctKey);
  return NextResponse.json({ ok: true, user: result.user });
}
