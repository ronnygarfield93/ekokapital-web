import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Calendar, Tag } from "lucide-react";
import { dictionary, pickLang } from "@/lib/i18n";
import { getServerLang } from "@/lib/server-lang";
import { getPostBySlug, getPublishedPosts } from "@/lib/queries";

export default async function BeritaDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const lang = await getServerLang();
  const t = dictionary[lang];
  const title = pickLang(lang, post.title_id, post.title_en);
  const content = pickLang(lang, post.content_id, post.content_en);
  const related = getPublishedPosts({ limit: 4 })
    .filter((p) => p.id !== post.id)
    .slice(0, 3);

  return (
    <article className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
      <Link
        href="/berita"
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-navy-700 transition hover:text-gold-600"
      >
        <ArrowLeft className="h-4 w-4" />
        {t.common.backToNews}
      </Link>

      <header className="mt-6 border-b border-slate-200 pb-6">
        <div className="flex flex-wrap items-center gap-3 text-xs font-semibold">
          <span className="inline-flex items-center gap-1 rounded-full bg-navy-100 px-3 py-1 uppercase tracking-wider text-navy-800">
            <Tag className="h-3.5 w-3.5" />
            {post.category}
          </span>
          <span className="inline-flex items-center gap-1.5 text-slate-500">
            <Calendar className="h-3.5 w-3.5" />
            {t.common.publishedOn}: {post.published_at}
          </span>
        </div>

        <h1 className="mt-4 font-serif text-3xl font-bold leading-tight text-navy-900 sm:text-4xl">
          {title}
        </h1>
      </header>

      <div className="mt-8 space-y-5 rounded-2xl border border-slate-200 bg-white p-7 text-base leading-relaxed text-slate-700 shadow-card sm:p-10">
        {content.split(/\n\n+/).map((para, idx) => (
          <p key={idx} className="whitespace-pre-line">
            {para}
          </p>
        ))}
      </div>

      {related.length > 0 && (
        <section className="mt-14 border-t border-slate-200 pt-10">
          <h2 className="font-serif text-xl font-bold text-navy-900">
            {lang === "en" ? "Other Articles" : "Artikel Lainnya"}
          </h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-3">
            {related.map((item) => (
              <Link
                key={item.id}
                href={`/berita/${item.slug}`}
                className="rounded-xl border border-slate-200 bg-white p-4 transition hover:border-navy-300"
              >
                <p className="text-[11px] font-semibold uppercase text-gold-600">
                  {item.published_at}
                </p>
                <h3 className="mt-1.5 line-clamp-2 text-sm font-bold text-navy-900">
                  {pickLang(lang, item.title_id, item.title_en)}
                </h3>
              </Link>
            ))}
          </div>
        </section>
      )}
    </article>
  );
}
