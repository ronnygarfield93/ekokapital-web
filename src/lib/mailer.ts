import nodemailer from "nodemailer";
import { COMPANY_INFO } from "./company-data";
import type { SubmissionType } from "./types";

export interface InternalAlertPayload {
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
 * Sends an internal email alert ONLY to PT Ekokapital Sekuritas staff.
 * Never sends email to the reporter/submitter (protects WBS confidentiality
 * and prevents third-party email spam/reflection abuse).
 */
export async function sendInternalSubmissionAlert(
  payload: InternalAlertPayload
): Promise<{ sent: boolean; reason?: string }> {
  const host = process.env.SMTP_HOST?.trim();
  const user = process.env.SMTP_USER?.trim();
  const pass = process.env.SMTP_PASS?.trim();

  if (!host || !user || !pass) {
    return { sent: false, reason: "smtp_not_configured" };
  }

  const port = parseInt(process.env.SMTP_PORT || "465", 10);
  const secure =
    process.env.SMTP_SECURE !== undefined
      ? process.env.SMTP_SECURE.toLowerCase() === "true"
      : port === 465;
  const from =
    process.env.SMTP_FROM?.trim() ||
    `Notifikasi Website Ekokapital <${user}>`;
  const to = getAlertRecipient(payload.type);

  const meta = getTypeMeta(payload.type);
  const submittedAtWib = new Intl.DateTimeFormat("id-ID", {
    dateStyle: "full",
    timeStyle: "medium",
    timeZone: "Asia/Jakarta",
  }).format(new Date());

  const safeSubjectLine = sanitizeHeader(
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

  const html = `<!doctype html>
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

  const text = [
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

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure,
    auth: { user, pass },
    connectionTimeout: 8000,
    greetingTimeout: 8000,
    socketTimeout: 10000,
  });

  try {
    await transporter.sendMail({
      from,
      to,
      subject: safeSubjectLine,
      text,
      html,
    });
    return { sent: true };
  } catch (err) {
    console.error(
      "[MAILER] Failed to send internal submission alert:",
      err instanceof Error ? err.message : "unknown_error"
    );
    return { sent: false, reason: "smtp_send_failed" };
  }
}
