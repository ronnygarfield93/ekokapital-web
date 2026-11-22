"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  ChevronDown,
  Clock,
  Mail,
  Menu,
  Phone,
  X,
} from "lucide-react";
import { BrandLogo } from "./BrandLogo";
import { dictionary } from "@/lib/i18n";
import { COMPANY_INFO } from "@/lib/company-data";
import type { Lang } from "@/lib/types";

function FlagIndonesia() {
  return (
    <svg
      width="20"
      height="14"
      viewBox="0 0 20 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="shrink-0 rounded-[2px] ring-1 ring-black/15"
    >
      <rect width="20" height="7" fill="#CE1126" />
      <rect y="7" width="20" height="7" fill="#FFFFFF" />
    </svg>
  );
}

function FlagEnglish() {
  return (
    <svg
      width="20"
      height="14"
      viewBox="0 0 60 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="shrink-0 rounded-[2px] ring-1 ring-black/15"
    >
      <clipPath id="uk-clip">
        <rect width="60" height="40" rx="3" />
      </clipPath>
      <g clipPath="url(#uk-clip)">
        <rect width="60" height="40" fill="#012169" />
        <path d="M0 0L60 40M60 0L0 40" stroke="#FFFFFF" strokeWidth="7" />
        <path d="M0 0L60 40M60 0L0 40" stroke="#C8102E" strokeWidth="3.5" />
        <path d="M30 0V40M0 20H60" stroke="#FFFFFF" strokeWidth="11" />
        <path d="M30 0V40M0 20H60" stroke="#C8102E" strokeWidth="6.5" />
      </g>
    </svg>
  );
}

interface SiteHeaderProps {
  lang: Lang;
}

export function SiteHeader({ lang }: SiteHeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [switchingLang, setSwitchingLang] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const t = dictionary[lang];

  const switchLang = async (nextLang: Lang) => {
    if (nextLang === lang || switchingLang) return;
    setSwitchingLang(true);
    try {
      await fetch("/api/lang", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lang: nextLang }),
      });
      router.refresh();
    } finally {
      setSwitchingLang(false);
    }
  };

  const navGroups = [
    {
      key: "about",
      label: t.nav.about,
      items: [
        { label: t.nav.companyProfile, href: "/company-profile" },
        { label: t.nav.visionMission, href: "/visi-misi" },
        { label: t.nav.management, href: "/manajemen" },
        { label: t.nav.ownership, href: "/struktur-kepemilikan" },
        { label: t.nav.orgStructure, href: "/struktur-organisasi" },
        { label: t.nav.wppe, href: "/karyawan-wppe" },
      ],
    },
    {
      key: "services",
      label: t.nav.services,
      items: [
        { label: t.nav.onlineTrading, href: "/layanan/online-trading" },
        { label: t.nav.openAccount, href: "/layanan/buka-rekening" },
        { label: t.nav.remoteTrading, href: "/layanan/remote-trading" },
        { label: t.nav.cashWithdraw, href: "/layanan/penarikan-dana" },
      ],
    },
    {
      key: "governance",
      label: t.nav.governance,
      items: [
        { label: t.nav.financialReports, href: "/tata-kelola/laporan-keuangan" },
        { label: t.nav.rups, href: "/tata-kelola/rups" },
        { label: t.nav.gcg, href: "/tata-kelola/gcg" },
        { label: t.nav.complaints, href: "/tata-kelola/pengaduan-nasabah" },
        { label: t.nav.wbs, href: "/tata-kelola/whistleblowing" },
      ],
    },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-navy-100/80 bg-white/95 shadow-sm shadow-navy-900/5 backdrop-blur-md">
      {/* Top Institutional Utility Bar */}
      <div className="bg-eko-bar text-navy-100">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-2 px-4 py-2 text-xs sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center gap-x-5 gap-y-1">
            <span className="hidden items-center gap-1.5 sm:inline-flex">
              <Clock className="h-3.5 w-3.5 text-gold-300" />
              {t.hours}
            </span>
            <a
              href="tel:+622157904588"
              className="inline-flex items-center gap-1.5 transition hover:text-gold-300"
            >
              <Phone className="h-3.5 w-3.5 text-gold-300" />
              {COMPANY_INFO.csPhone}
            </a>
            <a
              href={`mailto:${COMPANY_INFO.csEmail}`}
              className="hidden items-center gap-1.5 transition hover:text-gold-300 md:inline-flex"
            >
              <Mail className="h-3.5 w-3.5 text-gold-300" />
              {COMPANY_INFO.csEmail}
            </a>
          </div>

          <div className="flex items-center gap-3">
            {/* Language Switcher with Flag Icons Only */}
            <div
              className="inline-flex items-center gap-1 rounded-lg border border-white/15 bg-navy-950/60 p-0.5"
              role="group"
              aria-label="Language switcher"
            >
              <button
                type="button"
                disabled={switchingLang}
                onClick={() => switchLang("id")}
                title="Bahasa Indonesia"
                aria-label="Bahasa Indonesia"
                className={`inline-flex items-center justify-center rounded-md px-2 py-1 transition duration-200 hover:-translate-y-0.5 active:scale-95 ${
                  lang === "id"
                    ? "bg-eko-gold-gradient shadow-sm ring-1 ring-gold-300/60"
                    : "opacity-65 hover:bg-white/10 hover:opacity-100"
                }`}
              >
                <FlagIndonesia />
              </button>
              <button
                type="button"
                disabled={switchingLang}
                onClick={() => switchLang("en")}
                title="English"
                aria-label="English"
                className={`inline-flex items-center justify-center rounded-md px-2 py-1 transition duration-200 hover:-translate-y-0.5 active:scale-95 ${
                  lang === "en"
                    ? "bg-eko-gold-gradient shadow-sm ring-1 ring-gold-300/60"
                    : "opacity-65 hover:bg-white/10 hover:opacity-100"
                }`}
              >
                <FlagEnglish />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3.5 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="shrink-0 transition-transform duration-200 hover:scale-[1.02] active:scale-[0.99] focus:outline-none"
          onClick={() => setMobileOpen(false)}
        >
          <BrandLogo variant="dark" />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-0.5 lg:flex" aria-label="Main navigation">
          <Link
            href="/"
            className={`eko-nav-item whitespace-nowrap rounded-lg px-3 py-2 text-sm font-semibold ${
              pathname === "/"
                ? "bg-navy-50 text-navy-800"
                : "text-slate-700 hover:bg-navy-50/70 hover:text-navy-900"
            }`}
          >
            {t.nav.home}
          </Link>

          {navGroups.map((group) => (
            <div
              key={group.key}
              className="relative"
              onMouseEnter={() => setOpenDropdown(group.key)}
              onMouseLeave={() => setOpenDropdown(null)}
            >
              <button
                type="button"
                onClick={() =>
                  setOpenDropdown((prev) => (prev === group.key ? null : group.key))
                }
                className="eko-nav-item inline-flex items-center gap-1 whitespace-nowrap rounded-lg px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-navy-50/70 hover:text-navy-900"
              >
                {group.label}
                <ChevronDown
                  className={`h-4 w-4 text-slate-400 transition-transform duration-200 ${
                    openDropdown === group.key ? "rotate-180 text-gold-600" : ""
                  }`}
                />
              </button>

              {openDropdown === group.key && (
                <div className="absolute left-0 top-full pt-1.5">
                  <div className="eko-dropdown-enter w-64 rounded-2xl border border-navy-100 bg-white/95 p-2 shadow-2xl shadow-navy-900/15 backdrop-blur-md">
                    {group.items.map((item) => {
                      const active = pathname === item.href;
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => setOpenDropdown(null)}
                          className={`group flex items-center justify-between rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all duration-200 hover:translate-x-1 ${
                            active
                              ? "bg-navy-50 font-semibold text-navy-900"
                              : "text-slate-700 hover:bg-gradient-to-r hover:from-navy-50/80 hover:to-gold-50/50 hover:text-navy-900"
                          }`}
                        >
                          <span>{item.label}</span>
                          <span className="h-1.5 w-1.5 rounded-full bg-gold-500 opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          ))}

          <Link
            href="/berita"
            className={`eko-nav-item whitespace-nowrap rounded-lg px-3 py-2 text-sm font-semibold ${
              pathname.startsWith("/berita")
                ? "bg-navy-50 text-navy-800"
                : "text-slate-700 hover:bg-navy-50/70 hover:text-navy-900"
            }`}
          >
            {t.nav.news}
          </Link>

          <Link
            href="/kontak"
            className={`eko-nav-item whitespace-nowrap rounded-lg px-3 py-2 text-sm font-semibold ${
              pathname === "/kontak"
                ? "bg-navy-50 text-navy-800"
                : "text-slate-700 hover:bg-navy-50/70 hover:text-navy-900"
            }`}
          >
            {t.nav.contact}
          </Link>
        </nav>

        {/* Right CTA + Mobile Toggle */}
        <div className="flex shrink-0 items-center gap-2.5">
          <Link
            href="/layanan/buka-rekening"
            className="bg-eko-navy-btn eko-btn-shine hidden whitespace-nowrap rounded-xl px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-navy-900/15 sm:inline-flex"
          >
            {t.nav.openAccountCta}
          </Link>

          <button
            type="button"
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-label="Toggle Menu"
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-navy-900 transition hover:bg-slate-100 lg:hidden"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileOpen && (
        <div className="max-h-[80vh] overflow-y-auto border-t border-slate-200 bg-white px-4 pb-6 pt-4 shadow-xl lg:hidden">
          <div className="space-y-4">
            <Link
              href="/"
              onClick={() => setMobileOpen(false)}
              className="block rounded-lg px-3 py-2 text-sm font-bold text-navy-900 hover:bg-slate-50"
            >
              {t.nav.home}
            </Link>

            {navGroups.map((group) => (
              <div key={group.key} className="space-y-1 border-t border-slate-100 pt-3">
                <p className="px-3 text-xs font-bold uppercase tracking-wider text-gold-600">
                  {group.label}
                </p>
                {group.items.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className="block rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-navy-50 hover:text-navy-900"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            ))}

            <div className="space-y-1 border-t border-slate-100 pt-3">
              <Link
                href="/berita"
                onClick={() => setMobileOpen(false)}
                className="block rounded-lg px-3 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-50"
              >
                {t.nav.news}
              </Link>
              <Link
                href="/kontak"
                onClick={() => setMobileOpen(false)}
                className="block rounded-lg px-3 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-50"
              >
                {t.nav.contact}
              </Link>
            </div>

            <Link
              href="/layanan/buka-rekening"
              onClick={() => setMobileOpen(false)}
              className="block w-full rounded-xl bg-navy-800 px-4 py-3 text-center text-sm font-semibold text-white"
            >
              {t.nav.openAccountCta}
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
