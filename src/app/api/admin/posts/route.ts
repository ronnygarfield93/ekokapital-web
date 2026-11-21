import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getCurrentAdmin, isPasswordChangeRequired } from "@/lib/auth";
import { getDb, logAdminAction } from "@/lib/db";
import { getClientIp, isSafeUrl, slugify, verifySameOrigin } from "@/lib/security";

const postSchema = z.object({
  id: z.number().int().optional(),
  slug: z.string().trim().max(120).optional(),
  category: z.enum(["news", "education", "announcement", "research"]),
  title_id: z.string().trim().min(3).max(240),
  title_en: z.string().trim().min(3).max(240),
  excerpt_id: z.string().trim().max(600).default(""),
  excerpt_en: z.string().trim().max(600).default(""),
  content_id: z.string().trim().min(10).max(20000),
  content_en: z.string().trim().min(10).max(20000),
  cover_image: z.string().trim().max(500).optional().nullable(),
  published: z.boolean().default(true),
  published_at: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
});

export async function GET() {
  const admin = await getCurrentAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const db = getDb();
  const posts = db
    .prepare("SELECT * FROM posts ORDER BY published_at DESC, id DESC")
    .all();
  return NextResponse.json({ posts });
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

  const raw = await req.json().catch(() => null);
  const parsed = postSchema.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Data artikel tidak valid.", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const d = parsed.data;
  if (d.cover_image && !isSafeUrl(d.cover_image)) {
    return NextResponse.json(
      { error: "URL cover harus menggunakan HTTPS atau path lokal yang aman." },
      { status: 400 }
    );
  }

  const baseSlug = slugify(d.slug || d.title_id) || `post-${Date.now()}`;
  const db = getDb();
  const exists = db
    .prepare("SELECT id FROM posts WHERE slug = ?")
    .get(baseSlug) as { id: number } | undefined;
  const finalSlug = exists ? `${baseSlug}-${Date.now().toString().slice(-4)}` : baseSlug;

  const result = db
    .prepare(
      `INSERT INTO posts (
        slug, category, title_id, title_en, excerpt_id, excerpt_en,
        content_id, content_en, cover_image, published, published_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    )
    .run(
      finalSlug,
      d.category,
      d.title_id,
      d.title_en,
      d.excerpt_id,
      d.excerpt_en,
      d.content_id,
      d.content_en,
      d.cover_image || null,
      d.published ? 1 : 0,
      d.published_at
    );

  logAdminAction(admin.email, "CREATE_POST", finalSlug, getClientIp(req));
  return NextResponse.json({ ok: true, id: Number(result.lastInsertRowid), slug: finalSlug }, { status: 201 });
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

  const raw = await req.json().catch(() => null);
  const parsed = postSchema.extend({ id: z.number().int().positive() }).safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json({ error: "Data pembaruan artikel tidak valid." }, { status: 400 });
  }

  const d = parsed.data;
  if (d.cover_image && !isSafeUrl(d.cover_image)) {
    return NextResponse.json({ error: "URL cover harus menggunakan HTTPS." }, { status: 400 });
  }

  const db = getDb();
  db.prepare(
    `UPDATE posts SET
      category = ?, title_id = ?, title_en = ?, excerpt_id = ?, excerpt_en = ?,
      content_id = ?, content_en = ?, cover_image = ?, published = ?, published_at = ?,
      updated_at = datetime('now')
     WHERE id = ?`
  ).run(
    d.category,
    d.title_id,
    d.title_en,
    d.excerpt_id,
    d.excerpt_en,
    d.content_id,
    d.content_en,
    d.cover_image || null,
    d.published ? 1 : 0,
    d.published_at,
    d.id
  );

  logAdminAction(admin.email, "UPDATE_POST", `post:${d.id}`, getClientIp(req));
  return NextResponse.json({ ok: true });
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
  db.prepare("DELETE FROM posts WHERE id = ?").run(id);
  logAdminAction(admin.email, "DELETE_POST", `post:${id}`, getClientIp(req));
  return NextResponse.json({ ok: true });
}
