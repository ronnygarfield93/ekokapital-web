import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getCurrentAdmin } from "@/lib/auth";
import { getDb, logAdminAction } from "@/lib/db";
import { getClientIp, isSafeUrl, verifySameOrigin } from "@/lib/security";

const noticeSchema = z.object({
  id: z.number().int().optional(),
  type: z.enum(["fraud_alert", "announcement"]),
  title_id: z.string().trim().min(3).max(200),
  title_en: z.string().trim().min(3).max(200),
  body_id: z.string().trim().min(10).max(4000),
  body_en: z.string().trim().min(10).max(4000),
  cta_label_id: z.string().trim().max(80).optional().nullable(),
  cta_label_en: z.string().trim().max(80).optional().nullable(),
  cta_url: z.string().trim().max(300).optional().nullable(),
  show_as_modal: z.boolean().default(true),
  active: z.boolean().default(true),
});

export async function GET() {
  const admin = await getCurrentAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const db = getDb();
  const notices = db.prepare("SELECT * FROM notices ORDER BY id DESC").all();
  return NextResponse.json({ notices });
}

export async function POST(req: NextRequest) {
  if (!verifySameOrigin(req)) {
    return NextResponse.json({ error: "Forbidden origin" }, { status: 403 });
  }
  const admin = await getCurrentAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const raw = await req.json().catch(() => null);
  const parsed = noticeSchema.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json({ error: "Data pengumuman tidak valid." }, { status: 400 });
  }
  const d = parsed.data;
  if (d.cta_url && !isSafeUrl(d.cta_url)) {
    return NextResponse.json({ error: "URL CTA harus menggunakan HTTPS." }, { status: 400 });
  }

  const db = getDb();
  const res = db
    .prepare(
      `INSERT INTO notices (
        type, title_id, title_en, body_id, body_en,
        cta_label_id, cta_label_en, cta_url, show_as_modal, active
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    )
    .run(
      d.type,
      d.title_id,
      d.title_en,
      d.body_id,
      d.body_en,
      d.cta_label_id || null,
      d.cta_label_en || null,
      d.cta_url || null,
      d.show_as_modal ? 1 : 0,
      d.active ? 1 : 0
    );

  logAdminAction(admin.email, "CREATE_NOTICE", d.title_id, getClientIp(req));
  return NextResponse.json({ ok: true, id: Number(res.lastInsertRowid) }, { status: 201 });
}

export async function PUT(req: NextRequest) {
  if (!verifySameOrigin(req)) {
    return NextResponse.json({ error: "Forbidden origin" }, { status: 403 });
  }
  const admin = await getCurrentAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const raw = await req.json().catch(() => null);
  const parsed = noticeSchema.extend({ id: z.number().int().positive() }).safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json({ error: "Data pengumuman tidak valid." }, { status: 400 });
  }
  const d = parsed.data;
  if (d.cta_url && !isSafeUrl(d.cta_url)) {
    return NextResponse.json({ error: "URL CTA harus menggunakan HTTPS." }, { status: 400 });
  }

  const db = getDb();
  db.prepare(
    `UPDATE notices SET
      type = ?, title_id = ?, title_en = ?, body_id = ?, body_en = ?,
      cta_label_id = ?, cta_label_en = ?, cta_url = ?, show_as_modal = ?, active = ?,
      updated_at = datetime('now')
     WHERE id = ?`
  ).run(
    d.type,
    d.title_id,
    d.title_en,
    d.body_id,
    d.body_en,
    d.cta_label_id || null,
    d.cta_label_en || null,
    d.cta_url || null,
    d.show_as_modal ? 1 : 0,
    d.active ? 1 : 0,
    d.id
  );

  logAdminAction(admin.email, "UPDATE_NOTICE", `notice:${d.id}`, getClientIp(req));
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: NextRequest) {
  if (!verifySameOrigin(req)) {
    return NextResponse.json({ error: "Forbidden origin" }, { status: 403 });
  }
  const admin = await getCurrentAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const id = Number(req.nextUrl.searchParams.get("id"));
  if (!Number.isInteger(id) || id <= 0) {
    return NextResponse.json({ error: "ID tidak valid." }, { status: 400 });
  }
  const db = getDb();
  db.prepare("DELETE FROM notices WHERE id = ?").run(id);
  logAdminAction(admin.email, "DELETE_NOTICE", `notice:${id}`, getClientIp(req));
  return NextResponse.json({ ok: true });
}
