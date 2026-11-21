import { NextRequest, NextResponse } from "next/server";
import { destroyAdminSession } from "@/lib/auth";
import { getClientIp, verifySameOrigin } from "@/lib/security";

export async function POST(req: NextRequest) {
  if (!verifySameOrigin(req)) {
    return NextResponse.json({ error: "Invalid origin." }, { status: 403 });
  }
  await destroyAdminSession(getClientIp(req));
  return NextResponse.json({ ok: true });
}
