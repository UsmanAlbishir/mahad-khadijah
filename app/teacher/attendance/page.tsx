"use client";

import { useEffect, useMemo, useState } from "react";
import { CalendarCheck2, Check, Save, Undo2 } from "lucide-react";
import { demoAttendance, demoStudents, localDateValue } from "@/components/teacher/teacher-demo-data";
import { DemoNotice, EmptyState, PageHeading, StatusBadge } from "@/components/teacher/teacher-ui";

type AttendanceStatus = "present" | "absent" | "late" | "excused";
type AttendanceDraft = Record<string, { status: AttendanceStatus | ""; remarks: string }>;
const statuses: AttendanceStatus[] = ["present", "absent", "late", "excused"];
const activeStudents = demoStudents.filter((student) => student.status === "active");

function makeDraft(date: string): AttendanceDraft {
  return Object.fromEntries(activeStudents.map((student) => {
    const record = demoAttendance.find((item) => item.studentId === student.id && item.date === date);
    return [student.id, { status: record?.status ?? "", remarks: record?.remarks ?? "" }];
  }));
}

export default function TeacherAttendancePage() {
  const [date, setDate] = useState("");
  const [draft, setDraft] = useState<AttendanceDraft>(() => makeDraft(""));
  const [notice, setNotice] = useState("");
  const [savedSnapshot, setSavedSnapshot] = useState(() => JSON.stringify(makeDraft("")));

  useEffect(() => {
    const today = localDateValue();
    const todayDraft = makeDraft(today);
    setDate(today);
    setDraft(todayDraft);
    setSavedSnapshot(JSON.stringify(todayDraft));
  }, []);
  const isDirty = JSON.stringify(draft) !== savedSnapshot;
  const counts = useMemo(() => Object.values(draft).reduce((total, item) => {
    if (item.status) total[item.status] += 1;
    return total;
  }, { present: 0, absent: 0, late: 0, excused: 0 }), [draft]);

  function changeDate(nextDate: string) {
    if (!nextDate) return;
    if (isDirty && !window.confirm("Discard the unsaved attendance draft?")) return;
    const nextDraft = makeDraft(nextDate);
    setDate(nextDate);
    setDraft(nextDraft);
    setSavedSnapshot(JSON.stringify(nextDraft));
    setNotice("");
  }

  function validateDraft() {
    if (!date || Number.isNaN(Date.parse(date))) {
      setNotice("Choose a valid attendance date before continuing.");
      return;
    }
    const unmarked = activeStudents.filter((student) => !draft[student.id]?.status);
    if (unmarked.length) {
      setNotice(`${unmarked.length} students still need an attendance status.`);
      return;
    }
    setSavedSnapshot(JSON.stringify(draft));
    setNotice("Draft is complete. It has not been submitted or saved to a database.");
  }

  function discardDraft() {
    if (!window.confirm("Discard all unsaved attendance changes?")) return;
    const initial = makeDraft(date);
    setDraft(initial);
    setSavedSnapshot(JSON.stringify(initial));
    setNotice("Unsaved changes were discarded.");
  }

  return (
    <div className="space-y-6">
      <PageHeading eyebrow="Class records" title="Attendance" description="Review the sample register or prepare an attendance draft for a selected date." action={<StatusBadge tone={isDirty ? "warning" : "neutral"}>{isDirty ? "Unsaved changes" : "Draft unchanged"}</StatusBadge>} />
      <DemoNotice>Attendance records are sample-only. The form validates a local draft; duplicate protection and persistence must be enforced by the backend before this can be used as an official register.</DemoNotice>

      <section className="grid gap-4 border border-border bg-card p-4 sm:grid-cols-[minmax(180px,240px)_1fr] sm:items-end">
        <label className="block text-xs font-medium">Attendance date<input type="date" value={date} onChange={(event) => changeDate(event.target.value)} className="mt-1.5 h-10 w-full border border-input bg-background px-3 text-sm" required /></label>
        <div className="flex flex-wrap gap-2 sm:justify-end">
          {statuses.map((status) => <div key={status} className="min-w-[78px] border border-border px-3 py-2"><p className="text-[10px] capitalize text-muted-foreground">{status}</p><p className="mt-0.5 text-lg font-semibold tabular-nums">{counts[status]}</p></div>)}
        </div>
      </section>

      {notice && <p role="status" className={`border px-4 py-3 text-sm ${notice.includes("need") || notice.includes("valid") ? "border-rose-300 bg-rose-50 text-rose-900 dark:bg-rose-950 dark:text-rose-100" : "border-[#452D24]/20 bg-[#452D24]/5 text-foreground"}`}>{notice}</p>}

      <section className="border border-border bg-card">
        {!demoStudents.length ? <EmptyState title="No students available">Assigned student records will appear after the backend integration is connected.</EmptyState> : <>
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border p-4">
            <div><h3 className="text-sm font-semibold">Student register</h3><p className="mt-1 text-xs text-muted-foreground">{demoStudents.length} demo roster entries · no group assignments configured</p></div>
            <div className="flex gap-2">
              <button type="button" onClick={() => setDraft(Object.fromEntries(demoStudents.map((student) => [student.id, { ...draft[student.id], status: "present" as const }] )))} className="inline-flex h-9 items-center gap-2 border border-border px-3 text-xs font-semibold hover:bg-muted"><Check className="size-3.5" />Mark all present</button>
              <button type="button" onClick={discardDraft} disabled={!isDirty} className="inline-flex h-9 items-center gap-2 border border-border px-3 text-xs font-semibold hover:bg-muted disabled:opacity-40"><Undo2 className="size-3.5" />Discard</button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead className="bg-muted/50 text-[11px] font-semibold uppercase text-muted-foreground"><tr><th className="px-4 py-3">Student</th><th className="px-4 py-3">Admission no.</th><th className="px-4 py-3">Status</th><th className="px-4 py-3">Remarks</th></tr></thead>
              <tbody className="divide-y divide-border">
                {activeStudents.map((student) => <tr key={student.id}>
                  <td className="px-4 py-3 font-medium">{student.fullName}<span className="mt-0.5 block text-xs text-muted-foreground">Category {student.category}</span></td>
                  <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{student.admissionNumber}</td>
                  <td className="px-4 py-3"><label className="sr-only" htmlFor={`status-${student.id}`}>Attendance status for {student.fullName}</label><select id={`status-${student.id}`} value={draft[student.id]?.status ?? ""} onChange={(event) => setDraft((current) => ({ ...current, [student.id]: { ...current[student.id], status: event.target.value as AttendanceStatus | "" } }))} className="h-9 min-w-[130px] border border-input bg-background px-2 text-xs"><option value="">Unmarked</option>{statuses.map((status) => <option key={status} value={status}>{status[0].toUpperCase()}{status.slice(1)}</option>)}</select></td>
                  <td className="px-4 py-3"><label className="sr-only" htmlFor={`remark-${student.id}`}>Attendance remarks for {student.fullName}</label><input id={`remark-${student.id}`} value={draft[student.id]?.remarks ?? ""} onChange={(event) => setDraft((current) => ({ ...current, [student.id]: { ...current[student.id], remarks: event.target.value } }))} placeholder="Optional remark" className="h-9 w-full min-w-[190px] border border-input bg-background px-2.5 text-xs" /></td>
                </tr>)}
              </tbody>
            </table>
          </div>
          <div className="flex justify-end border-t border-border p-4"><button type="button" onClick={validateDraft} className="inline-flex h-10 items-center gap-2 bg-primary px-4 text-sm font-semibold text-primary-foreground hover:bg-primary/90"><Save className="size-4" />Validate draft</button></div>
        </>}
      </section>
      <p className="flex items-center gap-2 text-xs text-muted-foreground"><CalendarCheck2 className="size-4" />Historical sample records exist only for their recorded dates. This form does not overwrite them.</p>
    </div>
  );
}