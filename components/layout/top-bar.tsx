"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Menu,
  Bell,
  ChevronDown,
  Calendar,
} from "lucide-react";
import { DemoBadge } from "@/components/ui/demo-badge";

interface TopBarProps {
  onToggleMobileNav: () => void;
}

export function TopBar({ onToggleMobileNav }: TopBarProps) {
  const pathname = usePathname();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  // Derive human-readable page title and breadcrumbs
  const getPageInfo = () => {
    if (pathname === "/" || pathname === "/dashboard") {
      return { title: "Dashboard Overview", section: "Main" };
    }
    if (pathname === "/students") {
      return { title: "Student Directory", section: "Students" };
    }
    if (pathname === "/students/new") {
      return { title: "New Student Admission", section: "Students" };
    }
    if (pathname.startsWith("/students/")) {
      return { title: "Student Profile", section: "Students" };
    }
    if (pathname === "/teachers") {
      return { title: "Teacher Directory", section: "Teachers" };
    }
    if (pathname === "/teachers/new") {
      return { title: "Teacher Registration", section: "Teachers" };
    }
    if (pathname === "/attendance") {
      return { title: "Attendance Tracking", section: "Halaqah Records" };
    }
    if (pathname === "/memorisation") {
      return { title: "Qur’an Memorisation Progress", section: "Tahfiz" };
    }
    if (pathname === "/sessions") {
      return { title: "Academic Sessions", section: "Administration" };
    }
    if (pathname === "/payments") {
      return { title: "Tuition & Fees Ledger", section: "Finance" };
    }
    if (pathname === "/reports") {
      return { title: "Academic & Memorisation Reports", section: "Reports" };
    }
    if (pathname.startsWith("/reports/weekly")) {
      return { title: "Weekly Reports", section: "Reports & Analytics" };
    }
    if (pathname.startsWith("/reports/monthly")) {
      return { title: "Monthly Reports", section: "Reports & Analytics" };
    }
    if (pathname.startsWith("/reports/musafa")) {
      return { title: "Musafa Assessment Reports", section: "Reports & Analytics" };
    }
    if (pathname.startsWith("/reports/teachers")) {
      return { title: "Teacher Performance Reports", section: "Reports & Analytics" };
    }
    if (pathname === "/settings") {
      return { title: "System Settings", section: "Configuration" };
    }
    return { title: "School Portal", section: "Overview" };
  };

  const { title, section } = getPageInfo();

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-4 md:px-6 bg-card/90 backdrop-blur-md border-b border-border shadow-xs">
      {/* Left: Mobile Toggle & Breadcrumbs */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onToggleMobileNav}
          className="lg:hidden p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted focus:outline-hidden"
          aria-label="Open navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex flex-col">
          <div className="hidden sm:flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
            <span>Ma&apos;had Khadijah</span>
            <span>/</span>
            <span className="font-semibold text-[#9B4123] dark:text-[#E84F12]">
              {section}
            </span>
          </div>
          <h1 className="text-base md:text-lg font-bold text-foreground tracking-tight leading-tight">
            {title}
          </h1>
        </div>
      </div>

      {/* Right Controls: Demo Badge, Notifications, User Menu */}
      <div className="flex items-center gap-2 md:gap-4">
        {/* Persistent DEMO DATA Indicator */}
        <DemoBadge />

        {/* Term Pill (Desktop) */}
        <div className="hidden items-center gap-1.5 rounded-md border border-[#E84F12]/25 bg-[#FAF7F4] px-2.5 py-1 text-xs font-medium text-[#452D24] dark:bg-muted dark:text-foreground xl:flex">
          <Calendar className="h-3.5 w-3.5 text-[#E84F12]" />
          <span>2025/2026 • First Term</span>
        </div>

        {/* Notifications Dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition"
            aria-label="View notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-[#E84F12]" />
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-card rounded-xl shadow-xl border border-border p-3 z-50 animate-in fade-in zoom-in-95">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-border">
                <span className="text-xs font-bold text-foreground">
                  Notifications (Demo)
                </span>
                <span className="text-[10px] text-muted-foreground">3 unread</span>
              </div>
              <div className="space-y-2 text-xs">
                <div className="p-2 rounded-md bg-muted/50 hover:bg-muted transition">
                  <p className="font-semibold text-foreground">
                    Weekly Juz Evaluation Due
                  </p>
                  <p className="text-[11px] text-muted-foreground">
                    Category A students evaluation scheduled for tomorrow morning.
                  </p>
                </div>
                <div className="p-2 rounded-md bg-muted/50 hover:bg-muted transition">
                  <p className="font-semibold text-foreground">
                    Fee Payment Recorded
                  </p>
                  <p className="text-[11px] text-muted-foreground">
                    Ahmad Bilal Yusuf deposited ₦80,000 partial tuition.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* User Menu Dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-muted transition border border-transparent hover:border-border"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#452D24] text-xs font-bold text-white ring-2 ring-[#E84F12]/35">
              MK
            </div>
            <div className="hidden md:flex flex-col text-left">
              <span className="text-xs font-bold text-foreground leading-tight">
                Ustadh Administrator
              </span>
              <span className="text-[10px] text-muted-foreground">
                Head of Academics
              </span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-muted-foreground hidden md:block" />
          </button>

          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-56 bg-card rounded-xl shadow-xl border border-border p-2 z-50 animate-in fade-in zoom-in-95">
              <div className="px-3 py-2 border-b border-border mb-1">
                <p className="text-xs font-bold text-foreground">
                  Ustadh Administrator
                </p>
                <p className="text-[11px] text-muted-foreground">
                  admin@madadkhadijah.sch.ng
                </p>
                <span className="inline-block mt-1 text-[10px] px-1.5 py-0.5 rounded bg-[#E84F12]/10 text-[#9B4123] dark:text-[#E84F12] font-medium">
                  Active Demo Session
                </span>
              </div>
              <div className="text-xs space-y-1">
                <a
                  href="/settings"
                  className="block px-3 py-1.5 rounded-md hover:bg-muted text-foreground transition"
                >
                  Account Settings
                </a>
                <Link
                  href="/reports"
                  className="block px-3 py-1.5 rounded-md hover:bg-muted text-foreground transition"
                >
                  School Reports
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
