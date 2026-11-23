"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Lock, ShieldCheck } from "lucide-react";
import { BrandLogo } from "@/components/BrandLogo";

export function AdminLoginClient() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json.error || "Login gagal.");
      } else {
        router.refresh();
      }
    } catch {
      setError("Tidak dapat terhubung ke server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-eko-hero flex min-h-screen flex-col items-center justify-center px-4 py-12 text-white">
      <div className="hero-grid-pattern fixed inset-0 opacity-40" />

      <div className="relative z-10 w-full max-w-md">
        <div className="mb-8 flex flex-col items-center text-center">
          <BrandLogo variant="light" />
          <p className="mt-3 text-xs font-semibold uppercase tracking-[0.2em] text-gold-300">
            Admin Management Portal
          </p>
        </div>

        <div className="rounded-3xl border border-white/15 bg-white p-7 text-slate-900 shadow-2xl sm:p-8">
          <div className="flex items-center gap-2.5 border-b border-slate-100 pb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-navy-900 text-gold-300">
              <Lock className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-navy-900">Masuk Panel Admin</h1>
              <p className="text-xs text-slate-500">
                Akses khusus staf berwenang PT Ekokapital Sekuritas
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} autoComplete="off" className="mt-6 space-y-4">
            <div>
              <label
                htmlFor="portal-email"
                className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-600"
              >
                Email Admin
              </label>
              <input
                id="portal-email"
                name="portal_email_entry"
                type="email"
                required
                autoComplete="off"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 outline-none transition focus:border-navy-600 focus:ring-2 focus:ring-navy-500/20"
              />
            </div>

            <div>
              <label
                htmlFor="portal-password"
                className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-600"
              >
                Kata Sandi
              </label>
              <input
                id="portal-password"
                name="portal_pass_entry"
                type="password"
                required
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 outline-none transition focus:border-navy-600 focus:ring-2 focus:ring-navy-500/20"
              />
            </div>

            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50 px-3.5 py-2.5 text-xs font-semibold text-red-700">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-navy-800 px-4 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-navy-700 disabled:opacity-60"
            >
              {loading ? "Memverifikasi..." : "Masuk ke Dashboard"}
            </button>
          </form>

          <div className="mt-6 flex items-center gap-2 rounded-xl bg-slate-50 px-3.5 py-2.5 text-[11px] text-slate-600">
            <ShieldCheck className="h-4 w-4 shrink-0 text-emerald-600" />
            <span>
              Dilindungi enkripsi Scrypt, sesi HttpOnly, pembatasan percobaan login, &amp; pencatatan audit.
            </span>
          </div>
        </div>

        <div className="mt-6 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-navy-200 transition hover:text-gold-300"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Kembali ke Website Utama
          </Link>
        </div>
      </div>
    </div>
  );
}
