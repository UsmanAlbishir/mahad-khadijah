"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, Printer } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { SchoolHeaderLogo } from "@/components/layout/school-header-logo";
import { MOCK_MONTHLY_REPORTS, MOCK_WEEKLY_REPORTS } from "@/lib/reporting-data";

export default function ReportDetailPage() {
  return (
    <Suspense
      fallback={
        <div className="rounded-xl border border-border bg-card p-8 text-center">
          Loading report...
        </div>
      }
    >
      <ReportDetailContent />
    </Suspense>
  );
}

function ReportDetailContent() {
  const params = useParams<{ type: string; id: string }>();
  const monthly = params.type === "monthly";
  const report = monthly
    ? MOCK_MONTHLY_REPORTS.find((item) => item.id === params.id)
    : MOCK_WEEKLY_REPORTS.find((item) => item.id === params.id);
  const backHref = monthly ? "/reports/monthly" : "/reports/weekly";

  if (!report) {
    return <AppShell><div className="rounded-xl border border-border bg-card p-8 text-center"><h2 className="text-xl font-bold">Report not found</h2><Link className="mt-3 inline-block text-sm font-semibold text-[#9B4123]" href={backHref}>Return to reports</Link></div></AppShell>;
  }

  const isMonthlyReport = "month" in report;
  const period = isMonthlyReport ? "Month " + report.month + " (Weeks " + report.weeks[0] + "–" + report.weeks.at(-1) + ")" : "Week " + report.week;

  return (
    <AppShell>
      <div className="space-y-5">
        <div className="flex items-center justify-between print:hidden"><Link href={backHref} className="inline-flex items-center gap-2 text-sm font-semibold text-[#9B4123] hover:text-[#E84F12]"><ArrowLeft className="size-4" />Back to reports</Link><button onClick={() => window.print()} className="inline-flex items-center gap-2 rounded-lg bg-[#452D24] px-4 py-2 text-xs font-semibold text-white hover:bg-[#37231C]"><Printer className="size-4" />Print preview</button></div>
        <article className="report-print-view rounded-xl border border-border bg-card p-6 shadow-xs sm:p-8">
          <header className="flex flex-col gap-5 border-b border-border pb-6 sm:flex-row sm:items-center sm:justify-between"><SchoolHeaderLogo href="/reports" variant="light" /><div className="text-left sm:text-right"><p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#E84F12]">Prototype academic report</p><h1 className="mt-1 text-xl font-extrabold">School-wide reporting detail</h1><p className="mt-1 text-xs text-muted-foreground">Prepared: {report.preparedDate ?? "Not yet prepared"}</p></div></header>
          <div className="mt-6 grid gap-6 lg:grid-cols-2"><section><h2 className="text-sm font-bold text-[#9B4123]">Student information</h2><dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-3 text-sm"><Detail label="Full name" value={report.studentName} /><Detail label="Admission number" value={report.admissionNumber} /><Detail label="Category" value={"Category " + report.category} /><Detail label="Assigned teacher" value={report.teacherName} /></dl></section><section><h2 className="text-sm font-bold text-[#9B4123]">Academic information</h2><dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-3 text-sm"><Detail label="Session" value={report.session} /><Detail label="Term" value={report.term} /><Detail label="Reporting period" value={period} /><Detail label="Status" value={report.status} /></dl></section></div>
          <section className="mt-7 rounded-xl border border-[#E84F12]/20 bg-[#E84F12]/5 p-5"><h2 className="text-sm font-bold text-[#9B4123]">Performance information</h2><div className="mt-4 grid gap-4 sm:grid-cols-4"><Performance label="Total" value={report.total ?? "—"} /><Performance label="Average" value={report.average ?? "—"} /><Performance label="Musafa score" value={isMonthlyReport ? "See five-week breakdown" : report.musafaScore ?? "—"} /><Performance label="Grade" value={report.grade ?? "—"} /></div><div className="mt-5 border-t border-[#E84F12]/15 pt-4"><p className="text-xs font-semibold text-[#9B4123]">Teacher remarks</p><p className="mt-1 text-sm leading-relaxed text-foreground">{report.remarks}</p></div></section>
          {isMonthlyReport && <section className="mt-7"><h2 className="text-sm font-bold text-[#9B4123]">Five-week performance overview</h2><div className="mt-3 overflow-x-auto rounded-lg border border-border"><table className="w-full min-w-[680px] text-left text-xs"><thead className="bg-muted/60 uppercase tracking-wide text-muted-foreground"><tr>{["Week", "Total", "Average", "Musafa score", "Grade", "Remarks"].map((heading) => <th key={heading} className="px-3 py-2.5">{heading}</th>)}</tr></thead><tbody className="divide-y divide-border">{report.weekRecords.map((item) => <tr key={item.id}><td className="px-3 py-3 font-semibold">Week {item.week}</td><td className="px-3 py-3">{item.total ?? "—"}</td><td className="px-3 py-3">{item.average ?? "—"}</td><td className="px-3 py-3">{item.musafaScore ?? "—"}</td><td className="px-3 py-3 font-bold">{item.grade ?? "—"}</td><td className="px-3 py-3 text-muted-foreground">{item.remarks}</td></tr>)}</tbody></table></div></section>}
          <p className="mt-8 text-[11px] leading-relaxed text-muted-foreground">This is a fictional frontend prototype. Values are illustrative and no report data is saved, approved, or transmitted.</p>
        </article>
      </div>
    </AppShell>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return <div><dt className="text-[11px] text-muted-foreground">{label}</dt><dd className="mt-0.5 font-semibold text-foreground">{value}</dd></div>;
}

function Performance({ label, value }: { label: string; value: string | number }) {
  return <div className="rounded-lg bg-card p-3"><p className="text-[11px] text-muted-foreground">{label}</p><p className="mt-1 text-lg font-extrabold text-[#452D24]">{value}</p></div>;
}
