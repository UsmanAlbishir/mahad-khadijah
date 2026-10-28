"use client";

import React, { useState } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { Database, School, Sparkles } from "lucide-react";
import { MockFeedback, MockFeedbackNotice } from "@/components/ui/mock-feedback";

export default function SettingsPage() {
  const [feedback, setFeedback] = useState<MockFeedbackNotice | null>(null);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback({
      type: "success",
      title: "Settings Preserved in Prototype State",
      message: "School operational configuration parameters adjusted for the current browser session.",
      meta: "In-memory test environment",
    });
  };

  return (
    <AppShell>
      <div className="space-y-6 max-w-4xl mx-auto">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-foreground font-serif">
            School Configuration & Settings
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Configure Madad Khadijah Litahfizil Qur’an institutional details, curriculum targets, and prototype preferences.
          </p>
        </div>

        {feedback && (
          <MockFeedback notice={feedback} onClose={() => setFeedback(null)} />
        )}

        <form onSubmit={handleSave} className="space-y-6">
          {/* Institutional Identity Card */}
          <div className="bg-card text-card-foreground rounded-xl border border-border p-5 shadow-xs space-y-4">
            <div className="flex items-center gap-2.5 pb-3 border-b border-border">
              <School className="w-5 h-5 text-[#174D3A] dark:text-[#C6A45A]" />
              <h3 className="text-sm font-bold text-foreground">
                School Information
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="font-semibold block mb-1">School Name</label>
                <input
                  type="text"
                  defaultValue="Madad Khadijah Litahfizil Qur’an"
                  className="w-full px-3 py-2 rounded-lg bg-background border border-border"
                />
              </div>

              <div>
                <label className="font-semibold block mb-1">Sub-title / Motto</label>
                <input
                  type="text"
                  defaultValue="Center for Qur’anic Excellence & Tajweed Mastery"
                  className="w-full px-3 py-2 rounded-lg bg-background border border-border"
                />
              </div>

              <div>
                <label className="font-semibold block mb-1">Official Address</label>
                <input
                  type="text"
                  defaultValue="Kaduna, Nigeria"
                  className="w-full px-3 py-2 rounded-lg bg-background border border-border"
                />
              </div>

              <div>
                <label className="font-semibold block mb-1">Default Academic Session</label>
                <input
                  type="text"
                  defaultValue="2025/2026 Academic Session"
                  disabled
                  className="w-full px-3 py-2 rounded-lg bg-muted border border-border text-muted-foreground"
                />
              </div>
            </div>
          </div>

          {/* Curriculum Category Rules Card */}
          <div className="bg-card text-card-foreground rounded-xl border border-border p-5 shadow-xs space-y-4">
            <div className="flex items-center gap-2.5 pb-3 border-b border-border">
              <Sparkles className="w-5 h-5 text-[#C6A45A]" />
              <h3 className="text-sm font-bold text-foreground">
                Hifz Target Benchmarks
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-3 rounded-lg border border-border bg-muted/30">
                <p className="font-bold text-foreground">Category A Benchmark</p>
                <p className="text-muted-foreground mt-0.5">
                  Target pace: <strong>1 Juz per week</strong> (Accelerated track)
                </p>
              </div>

              <div className="p-3 rounded-lg border border-border bg-muted/30">
                <p className="font-bold text-foreground">Category B Benchmark</p>
                <p className="text-muted-foreground mt-0.5">
                  Target pace: <strong>½ Juz per week</strong> (Standard foundation track)
                </p>
              </div>
            </div>
          </div>

          {/* Demo Data Environment Disclaimer */}
          <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-5 text-xs text-amber-900 dark:text-amber-200 space-y-2">
            <div className="flex items-center gap-2 font-bold">
              <Database className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              <span>Prototype Runtime Boundary</span>
            </div>
            <p className="leading-relaxed">
              This application is configured as an isolated frontend prototype. No production credentials or live Supabase database connections are active in this build. All newly created students and teachers remain in the active browser memory state.
            </p>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="px-6 py-2 rounded-xl bg-[#174D3A] text-white text-xs font-semibold hover:bg-[#103729]"
            >
              Save Configuration (Mock)
            </button>
          </div>
        </form>
      </div>
    </AppShell>
  );
}
