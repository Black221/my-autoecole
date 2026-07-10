/* Primitives UI Genfac — Tailwind v4 (web, mobile-first). */
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { ChevronLeft } from "lucide-react";

/* ---- Barre de retour ---- */
export function TopBar({
  onBack,
  title,
}: {
  onBack: () => void;
  title?: string;
}) {
  return (
    <div className="flex items-center gap-3 px-5 pb-2 pt-[calc(1rem+env(safe-area-inset-top))]">
      <button
        onClick={onBack}
        aria-label="Retour"
        className="grid size-10 flex-none place-items-center rounded-full bg-surface text-ink-soft shadow-soft active:scale-95"
      >
        <ChevronLeft size={20} />
      </button>
      {title && <span className="truncate font-semibold">{title}</span>}
    </div>
  );
}

/* ---- App shell + Screen ---- */
export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-[720px] flex-col bg-canvas">
      {children}
    </div>
  );
}

export function Screen({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`flex-1 px-5 pb-[calc(2rem+env(safe-area-inset-bottom))] pt-5 ${className}`}
    >
      {children}
    </div>
  );
}

/* ---- Étoile décorative du drapeau sénégalais ---- */
export function SenegalStar({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 100 100" aria-hidden="true">
      <path
        fill="currentColor"
        d="M50 4l11.8 30.9 33 1.5-25.9 20.5 8.9 31.8L50 71.6 22.2 88.7l8.9-31.8L5.2 36.4l33-1.5z"
      />
    </svg>
  );
}

/* ---- Hero header ---- */
export function Hero({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children?: ReactNode;
}) {
  return (
    <header className="relative overflow-hidden rounded-b-[28px] bg-linear-to-br from-brand to-brand-dark px-5 pb-6 pt-[calc(2.25rem+env(safe-area-inset-top))] text-white">
      <div className="hero-pattern pointer-events-none absolute inset-0 opacity-60" />
      <SenegalStar className="pointer-events-none absolute -bottom-6 -right-4 h-40 w-40 text-sun opacity-10" />
      <div className="relative">
        {subtitle && <div className="text-sm text-white/85">{subtitle}</div>}
        <h1 className="mt-0.5 text-[clamp(22px,6vw,30px)] font-bold leading-tight">
          {title}
        </h1>
        {children}
      </div>
    </header>
  );
}

/* ---- Card ---- */
export function Card({
  children,
  onClick,
  className = "",
}: {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
}) {
  const base = "rounded-[20px] bg-surface p-5 shadow-soft";
  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        className={`${base} w-full cursor-pointer border-0 text-left transition-all duration-150 hover:-translate-y-0.5 hover:shadow-lift active:scale-[0.99] ${className}`}
      >
        {children}
      </button>
    );
  }
  return <div className={`${base} ${className}`}>{children}</div>;
}

/* ---- Bouton ---- */
type Variant = "primary" | "tonal" | "teranga" | "ghost" | "danger";
const variantCls: Record<Variant, string> = {
  primary: "bg-brand text-white hover:brightness-105",
  tonal: "bg-brand-light text-brand-dark hover:brightness-[0.98]",
  teranga: "bg-teranga text-white hover:brightness-105",
  ghost: "bg-transparent text-ink-soft hover:bg-black/5",
  danger: "bg-danger-light text-danger hover:brightness-[0.98]",
};

export function Button({
  variant = "primary",
  auto = false,
  children,
  className = "",
  ...rest
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  auto?: boolean;
}) {
  return (
    <button
      className={`inline-flex min-h-[52px] items-center justify-center gap-2 rounded-2xl px-5 py-3.5 text-[15px] font-semibold transition-all duration-150 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 ${
        auto ? "w-auto" : "w-full"
      } ${variantCls[variant]} ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
}

/* ---- Badge ---- */
type BadgeTone = "green" | "yellow" | "teranga" | "muted" | "danger";
const badgeCls: Record<BadgeTone, string> = {
  green: "bg-brand-light text-brand-dark",
  yellow: "bg-[#fff7cc] text-[#8a6d00]",
  teranga: "bg-teranga-light text-teranga",
  muted: "bg-[#eef2ee] text-ink-soft",
  danger: "bg-danger-light text-danger",
};

export function Badge({
  children,
  tone = "green",
}: {
  children: ReactNode;
  tone?: BadgeTone;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${badgeCls[tone]}`}
    >
      {children}
    </span>
  );
}

/* ---- Barre de progression ---- */
export function ProgressBar({ value }: { value: number }) {
  const pct = Math.max(0, Math.min(1, value)) * 100;
  return (
    <div
      className="h-2 flex-1 overflow-hidden rounded-full bg-line"
      role="progressbar"
      aria-valuenow={Math.round(pct)}
    >
      <div
        className="h-full rounded-full bg-brand transition-[width] duration-300"
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}
