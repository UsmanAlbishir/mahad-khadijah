"use client";

import React from "react";
import { Users, UserCheck, CalendarCheck, CreditCard } from "lucide-react";
import { DashboardMetrics } from "@/types";

interface MetricsCardsProps {
  metrics: DashboardMetrics;
  loading?: boolean;
}

export function DashboardMetricsCards({ metrics, loading = false }: MetricsCardsProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="h-28 rounded-xl bg-card border border-border p-5 animate-pulse"
          />
        ))}
      </div>
    );
  }

  const cards = [
    {
      title: "Enrolled Students",
      value: metrics.totalStudents,
      subtext: `${metrics.categoryACount} Cat A (1 Juz/wk) • ${metrics.categoryBCount} Cat B (½ Juz/wk)`,
      icon: Users,
      trend: "Active Cohort",
      accent: "text-[#452D24] dark:text-[#E84F12]",
      bgAccent: "bg-[#452D24]/10 dark:bg-[#E84F12]/10",
    },
    {
      title: "Active Tahfiz Faculty",
      value: metrics.activeTeachers,
      subtext: "Hafiz & Sanad credentialed instructors",
      icon: UserCheck,
      trend: "100% On-duty",
      accent: "text-[#C35A2F] dark:text-[#E84F12]",
      bgAccent: "bg-[#C35A2F]/10",
    },
    {
      title: "Today's Attendance",
      value: `${metrics.attendanceTodayPercentage}%`,
      subtext: "Morning & Afternoon Halaqah combined",
      icon: CalendarCheck,
      trend: "Above Target",
      accent: "text-[#452D24] dark:text-[#E84F12]",
      bgAccent: "bg-[#E84F12]/10",
    },
    {
      title: "Term Fees Recorded",
      value: `₦${metrics.paymentsRecordedSum.toLocaleString()}`,
      subtext: "Verified demo tuition payments",
      icon: CreditCard,
      trend: "Simulated",
      accent: "text-[#E84F12] dark:text-[#E8D8A7]",
      bgAccent: "bg-[#E84F12]/15",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.title}
            className="group relative bg-card text-card-foreground rounded-xl border border-border p-5 shadow-xs hover:shadow-md transition-all duration-200 hover:border-[#E84F12]/50 flex flex-col justify-between"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  {card.title}
                </p>
                <h3 className="text-2xl font-extrabold tracking-tight text-foreground mt-1.5 font-serif">
                  {card.value}
                </h3>
              </div>
              <div className={`p-2.5 rounded-xl ${card.bgAccent} ${card.accent} shrink-0`}>
                <Icon className="w-5 h-5" />
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-border/60 flex items-center justify-between text-xs text-muted-foreground">
              <span className="truncate pr-2">{card.subtext}</span>
              <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-muted text-foreground/80 shrink-0">
                {card.trend}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
