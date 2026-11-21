import { Clock, ExternalLink, Mail, MapPin, Phone, Printer } from "lucide-react";
import { PageHero } from "@/components/PageHero";
import { SecureSubmissionForm } from "@/components/SecureSubmissionForm";
import { dictionary } from "@/lib/i18n";
import { getServerLang } from "@/lib/server-lang";
import { COMPANY_INFO } from "@/lib/company-data";

export default async function KontakPage() {
  const lang = await getServerLang();
  const t = dictionary[lang];
  const isEn = lang === "en";

  return (
    <>
      <PageHero
        eyebrow={t.nav.contact}
        title={isEn ? "Contact PT Ekokapital Sekuritas" : "Hubungi PT Ekokapital Sekuritas"}
        subtitle={
          isEn
            ? "Reach our Jakarta Head Office or Surabaya Branch Office, or send us a message securely online."
            : "Hubungi Kantor Pusat Jakarta maupun Kantor Cabang Surabaya, atau kirimkan pertanyaan Anda melalui formulir online resmi kami."
        }
        breadcrumbs={[
          { label: t.nav.home, href: "/" },
          { label: t.nav.contact },
        ]}
      />

      <section className="mx-auto max-w-7xl space-y-12 px-4 py-16 sm:px-6 lg:px-8">
        {/* Office Cards + Maps */}
        <div className="grid gap-8 lg:grid-cols-2">
          {COMPANY_INFO.offices.map((office) => (
            <div
              key={office.id}
              className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-card"
            >
              <div className="p-6 sm:p-7">
                <h2 className="font-serif text-xl font-bold text-navy-900">
                  {isEn ? office.nameEn : office.nameId}
                </h2>

                <dl className="mt-4 space-y-2.5 text-sm text-slate-700">
                  <div className="flex items-start gap-2.5">
                    <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold-600" />
                    <dd>{office.address}</dd>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Phone className="h-4 w-4 shrink-0 text-gold-600" />
                    <dd>{office.phone}</dd>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Printer className="h-4 w-4 shrink-0 text-gold-600" />
                    <dd>Fax: {office.fax}</dd>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Mail className="h-4 w-4 shrink-0 text-gold-600" />
                    <dd>{office.email}</dd>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Clock className="h-4 w-4 shrink-0 text-gold-600" />
                    <dd>{t.hours}</dd>
                  </div>
                </dl>

                <a
                  href={office.mapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-navy-700 hover:text-gold-600"
                >
                  {isEn ? "Open in Google Maps" : "Buka di Google Maps"}
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </div>

              <iframe
                title={isEn ? office.nameEn : office.nameId}
                src={office.mapEmbed}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="h-60 w-full border-t border-slate-200"
              />
            </div>
          ))}
        </div>

        {/* Contact Form */}
        <div className="mx-auto max-w-3xl">
          <div className="text-center">
            <h2 className="font-serif text-2xl font-bold text-navy-900 sm:text-3xl">
              {isEn ? "Send Us a Direct Message" : "Kirim Pesan Langsung"}
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              {isEn
                ? "Our Customer Service team will respond during operating hours (Mon–Fri, 08:00–17:00 WIB)."
                : "Tim Customer Service kami akan merespons pesan Anda pada jam operasional (Senin–Jumat, 08:00–17:00 WIB)."}
            </p>
          </div>
          <div className="mt-6">
            <SecureSubmissionForm type="contact" lang={lang} />
          </div>
        </div>
      </section>
    </>
  );
}
