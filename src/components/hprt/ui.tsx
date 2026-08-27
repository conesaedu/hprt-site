import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

export function Eyebrow({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.14em] text-muted-foreground",
        className,
      )}
    >
      <span className="inline-block size-[7px] rotate-45 rounded-[1px] bg-signal" />
      {children}
    </span>
  );
}

export function Btn({
  href,
  children,
  variant = "primary",
  className,
}: {
  href: string;
  children: ReactNode;
  variant?: "primary" | "ghost";
  className?: string;
}) {
  return (
    <a
      href={href}
      className={cn(
        "inline-flex items-center gap-2.5 rounded-sm border px-6 py-3.5 text-sm font-semibold transition-[transform,background-color,border-color] duration-200 hover:-translate-y-px",
        variant === "primary"
          ? "border-transparent bg-signal text-primary-foreground hover:bg-signal-soft"
          : "border-border-strong text-foreground hover:border-foreground",
        className,
      )}
    >
      {children}
    </a>
  );
}

export function SectionHead({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: string;
  children?: ReactNode;
}) {
  return (
    <div className="mb-14 max-w-[40rem]">
      <Eyebrow className="mb-4">{eyebrow}</Eyebrow>
      <h2 className="mb-4 text-[2.375rem] leading-[1.1]">{title}</h2>
      {children ? <p className="text-base text-muted-foreground">{children}</p> : null}
    </div>
  );
}

export function MoreLink({ to, children }: { to: string; children: ReactNode }) {
  return (
    <Link
      to={to}
      className="inline-flex items-center gap-2 font-mono text-[0.75rem] uppercase tracking-[0.1em] text-foreground transition-colors hover:text-signal"
    >
      {children} <ArrowUpRight className="size-3.5" />
    </Link>
  );
}
