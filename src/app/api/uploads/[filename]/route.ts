import fs from "node:fs";
import path from "node:path";
import { Readable } from "node:stream";
import { NextRequest, NextResponse } from "next/server";
import { checkPersistentRateLimit } from "@/lib/db";
import { RATE_LIMITS } from "@/lib/rate-limit-config";
import { getClientIp } from "@/lib/security";
import { resolveSafeUploadPath } from "@/lib/uploads";

const MIME_MAP: Record<string, string> = {
  ".pdf": "application/pdf",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".webp": "image/webp",
  ".zip": "application/zip",
  ".exe": "application/vnd.microsoft.portable-executable",
  ".msi": "application/x-msi",
  ".dmg": "application/x-apple-diskimage",
  ".pkg": "application/octet-stream",
};

const INLINE_IMAGE_EXTS = new Set([".png", ".jpg", ".webp"]);

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ filename: string }> }
) {
  const { filename } = await context.params;
  const fullPath = resolveSafeUploadPath(filename);
  if (!fullPath) {
    return NextResponse.json({ error: "File not found" }, { status: 404 });
  }

  const ext = path.extname(fullPath).toLowerCase();
  const isInlineImage =
    INLINE_IMAGE_EXTS.has(ext) && req.nextUrl.searchParams.get("download") !== "1";

  const ip = getClientIp(req);
  const policy = isInlineImage ? RATE_LIMITS.media : RATE_LIMITS.download;
  const rateKey = isInlineImage ? `media:${ip}` : `download:${ip}`;
  const limit = checkPersistentRateLimit(rateKey, policy.maxRequests, policy.windowMs);

  if (!limit.allowed) {
    const waitMinutes = Math.ceil(limit.retryAfterSec / 60);
    const errorMsg = isInlineImage
      ? `Terlalu banyak permintaan media. Coba lagi dalam ${waitMinutes} menit.`
      : `Batas unduhan tercapai (maksimal ${RATE_LIMITS.download.maxRequests} kali per ${Math.round(
          RATE_LIMITS.download.windowMs / 60000
        )} menit). Silakan coba lagi dalam ${waitMinutes} menit.`;

    const rateHeaders = {
      "Retry-After": String(limit.retryAfterSec),
      "X-RateLimit-Limit": String(policy.maxRequests),
      "X-RateLimit-Remaining": "0",
      "Cache-Control": "no-store, no-cache, must-revalidate, private",
    };

    const accept = req.headers.get("accept") || "";
    if (!isInlineImage && accept.includes("text/html")) {
      const html = `<!doctype html>
<html lang="id">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>Batas Unduhan Tercapai — PT Ekokapital Sekuritas</title>
  <style>
    body{font-family:system-ui,-apple-system,sans-serif;background:#f1f5fb;color:#0f172a;display:flex;min-height:100vh;align-items:center;justify-content:center;margin:0;padding:16px}
    .card{max-width:460px;background:#fff;border:1px solid #cbd5e1;border-radius:16px;padding:28px;box-shadow:0 12px 30px rgba(15,23,42,.08);text-align:center}
    h1{font-size:18px;margin:0 0 10px;color:#122952}
    p{font-size:14px;line-height:1.6;color:#475569;margin:0 0 20px}
    a{display:inline-block;background:#122952;color:#fff;text-decoration:none;padding:10px 18px;border-radius:10px;font-size:13px;font-weight:600}
  </style>
</head>
<body>
  <div class="card">
    <h1>Batas Unduhan Tercapai (429)</h1>
    <p>${errorMsg}</p>
    <a href="javascript:history.back()">Kembali</a>
  </div>
</body>
</html>`;
      return new NextResponse(html, {
        status: 429,
        headers: {
          ...rateHeaders,
          "Content-Type": "text/html; charset=utf-8",
        },
      });
    }

    return NextResponse.json(
      { error: errorMsg, retryAfterSec: limit.retryAfterSec },
      { status: 429, headers: rateHeaders }
    );
  }

  const contentType = MIME_MAP[ext] || "application/octet-stream";
  const stat = fs.statSync(fullPath);
  const webStream = Readable.toWeb(fs.createReadStream(fullPath)) as ReadableStream;

  // VA-07: Stream files with strict sandbox CSP & safe attachment disposition for downloads
  return new NextResponse(webStream, {
    status: 200,
    headers: {
      "Content-Type": contentType,
      "Content-Length": String(stat.size),
      "X-Content-Type-Options": "nosniff",
      "Content-Security-Policy": "default-src 'none'; sandbox",
      "Content-Disposition": isInlineImage
        ? `inline; filename="${filename}"`
        : `attachment; filename="${filename}"`,
      "Cache-Control": isInlineImage ? "public, max-age=86400" : "private, no-cache",
      "X-RateLimit-Limit": String(policy.maxRequests),
      "X-RateLimit-Remaining": String(limit.remaining),
    },
  });
}
