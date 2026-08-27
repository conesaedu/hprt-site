import type { ReactNode } from "react";

export function PageHero({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: string;
  children?: ReactNode;
}) {
  return (
    <section className="relative overflow-hidden bg-ink pb-16 pt-36 text-on-ink md:pt-40">
      <div className="pointer-events-none absolute inset-0 grid-rule opacity-60" aria-hidden />
      <div className="wrap relative">
        <span className="mb-5 inline-flex items-center gap-2 font-mono text-[0.7rem] uppercase tracking-[0.14em] text-on-ink-muted">
          <span className="inline-block size-[7px] rotate-45 rounded-[1px] bg-signal" />
          {eyebrow}
        </span>
        <h1 className="mb-6 text-[clamp(2.25rem,5.5vw,4.5rem)] leading-[0.95] text-on-ink">
          {title}
        </h1>
        {children ? (
          <p className="max-w-[46rem] text-[1.0625rem] leading-relaxed text-on-ink-muted">
            {children}
          </p>
        ) : null}
      </div>
    </section>
  );
}
