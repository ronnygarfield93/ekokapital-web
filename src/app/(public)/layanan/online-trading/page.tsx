import Link from "next/link";
import {
  Apple,
  CheckCircle2,
  Download,
  ExternalLink,
  FileText,
  Laptop,
  Monitor,
  ShieldCheck,
  Smartphone,
} from "lucide-react";
import { PageHero } from "@/components/PageHero";
import { dictionary, pickLang } from "@/lib/i18n";
import { getServerLang } from "@/lib/server-lang";
import { COMPANY_INFO } from "@/lib/company-data";
import { getPublishedDocuments } from "@/lib/queries";

export default async function OnlineTradingPage() {
  const lang = await getServerLang();
  const t = dictionary[lang];
  const isEn = lang === "en";
  const desktopApps = getPublishedDocuments("etop_desktop");
  const manuals = getPublishedDocuments("etop_manual");

  return (
    <>
      <PageHero
        eyebrow={t.nav.services}
        title={t.nav.onlineTrading}
        subtitle={
          isEn
            ? "Ekokapital e-TOP delivers real-time IDX market quotes, rapid order execution, and portfolio monitoring across desktop and mobile."
            : "Aplikasi trading Ekokapital e-TOP menghadirkan data pasar BEI real-time, eksekusi order cepat, dan pemantauan portofolio di desktop maupun smartphone."
        }
        breadcrumbs={[
          { label: t.nav.home, href: "/" },
          { label: t.nav.services },
          { label: "e-TOP Trading" },
        ]}
      />

      <section className="mx-auto max-w-7xl space-y-10 px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Desktop Downloads */}
          <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-card sm:p-9">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-navy-900 text-gold-300">
                <Laptop className="h-6 w-6" />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-gold-600">
                  Desktop Application
                </p>
                <h2 className="font-serif text-2xl font-bold text-navy-900">
                  e-TOP Desktop
                </h2>
              </div>
            </div>

            <p className="mt-4 text-sm leading-relaxed text-slate-600">
              {isEn
                ? "Full-featured workstation for active equity traders with multi-window order books, charting, and real-time trade confirmations."
                : "Aplikasi desktop berkinerja tinggi untuk investor aktif dengan tampilan order book multi-jendela, grafik, dan konfirmasi transaksi real-time."}
            </p>

            <div className="mt-6 space-y-3">
              {desktopApps.map((app) => {
                const label = pickLang(lang, app.title_id, app.title_en);
                const isMac = /mac|apple|osx/i.test(`${app.title_id} ${app.title_en}`);
                const isLegacy = /legacy|32-bit/i.test(`${app.title_id} ${app.title_en}`);
                const isLocal = app.file_url.startsWith("/api/uploads/");
                return (
                  <a
                    key={app.id}
                    href={app.file_url}
                    target={isLocal ? undefined : "_blank"}
                    rel={isLocal ? undefined : "noopener noreferrer"}
                    className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm font-semibold text-navy-900 transition hover:border-navy-400 hover:bg-navy-50"
                  >
                    <span className="inline-flex items-center gap-3">
                      {isMac ? (
                        <Apple className="h-5 w-5 shrink-0 text-navy-700" />
                      ) : (
                        <Monitor
                          className={`h-5 w-5 shrink-0 ${
                            isLegacy ? "text-slate-500" : "text-navy-700"
                          }`}
                        />
                      )}
                      <span>{label}</span>
                    </span>
                    <span className="inline-flex shrink-0 items-center gap-2">
                      {app.file_size && (
                        <span className="hidden rounded-md bg-white px-2 py-0.5 text-[11px] font-medium text-slate-500 ring-1 ring-slate-200 sm:inline-block">
                          {app.file_size}
                        </span>
                      )}
                      <Download className="h-4 w-4 text-gold-600" />
                    </span>
                  </a>
                );
              })}
            </div>
          </div>

          {/* Mobile Apps */}
          <div className="bg-eko-hero rounded-3xl p-7 text-white shadow-xl sm:p-9">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gold-500/20 text-gold-300">
                <Smartphone className="h-6 w-6" />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-gold-300">
                  Mobile Application
                </p>
                <h2 className="font-serif text-2xl font-bold text-white">
                  e-TOP Mobile
                </h2>
              </div>
            </div>

            <p className="mt-4 text-sm leading-relaxed text-navy-100">
              {isEn
                ? "Trade anywhere with real-time market signals, watchlist monitoring, and instant order status on Android and iOS."
                : "Bertransaksi saham di mana saja dengan sinyal real-time, pantauan watchlist, dan status order instan di perangkat Android maupun iOS."}
            </p>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <a
                href={COMPANY_INFO.playStoreUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-eko-gold-gradient eko-btn-shine flex items-center justify-between rounded-xl px-5 py-4 text-sm font-bold text-navy-950"
              >
                <div>
                  <span className="block text-[10px] uppercase tracking-wider opacity-80">
                    Get it on
                  </span>
                  <span>Google Play</span>
                </div>
                <ExternalLink className="h-4 w-4" />
              </a>

              <a
                href={COMPANY_INFO.appStoreUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="eko-btn-shine flex items-center justify-between rounded-xl border border-white/20 bg-white/10 px-5 py-4 text-sm font-bold text-white hover:bg-white/15"
              >
                <div>
                  <span className="block text-[10px] uppercase tracking-wider text-navy-200">
                    Download on
                  </span>
                  <span>App Store</span>
                </div>
                <ExternalLink className="h-4 w-4 text-gold-300" />
              </a>
            </div>

            <div className="mt-6 rounded-2xl border border-white/10 bg-navy-950/60 p-4 text-xs text-navy-100">
              <div className="flex items-center gap-2 font-semibold text-gold-300">
                <ShieldCheck className="h-4 w-4" />
                <span>{isEn ? "Account Security Reminder" : "Imbauan Keamanan Akun"}</span>
              </div>
              <ul className="mt-2 space-y-1.5">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-gold-400" />
                  <span>
                    {isEn
                      ? "Never share your User ID, Password, or Trading PIN with anyone."
                      : "Jangan pernah membagikan User ID, Password, atau PIN transaksi kepada siapapun."}
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-gold-400" />
                  <span>
                    {isEn
                      ? "Download e-TOP only from official stores or ekokapital.com."
                      : "Unduh e-TOP hanya melalui toko aplikasi resmi atau situs ekokapital.com."}
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* User Manuals from DB */}
        <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-card sm:p-9">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="font-serif text-2xl font-bold text-navy-900">
                {isEn ? "e-TOP User Manuals & Documentation" : "Buku Panduan Aplikasi e-TOP"}
              </h2>
              <p className="mt-1 text-sm text-slate-600">
                {isEn
                  ? "Step-by-step operating instructions for desktop and mobile trading."
                  : "Panduan lengkap operasional aplikasi e-TOP versi desktop dan mobile."}
              </p>
            </div>
            <Link
              href="/legal/disclaimer-etop"
              className="text-xs font-bold text-navy-700 underline hover:text-gold-600"
            >
              {t.footer.etopDisclaimer}
            </Link>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {manuals.map((doc) => (
              <a
                key={doc.id}
                href={doc.file_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-5 transition hover:border-navy-300 hover:bg-white hover:shadow-sm"
              >
                <div className="flex items-start gap-3.5">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-navy-100 text-navy-700">
                    <FileText className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-navy-900">
                      {pickLang(lang, doc.title_id, doc.title_en)}
                    </h3>
                    <p className="mt-1 text-xs text-slate-600">
                      {pickLang(lang, doc.description_id, doc.description_en)}
                    </p>
                  </div>
                </div>
                <span className="inline-flex shrink-0 items-center gap-1 rounded-lg bg-navy-800 px-3 py-1.5 text-xs font-semibold text-white">
                  <Download className="h-3.5 w-3.5" />
                  PDF
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
