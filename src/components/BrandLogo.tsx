import React from "react";

interface BrandLogoProps {
  variant?: "dark" | "light";
  compact?: boolean;
}

export function BrandLogo({ variant = "dark", compact = false }: BrandLogoProps) {
  const heightClass = compact
    ? "h-7 sm:h-8"
    : variant === "light"
      ? "h-8 sm:h-9"
      : "h-9 sm:h-10";

  if (variant === "light") {
    return (
      <span className="inline-flex items-center rounded-xl bg-white px-3 py-1.5 shadow-sm select-none">
        <img
          src="/images/logo-ekokapital.jpeg"
          alt="PT Ekokapital Sekuritas"
          className={`${heightClass} w-auto object-contain`}
        />
      </span>
    );
  }

  return (
    <span className="inline-flex items-center select-none">
      <img
        src="/images/logo-ekokapital.jpeg"
        alt="PT Ekokapital Sekuritas"
        className={`${heightClass} w-auto object-contain`}
      />
    </span>
  );
}
