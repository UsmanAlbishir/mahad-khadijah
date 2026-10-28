"use client";

import React from "react";
import Link from "next/link";
import { BookOpen, TrendingUp, ArrowRight } from "lucide-react";
import { DashboardMetrics } from "@/types";

interface MemorisationProgressProps {
  metrics: DashboardMetrics;
}

export function MemorisationProgressCard({ metrics }: MemorisationProgressProps) {
  return (
    <div className="bg-card text-card-foreground rounded-xl border border-border p-5 shadow-xs flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-border">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-[#174D3A]/10 text-[#174D3A] dark:text-[#C6A45A]">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-foreground">
              Weekly Qur’an Memorisation Progress
            </h3>
            <p className="text-xs text-muted-foreground">
              Tracking Halaqah pace vs. Curricular Milestones (Fictional Demo Data)
            </p>
          </div>
        </div>
        <Link
          href="/memorisation"
          className="text-xs font-semibold text-[#174D3A] dark:text-[#C6A45A] hover:underline flex items-center gap-1"
        >
          <span>View all records</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Category Target Bars */}
      <div className="py-4 space-y-4">
        {/* Category A Bar */}
        <div>
          <div className="flex items-center justify-between text-xs mb-1.5">
            <div className="flex items-center gap-1.5 font-semibold text-foreground">
              <span className="w-2.5 h-2.5 rounded-full bg-[#174D3A]" />
              <span>Category A (Target: 1 Juz / Week)</span>
            </div>
            <span className="font-bold text-[#174D3A] dark:text-[#C6A45A]">
              96% Pace Met
            </span>
          </div>
          <div className="h-3 w-full bg-muted rounded-full overflow-hidden p-0.5 border border-border/40">
            <div
              className="h-full bg-gradient-to-r from-[#174D3A] to-[#237A52] rounded-full transition-all duration-500"
              style={{ width: "96%" }}
            />
          </div>
          <div className="flex justify-between text-[11px] text-muted-foreground mt-1">
            <span>5 Active Students in cohort</span>
            <span>Target completion: 30 Juz / 30 Weeks</span>
          </div>
        </div>

        {/* Category B Bar */}
        <div>
          <div className="flex items-center justify-between text-xs mb-1.5">
            <div className="flex items-center gap-1.5 font-semibold text-foreground">
              <span className="w-2.5 h-2.5 rounded-full bg-[#C6A45A]" />
              <span>Category B (Target: ½ Juz / Week)</span>
            </div>
            <span className="font-bold text-[#A87518] dark:text-[#E8D8A7]">
              93% Pace Met
            </span>
          </div>
          <div className="h-3 w-full bg-muted rounded-full overflow-hidden p-0.5 border border-border/40">
            <div
              className="h-full bg-gradient-to-r from-[#C6A45A] to-[#A87518] rounded-full transition-all duration-500"
              style={{ width: "93%" }}
            />
          </div>
          <div className="flex justify-between text-[11px] text-muted-foreground mt-1">
            <span>5 Active Students in cohort</span>
            <span>Target completion: 30 Juz / 60 Weeks</span>
          </div>
        </div>
      </div>

      {/* Weekly Progress Breakdown Pillars */}
      <div className="pt-3 border-t border-border">
        <h4 className="text-xs font-semibold text-foreground mb-3 flex items-center gap-1.5">
          <TrendingUp className="w-4 h-4 text-emerald-600" />
          <span>Curricular Consistency Across Term Weeks</span>
        </h4>

        <div className="grid grid-cols-4 gap-2">
          {metrics.memorisationPaceWeekly.map((item) => (
            <div
              key={item.weekLabel}
              className="bg-muted/40 rounded-lg p-2.5 border border-border text-center"
            >
              <span className="text-[11px] font-bold text-muted-foreground block">
                {item.weekLabel}
              </span>
              <div className="mt-1 flex items-baseline justify-center gap-1">
                <span className="text-sm font-extrabold text-[#174D3A] dark:text-[#C6A45A]">
                  {item.catATargetMetPct}%
                </span>
                <span className="text-[10px] text-muted-foreground">Cat A</span>
              </div>
              <div className="flex items-baseline justify-center gap-1 text-[11px]">
                <span className="font-bold text-amber-700 dark:text-amber-400">
                  {item.catBTargetMetPct}%
                </span>
                <span className="text-[10px] text-muted-foreground">Cat B</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
