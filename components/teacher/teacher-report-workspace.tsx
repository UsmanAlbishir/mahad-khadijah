"use client";

import { useEffect, useMemo, useState } from "react";
import { Printer, Search, X } from "lucide-react";
import { MOCK_ACADEMIC_SESSIONS } from "@/lib/mock-data";
import { demoMemorisation, demoStudents, formatDate, localDateValue } from "@/components/teacher/teacher-demo-data";
import { DemoNotice, EmptyState, PageHeading, SectionTitle, StatusBadge } from "@/components/teacher/teacher-ui";

type ReportPeriod = "daily" | "weekly" | "monthly";

const titles: Record<ReportPeriod, string> = {
  daily: "Daily reports",
  weekly: "Weekly reports",
  monthly: "Monthly reports",
};

export function TeacherReportWorkspace({ period }: { period: ReportPeriod }) {
  const [sessionId, setSessionId] = useState(MOCK_ACADEMIC_SESSIONS.find((item) => item.isCurrent)?.id ?? "");
  const [date, setDate] = useState("");
  const [studentId, setStudentId] = useState("all");
  const [category, setCategory] = useState("all");
  const [selectedWeek, setSelectedWeek] = useState(1);
  const [selectedMonth, setSelectedMonth] = useState("");
  const [search, setSearch] = useState("");
  const [remarks, setRemarks] = useState<Record<string, string>>({});
  const [feedback, setFeedback] = useState("");
  const [detailStudentId, setDetailStudentId] = useState<string | null>(null);

  const session = MOCK_ACADEMIC_SESSIONS.find((item) => item.id === sessionId);
  const filteredStudents = useMemo(() => demoStudents.filter((student) =>
    (studentId === "all" || student.id === studentId) &&
    (category === "all" || student.category === category) &&
    (!search || `${student.fullName} ${student.admissionNumber}`.toLowerCase().includes(search.toLowerCase())),
  ), [category, search, studentId]);

  const dailyRows = filteredStudents.map((student) => ({
    student,
    activityCount: demoMemorisation.filter((record) => record.studentId === student.id && record.date === date).length,
  }));

  const reportStudent = detailStudentId ? demoStudents.find((item) => item.id === detailStudentId) : null;

  useEffect(() => {
    setDate(localDateValue());
  }, []);

  function saveRemarks() {
    setFeedback("Remarks are held only in this page's temporary state. No report has been saved or submitted.");
  }

  return (
    <div className="space-y-6">
      <PageHeading eyebrow="Academic reporting" title={titles[period]} description={period === "daily" ? "Review daily memorisation activity without treating missing activity as a zero score." : period === "weekly" ? "Review the term's 15 reporting weeks. Actual date ranges come from the academic calendar." : "Monthly summaries follow the months configured for the selected academic term."} action={<button type="button" onClick={() => window.print()} className="inline-flex h-10 items-center gap-2 border border-border bg-card px-3 text-sm font-medium hover:bg-muted"><Printer className="size-4" />Print view</button>} />
      <DemoNotice>Reports use sample student and memorisation records only. Numeric totals/averages, report status, teacher identity, and submitted history require backend contracts. Remarks entered below are page-local drafts only.</DemoNotice>

      <section className="grid gap-3 border border-border bg-card p-4 sm:grid-cols-2 xl:grid-cols-4">
        <label className="text-xs font-medium">Academic session<select value={sessionId} onChange={(event) => setSessionId(event.target.value)} className="mt-1.5 h-10 w-full border border-input bg-background px-3 text-sm">{MOCK_ACADEMIC_SESSIONS.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select></label>
        <label className="text-xs font-medium">Academic term<input readOnly value={session?.currentTerm ?? "Not configured"} className="mt-1.5 h-10 w-full border border-input bg-muted/40 px-3 text-sm" /></label>
        {period === "daily" && <label className="text-xs font-medium">Reporting date<input type="date" value={date} onChange={(event) => setDate(event.target.value)} className="mt-1.5 h-10 w-full border border-input bg-background px-3 text-sm" /></label>}
        {period === "weekly" && <div className="text-xs font-medium">Selected week<div className="mt-1.5 flex h-10 items-center border border-input bg-muted/40 px-3 text-sm">Week {selectedWeek} · date range not configured</div></div>}
        {period === "monthly" && <label className="text-xs font-medium">Academic-term month<select value={selectedMonth} onChange={(event) => setSelectedMonth(event.target.value)} disabled className="mt-1.5 h-10 w-full border border-input bg-muted/40 px-3 text-sm disabled:cursor-not-allowed"><option value="">Months not configured</option></select></label>}
        <label className="text-xs font-medium">Student<select value={studentId} onChange={(event) => setStudentId(event.target.value)} className="mt-1.5 h-10 w-full border border-input bg-background px-3 text-sm"><option value="all">All demo students</option>{demoStudents.map((student) => <option key={student.id} value={student.id}>{student.fullName}</option>)}</select></label>
        <label className="text-xs font-medium">Category<select value={category} onChange={(event) => setCategory(event.target.value)} className="mt-1.5 h-10 w-full border border-input bg-background px-3 text-sm"><option value="all">All categories</option><option value="A">Category A</option><option value="B">Category B</option></select></label>
      </section>

      {period === "weekly" && <section aria-label="15 term weeks" className="border border-border bg-card p-4"><SectionTitle title="Term weeks" detail="Exactly 15 selectable reporting weeks" /><div className="grid grid-cols-3 gap-2 sm:grid-cols-5">{Array.from({ length: 15 }, (_, index) => index + 1).map((week) => <button key={week} type="button" aria-pressed={selectedWeek === week} onClick={() => setSelectedWeek(week)} className={`min-h-10 border px-2 text-xs font-medium transition-colors ${selectedWeek === week ? "border-primary bg-primary text-primary-foreground" : "border-border hover:bg-muted"}`}>Week {week}</button>)}</div></section>}

      {period === "monthly" && <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">{["Students reported", "Average performance", "Weekly reports complete", "Outstanding reports"].map((label) => <div key={label} className="border border-border bg-card p-4"><p className="text-xs text-muted-foreground">{label}</p><p className="mt-3 text-xl font-semibold">—</p><p className="mt-1 text-[11px] text-muted-foreground">Requires configured report data</p></div>)}</section>}

      <section className="border border-border bg-card">
        <div className="flex flex-col gap-3 border-b border-border p-4 sm:flex-row sm:items-center sm:justify-between">
          <div><h3 className="text-sm font-semibold">{period === "daily" ? `Students · ${formatDate(date)}` : period === "weekly" ? `Week ${selectedWeek} report` : "Monthly report"}</h3><p className="mt-1 text-xs text-muted-foreground">Total and average remain blank until the school confirms the scoring formula.</p></div>
          <label className="relative block sm:w-64"><span className="sr-only">Search student reports</span><Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search student" className="h-9 w-full border border-input bg-background pl-9 pr-3 text-xs" /></label>
        </div>

        {period === "monthly" ? <EmptyState title="Term months are not configured">Connect the academic-term month list before monthly reports can be generated. This view does not assume a fixed month count.</EmptyState> : filteredStudents.length ? <div className="overflow-x-auto"><table className="w-full min-w-[980px] text-left text-sm"><thead className="bg-muted/50 text-[11px] font-semibold uppercase text-muted-foreground"><tr><th className="px-4 py-3">Student</th><th className="px-4 py-3">{period === "daily" ? "Date / activity" : "Week"}</th><th className="px-4 py-3">Total</th><th className="px-4 py-3">Average</th><th className="min-w-[220px] px-4 py-3">Remarks</th><th className="px-4 py-3">Status</th><th className="px-4 py-3 text-right">Actions</th></tr></thead><tbody className="divide-y divide-border">{(period === "daily" ? dailyRows : filteredStudents.map((student) => ({ student, activityCount: 0 }))).map(({ student, activityCount }) => {
          const remarkKey = `${period}-${period === "daily" ? date : selectedWeek}-${student.id}`;
          const hasActivity = period === "daily" && activityCount > 0;
          return <tr key={student.id} className="align-top"><td className="px-4 py-3"><span className="font-medium">{student.fullName}</span><span className="mt-1 block text-xs text-muted-foreground">{student.admissionNumber} · Category {student.category}</span></td><td className="px-4 py-3">{period === "daily" ? <><span>{formatDate(date)}</span><span className="mt-1 block text-xs text-muted-foreground">{hasActivity ? `${activityCount} memorisation record(s)` : "No recorded activity; not a zero score"}</span></> : <><span>Week {selectedWeek}</span><span className="mt-1 block text-xs text-muted-foreground">Date range not configured</span></>}</td><td className="px-4 py-3 tabular-nums text-muted-foreground">—</td><td className="px-4 py-3 tabular-nums text-muted-foreground">—</td><td className="px-4 py-3"><label className="sr-only" htmlFor={`remark-${remarkKey}`}>Remarks for {student.fullName}</label><textarea id={`remark-${remarkKey}`} rows={2} maxLength={500} value={remarks[remarkKey] ?? ""} onChange={(event) => setRemarks((current) => ({ ...current, [remarkKey]: event.target.value }))} placeholder="Local draft remark" className="w-full min-w-[200px] resize-y border border-input bg-background px-2.5 py-2 text-xs" /></td><td className="px-4 py-3"><StatusBadge tone={remarks[remarkKey] ? "warning" : "neutral"}>{remarks[remarkKey] ? "In progress · local" : "Not started"}</StatusBadge></td><td className="px-4 py-3 text-right"><button type="button" onClick={() => setDetailStudentId(student.id)} className="h-8 border border-border px-3 text-xs font-medium hover:bg-muted">View</button></td></tr>;
        })}</tbody></table><div className="flex flex-wrap items-center justify-between gap-3 border-t border-border p-4"><p className="text-xs text-muted-foreground">{filteredStudents.length} students · no report submission service configured</p><button type="button" onClick={saveRemarks} className="h-9 bg-primary px-4 text-xs font-semibold text-primary-foreground hover:bg-primary/90">Save local remarks</button></div></div> : <EmptyState title="No students match the filters">Try another search or category selection.</EmptyState>}
      </section>

      {feedback && <p role="status" className="border border-[#452D24]/20 bg-[#452D24]/5 px-4 py-3 text-sm">{feedback}</p>}

      {reportStudent && <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" role="presentation" onClick={(event) => { if (event.target === event.currentTarget) setDetailStudentId(null); }}><section role="dialog" aria-modal="true" aria-labelledby="report-dialog-title" className="report-print-view max-h-[90vh] w-full max-w-xl overflow-y-auto border border-border bg-card p-5 shadow-xl sm:p-7"><div className="flex items-start justify-between gap-4"><div><p className="text-[11px] font-semibold uppercase text-[#9B4123]">Mahad Khadijah · demo report</p><h2 id="report-dialog-title" className="mt-1 text-lg font-semibold">{titles[period]}</h2></div><button type="button" onClick={() => setDetailStudentId(null)} aria-label="Close report details" className="print:hidden inline-flex size-9 items-center justify-center border border-border hover:bg-muted"><X className="size-4" /></button></div><dl className="mt-6 grid grid-cols-2 gap-4 text-sm"><Detail label="Student" value={reportStudent.fullName} /><Detail label="Admission number" value={reportStudent.admissionNumber} /><Detail label="Teacher" value="Requires authenticated backend profile" /><Detail label="Academic session" value={session?.name ?? "Not configured"} /><Detail label="Academic term" value={session?.currentTerm ?? "Not configured"} /><Detail label="Reporting period" value={period === "daily" ? formatDate(date) : period === "weekly" ? `Week ${selectedWeek} · dates not configured` : "Month not configured"} /><Detail label="Total" value="Not calculated" /><Detail label="Average" value="Not calculated" /><Detail label="Remarks" value={remarks[`${period}-${period === "daily" ? date : selectedWeek}-${reportStudent.id}`] || "No remarks"} /><Detail label="Date prepared" value={formatDate(localDateValue())} /></dl><div className="mt-6 flex justify-end print:hidden"><button type="button" onClick={() => window.print()} className="inline-flex h-9 items-center gap-2 border border-border px-3 text-xs font-semibold hover:bg-muted"><Printer className="size-3.5" />Print report</button></div></section></div>}
    </div>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return <div><dt className="text-[11px] text-muted-foreground">{label}</dt><dd className="mt-1 break-words font-medium">{value}</dd></div>;
}



// mtnbroadband.ng  admin