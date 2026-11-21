import { NextResponse } from "next/server";
import { getCurrentAdmin } from "@/lib/auth";
import { getDb } from "@/lib/db";

export async function GET() {
  const admin = await getCurrentAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const db = getDb();
  const logs = db
    .prepare("SELECT * FROM audit_logs ORDER BY id DESC LIMIT 100")
    .all();
  return NextResponse.json({ logs });
}
