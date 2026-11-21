import Link from "next/link";
import { ArrowRight, BarChart3, ShieldCheck, TrendingUp, Users } from "lucide-react";
import { PageHero } from "@/components/PageHero";
import { dictionary } from "@/lib/i18n";
import { getServerLang } from "@/lib/server-lang";

export default async function RemoteTradingPage() {
  const lang = await getServerLang();
  const t = dictionary[lang];
  const isEn = lang === "en";

  const pillars = [
    {
      icon: TrendingUp,
      title: isEn ? "Direct IDX Execution (Code: ES)" : "Eksekusi Langsung ke BEI (Kode: ES)",
      desc: isEn
        ? "Direct market connectivity as a licensed Indonesia Stock Exchange Member for equities and fixed-income transactions."
        : "Konektivitas langsung ke Bursa Efek Indonesia sebagai Anggota Bursa berizin untuk transaksi saham dan efek bersifat utang.",
    },
    {
      icon: Users,
      title: isEn ? "OJK-Licensed WPPE Sales Desk" : "Tim Equity Sales WPPE Berlisensi OJK",
      desc: isEn
        ? "Every order assisted by our dealing and sales desk is handled by professionals holding valid OJK WPPE licenses."
        : "Setiap layanan order melalui meja dealing dan sales kami ditangani oleh profesional pemegang izin WPPE resmi dari OJK.",
    },
    {
      icon: ShieldCheck,
      title: isEn ? "Segregated Custody & Settlement" : "Kustodian & Settlement Terpisah",
      desc: isEn
        ? "Client funds are safeguarded in segregated RDN accounts and securities are recorded directly under your SID at KSEI."
        : "Dana nasabah tersimpan aman pada RDN terpisah dan kepemilikan efek tercatat langsung atas nama SID Anda di KSEI.",
    },
    {
      icon: BarChart3,
      title: isEn ? "Flexible Retail & Institutional Access" : "Layanan Ritel & Institusi Terpadu",
      desc: isEn
        ? "Seamlessly combine self-directed e-TOP online trading with dedicated sales-assisted execution when needed."
        : "Fleksibilitas bertransaksi mandiri melalui e-TOP maupun transaksi berbantuan tim Equity Sales untuk kebutuhan ritel dan korporasi.",
    },
  ];

  return (
    <>
      <PageHero
        eyebrow={t.nav.services}
        title={t.nav.remoteTrading}
        subtitle={
          isEn
            ? "Reliable IDX equity brokerage services backed by experienced WPPE professionals and transparent trade settlement."
            : "Layanan perantara perdagangan efek yang andal di Bursa Efek Indonesia dengan dukungan tim WPPE berpengalaman dan penyelesaian transaksi transparan."
        }
        breadcrumbs={[
          { label: t.nav.home, href: "/" },
          { label: t.nav.services },
          { label: t.nav.remoteTrading },
        ]}
      />

      <section className="mx-auto max-w-7xl space-y-10 px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-6 md:grid-cols-2">
          {pillars.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="rounded-2xl border border-slate-200 bg-white p-7 shadow-card"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-navy-50 text-navy-700">
                  <Icon className="h-6 w-6" />
                </div>
                <h2 className="mt-4 text-lg font-bold text-navy-900">
                  {item.title}
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">
                  {item.desc}
                </p>
              </div>
            );
          })}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 rounded-3xl bg-navy-900 p-8 text-white">
          <div>
            <h3 className="font-serif text-2xl font-bold">
              {isEn
                ? "Meet Our Licensed WPPE Team or Open Your Account"
                : "Kenali Tim WPPE Berlisensi Kami atau Mulai Berinvestasi"}
            </h3>
            <p className="mt-1 text-sm text-navy-100">
              {isEn
                ? "Verify our OJK-registered Equity Sales & Operations personnel anytime."
                : "Seluruh tenaga pemasaran dan operasional kami terdaftar resmi di OJK."}
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/karyawan-wppe"
              className="rounded-xl border border-white/20 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              {t.nav.wppe}
            </Link>
            <Link
              href="/layanan/buka-rekening"
              className="inline-flex items-center gap-2 rounded-xl bg-gold-500 px-5 py-3 text-sm font-bold text-navy-950 transition hover:bg-gold-400"
            >
              {t.nav.openAccountCta}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
