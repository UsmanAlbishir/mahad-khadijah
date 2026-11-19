"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  GraduationCap,
  UserCheck,
  ClipboardCheck,
  BookMarked,
  Calendar,
  CreditCard,
  BarChart3,
  FileSpreadsheet,
  Settings,
  ChevronRight,
  ShieldCheck,
} from "lucide-react";
import { SchoolHeaderLogo } from "./school-header-logo";

export interface NavItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  category?: "core" | "academic" | "admin";
}

export const NAVIGATION_ITEMS: NavItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
    category: "core",
  },
  {
    title: "Students",
    href: "/students",
    icon: GraduationCap,
    badge: "10",
    category: "academic",
  },
  {
    title: "Teachers",
    href: "/teachers",
    icon: UserCheck,
    badge: "5",
    category: "academic",
  },
  {
    title: "Attendance",
    href: "/attendance",
    icon: ClipboardCheck,
    category: "academic",
  },
  {
    title: "Qur’an Memorisation",
    href: "/memorisation",
    icon: BookMarked,
    badge: "Active",
    category: "academic",
  },
  {
    title: "Academic Sessions",
    href: "/sessions",
    icon: Calendar,
    category: "admin",
  },
  {
    title: "Payments",
    href: "/payments",
    icon: CreditCard,
    category: "admin",
  },
  {
    title: "Results",
    href: "/results",
    icon: FileSpreadsheet,
    category: "admin",
  },
  {
    title: "Reports",
    href: "/reports",
    icon: BarChart3,
    category: "admin",
  },
  {
    title: "Settings",
    href: "/settings",
    icon: Settings,
    category: "admin",
  },
];

interface SidebarProps {
  onItemClick?: () => void;
  className?: string;
}

export function Sidebar({ onItemClick, className = "" }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      className={`flex h-full flex-col border-r border-[#5C382B] bg-[#452D24] text-white shadow-xl select-none ${className}`}
    >
      {/* Brand Header */}
      <div className="flex items-center justify-between border-b border-white/10 p-5">
        <SchoolHeaderLogo variant="sidebar" />
      </div>

      {/* Navigation List */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6 scrollbar-thin">
        {/* Core & Academic Group */}
        <div>
          <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-white/50">
            Main Management
          </div>
          <nav className="space-y-1">
            {NAVIGATION_ITEMS.slice(0, 5).map((item) => {
              const Icon = item.icon;
              const isActive =
                item.href === "/dashboard"
                  ? pathname === "/dashboard" || pathname === "/"
                  : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onItemClick}
                  className={`group relative flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                    isActive
                      ? "bg-white/10 text-white font-semibold shadow-xs ring-1 ring-[#E84F12]/60"
                      : "text-white/70 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  {/* Left accent bar for active item */}
                  {isActive && (
                    <span className="absolute bottom-1.5 left-0 top-1.5 w-1 rounded-r bg-[#E84F12]" />
                  )}

                  <div className="flex items-center gap-3 min-w-0">
                    <Icon
                      className={`w-4 h-4 shrink-0 transition-transform group-hover:scale-110 ${
                        isActive ? "text-[#E84F12]" : "text-white/50"
                      }`}
                    />
                    <span className="truncate">{item.title}</span>
                  </div>

                  {item.badge && (
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                        isActive
                          ? "bg-[#E84F12] text-white"
                          : "border border-white/10 bg-white/10 text-white/70"
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Administration Group */}
        <div>
          <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-white/50">
            Administration & Records
          </div>
          <nav className="space-y-1">
            {NAVIGATION_ITEMS.slice(5).map((item) => {
              const Icon = item.icon;
              const isActive = pathname.startsWith(item.href);

              return (
                <React.Fragment key={item.href}>
                  <Link
                    href={item.href}
                    onClick={onItemClick}
                    className={`group relative flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                      isActive
                        ? "bg-white/10 text-white font-semibold shadow-xs ring-1 ring-[#E84F12]/60"
                        : "text-white/70 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    {isActive && (
                      <span className="absolute bottom-1.5 left-0 top-1.5 w-1 rounded-r bg-[#E84F12]" />
                    )}

                    <div className="flex items-center gap-3 min-w-0">
                      <Icon
                        className={`w-4 h-4 shrink-0 transition-transform group-hover:scale-110 ${
                          isActive ? "text-[#E84F12]" : "text-white/50"
                        }`}
                      />
                      <span className="truncate">{item.title}</span>
                    </div>

                    <ChevronRight
                      className={`w-3.5 h-3.5 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all ${
                        isActive ? "text-[#E84F12]" : "text-white/35"
                      }`}
                    />
                  </Link>
                  {item.href === "/results" && pathname.startsWith("/results") && (
                    <nav aria-label="Results navigation" className="ml-5 mt-1 space-y-1 border-l border-white/15 pl-3">
                      {[
                        { title: "Results Dashboard", href: "/results" },
                        { title: "Examination Records", href: "/results/examinations" },
                        { title: "Enter Results", href: "/results/enter" },
                        { title: "Result Preview", href: "/results/preview/exam-ah-term1" },
                      ].map((resultItem) => {
                        const active = resultItem.href === "/results"
                          ? pathname === "/results"
                          : resultItem.href === "/results/preview/exam-ah-term1"
                            ? pathname.startsWith("/results/preview")
                            : pathname.startsWith(resultItem.href);
                        return (
                          <Link
                            key={resultItem.href}
                            href={resultItem.href}
                            onClick={onItemClick}
                            aria-current={active ? "page" : undefined}
                            className={`block rounded-md px-2.5 py-2 text-xs font-medium ${
                              active ? "bg-white/10 text-white" : "text-white/60 hover:bg-white/10 hover:text-white"
                            }`}
                          >
                            {resultItem.title}
                          </Link>
                        );
                      })}
                    </nav>
                  )}
                </React.Fragment>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Academy Session & Status Footer */}
      <div className="border-t border-white/10 bg-[#37231C] p-4">
        <div className="mb-2 flex items-center gap-2.5 text-xs text-white/75">
          <ShieldCheck className="w-4 h-4 shrink-0 text-[#E84F12]" />
          <div className="truncate">
            <p className="font-semibold text-white">2025/2026 Session</p>
            <p className="text-[11px] text-white/55">Term 1 • Week 7</p>
          </div>
        </div>
        <div className="flex items-center justify-between border-t border-white/10 pt-2 text-[11px] text-white/45">
          <span>Prototype v1.0</span>
          <span className="font-semibold text-[#E84F12]">Ma&apos;had SMS</span>
        </div>
      </div>
    </aside>
  );
}
