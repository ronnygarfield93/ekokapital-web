import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Playfair_Display } from "next/font/google";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-jakarta",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["600", "700"],
  variable: "--font-playfair",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "PT Ekokapital Sekuritas",
    template: "%s | PT Ekokapital Sekuritas",
  },
  description:
    "PT Ekokapital Sekuritas adalah Perusahaan Efek Anggota Bursa Efek Indonesia (Kode AB: ES) yang berizin dan diawasi oleh OJK sejak tahun 2000. Layanan Online Trading e-TOP, Pembukaan Rekening Efek, dan Tata Kelola Perusahaan.",
  icons: {
    icon: "/images/favicon-ekokapital.jpeg",
    shortcut: "/images/favicon-ekokapital.jpeg",
    apple: "/images/favicon-ekokapital.jpeg",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className={`${jakarta.variable} ${playfair.variable}`}>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
