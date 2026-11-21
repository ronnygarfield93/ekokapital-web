import crypto from "node:crypto";
import { NextResponse } from "next/server";
import { hmacSign } from "@/lib/security";

const CAPTCHA_TTL_MS = 5 * 60 * 1000; // 5 minutes

export async function GET() {
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
      },
    }
  );
}
