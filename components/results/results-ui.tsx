"use client";

import Link from "next/link";
import { Printer } from "lucide-react";
import { SchoolHeaderLogo } from "@/components/layout/school-header-logo";
import {
  EXAM_COLUMNS,
  EXAMINATION_STUDENTS,
  RESULTS_SESSION,
  type ExaminationRecord,
  type ExaminationStudent,
} from "@/lib/results-data";

const green = "#174A36";

export function ResultsHeading({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow: string;
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.16em]" style={{ color: green }}>
          {eyebrow}
        </p>
        <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
          {title}
        </h1>
        <p className="mt-1 max-w-3xl text-sm leading-6 text-muted-foreground">{description}</p>
      </div>
      {action}
    </header>
  );
}

export function ResultsNotice({ children }: { children: React.ReactNode }) {
  return (
    <div className="border border-[#B58A36]/35 bg-[#B58A36]/10 px-4 py-3 text-xs leading-5 text-foreground">
      {children}
    </div>
  );
}

export function ResultsSummaryCards({
  items,
}: {
  items: Array<{ label: string; value: string | number; detail: string; icon: React.ComponentType<{ className?: string }> }>;
}) {
  return (
    <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5" aria-label="Results summary">
      {items.map(({ label, value, detail, icon: Icon }) => (
        <article key={label} className="border border-border bg-card p-4 shadow-xs">
          <div className="flex items-start justify-between gap-3">
            <p className="text-xs font-medium text-muted-foreground">{label}</p>
            <Icon className="size-4 shrink-0 text-[#174A36]" />
          </div>
          <p className="mt-4 text-2xl font-bold tabular-nums" style={{ color: green }}>{value}</p>
          <p className="mt-1 text-xs text-muted-foreground">{detail}</p>
        </article>
      ))}
    </section>
  );
}

export function ResultsSection({
  title,
  detail,
  children,
  action,
}: {
  title: string;
  detail?: string;
  children: React.ReactNode;
  action?: React.ReactNode;
}) {
  return (
    <section className="border border-border bg-card">
      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-border p-4 sm:p-5">
        <div>
          <h2 className="text-sm font-bold">{title}</h2>
          {detail && <p className="mt-1 text-xs text-muted-foreground">{detail}</p>}
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}

export function ActionLink({
  href,
  children,
  subtle = false,
}: {
  href: string;
  children: React.ReactNode;
  subtle?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`inline-flex min-h-9 items-center justify-center gap-1.5 border px-3 text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B58A36] ${
        subtle ? "border-border bg-card text-foreground hover:bg-muted" : "border-[#174A36] bg-[#174A36] text-white hover:bg-[#103827]"
      }`}
    >
      {children}
    </Link>
  );
}

export function PrintButton({ label = "Print" }: { label?: string }) {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="print:hidden inline-flex min-h-9 items-center justify-center gap-2 border border-border bg-card px-3 text-xs font-semibold hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B58A36]"
    >
      <Printer className="size-4" aria-hidden="true" />
      {label}
    </button>
  );
}

export function ResultStatusBadge({ status }: { status: string }) {
  const tone =
    status === "Prepared" || status === "PASS"
      ? "border-emerald-700/20 bg-emerald-50 text-emerald-800"
      : status === "FAIL"
        ? "border-red-700/20 bg-red-50 text-red-800"
        : "border-[#B58A36]/30 bg-[#B58A36]/10 text-[#6D511B]";
  return <span className={`inline-flex whitespace-nowrap border px-2 py-1 text-[10px] font-bold ${tone}`}>{status}</span>;
}

export function ExaminationResultTable({
  students,
  editable = false,
  scoresByStudent,
  onScoreChange,
}: {
  students: ExaminationStudent[];
  editable?: boolean;
  scoresByStudent?: Record<string, string[]>;
  onScoreChange?: (studentId: string, columnIndex: number, value: string) => void;
}) {
  return (
    <div className="max-w-full overflow-auto">
      <table className="w-full min-w-[1450px] border-collapse text-left text-[11px]">
        <thead className="sticky top-0 z-20 bg-[#174A36] text-white">
          <tr>
            {["SN", "NAMES", ...EXAM_COLUMNS, "TOTAL", "AVERAGE", "REMARK"].map((heading, index) => (
              <th
                key={heading}
                scope="col"
                className={`whitespace-nowrap border border-white/30 px-2 py-2 text-center font-bold ${
                  index === 0 ? "sticky left-0 z-30 w-10 bg-[#174A36]" :
                    index === 1 ? "sticky left-10 z-30 min-w-48 bg-[#174A36] text-left" : ""
                }`}
              >
                {heading}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {students.map((student, studentIndex) => (
            <tr key={student.id} className="odd:bg-card even:bg-muted/20">
              <td className="sticky left-0 z-10 border border-border bg-inherit px-2 py-1.5 text-center tabular-nums">
                {studentIndex + 1}
              </td>
              <th scope="row" className="sticky left-10 z-10 min-w-48 border border-border bg-inherit px-2 py-1.5 text-left font-semibold">
                {student.name}
              </th>
              {(scoresByStudent?.[student.id] ?? student.scores).map((score, columnIndex) => (
                <td key={`${student.id}-${columnIndex}`} className="border border-border p-0 text-center tabular-nums">
                  {editable ? (
                    <input
                      aria-label={`${student.name}, score ${columnIndex + 1}`}
                      inputMode="text"
                      maxLength={3}
                      value={score}
                      onChange={(event) => onScoreChange?.(student.id, columnIndex, event.target.value)}
                      className="h-8 w-12 bg-transparent text-center outline-none focus:bg-amber-50 focus:ring-2 focus:ring-inset focus:ring-[#B58A36]"
                    />
                  ) : (
                    <span className={score === "ABS" ? "font-semibold text-muted-foreground" : ""}>{score}</span>
                  )}
                </td>
              ))}
              <td className="border border-border px-2 py-1.5 text-center font-semibold tabular-nums">{student.total}</td>
              <td className="border border-border px-2 py-1.5 text-center font-semibold tabular-nums">{student.average}</td>
              <td className="border border-border px-2 py-1.5 text-center"><ResultStatusBadge status={student.remark} /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function ExaminationSheetPreview({
  record,
  backHref,
}: {
  record: ExaminationRecord;
  backHref: string;
}) {
  return (
    <div className="space-y-4">
      <div className="print:hidden flex flex-wrap items-center justify-between gap-2">
        <ActionLink href={backHref} subtle>Back to Examination Records</ActionLink>
        <div className="flex flex-wrap gap-2">
          <PrintButton label="Print" />
          <PrintButton label="Export PDF" />
        </div>
      </div>
      <article className="report-print-view results-print-view border border-border bg-white p-4 text-black shadow-xs sm:p-6">
        <header className="flex flex-col items-center border-b-2 border-black pb-3 text-center sm:flex-row sm:justify-between sm:text-left">
          <SchoolHeaderLogo href="/results" variant="light" className="print:!text-black" />
          <div className="mt-3 sm:mt-0 sm:text-right">
            <p className="text-[10px] font-semibold uppercase tracking-[0.15em]">{record.session}</p>
            <h2 className="mt-1 text-lg font-extrabold uppercase">End of Term Examination Record</h2>
            <p className="mt-1 text-xs">{record.title}</p>
          </div>
        </header>
        <div className="my-3 grid grid-cols-2 gap-2 text-xs sm:grid-cols-4">
          <PrintInfo label="Academic session" value={record.session} />
          <PrintInfo label="Term" value={record.term} />
          <PrintInfo label="Category" value={record.category} />
          <PrintInfo label="No. of sitting" value={String(record.sittings)} />
        </div>
        <ExaminationResultTable students={EXAMINATION_STUDENTS} />
        <footer className="mt-3 flex flex-wrap justify-between gap-2 border-t border-black pt-2 text-[10px]">
          <span>Ma&apos;had Khadijah Litahfizil Qur’an School · Demonstration record</span>
          <span>Page 1 of 1</span>
        </footer>
        <p className="mt-2 text-[10px] text-muted-foreground print:hidden">
          All names and results are fictional prototype data.
        </p>
      </article>
    </div>
  );
}

export function IndividualStudentResult({
  student,
  record,
  backHref,
}: {
  student: ExaminationStudent;
  record: ExaminationRecord;
  backHref: string;
}) {
  return (
    <div className="space-y-4">
      <div className="print:hidden flex flex-wrap items-center justify-between gap-2">
        <ActionLink href={backHref} subtle>Back to Examination Records</ActionLink>
        <PrintButton label="Print result" />
      </div>
      <article className="report-print-view results-print-view border border-border bg-card p-5 shadow-xs sm:p-8">
        <header className="flex flex-col gap-4 border-b border-border pb-5 sm:flex-row sm:items-center sm:justify-between">
          <SchoolHeaderLogo href="/teacher/results" variant="light" />
          <div className="sm:text-right">
            <p className="text-[10px] font-bold uppercase tracking-[0.14em]" style={{ color: green }}>Individual examination result</p>
            <h2 className="mt-1 text-lg font-bold">{record.title}</h2>
            <p className="mt-1 text-xs text-muted-foreground">{record.session} · {record.term}</p>
          </div>
        </header>
        <dl className="grid gap-4 py-5 text-sm sm:grid-cols-3">
          <PrintInfo label="Student name" value={student.name} />
          <PrintInfo label="Student number" value={student.studentNumber} />
          <PrintInfo label="Category" value={student.category} />
          <PrintInfo label="Academic session" value={record.session} />
          <PrintInfo label="Term" value={record.term} />
          <PrintInfo label="Examination title" value={record.title} />
        </dl>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px] border-collapse text-center text-xs">
            <thead className="bg-[#174A36] text-white"><tr>{["SN", "NAMES", ...EXAM_COLUMNS].map((heading) => <th key={heading} className="border border-white/30 px-2 py-2">{heading}</th>)}</tr></thead>
            <tbody><tr><td className="border border-border px-2 py-2">1</td><th className="border border-border px-2 py-2 text-left">{student.name}</th>{student.scores.map((score, index) => <td key={index} className="border border-border px-2 py-2">{score}</td>)}</tr></tbody>
          </table>
        </div>
        <dl className="mt-5 grid gap-3 sm:grid-cols-3">
          <PrintInfo label="Total" value={student.total} />
          <PrintInfo label="Average" value={student.average} />
          <div><dt className="text-xs text-muted-foreground">Remark</dt><dd className="mt-1"><ResultStatusBadge status={student.remark} /></dd></div>
        </dl>
        <p className="mt-6 border-t border-border pt-3 text-[10px] text-muted-foreground">
          Fictional demonstration result. Values are illustrative and are not calculated or saved.
        </p>
      </article>
    </div>
  );
}

export function PrintInfo({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground print:text-black">{label}</dt>
      <dd className="mt-0.5 font-semibold">{value}</dd>
    </div>
  );
}

export function ExaminationInfoFields({
  session,
  term,
  category,
  title,
  sittings,
  onSession,
  onTerm,
  onCategory,
  onTitle,
  onSittings,
}: {
  session: string;
  term: string;
  category: string;
  title: string;
  sittings: string;
  onSession: (value: string) => void;
  onTerm: (value: string) => void;
  onCategory: (value: string) => void;
  onTitle: (value: string) => void;
  onSittings: (value: string) => void;
}) {
  return (
    <section className="grid gap-3 border border-border bg-card p-4 sm:grid-cols-2 xl:grid-cols-5">
      <label className="text-xs font-semibold">Academic session
        <select value={session} onChange={(event) => onSession(event.target.value)} className="mt-1.5 h-10 w-full border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#B58A36]">
          {[RESULTS_SESSION, "2024/2025 Academic Session"].map((item) => <option key={item}>{item}</option>)}
        </select>
      </label>
      <label className="text-xs font-semibold">Term
        <select value={term} onChange={(event) => onTerm(event.target.value)} className="mt-1.5 h-10 w-full border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#B58A36]">
          {["First Term", "Second Term", "Third Term"].map((item) => <option key={item}>{item}</option>)}
        </select>
      </label>
      <label className="text-xs font-semibold">Category
        <select value={category} onChange={(event) => onCategory(event.target.value)} className="mt-1.5 h-10 w-full border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#B58A36]">
          {["AH", "A", "B", "C"].map((item) => <option key={item}>{item}</option>)}
        </select>
      </label>
      <label className="text-xs font-semibold">Examination title
        <select value={title} onChange={(event) => onTitle(event.target.value)} className="mt-1.5 h-10 w-full border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#B58A36]">
          {["End of Term Examination", "Mid-Term Assessment", "Monthly Assessment"].map((item) => <option key={item}>{item}</option>)}
        </select>
      </label>
      <label className="text-xs font-semibold">Number of sittings
        <select value={sittings} onChange={(event) => onSittings(event.target.value)} className="mt-1.5 h-10 w-full border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#B58A36]">
          {["18", "12", "10"].map((item) => <option key={item}>{item}</option>)}
        </select>
      </label>
    </section>
  );
}

