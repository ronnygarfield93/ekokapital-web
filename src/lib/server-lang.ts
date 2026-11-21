import { cookies } from "next/headers";
import { LANG_COOKIE } from "./i18n";
import type { Lang } from "./types";

export async function getServerLang(): Promise<Lang> {
  const store = await cookies();
  const val = store.get(LANG_COOKIE)?.value;
  return val === "en" ? "en" : "id";
}
