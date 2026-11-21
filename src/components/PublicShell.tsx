import type { ReactNode } from "react";
import { getServerLang } from "@/lib/server-lang";
import { getActiveNotices } from "@/lib/queries";
import { SiteHeader } from "./SiteHeader";
import { SiteFooter } from "./SiteFooter";
import { FraudNoticeModal } from "./FraudNoticeModal";

export async function PublicShell({ children }: { children: ReactNode }) {
  const lang = await getServerLang();
  const notices = getActiveNotices();

  return (
    <div className="bg-eko-surface flex min-h-screen flex-col">
      <FraudNoticeModal notices={notices} lang={lang} />
      <SiteHeader lang={lang} />
      <main className="flex-1">{children}</main>
      <SiteFooter lang={lang} />
    </div>
  );
}
