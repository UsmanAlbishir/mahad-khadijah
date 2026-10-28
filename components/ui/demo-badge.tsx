"use client";

import React, { useState } from "react";
import { Info, DatabaseZap, X } from "lucide-react";

interface DemoBadgeProps {
  variant?: "pill" | "banner";
  className?: string;
}

export function DemoBadge({ variant = "pill", className = "" }: DemoBadgeProps) {
  const [isOpen, setIsOpen] = useState(false);

  if (variant === "banner") {
    return (
      <div className={`bg-amber-500/10 border-b border-amber-500/20 px-4 py-1.5 text-xs text-amber-900 dark:text-amber-200 flex items-center justify-between ${className}`}>
        <div className="flex items-center gap-2 max-w-7xl mx-auto w-full">
          <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase bg-amber-500/20 text-amber-800 dark:text-amber-300">
            PROTOTYPE MODE
          </span>
          <span className="truncate">
            All records displayed are fictional demonstration data. No live Supabase database reads or writes are performed in this milestone.
          </span>
        </div>
      </div>
    );
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold tracking-wide uppercase transition-all duration-150 border cursor-pointer
          bg-amber-500/15 text-amber-800 dark:text-amber-300 border-amber-500/30 hover:bg-amber-500/25 active:scale-95 shadow-xs ${className}`}
        title="Click to view Demo Data details"
      >
        <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
        <span className="font-bold">DEMO DATA</span>
        <Info className="w-3 h-3 ml-0.5 opacity-70" />
      </button>

      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in"
        >
          <div className="bg-card text-card-foreground border border-border rounded-xl shadow-2xl max-w-md w-full p-6 relative">
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 p-1 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition"
              aria-label="Close dialog"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-amber-500/20 text-amber-800 dark:text-amber-300 flex items-center justify-center shrink-0">
                <DatabaseZap className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-foreground">
                  Fictional Prototype Environment
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Madad Khadijah SMS • Milestone Preview
                </p>
              </div>
            </div>

            <div className="mt-4 space-y-2.5 text-xs text-foreground/80 leading-relaxed bg-muted/40 p-3.5 rounded-lg border border-border">
              <p>
                <strong>Isolated Demo Data:</strong> All student names, admission numbers, teacher credentials, and financial figures are realistic mock entities curated for testing the UI/UX.
              </p>
              <p>
                <strong>Zero Database Mutations:</strong> No live Supabase database operations are executed during this milestone. Any additions or edits you perform exist in the active browser memory state.
              </p>
              <p>
                <strong>Production Readiness:</strong> The frontend utilizes an abstraction layer (`lib/mock-services.ts`), ready to connect seamlessly to authorized backend APIs when approved.
              </p>
            </div>

            <div className="mt-5 flex justify-end">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 bg-primary text-primary-foreground text-xs font-medium rounded-lg hover:bg-primary/90 transition"
              >
                Understood
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
