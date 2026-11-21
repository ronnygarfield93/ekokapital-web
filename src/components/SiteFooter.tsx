import Link from "next/link";
import { Lock, Mail, MapPin, Phone, ShieldCheck } from "lucide-react";
import { BrandLogo } from "./BrandLogo";
import { dictionary } from "@/lib/i18n";
import { COMPANY_INFO, REGULATORS } from "@/lib/company-data";
import type { Lang } from "@/lib/types";

interface SiteFooterProps {
  lang: Lang;
}

export function SiteFooter({ lang }: SiteFooterProps) {
  const t = dictionary[lang];
  const year = new Date().getFullYear();

  return (
    <footer className="bg-eko-footer text-slate-300">
      <div className="h-1 w-full bg-gradient-to-r from-navy-800 via-gold-400 to-navy-700" />
      {/* Regulators Bar */}
      <div className="border-b border-white/10 bg-white/[0.04] backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8">
          <div className="flex flex-col items-start justify-between gap-4 lg:flex-row lg:items-center">
            <div className="flex items-center gap-2.5 text-xs font-bold uppercase tracking-wider text-gold-300">
              <ShieldCheck className="h-4 w-4 shrink-0" />
              <span>{t.home.regulatorsTitle}</span>
            </div>
            <div className="flex flex-wrap items-center gap-2.5">
              {REGULATORS.map((reg) => (
                <a
                  key={reg.code}
                  href={reg.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={lang === "en" ? reg.nameEn : reg.nameId}
                  title={lang === "en" ? reg.nameEn : reg.nameId}
                  className="inline-flex h-9 items-center justify-center rounded-lg border border-white/15 bg-white/95 px-3 py-1.5 shadow-sm transition duration-150 hover:-translate-y-0.5 hover:bg-white hover:shadow-md"
                >
                  <img
                    src={reg.logo}
                    alt={lang === "en" ? reg.nameEn : reg.nameId}
                    className="h-5 w-auto max-w-[92px] object-contain sm:h-6"
                    loading="lazy"
                  />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Columns */}
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-12">
          {/* Brand Column */}
          <div className="space-y-4 lg:col-span-4">
            <BrandLogo variant="light" />
            <p className="text-sm leading-relaxed text-slate-400">
              {t.footer.aboutText}
            </p>
            <div className="inline-flex items-center gap-2 rounded-xl border border-gold-500/30 bg-gold-500/10 px-3.5 py-2 text-xs font-medium text-gold-200">
              <ShieldCheck className="h-4 w-4 shrink-0 text-gold-400" />
              <span>{t.footer.ojkNotice}</span>
            </div>
          </div>

          {/* Company Links */}
          <div className="lg:col-span-2">
            <h3 className="text-xs font-bold uppercase tracking-widest text-white">
              {t.footer.companyCol}
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li>
                <Link href="/company-profile" className="transition hover:text-gold-300">
                  {t.nav.companyProfile}
                </Link>
              </li>
              <li>
                <Link href="/visi-misi" className="transition hover:text-gold-300">
                  {t.nav.visionMission}
                </Link>
              </li>
              <li>
                <Link href="/manajemen" className="transition hover:text-gold-300">
                  {t.nav.management}
                </Link>
              </li>
              <li>
                <Link href="/struktur-kepemilikan" className="transition hover:text-gold-300">
                  {t.nav.ownership}
                </Link>
              </li>
              <li>
                <Link href="/struktur-organisasi" className="transition hover:text-gold-300">
                  {t.nav.orgStructure}
                </Link>
              </li>
              <li>
                <Link href="/karyawan-wppe" className="transition hover:text-gold-300">
                  {t.nav.wppe}
                </Link>
              </li>
            </ul>
          </div>

          {/* Services & Governance Links */}
          <div className="lg:col-span-3">
            <h3 className="text-xs font-bold uppercase tracking-widest text-white">
              {t.footer.servicesCol}
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li>
                <Link href="/layanan/online-trading" className="transition hover:text-gold-300">
                  {t.nav.onlineTrading}
                </Link>
              </li>
              <li>
                <Link href="/layanan/buka-rekening" className="transition hover:text-gold-300">
                  {t.nav.openAccount}
                </Link>
              </li>
              <li>
                <Link href="/layanan/penarikan-dana" className="transition hover:text-gold-300">
                  {t.nav.cashWithdraw}
                </Link>
              </li>
              <li>
                <Link href="/tata-kelola/laporan-keuangan" className="transition hover:text-gold-300">
                  {t.nav.financialReports}
                </Link>
              </li>
              <li>
                <Link href="/tata-kelola/gcg" className="transition hover:text-gold-300">
                  {t.nav.gcg}
                </Link>
              </li>
              <li>
                <Link href="/tata-kelola/pengaduan-nasabah" className="transition hover:text-gold-300">
                  {t.nav.complaints}
                </Link>
              </li>
              <li>
                <Link href="/tata-kelola/whistleblowing" className="transition hover:text-gold-300">
                  {t.nav.wbs}
                </Link>
              </li>
            </ul>
          </div>

          {/* Offices */}
          <div className="lg:col-span-3">
            <h3 className="text-xs font-bold uppercase tracking-widest text-white">
              {t.footer.officesCol}
            </h3>
            <div className="mt-4 space-y-4 text-sm text-slate-400">
              {COMPANY_INFO.offices.map((office) => (
                <div key={office.id} className="space-y-1">
                  <p className="font-semibold text-white">
                    {lang === "en" ? office.nameEn : office.nameId}
                  </p>
                  <p className="flex items-start gap-2 text-xs leading-relaxed">
                    <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-gold-400" />
                    <span>{office.address}</span>
                  </p>
                  <p className="flex items-center gap-2 text-xs">
                    <Phone className="h-3.5 w-3.5 shrink-0 text-gold-400" />
                    <span>{office.phone}</span>
                  </p>
                  <p className="flex items-center gap-2 text-xs">
                    <Mail className="h-3.5 w-3.5 shrink-0 text-gold-400" />
                    <span>{office.email}</span>
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Legal Bar */}
      <div className="border-t border-navy-800/80">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-5 text-xs text-slate-400 sm:flex-row sm:px-6 lg:px-8">
          <p>
            © {year} PT Ekokapital Sekuritas. {t.footer.rights}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
            <Link href="/legal/kebijakan-privasi" className="transition hover:text-gold-300">
              {t.footer.privacy}
            </Link>
            <Link href="/legal/disclaimer-website" className="transition hover:text-gold-300">
              {t.footer.websiteDisclaimer}
            </Link>
            <Link href="/legal/disclaimer-etop" className="transition hover:text-gold-300">
              {t.footer.etopDisclaimer}
            </Link>
            <Link
              href="/admin/login"
              className="inline-flex items-center gap-1 text-slate-500 transition hover:text-gold-300"
            >
              <Lock className="h-3 w-3" />
              {t.footer.adminPortal}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
