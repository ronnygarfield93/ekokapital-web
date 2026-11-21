import fs from "node:fs";
import path from "node:path";
import { NextRequest, NextResponse } from "next/server";
import { resolveSafeUploadPath } from "@/lib/uploads";

const MIME_MAP: Record<string, string> = {
  ".pdf": "application/pdf",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".webp": "image/webp",
};

export async function GET(
  _req: NextRequest,
  context: { params: Promise<{ filename: string }> }
) {
  const { filename } = await context.params;
  const fullPath = resolveSafeUploadPath(filename);
  if (!fullPath) {
    return NextResponse.json({ error: "File not found" }, { status: 404 });
  }

  const ext = path.extname(fullPath).toLowerCase();
  const contentType = MIME_MAP[ext] || "application/octet-stream";
  const buffer = fs.readFileSync(fullPath);

  // VA-07: Isolate uploaded files with strict sandbox CSP & safe attachment disposition for PDFs
  return new NextResponse(buffer, {
    status: 200,
    headers: {
      "Content-Type": contentType,
      "X-Content-Type-Options": "nosniff",
      "Content-Security-Policy": "default-src 'none'; sandbox",
      "Content-Disposition":
        ext === ".pdf"
          ? `attachment; filename="${filename}"`
          : `inline; filename="${filename}"`,
      "Cache-Control": "public, max-age=86400",
    },
  });
}
