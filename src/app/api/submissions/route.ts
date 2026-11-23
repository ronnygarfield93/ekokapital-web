import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import {
  checkPersistentRateLimit,
  consumeCaptchaNonce,
  getDb,
} from "@/lib/db";
import { RATE_LIMITS } from "@/lib/rate-limit-config";
import { sendInternalSubmissionAlert } from "@/lib/mailer";
import {
  generateTicketCode,
  getClientIp,
  hmacVerify,
  sha256,
  verifySameOrigin,
} from "@/lib/security";

const submissionSchema = z.object({
  type: z.enum(["contact", "complaint", "whistleblowing"]),
  is_anonymous: z.boolean().optional().default(false),
  full_name: z.string().trim().max(120).optional().default(""),
  email: z.string().trim().email().max(160).optional().or(z.literal("")),
  phone: z.string().trim().max(40).optional().default(""),
  client_code: z.string().trim().max(40).optional().default(""),
  subject: z.string().trim().min(4).max(200),
  message: z.string().trim().min(15).max(5000),
  website: z.string().max(100).optional().default(""), // Honeypot field
  captcha_token: z.string().min(40).max(200),
  captcha_answer: z.number().int().min(0).max(100),
});

export async function POST(req: NextRequest) {
  if (!verifySameOrigin(req)) {
    return NextResponse.json({ error: "Invalid request origin." }, { status: 403 });
  }

  const ip = getClientIp(req);
  const limit = checkPersistentRateLimit(
    `submit:${ip}`,
    RATE_LIMITS.submissions.maxRequests,
    RATE_LIMITS.submissions.windowMs
  );
  if (!limit.allowed) {
    return NextResponse.json(
      {
        error: `Terlalu banyak pengiriman. Silakan coba lagi dalam ${limit.retryAfterSec} detik.`,
        retryAfterSec: limit.retryAfterSec,
      },
      {
        status: 429,
        headers: {
          "Retry-After": String(limit.retryAfterSec),
          "X-RateLimit-Limit": String(RATE_LIMITS.submissions.maxRequests),
          "X-RateLimit-Remaining": "0",
        },
      }
    );
  }

  const raw = await req.json().catch(() => null);
  const parsed = submissionSchema.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json(
      {
        error: "Data formulir belum lengkap atau format tidak valid.",
        details: parsed.error.flatten().fieldErrors,
      },
      { status: 400 }
    );
  }

  const data = parsed.data;

  // Honeypot trap
  if (data.website && data.website.trim().length > 0) {
    return NextResponse.json({ ok: true, ticket_code: "VERIFIED" }, { status: 201 });
  }

  // VA-01: Verify server-signed HMAC CAPTCHA token + expiry + one-time nonce
  const tokenParts = data.captcha_token.split(".");
  if (tokenParts.length !== 3) {
    return NextResponse.json(
      { error: "Token verifikasi tidak valid. Muat ulang soal verifikasi." },
      { status: 400 }
    );
  }
  const [nonce, expStr, sig] = tokenParts;
  const expMs = Number(expStr);
  if (!/^[a-f0-9]{32}$/.test(nonce) || !Number.isFinite(expMs) || expMs < Date.now()) {
    return NextResponse.json(
      { error: "Soal verifikasi telah kedaluwarsa. Silakan coba soal baru." },
      { status: 400 }
    );
  }

  const signedPayload = `${nonce}.${expStr}.${data.captcha_answer}`;
  if (!hmacVerify(signedPayload, sig)) {
    return NextResponse.json(
      { error: "Jawaban verifikasi keamanan salah. Silakan coba lagi." },
      { status: 400 }
    );
  }

  if (!consumeCaptchaNonce(nonce, expMs)) {
    return NextResponse.json(
      { error: "Token verifikasi sudah digunakan. Silakan muat ulang soal." },
      { status: 400 }
    );
  }

  // VA-08: Restrict anonymous submissions strictly to whistleblowing
  const isAnonymous = data.type === "whistleblowing" && data.is_anonymous;

  if (!isAnonymous && (!data.full_name || !data.email)) {
    return NextResponse.json(
      { error: "Nama lengkap dan alamat email wajib diisi." },
      { status: 400 }
    );
  }

  const prefix =
    data.type === "complaint"
      ? "PGD"
      : data.type === "whistleblowing"
        ? "WBS"
        : "MSG";
  const ticketCode = generateTicketCode(prefix);

  const db = getDb();
  db.prepare(
    `INSERT INTO submissions (
      ticket_code, type, is_anonymous, full_name, email, phone,
      client_code, subject, message, status, ip_hash
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'new', ?)`
  ).run(
    ticketCode,
    data.type,
    isAnonymous ? 1 : 0,
    isAnonymous ? null : data.full_name || null,
    isAnonymous ? null : data.email || null,
    isAnonymous ? null : data.phone || null,
    data.client_code || null,
    data.subject,
    data.message,
    sha256(ip)
  );

  // Send internal email alert ONLY to PT Ekokapital Sekuritas (non-fatal if SMTP unavailable)
  await sendInternalSubmissionAlert({
    ticketCode,
    type: data.type,
    isAnonymous,
    fullName: isAnonymous ? null : data.full_name || null,
    email: isAnonymous ? null : data.email || null,
    phone: isAnonymous ? null : data.phone || null,
    clientCode: data.client_code || null,
    subject: data.subject,
    message: data.message,
  });

  return NextResponse.json(
    {
      ok: true,
      ticket_code: ticketCode,
    },
    { status: 201 }
  );
}
