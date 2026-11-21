"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, Lock, Send, ShieldCheck } from "lucide-react";
import type { Lang, SubmissionType } from "@/lib/types";

interface SecureSubmissionFormProps {
  type: SubmissionType;
  lang: Lang;
  allowAnonymousOption?: boolean;
}

export function SecureSubmissionForm({
  type,
  lang,
  allowAnonymousOption = false,
}: SecureSubmissionFormProps) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [clientCode, setClientCode] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [website, setWebsite] = useState(""); // honeypot
  const [captchaA, setCaptchaA] = useState<number | null>(null);
  const [captchaB, setCaptchaB] = useState<number | null>(null);
  const [captchaToken, setCaptchaToken] = useState("");
  const [captchaAnswer, setCaptchaAnswer] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ticketCode, setTicketCode] = useState<string | null>(null);

  const loadCaptcha = async () => {
    try {
      const res = await fetch("/api/captcha", { cache: "no-store" });
      if (!res.ok) return;
      const json = await res.json();
      setCaptchaA(json.a);
      setCaptchaB(json.b);
      setCaptchaToken(json.token);
      setCaptchaAnswer("");
    } catch {
      // Retry on next interaction
    }
  };

  useEffect(() => {
    loadCaptcha();
  }, []);

  const isEn = lang === "en";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      const res = await fetch("/api/submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type,
          is_anonymous: isAnonymous,
          full_name: isAnonymous ? "" : fullName,
          email: isAnonymous ? "" : email,
          phone: isAnonymous ? "" : phone,
          client_code: clientCode,
          subject,
          message,
          website,
          captcha_token: captchaToken,
          captcha_answer: Number(captchaAnswer),
        }),
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json.error || (isEn ? "Failed to submit form." : "Gagal mengirim formulir."));
        await loadCaptcha();
      } else {
        setTicketCode(json.ticket_code);
        setFullName("");
        setEmail("");
        setPhone("");
        setClientCode("");
        setSubject("");
        setMessage("");
        await loadCaptcha();
      }
    } catch {
      setError(
        isEn
          ? "Network error occurred. Please try again."
          : "Terjadi gangguan jaringan. Silakan coba kembali."
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (ticketCode) {
    return (
      <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6 sm:p-8">
        <div className="flex items-start gap-3">
          <CheckCircle2 className="mt-0.5 h-6 w-6 shrink-0 text-emerald-600" />
          <div>
            <h3 className="text-lg font-bold text-emerald-950">
              {isEn ? "Submission Received Successfully" : "Laporan / Pesan Berhasil Diterima"}
            </h3>
            <p className="mt-1.5 text-sm text-emerald-900">
              {isEn
                ? "Please save your official reference number below for follow-up:"
                : "Mohon simpan nomor registrasi resmi di bawah ini untuk pemantauan tindak lanjut:"}
            </p>
            <div className="mt-4 inline-flex items-center gap-2 rounded-xl border border-emerald-300 bg-white px-4 py-2.5 font-mono text-base font-bold text-navy-900 shadow-sm">
              {ticketCode}
            </div>
            <div className="mt-5">
              <button
                type="button"
                onClick={() => setTicketCode(null)}
                className="text-sm font-semibold text-emerald-800 underline hover:text-emerald-950"
              >
                {isEn ? "Submit another inquiry" : "Kirim pesan / laporan lainnya"}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-card sm:p-8"
    >
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div className="flex items-center gap-2 text-navy-800">
          <ShieldCheck className="h-5 w-5 text-gold-500" />
          <span className="text-sm font-semibold">
            {isEn ? "Encrypted & Validated Form" : "Formulir Terenkripsi & Tervalidasi"}
          </span>
        </div>
        <span className="inline-flex items-center gap-1 rounded-full bg-navy-50 px-2.5 py-1 text-[11px] font-semibold text-navy-700">
          <Lock className="h-3 w-3" /> HTTPS
        </span>
      </div>

      {/* Hidden honeypot for bots */}
      <div className="hidden" aria-hidden="true">
        <label htmlFor={`hp-${type}`}>Website</label>
        <input
          id={`hp-${type}`}
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
        />
      </div>

      {allowAnonymousOption && (
        <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3.5 text-sm">
          <input
            type="checkbox"
            checked={isAnonymous}
            onChange={(e) => setIsAnonymous(e.target.checked)}
            className="mt-1 h-4 w-4 rounded border-slate-300 text-navy-700 focus:ring-navy-500"
          />
          <span className="text-slate-700">
            <strong className="text-navy-900">
              {isEn ? "Submit Confidential Tip (Hide Identity)" : "Kirim Sebagai Catatan Rahasia (Tanpa Identitas)"}
            </strong>
            <span className="mt-0.5 block text-xs text-slate-500">
              {isEn
                ? "Note: Per PT Ekokapital Sekuritas WBS policy, formal investigation requires verified reporter identity; confidentiality is strictly guaranteed."
                : "Catatan: Sesuai kebijakan WBS PT Ekokapital Sekuritas, tindak lanjut formal memerlukan identitas pelapor yang jelas; kerahasiaan identitas dijamin sepenuhnya."}
            </span>
          </span>
        </label>
      )}

      {!isAnonymous && (
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-600">
              {isEn ? "Full Name *" : "Nama Lengkap *"}
            </label>
            <input
              type="text"
              required
              maxLength={120}
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder={isEn ? "Your full name" : "Nama sesuai KTP"}
              className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none transition focus:border-navy-500 focus:ring-2 focus:ring-navy-500/20"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-600">
              {isEn ? "Email Address *" : "Alamat Email *"}
            </label>
            <input
              type="email"
              required
              maxLength={160}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="nama@email.com"
              className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none transition focus:border-navy-500 focus:ring-2 focus:ring-navy-500/20"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-600">
              {isEn ? "Phone / WhatsApp" : "Nomor Telepon / HP"}
            </label>
            <input
              type="tel"
              maxLength={40}
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+62 812-xxxx-xxxx"
              className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none transition focus:border-navy-500 focus:ring-2 focus:ring-navy-500/20"
            />
          </div>
          {type === "complaint" && (
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-600">
                {isEn ? "Client Code / SID (Optional)" : "Kode Nasabah / SID (Opsional)"}
              </label>
              <input
                type="text"
                maxLength={40}
                value={clientCode}
                onChange={(e) => setClientCode(e.target.value)}
                placeholder="IDD..."
                className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none transition focus:border-navy-500 focus:ring-2 focus:ring-navy-500/20"
              />
            </div>
          )}
        </div>
      )}

      <div>
        <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-600">
          {isEn ? "Subject *" : "Subjek / Judul *"}
        </label>
        <input
          type="text"
          required
          minLength={4}
          maxLength={200}
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          placeholder={
            type === "complaint"
              ? isEn
                ? "Summary of your complaint"
                : "Ringkasan pokok pengaduan"
              : type === "whistleblowing"
                ? isEn
                  ? "Subject of suspected violation report"
                  : "Pokok dugaan pelanggaran yang dilaporkan"
                : isEn
                  ? "How can we help you?"
                  : "Bagaimana kami dapat membantu Anda?"
          }
          className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none transition focus:border-navy-500 focus:ring-2 focus:ring-navy-500/20"
        />
      </div>

      <div>
        <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-600">
          {isEn ? "Detailed Description *" : "Uraian Lengkap *"}
        </label>
        <textarea
          required
          minLength={15}
          maxLength={5000}
          rows={5}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder={
            isEn
              ? "Please provide chronological details, dates, and relevant references..."
              : "Mohon jelaskan kronologi, tanggal kejadian, serta informasi pendukung lainnya..."
          }
          className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none transition focus:border-navy-500 focus:ring-2 focus:ring-navy-500/20"
        />
      </div>

      {/* Anti-bot verification */}
      <div className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-navy-800">
            {isEn ? "Security Verification *" : "Verifikasi Keamanan *"}
          </p>
          <p className="mt-0.5 text-sm text-slate-700">
            {isEn ? "What is" : "Berapakah hasil dari"}{" "}
            <strong className="font-mono text-navy-900">
              {captchaA !== null && captchaB !== null
                ? `${captchaA} + ${captchaB}`
                : "..."}
            </strong>
            ?
          </p>
        </div>
        <input
          type="number"
          required
          value={captchaAnswer}
          onChange={(e) => setCaptchaAnswer(e.target.value)}
          placeholder="?"
          className="w-28 rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-center font-mono text-sm font-semibold text-navy-900 outline-none focus:border-navy-500 focus:ring-2 focus:ring-navy-500/20"
        />
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-800">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-navy-800 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-navy-700 disabled:opacity-60 sm:w-auto"
      >
        <Send className="h-4 w-4" />
        {submitting
          ? isEn
            ? "Submitting..."
            : "Mengirim..."
          : isEn
            ? "Submit Securely"
            : "Kirim Secara Aman"}
      </button>
    </form>
  );
}
