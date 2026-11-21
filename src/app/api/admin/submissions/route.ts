import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getCurrentAdmin } from "@/lib/auth";
import { getDb, logAdminAction } from "@/lib/db";
import { getClientIp, verifySameOrigin } from "@/lib/security";

const patchSchema = z.object({
  id: z.number().int().positive(),
  status: z.enum(["new", "in_review", "resolved", "closed"]),
  admin_notes: z.string().trim().max(2000).optional().default(""),
});

export async function GET() {
  const admin = await getCurrentAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const db = getDb();
  const submissions = db
    .prepare("SELECT * FROM submissions ORDER BY created_at DESC, id DESC LIMIT 200")
    .all();
  return NextResponse.json({ submissions });
}

export async function PATCH(req: NextRequest) {
  if (!verifySameOrigin(req)) {
    return NextResponse.json({ error: "Forbidden origin" }, { status: 403 });
  }
  const admin = await getCurrentAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const raw = await req.json().catch(() => null);
  const parsed = patchSchema.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json({ error: "Data status tidak valid." }, { status: 400 });
  }

  const db = getDb();
  db.prepare(
    `UPDATE submissions SET status = ?, admin_notes = ?, updated_at = datetime('now') WHERE id = ?`
  ).run(parsed.data.status, parsed.data.admin_notes, parsed.data.id);

  logAdminAction(
    admin.email,
    "UPDATE_SUBMISSION",
    `submission:${parsed.data.id} -> ${parsed.data.status}`,
    getClientIp(req)
  );
  return NextResponse.json({ ok: true });
}
