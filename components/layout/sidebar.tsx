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
      className={`flex flex-col h-full bg-[#103729] text-white border-r border-[#174D3A] shadow-xl select-none ${className}`}
    >
      {/* Brand Header */}
      <div className="p-5 border-b border-[#174D3A] flex items-center justify-between">
        <SchoolHeaderLogo variant="sidebar" />
      </div>

      {/* Navigation List */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6 scrollbar-thin">
        {/* Core & Academic Group */}
        <div>
          <div className="px-3 pb-2 text-[10px] uppercase font-bold tracking-wider text-[#C6A45A]/90">
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
                      ? "bg-[#174D3A] text-white font-semibold shadow-xs ring-1 ring-[#C6A45A]/40"
                      : "text-emerald-100/75 hover:bg-[#174D3A]/50 hover:text-white"
                  }`}
                >
                  {/* Left accent bar for active item */}
                  {isActive && (
                    <span className="absolute left-0 top-1.5 bottom-1.5 w-1 rounded-r bg-[#C6A45A]" />
                  )}

                  <div className="flex items-center gap-3 min-w-0">
                    <Icon
                      className={`w-4 h-4 shrink-0 transition-transform group-hover:scale-110 ${
                        isActive ? "text-[#C6A45A]" : "text-emerald-200/60"
                      }`}
                    />
                    <span className="truncate">{item.title}</span>
                  </div>

                  {item.badge && (
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                        isActive
                          ? "bg-[#C6A45A] text-[#103729]"
                          : "bg-[#174D3A] text-emerald-200/80 border border-emerald-600/30"
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
          <div className="px-3 pb-2 text-[10px] uppercase font-bold tracking-wider text-[#C6A45A]/90">
            Administration & Records
          </div>
          <nav className="space-y-1">
            {NAVIGATION_ITEMS.slice(5).map((item) => {
              const Icon = item.icon;
              const isActive = pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onItemClick}
                  className={`group relative flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                    isActive
                      ? "bg-[#174D3A] text-white font-semibold shadow-xs ring-1 ring-[#C6A45A]/40"
                      : "text-emerald-100/75 hover:bg-[#174D3A]/50 hover:text-white"
                  }`}
                >
                  {isActive && (
                    <span className="absolute left-0 top-1.5 bottom-1.5 w-1 rounded-r bg-[#C6A45A]" />
                  )}

                  <div className="flex items-center gap-3 min-w-0">
                    <Icon
                      className={`w-4 h-4 shrink-0 transition-transform group-hover:scale-110 ${
                        isActive ? "text-[#C6A45A]" : "text-emerald-200/60"
                      }`}
                    />
                    <span className="truncate">{item.title}</span>
                  </div>

                  <ChevronRight
                    className={`w-3.5 h-3.5 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all ${
                      isActive ? "text-[#C6A45A]" : "text-emerald-300/40"
                    }`}
                  />
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Academy Session & Status Footer */}
      <div className="p-4 border-t border-[#174D3A] bg-[#0c2a1f]">
        <div className="flex items-center gap-2.5 text-xs text-emerald-100/80 mb-2">
          <ShieldCheck className="w-4 h-4 text-[#C6A45A] shrink-0" />
          <div className="truncate">
            <p className="font-semibold text-white">2025/2026 Session</p>
            <p className="text-[11px] text-emerald-300/70">Term 1 • Week 7</p>
          </div>
        </div>
        <div className="pt-2 border-t border-[#174D3A]/60 flex items-center justify-between text-[11px] text-emerald-300/60">
          <span>Prototype v1.0</span>
          <span className="text-[#C6A45A] font-semibold">Madad SMS</span>
        </div>
      </div>
    </aside>
  );
}
