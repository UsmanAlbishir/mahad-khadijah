"use client";

import React, { useState } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { Download, FileText } from "lucide-react";
import { MockFeedback, MockFeedbackNotice } from "@/components/ui/mock-feedback";

export default function ReportsPage() {
  const [feedback, setFeedback] = useState<MockFeedbackNotice | null>(null);

  const handleDownloadReport = (title: string) => {
    setFeedback({
      type: "info",
      title: "Report Export (Mock Action)",
      message: `Generated printable preview for "${title}". Prototype data export simulated.`,
      meta: "No external server transmission",
    });
  };

  return (
    <AppShell>
      <div className="space-y-6 max-w-5xl mx-auto">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-foreground font-serif">
            School Performance & Memorisation Reports
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Export halaqah progress summaries, term attendance audits, and fee collection sheets.
          </p>
        </div>

        {feedback && (
          <MockFeedback notice={feedback} onClose={() => setFeedback(null)} />
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            {
              title: "Category A & B Weekly Hifz Progress Summary",
              description: "Comprehensive breakdown of Sabqi and Muraja'ah pace across all halaqah circles.",
              format: "PDF Document",
            },
            {
              title: "Term 1 Attendance & Punctuality Audit",
              description: "Aggregated morning and afternoon circle attendance logs with excused leave records.",
              format: "Spreadsheet (CSV)",
            },
            {
              title: "Fee Collections & Bursary Ledger Summary",
              description: "Audited list of tuition payments, outstanding balances, and receipt numbers.",
              format: "Financial PDF",
            },
            {
              title: "Sanad Candidate Graduation Readiness Roster",
              description: "Students approaching 30 Juz completion with evaluation scores.",
              format: "Academic Report",
            },
          ].map((rep) => (
            <div
              key={rep.title}
              className="bg-card text-card-foreground rounded-xl border border-border p-5 shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <FileText className="w-4 h-4 text-[#C6A45A]" />
                  <span className="text-[11px] font-semibold text-muted-foreground uppercase">
                    {rep.format}
                  </span>
                </div>
                <h3 className="text-sm font-bold text-foreground">{rep.title}</h3>
                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                  {rep.description}
                </p>
              </div>

              <div className="pt-4 mt-3 border-t border-border flex items-center justify-between">
                <span className="text-[11px] text-muted-foreground">Demo Dataset</span>
                <button
                  type="button"
                  onClick={() => handleDownloadReport(rep.title)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#174D3A] text-white text-xs font-semibold hover:bg-[#103729]"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export Demo Report</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
