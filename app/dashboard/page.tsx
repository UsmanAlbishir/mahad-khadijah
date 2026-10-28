"use client";

import React, { useState, useEffect } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { DashboardMetricsCards } from "@/components/dashboard/dashboard-metrics-cards";
import { MemorisationProgressCard } from "@/components/dashboard/memorisation-progress-card";
import { RecentActivityCard } from "@/components/dashboard/recent-activity-card";
import { QuickActionsBar } from "@/components/dashboard/quick-actions-bar";
import {
  getDashboardMetrics,
  getRecentActivities,
  getAcademicSessions,
} from "@/lib/mock-services";
import { DashboardMetrics, AcademicSession } from "@/types";
import {
  Calendar,
  Layers,
  Info,
  Eye,
  EyeOff,
} from "lucide-react";

interface ActivityItem {
  id: string;
  title: string;
  description: string;
  timeAgo: string;
  category: string;
  badge: string;
}

export default function DashboardPage() {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [sessions, setSessions] = useState<AcademicSession[]>([]);
  const [selectedSession, setSelectedSession] = useState("session-2025-2026");
  const [selectedTerm, setSelectedTerm] = useState("First Term");
  const [loading, setLoading] = useState(true);
  const [simulateEmptyState, setSimulateEmptyState] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [metricData, actData, sessData] = await Promise.all([
          getDashboardMetrics(),
          getRecentActivities(),
          getAcademicSessions(),
        ]);
        setMetrics(metricData);
        setActivities(actData);
        setSessions(sessData);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Welcome Banner with Islamic Date Context & Session Selector */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#103729] via-[#174D3A] to-[#1a5a43] text-white p-6 sm:p-8 shadow-lg border border-[#C6A45A]/30">
          {/* Subtle Islamic geometric star accent in background */}
          <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-10 pointer-events-none bg-islamic-pattern" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="space-y-1.5 max-w-2xl">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#C6A45A] text-[#103729]">
                  Bismillah ir-Rahman ir-Rahim
                </span>
                <span className="text-xs text-emerald-200/80">
                  Rabīʿ al-Thānī 1448 AH
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight font-serif text-[#F7F3E8]">
                Ahlan wa Sahlan, Administrator
              </h2>
              <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed">
                Welcome to the Madad Khadijah Litahfizil Qur’an School Management Prototype.
                Supervise student memorisation milestones, daily halaqah circles, and administrative operations.
              </p>
            </div>

            {/* Academic Session and Term Selectors */}
            <div className="flex flex-col sm:flex-row gap-3 bg-black/25 backdrop-blur-xs p-3.5 rounded-xl border border-white/10 shrink-0">
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-emerald-200 uppercase tracking-wider flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-[#C6A45A]" />
                  <span>Academic Session</span>
                </label>
                <select
                  value={selectedSession}
                  onChange={(e) => setSelectedSession(e.target.value)}
                  className="w-full bg-[#103729] text-white border border-[#C6A45A]/50 rounded-lg px-2.5 py-1.5 text-xs font-medium focus:outline-hidden focus:ring-2 focus:ring-[#C6A45A]"
                >
                  {sessions.length > 0 ? (
                    sessions.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name} {s.isCurrent ? "(Active)" : "(Archive)"}
                      </option>
                    ))
                  ) : (
                    <option value="session-2025-2026">2025/2026 Session (Active)</option>
                  )}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-emerald-200 uppercase tracking-wider flex items-center gap-1">
                  <Layers className="w-3 h-3 text-[#C6A45A]" />
                  <span>Term</span>
                </label>
                <select
                  value={selectedTerm}
                  onChange={(e) => setSelectedTerm(e.target.value)}
                  className="w-full bg-[#103729] text-white border border-[#C6A45A]/50 rounded-lg px-2.5 py-1.5 text-xs font-medium focus:outline-hidden focus:ring-2 focus:ring-[#C6A45A]"
                >
                  <option value="First Term">First Term (Current)</option>
                  <option value="Second Term">Second Term</option>
                  <option value="Third Term">Third Term</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Prototype State Toggle Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-2.5 rounded-xl bg-card border border-border text-xs">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Info className="w-4 h-4 text-[#C6A45A] shrink-0" />
            <span>
              Currently viewing <strong>{selectedSession === "session-2025-2026" ? "2025/2026" : "2024/2025"}</strong> ({selectedTerm}) demonstration dataset.
            </span>
          </div>

          <button
            type="button"
            onClick={() => setSimulateEmptyState(!simulateEmptyState)}
            className="flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium bg-muted hover:bg-muted/80 text-foreground transition"
          >
            {simulateEmptyState ? (
              <>
                <Eye className="w-3.5 h-3.5 text-[#174D3A] dark:text-[#C6A45A]" />
                <span>Show Populated Data</span>
              </>
            ) : (
              <>
                <EyeOff className="w-3.5 h-3.5 text-muted-foreground" />
                <span>Preview Empty State</span>
              </>
            )}
          </button>
        </div>

        {/* Summary Metric Cards */}
        {metrics && (
          <DashboardMetricsCards
            metrics={
              simulateEmptyState
                ? {
                    totalStudents: 0,
                    activeTeachers: 0,
                    attendanceTodayPercentage: 0,
                    paymentsRecordedSum: 0,
                    categoryACount: 0,
                    categoryBCount: 0,
                    memorisationPaceWeekly: [],
                  }
                : metrics
            }
            loading={loading}
          />
        )}

        {/* Quick Actions Bar */}
        <QuickActionsBar />

        {/* Main Grid: Weekly Memorisation Progress & Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            {metrics && (
              <MemorisationProgressCard
                metrics={
                  simulateEmptyState
                    ? {
                        ...metrics,
                        memorisationPaceWeekly: [],
                      }
                    : metrics
                }
              />
            )}
          </div>

          <div className="lg:col-span-1">
            <RecentActivityCard
              activities={activities}
              isEmpty={simulateEmptyState}
            />
          </div>
        </div>
      </div>
    </AppShell>
  );
}
