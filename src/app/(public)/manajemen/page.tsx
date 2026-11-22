import { PageHero } from "@/components/PageHero";
import { dictionary } from "@/lib/i18n";
import { getServerLang } from "@/lib/server-lang";
import { MANAGEMENT } from "@/lib/company-data";

export default async function ManajemenPage() {
  const lang = await getServerLang();
  const t = dictionary[lang];
  const isEn = lang === "en";

  return (
    <>
      <PageHero
        eyebrow={t.nav.about}
        title={t.nav.management}
        subtitle={
          isEn
            ? "Experienced leadership overseeing corporate governance, operational excellence, and client trust."
            : "Jajaran manajemen berpengalaman yang mengawal tata kelola perusahaan, operasional perdagangan efek, dan kepercayaan nasabah."
        }
        breadcrumbs={[
          { label: t.nav.home, href: "/" },
          { label: t.nav.management },
        ]}
      />

      <section className="mx-auto max-w-7xl space-y-14 px-4 py-16 sm:px-6 lg:px-8">
        {/* Board of Commissioners */}
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-gold-600">
            {isEn ? "Supervisory Board" : "Pengawasan Perusahaan"}
          </p>
          <h2 className="mt-1 font-serif text-3xl font-bold text-navy-900">
            {isEn ? "Board of Commissioners" : "Dewan Komisaris"}
          </h2>

          <div className="mt-6 grid gap-6 md:grid-cols-2">
            {MANAGEMENT.commissioners.map((p) => (
              <article
                key={p.name}
                className="eko-card-lift rounded-2xl border border-slate-200 bg-white p-7 shadow-card"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-navy-900 to-navy-700 font-serif text-xl font-bold text-gold-300">
                    {p.initials}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-navy-900">{p.name}</h3>
                    <p className="text-sm font-semibold text-gold-600">
                      {isEn ? p.roleEn : p.roleId}
                    </p>
                    <p className="text-xs text-slate-500">
                      {isEn ? `Appointed ${p.since}` : `Menjabat sejak ${p.since}`}
                    </p>
                  </div>
                </div>
                <p className="mt-5 text-sm leading-relaxed text-slate-700">
                  {isEn ? p.bioEn : p.bioId}
                </p>
              </article>
            ))}
          </div>
        </div>

        {/* Board of Directors */}
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-gold-600">
            {isEn ? "Executive Management" : "Pengurus Eksekutif"}
          </p>
          <h2 className="mt-1 font-serif text-3xl font-bold text-navy-900">
            {isEn ? "Board of Directors" : "Dewan Direksi"}
          </h2>

          <div className="mt-6 grid gap-6 md:grid-cols-2">
            {MANAGEMENT.directors.map((p) => (
              <article
                key={p.name}
                className="eko-card-lift rounded-2xl border border-slate-200 bg-white p-7 shadow-card"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-navy-800 to-navy-600 font-serif text-xl font-bold text-gold-300">
                    {p.initials}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-navy-900">{p.name}</h3>
                    <p className="text-sm font-semibold text-gold-600">
                      {isEn ? p.roleEn : p.roleId}
                    </p>
                    <p className="text-xs text-slate-500">
                      {isEn ? `Appointed ${p.since}` : `Menjabat sejak ${p.since}`}
                    </p>
                  </div>
                </div>
                <p className="mt-5 text-sm leading-relaxed text-slate-700">
                  {isEn ? p.bioEn : p.bioId}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
