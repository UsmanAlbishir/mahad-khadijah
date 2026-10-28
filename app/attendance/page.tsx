"use client";

import React, { useState } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { Save } from "lucide-react";
import { MOCK_STUDENTS } from "@/lib/mock-data";
import { MockFeedback, MockFeedbackNotice } from "@/components/ui/mock-feedback";

export default function AttendancePage() {
  const [selectedSession, setSelectedSession] = useState("Morning Halaqah");
  const [attendanceDate, setAttendanceDate] = useState("2026-10-27");
  const [attendanceState, setAttendanceState] = useState<
    Record<string, "present" | "late" | "absent" | "excused">
  >(() => {
    const init: Record<string, "present" | "late" | "absent" | "excused"> = {};
    MOCK_STUDENTS.forEach((st, idx) => {
      if (idx === 2) init[st.id] = "late";
      else if (idx === 9) init[st.id] = "excused";
      else init[st.id] = "present";
    });
    return init;
  });
  const [feedback, setFeedback] = useState<MockFeedbackNotice | null>(null);

  const setStatus = (
    studentId: string,
    status: "present" | "late" | "absent" | "excused"
  ) => {
    setAttendanceState((prev) => ({
      ...prev,
      [studentId]: status,
    }));
  };

  const handleSave = () => {
    setFeedback({
      type: "success",
      title: "Attendance Finalized (Mock Save)",
      message: `Saved attendance records for ${MOCK_STUDENTS.length} students in ${selectedSession} on ${attendanceDate}.`,
      meta: "In-memory simulated commit • No database writes",
    });
  };

  const counts = Object.values(attendanceState).reduce(
    (acc, curr) => {
      acc[curr] = (acc[curr] || 0) + 1;
      return acc;
    },
    { present: 0, late: 0, absent: 0, excused: 0 } as Record<string, number>
  );

  return (
    <AppShell>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-foreground font-serif">
              Halaqah Daily Attendance
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
              Record and audit morning Sabqi and evening Muraja’ah circle attendance.
            </p>
          </div>

          <button
            type="button"
            onClick={handleSave}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#174D3A] text-white text-xs sm:text-sm font-bold hover:bg-[#103729] transition shadow-xs ring-1 ring-[#C6A45A]/30 shrink-0"
          >
            <Save className="w-4 h-4 text-[#C6A45A]" />
            <span>Save Attendance (Mock)</span>
          </button>
        </div>

        {feedback && (
          <MockFeedback notice={feedback} onClose={() => setFeedback(null)} />
        )}

        {/* Date & Session Selector Bar */}
        <div className="bg-card text-card-foreground rounded-xl border border-border p-4 shadow-xs grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="text-xs font-semibold text-foreground block mb-1">
              Attendance Date
            </label>
            <input
              type="date"
              value={attendanceDate}
              onChange={(e) => setAttendanceDate(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-background border border-border text-xs"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-foreground block mb-1">
              Circle Session
            </label>
            <select
              value={selectedSession}
              onChange={(e) => setSelectedSession(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-background border border-border text-xs"
            >
              <option value="Morning Halaqah">Morning Halaqah (Sabqi - 07:30 AM)</option>
              <option value="Afternoon Halaqah">Afternoon Halaqah (Sabq Para - 02:00 PM)</option>
              <option value="Evening Muraja'ah">Evening Muraja’ah (Revision - 05:00 PM)</option>
            </select>
          </div>

          <div className="flex items-center gap-3 pt-4 sm:pt-0 sm:justify-end text-xs">
            <span className="font-semibold text-emerald-700 dark:text-emerald-300">
              {counts.present} Present
            </span>
            <span>•</span>
            <span className="font-semibold text-amber-700 dark:text-amber-300">
              {counts.late} Late
            </span>
            <span>•</span>
            <span className="font-semibold text-blue-700 dark:text-blue-300">
              {counts.excused} Excused
            </span>
            <span>•</span>
            <span className="font-semibold text-rose-700 dark:text-rose-300">
              {counts.absent} Absent
            </span>
          </div>
        </div>

        {/* Student Attendance Checklist Table */}
        <div className="bg-card text-card-foreground rounded-xl border border-border shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-muted/60 border-b border-border font-semibold text-muted-foreground uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3 px-4">Talib (Student)</th>
                  <th className="py-3 px-4">Cohort</th>
                  <th className="py-3 px-4">Current Juz</th>
                  <th className="py-3 px-4">Status Today</th>
                  <th className="py-3 px-4 text-right">Quick Mark</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {MOCK_STUDENTS.map((st) => {
                  const currentStatus = attendanceState[st.id] || "present";
                  return (
                    <tr key={st.id} className="hover:bg-muted/30 transition">
                      <td className="py-3 px-4 font-bold text-foreground">
                        {st.fullName}
                        <span className="font-mono text-[11px] text-muted-foreground block font-normal">
                          {st.admissionNumber}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            st.category === "A"
                              ? "bg-[#174D3A] text-white"
                              : "bg-[#C6A45A] text-[#103729]"
                          }`}
                        >
                          Category {st.category}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-semibold text-muted-foreground">
                        Juz {st.currentJuz}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-0.5 rounded text-[11px] font-semibold uppercase ${
                            currentStatus === "present"
                              ? "bg-emerald-500/10 text-emerald-800 dark:text-emerald-300"
                              : currentStatus === "late"
                              ? "bg-amber-500/10 text-amber-800 dark:text-amber-300"
                              : currentStatus === "excused"
                              ? "bg-blue-500/10 text-blue-800 dark:text-blue-300"
                              : "bg-rose-500/10 text-rose-800 dark:text-rose-300"
                          }`}
                        >
                          {currentStatus}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="inline-flex gap-1">
                          <button
                            type="button"
                            onClick={() => setStatus(st.id, "present")}
                            className={`px-2 py-1 rounded text-[10px] font-semibold transition ${
                              currentStatus === "present"
                                ? "bg-emerald-600 text-white"
                                : "bg-muted text-foreground hover:bg-muted/80"
                            }`}
                          >
                            Present
                          </button>
                          <button
                            type="button"
                            onClick={() => setStatus(st.id, "late")}
                            className={`px-2 py-1 rounded text-[10px] font-semibold transition ${
                              currentStatus === "late"
                                ? "bg-amber-600 text-white"
                                : "bg-muted text-foreground hover:bg-muted/80"
                            }`}
                          >
                            Late
                          </button>
                          <button
                            type="button"
                            onClick={() => setStatus(st.id, "excused")}
                            className={`px-2 py-1 rounded text-[10px] font-semibold transition ${
                              currentStatus === "excused"
                                ? "bg-blue-600 text-white"
                                : "bg-muted text-foreground hover:bg-muted/80"
                            }`}
                          >
                            Excused
                          </button>
                          <button
                            type="button"
                            onClick={() => setStatus(st.id, "absent")}
                            className={`px-2 py-1 rounded text-[10px] font-semibold transition ${
                              currentStatus === "absent"
                                ? "bg-rose-600 text-white"
                                : "bg-muted text-foreground hover:bg-muted/80"
                            }`}
                          >
                            Absent
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
