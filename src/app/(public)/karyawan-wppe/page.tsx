import { BadgeCheck } from "lucide-react";
import { PageHero } from "@/components/PageHero";
import { dictionary, pickLang } from "@/lib/i18n";
import { getServerLang } from "@/lib/server-lang";
import { getActiveWppeStaff } from "@/lib/queries";

export default async function KaryawanWppePage() {
  const lang = await getServerLang();
  const t = dictionary[lang];
  const isEn = lang === "en";
  const staff = getActiveWppeStaff();

  return (
    <>
      <PageHero
        eyebrow={t.nav.about}
        title={t.nav.wppe}
        subtitle={
          isEn
            ? "Official directory of PT Ekokapital Sekuritas personnel holding OJK Securities Broker Representative (WPPE) licenses."
            : "Daftar resmi karyawan PT Ekokapital Sekuritas yang memiliki izin Wakil Perantara Pedagang Efek (WPPE) dari OJK."
        }
        breadcrumbs={[
          { label: t.nav.home, href: "/" },
          { label: t.nav.wppe },
        ]}
      />

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-card">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 px-6 py-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-navy-900">
              <BadgeCheck className="h-5 w-5 text-gold-500" />
              <span>
                {isEn
                  ? `${staff.length} Active Licensed WPPE Professionals`
                  : `${staff.length} Profesional WPPE Berlisensi Aktif`}
              </span>
            </div>
            <span className="text-xs text-slate-500">
              {isEn ? "Verified OJK License Registry" : "Terdaftar & Berizin OJK"}
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
                <tr>
                  <th className="px-6 py-3.5">No</th>
                  <th className="px-6 py-3.5">{isEn ? "Full Name" : "Nama"}</th>
                  <th className="px-6 py-3.5">{isEn ? "License Type" : "Jenis Izin"}</th>
                  <th className="px-6 py-3.5">{isEn ? "OJK License Number" : "Nomor Izin WPPE"}</th>
                  <th className="px-6 py-3.5">{isEn ? "Position" : "Jabatan"}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {staff.map((person, idx) => (
                  <tr key={person.id} className="hover:bg-slate-50/80">
                    <td className="px-6 py-4 text-slate-500">{idx + 1}</td>
                    <td className="px-6 py-4 font-semibold text-navy-900">
                      {person.name}
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex rounded-full bg-navy-50 px-2.5 py-0.5 text-xs font-bold text-navy-700">
                        {person.license_type}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-mono text-xs text-slate-700">
                      {person.license_number}
                    </td>
                    <td className="px-6 py-4 text-slate-700">
                      {pickLang(lang, person.position_id, person.position_en)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </>
  );
}
