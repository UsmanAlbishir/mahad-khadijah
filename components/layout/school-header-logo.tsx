import React from "react";
import Link from "next/link";

interface SchoolHeaderLogoProps {
  collapsed?: boolean;
  className?: string;
  variant?: "light" | "dark" | "sidebar";
}

export function SchoolHeaderLogo({
  collapsed = false,
  className = "",
  variant = "sidebar",
}: SchoolHeaderLogoProps) {
  return (
    <Link
      href="/dashboard"
      className={`group flex items-center gap-3 transition-opacity hover:opacity-95 ${className}`}
    >
      {/* Islamic Emblem / Geometric Medallion */}
      <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-[#174D3A] to-[#103729] text-[#C6A45A] shadow-md border border-[#C6A45A]/40 shrink-0">
        {/* Subtle decorative inner star ring */}
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-5 h-5 text-[#C6A45A] transition-transform group-hover:scale-105"
        >
          {/* Qur'an on Rehal (Book Stand) icon */}
          <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z" />
          <path d="M6 6h10" />
          <path d="M6 10h10" />
          <path d="M6 14h6" />
          {/* Subtle star / crescent accent */}
          <circle cx="17.5" cy="14.5" r="1" fill="#C6A45A" />
        </svg>
        {/* Small gold corner embellishment */}
        <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-[#C6A45A] ring-2 ring-[#103729]" />
      </div>

      {!collapsed && (
        <div className="flex flex-col min-w-0">
          <div className="flex items-center gap-1.5">
            <span
              className={`font-serif tracking-tight font-bold text-base truncate ${
                variant === "sidebar"
                  ? "text-white"
                  : "text-[#103729] dark:text-[#F7F3E8]"
              }`}
            >
              Madad Khadijah
            </span>
            <span className="text-[10px] uppercase font-semibold tracking-wider px-1.5 py-0.2 rounded bg-[#C6A45A]/25 text-[#E8D8A7] border border-[#C6A45A]/30">
              Tahfiz
            </span>
          </div>
          <span
            className={`text-[11px] truncate leading-tight font-medium ${
              variant === "sidebar"
                ? "text-emerald-200/70"
                : "text-muted-foreground"
            }`}
          >
            Litahfizil Qur’an School Management
          </span>
        </div>
      )}
    </Link>
  );
}
