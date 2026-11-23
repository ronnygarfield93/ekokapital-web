"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  AlertTriangle,
  Bell,
  ExternalLink,
  FileSpreadsheet,
  FileText,
  Inbox,
  KeyRound,
  LayoutDashboard,
  LogOut,
  Pencil,
  Plus,
  ShieldCheck,
  Trash2,
  Upload,
  Users,
  X,
} from "lucide-react";
import { BrandLogo } from "./BrandLogo";
import type {
  AdminUser,
  AuditLogItem,
  DocumentCategory,
  DocumentItem,
  NoticeItem,
  PostCategory,
  PostItem,
  SubmissionItem,
  SubmissionStatus,
  WppeStaffItem,
} from "@/lib/types";

type TabKey =
  | "overview"
  | "posts"
  | "documents"
  | "wppe"
  | "notices"
  | "submissions"
  | "security";

export function AdminDashboardClient({ admin }: { admin: AdminUser }) {
  const router = useRouter();
  const [tab, setTab] = useState<TabKey>("overview");
  const [posts, setPosts] = useState<PostItem[]>([]);
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [wppe, setWppe] = useState<WppeStaffItem[]>([]);
  const [notices, setNotices] = useState<NoticeItem[]>([]);
  const [submissions, setSubmissions] = useState<SubmissionItem[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLogItem[]>([]);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Post form state
  const [postCat, setPostCat] = useState<PostCategory>("news");
  const [postTitleId, setPostTitleId] = useState("");
  const [postTitleEn, setPostTitleEn] = useState("");
  const [postExcerptId, setPostExcerptId] = useState("");
  const [postExcerptEn, setPostExcerptEn] = useState("");
  const [postContentId, setPostContentId] = useState("");
  const [postContentEn, setPostContentEn] = useState("");
  const [postDate, setPostDate] = useState(
    new Date().toISOString().slice(0, 10)
  );

  // Document form state
  const docFormRef = useRef<HTMLFormElement | null>(null);
  const docFileInputRef = useRef<HTMLInputElement | null>(null);
  const [editingDocId, setEditingDocId] = useState<number | null>(null);
  const [editingDocCurrentUrl, setEditingDocCurrentUrl] = useState("");
  const [docSaving, setDocSaving] = useState(false);
  const [docCat, setDocCat] = useState<DocumentCategory>("financial_report");
  const [docYear, setDocYear] = useState(String(new Date().getFullYear()));
  const [docTitleId, setDocTitleId] = useState("");
  const [docTitleEn, setDocTitleEn] = useState("");
  const [docDescId, setDocDescId] = useState("");
  const [docDescEn, setDocDescEn] = useState("");
  const [docUrl, setDocUrl] = useState("");
  const [docFile, setDocFile] = useState<File | null>(null);

  // WPPE form state
  const [wppeName, setWppeName] = useState("");
  const [wppeLicense, setWppeLicense] = useState("");
  const [wppePosId, setWppePosId] = useState("Equity Sales");
  const [wppePosEn, setWppePosEn] = useState("Equity Sales");

  // Notice form state
  const [noticeType, setNoticeType] = useState<"fraud_alert" | "announcement">(
    "fraud_alert"
  );
  const [noticeTitleId, setNoticeTitleId] = useState("");
  const [noticeTitleEn, setNoticeTitleEn] = useState("");
  const [noticeBodyId, setNoticeBodyId] = useState("");
  const [noticeBodyEn, setNoticeBodyEn] = useState("");
  const [noticeModal, setNoticeModal] = useState(true);

  // Password form state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const flash = (msg: string, isError = false) => {
    if (isError) {
      setErrorMsg(msg);
      setStatusMsg(null);
    } else {
      setStatusMsg(msg);
      setErrorMsg(null);
    }
  };

  const loadAll = useCallback(async () => {
    const [pRes, dRes, wRes, nRes, sRes, lRes] = await Promise.all([
      fetch("/api/admin/posts"),
      fetch("/api/admin/documents"),
      fetch("/api/admin/wppe"),
      fetch("/api/admin/notices"),
      fetch("/api/admin/submissions"),
      fetch("/api/admin/audit-logs"),
    ]);

    if (pRes.status === 401) {
      window.location.href = "/portal-es-internal";
      return;
    }

    const [pJ, dJ, wJ, nJ, sJ, lJ] = await Promise.all([
      pRes.json(),
      dRes.json(),
      wRes.json(),
      nRes.json(),
      sRes.json(),
      lRes.json(),
    ]);

    setPosts(pJ.posts || []);
    setDocuments(dJ.documents || []);
    setWppe(wJ.staff || []);
    setNotices(nJ.notices || []);
    setSubmissions(sJ.submissions || []);
    setAuditLogs(lJ.logs || []);
  }, [router]);

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    window.location.href = "/portal-es-internal";
  };

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/admin/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        category: postCat,
        title_id: postTitleId,
        title_en: postTitleEn || postTitleId,
        excerpt_id: postExcerptId,
        excerpt_en: postExcerptEn || postExcerptId,
        content_id: postContentId,
        content_en: postContentEn || postContentId,
        published: true,
        published_at: postDate,
      }),
    });
    const j = await res.json();
    if (!res.ok) return flash(j.error || "Gagal menyimpan artikel.", true);
    setPostTitleId("");
    setPostTitleEn("");
    setPostExcerptId("");
    setPostExcerptEn("");
    setPostContentId("");
    setPostContentEn("");
    flash("Artikel berhasil dipublikasikan!");
    loadAll();
  };

  const handleDeletePost = async (id: number) => {
    if (!confirm("Hapus artikel ini secara permanen?")) return;
    await fetch(`/api/admin/posts?id=${id}`, { method: "DELETE" });
    flash("Artikel dihapus.");
    loadAll();
  };

  const resetDocForm = () => {
    setEditingDocId(null);
    setEditingDocCurrentUrl("");
    setDocCat("financial_report");
    setDocYear(String(new Date().getFullYear()));
    setDocTitleId("");
    setDocTitleEn("");
    setDocDescId("");
    setDocDescEn("");
    setDocUrl("");
    setDocFile(null);
    if (docFileInputRef.current) {
      docFileInputRef.current.value = "";
    }
  };

  const startEditDoc = (doc: DocumentItem) => {
    setEditingDocId(doc.id);
    setEditingDocCurrentUrl(doc.file_url);
    setDocCat(doc.category);
    setDocYear(doc.year ? String(doc.year) : "");
    setDocTitleId(doc.title_id);
    setDocTitleEn(doc.title_en);
    setDocDescId(doc.description_id || "");
    setDocDescEn(doc.description_en || "");
    setDocUrl(doc.file_url);
    setDocFile(null);
    if (docFileInputRef.current) {
      docFileInputRef.current.value = "";
    }
    setStatusMsg(null);
    setErrorMsg(null);
    docFormRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleSaveDoc = async (e: React.FormEvent) => {
    e.preventDefault();
    setDocSaving(true);
    try {
      const fd = new FormData();
      if (editingDocId !== null) {
        fd.append("id", String(editingDocId));
      }
      fd.append("category", docCat);
      if (docYear.trim()) fd.append("year", docYear.trim());
      fd.append("title_id", docTitleId);
      fd.append("title_en", docTitleEn || docTitleId);
      fd.append("description_id", docDescId);
      fd.append("description_en", docDescEn || docDescId);
      if (docFile) {
        fd.append("file", docFile);
      } else if (docUrl.trim()) {
        fd.append("file_url", docUrl.trim());
      }

      const isEdit = editingDocId !== null;
      const res = await fetch("/api/admin/documents", {
        method: isEdit ? "PUT" : "POST",
        body: fd,
      });
      const j = await res.json();
      if (!res.ok) return flash(j.error || "Gagal menyimpan dokumen.", true);
      resetDocForm();
      flash(
        isEdit
          ? docFile
            ? "Dokumen & file PDF baru berhasil diperbarui!"
            : "Perubahan dokumen berhasil disimpan!"
          : "Dokumen PDF berhasil ditambahkan!"
      );
      loadAll();
    } finally {
      setDocSaving(false);
    }
  };

  const handleDeleteDoc = async (id: number) => {
    if (!confirm("Hapus dokumen ini?")) return;
    await fetch(`/api/admin/documents?id=${id}`, { method: "DELETE" });
    if (editingDocId === id) {
      resetDocForm();
    }
    flash("Dokumen dihapus.");
    loadAll();
  };

  const handleCreateWppe = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/admin/wppe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: wppeName,
        license_type: "WPPE",
        license_number: wppeLicense,
        position_id: wppePosId,
        position_en: wppePosEn || wppePosId,
        active: true,
      }),
    });
    const j = await res.json();
    if (!res.ok) return flash(j.error || "Gagal menambah karyawan WPPE.", true);
    setWppeName("");
    setWppeLicense("");
    flash("Karyawan WPPE ditambahkan!");
    loadAll();
  };

  const handleDeleteWppe = async (id: number) => {
    if (!confirm("Hapus data karyawan WPPE ini?")) return;
    await fetch(`/api/admin/wppe?id=${id}`, { method: "DELETE" });
    flash("Data WPPE dihapus.");
    loadAll();
  };

  const handleCreateNotice = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/admin/notices", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: noticeType,
        title_id: noticeTitleId,
        title_en: noticeTitleEn || noticeTitleId,
        body_id: noticeBodyId,
        body_en: noticeBodyEn || noticeBodyId,
        show_as_modal: noticeModal,
        active: true,
      }),
    });
    const j = await res.json();
    if (!res.ok) return flash(j.error || "Gagal menambah pengumuman.", true);
    setNoticeTitleId("");
    setNoticeTitleEn("");
    setNoticeBodyId("");
    setNoticeBodyEn("");
    flash("Pengumuman / Peringatan baru diaktifkan!");
    loadAll();
  };

  const handleToggleNotice = async (n: NoticeItem) => {
    await fetch("/api/admin/notices", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: n.id,
        type: n.type,
        title_id: n.title_id,
        title_en: n.title_en,
        body_id: n.body_id,
        body_en: n.body_en,
        cta_label_id: n.cta_label_id,
        cta_label_en: n.cta_label_en,
        cta_url: n.cta_url,
        show_as_modal: n.show_as_modal === 1,
        active: n.active !== 1,
      }),
    });
    flash("Status pengumuman diperbarui.");
    loadAll();
  };

  const handleDeleteNotice = async (id: number) => {
    if (!confirm("Hapus pengumuman ini?")) return;
    await fetch(`/api/admin/notices?id=${id}`, { method: "DELETE" });
    flash("Pengumuman dihapus.");
    loadAll();
  };

  const handleUpdateSubmissionStatus = async (
    id: number,
    status: SubmissionStatus,
    adminNotes: string
  ) => {
    await fetch("/api/admin/submissions", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status, admin_notes: adminNotes }),
    });
    flash("Status tiket berhasil diperbarui.");
    loadAll();
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/admin/password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ currentPassword, newPassword }),
    });
    const j = await res.json();
    if (!res.ok) return flash(j.error || "Gagal mengubah kata sandi.", true);
    setCurrentPassword("");
    setNewPassword("");
    flash("Kata sandi admin berhasil diperbarui!");
    router.refresh();
  };

  const unreadCount = submissions.filter((s) => s.status === "new").length;

  const navItems: Array<{ key: TabKey; label: string; icon: typeof LayoutDashboard; badge?: number }> = [
    { key: "overview", label: "Ringkasan", icon: LayoutDashboard },
    { key: "posts", label: "Berita & Edukasi", icon: FileText },
    { key: "documents", label: "Dokumen & Laporan PDF", icon: FileSpreadsheet },
    { key: "wppe", label: "Karyawan WPPE", icon: Users },
    { key: "notices", label: "Peringatan & Banner", icon: Bell },
    { key: "submissions", label: "Kotak Masuk & WBS", icon: Inbox, badge: unreadCount },
    { key: "security", label: "Keamanan & Audit Log", icon: KeyRound },
  ];

  return (
    <div className="min-h-screen bg-slate-100">
      {/* Top Bar */}
      <header className="bg-eko-bar sticky top-0 z-30 border-b border-navy-800 text-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <BrandLogo variant="light" compact />
            <span className="hidden rounded-md bg-gold-500/20 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-gold-300 sm:inline-block">
              CMS Admin
            </span>
          </div>

          <div className="flex items-center gap-3 text-xs">
            <span className="hidden text-navy-200 md:inline">
              {admin.email}
            </span>
            <Link
              href="/"
              target="_blank"
              className="inline-flex items-center gap-1.5 rounded-lg border border-navy-700 bg-navy-900 px-3 py-1.5 font-semibold text-white transition hover:border-gold-400"
            >
              Lihat Website
              <ExternalLink className="h-3.5 w-3.5" />
            </Link>
            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 rounded-lg bg-red-600/90 px-3 py-1.5 font-semibold text-white transition hover:bg-red-600"
            >
              <LogOut className="h-3.5 w-3.5" />
              Keluar
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {admin.must_change_password === 1 && (
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-amber-300 bg-amber-50 px-5 py-3.5 text-sm text-amber-950">
            <div className="flex items-center gap-2.5">
              <AlertTriangle className="h-5 w-5 shrink-0 text-amber-600" />
              <span>
                <strong>Rekomendasi Keamanan:</strong> Anda masih menggunakan kata sandi awal (default). Segera ganti kata sandi di tab{" "}
                <strong>Keamanan &amp; Audit Log</strong>.
              </span>
            </div>
            <button
              type="button"
              onClick={() => setTab("security")}
              className="rounded-lg bg-amber-600 px-3.5 py-1.5 text-xs font-bold text-white hover:bg-amber-700"
            >
              Ganti Kata Sandi
            </button>
          </div>
        )}

        {statusMsg && (
          <div className="mb-5 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-800">
            {statusMsg}
          </div>
        )}
        {errorMsg && (
          <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-800">
            {errorMsg}
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-12">
          {/* Sidebar */}
          <aside className="lg:col-span-3">
            <nav className="space-y-1 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = tab === item.key;
                return (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => {
                      setTab(item.key);
                      setStatusMsg(null);
                      setErrorMsg(null);
                    }}
                    className={`flex w-full items-center justify-between rounded-xl px-3.5 py-2.5 text-left text-sm font-semibold transition ${
                      active
                        ? "bg-navy-900 text-white"
                        : "text-slate-700 hover:bg-slate-100"
                    }`}
                  >
                    <span className="flex items-center gap-2.5">
                      <Icon className={`h-4 w-4 ${active ? "text-gold-300" : "text-slate-500"}`} />
                      {item.label}
                    </span>
                    {item.badge && item.badge > 0 ? (
                      <span className="rounded-full bg-gold-500 px-2 py-0.5 text-[11px] font-bold text-navy-950">
                        {item.badge}
                      </span>
                    ) : null}
                  </button>
                );
              })}
            </nav>
          </aside>

          {/* Main Content */}
          <main className="space-y-6 lg:col-span-9">
            {/* OVERVIEW */}
            {tab === "overview" && (
              <div className="space-y-6">
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  {[
                    { label: "Total Artikel", value: posts.length, color: "text-navy-900" },
                    { label: "Dokumen PDF", value: documents.length, color: "text-navy-900" },
                    { label: "Karyawan WPPE", value: wppe.length, color: "text-navy-900" },
                    { label: "Tiket Baru (Kontak/WBS)", value: unreadCount, color: "text-gold-600" },
                  ].map((c) => (
                    <div
                      key={c.label}
                      className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
                    >
                      <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                        {c.label}
                      </p>
                      <p className={`mt-2 font-serif text-3xl font-bold ${c.color}`}>
                        {c.value}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                  <div className="flex items-center gap-2 text-emerald-700">
                    <ShieldCheck className="h-5 w-5" />
                    <h2 className="font-bold text-navy-900">
                      Status Keamanan Platform Modern (Pengganti WordPress)
                    </h2>
                  </div>
                  <ul className="mt-4 grid gap-3 text-xs text-slate-700 sm:grid-cols-2">
                    <li className="rounded-xl bg-slate-50 p-3">
                      ✅ <strong>Zero WordPress / PHP Attack Surface:</strong> Tidak ada `/wp-admin`, `xmlrpc.php`, atau kebocoran user `/wp-json/wp/v2/users`.
                    </li>
                    <li className="rounded-xl bg-slate-50 p-3">
                      ✅ <strong>Validasi Upload PDF Magic-Bytes:</strong> Hanya file PDF asli (`%PDF-`) maksimal 20MB yang diterima sistem.
                    </li>
                    <li className="rounded-xl bg-slate-50 p-3">
                      ✅ <strong>HTTP Security Headers Aktif:</strong> CSP, HSTS, X-Frame-Options DENY, Nosniff, &amp; Same-Origin CSRF guard.
                    </li>
                    <li className="rounded-xl bg-slate-50 p-3">
                      ✅ <strong>Audit Trail Otomatis:</strong> Setiap login dan perubahan data dicatat lengkap beserta IP dan waktu.
                    </li>
                  </ul>
                </div>
              </div>
            )}

            {/* POSTS */}
            {tab === "posts" && (
              <div className="space-y-6">
                <form
                  onSubmit={handleCreatePost}
                  className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
                >
                  <h2 className="flex items-center gap-2 text-lg font-bold text-navy-900">
                    <Plus className="h-5 w-5 text-gold-600" />
                    Tambah Berita / Pengumuman / Edukasi (ID &amp; EN)
                  </h2>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="mb-1 block text-xs font-semibold text-slate-600">
                        Kategori
                      </label>
                      <select
                        value={postCat}
                        onChange={(e) => setPostCat(e.target.value as PostCategory)}
                        className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm"
                      >
                        <option value="news">Berita (News)</option>
                        <option value="announcement">Pengumuman (Announcement)</option>
                        <option value="education">Edukasi (Education)</option>
                        <option value="research">Riset (Research)</option>
                      </select>
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-semibold text-slate-600">
                        Tanggal Publikasi
                      </label>
                      <input
                        type="date"
                        required
                        value={postDate}
                        onChange={(e) => setPostDate(e.target.value)}
                        className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-semibold text-slate-600">
                        Judul (Bahasa Indonesia) *
                      </label>
                      <input
                        type="text"
                        required
                        value={postTitleId}
                        onChange={(e) => setPostTitleId(e.target.value)}
                        className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-semibold text-slate-600">
                        Title (English)
                      </label>
                      <input
                        type="text"
                        value={postTitleEn}
                        onChange={(e) => setPostTitleEn(e.target.value)}
                        placeholder="Opsional — otomatis mengikuti ID jika kosong"
                        className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-semibold text-slate-600">
                        Ringkasan (ID)
                      </label>
                      <input
                        type="text"
                        value={postExcerptId}
                        onChange={(e) => setPostExcerptId(e.target.value)}
                        className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-semibold text-slate-600">
                        Excerpt (EN)
                      </label>
                      <input
                        type="text"
                        value={postExcerptEn}
                        onChange={(e) => setPostExcerptEn(e.target.value)}
                        className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm"
                      />
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="mb-1 block text-xs font-semibold text-slate-600">
                        Isi Artikel (Bahasa Indonesia) *
                      </label>
                      <textarea
                        required
                        rows={5}
                        value={postContentId}
                        onChange={(e) => setPostContentId(e.target.value)}
                        className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-semibold text-slate-600">
                        Article Body (English)
                      </label>
                      <textarea
                        rows={5}
                        value={postContentEn}
                        onChange={(e) => setPostContentEn(e.target.value)}
                        className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="rounded-xl bg-navy-800 px-5 py-2.5 text-sm font-bold text-white hover:bg-navy-700"
                  >
                    Publikasikan Artikel
                  </button>
                </form>

                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                  <h3 className="font-bold text-navy-900">
                    Daftar Artikel ({posts.length})
                  </h3>
                  <div className="mt-4 divide-y divide-slate-100">
                    {posts.map((p) => (
                      <div
                        key={p.id}
                        className="flex items-center justify-between gap-4 py-3"
                      >
                        <div>
                          <div className="flex items-center gap-2 text-xs">
                            <span className="rounded bg-navy-50 px-2 py-0.5 font-bold uppercase text-navy-700">
                              {p.category}
                            </span>
                            <span className="text-slate-500">{p.published_at}</span>
                          </div>
                          <p className="mt-1 text-sm font-bold text-navy-900">
                            {p.title_id}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleDeletePost(p.id)}
                          className="rounded-lg p-2 text-red-600 hover:bg-red-50"
                          title="Hapus"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* DOCUMENTS */}
            {tab === "documents" && (
              <div className="space-y-6">
                <form
                  ref={docFormRef}
                  onSubmit={handleSaveDoc}
                  className={`space-y-4 rounded-2xl border bg-white p-6 shadow-sm ${
                    editingDocId !== null
                      ? "border-gold-400 ring-1 ring-gold-300"
                      : "border-slate-200"
                  }`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <h2 className="flex items-center gap-2 text-lg font-bold text-navy-900">
                      {editingDocId !== null ? (
                        <>
                          <Pencil className="h-5 w-5 text-gold-600" />
                          Edit Dokumen &amp; Ganti File PDF
                        </>
                      ) : (
                        <>
                          <Upload className="h-5 w-5 text-gold-600" />
                          Unggah Laporan Keuangan / RUPS / GCG / Formulir (PDF)
                        </>
                      )}
                    </h2>
                    {editingDocId !== null && (
                      <button
                        type="button"
                        onClick={resetDocForm}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                      >
                        <X className="h-3.5 w-3.5" />
                        Batal Edit
                      </button>
                    )}
                  </div>

                  {editingDocId !== null && (
                    <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs text-amber-900">
                      <p className="font-semibold">
                        Sedang mengedit dokumen #{editingDocId}
                      </p>
                      <p className="mt-1 break-all text-amber-800">
                        File saat ini:{" "}
                        <span className="font-mono">{editingDocCurrentUrl}</span>
                      </p>
                      <p className="mt-1 text-amber-800">
                        Pilih file PDF baru di bawah untuk langsung mengganti link/file lama ke server lokal, atau biarkan kosong jika hanya ingin mengubah judul/kategori.
                      </p>
                    </div>
                  )}

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="mb-1 block text-xs font-semibold text-slate-600">
                        Kategori Dokumen
                      </label>
                      <select
                        value={docCat}
                        onChange={(e) => setDocCat(e.target.value as DocumentCategory)}
                        className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm"
                      >
                        <option value="financial_report">Laporan Keuangan</option>
                        <option value="rups">RUPS</option>
                        <option value="gcg">Tata Kelola (GCG)</option>
                        <option value="form">Formulir Nasabah</option>
                        <option value="etop_manual">Panduan e-TOP</option>
                      </select>
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-semibold text-slate-600">
                        Tahun (Opsional)
                      </label>
                      <input
                        type="number"
                        value={docYear}
                        onChange={(e) => setDocYear(e.target.value)}
                        placeholder="2025"
                        className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-semibold text-slate-600">
                        Judul Dokumen (ID) *
                      </label>
                      <input
                        type="text"
                        required
                        value={docTitleId}
                        onChange={(e) => setDocTitleId(e.target.value)}
                        placeholder="Laporan Keuangan Auditan Tahun 2025"
                        className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-semibold text-slate-600">
                        Document Title (EN)
                      </label>
                      <input
                        type="text"
                        value={docTitleEn}
                        onChange={(e) => setDocTitleEn(e.target.value)}
                        placeholder="Audited Financial Statements 2025"
                        className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-semibold text-slate-600">
                        Deskripsi Singkat (ID, Opsional)
                      </label>
                      <input
                        type="text"
                        value={docDescId}
                        onChange={(e) => setDocDescId(e.target.value)}
                        placeholder="Keterangan singkat dokumen..."
                        className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-semibold text-slate-600">
                        Short Description (EN, Optional)
                      </label>
                      <input
                        type="text"
                        value={docDescEn}
                        onChange={(e) => setDocDescEn(e.target.value)}
                        placeholder="Brief document description..."
                        className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-semibold text-slate-600">
                        {editingDocId !== null
                          ? "Upload Ulang File PDF Baru (Opsional, Maks 20MB)"
                          : "Unggah File PDF (Maks 20MB)"}
                      </label>
                      <input
                        ref={docFileInputRef}
                        type="file"
                        accept="application/pdf"
                        onChange={(e) => setDocFile(e.target.files?.[0] ?? null)}
                        className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2 text-xs"
                      />
                      {docFile && (
                        <p className="mt-1 text-[11px] font-medium text-emerald-700">
                          File dipilih: {docFile.name} ({Math.max(1, Math.round(docFile.size / 1024))} KB)
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-semibold text-slate-600">
                        {editingDocId !== null
                          ? "URL File Saat Ini / URL HTTPS Pengganti"
                          : "Atau URL PDF Eksternal (HTTPS)"}
                      </label>
                      <input
                        type="text"
                        value={docUrl}
                        onChange={(e) => setDocUrl(e.target.value)}
                        placeholder="https://... atau /api/uploads/..."
                        className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm"
                      />
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    <button
                      type="submit"
                      disabled={docSaving}
                      className="rounded-xl bg-navy-800 px-5 py-2.5 text-sm font-bold text-white hover:bg-navy-700 disabled:opacity-60"
                    >
                      {docSaving
                        ? "Menyimpan..."
                        : editingDocId !== null
                          ? "Simpan Perubahan Dokumen"
                          : "Simpan Dokumen"}
                    </button>
                    {editingDocId !== null && (
                      <button
                        type="button"
                        onClick={resetDocForm}
                        className="rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                      >
                        Batal
                      </button>
                    )}
                  </div>
                </form>

                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                  <h3 className="font-bold text-navy-900">
                    Daftar Dokumen ({documents.length})
                  </h3>
                  <div className="mt-4 divide-y divide-slate-100">
                    {documents.map((d) => {
                      const isLocal = d.file_url.startsWith("/api/uploads/");
                      const isEditing = editingDocId === d.id;
                      return (
                        <div
                          key={d.id}
                          className={`flex flex-wrap items-center justify-between gap-4 rounded-xl px-2 py-3 transition ${
                            isEditing ? "bg-gold-50/70 ring-1 ring-gold-300" : ""
                          }`}
                        >
                          <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-2 text-xs">
                              <span className="rounded bg-gold-100 px-2 py-0.5 font-bold uppercase text-gold-800">
                                {d.category}
                              </span>
                              {d.year && <span className="font-mono">{d.year}</span>}
                              <span className="text-slate-400">{d.file_size}</span>
                              {isLocal ? (
                                <span className="rounded bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-700">
                                  File Lokal
                                </span>
                              ) : (
                                <span className="rounded bg-amber-50 px-2 py-0.5 text-[11px] font-semibold text-amber-700">
                                  URL Eksternal
                                </span>
                              )}
                            </div>
                            <p className="mt-1 text-sm font-bold text-navy-900">
                              {d.title_id}
                            </p>
                            <p className="mt-0.5 truncate text-[11px] font-mono text-slate-400">
                              {d.file_url}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => startEditDoc(d)}
                              className="inline-flex items-center gap-1 rounded-lg border border-navy-200 bg-navy-50/60 px-3 py-1.5 text-xs font-semibold text-navy-800 hover:bg-navy-100"
                            >
                              <Pencil className="h-3.5 w-3.5" />
                              Edit / Ganti PDF
                            </button>
                            <a
                              href={d.file_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-navy-700 hover:bg-slate-50"
                            >
                              Buka
                            </a>
                            <button
                              type="button"
                              onClick={() => handleDeleteDoc(d.id)}
                              className="rounded-lg p-2 text-red-600 hover:bg-red-50"
                              title="Hapus"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* WPPE */}
            {tab === "wppe" && (
              <div className="space-y-6">
                <form
                  onSubmit={handleCreateWppe}
                  className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
                >
                  <h2 className="text-lg font-bold text-navy-900">
                    Tambah Karyawan Berizin WPPE
                  </h2>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <input
                      type="text"
                      required
                      value={wppeName}
                      onChange={(e) => setWppeName(e.target.value)}
                      placeholder="Nama Lengkap *"
                      className="rounded-xl border border-slate-300 px-3 py-2 text-sm"
                    />
                    <input
                      type="text"
                      required
                      value={wppeLicense}
                      onChange={(e) => setWppeLicense(e.target.value)}
                      placeholder="Nomor Izin OJK (KEP-...) *"
                      className="rounded-xl border border-slate-300 px-3 py-2 text-sm"
                    />
                    <input
                      type="text"
                      required
                      value={wppePosId}
                      onChange={(e) => setWppePosId(e.target.value)}
                      placeholder="Jabatan (ID)"
                      className="rounded-xl border border-slate-300 px-3 py-2 text-sm"
                    />
                    <input
                      type="text"
                      value={wppePosEn}
                      onChange={(e) => setWppePosEn(e.target.value)}
                      placeholder="Position (EN)"
                      className="rounded-xl border border-slate-300 px-3 py-2 text-sm"
                    />
                  </div>
                  <button
                    type="submit"
                    className="rounded-xl bg-navy-800 px-5 py-2.5 text-sm font-bold text-white hover:bg-navy-700"
                  >
                    Tambah WPPE
                  </button>
                </form>

                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                  <h3 className="font-bold text-navy-900">
                    Daftar Karyawan WPPE ({wppe.length})
                  </h3>
                  <div className="mt-4 divide-y divide-slate-100">
                    {wppe.map((s) => (
                      <div
                        key={s.id}
                        className="flex items-center justify-between gap-4 py-3 text-sm"
                      >
                        <div>
                          <p className="font-bold text-navy-900">{s.name}</p>
                          <p className="font-mono text-xs text-slate-500">
                            {s.license_number} • {s.position_id}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleDeleteWppe(s.id)}
                          className="rounded-lg p-2 text-red-600 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* NOTICES */}
            {tab === "notices" && (
              <div className="space-y-6">
                <form
                  onSubmit={handleCreateNotice}
                  className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
                >
                  <h2 className="text-lg font-bold text-navy-900">
                    Buat Peringatan Anti-Penipuan / Banner Pengumuman
                  </h2>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <select
                      value={noticeType}
                      onChange={(e) =>
                        setNoticeType(e.target.value as "fraud_alert" | "announcement")
                      }
                      className="rounded-xl border border-slate-300 px-3 py-2 text-sm"
                    >
                      <option value="fraud_alert">Peringatan Penipuan (Fraud Alert)</option>
                      <option value="announcement">Pengumuman Umum</option>
                    </select>
                    <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
                      <input
                        type="checkbox"
                        checked={noticeModal}
                        onChange={(e) => setNoticeModal(e.target.checked)}
                      />
                      Tampilkan sebagai Modal (1x per sesi)
                    </label>
                    <input
                      type="text"
                      required
                      value={noticeTitleId}
                      onChange={(e) => setNoticeTitleId(e.target.value)}
                      placeholder="Judul Peringatan (ID) *"
                      className="rounded-xl border border-slate-300 px-3 py-2 text-sm"
                    />
                    <input
                      type="text"
                      value={noticeTitleEn}
                      onChange={(e) => setNoticeTitleEn(e.target.value)}
                      placeholder="Alert Title (EN)"
                      className="rounded-xl border border-slate-300 px-3 py-2 text-sm"
                    />
                  </div>
                  <textarea
                    required
                    rows={3}
                    value={noticeBodyId}
                    onChange={(e) => setNoticeBodyId(e.target.value)}
                    placeholder="Isi pesan peringatan (Bahasa Indonesia) *"
                    className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm"
                  />
                  <textarea
                    rows={3}
                    value={noticeBodyEn}
                    onChange={(e) => setNoticeBodyEn(e.target.value)}
                    placeholder="Alert message (English)"
                    className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm"
                  />
                  <button
                    type="submit"
                    className="rounded-xl bg-navy-800 px-5 py-2.5 text-sm font-bold text-white hover:bg-navy-700"
                  >
                    Simpan Pengumuman
                  </button>
                </form>

                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                  <h3 className="font-bold text-navy-900">Pengumuman Aktif &amp; Nonaktif</h3>
                  <div className="mt-4 space-y-3">
                    {notices.map((n) => (
                      <div
                        key={n.id}
                        className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-slate-200 p-4"
                      >
                        <div className="max-w-xl">
                          <span
                            className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold ${
                              n.active === 1
                                ? "bg-emerald-100 text-emerald-800"
                                : "bg-slate-200 text-slate-600"
                            }`}
                          >
                            {n.active === 1 ? "AKTIF" : "NONAKTIF"}
                          </span>
                          <p className="mt-1 text-sm font-bold text-navy-900">
                            {n.title_id}
                          </p>
                          <p className="mt-1 line-clamp-2 text-xs text-slate-600">
                            {n.body_id}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleToggleNotice(n)}
                            className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-semibold text-navy-800 hover:bg-slate-50"
                          >
                            {n.active === 1 ? "Nonaktifkan" : "Aktifkan"}
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteNotice(n.id)}
                            className="rounded-lg p-2 text-red-600 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* SUBMISSIONS */}
            {tab === "submissions" && (
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <h2 className="text-lg font-bold text-navy-900">
                  Kotak Masuk: Kontak, Pengaduan Nasabah (POJK) &amp; WBS ({submissions.length})
                </h2>
                {submissions.length === 0 ? (
                  <p className="mt-4 text-sm text-slate-500">
                    Belum ada pesan, pengaduan, atau laporan WBS yang masuk.
                  </p>
                ) : (
                  <div className="mt-5 space-y-4">
                    {submissions.map((s) => (
                      <div
                        key={s.id}
                        className="rounded-2xl border border-slate-200 bg-slate-50 p-5"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <span className="rounded bg-navy-900 px-2.5 py-0.5 font-mono text-xs font-bold text-gold-300">
                              {s.ticket_code}
                            </span>
                            <span className="rounded bg-slate-200 px-2 py-0.5 text-[11px] font-bold uppercase text-slate-700">
                              {s.type}
                            </span>
                            <span className="text-xs text-slate-500">
                              {s.created_at}
                            </span>
                          </div>

                          <select
                            value={s.status}
                            onChange={(e) =>
                              handleUpdateSubmissionStatus(
                                s.id,
                                e.target.value as SubmissionStatus,
                                s.admin_notes || ""
                              )
                            }
                            className="rounded-lg border border-slate-300 bg-white px-2.5 py-1 text-xs font-bold text-navy-900"
                          >
                            <option value="new">Baru (New)</option>
                            <option value="in_review">Sedang Diproses</option>
                            <option value="resolved">Selesai (Resolved)</option>
                            <option value="closed">Ditutup (Closed)</option>
                          </select>
                        </div>

                        <h3 className="mt-3 text-sm font-bold text-navy-900">
                          {s.subject}
                        </h3>
                        <p className="mt-1 whitespace-pre-line text-xs leading-relaxed text-slate-700">
                          {s.message}
                        </p>
                        <div className="mt-3 flex flex-wrap gap-4 border-t border-slate-200 pt-2.5 text-xs text-slate-600">
                          <span>
                            Pelapor:{" "}
                            <strong>
                              {s.is_anonymous ? "Anonim / Rahasia" : s.full_name || "-"}
                            </strong>
                          </span>
                          {!s.is_anonymous && s.email && <span>Email: {s.email}</span>}
                          {!s.is_anonymous && s.phone && <span>Telp: {s.phone}</span>}
                          {s.client_code && <span>SID/Kode: {s.client_code}</span>}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* SECURITY & AUDIT LOGS */}
            {tab === "security" && (
              <div className="space-y-6">
                <form
                  onSubmit={handleChangePassword}
                  className="max-w-lg space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
                >
                  <h2 className="text-lg font-bold text-navy-900">
                    Ubah Kata Sandi Admin
                  </h2>
                  <p className="text-xs text-slate-500">
                    Minimal 10 karakter, mengandung huruf besar, huruf kecil, dan angka.
                  </p>
                  <input
                    type="password"
                    required
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Kata sandi saat ini"
                    className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm"
                  />
                  <input
                    type="password"
                    required
                    minLength={10}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Kata sandi baru yang kuat"
                    className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm"
                  />
                  <button
                    type="submit"
                    className="rounded-xl bg-navy-800 px-5 py-2.5 text-sm font-bold text-white hover:bg-navy-700"
                  >
                    Perbarui Kata Sandi
                  </button>
                </form>

                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                  <h3 className="font-bold text-navy-900">
                    Log Audit Aktivitas Admin Terbaru
                  </h3>
                  <div className="mt-4 overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-50 uppercase text-slate-500">
                        <tr>
                          <th className="px-3 py-2.5">Waktu (UTC)</th>
                          <th className="px-3 py-2.5">Admin</th>
                          <th className="px-3 py-2.5">Aksi</th>
                          <th className="px-3 py-2.5">Target</th>
                          <th className="px-3 py-2.5">IP</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 font-mono">
                        {auditLogs.map((log) => (
                          <tr key={log.id}>
                            <td className="px-3 py-2 text-slate-500">
                              {log.created_at}
                            </td>
                            <td className="px-3 py-2 font-semibold text-navy-900">
                              {log.admin_email}
                            </td>
                            <td className="px-3 py-2">
                              <span
                                className={`rounded px-2 py-0.5 font-bold ${
                                  log.action.includes("FAILED")
                                    ? "bg-red-100 text-red-700"
                                    : "bg-navy-50 text-navy-700"
                                }`}
                              >
                                {log.action}
                              </span>
                            </td>
                            <td className="px-3 py-2 text-slate-600">{log.target}</td>
                            <td className="px-3 py-2 text-slate-500">
                              {log.ip_address}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
