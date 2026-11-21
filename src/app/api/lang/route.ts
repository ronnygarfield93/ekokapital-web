import { NextRequest, NextResponse } from "next/server";
import { LANG_COOKIE } from "@/lib/i18n";
import { verifySameOrigin } from "@/lib/security";

export async function POST(req: NextRequest) {
  if (!verifySameOrigin(req)) {
    return NextResponse.json({ error: "Forbidden origin" }, { status: 403 });
  }
  const body = await req.json().catch(() => null);
  const lang = body?.lang === "en" ? "en" : "id";

  const res = NextResponse.json({ ok: true, lang });
  res.cookies.set(LANG_COOKIE, lang, {
    httpOnly: false,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
  });
  return res;
}
