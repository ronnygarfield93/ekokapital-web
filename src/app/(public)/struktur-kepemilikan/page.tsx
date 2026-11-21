import { PageHero } from "@/components/PageHero";
import { dictionary } from "@/lib/i18n";
import { getServerLang } from "@/lib/server-lang";
import { COMPANY_INFO, SHAREHOLDERS } from "@/lib/company-data";

export default async function StrukturKepemilikanPage() {
  const lang = await getServerLang();
  const t = dictionary[lang];
  const isEn = lang === "en";

  return (
    <>
      <PageHero
        eyebrow={t.nav.about}
        title={t.nav.ownership}
        subtitle={
          isEn
            ? "Transparent capital structure and paid-up share ownership of PT Ekokapital Sekuritas."
            : "Transparansi komposisi pemegang saham serta modal ditempatkan dan disetor penuh PT Ekokapital Sekuritas."
        }
        breadcrumbs={[
          { label: t.nav.home, href: "/" },
          { label: t.nav.ownership },
        ]}
      />

      <section className="mx-auto max-w-5xl space-y-8 px-4 py-16 sm:px-6 lg:px-8">
        {/* Visual Ownership Bars */}
        <div className="rounded-2xl border border-slate-200 bg-white p-7 shadow-card sm:p-9">
          <h2 className="font-serif text-2xl font-bold text-navy-900">
            {isEn ? "Ownership Composition" : "Komposisi Kepemilikan Saham"}
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            {isEn
              ? `Total issued and fully paid-up capital: ${COMPANY_INFO.paidUpCapital} (50,000 shares).`
              : `Total modal ditempatkan dan disetor penuh: ${COMPANY_INFO.paidUpCapital} (50.000 lembar saham).`}
          </p>

          <div className="mt-6 space-y-5">
            {SHAREHOLDERS.map((s) => (
              <div key={s.name}>
                <div className="flex items-center justify-between text-sm">
                  <span className="font-bold text-navy-900">{s.name}</span>
                  <span className="font-mono font-semibold text-navy-700">
                    {s.percentage}% ({s.amountIdr})
                  </span>
                </div>
                <div className="mt-2 h-3 w-full overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-navy-800 to-gold-500"
                    style={{ width: `${Math.max(s.percentage, 3)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Detailed Table */}
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-card">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-navy-900 text-xs uppercase tracking-wider text-navy-100">
                <tr>
                  <th className="px-6 py-4">No</th>
                  <th className="px-6 py-4">
                    {isEn ? "Shareholder" : "Pemegang Saham"}
                  </th>
                  <th className="px-6 py-4 text-right">
                    {isEn ? "Issued & Paid Shares" : "Jumlah Saham Disetor"}
                  </th>
                  <th className="px-6 py-4 text-right">
                    {isEn ? "Ownership (%)" : "Persentase (%)"}
                  </th>
                  <th className="px-6 py-4 text-right">
                    {isEn ? "Amount (IDR)" : "Jumlah (IDR)"}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {SHAREHOLDERS.map((s, idx) => (
                  <tr key={s.name} className="hover:bg-slate-50">
                    <td className="px-6 py-4 text-slate-500">{idx + 1}</td>
                    <td className="px-6 py-4 font-bold text-navy-900">{s.name}</td>
                    <td className="px-6 py-4 text-right font-mono">{s.shares}</td>
                    <td className="px-6 py-4 text-right font-bold text-navy-700">
                      {s.percentage}%
                    </td>
                    <td className="px-6 py-4 text-right font-mono">{s.amountIdr}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="bg-navy-50 font-bold text-navy-900">
                  <td colSpan={2} className="px-6 py-4">
                    {isEn ? "Total" : "Jumlah Total"}
                  </td>
                  <td className="px-6 py-4 text-right font-mono">50.000</td>
                  <td className="px-6 py-4 text-right">100%</td>
                  <td className="px-6 py-4 text-right font-mono">
                    {COMPANY_INFO.paidUpCapital}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </section>
    </>
  );
}
