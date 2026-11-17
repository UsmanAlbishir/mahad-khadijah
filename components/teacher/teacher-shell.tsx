"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Suspense, useState } from "react";
import {
  BookOpenCheck,
  CalendarCheck2,
  ChartNoAxesCombined,
  ClipboardList,
  GraduationCap,
  LayoutDashboard,
  Menu,
  PanelLeftClose,
  UserRound,
  X,
} from "lucide-react";
import { DemoBadge } from "@/components/ui/demo-badge";
import { SchoolHeaderLogo } from "@/components/layout/school-header-logo";

const navigation = [
  { label: "Dashboard", href: "/teacher/dashboard", icon: LayoutDashboard },
  { label: "My students", href: "/teacher/students", icon: GraduationCap },
  { label: "Attendance", href: "/teacher/attendance", icon: CalendarCheck2 },
  { label: "Qur'an memorisation", href: "/teacher/memorisation", icon: BookOpenCheck },
  { label: "Daily reports", href: "/teacher/reports/daily", icon: ClipboardList },
  { label: "Weekly reports", href: "/teacher/reports/weekly", icon: ChartNoAxesCombined },
  { label: "Monthly reports", href: "/teacher/reports/monthly", icon: ChartNoAxesCombined },
  { label: "My profile", href: "/teacher/profile", icon: UserRound },
];

export function TeacherShell({ children }: Readonly<{ children: React.ReactNode }>) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background text-foreground lg:grid lg:grid-cols-[248px_minmax(0,1fr)]">
      <aside className="hidden border-r border-[#5C382B] bg-[#452D24] text-white lg:sticky lg:top-0 lg:flex lg:h-screen lg:flex-col">
        <Brand />
        <Suspense fallback={<div className="flex-1" aria-hidden="true" />}>
          <Navigation />
        </Suspense>
        <div className="border-t border-white/10 px-5 py-4">
          <p className="text-xs font-semibold text-white">2025/2026 academic session</p>
          <p className="mt-1 text-[11px] text-white/60">Sample term and group information</p>
        </div>
      </aside>

      <div className="min-w-0">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-card/95 px-4 backdrop-blur-sm sm:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="inline-flex size-9 items-center justify-center rounded-md border border-border text-muted-foreground hover:bg-muted lg:hidden"
              aria-label="Open teacher navigation"
            >
              <Menu className="size-4" />
            </button>
            <div className="min-w-0">
              <p className="hidden text-[11px] font-medium text-muted-foreground sm:block">Teacher workspace</p>
              <h1 className="truncate text-sm font-semibold sm:text-base">Mahad Khadijah</h1>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <DemoBadge />
            <div className="hidden size-9 items-center justify-center rounded-full bg-[#452D24] text-xs font-bold text-white sm:flex">AU</div>
          </div>
        </header>

        <main className="mx-auto w-full max-w-[1440px] p-4 sm:p-6 lg:p-8">{children}</main>
      </div>

      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label="Teacher navigation">
          <button
            type="button"
            aria-label="Close navigation"
            className="absolute inset-0 bg-black/50"
            onClick={() => setMobileMenuOpen(false)}
          />
          <aside className="relative flex h-full w-[min(300px,85vw)] flex-col bg-[#452D24] text-white shadow-xl">
            <div className="flex items-center justify-between pr-3">
              <Brand />
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                aria-label="Close navigation"
                className="rounded-md p-2 text-white/75 hover:bg-white/10 hover:text-white"
              >
                <X className="size-4" />
              </button>
            </div>
            <Suspense fallback={<div className="flex-1" aria-hidden="true" />}>
              <Navigation onNavigate={() => setMobileMenuOpen(false)} />
            </Suspense>
          </aside>
        </div>
      )}
    </div>
  );
}

function Brand() {
  return (
    <div className="border-b border-white/10 px-5 py-5">
      <SchoolHeaderLogo />
      <p className="mt-2 pl-14 text-[11px] text-white/60">Teacher workspace</p>
    </div>
  );
}

function Navigation({
  onNavigate,
}: {
  onNavigate?: () => void;
}) {
  const pathname = usePathname();

  return (
    <nav aria-label="Teacher navigation" className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
      <p className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-wide text-white/50">Teaching</p>
      {navigation.map(({ label, href, icon: Icon }) => {
        const active = pathname === href || (href !== "/teacher/dashboard" && pathname.startsWith(`${href}/`));

        return (
          <Link
            key={href}
            href={href}
            onClick={onNavigate}
            aria-current={active ? "page" : undefined}
            className={`flex min-h-10 items-center gap-3 rounded-md px-3 text-[13px] font-medium transition-colors ${
              active
                ? "bg-white/10 text-white ring-1 ring-inset ring-[#E84F12]/60"
                : "text-white/70 hover:bg-white/10 hover:text-white"
            }`}
          >
            <Icon className={`size-4 shrink-0 ${active ? "text-[#E84F12]" : "text-white/50"}`} />
            <span className="min-w-0 flex-1 truncate">{label}</span>
          </Link>
        );
      })}
      <div className="px-3 pt-3 text-[10px] text-white/45">
        <PanelLeftClose className="mr-1 inline size-3" /> Directory uses fictional demo records.
      </div>
    </nav>
  );
}
