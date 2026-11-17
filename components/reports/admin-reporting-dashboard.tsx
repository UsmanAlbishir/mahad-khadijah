"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { BarChart3, Eye, FileDown, GraduationCap, Printer, Users } from "lucide-react";
import { MOCK_TEACHERS } from "@/lib/mock-data";
import {
  MOCK_MONTHLY_REPORTS,
  MOCK_WEEKLY_REPORTS,
  REPORT_MONTHS,
  REPORT_WEEKS,
  REPORTING_TEACHERS,
  type MonthlyReport,
  type ReportGrade,
  type ReportStatus,
  type WeeklyReport,
} from "@/lib/reporting-data";

type View = "overview" | "weekly" | "monthly" | "musafa" | "teachers";
type ReportRecord = WeeklyReport | MonthlyReport;

const statuses: Array<"all" | ReportStatus> = ["all", "Not Started", "In Progress", "Ready for Review", "Submitted"];
const grades: Array<"all" | ReportGrade> = ["all", "A", "B", "C", "D", "F"];

function StatusBadge({ status }: { status: ReportStatus }) {
  const styles: Record<ReportStatus, string> = {
    "Not Started": "bg-[#FAF7F4] text-[#9B4123] border-[#9B4123]/25",
    "In Progress": "bg-amber-50 text-amber-800 border-amber-200",
    "Ready for Review": "bg-blue-50 text-blue-800 border-blue-200",
    Submitted: "bg-[#E84F12]/10 text-[#9B4123] border-[#E84F12]/25",
  };
  return <span className={"inline-flex rounded-full border px-2 py-0.5 text-[10px] font-bold " + styles[status]}>{status}</span>;
}

function GradeBadge({ grade }: { grade: ReportGrade | null }) {
  if (!grade) return <span className="text-muted-foreground">—</span>;
  const styles: Record<ReportGrade, string> = {
    A: "bg-[#E84F12] text-white",
    B: "bg-[#C35A2F] text-white",
    C: "bg-[#9B4123] text-white",
    D: "bg-amber-600 text-white",
    F: "bg-[#B93832] text-white",
  };
  return <span className={"inline-flex size-6 items-center justify-center rounded-full text-xs font-bold " + styles[grade]}>{grade}</span>;
}

function MetricCard({ label, value, detail }: { label: string; value: string | number; detail: string }) {
  return (
    <div className="rounded-xl border border-border bg-card p-4 shadow-xs">
      <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="mt-2 text-2xl font-extrabold tracking-tight text-[#452D24] dark:text-white">{value}</p>
      <p className="mt-1 text-xs text-muted-foreground">{detail}</p>
    </div>
  );
}

function FilterBar({
  search,
  onSearch,
  category,
  onCategory,
  teacher,
  onTeacher,
  status,
  onStatus,
  grade,
  onGrade,
  showGrade = true,
}: {
  search: string;
  onSearch: (value: string) => void;
  category: string;
  onCategory: (value: string) => void;
  teacher: string;
  onTeacher: (value: string) => void;
  status: string;
  onStatus: (value: string) => void;
  grade: string;
  onGrade: (value: string) => void;
  showGrade?: boolean;
}) {
  return (
    <div className="grid gap-3 rounded-xl border border-border bg-card p-4 shadow-xs md:grid-cols-2 xl:grid-cols-5">
      <input value={search} onChange={(event) => onSearch(event.target.value)} placeholder="Search student or admission no." className="h-10 rounded-lg border border-input bg-background px-3 text-sm outline-none ring-ring focus:ring-2 xl:col-span-2" />
      <select value={teacher} onChange={(event) => onTeacher(event.target.value)} className="h-10 rounded-lg border border-input bg-background px-3 text-sm">
        <option value="all">All teachers</option>
        {MOCK_TEACHERS.map((item) => <option key={item.id} value={item.id}>{item.fullName}</option>)}
      </select>
      <select value={category} onChange={(event) => onCategory(event.target.value)} className="h-10 rounded-lg border border-input bg-background px-3 text-sm">
        <option value="all">All categories</option><option value="A">Category A</option><option value="B">Category B</option>
      </select>
      <select value={status} onChange={(event) => onStatus(event.target.value)} className="h-10 rounded-lg border border-input bg-background px-3 text-sm">
        {statuses.map((item) => <option key={item} value={item}>{item === "all" ? "All statuses" : item}</option>)}
      </select>
      {showGrade && <select value={grade} onChange={(event) => onGrade(event.target.value)} className="h-10 rounded-lg border border-input bg-background px-3 text-sm">
        {grades.map((item) => <option key={item} value={item}>{item === "all" ? "All grades" : "Grade " + item}</option>)}
      </select>}
    </div>
  );
}

function ReportTable({ reports, view }: { reports: ReportRecord[]; view: "weekly" | "monthly" | "overview" }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-border bg-card shadow-xs">
      <table className="w-full min-w-[1050px] text-left text-xs">
        <thead className="bg-muted/60 text-[10px] uppercase tracking-wide text-muted-foreground">
          <tr>{["Student", "Admission No.", "Teacher", "Category", view === "monthly" ? "Month" : "Week", "Total", "Average", "Musafa", "Grade", "Remarks", "Status", "Actions"].map((heading) => <th key={heading} className="px-4 py-3 font-semibold">{heading}</th>)}</tr>
        </thead>
        <tbody className="divide-y divide-border">
          {reports.map((report) => {
            const period = "month" in report ? "Month " + report.month : "Week " + report.week;
            const href = "/reports/" + ("month" in report ? "monthly" : "weekly") + "/" + report.id;
            return <tr key={report.id} className="hover:bg-muted/30">
              <td className="px-4 py-3 font-semibold text-foreground">{report.studentName}</td>
              <td className="px-4 py-3 font-mono text-muted-foreground">{report.admissionNumber}</td>
              <td className="px-4 py-3">{report.teacherName}</td>
              <td className="px-4 py-3">Category {report.category}</td>
              <td className="px-4 py-3">{period}</td>
              <td className="px-4 py-3">{report.total ?? "—"}</td>
              <td className="px-4 py-3 font-bold">{report.average ?? "—"}</td>
              <td className="px-4 py-3">{"musafaScore" in report ? report.musafaScore ?? "—" : "See breakdown"}</td>
              <td className="px-4 py-3"><GradeBadge grade={report.grade} /></td>
              <td className="max-w-[220px] px-4 py-3 text-muted-foreground">{report.remarks}</td>
              <td className="px-4 py-3"><StatusBadge status={report.status} /></td>
              <td className="px-4 py-3"><Link href={href} className="inline-flex items-center gap-1 font-semibold text-[#9B4123] hover:text-[#E84F12]"><Eye className="size-3.5" />View</Link></td>
            </tr>;
          })}
          {!reports.length && <tr><td colSpan={12} className="px-4 py-12 text-center text-muted-foreground">No demonstration reports match the selected filters.</td></tr>}
        </tbody>
      </table>
    </div>
  );
}

export function AdminReportingDashboard({ view }: { view: View }) {
  const [week, setWeek] = useState(7);
  const [month, setMonth] = useState(1);
  const [search, setSearch] = useState("");
  const [teacher, setTeacher] = useState("all");
  const [category, setCategory] = useState("all");
  const [status, setStatus] = useState("all");
  const [grade, setGrade] = useState("all");
  const [page, setPage] = useState(1);

  const records = view === "monthly" ? MOCK_MONTHLY_REPORTS : MOCK_WEEKLY_REPORTS;
  const periodRecords = useMemo(() => records.filter((record) => view === "monthly" ? ("month" in record && record.month === month) : ("week" in record && record.week === week)), [records, view, week, month]);
  const filtered = useMemo(() => periodRecords.filter((record) => {
    const matchingSearch = (record.studentName + " " + record.admissionNumber).toLowerCase().includes(search.toLowerCase());
    return matchingSearch && (teacher === "all" || record.teacherId === teacher) && (category === "all" || record.category === category) && (status === "all" || record.status === status) && (grade === "all" || record.grade === grade);
  }), [periodRecords, search, teacher, category, status, grade]);
  const assessed = filtered.filter((record) => record.average !== null);
  const average = assessed.length ? Math.round(assessed.reduce((sum, record) => sum + (record.average ?? 0), 0) / assessed.length) : 0;
  const pending = filtered.filter((record) => record.status === "Not Started" || record.status === "In Progress").length;
  const attention = assessed.filter((record) => (record.average ?? 100) < 70).length;
  const paged = filtered.slice((page - 1) * 6, page * 6);

  const changeFilter = (setter: (value: string) => void) => (value: string) => { setter(value); setPage(1); };

  if (view === "teachers") {
    return <TeacherReports />;
  }

  if (view === "musafa") {
    return <MusafaReports />;
  }

  return (
    <div className="space-y-6">
      <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div><p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#E84F12]">Administrator reporting</p><h2 className="mt-1 text-2xl font-extrabold tracking-tight text-foreground">{view === "monthly" ? "Monthly Reports" : view === "weekly" ? "Weekly Reports" : "Reports & Analytics"}</h2><p className="mt-1 max-w-2xl text-sm text-muted-foreground">Fictional prototype data for school-wide visibility. Totals and averages are illustrative until academic formulas are confirmed.</p></div>
        <div className="flex gap-2"><button onClick={() => window.print()} className="inline-flex h-10 items-center gap-2 rounded-lg border border-input bg-card px-3 text-xs font-semibold"><Printer className="size-4" />Print</button><button className="inline-flex h-10 items-center gap-2 rounded-lg bg-[#452D24] px-3 text-xs font-semibold text-white hover:bg-[#37231C]"><FileDown className="size-4" />Export demo</button></div>
      </section>
      <ReportNavigation active={view} />

      {view === "weekly" && <div className="flex gap-2 overflow-x-auto pb-1">{REPORT_WEEKS.map((item) => <button key={item} onClick={() => { setWeek(item); setPage(1); }} className={"min-w-16 rounded-lg border px-3 py-2 text-xs font-bold " + (week === item ? "border-[#E84F12] bg-[#E84F12] text-white" : "border-border bg-card text-muted-foreground hover:border-[#E84F12]/50")}>Week {item}</button>)}</div>}
      {view === "monthly" && <div className="grid gap-3 md:grid-cols-3">{REPORT_MONTHS.map((item) => <button key={item.number} onClick={() => { setMonth(item.number); setPage(1); }} className={"rounded-xl border p-4 text-left " + (month === item.number ? "border-[#E84F12] bg-[#E84F12]/5 ring-1 ring-[#E84F12]/20" : "border-border bg-card")}><p className="font-bold">Month {item.number}</p><p className="mt-1 text-xs text-muted-foreground">Weeks {item.weeks[0]}–{item.weeks.at(-1)}</p></button>)}</div>}

      <FilterBar search={search} onSearch={changeFilter(setSearch)} teacher={teacher} onTeacher={changeFilter(setTeacher)} category={category} onCategory={changeFilter(setCategory)} status={status} onStatus={changeFilter(setStatus)} grade={grade} onGrade={changeFilter(setGrade)} />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-6">
        <MetricCard label="Total students" value={filtered.length} detail="Matching selected filters" />
        <MetricCard label="Completed" value={filtered.filter((report) => report.status === "Submitted").length} detail="Submitted reports" />
        <MetricCard label="Pending" value={pending} detail="Not started or in progress" />
        <MetricCard label="Attention" value={attention} detail="Average below 70" />
        <MetricCard label="Average" value={average || "—"} detail="Assessed records only" />
        <MetricCard label="Teachers" value={new Set(filtered.map((report) => report.teacherId)).size} detail="Reporting activity" />
      </div>

      {view === "overview" && <OverviewCards average={average} />}
      <section><div className="mb-3 flex items-center justify-between"><div><h3 className="text-base font-bold">Recent reports</h3><p className="text-xs text-muted-foreground">{view === "monthly" ? "Month " + month + " • Weeks " + REPORT_MONTHS[month - 1].weeks.join(", ") : "Week " + week + " school-wide reports"}</p></div><span className="text-xs text-muted-foreground">Page {page} of {Math.max(1, Math.ceil(filtered.length / 6))}</span></div><ReportTable reports={paged} view={view} /></section>
      {filtered.length > 6 && <div className="flex justify-end gap-2"><button disabled={page === 1} onClick={() => setPage(page - 1)} className="rounded-md border border-input px-3 py-1.5 text-xs disabled:opacity-40">Previous</button><button disabled={page * 6 >= filtered.length} onClick={() => setPage(page + 1)} className="rounded-md border border-input px-3 py-1.5 text-xs disabled:opacity-40">Next</button></div>}
    </div>
  );
}

function OverviewCards({ average }: { average: number }) {
  return <div className="grid gap-4 lg:grid-cols-3"><div className="rounded-xl border border-border bg-card p-5 shadow-xs"><div className="flex items-center gap-2"><BarChart3 className="size-4 text-[#E84F12]" /><h3 className="font-bold">Completion overview</h3></div><div className="mt-5 h-2 overflow-hidden rounded-full bg-muted"><div className="h-full w-[70%] rounded-full bg-[#E84F12]" /></div><p className="mt-2 text-xs text-muted-foreground">Illustrative current-term report completion: 70%.</p></div><div className="rounded-xl border border-border bg-card p-5 shadow-xs"><div className="flex items-center gap-2"><GraduationCap className="size-4 text-[#E84F12]" /><h3 className="font-bold">Category performance</h3></div><p className="mt-5 text-3xl font-extrabold">{average || "—"}</p><p className="mt-1 text-xs text-muted-foreground">Selected-period average across assessed records.</p></div><div className="rounded-xl border border-border bg-card p-5 shadow-xs"><div className="flex items-center gap-2"><Users className="size-4 text-[#E84F12]" /><h3 className="font-bold">Submission activity</h3></div><p className="mt-5 text-sm font-semibold">Track outstanding teacher reports</p><Link href="/reports/teachers" className="mt-2 inline-block text-xs font-bold text-[#9B4123] hover:text-[#E84F12]">View teacher activity →</Link></div></div>;
}

function ReportNavigation({ active }: { active: View }) {
  const links: Array<{ label: string; href: string; key: View }> = [
    { label: "Overview", href: "/reports", key: "overview" },
    { label: "Weekly", href: "/reports/weekly", key: "weekly" },
    { label: "Monthly", href: "/reports/monthly", key: "monthly" },
    { label: "Musafa", href: "/reports/musafa", key: "musafa" },
    { label: "Teachers", href: "/reports/teachers", key: "teachers" },
  ];
  return <nav aria-label="Reporting pages" className="flex gap-2 overflow-x-auto border-b border-border pb-3">{links.map((link) => <Link key={link.key} href={link.href} className={"whitespace-nowrap rounded-md px-3 py-2 text-xs font-bold " + (active === link.key ? "bg-[#E84F12] text-white" : "text-muted-foreground hover:bg-muted hover:text-foreground")}>{link.label}</Link>)}</nav>;
}

function MusafaReports() {
  const [week, setWeek] = useState(7);
  const reports = MOCK_WEEKLY_REPORTS.filter((report) => report.week === week && report.musafaScore !== null);
  const average = Math.round(reports.reduce((sum, report) => sum + (report.musafaScore ?? 0), 0) / reports.length);
  return <div className="space-y-6"><section><p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#E84F12]">Review-only assessment records</p><h2 className="mt-1 text-2xl font-extrabold">Musafa Assessment Reports</h2><p className="mt-1 text-sm text-muted-foreground">Teacher-entered fictional records. Administrators can filter, compare, view history, and print.</p></section><div className="flex gap-2 overflow-x-auto pb-1">{REPORT_WEEKS.map((item) => <button key={item} onClick={() => setWeek(item)} className={"min-w-16 rounded-lg border px-3 py-2 text-xs font-bold " + (week === item ? "border-[#E84F12] bg-[#E84F12] text-white" : "border-border bg-card")}>Week {item}</button>)}</div><div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-6"><MetricCard label="Assessments" value={reports.length} detail="Selected week" /><MetricCard label="Average score" value={average} detail="Scores out of 100" />{(["A", "B", "C", "D"] as ReportGrade[]).map((grade) => <MetricCard key={grade} label={"Grade " + grade} value={reports.filter((report) => report.grade === grade).length} detail={grade === "A" ? "Excellent" : performanceLabel(grade)} />)}</div><div className="overflow-x-auto rounded-xl border border-border bg-card shadow-xs"><table className="w-full min-w-[850px] text-left text-xs"><thead className="bg-muted/60 text-[10px] uppercase tracking-wide text-muted-foreground"><tr>{["Student", "Admission No.", "Teacher", "Category", "Week", "Score", "Grade", "Performance", "Remarks"].map((heading) => <th key={heading} className="px-4 py-3">{heading}</th>)}</tr></thead><tbody className="divide-y divide-border">{reports.map((report) => <tr key={report.id}><td className="px-4 py-3 font-semibold">{report.studentName}</td><td className="px-4 py-3 font-mono">{report.admissionNumber}</td><td className="px-4 py-3">{report.teacherName}</td><td className="px-4 py-3">Category {report.category}</td><td className="px-4 py-3">Week {report.week}</td><td className="px-4 py-3 font-bold">{report.musafaScore}</td><td className="px-4 py-3"><GradeBadge grade={report.grade} /></td><td className="px-4 py-3">{report.performance}</td><td className="px-4 py-3 text-muted-foreground">{report.remarks}</td></tr>)}</tbody></table></div><p className="rounded-lg border border-[#E84F12]/20 bg-[#E84F12]/5 p-3 text-xs text-[#9B4123]">Grading scale: A 90–100, B 80–89, C 70–79, D 60–69, F 0–59.</p></div>;
}

function performanceLabel(grade: ReportGrade) {
  return { A: "Excellent", B: "Very Good", C: "Good", D: "Fair", F: "Needs Improvement" }[grade];
}

function TeacherReports() {
  return <div className="space-y-6"><section><p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#E84F12]">Academic reporting indicator</p><h2 className="mt-1 text-2xl font-extrabold">Teacher Performance Reports</h2><p className="mt-1 text-sm text-muted-foreground">Student averages are reporting indicators only and are not a definitive measure of teacher quality.</p></section><div className="overflow-x-auto rounded-xl border border-border bg-card shadow-xs"><table className="w-full min-w-[900px] text-left text-xs"><thead className="bg-muted/60 text-[10px] uppercase tracking-wide text-muted-foreground"><tr>{["Teacher", "Category", "Students", "Weekly reports", "Monthly reports", "Pending", "Average", "Last activity"].map((heading) => <th key={heading} className="px-4 py-3">{heading}</th>)}</tr></thead><tbody className="divide-y divide-border">{REPORTING_TEACHERS.map((teacher) => <tr key={teacher.id}><td className="px-4 py-3 font-semibold">{teacher.fullName}</td><td className="px-4 py-3">Category {teacher.assignedCategories.join(", ")}</td><td className="px-4 py-3">{teacher.assignedStudents}</td><td className="px-4 py-3">{teacher.weeklySubmitted}</td><td className="px-4 py-3">{teacher.monthlySubmitted}</td><td className="px-4 py-3">{teacher.pending}</td><td className="px-4 py-3 font-bold">{teacher.average}</td><td className="px-4 py-3 text-muted-foreground">{teacher.lastActivity}</td></tr>)}</tbody></table></div></div>;
}
