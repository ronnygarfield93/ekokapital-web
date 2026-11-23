import crypto from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { checkPersistentRateLimit } from "@/lib/db";
import { RATE_LIMITS } from "@/lib/rate-limit-config";
import { getClientIp, hmacSign } from "@/lib/security";

const CAPTCHA_TTL_MS = 5 * 60 * 1000; // 5 minutes

export async function GET(req: NextRequest) {
  const ip = getClientIp(req);
  const limit = checkPersistentRateLimit(
    `captcha:${ip}`,
    RATE_LIMITS.captcha.maxRequests,
    RATE_LIMITS.captcha.windowMs
  );

  if (!limit.allowed) {
    return NextResponse.json(
      {
        error: `Terlalu banyak permintaan CAPTCHA. Coba lagi dalam ${Math.ceil(
          limit.retryAfterSec / 60
        )} menit.`,
        retryAfterSec: limit.retryAfterSec,
      },
      {
        status: 429,
        headers: {
          "Retry-After": String(limit.retryAfterSec),
          "X-RateLimit-Limit": String(RATE_LIMITS.captcha.maxRequests),
          "X-RateLimit-Remaining": "0",
          "Cache-Control": "no-store, no-cache, must-revalidate, private",
        },
      }
    );
  }

  const a = crypto.randomInt(2, 13);
  const b = crypto.randomInt(2, 13);
  const nonce = crypto.randomBytes(16).toString("hex");
  const exp = Date.now() + CAPTCHA_TTL_MS;
  const sum = a + b;

  const payload = `${nonce}.${exp}.${sum}`;
  const sig = hmacSign(payload);
  const token = `${nonce}.${exp}.${sig}`;

  return NextResponse.json(
    { a, b, token, expiresInSec: Math.floor(CAPTCHA_TTL_MS / 1000) },
    {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate, private",
        "X-RateLimit-Limit": String(RATE_LIMITS.captcha.maxRequests),
        "X-RateLimit-Remaining": String(limit.remaining),
      },
    }
  );
}
