import { CheckCircle2, Compass, Sparkles, Target } from "lucide-react";
import { PageHero } from "@/components/PageHero";
import { dictionary } from "@/lib/i18n";
import { getServerLang } from "@/lib/server-lang";
import { VISION_MISSION } from "@/lib/company-data";

export default async function VisiMisiPage() {
  const lang = await getServerLang();
  const t = dictionary[lang];
  const isEn = lang === "en";

  return (
    <>
      <PageHero
        eyebrow={t.nav.about}
        title={t.nav.visionMission}
        subtitle={
          isEn
            ? "Our purpose, strategic direction, and corporate values in serving Indonesia's capital market."
            : "Arah strategis, tujuan utama, serta tata nilai perusahaan dalam melayani investor pasar modal Indonesia."
        }
        breadcrumbs={[
          { label: t.nav.home, href: "/" },
          { label: t.nav.visionMission },
        ]}
      />

      <section className="mx-auto max-w-7xl space-y-10 px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Vision Card */}
          <div className="bg-eko-hero rounded-3xl p-8 text-white shadow-xl sm:p-10">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gold-500/20 text-gold-300">
              <Compass className="h-6 w-6" />
            </div>
            <p className="mt-5 text-xs font-bold uppercase tracking-[0.2em] text-gold-300">
              {isEn ? "Our Vision" : "Visi Perusahaan"}
            </p>
            <blockquote className="mt-3 font-serif text-2xl font-bold leading-snug text-white">
              &ldquo;{isEn ? VISION_MISSION.vision.en : VISION_MISSION.vision.id}&rdquo;
            </blockquote>
          </div>

          {/* Mission Card */}
          <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-card sm:p-10">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-navy-50 text-navy-700">
              <Target className="h-6 w-6" />
            </div>
            <p className="mt-5 text-xs font-bold uppercase tracking-[0.2em] text-gold-600">
              {isEn ? "Our Mission" : "Misi Perusahaan"}
            </p>
            <ul className="mt-4 space-y-4">
              {(isEn ? VISION_MISSION.missions.en : VISION_MISSION.missions.id).map(
                (item, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-sm leading-relaxed text-slate-700">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-gold-500" />
                    <span>{item}</span>
                  </li>
                )
              )}
            </ul>
          </div>
        </div>

        {/* Core Values */}
        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-card sm:p-10">
          <div className="flex items-center gap-2.5 text-gold-600">
            <Sparkles className="h-5 w-5" />
            <span className="text-xs font-bold uppercase tracking-[0.2em]">
              {isEn ? "Corporate Values (GCG)" : "Tata Nilai Perusahaan (GCG)"}
            </span>
          </div>
          <h2 className="mt-2 font-serif text-2xl font-bold text-navy-900 sm:text-3xl">
            {isEn ? "Four Pillars of Professional Integrity" : "Empat Pilar Integritas Profesional"}
          </h2>

          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {VISION_MISSION.gcgValues.map((val, idx) => (
              <div
                key={val.key}
                className="rounded-2xl border border-slate-200 bg-slate-50 p-6"
              >
                <span className="font-mono text-xs font-bold text-gold-600">
                  0{idx + 1}
                </span>
                <h3 className="mt-2 text-lg font-bold text-navy-900">
                  {isEn ? val.titleEn : val.titleId}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">
                  {isEn ? val.descEn : val.descId}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
