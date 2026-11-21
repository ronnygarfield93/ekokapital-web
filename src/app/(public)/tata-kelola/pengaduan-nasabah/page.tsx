import { CheckCircle2, Clock, FileCheck, Mail, Phone, Shield } from "lucide-react";
import { PageHero } from "@/components/PageHero";
import { SecureSubmissionForm } from "@/components/SecureSubmissionForm";
import { dictionary } from "@/lib/i18n";
import { getServerLang } from "@/lib/server-lang";
import { COMPANY_INFO, COMPLAINT_ANNUAL_STATS } from "@/lib/company-data";

export default async function PengaduanNasabahPage() {
  const lang = await getServerLang();
  const t = dictionary[lang];
  const isEn = lang === "en";

  return (
    <>
      <PageHero
        eyebrow={t.nav.governance}
        title={t.nav.complaints}
        subtitle={
          isEn
            ? "Structured consumer complaint resolution pursuant to OJK Regulation No. 18/POJK.07/2018."
            : "Mekanisme layanan pengaduan nasabah yang transparan dan terukur sesuai Peraturan OJK Nomor 18/POJK.07/2018."
        }
        breadcrumbs={[
          { label: t.nav.home, href: "/" },
          { label: t.nav.governance },
          { label: t.nav.complaints },
        ]}
      />

      <section className="mx-auto max-w-7xl space-y-12 px-4 py-16 sm:px-6 lg:px-8">
        {/* Channels & SLA */}
        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-white p-7 shadow-card">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-navy-50 text-navy-700">
                <Phone className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-navy-900">
                  {isEn ? "Verbal Complaint" : "Pengaduan Secara Lisan"}
                </h2>
                <p className="text-xs font-semibold text-gold-600">
                  SLA: {isEn ? "Up to 5 Business Days" : "Maksimal 5 Hari Kerja"}
                </p>
              </div>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-slate-600">
              {isEn
                ? `Visit our Customer Service desk at Jakarta Head Office or Surabaya Branch, or call ${COMPANY_INFO.csPhone} (hunting). If resolution requires more than 5 business days, we will assist you in submitting a written complaint.`
                : `Nasabah dapat datang langsung ke Customer Service Kantor Pusat Jakarta / Cabang Surabaya atau menghubungi telepon ${COMPANY_INFO.csPhone} (hunting). Ditangani dalam 5 hari kerja; apabila memerlukan waktu lebih lanjut, nasabah diarahkan mengajukan pengaduan tertulis.`}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-7 shadow-card">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-navy-900 text-gold-300">
                <Mail className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-navy-900">
                  {isEn ? "Written & Online Complaint" : "Pengaduan Tertulis & Online"}
                </h2>
                <p className="text-xs font-semibold text-gold-600">
                  SLA: {isEn ? "20 Business Days (+20 Days Extension)" : "20 Hari Kerja (+20 Hari Perpanjangan)"}
                </p>
              </div>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-slate-600">
              {isEn
                ? `Submit via the secure form below, official email (${COMPANY_INFO.complaintEmail}, subject "Pengaduan"), letter, or fax (${COMPANY_INFO.complaintFax}).`
                : `Diajukan melalui formulir online terenkripsi di bawah ini, email resmi (${COMPANY_INFO.complaintEmail} dengan subjek "Pengaduan"), surat tertulis, atau faksimili (${COMPANY_INFO.complaintFax}).`}
            </p>
          </div>
        </div>

        {/* Form + Checklist */}
        <div className="grid gap-8 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <h2 className="font-serif text-2xl font-bold text-navy-900">
              {isEn ? "Submit an Online Complaint" : "Formulir Pengaduan Nasabah Online"}
            </h2>
            <p className="mt-1.5 text-sm text-slate-600">
              {isEn
                ? "You will immediately receive an official registration ticket (PGD) upon submission."
                : "Anda akan langsung memperoleh nomor registrasi resmi (PGD) setelah pengiriman berhasil."}
            </p>
            <div className="mt-5">
              <SecureSubmissionForm type="complaint" lang={lang} />
            </div>
          </div>

          <div className="space-y-6 lg:col-span-5">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-card">
              <div className="flex items-center gap-2 text-navy-900">
                <FileCheck className="h-5 w-5 text-gold-500" />
                <h3 className="font-bold">
                  {isEn ? "Required Supporting Documents" : "Kelengkapan Dokumen Pengaduan"}
                </h3>
              </div>
              <ul className="mt-3 space-y-2.5 text-xs leading-relaxed text-slate-600">
                {(isEn
                  ? [
                      "Copy of valid ID (KTP / Passport) of the client or representative.",
                      "Stamped Power of Attorney (Surat Kuasa bermeterai) if submitted by a representative.",
                      "Copy of the relevant securities / RDN account details.",
                      "Copy of transaction confirmation or supporting financial evidence.",
                      "Keep all original documents and submit copies only.",
                    ]
                  : [
                      "Fotokopi identitas diri (KTP/Paspor) nasabah atau perwakilan.",
                      "Surat Kuasa bermeterai cukup apabila diwakilkan.",
                      "Fotokopi rekening efek / RDN yang menjadi objek pengaduan.",
                      "Fotokopi bukti transaksi keuangan atau dokumen pendukung terkait.",
                      "Simpan dokumen asli, serahkan salinan, dan catat nomor registrasi Anda.",
                    ]
                ).map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-card">
              <div className="flex items-center gap-2 text-navy-900">
                <Clock className="h-5 w-5 text-gold-500" />
                <h3 className="font-bold">
                  {isEn
                    ? "Published Annual Complaint Statistics"
                    : "Publikasi Data Pengaduan Nasabah"}
                </h3>
              </div>
              <table className="mt-4 w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500">
                    <th className="py-2">{isEn ? "Year" : "Tahun"}</th>
                    <th className="py-2 text-right">{isEn ? "Resolved" : "Diselesaikan"}</th>
                    <th className="py-2 text-right">{isEn ? "Pending" : "Belum Selesai"}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-mono">
                  {COMPLAINT_ANNUAL_STATS.map((row) => (
                    <tr key={row.year}>
                      <td className="py-2 font-bold text-navy-900">{row.year}</td>
                      <td className="py-2 text-right text-emerald-700">{row.resolved}</td>
                      <td className="py-2 text-right text-slate-600">{row.unresolved}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="rounded-2xl border border-navy-200 bg-navy-50 p-5 text-xs leading-relaxed text-slate-700">
              <div className="flex items-center gap-2 font-bold text-navy-900">
                <Shield className="h-4 w-4 text-navy-700" />
                <span>{isEn ? "Confidentiality & OJK Escalation" : "Kerahasiaan & Fasilitas OJK"}</span>
              </div>
              <p className="mt-2">
                {isEn
                  ? "Client data is strictly protected except as required by OJK or applicable law. If dissatisfied with the final resolution, clients may utilize OJK's Dispute Resolution Facility (Kontak OJK 157)."
                  : "Kerahasiaan data nasabah dijaga sepenuhnya sesuai peraturan perundang-undangan. Apabila nasabah belum puas atas penyelesaian akhir, nasabah dapat memanfaatkan fasilitas penyelesaian sengketa melalui OJK (Kontak OJK 157)."}
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
