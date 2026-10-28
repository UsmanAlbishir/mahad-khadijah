"use client";

import React, { useState } from "react";
import { Sidebar } from "./sidebar";
import { TopBar } from "./top-bar";
import { DemoBadge } from "@/components/ui/demo-badge";
import { X } from "lucide-react";

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground antialiased">
      {/* Top persistent reminder banner */}
      <DemoBadge variant="banner" />

      <div className="flex-1 flex overflow-hidden">
        {/* Desktop Sidebar (Permanent) */}
        <div className="hidden lg:flex lg:w-64 lg:flex-col lg:shrink-0">
          <Sidebar className="w-64 h-full" />
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileNavOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            {/* Backdrop */}
            <div
              className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in"
              onClick={() => setMobileNavOpen(false)}
            />

            {/* Slide-over Drawer */}
            <div className="fixed inset-y-0 left-0 w-72 max-w-[85vw] bg-[#103729] shadow-2xl z-50 flex flex-col animate-in slide-in-from-left duration-200">
              <div className="absolute top-4 right-3 z-10">
                <button
                  type="button"
                  onClick={() => setMobileNavOpen(false)}
                  className="p-1.5 rounded-lg text-emerald-200 hover:text-white hover:bg-[#174D3A] transition"
                  aria-label="Close navigation"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <Sidebar
                className="w-full h-full border-r-0"
                onItemClick={() => setMobileNavOpen(false)}
              />
            </div>
          </div>
        )}

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
          <TopBar onToggleMobileNav={() => setMobileNavOpen(true)} />

          <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
