import fs from "node:fs";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getCurrentAdmin, isPasswordChangeRequired } from "@/lib/auth";
import { getDb, logAdminAction } from "@/lib/db";
import { getClientIp, isSafeUrl, verifySameOrigin } from "@/lib/security";
import { resolveSafeUploadPath, saveSecureUpload } from "@/lib/uploads";

const categoryEnum = z.enum([
  "financial_report",
  "rups",
  "gcg",
  "form",
  "etop_manual",
  "etop_desktop",
]);

function deleteLocalUploadIfExists(fileUrl: string | null | undefined): void {
  if (!fileUrl || !fileUrl.startsWith("/api/uploads/")) return;
  const filename = fileUrl.slice("/api/uploads/".length);
  const fullPath = resolveSafeUploadPath(filename);
  if (!fullPath) return;
  try {
    fs.unlinkSync(fullPath);
  } catch {
    // Ignore if already removed
  }
}

function formatUploadedFileSize(sizeBytes: number, ext: string): string {
  const label = ext.replace(/^\./, "").toUpperCase() || "FILE";
  const kb = Math.round(sizeBytes / 1024);
  return kb >= 1024 ? `${(kb / 1024).toFixed(1)} MB ${label}` : `${kb} KB ${label}`;
}

export async function GET() {
  const admin = await getCurrentAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const db = getDb();
  const documents = db
    .prepare("SELECT * FROM documents ORDER BY category ASC, year DESC, id DESC")
    .all();
  return NextResponse.json({ documents });
}

export async function POST(req: NextRequest) {
  if (!verifySameOrigin(req)) {
    return NextResponse.json({ error: "Forbidden origin" }, { status: 403 });
  }
  const admin = await getCurrentAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (isPasswordChangeRequired(admin)) {
    return NextResponse.json(
      { error: "Wajib mengganti kata sandi awal di tab Keamanan & Audit Log terlebih dahulu." },
      { status: 403 }
    );
  }

  const contentType = req.headers.get("content-type") || "";
  let category: string;
  let year: number | null = null;
  let titleId: string;
  let titleEn: string;
  let descId = "";
  let descEn = "";
  let fileUrl = "";
  let fileSize = "PDF";

  try {
    if (contentType.includes("multipart/form-data")) {
      const form = await req.formData();
      category = String(form.get("category") || "");
      const yearStr = String(form.get("year") || "").trim();
      year = yearStr ? Number(yearStr) : null;
      titleId = String(form.get("title_id") || "").trim();
      titleEn = String(form.get("title_en") || "").trim();
      descId = String(form.get("description_id") || "").trim();
      descEn = String(form.get("description_en") || "").trim();
      const externalUrl = String(form.get("file_url") || "").trim();
      const file = form.get("file");

      if (file instanceof File && file.size > 0) {
        const uploadKind = category === "etop_desktop" ? "installer" : "pdf";
        const uploaded = await saveSecureUpload(file, uploadKind);
        fileUrl = uploaded.url;
        fileSize = formatUploadedFileSize(uploaded.sizeBytes, uploaded.ext);
      } else if (externalUrl) {
        if (!isSafeUrl(externalUrl)) {
          return NextResponse.json(
            { error: "URL dokumen harus menggunakan HTTPS." },
            { status: 400 }
          );
        }
        fileUrl = externalUrl;
        fileSize = category === "etop_desktop" ? "Installer" : "PDF";
      } else {
        return NextResponse.json(
          {
            error:
              category === "etop_desktop"
                ? "Unggah file installer (.exe/.msi/.zip/.dmg/.pkg) atau masukkan URL HTTPS."
                : "Unggah file PDF atau masukkan URL HTTPS dokumen.",
          },
          { status: 400 }
        );
      }
    } else {
      const raw = await req.json().catch(() => null);
      category = String(raw?.category || "");
      year = raw?.year ? Number(raw.year) : null;
      titleId = String(raw?.title_id || "").trim();
      titleEn = String(raw?.title_en || "").trim();
      descId = String(raw?.description_id || "").trim();
      descEn = String(raw?.description_en || "").trim();
      fileUrl = String(raw?.file_url || "").trim();
      if (!isSafeUrl(fileUrl)) {
        return NextResponse.json(
          { error: "URL dokumen harus menggunakan HTTPS." },
          { status: 400 }
        );
      }
    }
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Gagal memproses file PDF." },
      { status: 400 }
    );
  }

  const parsedCat = categoryEnum.safeParse(category);
  if (!parsedCat.success || titleId.length < 3 || titleEn.length < 3) {
    return NextResponse.json(
      { error: "Kategori dan judul dokumen (ID & EN) wajib diisi." },
      { status: 400 }
    );
  }

  if (year !== null && (!Number.isInteger(year) || year < 2000 || year > 2100)) {
    return NextResponse.json({ error: "Tahun tidak valid." }, { status: 400 });
  }

  const db = getDb();
  const res = db
    .prepare(
      `INSERT INTO documents (
        category, year, title_id, title_en, description_id, description_en,
        file_url, file_size, published
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1)`
    )
    .run(
      parsedCat.data,
      year,
      titleId,
      titleEn,
      descId,
      descEn,
      fileUrl,
      fileSize
    );

  logAdminAction(admin.email, "CREATE_DOCUMENT", `${parsedCat.data}:${titleId}`, getClientIp(req));
  return NextResponse.json({ ok: true, id: Number(res.lastInsertRowid), file_url: fileUrl }, { status: 201 });
}

export async function PUT(req: NextRequest) {
  if (!verifySameOrigin(req)) {
    return NextResponse.json({ error: "Forbidden origin" }, { status: 403 });
  }
  const admin = await getCurrentAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (isPasswordChangeRequired(admin)) {
    return NextResponse.json(
      { error: "Wajib mengganti kata sandi awal di tab Keamanan & Audit Log terlebih dahulu." },
      { status: 403 }
    );
  }

  const contentType = req.headers.get("content-type") || "";
  let id = 0;
  let category = "";
  let year: number | null = null;
  let titleId = "";
  let titleEn = "";
  let descId = "";
  let descEn = "";
  let incomingUrl = "";
  let uploadedFile: File | null = null;

  try {
    if (contentType.includes("multipart/form-data")) {
      const form = await req.formData();
      id = Number(form.get("id"));
      category = String(form.get("category") || "");
      const yearStr = String(form.get("year") || "").trim();
      year = yearStr ? Number(yearStr) : null;
      titleId = String(form.get("title_id") || "").trim();
      titleEn = String(form.get("title_en") || "").trim();
      descId = String(form.get("description_id") || "").trim();
      descEn = String(form.get("description_en") || "").trim();
      incomingUrl = String(form.get("file_url") || "").trim();
      const file = form.get("file");
      if (file instanceof File && file.size > 0) {
        uploadedFile = file;
      }
    } else {
      const raw = await req.json().catch(() => null);
      id = Number(raw?.id);
      category = String(raw?.category || "");
      year = raw?.year ? Number(raw.year) : null;
      titleId = String(raw?.title_id || "").trim();
      titleEn = String(raw?.title_en || "").trim();
      descId = String(raw?.description_id || "").trim();
      descEn = String(raw?.description_en || "").trim();
      incomingUrl = String(raw?.file_url || "").trim();
    }
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Gagal memproses pembaruan dokumen." },
      { status: 400 }
    );
  }

  if (!Number.isInteger(id) || id <= 0) {
    return NextResponse.json({ error: "ID dokumen tidak valid." }, { status: 400 });
  }

  const parsedCat = categoryEnum.safeParse(category);
  if (!parsedCat.success || titleId.length < 3 || titleEn.length < 3) {
    return NextResponse.json(
      { error: "Kategori dan judul dokumen (ID & EN) wajib diisi (minimal 3 karakter)." },
      { status: 400 }
    );
  }

  if (year !== null && (!Number.isInteger(year) || year < 2000 || year > 2100)) {
    return NextResponse.json({ error: "Tahun tidak valid." }, { status: 400 });
  }

  const db = getDb();
  const existing = db
    .prepare("SELECT id, file_url, file_size FROM documents WHERE id = ?")
    .get(id) as { id: number; file_url: string; file_size: string } | undefined;

  if (!existing) {
    return NextResponse.json({ error: "Dokumen tidak ditemukan." }, { status: 404 });
  }

  let nextFileUrl = existing.file_url;
  let nextFileSize = existing.file_size;
  let shouldDeleteOldLocal = false;

  try {
    if (uploadedFile) {
      const uploadKind = parsedCat.data === "etop_desktop" ? "installer" : "pdf";
      const uploaded = await saveSecureUpload(uploadedFile, uploadKind);
      nextFileUrl = uploaded.url;
      nextFileSize = formatUploadedFileSize(uploaded.sizeBytes, uploaded.ext);
      shouldDeleteOldLocal = existing.file_url !== nextFileUrl;
    } else if (incomingUrl && incomingUrl !== existing.file_url) {
      if (!isSafeUrl(incomingUrl)) {
        return NextResponse.json(
          { error: "URL dokumen harus menggunakan HTTPS atau path lokal yang aman." },
          { status: 400 }
        );
      }
      nextFileUrl = incomingUrl;
      nextFileSize = incomingUrl.startsWith("/api/uploads/")
        ? existing.file_size
        : parsedCat.data === "etop_desktop"
          ? "Installer"
          : "PDF";
      shouldDeleteOldLocal = true;
    }
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Gagal memproses file baru." },
      { status: 400 }
    );
  }

  db.prepare(
    `UPDATE documents
     SET category = ?, year = ?, title_id = ?, title_en = ?,
         description_id = ?, description_en = ?, file_url = ?, file_size = ?
     WHERE id = ?`
  ).run(
    parsedCat.data,
    year,
    titleId,
    titleEn,
    descId,
    descEn,
    nextFileUrl,
    nextFileSize,
    id
  );

  if (shouldDeleteOldLocal) {
    deleteLocalUploadIfExists(existing.file_url);
  }

  logAdminAction(
    admin.email,
    "UPDATE_DOCUMENT",
    `doc:${id} (${parsedCat.data}${uploadedFile ? ", pdf_replaced" : ""})`,
    getClientIp(req)
  );
  return NextResponse.json({
    ok: true,
    id,
    file_url: nextFileUrl,
    file_size: nextFileSize,
  });
}

export async function DELETE(req: NextRequest) {
  if (!verifySameOrigin(req)) {
    return NextResponse.json({ error: "Forbidden origin" }, { status: 403 });
  }
  const admin = await getCurrentAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (isPasswordChangeRequired(admin)) {
    return NextResponse.json(
      { error: "Wajib mengganti kata sandi awal di tab Keamanan & Audit Log terlebih dahulu." },
      { status: 403 }
    );
  }

  const id = Number(req.nextUrl.searchParams.get("id"));
  if (!Number.isInteger(id) || id <= 0) {
    return NextResponse.json({ error: "ID tidak valid." }, { status: 400 });
  }

  const db = getDb();
  const existing = db
    .prepare("SELECT file_url FROM documents WHERE id = ?")
    .get(id) as { file_url: string } | undefined;

  db.prepare("DELETE FROM documents WHERE id = ?").run(id);
  deleteLocalUploadIfExists(existing?.file_url);
  logAdminAction(admin.email, "DELETE_DOCUMENT", `doc:${id}`, getClientIp(req));
  return NextResponse.json({ ok: true });
}
