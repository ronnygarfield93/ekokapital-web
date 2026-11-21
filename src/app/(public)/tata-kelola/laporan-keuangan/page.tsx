import { Download, FileSpreadsheet } from "lucide-react";
import { PageHero } from "@/components/PageHero";
import { dictionary, pickLang } from "@/lib/i18n";
import { getServerLang } from "@/lib/server-lang";
import { getPublishedDocuments } from "@/lib/queries";

export default async function LaporanKeuanganPage() {
  const lang = await getServerLang();
  const t = dictionary[lang];
  const isEn = lang === "en";
  const docs = getPublishedDocuments("financial_report");

  return (
    <>
      <PageHero
        eyebrow={t.nav.governance}
        title={t.nav.financialReports}
        subtitle={
          isEn
            ? "Annual audited financial statements of PT Ekokapital Sekuritas published in accordance with OJK disclosure requirements."
            : "Publikasi laporan keuangan auditan tahunan PT Ekokapital Sekuritas sebagai wujud keterbukaan informasi kepada publik dan OJK."
        }
        breadcrumbs={[
          { label: t.nav.home, href: "/" },
          { label: t.nav.governance },
          { label: t.nav.financialReports },
        ]}
      />

      <section className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="space-y-4">
          {docs.map((doc) => (
            <div
              key={doc.id}
              className="flex flex-col items-start justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-card transition hover:border-navy-300 sm:flex-row sm:items-center"
            >
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-navy-50 text-navy-700">
                  <FileSpreadsheet className="h-6 w-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    {doc.year && (
                      <span className="rounded-md bg-gold-100 px-2 py-0.5 font-mono text-xs font-bold text-gold-800">
                        {doc.year}
                      </span>
                    )}
                    <span className="text-xs font-medium text-slate-500">
                      {doc.file_size}
                    </span>
                  </div>
                  <h2 className="mt-1.5 text-base font-bold text-navy-900">
                    {pickLang(lang, doc.title_id, doc.title_en)}
                  </h2>
                  <p className="mt-0.5 text-xs text-slate-600">
                    {pickLang(lang, doc.description_id, doc.description_en)}
                  </p>
                </div>
              </div>

              <a
                href={doc.file_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-navy-800 px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-navy-700"
              >
                <Download className="h-4 w-4 text-gold-300" />
                {t.common.downloadPdf}
              </a>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
