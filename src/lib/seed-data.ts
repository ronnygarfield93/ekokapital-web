import type { DocumentCategory, PostCategory } from "./types";

export const SEED_WPPE_STAFF = [
  {
    name: "Cece Ridwanulloh",
    license_type: "WPPE",
    license_number: "KEP-600/PM.212/PJ-WPPE/2016 (16/12/2016)",
    position_id: "Equity Sales",
    position_en: "Equity Sales",
  },
  {
    name: "Deby Awaludin",
    license_type: "WPPE",
    license_number: "KEP-712/PM.212/PJ-WPPE/2016 (16/12/2016)",
    position_id: "Equity Sales",
    position_en: "Equity Sales",
  },
  {
    name: "Halim Santoso",
    license_type: "WPPE",
    license_number: "KEP-1321/PM.212/PJ-WPPE/2016 (16/12/2016)",
    position_id: "Equity Sales",
    position_en: "Equity Sales",
  },
  {
    name: "Soetirto Arip",
    license_type: "WPPE",
    license_number: "KEP-3021/PM.212/PJ-WPPE/2016 (16/12/2016)",
    position_id: "Equity Sales",
    position_en: "Equity Sales",
  },
  {
    name: "Stavia Lanarissa",
    license_type: "WPPE",
    license_number: "KEP-3061/PM.212/PJ-WPPE/2016 (16/12/2016)",
    position_id: "Equity Sales",
    position_en: "Equity Sales",
  },
  {
    name: "Wiratman",
    license_type: "WPPE",
    license_number: "KEP-3554/PM.212/PJ-WPPE/2016 (16/12/2016)",
    position_id: "Equity Sales",
    position_en: "Equity Sales",
  },
  {
    name: "Eva Maria Wairata",
    license_type: "WPPE",
    license_number: "KEP-1083/PM.212/PJ-WPPE/2016 (16/12/2016)",
    position_id: "Equity Sales",
    position_en: "Equity Sales",
  },
  {
    name: "Yulita Simon",
    license_type: "WPPE",
    license_number: "KEP-333/PM.212/PJ-WPPE/2016 (11/10/2017)",
    position_id: "Compliance",
    position_en: "Compliance",
  },
  {
    name: "Asti Arnaningsih",
    license_type: "WPPE",
    license_number: "KEP-347/PM.212/PJ-WPPE/2016 (25/10/2017)",
    position_id: "Head of HRD",
    position_en: "Head of HRD",
  },
  {
    name: "Surya Afandi Handojo",
    license_type: "WPPE",
    license_number: "KEP-350/PM.212/PJ-WPPE/2016 (31/10/2017)",
    position_id: "Head of Settlement",
    position_en: "Head of Settlement",
  },
  {
    name: "Yoesvitya",
    license_type: "WPPE",
    license_number: "KEP-1083/PM.212/PJ-WPPE/2016 (31/10/2017)",
    position_id: "Custodian",
    position_en: "Custodian",
  },
  {
    name: "Suryaningsih",
    license_type: "WPPE",
    license_number: "KEP-76/PM.212/PJ-WPPE/2016 (04/03/2016)",
    position_id: "Sales Admin",
    position_en: "Sales Admin",
  },
];

export const SEED_DOCUMENTS: Array<{
  category: DocumentCategory;
  year: number | null;
  title_id: string;
  title_en: string;
  description_id: string;
  description_en: string;
  file_url: string;
  file_size: string;
}> = [
  // Financial Reports
  {
    category: "financial_report",
    year: 2022,
    title_id: "Laporan Keuangan Auditan Tahun 2022",
    title_en: "Audited Financial Statements 2022",
    description_id: "Laporan Audit Independen PT Ekokapital Sekuritas tahun buku 2022.",
    description_en: "Independent Audited Financial Report of PT Ekokapital Sekuritas for FY 2022.",
    file_url: "https://ekokapital.com/download/548/",
    file_size: "PDF",
  },
  {
    category: "financial_report",
    year: 2021,
    title_id: "Laporan Keuangan Auditan Tahun 2021",
    title_en: "Audited Financial Statements 2021",
    description_id: "Laporan Audit Independen PT Ekokapital Sekuritas tahun buku 2021.",
    description_en: "Independent Audited Financial Report of PT Ekokapital Sekuritas for FY 2021.",
    file_url: "https://ekokapital.com/download/550/",
    file_size: "PDF",
  },
  {
    category: "financial_report",
    year: 2020,
    title_id: "Laporan Keuangan Auditan Tahun 2020",
    title_en: "Audited Financial Statements 2020",
    description_id: "Laporan Audit Independen PT Ekokapital Sekuritas tahun buku 2020.",
    description_en: "Independent Audited Financial Report of PT Ekokapital Sekuritas for FY 2020.",
    file_url: "https://ekokapital.com/download/552/",
    file_size: "PDF",
  },
  {
    category: "financial_report",
    year: 2019,
    title_id: "Laporan Keuangan Auditan Tahun 2019",
    title_en: "Audited Financial Statements 2019",
    description_id: "Laporan Audit Independen PT Ekokapital Sekuritas tahun buku 2019.",
    description_en: "Independent Audited Financial Report of PT Ekokapital Sekuritas for FY 2019.",
    file_url: "https://ekokapital.com/download/554/",
    file_size: "PDF",
  },
  {
    category: "financial_report",
    year: 2018,
    title_id: "Laporan Keuangan Auditan Tahun 2018",
    title_en: "Audited Financial Statements 2018",
    description_id: "Laporan Audit Independen PT Ekokapital Sekuritas tahun buku 2018.",
    description_en: "Independent Audited Financial Report of PT Ekokapital Sekuritas for FY 2018.",
    file_url: "https://ekokapital.com/download/292/",
    file_size: "PDF",
  },
  {
    category: "financial_report",
    year: 2017,
    title_id: "Laporan Keuangan Auditan Tahun 2017",
    title_en: "Audited Financial Statements 2017",
    description_id: "Laporan Audit Independen PT Ekokapital Sekuritas tahun buku 2017.",
    description_en: "Independent Audited Financial Report of PT Ekokapital Sekuritas for FY 2017.",
    file_url: "https://ekokapital.com/download/289/",
    file_size: "PDF",
  },
  {
    category: "financial_report",
    year: 2016,
    title_id: "Laporan Keuangan Auditan Tahun 2016",
    title_en: "Audited Financial Statements 2016",
    description_id: "Laporan Audit Independen PT Ekokapital Sekuritas tahun buku 2016.",
    description_en: "Independent Audited Financial Report of PT Ekokapital Sekuritas for FY 2016.",
    file_url: "https://ekokapital.com/download/286/",
    file_size: "PDF",
  },
  // RUPS
  {
    category: "rups",
    year: 2019,
    title_id: "Ringkasan Risalah RUPS Tahun 2019",
    title_en: "Summary of Minutes of GMS 2019",
    description_id: "Dokumen ringkasan hasil Rapat Umum Pemegang Saham (RUPS) PT Ekokapital Sekuritas.",
    description_en: "Summary of resolutions from the General Meeting of Shareholders (GMS) of PT Ekokapital Sekuritas.",
    file_url: "https://ekokapital.com/download/314/",
    file_size: "PDF",
  },
  // GCG
  {
    category: "gcg",
    year: null,
    title_id: "Kode Etik Perusahaan",
    title_en: "Corporate Code of Ethics",
    description_id: "Standar perilaku, integritas, dan etika kerja seluruh insan PT Ekokapital Sekuritas.",
    description_en: "Standards of professional conduct, integrity, and ethics for all PT Ekokapital Sekuritas personnel.",
    file_url: "https://ekokapital.com/download/332/",
    file_size: "PDF",
  },
  {
    category: "gcg",
    year: null,
    title_id: "Kebijakan Manajemen Risiko",
    title_en: "Risk Management Policy",
    description_id: "Kerangka identifikasi, pengukuran, pemantauan, dan pengendalian risiko perusahaan efek.",
    description_en: "Framework for identifying, measuring, monitoring, and mitigating securities brokerage risks.",
    file_url: "https://ekokapital.com/download/335/",
    file_size: "PDF",
  },
  {
    category: "gcg",
    year: null,
    title_id: "Pedoman Kerja Direksi dan Dewan Komisaris",
    title_en: "Board of Directors & Commissioners Charter",
    description_id: "Piagam tugas, wewenang, tanggung jawab, dan tata hubungan kerja Direksi serta Dewan Komisaris.",
    description_en: "Charter defining duties, authorities, responsibilities, and governance relations of the Boards.",
    file_url: "https://ekokapital.com/download/338/",
    file_size: "PDF",
  },
  {
    category: "gcg",
    year: null,
    title_id: "Piagam Audit Internal dan Kepatuhan",
    title_en: "Internal Audit & Compliance Charter",
    description_id: "Mandat fungsi audit internal dan kepatuhan terhadap regulasi OJK dan SRO pasar modal.",
    description_en: "Mandate of the internal audit and regulatory compliance functions aligned with OJK and SRO rules.",
    file_url: "https://ekokapital.com/download/341/",
    file_size: "PDF",
  },
  // Forms
  {
    category: "form",
    year: null,
    title_id: "Formulir Pembukaan Rekening Efek & RDN",
    title_en: "Securities Account & RDN Opening Form",
    description_id: "Formulir pendaftaran rekening efek individu dan Rekening Dana Nasabah (RDN).",
    description_en: "Individual securities account and Investor Fund Account (RDN) registration form.",
    file_url: "https://ekokapital.com/wp-content/uploads/2022/09/Opening-Account-RDN.pdf",
    file_size: "PDF",
  },
  {
    category: "form",
    year: null,
    title_id: "Formulir Pembukaan Online Trading (e-TOP)",
    title_en: "Online Trading (e-TOP) Activation Form",
    description_id: "Formulir permohonan aktivasi fasilitas transaksi online e-TOP Ekokapital.",
    description_en: "Application form to activate the Ekokapital e-TOP online trading facility.",
    file_url: "https://ekokapital.com/wp-content/uploads/2022/09/Formulir-Online.pdf",
    file_size: "PDF",
  },
  {
    category: "form",
    year: null,
    title_id: "Formulir Penarikan Dana (Cash Withdraw)",
    title_en: "Cash Withdrawal Instruction Form",
    description_id: "Formulir instruksi penarikan dana dari RDN ke rekening bank pribadi nasabah.",
    description_en: "Instruction form to withdraw funds from RDN to the client's registered personal bank account.",
    file_url: "https://ekokapital.com/wp-content/uploads/2019/03/Withdraw-Form.pdf",
    file_size: "PDF",
  },
  // e-TOP Manuals
  {
    category: "etop_manual",
    year: null,
    title_id: "Panduan Penggunaan Aplikasi Desktop e-TOP",
    title_en: "e-TOP Desktop Application User Manual",
    description_id: "Buku panduan lengkap instalasi, login, order saham, dan pemantauan portofolio pada e-TOP Desktop.",
    description_en: "Complete guide to installation, login, order placement, and portfolio tracking on e-TOP Desktop.",
    file_url:
      "https://ekokapital.com/wp-content/uploads/2022/09/Panduan-penggunaan-Aplikasi-Trading-Online-Priority.pdf",
    file_size: "PDF",
  },
  {
    category: "etop_manual",
    year: null,
    title_id: "Panduan Penggunaan Aplikasi Mobile e-TOP",
    title_en: "e-TOP Mobile Application User Manual",
    description_id: "Panduan operasional aplikasi e-TOP Mobile untuk perangkat Android dan iOS.",
    description_en: "Operating manual for the e-TOP Mobile trading application on Android and iOS.",
    file_url:
      "https://ekokapital.com/wp-content/uploads/2022/09/User-Manual-Mobile-E-Top.pdf",
    file_size: "PDF",
  },
];

export const SEED_NOTICES = [
  {
    type: "fraud_alert" as const,
    title_id: "Waspada Penipuan Mengatasnamakan PT Ekokapital Sekuritas",
    title_en: "Security Alert: Beware of Impersonation & Investment Scams",
    body_id:
      "PT Ekokapital Sekuritas dengan tegas menyatakan TIDAK pernah menerima titipan dana, menjanjikan keuntungan tetap/besar, maupun menawarkan jasa pengelolaan dana melalui Telegram atau media sosial lainnya. Seluruh kanal Telegram yang mengatasnamakan PT Ekokapital Sekuritas adalah PALSU/HOAX. Pastikan Anda hanya bertransaksi melalui kanal resmi (ekokapital.com, Telp: 021-57904588, Email: cs@ekokapital.com) dan laporkan indikasi penipuan ke Indonesia Anti-Scam Centre (iasc.ojk.go.id) atau Kontak OJK 157.",
    body_en:
      "PT Ekokapital Sekuritas strictly declares that we NEVER accept entrusted funds, guarantee high/fixed returns, or offer fund management services via Telegram or social media. Any Telegram group or account claiming to represent PT Ekokapital Sekuritas is FRAUDULENT. Always verify communications through our official channels (ekokapital.com, Tel: +62-21-57904588, Email: cs@ekokapital.com) and report scams to the Indonesia Anti-Scam Centre (iasc.ojk.go.id) or OJK Contact 157.",
    cta_label_id: "Laporkan ke IASC OJK",
    cta_label_en: "Report to IASC OJK",
    cta_url: "https://iasc.ojk.go.id/",
    show_as_modal: true,
  },
];

export const SEED_POSTS: Array<{
  slug: string;
  category: PostCategory;
  title_id: string;
  title_en: string;
  excerpt_id: string;
  excerpt_en: string;
  content_id: string;
  content_en: string;
  cover_image?: string | null;
  published_at: string;
}> = [
  {
    slug: "laporan-pengaduan-nasabah-2021-2025",
    category: "news",
    title_id: "Publikasi Data Laporan Pengaduan Nasabah (2021–2025)",
    title_en: "Publication of Customer Complaint Statistics (2021–2025)",
    excerpt_id:
      "Ringkasan keterbukaan informasi penanganan pengaduan nasabah PT Ekokapital Sekuritas periode tahun 2021 hingga 2025 sesuai ketentuan OJK.",
    excerpt_en:
      "Disclosure summary of PT Ekokapital Sekuritas customer complaint handling from 2021 through 2025 in compliance with OJK regulations.",
    content_id: `Sebagai bentuk komitmen terhadap transparansi dan kepatuhan terhadap Peraturan OJK mengenai Layanan Pengaduan Konsumen di Sektor Jasa Keuangan (POJK No. 18/POJK.07/2018), PT Ekokapital Sekuritas mempublikasikan rekapitulasi laporan pengaduan nasabah periode 2021–2025.

Selama periode tahun buku 2021, 2022, 2023, 2024, hingga 2025, tercatat 0 pengaduan yang belum diselesaikan dan 0 sengketa yang tertunda.

PT Ekokapital Sekuritas terus meningkatkan kualitas layanan nasabah dan membuka kanal pengaduan resmi melalui halaman Prosedur Pengaduan Nasabah, telepon (021) 57904588, maupun email resmi es@ekokapital.com.`,
    content_en: `In line with our commitment to transparency and compliance with OJK Regulation No. 18/POJK.07/2018 on Consumer Complaint Services in the Financial Services Sector, PT Ekokapital Sekuritas publishes its annual customer complaint statistics for 2021–2025.

Across the 2021, 2022, 2023, 2024, and 2025 reporting years, zero unresolved complaints were recorded.

PT Ekokapital Sekuritas continuously enhances client service standards and provides accessible complaint channels via our Customer Complaint Procedure page, telephone (+62-21-57904588), and official email es@ekokapital.com.`,
    published_at: "2025-09-26",
  },
  {
    slug: "pentingnya-pelindungan-data-pribadi-untuk-nasabah",
    category: "education",
    title_id:
      "Pentingnya Pelindungan Data Pribadi: Langkah Melindungi Keamanan Akun Nasabah",
    title_en:
      "Personal Data Protection: Essential Steps to Safeguard Your Investment Account",
    excerpt_id:
      "Panduan keamanan siber bagi investor pasar modal sesuai UU No. 27 Tahun 2022 (UU PDP) untuk mencegah phishing, penyalahgunaan akun, dan penipuan digital.",
    excerpt_en:
      "Cybersecurity guidance for capital market investors aligned with Law No. 27/2022 (UU PDP) to prevent phishing, account takeover, and digital scams.",
    content_id: `Di era transaksi digital, pelindungan data pribadi merupakan tanggung jawab bersama antara penyedia jasa keuangan dan nasabah sesuai amanat Undang-Undang Nomor 27 Tahun 2022 tentang Pelindungan Data Pribadi (UU PDP).

Langkah-langkah penting yang perlu diterapkan setiap nasabah PT Ekokapital Sekuritas:

1. Gunakan kata sandi (password) dan PIN transaksi yang kuat, unik, serta rutin diperbarui. Jangan menyimpan User ID, Password, atau PIN dalam catatan terbuka di ponsel Anda.
2. Waspadai upaya phishing, tautan mencurigakan, panggilan palsu (fake call), maupun video call berbasis deepfake AI. Jangan pernah membagikan kode OTP, PIN, atau kata sandi kepada siapapun, termasuk pihak yang mengaku staf sekuritas.
3. Hindari login ke aplikasi trading e-TOP menggunakan jaringan Wi-Fi publik yang tidak terenkripsi.
4. Aktifkan verifikasi berlapis (2FA/MFA) jika tersedia serta periksa secara berkala histori transaksi dan saldo efek Anda melalui portal AKSes KSEI.
5. Waspada terhadap penipuan yang mengatasnamakan PT Ekokapital Sekuritas. Kami tidak pernah meminta transfer dana ke rekening pribadi, menawarkan titip dana, maupun menjanjikan keuntungan pasti melalui grup Telegram atau media sosial.

Selalu pastikan informasi hanya berasal dari kanal resmi PT Ekokapital Sekuritas: ekokapital.com, telepon (021) 57904580 / 57904588, dan email cs@ekokapital.com.`,
    content_en: `In today's digital trading era, safeguarding personal data is a shared responsibility between financial institutions and clients under Indonesia's Personal Data Protection Law (Law No. 27 of 2022 / UU PDP).

Key security practices every PT Ekokapital Sekuritas client should follow:

1. Use strong, unique passwords and trading PINs, and update them periodically. Never store your User ID, password, or PIN in unprotected notes on your device.
2. Stay alert to phishing links, impersonation calls, and AI deepfake scams. Never share OTP codes, PINs, or passwords with anyone—even individuals claiming to represent our firm.
3. Avoid logging into the e-TOP trading application over unsecured public Wi-Fi networks.
4. Enable multi-factor authentication (2FA/MFA) where available and regularly review your trade confirmations and portfolio via AKSes KSEI.
5. Beware of scams impersonating PT Ekokapital Sekuritas. We never request transfers to personal bank accounts, accept entrusted funds, or promise guaranteed profits via Telegram groups or social media.

Always verify information strictly via official PT Ekokapital Sekuritas channels: ekokapital.com, +62-21-57904580 / 57904588, and cs@ekokapital.com.`,
    published_at: "2025-04-09",
  },
  {
    slug: "perubahan-daftar-efek-dalam-pemantauan-khusus-2025",
    category: "announcement",
    title_id:
      "Pengumuman Perubahan Daftar Efek Bersifat Ekuitas Dalam Pemantauan Khusus",
    title_en:
      "Announcement on Changes to the IDX Special Monitoring Equity List",
    excerpt_id:
      "Informasi pembaruan Daftar Efek Bersifat Ekuitas dalam Pemantauan Khusus mengacu pada Peraturan BEI Nomor II-S.",
    excerpt_en:
      "Update regarding Equity Securities under Special Monitoring pursuant to IDX Regulation No. II-S.",
    content_id: `Mengacu pada Peraturan Bursa Efek Indonesia (BEI) Nomor II-S tentang Perdagangan Efek Bersifat Ekuitas Dalam Pemantauan Khusus, PT Ekokapital Sekuritas mengimbau seluruh nasabah untuk senantiasa memeriksa status saham sebelum melakukan transaksi.

Daftar lengkap dan pembaruan terkini terkait:
- Efek Bersifat Ekuitas dalam Pemantauan Khusus
- Daftar Notasi Khusus Perusahaan Tercatat
- Daftar Perusahaan Tercatat pada Papan Akselerasi

dapat diakses secara langsung melalui situs resmi Bursa Efek Indonesia di https://www.idx.co.id/. Pastikan Anda memahami mekanisme perdagangan (termasuk periodic call auction) dan profil risiko sebelum mengambil keputusan investasi.`,
    content_en: `Pursuant to Indonesia Stock Exchange (IDX) Regulation No. II-S on Trading of Equity Securities Under Special Monitoring, PT Ekokapital Sekuritas reminds all clients to review equity status notations prior to placing orders.

Up-to-date official lists covering:
- Equity Securities Under Special Monitoring
- Special Notation Listed Companies
- Acceleration Board Listed Companies

are directly available on the official IDX website at https://www.idx.co.id/. Please ensure you understand the applicable trading mechanisms (including periodic call auction) and risk profile before making investment decisions.`,
    published_at: "2025-02-26",
  },
  {
    slug: "penyesuaian-kebijakan-auto-rejection-bawah-arb",
    category: "news",
    title_id: "Penyesuaian Kebijakan Batasan Auto Rejection Bawah (ARB) BEI",
    title_en: "IDX Adjustment on Lower Auto Rejection (ARB) Price Limits",
    excerpt_id:
      "Penjelasan implementasi normalisasi batasan Auto Rejection Bawah (ARB) simetris sesuai Surat Keputusan Bursa Efek Indonesia.",
    excerpt_en:
      "Overview of the symmetric Lower Auto Rejection (ARB) normalization schedule under IDX directives.",
    content_id: `Berdasarkan Surat Bursa Efek Indonesia Nomor S-02662/BEI.POP/03-2023 mengenai Penyesuaian Batasan Auto Rejection Bawah (ARB), penerapan normalisasi batasan harga harian saham dilaksanakan dalam dua tahap:

- Tahap I (efektif 5 Juni 2023): Batasan ARB disesuaikan menjadi 15% untuk seluruh rentang harga saham.
- Tahap II (efektif 4 September 2023): Batasan Auto Rejection kembali simetris antara ARA dan ARB, yaitu 35% untuk rentang harga Rp 50–Rp 200, 25% untuk rentang >Rp 200–Rp 5.000, dan 20% untuk harga di atas Rp 5.000.

Nasabah diharapkan menyesuaikan strategi manajemen risiko serta limit order pada aplikasi e-TOP sesuai ketentuan perdagangan BEI yang berlaku.`,
    content_en: `Pursuant to Indonesia Stock Exchange Letter No. S-02662/BEI.POP/03-2023 regarding Lower Auto Rejection (ARB) adjustments, the normalization of daily stock price limits was implemented in two phases:

- Phase I (effective 5 June 2023): ARB adjusted to 15% across all price tiers.
- Phase II (effective 4 September 2023): Symmetric ARA and ARB limits restored — 35% for IDR 50–200, 25% for >IDR 200–5,000, and 20% for prices above IDR 5,000.

Clients are advised to align risk management and limit order settings in the e-TOP platform with current IDX trading rules.`,
    published_at: "2023-06-01",
  },
  {
    slug: "mengenal-analisa-fundamental-saham",
    category: "education",
    title_id: "Edukasi Investor: Mengenal Analisa Fundamental Saham",
    title_en: "Investor Education: Understanding Fundamental Equity Analysis",
    excerpt_id:
      "Memahami rasio keuangan utama seperti Book Value, PBV, EPS, dan PER untuk menilai nilai intrinsik emiten di pasar modal.",
    excerpt_en:
      "Understanding core valuation metrics including Book Value, PBV, EPS, and PER to evaluate listed companies.",
    content_id: `Analisa fundamental adalah metode evaluasi nilai intrinsik saham dengan menelaah kinerja keuangan, prospek industri, serta kondisi makroekonomi emiten.

Beberapa rasio utama yang umum digunakan investor:
1. Book Value (BV): Nilai ekuitas bersih perusahaan per lembar saham.
2. Price to Book Value (PBV): Perbandingan harga pasar saham terhadap nilai bukunya untuk menilai kewajaran valuasi.
3. Earning Per Share (EPS): Laba bersih perusahaan yang dihasilkan untuk setiap lembar saham beredar.
4. Price to Earning Ratio (PER): Perbandingan harga saham terhadap EPS sebagai indikator berapa kali pasar menilai laba tahunan emiten.

Keunggulan analisa fundamental terletak pada objektivitas data laporan keuangan untuk investasi jangka menengah hingga panjang, sementara keterbatasannya adalah membutuhkan ketelitian pembacaan laporan serta tidak menangkap fluktuasi sentimen jangka sangat pendek.`,
    content_en: `Fundamental analysis evaluates a stock's intrinsic value by examining financial performance, industry dynamics, and macroeconomic conditions.

Key valuation ratios widely used by equity investors include:
1. Book Value (BV): Net shareholder equity attributable to each outstanding share.
2. Price-to-Book Value (PBV): Ratio comparing market share price to book value per share.
3. Earnings Per Share (EPS): Net profit generated per outstanding share.
4. Price-to-Earnings Ratio (PER): Share price divided by EPS, reflecting how the market values a company's annual earnings.

Fundamental analysis offers a disciplined, data-driven foundation for medium- to long-term investing, though it requires thorough financial statement review and does not capture short-term market sentiment swings.`,
    published_at: "2023-05-11",
  },
  {
    slug: "mengenal-analisa-teknikal-pasar-modal",
    category: "education",
    title_id: "Edukasi Investor: Dasar-Dasar Analisa Teknikal & Indikator",
    title_en: "Investor Education: Basics of Technical Analysis & Indicators",
    excerpt_id:
      "Pengenalan pergerakan harga, tren pasar, serta indikator teknikal populer seperti Moving Average (MA), MACD, dan Stochastic.",
    excerpt_en:
      "Introduction to price action, trend identification, and widely used technical indicators such as Moving Average, MACD, and Stochastic.",
    content_id: `Analisa teknikal mempelajari riwayat pergerakan harga dan volume transaksi saham untuk mengidentifikasi pola tren serta momentum beli atau jual.

Indikator teknikal yang sering dimanfaatkan pelaku pasar antara lain:
- Moving Average (MA): Membantu menyaring fluktuasi jangka pendek dan mengidentifikasi arah tren utama.
- MACD (Moving Average Convergence Divergence): Mengukur kekuatan momentum serta potensi perubahan arah tren melalui persilangan garis sinyal.
- Stochastic Oscillator: Mengidentifikasi area jenuh beli (overbought) maupun jenuh jual (oversold) dalam rentang harga tertentu.

Mengombinasikan analisa fundamental untuk memilih emiten berkualitas dan analisa teknikal untuk menentukan momentum masuk/keluar dapat membantu investor mengambil keputusan yang lebih terukur.`,
    content_en: `Technical analysis examines historical price movements and trading volume to identify trend structures and entry/exit momentum.

Common technical indicators used by market participants include:
- Moving Average (MA): Smooths short-term volatility to clarify the prevailing trend direction.
- MACD (Moving Average Convergence Divergence): Measures momentum strength and potential trend reversals through signal-line crossovers.
- Stochastic Oscillator: Highlights overbought and oversold conditions relative to a recent price range.

Combining fundamental analysis for company selection with technical analysis for timing can support more disciplined investment decisions.`,
    published_at: "2023-04-15",
  },
];
