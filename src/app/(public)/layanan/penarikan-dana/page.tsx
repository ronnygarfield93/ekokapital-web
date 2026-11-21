import { Clock, Download, FileText, Mail, Phone, ShieldAlert } from "lucide-react";
import { PageHero } from "@/components/PageHero";
import { dictionary } from "@/lib/i18n";
import { getServerLang } from "@/lib/server-lang";
import { COMPANY_INFO } from "@/lib/company-data";

export default async function PenarikanDanaPage() {
  const lang = await getServerLang();
  const t = dictionary[lang];
  const isEn = lang === "en";

  return (
    <>
      <PageHero
        eyebrow={t.nav.services}
        title={t.nav.cashWithdraw}
        subtitle={
          isEn
            ? "Official procedure and instruction form for withdrawing funds from your Investor Fund Account (RDN)."
            : "Prosedur resmi dan formulir instruksi penarikan dana dari Rekening Dana Nasabah (RDN) ke rekening bank terdaftar Anda."
        }
        breadcrumbs={[
          { label: t.nav.home, href: "/" },
          { label: t.nav.services },
          { label: t.nav.cashWithdraw },
        ]}
      />

      <section className="mx-auto max-w-5xl space-y-8 px-4 py-16 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-card sm:p-9">
          <h2 className="font-serif text-2xl font-bold text-navy-900">
            {isEn ? "Cash Withdrawal Instructions" : "Ketentuan Penarikan Dana"}
          </h2>

          <div className="mt-6 grid gap-5 sm:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <Clock className="h-6 w-6 text-gold-600" />
              <h3 className="mt-3 text-sm font-bold text-navy-900">
                {isEn ? "Submission Cut-Off" : "Batas Waktu Instruksi"}
              </h3>
              <p className="mt-1.5 text-xs leading-relaxed text-slate-600">
                {isEn
                  ? "Withdrawal form must be received at least 1 business day (H-1) prior to the requested transfer date."
                  : "Formulir instruksi wajib kami terima paling lambat 1 hari kerja (H-1) sebelum tanggal instruksi transfer."}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <Mail className="h-6 w-6 text-gold-600" />
              <h3 className="mt-3 text-sm font-bold text-navy-900">
                {isEn ? "Official Submission Channels" : "Pengiriman Formulir"}
              </h3>
              <p className="mt-1.5 text-xs leading-relaxed text-slate-600">
                Email: <strong>{COMPANY_INFO.financeEmail}</strong>
                <br />
                Fax: <strong>{COMPANY_INFO.mainFax}</strong>
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <Phone className="h-6 w-6 text-gold-600" />
              <h3 className="mt-3 text-sm font-bold text-navy-900">
                {isEn ? "Receipt Confirmation" : "Konfirmasi Penerimaan"}
              </h3>
              <p className="mt-1.5 text-xs leading-relaxed text-slate-600">
                {isEn
                  ? "Confirm form receipt with Finance (Ibu Fung Cen) at +62-21-57904588 ext. 834."
                  : "Harap konfirmasi penerimaan formulir ke bagian Finance (Ibu Fung Cen) di 021-57904588 ext. 834."}
              </p>
            </div>
          </div>

          <div className="mt-8 flex flex-col items-start justify-between gap-4 rounded-2xl border border-navy-200 bg-navy-50 p-6 sm:flex-row sm:items-center">
            <div className="flex items-start gap-3.5">
              <FileText className="mt-0.5 h-6 w-6 shrink-0 text-navy-700" />
              <div>
                <p className="text-sm font-bold text-navy-900">
                  {isEn ? "Cash Withdrawal Instruction Form (PDF)" : "Formulir Penarikan Dana (Withdraw Form PDF)"}
                </p>
                <p className="text-xs text-slate-600">
                  {isEn
                    ? "Complete, sign matching your specimen signature, and send via official finance email or fax."
                    : "Isi lengkap, tanda tangani sesuai spesimen, dan kirimkan ke email/fax resmi Finance."}
                </p>
              </div>
            </div>
            <a
              href="https://ekokapital.com/wp-content/uploads/2019/03/Withdraw-Form.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-navy-800 px-5 py-3 text-sm font-semibold text-white transition hover:bg-navy-700"
            >
              <Download className="h-4 w-4 text-gold-300" />
              {t.common.downloadPdf}
            </a>
          </div>

          <div className="mt-6 flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 text-xs text-amber-950">
            <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
            <p>
              {isEn
                ? "For your protection, funds can only be transferred to the personal bank account registered in your name when opening your securities account."
                : "Demi keamanan nasabah, pencairan dana hanya dapat ditransfer ke rekening bank pribadi atas nama nasabah sendiri yang terdaftar saat pembukaan rekening."}
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
