import Link from "next/link";
import {
  ArrowRight,
  Award,
  BookOpen,
  Building2,
  CheckCircle2,
  Download,
  ExternalLink,
  FileText,
  Landmark,
  Laptop,
  Scale,
  ShieldCheck,
  Smartphone,
  TrendingUp,
  UserPlus,
  Users,
  Wallet,
} from "lucide-react";
import { dictionary, pickLang } from "@/lib/i18n";
import { getServerLang } from "@/lib/server-lang";
import { COMPANY_INFO, MANAGEMENT } from "@/lib/company-data";
import { getActiveWppeStaff, getPublishedPosts } from "@/lib/queries";

export default async function HomePage() {
  const lang = await getServerLang();
  const t = dictionary[lang];
  const isEn = lang === "en";
  const latestPosts = getPublishedPosts({ limit: 3 });
  const wppeCount = getActiveWppeStaff().length;

  const services = [
    {
      icon: Laptop,
      title: isEn ? "Online & Mobile Trading (e-TOP)" : "Online & Mobile Trading (e-TOP)",
      desc: isEn
        ? "Real-time market data, fast order execution, and portfolio tracking across Windows, macOS, Android, and iOS."
        : "Data pasar real-time, eksekusi order cepat, dan pemantauan portofolio di Windows, macOS, Android, serta iOS.",
      href: "/layanan/online-trading",
      badge: "e-TOP Platform",
    },
    {
      icon: UserPlus,
      title: isEn ? "Securities Account Opening" : "Pembukaan Rekening Efek",
      desc: isEn
        ? "Open an Individual or Corporate securities account & RDN (Bank Mandiri / BCA) using our official registration forms."
        : "Buka rekening efek Individu maupun Korporasi beserta RDN (Bank Mandiri / BCA) melalui formulir pendaftaran resmi kami.",
      href: "/layanan/buka-rekening",
      badge: isEn ? "Individual & Corp" : "Individu & Korporasi",
    },
    {
      icon: TrendingUp,
      title: isEn ? "Remote & Institutional Brokerage" : "Remote & Institutional Trading",
      desc: isEn
        ? "Dedicated execution desk supported by OJK-licensed WPPE Equity Sales professionals for equities and bonds on IDX."
        : "Layanan transaksi saham dan obligasi dengan dukungan tim Equity Sales WPPE berlisensi OJK yang berpengalaman.",
      href: "/layanan/remote-trading",
      badge: "IDX Member ES",
    },
    {
      icon: Wallet,
      title: isEn ? "Cash Withdrawal" : "Penarikan Dana (Cash Withdraw)",
      desc: isEn
        ? "Structured RDN fund withdrawal process directly to your registered personal bank account with verified confirmation."
        : "Prosedur penarikan dana RDN langsung ke rekening bank terdaftar nasabah dengan verifikasi keamanan berlapis.",
      href: "/layanan/penarikan-dana",
      badge: "RDN Direct",
    },
  ];

  const governanceLinks = [
    {
      icon: FileText,
      title: t.nav.financialReports,
      desc: isEn
        ? "Audited annual financial statements"
        : "Laporan keuangan auditan tahunan",
      href: "/tata-kelola/laporan-keuangan",
    },
    {
      icon: Scale,
      title: t.nav.gcg,
      desc: isEn
        ? "Code of Ethics, Risk Policy & Charters"
        : "Kode Etik, Manajemen Risiko & Piagam",
      href: "/tata-kelola/gcg",
    },
    {
      icon: Landmark,
      title: t.nav.rups,
      desc: isEn
        ? "Summary of GMS resolutions"
        : "Ringkasan risalah Rapat Umum Pemegang Saham",
      href: "/tata-kelola/rups",
    },
    {
      icon: ShieldCheck,
      title: t.nav.complaints,
      desc: isEn
        ? "POJK 18/2018 complaint handling & online form"
        : "Layanan pengaduan POJK 18/2018 & form online",
      href: "/tata-kelola/pengaduan-nasabah",
    },
  ];

  return (
    <>
      {/* HERO SECTION */}
      <section className="bg-eko-hero relative overflow-hidden text-white">
        <div className="hero-grid-pattern absolute inset-0" />
        <div className="absolute -right-28 -top-12 h-[540px] w-[540px] rounded-full bg-gold-400/20 blur-3xl" />
        <div className="absolute -left-24 bottom-0 h-96 w-96 rounded-full bg-sky-400/20 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
          <div className="grid items-center gap-12 lg:grid-cols-12">
            {/* Left Copy */}
            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-2 rounded-full border border-gold-300/35 bg-gradient-to-r from-gold-500/20 to-navy-700/40 px-4 py-1.5 text-xs font-semibold text-gold-200 backdrop-blur-sm">
                <ShieldCheck className="h-4 w-4 text-gold-300" />
                <span>{t.home.heroBadge}</span>
              </div>

              <h1 className="mt-6 font-serif text-4xl font-bold leading-[1.15] tracking-tight text-white sm:text-5xl lg:text-[3.25rem]">
                {t.home.heroTitle}
              </h1>

              <p className="mt-5 max-w-2xl text-base leading-relaxed text-navy-100/90 sm:text-lg">
                {t.home.heroSubtitle}
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-3.5">
                <Link
                  href="/layanan/buka-rekening"
                  className="bg-eko-gold-gradient inline-flex items-center gap-2 rounded-xl px-6 py-3.5 text-sm font-bold text-navy-950 shadow-lg shadow-gold-500/25 transition"
                >
                  {t.home.heroPrimaryCta}
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/layanan/online-trading"
                  className="inline-flex items-center gap-2 rounded-xl border border-white/25 bg-gradient-to-r from-white/15 to-white/5 px-6 py-3.5 text-sm font-semibold text-white backdrop-blur-sm transition hover:border-gold-300/50 hover:from-white/20 hover:to-white/10"
                >
                  <Download className="h-4 w-4 text-gold-300" />
                  {t.home.heroSecondaryCta}
                </Link>
              </div>

              <p className="mt-6 text-xs text-navy-200/85">
                {t.ojkBadge} • {COMPANY_INFO.ojkLicense}
              </p>
            </div>

            {/* Right Institutional Highlight Card */}
            <div className="lg:col-span-5">
              <div className="rounded-3xl border border-white/20 bg-gradient-to-br from-navy-950/80 via-navy-900/70 to-navy-800/60 p-6 shadow-2xl backdrop-blur-md sm:p-7">
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-gold-300">
                      {isEn ? "Quick Access Portal" : "Akses Cepat Nasabah"}
                    </p>
                    <h2 className="mt-1 font-serif text-xl font-bold text-white">
                      {isEn ? "Ekokapital e-TOP & Client Services" : "Ekokapital e-TOP & Layanan"}
                    </h2>
                  </div>
                  <span className="rounded-xl bg-gold-500/20 px-3 py-1.5 font-mono text-sm font-bold text-gold-300">
                    AB: ES
                  </span>
                </div>

                <div className="mt-5 space-y-3">
                  <Link
                    href="/layanan/buka-rekening"
                    className="group flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 p-4 transition hover:border-gold-400/50 hover:bg-white/10"
                  >
                    <div className="flex items-center gap-3.5">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gold-500/20 text-gold-300">
                        <UserPlus className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-white">
                          {isEn ? "Securities Account Opening" : "Pembukaan Rekening Efek"}
                        </p>
                        <p className="text-xs text-navy-200">
                          {isEn ? "Download Forms & RDN Guide" : "Unduh Formulir & Panduan RDN"}
                        </p>
                      </div>
                    </div>
                    <ArrowRight className="h-4 w-4 text-navy-300 transition group-hover:translate-x-0.5 group-hover:text-gold-300" />
                  </Link>

                  <Link
                    href="/layanan/online-trading"
                    className="group flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 p-4 transition hover:border-gold-400/50 hover:bg-white/10"
                  >
                    <div className="flex items-center gap-3.5">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-navy-600/60 text-sky-300">
                        <Smartphone className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-white">
                          e-TOP Mobile & Desktop
                        </p>
                        <p className="text-xs text-navy-200">
                          Windows, macOS, Android & iOS
                        </p>
                      </div>
                    </div>
                    <ArrowRight className="h-4 w-4 text-navy-300 transition group-hover:translate-x-0.5 group-hover:text-gold-300" />
                  </Link>

                  <a
                    href={COMPANY_INFO.aksesKseiUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 p-4 transition hover:border-gold-400/50 hover:bg-white/10"
                  >
                    <div className="flex items-center gap-3.5">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-300">
                        <ShieldCheck className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-white">AKSes KSEI</p>
                        <p className="text-xs text-navy-200">
                          {isEn
                            ? "Verify Portfolio & RDN Holdings"
                            : "Pantau Portofolio Efek & RDN"}
                        </p>
                      </div>
                    </div>
                    <ExternalLink className="h-4 w-4 text-navy-300 transition group-hover:text-gold-300" />
                  </a>
                </div>

                <div className="mt-5 flex items-center justify-between border-t border-white/10 pt-4 text-xs text-navy-200">
                  <span>{isEn ? "Client Helpdesk:" : "Layanan Nasabah:"}</span>
                  <span className="font-semibold text-white">
                    {COMPANY_INFO.csPhone}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TRUST METRICS STRIP */}
      <section className="relative z-10 -mt-6 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-2xl border border-navy-100 bg-gradient-to-br from-white via-white to-navy-50/60 shadow-card">
          <div className="h-1 w-full bg-gradient-to-r from-navy-800 via-navy-500 to-gold-400" />
          <div className="grid gap-4 p-6 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { label: t.home.trustYears, desc: t.home.trustYearsDesc, icon: Award },
            { label: t.home.trustCapital, desc: t.home.trustCapitalDesc, icon: Building2 },
            { label: t.home.trustRegulated, desc: t.home.trustRegulatedDesc, icon: ShieldCheck },
            { label: t.home.trustPlatform, desc: t.home.trustPlatformDesc, icon: Laptop },
          ].map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                className="flex items-start gap-3.5 rounded-xl p-2"
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-navy-800 to-navy-600 text-gold-300 shadow-sm">
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-serif text-xl font-bold text-navy-900">
                    {stat.label}
                  </p>
                  <p className="mt-0.5 text-xs leading-relaxed text-slate-600">
                    {stat.desc}
                  </p>
                </div>
              </div>
            );
          })}
          </div>
        </div>
      </section>

      {/* CORE SERVICES */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-gold-600">
            {t.home.servicesEyebrow}
          </p>
          <h2 className="mt-2 font-serif text-3xl font-bold tracking-tight text-navy-900 sm:text-4xl">
            {t.home.servicesTitle}
          </h2>
          <p className="mt-3 text-base text-slate-600">{t.home.servicesDesc}</p>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((svc) => {
            const Icon = svc.icon;
            return (
              <Link
                key={svc.href}
                href={svc.href}
                className="group flex flex-col justify-between rounded-2xl border border-slate-200/90 bg-gradient-to-b from-white to-slate-50/70 p-6 shadow-card transition duration-200 hover:-translate-y-1 hover:border-navy-300 hover:from-white hover:to-navy-50/50 hover:shadow-card-hover"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-navy-100 to-navy-50 text-navy-700 transition group-hover:from-navy-800 group-hover:to-navy-600 group-hover:text-gold-300">
                      <Icon className="h-6 w-6" />
                    </div>
                    <span className="rounded-full bg-gradient-to-r from-navy-50 to-gold-50 px-2.5 py-1 text-[11px] font-semibold text-navy-700">
                      {svc.badge}
                    </span>
                  </div>
                  <h3 className="mt-5 text-lg font-bold text-navy-900 group-hover:text-navy-700">
                    {svc.title}
                  </h3>
                  <p className="mt-2.5 text-sm leading-relaxed text-slate-600">
                    {svc.desc}
                  </p>
                </div>

                <div className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-navy-700 group-hover:text-gold-600">
                  <span>{t.home.learnMore}</span>
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* GOVERNANCE & OJK COMPLIANCE SECTION */}
      <section className="bg-eko-hero relative overflow-hidden py-20 text-white">
        <div className="hero-grid-pattern absolute inset-0 opacity-60" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-gold-300">
                {t.home.governanceEyebrow}
              </p>
              <h2 className="mt-2 font-serif text-3xl font-bold tracking-tight text-white sm:text-4xl">
                {t.home.governanceTitle}
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-navy-100/90 sm:text-base">
                {t.home.governanceDesc}
              </p>

              <ul className="mt-6 space-y-2.5 text-sm text-navy-100">
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-gold-400" />
                  <span>
                    {isEn
                      ? "UU No. 27/2022 Personal Data Protection (UU PDP) Compliant"
                      : "Kepatuhan Pelindungan Data Pribadi (UU No. 27/2022)"}
                  </span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-gold-400" />
                  <span>
                    {isEn
                      ? "Customer Complaint Resolution per POJK 18/POJK.07/2018"
                      : "Penanganan Pengaduan Nasabah sesuai POJK 18/POJK.07/2018"}
                  </span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-gold-400" />
                  <span>
                    {isEn
                      ? "Confidential Whistleblowing System (WBS)"
                      : "Sistem Pelaporan Pelanggaran (Whistleblowing System)"}
                  </span>
                </li>
              </ul>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href="/tata-kelola/whistleblowing"
                  className="bg-eko-gold-gradient inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-bold text-navy-950 shadow-lg shadow-gold-500/20 transition"
                >
                  {t.nav.wbs}
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/legal/kebijakan-privasi"
                  className="inline-flex items-center gap-2 rounded-xl border border-white/25 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/15"
                >
                  {t.footer.privacy}
                </Link>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:col-span-7">
              {governanceLinks.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="group rounded-2xl border border-white/15 bg-gradient-to-br from-white/10 to-white/[0.03] p-6 backdrop-blur-sm transition hover:border-gold-400/60 hover:from-white/15 hover:to-white/5"
                  >
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gold-500/15 text-gold-300">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="mt-4 text-base font-bold text-white group-hover:text-gold-300">
                      {item.title}
                    </h3>
                    <p className="mt-1.5 text-xs leading-relaxed text-navy-200">
                      {item.desc}
                    </p>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* LEADERSHIP & LICENSED WPPE */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <div className="max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-gold-600">
              {t.home.leadershipEyebrow}
            </p>
            <h2 className="mt-2 font-serif text-3xl font-bold tracking-tight text-navy-900 sm:text-4xl">
              {t.home.leadershipTitle}
            </h2>
            <p className="mt-3 text-base text-slate-600">{t.home.leadershipDesc}</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/manajemen"
              className="rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-navy-900 transition hover:bg-slate-50"
            >
              {t.home.viewManagement}
            </Link>
            <Link
              href="/karyawan-wppe"
              className="inline-flex items-center gap-2 rounded-xl bg-navy-800 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-navy-700"
            >
              <Users className="h-4 w-4 text-gold-300" />
              {t.home.viewWppe} ({wppeCount})
            </Link>
          </div>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[...MANAGEMENT.commissioners, ...MANAGEMENT.directors].map((person) => (
            <div
              key={person.name}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-card"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-navy-800 to-navy-600 font-serif text-lg font-bold text-gold-300">
                {person.initials}
              </div>
              <h3 className="mt-4 text-lg font-bold text-navy-900">
                {person.name}
              </h3>
              <p className="text-xs font-semibold uppercase tracking-wider text-gold-600">
                {isEn ? person.roleEn : person.roleId}
              </p>
              <p className="mt-1 text-xs text-slate-500">
                {isEn ? `Since ${person.since}` : `Sejak ${person.since}`}
              </p>
              <p className="mt-3 line-clamp-3 text-xs leading-relaxed text-slate-600">
                {isEn ? person.bioEn : person.bioId}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* LATEST NEWS & EDUCATION */}
      <section className="border-t border-slate-200 bg-white py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-gold-600">
                {t.home.newsEyebrow}
              </p>
              <h2 className="mt-2 font-serif text-3xl font-bold tracking-tight text-navy-900 sm:text-4xl">
                {t.home.newsTitle}
              </h2>
            </div>
            <Link
              href="/berita"
              className="inline-flex items-center gap-1.5 text-sm font-bold text-navy-700 transition hover:text-gold-600"
            >
              {t.home.viewAllNews}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {latestPosts.map((post) => (
              <Link
                key={post.id}
                href={`/berita/${post.slug}`}
                className="group flex flex-col justify-between rounded-2xl border border-slate-200 bg-slate-50/70 p-6 transition hover:-translate-y-0.5 hover:border-navy-300 hover:bg-white hover:shadow-card"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 text-xs">
                    <span className="inline-flex items-center gap-1 rounded-full bg-navy-100 px-2.5 py-0.5 font-semibold uppercase tracking-wide text-navy-800">
                      <BookOpen className="h-3 w-3" />
                      {post.category}
                    </span>
                    <time className="text-slate-500">{post.published_at}</time>
                  </div>
                  <h3 className="mt-4 text-lg font-bold leading-snug text-navy-900 group-hover:text-navy-700">
                    {pickLang(lang, post.title_id, post.title_en)}
                  </h3>
                  <p className="mt-2.5 line-clamp-3 text-sm leading-relaxed text-slate-600">
                    {pickLang(lang, post.excerpt_id, post.excerpt_en)}
                  </p>
                </div>

                <span className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-navy-700 group-hover:text-gold-600">
                  {t.common.readArticle}
                  <ArrowRight className="h-4 w-4" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* AKSES KSEI CTA BANNER */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="bg-eko-hero relative overflow-hidden rounded-3xl px-6 py-10 text-white shadow-xl sm:px-12 sm:py-12">
          <div className="hero-grid-pattern absolute inset-0 opacity-60" />
          <div className="relative flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-center">
            <div className="max-w-2xl">
              <span className="inline-block rounded-full border border-gold-400/30 bg-gold-500/20 px-3 py-1 text-xs font-bold uppercase tracking-widest text-gold-300">
                AKSes KSEI • Investor Protection
              </span>
              <h2 className="mt-3 font-serif text-2xl font-bold sm:text-3xl">
                {t.home.aksesTitle}
              </h2>
              <p className="mt-2.5 text-sm leading-relaxed text-navy-100 sm:text-base">
                {t.home.aksesDesc}
              </p>
            </div>
            <a
              href={COMPANY_INFO.aksesKseiUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-eko-gold-gradient inline-flex shrink-0 items-center gap-2 rounded-xl px-6 py-3.5 text-sm font-bold text-navy-950 shadow-lg shadow-gold-500/25 transition"
            >
              {t.home.aksesCta}
              <ExternalLink className="h-4 w-4" />
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
