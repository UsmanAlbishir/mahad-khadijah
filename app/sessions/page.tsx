"use client";

import React from "react";
import { AppShell } from "@/components/layout/app-shell";
import { Calendar, Plus, CheckCircle2 } from "lucide-react";
import { MOCK_ACADEMIC_SESSIONS } from "@/lib/mock-data";

export default function AcademicSessionsPage() {
  return (
    <AppShell>
      <div className="space-y-6 max-w-5xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-foreground font-serif">
              Academic Sessions & Terms
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
              Manage academic calendar dates, term transitions, and memorisation scheduling periods.
            </p>
          </div>

          <button
            type="button"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#452D24] text-white text-xs font-semibold hover:bg-[#37231C]"
          >
            <Plus className="w-4 h-4" />
            <span>New Academic Session</span>
          </button>
        </div>

        <div className="space-y-4">
          {MOCK_ACADEMIC_SESSIONS.map((session) => (
            <div
              key={session.id}
              className={`bg-card text-card-foreground rounded-2xl border p-5 shadow-xs space-y-4 ${
                session.isCurrent ? "border-[#E84F12] ring-1 ring-[#E84F12]/40" : "border-border"
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-border">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-[#452D24]/10 text-[#452D24] dark:text-[#E84F12]">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-foreground">
                      {session.name}
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      Duration: {session.startDate} to {session.endDate}
                    </p>
                  </div>
                </div>

                {session.isCurrent ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#452D24] text-white">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#E84F12]" />
                    <span>Active Session</span>
                  </span>
                ) : (
                  <span className="text-xs px-2.5 py-0.5 rounded bg-muted text-muted-foreground font-medium">
                    Archived
                  </span>
                )}
              </div>

              {/* Term breakdown */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                {["First Term", "Second Term", "Third Term"].map((term) => {
                  const isCurrentTerm = session.isCurrent && session.currentTerm === term;
                  return (
                    <div
                      key={term}
                      className={`p-3.5 rounded-xl border ${
                        isCurrentTerm
                          ? "bg-[#452D24]/10 border-[#452D24] text-foreground font-semibold"
                          : "bg-muted/30 border-border text-muted-foreground"
                      }`}
                    >
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-bold text-foreground">{term}</span>
                        {isCurrentTerm && (
                          <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-[#E84F12] text-[#37231C]">
                            In Session
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] opacity-80">
                        {isCurrentTerm ? "Week 7 of 13 • 1 Juz Target Pace active" : "13 Weeks allocated"}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
