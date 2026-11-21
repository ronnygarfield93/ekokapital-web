import { ExternalLink, ZoomIn } from "lucide-react";
import { PageHero } from "@/components/PageHero";
import { dictionary } from "@/lib/i18n";
import { getServerLang } from "@/lib/server-lang";

export default async function StrukturOrganisasiPage() {
  const lang = await getServerLang();
  const t = dictionary[lang];
  const isEn = lang === "en";

  return (
    <>
      <PageHero
        eyebrow={t.nav.about}
        title={t.nav.orgStructure}
        subtitle={
          isEn
            ? "Official organizational structure of PT Ekokapital Sekuritas ensuring clear segregation of duties and governance."
            : "Bagan struktur organisasi resmi PT Ekokapital Sekuritas yang memastikan pemisahan fungsi dan tata kelola yang jelas."
        }
        breadcrumbs={[
          { label: t.nav.home, href: "/" },
          { label: t.nav.orgStructure },
        ]}
      />

      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-card">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 bg-slate-50/70 px-6 py-4">
            <p className="text-xs font-bold uppercase tracking-wider text-navy-800">
              {isEn
                ? "PT Ekokapital Sekuritas — Organization Chart"
                : "Bagan Struktur Organisasi — PT Ekokapital Sekuritas"}
            </p>
            <a
              href="/images/struktur-organisasi.jpg"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-lg border border-navy-200 bg-white px-3 py-1.5 text-xs font-semibold text-navy-800 transition hover:border-navy-400 hover:bg-navy-50"
            >
              <ZoomIn className="h-3.5 w-3.5 text-gold-600" />
              <span>{isEn ? "Open Full Size" : "Buka Ukuran Penuh"}</span>
              <ExternalLink className="h-3 w-3 opacity-70" />
            </a>
          </div>

          <div className="p-4 sm:p-8 lg:p-10">
            <a
              href="/images/struktur-organisasi.jpg"
              target="_blank"
              rel="noopener noreferrer"
              className="block overflow-hidden rounded-2xl border border-slate-100 bg-white transition hover:opacity-95"
              title={isEn ? "Click to open full size" : "Klik untuk memperbesar gambar"}
            >
              <img
                src="/images/struktur-organisasi.jpg"
                alt={
                  isEn
                    ? "Organization Structure of PT Ekokapital Sekuritas"
                    : "Struktur Organisasi PT Ekokapital Sekuritas"
                }
                className="mx-auto h-auto w-full object-contain"
              />
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
