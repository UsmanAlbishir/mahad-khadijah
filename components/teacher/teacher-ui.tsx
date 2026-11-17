import type { ReactNode } from "react";
import { AlertCircle, BadgeCheck } from "lucide-react";

export function PageHeading({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0">
        {eyebrow && <p className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-[#9B4123]">{eyebrow}</p>}
        <h2 className="text-2xl font-semibold tracking-tight text-foreground">{title}</h2>
        {description && <p className="mt-1 max-w-3xl text-sm leading-6 text-muted-foreground">{description}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}

export function DemoNotice({ children }: { children: ReactNode }) {
  return (
    <div className="flex gap-3 border border-[#E84F12]/35 bg-[#E84F12]/10 px-4 py-3 text-sm text-foreground" role="note">
      <AlertCircle className="mt-0.5 size-4 shrink-0 text-[#9B4123]" />
      <div><span className="mr-1 font-semibold">Demo data.</span>{children}</div>
    </div>
  );
}

export function StatusBadge({ children, tone = "neutral" }: { children: ReactNode; tone?: "success" | "warning" | "danger" | "info" | "neutral" }) {
  const styles = {
    success: "bg-[#FAF7F4] text-[#452D24] ring-[#9B4123]/15 dark:bg-[#452D24] dark:text-white/70",
    warning: "bg-amber-50 text-amber-900 ring-amber-700/15 dark:bg-amber-950 dark:text-amber-200",
    danger: "bg-rose-50 text-rose-800 ring-rose-700/15 dark:bg-rose-950 dark:text-rose-200",
    info: "bg-sky-50 text-sky-800 ring-sky-700/15 dark:bg-sky-950 dark:text-sky-200",
    neutral: "bg-muted text-muted-foreground ring-border",
  };

  return <span className={`inline-flex items-center gap-1 rounded px-2 py-1 text-[11px] font-semibold ring-1 ring-inset ${styles[tone]}`}>{children}</span>;
}

export function EmptyState({ title, children }: { title: string; children?: ReactNode }) {
  return (
    <div className="flex min-h-40 flex-col items-center justify-center px-6 py-10 text-center">
      <BadgeCheck className="mb-3 size-6 text-muted-foreground/60" />
      <h3 className="text-sm font-semibold text-foreground">{title}</h3>
      {children && <p className="mt-1 max-w-md text-sm text-muted-foreground">{children}</p>}
    </div>
  );
}

export function SectionTitle({ title, detail }: { title: string; detail?: string }) {
  return (
    <div className="mb-4 flex items-baseline justify-between gap-3">
      <h3 className="text-sm font-semibold text-foreground">{title}</h3>
      {detail && <span className="text-xs text-muted-foreground">{detail}</span>}
    </div>
  );
}