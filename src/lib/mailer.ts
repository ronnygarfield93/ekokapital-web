import nodemailer from "nodemailer";
import { COMPANY_INFO } from "./company-data";
import type { SubmissionType } from "./types";

export interface SubmissionEmailPayload {
  ticketCode: string;
  type: SubmissionType;
  isAnonymous: boolean;
  fullName: string | null;
  email: string | null;
  phone: string | null;
  clientCode: string | null;
  subject: string;
  message: string;
}

function escapeHtml(input: string): string {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function sanitizeHeader(input: string): string {
  return input.replace(/[\r\n]+/g, " ").trim();
}

function formatWibNow(): string {
  return new Intl.DateTimeFormat("id-ID", {
    dateStyle: "full",
    timeStyle: "medium",
    timeZone: "Asia/Jakarta",
  }).format(new Date());
}

function getSmtpConfig() {
  const host = process.env.SMTP_HOST?.trim();
  const user = process.env.SMTP_USER?.trim();
  const pass = process.env.SMTP_PASS?.trim();

  if (!host || !user || !pass) {
    return null;
  }

  const port = parseInt(process.env.SMTP_PORT || "465", 10);
  const secure =
    process.env.SMTP_SECURE !== undefined
      ? process.env.SMTP_SECURE.toLowerCase() === "true"
      : port === 465;
  const rawFrom = process.env.SMTP_FROM?.trim();
  const from = rawFrom
    ? rawFrom.includes("@")
      ? rawFrom
      : `"${rawFrom.replace(/"/g, "")}" <${user}>`
    : `PT Ekokapital Sekuritas <${user}>`;

  return { host, port, secure, user, pass, from };
}

function createTransporter(cfg: NonNullable<ReturnType<typeof getSmtpConfig>>) {
  return nodemailer.createTransport({
    host: cfg.host,
    port: cfg.port,
    secure: cfg.secure,
    auth: { user: cfg.user, pass: cfg.pass },
    connectionTimeout: 8000,
    greetingTimeout: 8000,
    socketTimeout: 10000,
  });
}

function getAlertRecipient(type: SubmissionType): string {
  if (type === "whistleblowing") {
    return (
      process.env.WBS_ALERT_EMAIL?.trim() ||
      process.env.ALERT_EMAIL?.trim() ||
      COMPANY_INFO.wbsEmail
    );
  }
  if (type === "complaint") {
    return (
      process.env.COMPLAINT_ALERT_EMAIL?.trim() ||
      process.env.ALERT_EMAIL?.trim() ||
      COMPANY_INFO.complaintEmail
    );
  }
  return (
    process.env.CONTACT_ALERT_EMAIL?.trim() ||
    process.env.ALERT_EMAIL?.trim() ||
    COMPANY_INFO.csEmail
  );
}

function getTypeMeta(type: SubmissionType): {
  badge: string;
  title: string;
  accent: string;
} {
  if (type === "whistleblowing") {
    return {
      badge: "WHISTLEBLOWING SYSTEM (WBS)",
      title: "Laporan Baru Whistleblowing System",
      accent: "#b45309",
    };
  }
  if (type === "complaint") {
    return {
      badge: "PENGADUAN NASABAH",
      title: "Laporan Pengaduan Nasabah Baru",
      accent: "#1d4ed8",
    };
  }
  return {
    badge: "PESAN KONTAK",
    title: "Pesan Baru dari Formulir Hubungi Kami",
    accent: "#122952",
  };
}

/**
 * Sends email notifications for a new submission:
 * - Always sends an internal alert to PT Ekokapital Sekuritas (WBS, Complaint, Contact).
 * - For Customer Complaints ("complaint") ONLY, also sends an official POJK 18/2018
 *   receipt confirmation email with ticket number to the customer's email address.
 * - Never sends email to Whistleblowing (WBS) reporters to preserve strict confidentiality.
 */
export async function sendSubmissionEmails(
  payload: SubmissionEmailPayload
): Promise<{
  internalSent: boolean;
  customerReceiptSent: boolean;
  reason?: string;
}> {
  const cfg = getSmtpConfig();
  if (!cfg) {
    console.warn(
      `[MAILER] SMTP belum dikonfigurasi (SMTP_HOST/SMTP_USER/SMTP_PASS kosong). Email untuk tiket ${payload.ticketCode} dilewati.`
    );
    return {
      internalSent: false,
      customerReceiptSent: false,
      reason: "smtp_not_configured",
    };
  }

  const transporter = createTransporter(cfg);
  const submittedAtWib = formatWibNow();
  const meta = getTypeMeta(payload.type);

  // 1. Internal alert email to PT Ekokapital Sekuritas
  let internalSent = false;
  const internalTo = getAlertRecipient(payload.type);
  const internalSubject = sanitizeHeader(
    `[${meta.badge}][${payload.ticketCode}] ${payload.subject}`
  ).slice(0, 180);

  const reporterRowsHtml = payload.isAnonymous
    ? `<tr>
        <td style="padding:8px 12px;color:#64748b;width:150px;font-size:13px;">Identitas Pelapor</td>
        <td style="padding:8px 12px;color:#92400e;font-weight:700;font-size:13px;">Laporan Anonim (Identitas dirahasiakan)</td>
      </tr>`
    : `<tr>
        <td style="padding:8px 12px;color:#64748b;width:150px;font-size:13px;">Nama Pelapor</td>
        <td style="padding:8px 12px;color:#0f172a;font-weight:600;font-size:13px;">${escapeHtml(payload.fullName || "-")}</td>
      </tr>
      <tr>
        <td style="padding:8px 12px;color:#64748b;font-size:13px;">Email</td>
        <td style="padding:8px 12px;color:#0f172a;font-size:13px;">${escapeHtml(payload.email || "-")}</td>
      </tr>
      <tr>
        <td style="padding:8px 12px;color:#64748b;font-size:13px;">No. Telepon</td>
        <td style="padding:8px 12px;color:#0f172a;font-size:13px;">${escapeHtml(payload.phone || "-")}</td>
      </tr>
      ${
        payload.clientCode
          ? `<tr>
              <td style="padding:8px 12px;color:#64748b;font-size:13px;">Kode Nasabah / SID</td>
              <td style="padding:8px 12px;color:#0f172a;font-family:monospace;font-size:13px;">${escapeHtml(payload.clientCode)}</td>
            </tr>`
          : ""
      }`;

  const internalHtml = `<!doctype html>
<html lang="id">
<head><meta charset="utf-8" /></head>
<body style="margin:0;padding:24px;background:#f1f5fb;font-family:Segoe UI,Arial,sans-serif;color:#0f172a;">
  <div style="max-width:640px;margin:0 auto;background:#ffffff;border-radius:14px;overflow:hidden;border:1px solid #cbd5e1;">
    <div style="background:#122952;padding:20px 24px;border-bottom:4px solid #cfa03b;">
      <p style="margin:0;font-size:11px;font-weight:700;letter-spacing:1.4px;color:#ebd082;text-transform:uppercase;">
        PT EKOKAPITAL SEKURITAS • INTERNAL ALERT
      </p>
      <h1 style="margin:6px 0 0;font-size:18px;color:#ffffff;">${escapeHtml(meta.title)}</h1>
    </div>

    <div style="padding:24px;">
      <div style="display:inline-block;padding:6px 12px;border-radius:8px;background:#fef3c7;color:${meta.accent};font-size:12px;font-weight:700;">
        Nomor Tiket: ${escapeHtml(payload.ticketCode)}
      </div>
      <p style="margin:10px 0 18px;font-size:12px;color:#64748b;">
        Diterima pada: ${escapeHtml(submittedAtWib)} WIB
      </p>

      <table style="width:100%;border-collapse:collapse;background:#f8fafc;border:1px solid #e2e8f0;border-radius:10px;">
        <tbody>
          ${reporterRowsHtml}
          <tr>
            <td style="padding:8px 12px;color:#64748b;font-size:13px;border-top:1px solid #e2e8f0;">Subjek</td>
            <td style="padding:8px 12px;color:#0f172a;font-weight:700;font-size:13px;border-top:1px solid #e2e8f0;">${escapeHtml(payload.subject)}</td>
          </tr>
        </tbody>
      </table>

      <div style="margin-top:18px;">
        <p style="margin:0 0 8px;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.8px;color:#475569;">
          Uraian Laporan / Pesan
        </p>
        <div style="padding:14px 16px;background:#f8fafc;border:1px solid #e2e8f0;border-radius:10px;font-size:13px;line-height:1.65;color:#1e293b;white-space:pre-wrap;">${escapeHtml(payload.message)}</div>
      </div>

      <p style="margin:20px 0 0;padding-top:14px;border-top:1px solid #e2e8f0;font-size:12px;color:#64748b;line-height:1.6;">
        Email ini adalah notifikasi internal otomatis dari website resmi PT Ekokapital Sekuritas. Silakan tindak lanjuti dan perbarui status tiket melalui Portal Admin CMS (<strong>Kotak Masuk &amp; WBS</strong>).
      </p>
    </div>
  </div>
</body>
</html>`;

  const internalText = [
    `PT EKOKAPITAL SEKURITAS - INTERNAL ALERT`,
    `${meta.title}`,
    `Nomor Tiket : ${payload.ticketCode}`,
    `Waktu       : ${submittedAtWib} WIB`,
    payload.isAnonymous
      ? `Pelapor     : ANONIM`
      : [
          `Nama        : ${payload.fullName || "-"}`,
          `Email       : ${payload.email || "-"}`,
          `Telepon     : ${payload.phone || "-"}`,
          payload.clientCode ? `Kode Nasabah: ${payload.clientCode}` : null,
        ]
          .filter(Boolean)
          .join("\n"),
    `Subjek      : ${payload.subject}`,
    ``,
    `Uraian Laporan / Pesan:`,
    payload.message,
  ].join("\n");

  try {
    await transporter.sendMail({
      from: cfg.from,
      to: internalTo,
      subject: internalSubject,
      text: internalText,
      html: internalHtml,
    });
    internalSent = true;
  } catch (err) {
    console.error(
      "[MAILER] Gagal mengirim email alert internal:",
      err instanceof Error ? err.message : "unknown_error"
    );
  }

  // 2. Official receipt confirmation email to customer ONLY for Customer Complaints ("complaint")
  let customerReceiptSent = false;
  if (
    payload.type === "complaint" &&
    !payload.isAnonymous &&
    payload.email &&
    payload.email.includes("@")
  ) {
    const customerTo = sanitizeHeader(payload.email);
    const customerSubject = sanitizeHeader(
      `[PT Ekokapital Sekuritas] Bukti Tanda Terima Pengaduan — ${payload.ticketCode}`
    );

    const customerHtml = `<!doctype html>
<html lang="id">
<head><meta charset="utf-8" /></head>
<body style="margin:0;padding:24px;background:#f1f5fb;font-family:Segoe UI,Arial,sans-serif;color:#0f172a;">
  <div style="max-width:620px;margin:0 auto;background:#ffffff;border-radius:14px;overflow:hidden;border:1px solid #cbd5e1;">
    <div style="background:#122952;padding:22px 24px;border-bottom:4px solid #cfa03b;">
      <p style="margin:0;font-size:11px;font-weight:700;letter-spacing:1.4px;color:#ebd082;text-transform:uppercase;">
        PT EKOKAPITAL SEKURITAS
      </p>
      <h1 style="margin:6px 0 0;font-size:18px;color:#ffffff;">
        Bukti Tanda Terima Pengaduan Nasabah
      </h1>
    </div>

    <div style="padding:24px;">
      <p style="margin:0 0 14px;font-size:14px;line-height:1.6;color:#1e293b;">
        Yth. <strong>${escapeHtml(payload.fullName || "Nasabah")}</strong>,
      </p>
      <p style="margin:0 0 18px;font-size:13.5px;line-height:1.65;color:#334155;">
        Terima kasih telah menghubungi PT Ekokapital Sekuritas. Pengaduan Anda telah kami terima dan tercatat secara resmi dalam sistem layanan pengaduan nasabah kami dengan detail berikut:
      </p>

      <div style="margin:0 0 18px;padding:14px 16px;border-radius:10px;background:#f8fafc;border:1px solid #cbd5e1;text-align:center;">
        <p style="margin:0;font-size:11px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:#64748b;">
          Nomor Registrasi Pengaduan
        </p>
        <p style="margin:6px 0 0;font-size:20px;font-weight:800;font-family:Consolas,monospace;color:#122952;">
          ${escapeHtml(payload.ticketCode)}
        </p>
      </div>

      <table style="width:100%;border-collapse:collapse;background:#f8fafc;border:1px solid #e2e8f0;border-radius:10px;">
        <tbody>
          <tr>
            <td style="padding:8px 12px;color:#64748b;width:155px;font-size:13px;">Waktu Diterima</td>
            <td style="padding:8px 12px;color:#0f172a;font-size:13px;">${escapeHtml(submittedAtWib)} WIB</td>
          </tr>
          ${
            payload.clientCode
              ? `<tr>
                  <td style="padding:8px 12px;color:#64748b;font-size:13px;border-top:1px solid #e2e8f0;">Kode Nasabah / SID</td>
                  <td style="padding:8px 12px;color:#0f172a;font-family:monospace;font-size:13px;border-top:1px solid #e2e8f0;">${escapeHtml(payload.clientCode)}</td>
                </tr>`
              : ""
          }
          <tr>
            <td style="padding:8px 12px;color:#64748b;font-size:13px;border-top:1px solid #e2e8f0;">Perihal Pengaduan</td>
            <td style="padding:8px 12px;color:#0f172a;font-weight:600;font-size:13px;border-top:1px solid #e2e8f0;">${escapeHtml(payload.subject)}</td>
          </tr>
        </tbody>
      </table>

      <div style="margin-top:18px;padding:14px 16px;border-radius:10px;background:#fffbeb;border:1px solid #fde68a;font-size:12.5px;line-height:1.6;color:#78350f;">
        <strong>Informasi Tindak Lanjut (POJK 18/POJK.07/2018):</strong><br />
        Tim Layanan Pengaduan Nasabah PT Ekokapital Sekuritas akan menindaklanjuti pengaduan Anda sesuai ketentuan OJK yang berlaku (maksimal 20 hari kerja sejak dokumen pendukung lengkap diterima). Mohon simpan nomor registrasi di atas untuk referensi tindak lanjut.
      </div>

      <p style="margin:18px 0 0;font-size:12.5px;line-height:1.6;color:#475569;">
        Untuk pertanyaan lebih lanjut, hubungi layanan nasabah resmi kami:<br />
        Telepon: <strong>${escapeHtml(COMPANY_INFO.csPhone)}</strong> • Email: <strong>${escapeHtml(COMPANY_INFO.complaintEmail)}</strong>
      </p>

      <p style="margin:16px 0 0;padding-top:14px;border-top:1px solid #e2e8f0;font-size:11.5px;color:#64748b;line-height:1.6;">
        <em>Peringatan Keamanan: PT Ekokapital Sekuritas tidak pernah meminta Password, PIN Trading, atau kode OTP Anda melalui email, telepon, maupun media lainnya. Email ini dikirim secara otomatis, mohon tidak membalas langsung ke alamat ini.</em>
      </p>
    </div>
  </div>
</body>
</html>`;

    const customerText = [
      `PT EKOKAPITAL SEKURITAS`,
      `Bukti Tanda Terima Pengaduan Nasabah`,
      ``,
      `Yth. ${payload.fullName || "Nasabah"},`,
      `Pengaduan Anda telah resmi kami terima dan tercatat dengan detail berikut:`,
      ``,
      `Nomor Registrasi : ${payload.ticketCode}`,
      `Waktu Diterima   : ${submittedAtWib} WIB`,
      payload.clientCode ? `Kode Nasabah/SID : ${payload.clientCode}` : null,
      `Perihal          : ${payload.subject}`,
      ``,
      `Tim Layanan Pengaduan Nasabah akan menindaklanjuti pengaduan Anda sesuai POJK 18/POJK.07/2018 (maksimal 20 hari kerja sejak dokumen lengkap diterima). Mohon simpan nomor registrasi di atas sebagai referensi.`,
      ``,
      `Layanan Nasabah Resmi: ${COMPANY_INFO.csPhone} | ${COMPANY_INFO.complaintEmail}`,
      `Catatan Keamanan: PT Ekokapital Sekuritas tidak pernah meminta Password, PIN Trading, atau OTP Anda.`,
    ]
      .filter((line) => line !== null)
      .join("\n");

    try {
      await transporter.sendMail({
        from: cfg.from,
        to: customerTo,
        subject: customerSubject,
        text: customerText,
        html: customerHtml,
      });
      customerReceiptSent = true;
    } catch (err) {
      console.error(
        "[MAILER] Gagal mengirim email tanda terima ke nasabah:",
        err instanceof Error ? err.message : "unknown_error"
      );
    }
  }

  return { internalSent, customerReceiptSent };
}
