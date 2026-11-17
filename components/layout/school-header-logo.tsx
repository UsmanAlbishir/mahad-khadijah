import React from "react";
import Link from "next/link";
import Image from "next/image";

interface SchoolHeaderLogoProps {
  collapsed?: boolean;
  className?: string;
  variant?: "light" | "dark" | "sidebar";
  href?: string;
}

export function SchoolHeaderLogo({
  collapsed = false,
  className = "",
  variant = "sidebar",
  href = "/dashboard",
}: SchoolHeaderLogoProps) {
  return (
    <Link
      href={href}
      className={`group flex items-center gap-3 transition-opacity hover:opacity-95 ${className}`}
    >
      <div className="flex size-11 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-white shadow-sm ring-1 ring-black/10">
        <Image
          src="/images/school-logo.jpeg"
          alt="Khadijah Institute for Qur'anic Memorization logo"
          width={44}
          height={44}
          className="size-full object-contain"
          priority
        />
      </div>

      {!collapsed && (
        <div className="flex flex-col min-w-0">
          <div className="flex items-center gap-1.5">
            <span
              className={`font-serif tracking-tight font-bold text-base truncate ${
                variant === "sidebar"
                  ? "text-white"
                  : "text-[#452D24] dark:text-[#FAF7F4]"
              }`}
            >
              Ma&apos;had Khadijah
            </span>
            <span className="rounded border border-[#E84F12]/30 bg-[#E84F12]/15 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-[#E84F12]">
              Tahfiz
            </span>
          </div>
          <span
            className={`text-[11px] truncate leading-tight font-medium ${
              variant === "sidebar"
                ? "text-white/70"
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
