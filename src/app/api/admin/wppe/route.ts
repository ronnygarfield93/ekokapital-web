import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getCurrentAdmin } from "@/lib/auth";
import { getDb, logAdminAction } from "@/lib/db";
import { getClientIp, verifySameOrigin } from "@/lib/security";

const wppeSchema = z.object({
  id: z.number().int().optional(),
  name: z.string().trim().min(2).max(120),
  license_type: z.string().trim().min(2).max(40).default("WPPE"),
  license_number: z.string().trim().min(3).max(120),
  position_id: z.string().trim().min(2).max(120),
  position_en: z.string().trim().min(2).max(120),
  active: z.boolean().default(true),
});

export async function GET() {
  const admin = await getCurrentAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const db = getDb();
  const staff = db
    .prepare("SELECT * FROM wppe_staff ORDER BY sort_order ASC, id ASC")
    .all();
  return NextResponse.json({ staff });
}

export async function POST(req: NextRequest) {
  if (!verifySameOrigin(req)) {
    return NextResponse.json({ error: "Forbidden origin" }, { status: 403 });
  }
  const admin = await getCurrentAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const raw = await req.json().catch(() => null);
  const parsed = wppeSchema.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json({ error: "Data karyawan WPPE tidak valid." }, { status: 400 });
  }

  const d = parsed.data;
  const db = getDb();
  const maxOrder = db
    .prepare("SELECT COALESCE(MAX(sort_order), 0) as m FROM wppe_staff")
    .get() as { m: number };

  const res = db
    .prepare(
      `INSERT INTO wppe_staff (name, license_type, license_number, position_id, position_en, active, sort_order)
       VALUES (?, ?, ?, ?, ?, ?, ?)`
    )
    .run(
      d.name,
      d.license_type,
      d.license_number,
      d.position_id,
      d.position_en,
      d.active ? 1 : 0,
      maxOrder.m + 1
    );

  logAdminAction(admin.email, "CREATE_WPPE", d.name, getClientIp(req));
  return NextResponse.json({ ok: true, id: Number(res.lastInsertRowid) }, { status: 201 });
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
  db.prepare("DELETE FROM wppe_staff WHERE id = ?").run(id);
  logAdminAction(admin.email, "DELETE_WPPE", `wppe:${id}`, getClientIp(req));
  return NextResponse.json({ ok: true });
}
