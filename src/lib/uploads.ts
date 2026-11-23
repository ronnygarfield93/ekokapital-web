import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { verifyFileMagicBytes } from "./security";

const MAX_PDF_BYTES = 20 * 1024 * 1024; // 20 MB
const MAX_IMAGE_BYTES = 5 * 1024 * 1024; // 5 MB
const MAX_INSTALLER_BYTES = 150 * 1024 * 1024; // 150 MB

export function getUploadsDir(): string {
  const configured = process.env.UPLOADS_DIR || "./uploads";
  const resolved = path.isAbsolute(configured)
    ? configured
    : path.join(/*turbopackIgnore: true*/ process.cwd(), configured);
  if (!fs.existsSync(resolved)) {
    fs.mkdirSync(resolved, { recursive: true });
  }
  return resolved;
}

export async function saveSecureUpload(
  file: File,
  kind: "pdf" | "image" | "installer"
): Promise<{ filename: string; url: string; mime: string; ext: string; sizeBytes: number }> {
  const maxBytes =
    kind === "pdf"
      ? MAX_PDF_BYTES
      : kind === "installer"
        ? MAX_INSTALLER_BYTES
        : MAX_IMAGE_BYTES;
  if (file.size <= 0 || file.size > maxBytes) {
    throw new Error(
      kind === "pdf"
        ? "Ukuran file PDF harus antara 1 byte hingga 20 MB."
        : kind === "installer"
          ? "Ukuran file installer harus antara 1 byte hingga 150 MB."
          : "Ukuran file gambar harus antara 1 byte hingga 5 MB."
    );
  }

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const check = verifyFileMagicBytes(buffer, kind, file.name);

  if (!check.valid) {
    throw new Error(
      kind === "pdf"
        ? "File tidak valid. Hanya dokumen PDF asli yang diizinkan."
        : kind === "installer"
          ? "File tidak valid. Hanya installer .exe, .msi, .zip, .dmg, atau .pkg asli yang diizinkan."
          : "File tidak valid. Hanya gambar PNG, JPG, atau WebP asli yang diizinkan."
    );
  }

  const safeName = `${Date.now()}-${crypto.randomUUID()}${check.ext}`;
  const fullPath = path.join(getUploadsDir(), safeName);
  fs.writeFileSync(fullPath, buffer);

  return {
    filename: safeName,
    url: `/api/uploads/${safeName}`,
    mime: check.mime,
    ext: check.ext,
    sizeBytes: buffer.length,
  };
}

export function resolveSafeUploadPath(filename: string): string | null {
  // Strict allowlist: digits, letters, hyphens, single extension
  if (!/^[a-zA-Z0-9-]+\.(pdf|png|jpg|webp|zip|exe|msi|dmg|pkg)$/.test(filename)) {
    return null;
  }
  const baseDir = getUploadsDir();
  const target = path.resolve(baseDir, filename);
  if (!target.startsWith(path.resolve(baseDir) + path.sep)) {
    return null;
  }
  if (!fs.existsSync(target)) {
    return null;
  }
  return target;
}
