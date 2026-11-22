import { Download, Scale, ShieldCheck } from "lucide-react";
import { PageHero } from "@/components/PageHero";
import { dictionary, pickLang } from "@/lib/i18n";
import { getServerLang } from "@/lib/server-lang";
import { VISION_MISSION } from "@/lib/company-data";
import { getPublishedDocuments } from "@/lib/queries";

export default async function GcgPage() {
  const lang = await getServerLang();
  const t = dictionary[lang];
  const isEn = lang === "en";
  const docs = getPublishedDocuments("gcg");

  return (
    <>
      <PageHero
        eyebrow={t.nav.governance}
        title={t.nav.gcg}
        subtitle={
          isEn
            ? "Good Corporate Governance charters, ethical standards, risk management policies, and internal audit mandates."
            : "Pedoman Tata Kelola Perusahaan yang Baik (GCG), Kode Etik, Kebijakan Manajemen Risiko, serta Piagam Audit & Kepatuhan."
        }
        breadcrumbs={[
          { label: t.nav.home, href: "/" },
          { label: t.nav.governance },
          { label: "GCG" },
        ]}
      />

      <section className="mx-auto max-w-6xl space-y-10 px-4 py-16 sm:px-6 lg:px-8">
        {/* GCG Values */}
        <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-card sm:p-9">
          <div className="flex items-center gap-2 text-gold-600">
            <ShieldCheck className="h-5 w-5" />
            <span className="text-xs font-bold uppercase tracking-widest">
              {isEn ? "Governance Commitment" : "Komitmen Tata Kelola"}
            </span>
          </div>
          <h2 className="mt-2 font-serif text-2xl font-bold text-navy-900">
            {isEn ? "Corporate Values & Ethical Foundation" : "Tata Nilai & Landasan Etika Perusahaan"}
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-slate-600">
            {isEn
              ? "PT Ekokapital Sekuritas implements Good Corporate Governance (GCG) principles—Transparency, Accountability, Responsibility, Independence, and Fairness—across every operational and advisory function."
              : "PT Ekokapital Sekuritas menerapkan prinsip Tata Kelola Perusahaan yang Baik (Transparansi, Akuntabilitas, Pertanggungjawaban, Independensi, dan Kewajaran) pada seluruh lini operasional dan layanan nasabah."}
          </p>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {VISION_MISSION.gcgValues.map((v) => (
              <div
                key={v.key}
                className="rounded-2xl border border-slate-200 bg-slate-50 p-5"
              >
                <h3 className="text-sm font-bold text-navy-900">
                  {isEn ? v.titleEn : v.titleId}
                </h3>
                <p className="mt-1.5 text-xs leading-relaxed text-slate-600">
                  {isEn ? v.descEn : v.descId}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* GCG Charters */}
        <div>
          <h2 className="font-serif text-2xl font-bold text-navy-900">
            {isEn ? "Official GCG Charters & Policies" : "Dokumen Pedoman & Piagam GCG"}
          </h2>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            {docs.map((doc) => (
              <div
                key={doc.id}
                className="eko-card-lift flex flex-col justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-card"
              >
                <div className="flex items-start gap-3.5">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-navy-50 text-navy-700">
                    <Scale className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-navy-900">
                      {pickLang(lang, doc.title_id, doc.title_en)}
                    </h3>
                    <p className="mt-1 text-xs leading-relaxed text-slate-600">
                      {pickLang(lang, doc.description_id, doc.description_en)}
                    </p>
                  </div>
                </div>
                <div className="flex justify-end">
                  <a
                    href={doc.file_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-xl bg-navy-800 px-4 py-2 text-xs font-semibold text-white transition hover:bg-navy-700"
                  >
                    <Download className="h-3.5 w-3.5 text-gold-300" />
                    {t.common.downloadPdf}
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
