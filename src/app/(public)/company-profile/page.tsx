import Link from "next/link";
import { Award, Building2, FileCheck2, Landmark, ShieldCheck } from "lucide-react";
import { PageHero } from "@/components/PageHero";
import { dictionary } from "@/lib/i18n";
import { getServerLang } from "@/lib/server-lang";
import { COMPANY_INFO, SHAREHOLDERS } from "@/lib/company-data";

export default async function CompanyProfilePage() {
  const lang = await getServerLang();
  const t = dictionary[lang];
  const isEn = lang === "en";

  const milestones = [
    {
      date: isEn ? "12 July 2000" : "12 Juli 2000",
      title: isEn ? "Company Establishment" : "Pendirian Perusahaan",
      desc: isEn
        ? `Established under ${COMPANY_INFO.deedNumber} originally as PT Ekodana Sekuritas, approved by the Ministry of Justice & Human Rights (${COMPANY_INFO.ministryApproval}).`
        : `Didirikan berdasarkan ${COMPANY_INFO.deedNumber} dengan nama awal PT Ekodana Sekuritas dan disahkan oleh Menteri Kehakiman & HAM RI (${COMPANY_INFO.ministryApproval}).`,
    },
    {
      date: isEn ? "30 November 2000" : "30 November 2000",
      title: isEn ? "OJK / Bapepam Brokerage License" : "Izin Perantara Pedagang Efek",
      desc: isEn
        ? `Granted securities brokerage license by the Chairman of Bapepam (now OJK) under Decree No. ${COMPANY_INFO.ojkLicense}.`
        : `Memperoleh izin usaha sebagai Perantara Pedagang Efek melalui Surat Keputusan Ketua Bapepam (kini OJK) No. ${COMPANY_INFO.ojkLicense}.`,
    },
    {
      date: isEn ? "5 February 2001" : "5 Februari 2001",
      title: isEn ? "IDX Exchange Member Approval (Code: ES)" : "Persetujuan Anggota Bursa BEI (Kode: ES)",
      desc: isEn
        ? `Officially admitted as an Exchange Member of the Indonesia Stock Exchange with broker code ES (${COMPANY_INFO.idxApproval}).`
        : `Resmi memperoleh Surat Persetujuan Anggota Bursa (SPAB) dari Direksi Bursa Efek Indonesia dengan Kode Anggota Bursa ES (${COMPANY_INFO.idxApproval}).`,
    },
  ];

  return (
    <>
      <PageHero
        eyebrow={t.nav.about}
        title={t.nav.companyProfile}
        subtitle={
          isEn
            ? "Over two decades of trusted securities brokerage service and regulatory integrity in Indonesia's capital market."
            : "Lebih dari dua dekade melayani transaksi pasar modal Indonesia dengan integritas dan kepatuhan regulasi OJK."
        }
        breadcrumbs={[
          { label: t.nav.home, href: "/" },
          { label: t.nav.companyProfile },
        ]}
      />

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="space-y-6 lg:col-span-8">
            <div className="rounded-2xl border border-slate-200 bg-white p-7 shadow-card sm:p-9">
              <h2 className="font-serif text-2xl font-bold text-navy-900">
                {isEn ? "About PT Ekokapital Sekuritas" : "Tentang PT Ekokapital Sekuritas"}
              </h2>
              <div className="mt-4 space-y-4 text-sm leading-relaxed text-slate-700 sm:text-base">
                <p>
                  {isEn
                    ? "PT Ekokapital Sekuritas was established under Deed No. 11 dated 12 July 2000 (originally under the name PT Ekodana Sekuritas) and ratified by the Minister of Justice and Human Rights of the Republic of Indonesia via Decree No. C-21397.HT.01.01. Th 2000."
                    : "PT Ekokapital Sekuritas didirikan berdasarkan Akta No. 11 tanggal 12 Juli 2000 dengan nama awal PT Ekodana Sekuritas dan memperoleh pengesahan dari Menteri Kehakiman dan Hak Asasi Manusia Republik Indonesia melalui Surat Keputusan No. C-21397.HT.01.01. Th 2000."}
                </p>
                <p>
                  {isEn
                    ? "On 30 November 2000, pursuant to Decision Letter No. KEP-07/PM/PPE/2000 from the Chairman of the Capital Market Supervisory Agency (Bapepam, now OJK), the Company obtained its official license as a Securities Broker-Dealer (Perantara Pedagang Efek)."
                    : "Pada tanggal 30 November 2000, berdasarkan Surat Keputusan Ketua Badan Pengawas Pasar Modal (Bapepam, kini OJK) No. KEP-07/PM/PPE/2000, Perseroan resmi memperoleh izin usaha sebagai Perantara Pedagang Efek."}
                </p>
                <p>
                  {isEn
                    ? "On 5 February 2001, through Board of Directors Letter No. SPAB-225/JATS/BEJ.ANG/02-2001, the Company received Exchange Member Approval from the Jakarta Stock Exchange (now Indonesia Stock Exchange / IDX) with Broker Code ES."
                    : "Pada tanggal 5 Februari 2001, melalui surat Direksi PT Bursa Efek Jakarta (kini PT Bursa Efek Indonesia) nomor SPAB-225/JATS/BEJ.ANG/02-2001, Perseroan memperoleh Surat Persetujuan Anggota Bursa (SPAB) dengan Kode Anggota Bursa ES."}
                </p>
              </div>
            </div>

            {/* Milestones */}
            <div className="rounded-2xl border border-slate-200 bg-white p-7 shadow-card sm:p-9">
              <h2 className="font-serif text-2xl font-bold text-navy-900">
                {isEn ? "Legal Milestones & Licensing" : "Tonggak Legalitas & Perizinan"}
              </h2>
              <div className="mt-6 space-y-6 border-l-2 border-navy-200 pl-6">
                {milestones.map((m) => (
                  <div key={m.date} className="relative">
                    <span className="absolute -left-[31px] top-1 h-3.5 w-3.5 rounded-full border-2 border-white bg-gold-500 ring-2 ring-navy-200" />
                    <p className="text-xs font-bold uppercase tracking-wider text-gold-600">
                      {m.date}
                    </p>
                    <h3 className="mt-1 text-base font-bold text-navy-900">{m.title}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-slate-600">{m.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Shareholding Summary */}
            <div className="rounded-2xl border border-slate-200 bg-white p-7 shadow-card sm:p-9">
              <div className="flex items-center justify-between gap-4">
                <h2 className="font-serif text-2xl font-bold text-navy-900">
                  {t.nav.ownership}
                </h2>
                <Link
                  href="/struktur-kepemilikan"
                  className="text-xs font-bold text-navy-700 underline hover:text-gold-600"
                >
                  {isEn ? "View Details" : "Lihat Detail"}
                </Link>
              </div>
              <div className="mt-5 overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-slate-200 text-xs uppercase tracking-wider text-slate-500">
                      <th className="py-3 pr-4">{isEn ? "Shareholder" : "Pemegang Saham"}</th>
                      <th className="py-3 px-4 text-right">{isEn ? "Shares" : "Jumlah Saham"}</th>
                      <th className="py-3 px-4 text-right">%</th>
                      <th className="py-3 pl-4 text-right">{isEn ? "Nominal (IDR)" : "Nilai (IDR)"}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {SHAREHOLDERS.map((s) => (
                      <tr key={s.name}>
                        <td className="py-3 pr-4 font-semibold text-navy-900">{s.name}</td>
                        <td className="py-3 px-4 text-right font-mono">{s.shares}</td>
                        <td className="py-3 px-4 text-right font-semibold text-navy-700">
                          {s.percentage}%
                        </td>
                        <td className="py-3 pl-4 text-right font-mono">{s.amountIdr}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="border-t-2 border-navy-200 bg-navy-50/50 font-bold text-navy-900">
                      <td className="py-3 pr-4">{isEn ? "Total Paid-Up Capital" : "Total Modal Disetor"}</td>
                      <td className="py-3 px-4 text-right font-mono">50.000</td>
                      <td className="py-3 px-4 text-right">100%</td>
                      <td className="py-3 pl-4 text-right font-mono">{COMPANY_INFO.paidUpCapital}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <aside className="space-y-6 lg:col-span-4">
            <div className="rounded-2xl border border-slate-200 bg-navy-900 p-6 text-white shadow-card">
              <p className="text-xs font-bold uppercase tracking-widest text-gold-300">
                {isEn ? "Corporate Facts" : "Data Resmi Perusahaan"}
              </p>
              <dl className="mt-4 space-y-4 text-sm">
                <div className="flex items-start gap-3">
                  <Building2 className="mt-0.5 h-4 w-4 shrink-0 text-gold-400" />
                  <div>
                    <dt className="text-xs text-navy-200">{isEn ? "Legal Entity" : "Nama Badan Hukum"}</dt>
                    <dd className="font-semibold text-white">{COMPANY_INFO.name}</dd>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Award className="mt-0.5 h-4 w-4 shrink-0 text-gold-400" />
                  <div>
                    <dt className="text-xs text-navy-200">{isEn ? "IDX Broker Code" : "Kode Anggota Bursa"}</dt>
                    <dd className="font-mono font-bold text-gold-300">{COMPANY_INFO.abCode}</dd>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <FileCheck2 className="mt-0.5 h-4 w-4 shrink-0 text-gold-400" />
                  <div>
                    <dt className="text-xs text-navy-200">{isEn ? "OJK License" : "Izin Usaha OJK"}</dt>
                    <dd className="font-medium text-white">{COMPANY_INFO.ojkLicense}</dd>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Landmark className="mt-0.5 h-4 w-4 shrink-0 text-gold-400" />
                  <div>
                    <dt className="text-xs text-navy-200">{isEn ? "Paid-Up Capital" : "Modal Disetor"}</dt>
                    <dd className="font-semibold text-white">{COMPANY_INFO.paidUpCapital}</dd>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-gold-400" />
                  <div>
                    <dt className="text-xs text-navy-200">{isEn ? "Supervision" : "Pengawasan"}</dt>
                    <dd className="text-xs text-navy-100">{t.ojkBadge}</dd>
                  </div>
                </div>
              </dl>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-card">
              <h3 className="text-sm font-bold uppercase tracking-wider text-navy-900">
                {isEn ? "Explore More" : "Halaman Terkait"}
              </h3>
              <ul className="mt-4 space-y-2 text-sm">
                {[
                  { label: t.nav.visionMission, href: "/visi-misi" },
                  { label: t.nav.management, href: "/manajemen" },
                  { label: t.nav.orgStructure, href: "/struktur-organisasi" },
                  { label: t.nav.wppe, href: "/karyawan-wppe" },
                  { label: t.nav.financialReports, href: "/tata-kelola/laporan-keuangan" },
                ].map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="block rounded-lg px-3 py-2 font-medium text-slate-700 transition hover:bg-navy-50 hover:text-navy-900"
                    >
                      → {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
