"use client";

import React from "react";
import Link from "next/link";
import { UserPlus, ClipboardCheck, CreditCard, FileSpreadsheet } from "lucide-react";

export function QuickActionsBar() {
  const actions = [
    {
      title: "Add Student",
      subtitle: "Admit new talib",
      href: "/students/new",
      icon: UserPlus,
      primary: true,
    },
    {
      title: "Record Attendance",
      subtitle: "Halaqah check-in",
      href: "/attendance",
      icon: ClipboardCheck,
      primary: false,
    },
    {
      title: "Record Payment",
      subtitle: "Issue fee receipt",
      href: "/payments",
      icon: CreditCard,
      primary: false,
    },
    {
      title: "View Reports",
      subtitle: "Hifz analytics",
      href: "/reports",
      icon: FileSpreadsheet,
      primary: false,
    },
  ];

  return (
    <div className="bg-card text-card-foreground rounded-xl border border-border p-4 shadow-xs">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
          Quick Actions
        </h3>
        <span className="text-[11px] text-muted-foreground">Common Workflows</span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {actions.map((act) => {
          const Icon = act.icon;
          return (
            <Link
              key={act.title}
              href={act.href}
              className={`flex items-center gap-3 p-3 rounded-lg border transition-all duration-150 text-left group ${
                act.primary
                  ? "bg-[#174D3A] text-white border-[#174D3A] hover:bg-[#103729] shadow-xs"
                  : "bg-muted/40 hover:bg-muted border-border hover:border-[#C6A45A]/50 text-foreground"
              }`}
            >
              <div
                className={`p-2 rounded-md shrink-0 transition-transform group-hover:scale-105 ${
                  act.primary
                    ? "bg-[#103729] text-[#C6A45A]"
                    : "bg-background text-[#174D3A] dark:text-[#C6A45A] shadow-2xs"
                }`}
              >
                <Icon className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold truncate">{act.title}</p>
                <p
                  className={`text-[11px] truncate ${
                    act.primary ? "text-emerald-200/80" : "text-muted-foreground"
                  }`}
                >
                  {act.subtitle}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
