import { PageHero } from "@/components/PageHero";
import { dictionary } from "@/lib/i18n";
import { getServerLang } from "@/lib/server-lang";

export default async function DisclaimerEtopPage() {
  const lang = await getServerLang();
  const t = dictionary[lang];
  const isEn = lang === "en";

  const items = isEn
    ? [
        "The Ekokapital e-TOP online trading system operates in compliance with IDX, KSEI, KPEI, and OJK regulatory standards.",
        "Clients are solely responsible for safeguarding their User ID, Trading ID, Password, and Trading PIN delivered to their registered email, and must not disclose credentials to any party.",
        "PT Ekokapital Sekuritas is released from liability for losses resulting from internet network interruptions, malware/viruses on user devices, transmission delays, or unauthorized account access caused by user negligence.",
        "Clients acknowledge and understand Indonesia Stock Exchange trading regulations and must promptly report technical discrepancies to the Ekokapital Helpdesk.",
        "In the event of a system disconnection between IDX, the Company, and Clients, an official notice will be posted on ekokapital.com; partially matched or open orders remain subject to exchange queue rules.",
        "Force Majeure: PT Ekokapital Sekuritas shall not be liable for disruptions arising from events beyond reasonable control including natural disasters, fire, strikes, war, terrorism, or exchange system halts.",
      ]
    : [
        "Sistem transaksi online Ekokapital e-TOP dioperasikan sesuai standar regulasi SRO (BEI, KPEI, KSEI) dan OJK.",
        "Nasabah bertanggung jawab penuh menjaga kerahasiaan User ID, Trading ID, Password, serta PIN transaksi yang dikirimkan ke email terdaftar dan dilarang membagikannya kepada pihak manapun.",
        "PT Ekokapital Sekuritas dibebaskan dari tanggung jawab atas kerugian akibat gangguan jaringan internet, virus pada perangkat pengguna, keterlambatan transmisi data, maupun akses tidak sah akibat kelalaian pengguna.",
        "Nasabah memahami ketentuan perdagangan Bursa Efek Indonesia dan wajib segera melaporkan kendala teknis kepada Helpdesk PT Ekokapital Sekuritas.",
        "Apabila terjadi pemutusan koneksi antara BEI, Perseroan, dan Nasabah, pengumuman resmi akan disampaikan melalui website ekokapital.com dan order terbuka/terpenuhi sebagian tetap tunduk pada antrean bursa.",
        "Keadaan Kahar (Force Majeure): Perseroan tidak bertanggung jawab atas gangguan akibat kejadian di luar kendali wajar seperti bencana alam, kebakaran, pemogokan, perang, terorisme, atau penghentian sistem bursa.",
      ];

  return (
    <>
      <PageHero
        eyebrow="Legal & Compliance"
        title={t.footer.etopDisclaimer}
        breadcrumbs={[
          { label: t.nav.home, href: "/" },
          { label: t.footer.etopDisclaimer },
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
