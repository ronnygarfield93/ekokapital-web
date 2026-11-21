import { Lock, Mail, ShieldAlert, UserCheck } from "lucide-react";
import { PageHero } from "@/components/PageHero";
import { SecureSubmissionForm } from "@/components/SecureSubmissionForm";
import { dictionary } from "@/lib/i18n";
import { getServerLang } from "@/lib/server-lang";
import { COMPANY_INFO } from "@/lib/company-data";

export default async function WhistleblowingPage() {
  const lang = await getServerLang();
  const t = dictionary[lang];
  const isEn = lang === "en";

  const hierarchy = isEn
    ? [
        { reported: "Employee (including WBS Manager)", handler: "Board of Directors" },
        { reported: "Member of Board of Directors", handler: "Board of Commissioners" },
        { reported: "Member of Board of Commissioners", handler: "Shareholders" },
        { reported: "Multiple Parties Across Levels", handler: "Highest Applicable Governance Body" },
      ]
    : [
        { reported: "Oknum Karyawan (termasuk Pengelola WBS)", handler: "Direksi" },
        { reported: "Oknum Direksi", handler: "Dewan Komisaris" },
        { reported: "Oknum Dewan Komisaris", handler: "Pemegang Saham" },
        { reported: "Melibatkan Beberapa Pihak Lintas Jabatan", handler: "Hirarki Tertinggi dari Pihak Terlapor" },
      ];

  return (
    <>
      <PageHero
        eyebrow={t.nav.governance}
        title={t.nav.wbs}
        subtitle={
          isEn
            ? "Confidential reporting channel for suspected ethical, legal, or regulatory violations involving internal parties of PT Ekokapital Sekuritas."
            : "Sarana pelaporan resmi dugaan pelanggaran etika, hukum, maupun kepatuhan yang melibatkan pihak internal PT Ekokapital Sekuritas dengan jaminan kerahasiaan Pelapor."
        }
        breadcrumbs={[
          { label: t.nav.home, href: "/" },
          { label: t.nav.governance },
          { label: t.nav.wbs },
        ]}
      />

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <h2 className="font-serif text-2xl font-bold text-navy-900">
              {isEn ? "Confidential WBS Reporting Form" : "Formulir Pelaporan WBS"}
            </h2>
            <p className="mt-1.5 text-sm text-slate-600">
              {isEn
                ? "Reports are routed directly to the designated WBS Governance Manager with strict reporter confidentiality."
                : "Laporan diteruskan langsung ke Pengelola WBS berwenang dengan perlindungan penuh atas kerahasiaan identitas dan hak Pelapor."}
            </p>
            <div className="mt-5">
              <SecureSubmissionForm
                type="whistleblowing"
                lang={lang}
                allowAnonymousOption
              />
            </div>
          </div>

          <div className="space-y-6 lg:col-span-5">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-card">
              <div className="flex items-center gap-2 text-navy-900">
                <UserCheck className="h-5 w-5 text-gold-500" />
                <h3 className="font-bold">
                  {isEn ? "Reporting Criteria" : "Kriteria Laporan WBS"}
                </h3>
              </div>
              <ul className="mt-3 space-y-2.5 text-xs leading-relaxed text-slate-600">
                <li>
                  •{" "}
                  {isEn
                    ? "Involves suspected violations committed by or involving internal personnel (Commissioners, Directors, or Employees)."
                    : "Indikasi pelanggaran dilakukan atau melibatkan pihak internal (Dewan Komisaris, Direksi, atau Karyawan)."}
                </li>
                <li>
                  •{" "}
                  {isEn
                    ? "Includes clear chronology, supporting evidence/facts, and reporter contact details for formal investigation."
                    : "Memuat kronologi jelas, alat bukti indikasi pelanggaran, serta identitas Pelapor agar dapat ditindaklanjuti secara formal oleh Pengelola WBS."}
                </li>
              </ul>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-card">
              <div className="flex items-center gap-2 text-navy-900">
                <ShieldAlert className="h-5 w-5 text-gold-500" />
                <h3 className="font-bold">
                  {isEn ? "Escalation & Accountability Matrix" : "Penanggung Jawab Penanganan"}
                </h3>
              </div>
              <div className="mt-4 space-y-2.5">
                {hierarchy.map((item) => (
                  <div
                    key={item.reported}
                    className="rounded-xl border border-slate-100 bg-slate-50 p-3 text-xs"
                  >
                    <p className="text-slate-500">{item.reported}</p>
                    <p className="mt-0.5 font-bold text-navy-900">→ {item.handler}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl bg-navy-900 p-6 text-white">
              <div className="flex items-center gap-2 text-gold-300">
                <Lock className="h-4 w-4" />
                <span className="text-xs font-bold uppercase tracking-wider">
                  {isEn ? "Dedicated WBS Email Channel" : "Kanal Email Khusus WBS"}
                </span>
              </div>
              <p className="mt-2 text-xs text-navy-100">
                {isEn
                  ? "If you need to attach supporting evidence files, send directly to our dedicated WBS address:"
                  : "Apabila Anda perlu melampirkan berkas bukti pendukung, kirimkan langsung ke alamat email resmi WBS:"}
              </p>
              <a
                href={`mailto:${COMPANY_INFO.wbsEmail}`}
                className="mt-3 inline-flex items-center gap-2 font-mono text-sm font-bold text-gold-300 hover:underline"
              >
                <Mail className="h-4 w-4" />
                {COMPANY_INFO.wbsEmail}
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
