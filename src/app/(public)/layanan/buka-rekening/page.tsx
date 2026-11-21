import {
  CheckCircle2,
  Download,
  FileText,
  Landmark,
  Mail,
  Phone,
} from "lucide-react";
import { PageHero } from "@/components/PageHero";
import { dictionary, pickLang } from "@/lib/i18n";
import { getServerLang } from "@/lib/server-lang";
import { COMPANY_INFO } from "@/lib/company-data";
import { getPublishedDocuments } from "@/lib/queries";

export default async function BukaRekeningPage() {
  const lang = await getServerLang();
  const t = dictionary[lang];
  const isEn = lang === "en";
  const forms = getPublishedDocuments("form");

  const steps = isEn
    ? [
        {
          step: "01",
          title: "Complete Official Application Forms",
          desc: "Download and fill out the Ekokapital Account Application Form, KSEI Sub-Account Power of Attorney, Ekokapital Power of Attorney, and Specimen Signature.",
        },
        {
          step: "02",
          title: "Prepare Supporting Identification",
          desc: "Attach a clear copy of your valid ID (KTP / Passport / KITAS), NPWP (or non-NPWP statement), and a personal bank account statement.",
        },
        {
          step: "03",
          title: "Submit Documents to Our Office",
          desc: "Deliver or mail the signed documents to PT Ekokapital Sekuritas, Graha FamilyMart 6th Floor, Jl. Setiabudi Selatan Kav. 10, Jakarta 12920 (Attn: Opening Account).",
        },
        {
          step: "04",
          title: "Fund RDN & e-TOP Activation",
          desc: "Once verified, fund your Investor Fund Account (RDN, minimum IDR 20,000,000) at Bank Mandiri IDX Branch or Bank BCA IDX Branch to activate your SID and e-TOP account.",
        },
      ]
    : [
        {
          step: "01",
          title: "Lengkapi Formulir Pembukaan Rekening",
          desc: "Unduh dan isi Formulir Pembukaan Rekening Efek, Surat Kuasa Pembukaan Sub-Rekening Efek KSEI, Surat Kuasa Kepada Ekokapital, serta Spesimen Tanda Tangan.",
        },
        {
          step: "02",
          title: "Siapkan Dokumen Pendukung",
          desc: "Lampirkan salinan identitas diri yang berlaku (KTP / Paspor / KITAS), NPWP (atau surat pernyataan non-NPWP), serta bukti rekening bank pribadi.",
        },
        {
          step: "03",
          title: "Kirim Berkas ke Kantor Kami",
          desc: "Antarkan atau kirimkan berkas bertanda tangan asli ke PT Ekokapital Sekuritas, Graha FamilyMart Lt. 6, Jl. Setiabudi Selatan Kav. 10, Jakarta 12920 (Attn: Opening Account).",
        },
        {
          step: "04",
          title: "Setoran Awal RDN & Aktivasi e-TOP",
          desc: "Setelah verifikasi selesai, lakukan setoran awal (minimum Rp 20.000.000) ke RDN atas nama Anda di Bank Mandiri Cabang BEI atau Bank BCA Cabang BEI untuk aktivasi SID dan akun e-TOP.",
        },
      ];

  return (
    <>
      <PageHero
        eyebrow={t.nav.services}
        title={t.nav.openAccount}
        subtitle={
          isEn
            ? "Open an Individual or Corporate securities account to trade equities, bonds, and IDX-listed financial instruments."
            : "Buka rekening efek Individu atau Korporasi untuk bertransaksi saham, obligasi, dan instrumen pasar modal di Bursa Efek Indonesia."
        }
        breadcrumbs={[
          { label: t.nav.home, href: "/" },
          { label: t.nav.services },
          { label: t.nav.openAccount },
        ]}
      />

      <section className="mx-auto max-w-7xl space-y-10 px-4 py-16 sm:px-6 lg:px-8">
        {/* 4-Step Guide */}
        <div>
          <h2 className="font-serif text-2xl font-bold text-navy-900 sm:text-3xl">
            {isEn ? "Account Opening Steps" : "Tahapan Pembukaan Rekening"}
          </h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((item) => (
              <div
                key={item.step}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-card"
              >
                <span className="font-mono text-2xl font-bold text-gold-500">
                  {item.step}
                </span>
                <h3 className="mt-3 text-base font-bold text-navy-900">
                  {item.title}
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-slate-600">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* RDN Banks + Forms */}
        <div className="grid gap-6 lg:grid-cols-12">
          <div className="rounded-2xl border border-slate-200 bg-white p-7 shadow-card lg:col-span-7">
            <h3 className="font-serif text-xl font-bold text-navy-900">
              {isEn ? "Downloadable Forms (PDF)" : "Unduh Formulir Rekening (PDF)"}
            </h3>
            <div className="mt-5 space-y-3">
              {forms.map((doc) => (
                <a
                  key={doc.id}
                  href={doc.file_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between gap-4 rounded-xl border border-slate-200 bg-slate-50 p-4 transition hover:border-navy-300 hover:bg-white"
                >
                  <div className="flex items-start gap-3">
                    <FileText className="mt-0.5 h-5 w-5 shrink-0 text-navy-700" />
                    <div>
                      <p className="text-sm font-bold text-navy-900">
                        {pickLang(lang, doc.title_id, doc.title_en)}
                      </p>
                      <p className="text-xs text-slate-600">
                        {pickLang(lang, doc.description_id, doc.description_en)}
                      </p>
                    </div>
                  </div>
                  <Download className="h-4 w-4 shrink-0 text-gold-600" />
                </a>
              ))}
            </div>
          </div>

          <div className="space-y-6 lg:col-span-5">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-card">
              <div className="flex items-center gap-2 text-navy-900">
                <Landmark className="h-5 w-5 text-gold-500" />
                <h3 className="font-bold">
                  {isEn ? "Partner RDN Banks" : "Bank RDN Resmi"}
                </h3>
              </div>
              <ul className="mt-3 space-y-2 text-sm text-slate-700">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  Bank Mandiri — Cabang BEI Jakarta
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  Bank BCA — Cabang BEI Jakarta
                </li>
              </ul>
            </div>

            <div className="rounded-2xl border border-navy-200 bg-navy-50 p-6">
              <h3 className="text-sm font-bold uppercase tracking-wider text-navy-900">
                {isEn ? "Account Opening Helpdesk" : "Bantuan Pembukaan Rekening"}
              </h3>
              <p className="mt-2 text-xs text-slate-600">
                {isEn
                  ? "Need assistance with Individual or Corporate registration? Reach our desk directly:"
                  : "Butuh panduan pembukaan rekening Individu maupun Korporasi? Hubungi tim kami:"}
              </p>
              <div className="mt-4 space-y-2 text-sm font-semibold text-navy-900">
                <p className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-gold-600" />
                  {COMPANY_INFO.csPhone}
                </p>
                <p className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-gold-600" />
                  {COMPANY_INFO.csEmail}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
