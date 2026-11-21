import { PageHero } from "@/components/PageHero";
import { dictionary } from "@/lib/i18n";
import { getServerLang } from "@/lib/server-lang";

export default async function DisclaimerWebsitePage() {
  const lang = await getServerLang();
  const t = dictionary[lang];
  const isEn = lang === "en";

  const items = isEn
    ? [
        "All materials published on ekokapital.com are provided strictly for informational and educational purposes and are not intended to violate any applicable laws.",
        "PT Ekokapital Sekuritas is not responsible for unauthorized redistribution or misuse of site content by third parties.",
        "While information is sourced from reliable references, PT Ekokapital Sekuritas makes no express or implied warranty regarding 100% completeness or real-time accuracy.",
        "PT Ekokapital Sekuritas shall not be liable for any direct or indirect loss arising from accessing this website or external websites linked herein.",
        "All trademarks, logos, and original content are protected by Intellectual Property laws; visitors agree to comply with applicable copyright provisions.",
      ]
    : [
        "Seluruh konten yang dipublikasikan pada situs ekokapital.com disediakan semata-mata untuk tujuan informasi dan edukasi serta tidak dimaksudkan untuk melanggar ketentuan hukum yang berlaku.",
        "PT Ekokapital Sekuritas tidak bertanggung jawab atas penyebarluasan atau penyalahgunaan materi situs ini secara tidak sah oleh pihak lain.",
        "Meskipun informasi dihimpun dari sumber yang dapat dipercaya, PT Ekokapital Sekuritas tidak memberikan jaminan mutlak atas keakuratan atau kelengkapan informasi setiap saat.",
        "PT Ekokapital Sekuritas tidak bertanggung jawab atas kerugian langsung maupun tidak langsung yang timbul akibat penggunaan situs ini maupun tautan ke situs eksternal.",
        "Seluruh merek dagang, logo, dan materi situs dilindungi hukum Hak Kekayaan Intelektual yang wajib dipatuhi oleh setiap pengunjung.",
      ];

  return (
    <>
      <PageHero
        eyebrow="Legal & Compliance"
        title={t.footer.websiteDisclaimer}
        breadcrumbs={[
          { label: t.nav.home, href: "/" },
          { label: t.footer.websiteDisclaimer },
        ]}
      />

      <section className="mx-auto max-w-4xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="space-y-4 rounded-3xl border border-slate-200 bg-white p-7 shadow-card sm:p-10">
          {items.map((text, idx) => (
            <p key={idx} className="text-sm leading-relaxed text-slate-700">
              {idx + 1}. {text}
            </p>
          ))}
        </div>
      </section>
    </>
  );
}
