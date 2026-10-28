"use client";

import React, { useState } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { Plus, X } from "lucide-react";
import { MOCK_STUDENTS } from "@/lib/mock-data";
import { MockFeedback, MockFeedbackNotice } from "@/components/ui/mock-feedback";

export default function MemorisationPage() {
  const [selectedCohort, setSelectedCohort] = useState<"all" | "A" | "B">("all");
  const [showLogModal, setShowLogModal] = useState(false);
  const [feedback, setFeedback] = useState<MockFeedbackNotice | null>(null);

  const [newLog, setNewLog] = useState({
    studentId: "std-001",
    juzNumber: 19,
    surahStart: "Al-Furqan",
    ayahStart: 1,
    surahEnd: "Ash-Shu'ara",
    ayahEnd: 50,
    grade: "Mumtaz (Excellent)",
    teacherName: "Ustadh Dr. Abdullah Ibn Umar",
    notes: "Accurate recitation with solid adherence to Ahkam at-Tajweed.",
  });

  const handleRecordLog = (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback({
      type: "success",
      title: "Hifz Evaluation Logged (Mock Operation)",
      message: `Recorded evaluation for Juz ${newLog.juzNumber} (${newLog.grade}). Added to active session memory.`,
      meta: "In-memory test record • No database writes",
    });
    setShowLogModal(false);
  };

  const filteredStudents =
    selectedCohort === "all"
      ? MOCK_STUDENTS
      : MOCK_STUDENTS.filter((s) => s.category === selectedCohort);

  return (
    <AppShell>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-foreground font-serif">
              Qur’an Memorisation (Tahfiz Curricular Milestones)
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
              Monitor Sabqi (new memorisation), Sabq Para (recent revision), and Amokhta (past Juz retention).
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowLogModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#174D3A] text-white text-xs sm:text-sm font-bold hover:bg-[#103729] transition shadow-xs ring-1 ring-[#C6A45A]/30 shrink-0"
          >
            <Plus className="w-4 h-4 text-[#C6A45A]" />
            <span>Record Hifz Evaluation (Mock)</span>
          </button>
        </div>

        {feedback && (
          <MockFeedback notice={feedback} onClose={() => setFeedback(null)} />
        )}

        {/* Cohort Pace Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-card text-card-foreground rounded-xl border border-border p-5 shadow-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold px-2 py-0.5 rounded bg-[#174D3A] text-white">
                Category A Track
              </span>
              <span className="text-xs font-bold text-emerald-700 dark:text-emerald-300">
                1 Juz / Week Target
              </span>
            </div>
            <h3 className="text-base font-bold text-foreground">
              Accelerated Tahfiz Halaqah
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Designed for talaba with rapid retention capacity. Expected curriculum completion: 30 Juz over ~30 academic weeks.
            </p>
          </div>

          <div className="bg-card text-card-foreground rounded-xl border border-border p-5 shadow-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold px-2 py-0.5 rounded bg-[#C6A45A] text-[#103729]">
                Category B Track
              </span>
              <span className="text-xs font-bold text-amber-700 dark:text-amber-300">
                ½ Juz / Week Target
              </span>
            </div>
            <h3 className="text-base font-bold text-foreground">
              Standard Tahfiz Halaqah
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Balanced pace prioritizing meticulous Tajweed, correct phonetic articulation (Makharij), and lasting retention.
            </p>
          </div>
        </div>

        {/* Filter bar */}
        <div className="flex items-center justify-between bg-card p-4 rounded-xl border border-border text-xs">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-muted-foreground">Filter by Cohort:</span>
            <div className="inline-flex rounded-lg border border-border p-0.5 bg-muted/40">
              <button
                type="button"
                onClick={() => setSelectedCohort("all")}
                className={`px-3 py-1 rounded-md font-semibold transition ${
                  selectedCohort === "all" ? "bg-card text-foreground shadow-xs" : "text-muted-foreground"
                }`}
              >
                All ({MOCK_STUDENTS.length})
              </button>
              <button
                type="button"
                onClick={() => setSelectedCohort("A")}
                className={`px-3 py-1 rounded-md font-semibold transition ${
                  selectedCohort === "A" ? "bg-[#174D3A] text-white shadow-xs" : "text-muted-foreground"
                }`}
              >
                Category A (5)
              </button>
              <button
                type="button"
                onClick={() => setSelectedCohort("B")}
                className={`px-3 py-1 rounded-md font-semibold transition ${
                  selectedCohort === "B" ? "bg-[#C6A45A] text-[#103729] shadow-xs" : "text-muted-foreground"
                }`}
              >
                Category B (5)
              </button>
            </div>
          </div>
        </div>

        {/* Student Memorisation Progress Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredStudents.map((st) => (
            <div
              key={st.id}
              className="bg-card text-card-foreground rounded-xl border border-border p-4 shadow-xs space-y-3"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-bold text-sm text-foreground">{st.fullName}</h4>
                  <p className="font-mono text-[11px] text-muted-foreground">{st.admissionNumber}</p>
                </div>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                    st.category === "A" ? "bg-[#174D3A] text-white" : "bg-[#C6A45A] text-[#103729]"
                  }`}
                >
                  Cat {st.category}
                </span>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-semibold">
                  <span>Current Level:</span>
                  <span className="text-[#174D3A] dark:text-[#C6A45A]">Juz {st.currentJuz} / 30</span>
                </div>
                <div className="h-2.5 w-full bg-muted rounded-full overflow-hidden p-0.5 border border-border/40">
                  <div
                    className="h-full bg-gradient-to-r from-[#174D3A] to-[#237A52] rounded-full"
                    style={{ width: `${(st.currentJuz / 30) * 100}%` }}
                  />
                </div>
                <div className="flex justify-between text-[11px] text-muted-foreground">
                  <span>{st.totalHizbCompleted} Hizb Mastered</span>
                  <span>{Math.round((st.currentJuz / 30) * 100)}% Complete</span>
                </div>
              </div>

              <div className="pt-2 border-t border-border/60 flex items-center justify-between text-xs">
                <span className="text-muted-foreground text-[11px]">
                  {st.category === "A" ? "1 Juz / week target" : "½ Juz / week target"}
                </span>
                <a
                  href={`/students/${st.id}`}
                  className="text-xs font-semibold text-[#174D3A] dark:text-[#C6A45A] hover:underline"
                >
                  View Hifz Log
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Modal: Record Hifz Log */}
        {showLogModal && (
          <div
            role="dialog"
            aria-modal="true"
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in"
          >
            <div className="bg-card text-card-foreground border border-border rounded-xl shadow-2xl max-w-lg w-full p-6 space-y-4 relative">
              <button
                onClick={() => setShowLogModal(false)}
                className="absolute top-4 right-4 p-1 rounded-md text-muted-foreground hover:text-foreground"
              >
                <X className="w-5 h-5" />
              </button>

              <h3 className="text-base font-bold font-serif text-foreground">
                Record Memorisation Assessment (Mock)
              </h3>

              <form onSubmit={handleRecordLog} className="space-y-3 text-xs">
                <div>
                  <label className="font-semibold block mb-1">Student</label>
                  <select
                    value={newLog.studentId}
                    onChange={(e) => setNewLog({ ...newLog, studentId: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-background border border-border"
                  >
                    {MOCK_STUDENTS.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.fullName} ({s.admissionNumber}) - Juz {s.currentJuz}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold block mb-1">Juz Evaluated</label>
                    <input
                      type="number"
                      min={1}
                      max={30}
                      value={newLog.juzNumber}
                      onChange={(e) => setNewLog({ ...newLog, juzNumber: Number(e.target.value) })}
                      className="w-full px-3 py-2 rounded-lg bg-background border border-border"
                    />
                  </div>

                  <div>
                    <label className="font-semibold block mb-1">Grade Awarded</label>
                    <select
                      value={newLog.grade}
                      onChange={(e) => setNewLog({ ...newLog, grade: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-background border border-border"
                    >
                      <option value="Mumtaz (Excellent)">Mumtaz (Excellent)</option>
                      <option value="Jayyid Jiddan (Very Good)">Jayyid Jiddan (Very Good)</option>
                      <option value="Jayyid (Good)">Jayyid (Good)</option>
                      <option value="Maqbool (Fair)">Maqbool (Fair)</option>
                      <option value="Needs Revision">Needs Revision</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold block mb-1">Surah Start</label>
                    <input
                      type="text"
                      value={newLog.surahStart}
                      onChange={(e) => setNewLog({ ...newLog, surahStart: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-background border border-border"
                    />
                  </div>
                  <div>
                    <label className="font-semibold block mb-1">Surah End</label>
                    <input
                      type="text"
                      value={newLog.surahEnd}
                      onChange={(e) => setNewLog({ ...newLog, surahEnd: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-background border border-border"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-semibold block mb-1">Muhaffiz Observation / Tajweed Notes</label>
                  <textarea
                    rows={2}
                    value={newLog.notes}
                    onChange={(e) => setNewLog({ ...newLog, notes: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-background border border-border"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t border-border">
                  <button
                    type="button"
                    onClick={() => setShowLogModal(false)}
                    className="px-3 py-1.5 rounded-lg border border-border text-xs font-semibold hover:bg-muted"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 rounded-lg bg-[#174D3A] text-white text-xs font-semibold hover:bg-[#103729]"
                  >
                    Save Evaluation (Mock)
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
