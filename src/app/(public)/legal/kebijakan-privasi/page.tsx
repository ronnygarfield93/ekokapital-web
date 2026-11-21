import { PageHero } from "@/components/PageHero";
import { dictionary } from "@/lib/i18n";
import { getServerLang } from "@/lib/server-lang";
import { COMPANY_INFO } from "@/lib/company-data";

export default async function KebijakanPrivasiPage() {
  const lang = await getServerLang();
  const t = dictionary[lang];
  const isEn = lang === "en";

  const sections = isEn
    ? [
        {
          title: "1. Regulatory Basis & Scope",
          body: "PT Ekokapital Sekuritas ('ES') respects your privacy and processes Personal Data in strict compliance with Law No. 27 of 2022 on Personal Data Protection (UU PDP), OJK regulations, and capital market rules.",
        },
        {
          title: "2. Categories of Personal Data Collected",
          body: "We collect General Personal Data (full name, NIK/KTP, NPWP, address, correspondence, occupation, family details) and Specific Personal Data (financial/RDN data, investment risk profile, digital activity logs/IP address, and recorded client communications for regulatory compliance).",
        },
        {
          title: "3. Purposes & Legal Basis of Processing",
          body: "Data is processed to execute securities brokerage and RDN account opening agreements, fulfill statutory KYC/CDD and AML-CFT (APU-PPT) obligations, deliver e-TOP trading services, safeguard system security, and respond to client inquiries or complaints.",
        },
        {
          title: "4. Disclosure to Authorized Parties",
          body: "ES only discloses Personal Data to authorized capital market authorities (OJK, IDX, KSEI, KPEI, SIPF), partner RDN banks (Bank Mandiri / Bank BCA), or law enforcement agencies as mandated by applicable laws.",
        },
        {
          title: "5. Rights of Personal Data Subjects",
          body: "Under UU PDP, clients have the right to access, correct, update, request portability, restrict/delay processing, withdraw consent, or request deletion of Personal Data subject to statutory retention obligations in the financial sector.",
        },
        {
          title: "6. Data Retention & Privacy Contact",
          body: `Personal Data is retained in accordance with OJK and statutory archiving periods. For privacy inquiries or exercising your UU PDP rights, contact Customer Care at ${COMPANY_INFO.csPhone} or ${COMPANY_INFO.csEmail}.`,
        },
      ]
    : [
        {
          title: "1. Dasar Hukum & Ruang Lingkup",
          body: "PT Ekokapital Sekuritas ('ES') berkomitmen melindungi privasi nasabah dan memproses Data Pribadi sesuai Undang-Undang Nomor 27 Tahun 2022 tentang Pelindungan Data Pribadi (UU PDP), peraturan OJK, serta ketentuan pasar modal yang berlaku.",
        },
        {
          title: "2. Jenis Data Pribadi yang Dikumpulkan",
          body: "ES mengumpulkan Data Pribadi Umum (nama lengkap, NIK/KTP, NPWP, alamat korespondensi, pekerjaan, data keluarga) dan Data Pribadi Spesifik (data keuangan/RDN, profil risiko investasi, catatan aktivitas digital/IP, serta rekaman komunikasi layanan nasabah) secara langsung maupun dari pihak ketiga resmi (Dukcapil, SLIK OJK, Kemenkumham).",
        },
        {
          title: "3. Tujuan & Dasar Pemrosesan Data",
          body: "Data Pribadi diproses berdasarkan persetujuan eksplisit, pemenuhan kewajiban perjanjian rekening efek & e-TOP, pemenuhan kewajiban hukum (KYC, CDD, APU-PPT), kepentingan sah perusahaan, serta peningkatan keamanan dan kualitas layanan.",
        },
        {
          title: "4. Pengungkapan kepada Pihak Berwenang",
          body: "ES hanya mengungkapkan Data Pribadi kepada otoritas dan SRO pasar modal (OJK, BEI, KSEI, KPEI, SIPF), bank RDN rekanan (Bank Mandiri / Bank BCA), serta instansi pemerintah yang berwenang sesuai ketentuan perundang-undangan.",
        },
        {
          title: "5. Hak-Hak Subjek Data Pribadi",
          body: "Sesuai UU PDP, nasabah berhak memperoleh informasi, mengakses, memperbaiki/melengkapi data, menarik persetujuan, menunda/membatasi pemrosesan, maupun meminta penghapusan Data Pribadi dengan tetap memperhatikan kewajiban retensi data di sektor jasa keuangan.",
        },
        {
          title: "6. Retensi Data & Narahubung Privasi",
          body: `Data Pribadi disimpan sesuai masa retensi peraturan pasar modal dan perundang-undangan. Untuk pertanyaan atau pelaksanaan hak UU PDP, silakan hubungi Customer Care PT Ekokapital Sekuritas melalui telepon ${COMPANY_INFO.csPhone} atau email ${COMPANY_INFO.csEmail}.`,
        },
      ];

  return (
    <>
      <PageHero
        eyebrow="Legal & Compliance"
        title={t.footer.privacy}
        subtitle={
          isEn
            ? "Customer Personal Data Protection Policy aligned with Law No. 27 of 2022 (UU PDP)."
            : "Kebijakan Pelindungan Data Pribadi Nasabah PT Ekokapital Sekuritas sesuai UU No. 27 Tahun 2022."
        }
        breadcrumbs={[
          { label: t.nav.home, href: "/" },
          { label: t.footer.privacy },
        ]}
      />

      <section className="mx-auto max-w-4xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="space-y-6 rounded-3xl border border-slate-200 bg-white p-7 shadow-card sm:p-10">
          {sections.map((sec) => (
            <div key={sec.title} className="space-y-2">
              <h2 className="font-serif text-xl font-bold text-navy-900">
                {sec.title}
              </h2>
              <p className="text-sm leading-relaxed text-slate-700">{sec.body}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
