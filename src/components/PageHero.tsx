import Link from "next/link";
import { ChevronRight } from "lucide-react";

interface PageHeroProps {
  eyebrow: string;
  title: string;
  subtitle?: string;
  breadcrumbs?: Array<{ label: string; href?: string }>;
}

export function PageHero({
  eyebrow,
  title,
  subtitle,
  breadcrumbs,
}: PageHeroProps) {
  return (
    <section className="bg-eko-hero relative overflow-hidden text-white">
      <div className="hero-grid-pattern absolute inset-0" />
      <div className="absolute -right-24 -top-24 h-80 w-80 rounded-full bg-gold-400/20 blur-3xl" />
      <div className="absolute -bottom-24 left-12 h-64 w-64 rounded-full bg-sky-400/20 blur-3xl" />
      <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-navy-800 via-gold-400 to-navy-700" />

      <div className="relative mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
        {breadcrumbs && breadcrumbs.length > 0 && (
          <nav
            aria-label="Breadcrumb"
            className="mb-5 flex flex-wrap items-center gap-1.5 text-xs font-medium text-navy-200"
          >
            {breadcrumbs.map((crumb, idx) => (
              <span key={idx} className="inline-flex items-center gap-1.5">
                {idx > 0 && <ChevronRight className="h-3.5 w-3.5 text-navy-400" />}
                {crumb.href ? (
                  <Link
                    href={crumb.href}
                    className="transition-colors hover:text-gold-300"
                  >
                    {crumb.label}
                  </Link>
                ) : (
                  <span className="text-gold-300">{crumb.label}</span>
                )}
              </span>
            ))}
          </nav>
        )}

        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-300">
          {eyebrow}
        </p>
        <h1 className="mt-2.5 max-w-3xl font-serif text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-navy-100/90 sm:text-lg">
            {subtitle}
          </p>
        )}
      </div>
    </section>
  );
}
