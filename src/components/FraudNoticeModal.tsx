"use client";

import { useEffect, useState } from "react";
import { AlertTriangle, ExternalLink, ShieldAlert, X } from "lucide-react";
import type { Lang, NoticeItem } from "@/lib/types";
import { dictionary, pickLang } from "@/lib/i18n";

interface FraudNoticeModalProps {
  notices: NoticeItem[];
  lang: Lang;
}

const SESSION_DISMISS_KEY = "ek_notice_dismissed_v1";

export function FraudNoticeModal({ notices, lang }: FraudNoticeModalProps) {
  const modalNotice = notices.find((n) => n.active === 1 && n.show_as_modal === 1);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!modalNotice) return;
    try {
      const seen = sessionStorage.getItem(SESSION_DISMISS_KEY);
      if (!seen) {
        setOpen(true);
      }
    } catch {
      // Ignore storage errors
    }
  }, [modalNotice]);

  if (!modalNotice) return null;

  const t = dictionary[lang];
  const title = pickLang(lang, modalNotice.title_id, modalNotice.title_en);
  const body = pickLang(lang, modalNotice.body_id, modalNotice.body_en);
  const ctaLabel = pickLang(
    lang,
    modalNotice.cta_label_id,
    modalNotice.cta_label_en
  );

  const dismiss = () => {
    setOpen(false);
    try {
      sessionStorage.setItem(SESSION_DISMISS_KEY, "1");
    } catch {
      // Ignore
    }
  };

  return (
    <>
      {/* Slim non-intrusive top alert strip with smooth right-to-left running text */}
      <div className="border-b border-amber-200/80 bg-gradient-to-r from-amber-50 via-amber-100/70 to-amber-50 text-amber-950">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-2 text-xs sm:px-6 lg:px-8">
          <div className="eko-marquee-wrapper flex min-w-0 flex-1 items-center gap-2.5 overflow-hidden">
            <AlertTriangle className="h-4 w-4 shrink-0 text-amber-600" />
            <div className="relative min-w-0 flex-1 overflow-hidden">
              <div className="eko-marquee-track items-center gap-12 whitespace-nowrap font-medium">
                <span>
                  <strong className="font-bold">{title}:</strong> {body}
                </span>
                <span aria-hidden="true">
                  <strong className="font-bold">{title}:</strong> {body}
                </span>
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="shrink-0 rounded-md bg-amber-200/80 px-2.5 py-1 font-semibold text-amber-950 transition hover:bg-amber-300/80"
          >
            {lang === "en" ? "Details" : "Detail"}
          </button>
        </div>
      </div>

      {/* Single clean modal (shown once per session) */}
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-navy-950/70 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="fraud-notice-title"
        >
          <div className="relative w-full max-w-xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">
            <div className="flex items-center justify-between bg-navy-900 px-6 py-4 text-white">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-500/20 text-amber-400">
                  <ShieldAlert className="h-5 w-5" />
                </div>
                <div>
                  <span className="text-[11px] font-semibold uppercase tracking-widest text-gold-300">
                    {t.common.fraudWarningBadge}
                  </span>
                  <h2
                    id="fraud-notice-title"
                    className="text-base font-bold leading-snug text-white"
                  >
                    {title}
                  </h2>
                </div>
              </div>
              <button
                type="button"
                onClick={dismiss}
                aria-label={t.common.close}
                className="rounded-lg p-1.5 text-navy-200 transition hover:bg-white/10 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4 px-6 py-5 text-sm leading-relaxed text-slate-700">
              <p className="whitespace-pre-line">{body}</p>

              <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-xs text-amber-950">
                <p className="font-semibold">
                  {lang === "en"
                    ? "Official Verification Channels:"
                    : "Kanal Konfirmasi Resmi PT Ekokapital Sekuritas:"}
                </p>
                <ul className="mt-1.5 space-y-1">
                  <li>
                    • Website: <strong>https://ekokapital.com</strong>
                  </li>
                  <li>
                    • Customer Service: <strong>+62-21-57904588</strong> /{" "}
                    <strong>cs@ekokapital.com</strong>
                  </li>
                  <li>
                    • {lang === "en" ? "OJK Contact Center:" : "Kontak OJK:"}{" "}
                    <strong>157</strong> |{" "}
                    <strong>iasc.ojk.go.id</strong>
                  </li>
                </ul>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-end gap-3 border-t border-slate-100 bg-slate-50 px-6 py-4">
              {modalNotice.cta_url && ctaLabel && (
                <a
                  href={modalNotice.cta_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-lg border border-navy-200 bg-white px-4 py-2 text-xs font-semibold text-navy-800 transition hover:bg-navy-50"
                >
                  {ctaLabel}
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              )}
              <button
                type="button"
                onClick={dismiss}
                className="rounded-lg bg-navy-800 px-5 py-2 text-xs font-semibold text-white transition hover:bg-navy-700"
              >
                {t.common.fraudAcknowledge}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
