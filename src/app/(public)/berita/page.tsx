import Link from "next/link";
import { ArrowRight, BookOpen, Search } from "lucide-react";
import { PageHero } from "@/components/PageHero";
import { dictionary, pickLang } from "@/lib/i18n";
import { getServerLang } from "@/lib/server-lang";
import { getPublishedPosts } from "@/lib/queries";
import type { PostCategory } from "@/lib/types";

const VALID_CATEGORIES: PostCategory[] = [
  "news",
  "education",
  "announcement",
  "research",
];

export default async function BeritaPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; q?: string }>;
}) {
  const lang = await getServerLang();
  const t = dictionary[lang];
  const isEn = lang === "en";
  const sp = await searchParams;
  const activeCat = VALID_CATEGORIES.includes(sp.category as PostCategory)
    ? (sp.category as PostCategory)
    : undefined;
  const query = sp.q?.trim() || "";

  const posts = getPublishedPosts({ category: activeCat, search: query });

  const tabs: Array<{ key: string; label: string }> = [
    { key: "", label: t.common.allCategories },
    { key: "news", label: isEn ? "News" : "Berita" },
    { key: "announcement", label: isEn ? "Announcements" : "Pengumuman" },
    { key: "education", label: isEn ? "Investor Education" : "Edukasi Investor" },
    { key: "research", label: isEn ? "Research" : "Riset" },
  ];

  return (
    <>
      <PageHero
        eyebrow={isEn ? "Information & Insights" : "Informasi & Literasi"}
        title={t.nav.news}
        subtitle={
          isEn
            ? "Official corporate announcements, IDX regulatory updates, and educational resources for capital market investors."
            : "Pengumuman resmi perusahaan, pembaruan regulasi BEI/OJK, serta artikel edukasi pasar modal untuk nasabah."
        }
        breadcrumbs={[
          { label: t.nav.home, href: "/" },
          { label: t.nav.news },
        ]}
      />

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        {/* Filter & Search Bar */}
        <div className="flex flex-col justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm lg:flex-row lg:items-center">
          <div className="flex flex-wrap gap-2">
            {tabs.map((tab) => {
              const isActive = (activeCat || "") === tab.key;
              const href = tab.key
                ? `/berita?category=${tab.key}${query ? `&q=${encodeURIComponent(query)}` : ""}`
                : query
                  ? `/berita?q=${encodeURIComponent(query)}`
                  : "/berita";
              return (
                <Link
                  key={tab.key || "all"}
                  href={href}
                  className={`rounded-xl px-4 py-2 text-xs font-bold transition ${
                    isActive
                      ? "bg-navy-800 text-white"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
                >
                  {tab.label}
                </Link>
              );
            })}
          </div>

          <form action="/berita" method="GET" className="relative flex w-full lg:w-80">
            {activeCat && <input type="hidden" name="category" value={activeCat} />}
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="search"
              name="q"
              defaultValue={query}
              placeholder={t.nav.searchPlaceholder}
              className="w-full rounded-xl border border-slate-300 bg-slate-50 py-2 pl-10 pr-4 text-sm text-slate-900 outline-none transition focus:border-navy-500 focus:bg-white"
            />
          </form>
        </div>

        {/* Articles Grid */}
        {posts.length === 0 ? (
          <div className="mt-10 rounded-2xl border border-slate-200 bg-white p-12 text-center text-slate-500">
            {t.common.noResults}
          </div>
        ) : (
          <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <Link
                key={post.id}
                href={`/berita/${post.slug}`}
                className="eko-card-lift group flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-card"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 text-xs">
                    <span className="inline-flex items-center gap-1 rounded-full bg-navy-50 px-2.5 py-0.5 font-bold uppercase tracking-wide text-navy-700">
                      <BookOpen className="h-3 w-3" />
                      {post.category}
                    </span>
                    <time className="text-slate-500">{post.published_at}</time>
                  </div>
                  <h2 className="mt-4 text-lg font-bold leading-snug text-navy-900 group-hover:text-navy-700">
                    {pickLang(lang, post.title_id, post.title_en)}
                  </h2>
                  <p className="mt-2.5 line-clamp-3 text-sm leading-relaxed text-slate-600">
                    {pickLang(lang, post.excerpt_id, post.excerpt_en)}
                  </p>
                </div>

                <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-navy-700 group-hover:text-gold-600">
                  {t.common.readArticle}
                  <ArrowRight className="h-4 w-4" />
                </span>
              </Link>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
