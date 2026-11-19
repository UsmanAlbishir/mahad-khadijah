"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  ArrowRight,
  BookOpenCheck,
  Check,
  ClipboardList,
  Download,
  Eye,
  FilePenLine,
  FileSpreadsheet,
  GraduationCap,
  Printer,
  Search,
  UsersRound,
  X,
} from "lucide-react";
import {
  ASSIGNED_CATEGORIES,
  EXAMINATION_RECORDS,
  EXAMINATION_STUDENTS,
  EXAMINATION_TITLES,
  RESULTS_SESSION,
  RESULTS_TERM,
  type ExaminationRecord,
} from "@/lib/results-data";
import {
  ActionLink,
  ExaminationInfoFields,
  ExaminationResultTable,
  ExaminationSheetPreview,
  IndividualStudentResult,
  ResultsHeading,
  ResultsNotice,
  ResultsSection,
  ResultsSummaryCards,
  ResultStatusBadge,
} from "./results-ui";

type ResultsPanel = "admin" | "teacher";
type ResultsView = "dashboard" | "records" | "entry" | "preview" | "categories" | "student";

const adminQuickActions = [
  { title: "Enter examination results", detail: "Open the 18-sitting score sheet", href: "/results/enter", icon: FilePenLine },
  { title: "Examination records", detail: "Filter and review saved demo records", href: "/results/examinations", icon: ClipboardList },
  { title: "Preview result sheet", detail: "Open the Category AH sample sheet", href: "/results/preview/exam-ah-term1", icon: Eye },
];

const teacherQuickActions = [
  { title: "Enter results", detail: "Prepare a local score-sheet draft", href: "/teacher/results/enter", icon: FilePenLine },
  { title: "Assigned categories", detail: "View sample teaching groups", href: "/teacher/results/categories", icon: UsersRound },
  { title: "Examination records", detail: "Search student result records", href: "/teacher/results/records", icon: ClipboardList },
];

export function ResultsWorkspace({
  panel,
  view,
  recordId,
  studentId,
}: {
  panel: ResultsPanel;
  view: ResultsView;
  recordId?: string;
  studentId?: string;
}) {
  if (view === "dashboard") return <ResultsDashboard panel={panel} />;
  if (view === "records") return panel === "admin" ? <AdminExaminationRecords /> : <TeacherExaminationRecords />;
  if (view === "entry") return <ExaminationEntry panel={panel} />;
  if (view === "categories" && panel === "teacher") return <AssignedCategories />;
  if (view === "student" && panel === "teacher") return <StudentPreview studentId={studentId ?? ""} />;
  if (view === "preview") return <SheetPreview panel={panel} recordId={recordId ?? ""} />;
  return <ResultsDashboard panel={panel} />;
}

function ResultsDashboard({ panel }: { panel: ResultsPanel }) {
  const isAdmin = panel === "admin";
  const quickActions = isAdmin ? adminQuickActions : teacherQuickActions;
  const summary = isAdmin
    ? [
        { label: "Total students", value: 57, detail: "Fictional school-wide roster", icon: GraduationCap },
        { label: "Examination records", value: EXAMINATION_RECORDS.length, detail: "Sample term records", icon: FileSpreadsheet },
        { label: "Categories", value: 3, detail: "AH, A and B sample groups", icon: UsersRound },
        { label: "Students passed", value: 49, detail: "Illustrative remarks only", icon: Check },
        { label: "Students failed", value: 8, detail: "Illustrative remarks only", icon: ClipboardList },
      ]
    : [
        { label: "Assigned categories", value: ASSIGNED_CATEGORIES.length, detail: "Sample teacher assignments", icon: UsersRound },
        { label: "Assigned students", value: 57, detail: "Fictional students across groups", icon: GraduationCap },
        { label: "Examination records", value: EXAMINATION_RECORDS.length, detail: "Sample term records", icon: FileSpreadsheet },
        { label: "Results prepared", value: 2, detail: "Illustrative record statuses", icon: Check },
      ];

  return (
    <div className="space-y-6">
      <ResultsHeading
        eyebrow={isAdmin ? "Administrator · Academic records" : "Teacher workspace · Examination activity"}
        title="Results Dashboard"
        description={isAdmin
          ? "Monitor examination records, category progress and term result preparation."
          : "A focused overview of sample categories, students and examination result activity."}
      />
      <ResultsNotice>
        Frontend-only demonstration. All student names, results, counts and statuses are fictional. Changes made here remain temporary in page state and are not saved or submitted.
      </ResultsNotice>
      <section className="grid gap-3 border border-[#B58A36]/30 bg-card p-4 sm:grid-cols-3 sm:p-5">
        <InfoTile label="Academic session" value={RESULTS_SESSION} icon={<BookOpenCheck className="size-4" />} />
        <InfoTile label="Current term" value={RESULTS_TERM} icon={<ClipboardList className="size-4" />} />
        <InfoTile label="Current examination" value="End of Term Examination" icon={<FileSpreadsheet className="size-4" />} />
      </section>
      <ResultsSummaryCards items={summary} />

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <ResultsSection
          title="Recent examination records"
          detail="Latest fictional examination activity"
          action={<ActionLink href={isAdmin ? "/results/examinations" : "/teacher/results/records"} subtle>View all <ArrowRight className="size-3.5" /></ActionLink>}
        >
          <div className="divide-y divide-border">
            {EXAMINATION_RECORDS.slice(0, 3).map((record) => (
              <div key={record.id} className="flex flex-wrap items-center justify-between gap-3 p-4">
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold">{record.title}</p>
                  <p className="mt-1 text-xs text-muted-foreground">Category {record.category} · {record.term} · {record.studentCount} students</p>
                </div>
                <div className="flex items-center gap-3">
                  <ResultStatusBadge status={record.status} />
                  <Link href={`${isAdmin ? "/results" : "/teacher/results"}/preview/${record.id}`} aria-label={`Preview ${record.title}`} className="inline-flex size-9 items-center justify-center border border-border hover:bg-muted"><Eye className="size-4" /></Link>
                </div>
              </div>
            ))}
          </div>
        </ResultsSection>

        <ResultsSection title={isAdmin ? "Category overview" : "Assigned category overview"} detail="Demonstration category status">
          <div className="space-y-3 p-4">
            {ASSIGNED_CATEGORIES.map((category) => (
              <div key={category.name} className="flex items-center justify-between gap-3 border border-border p-3">
                <div><p className="text-sm font-semibold">{category.name === "AH" ? "Category AH" : category.name}</p><p className="mt-1 text-xs text-muted-foreground">{category.students} students</p></div>
                <ResultStatusBadge status={category.status} />
              </div>
            ))}
          </div>
        </ResultsSection>
      </div>

      <ResultsSection title="Quick actions" detail="Jump to common examination tasks">
        <div className="grid gap-2 p-4 sm:grid-cols-2 xl:grid-cols-3">
          {quickActions.map(({ title, detail, href, icon: Icon }) => (
            <Link key={href} href={href} className="group flex items-center gap-3 border border-border p-3 transition-colors hover:border-[#174A36]/40 hover:bg-muted/40">
              <span className="flex size-9 shrink-0 items-center justify-center bg-[#174A36]/10 text-[#174A36]"><Icon className="size-4" /></span>
              <span className="min-w-0 flex-1"><span className="block text-sm font-semibold">{title}</span><span className="mt-0.5 block text-xs text-muted-foreground">{detail}</span></span>
              <ArrowRight className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
            </Link>
          ))}
        </div>
      </ResultsSection>
    </div>
  );
}

function InfoTile({ label, value, icon }: { label: string; value: string; icon: React.ReactNode }) {
  return <div className="flex items-start gap-3"><span className="mt-0.5 text-[#174A36]">{icon}</span><div><p className="text-[11px] font-medium text-muted-foreground">{label}</p><p className="mt-1 text-sm font-semibold">{value}</p></div></div>;
}

function AdminExaminationRecords() {
  const [records, setRecords] = useState(EXAMINATION_RECORDS);
  const [session, setSession] = useState("all");
  const [term, setTerm] = useState("all");
  const [category, setCategory] = useState("all");
  const [title, setTitle] = useState("all");
  const [editing, setEditing] = useState<ExaminationRecord | null>(null);
  const [notice, setNotice] = useState("");

  const filtered = useMemo(() => records.filter((record) =>
    (session === "all" || record.session === session) &&
    (term === "all" || record.term === term) &&
    (category === "all" || record.category === category) &&
    (title === "all" || record.title === title),
  ), [records, session, term, category, title]);

  function saveEdit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!editing) return;
    setRecords((current) => current.map((record) => record.id === editing.id ? editing : record));
    setEditing(null);
    setNotice("Record changes are held only in this page's temporary prototype state.");
  }

  return (
    <div className="space-y-6">
      <ResultsHeading eyebrow="Administrator · Results" title="Examination Records" description="Filter, review, edit and preview fictional examination records." action={<ActionLink href="/results/enter"><FilePenLine className="size-4" />Enter results</ActionLink>} />
      {notice && <p role="status" className="border border-[#174A36]/20 bg-[#174A36]/5 px-4 py-3 text-xs">{notice}</p>}
      <section className="grid gap-3 border border-border bg-card p-4 sm:grid-cols-2 xl:grid-cols-4" aria-label="Filter examination records">
        <FilterSelect label="Academic session" value={session} onChange={setSession} options={[RESULTS_SESSION, "2024/2025 Academic Session"]} />
        <FilterSelect label="Term" value={term} onChange={setTerm} options={["First Term", "Second Term", "Third Term"]} />
        <FilterSelect label="Student category" value={category} onChange={setCategory} options={["AH", "A", "B", "C"]} />
        <FilterSelect label="Examination title" value={title} onChange={setTitle} options={EXAMINATION_TITLES} />
      </section>
      <ResultsSection title="Examination records" detail={`${filtered.length} matching demo records`}>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1050px] text-left text-xs">
            <thead className="bg-muted/50 text-[10px] uppercase tracking-wide text-muted-foreground"><tr>{["Examination title", "Academic session", "Term", "Category", "Students", "Sittings", "Date", "Status", "Actions"].map((item) => <th key={item} className="px-3 py-3 font-semibold">{item}</th>)}</tr></thead>
            <tbody className="divide-y divide-border">
              {filtered.map((record) => (
                <tr key={record.id} className="hover:bg-muted/30">
                  <td className="px-3 py-3 font-semibold">{record.title}</td><td className="px-3 py-3">{record.session}</td><td className="px-3 py-3">{record.term}</td><td className="px-3 py-3">{record.category}</td><td className="px-3 py-3 tabular-nums">{record.studentCount}</td><td className="px-3 py-3 tabular-nums">{record.sittings}</td><td className="px-3 py-3">{record.date}</td><td className="px-3 py-3"><ResultStatusBadge status={record.status} /></td>
                  <td className="px-3 py-3"><div className="flex items-center gap-1">
                    <ActionIcon href={`/results/preview/${record.id}`} label="View record"><Eye className="size-4" /></ActionIcon>
                    <button type="button" onClick={() => { setEditing({ ...record }); setNotice(""); }} aria-label={`Edit ${record.title}`} className="inline-flex size-8 items-center justify-center border border-border hover:bg-muted"><FilePenLine className="size-4" /></button>
                    <ActionIcon href={`/results/preview/${record.id}`} label="Preview record"><Download className="size-4" /></ActionIcon>
                    <ActionIcon href={`/results/preview/${record.id}`} label={`Open print preview for ${record.title}`}><Printer className="size-4" /></ActionIcon>
                  </div></td>
                </tr>
              ))}
              {!filtered.length && <tr><td colSpan={9} className="px-4 py-10 text-center text-muted-foreground">No records match the selected filters.</td></tr>}
            </tbody>
          </table>
        </div>
      </ResultsSection>
      {editing && <EditRecordDialog record={editing} onChange={setEditing} onClose={() => setEditing(null)} onSave={saveEdit} />}
    </div>
  );
}

function FilterSelect({ label, value, onChange, options }: { label: string; value: string; onChange: (value: string) => void; options: readonly string[] }) {
  return <label className="text-xs font-medium">{label}<select value={value} onChange={(event) => onChange(event.target.value)} className="mt-1.5 h-10 w-full border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#B58A36]"><option value="all">All {label.toLowerCase()}</option>{options.map((option) => <option key={option} value={option}>{option}</option>)}</select></label>;
}

function ActionIcon({ href, label, children }: { href: string; label: string; children: React.ReactNode }) {
  return <Link href={href} aria-label={label} className="inline-flex size-8 items-center justify-center border border-border hover:bg-muted">{children}</Link>;
}

function EditRecordDialog({
  record,
  onChange,
  onClose,
  onSave,
}: {
  record: ExaminationRecord;
  onChange: (record: ExaminationRecord) => void;
  onClose: () => void;
  onSave: (event: React.FormEvent<HTMLFormElement>) => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <form onSubmit={onSave} role="dialog" aria-modal="true" aria-labelledby="edit-record-title" className="w-full max-w-lg border border-border bg-card p-5 shadow-xl">
        <div className="flex items-start justify-between"><div><p className="text-xs font-semibold uppercase tracking-wide text-[#174A36]">Local record editor</p><h2 id="edit-record-title" className="mt-1 text-lg font-bold">Edit examination record</h2></div><button type="button" onClick={onClose} aria-label="Close dialog" className="p-1 text-muted-foreground hover:bg-muted"><X className="size-5" /></button></div>
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <label className="text-xs font-medium sm:col-span-2">Examination title<input value={record.title} onChange={(event) => onChange({ ...record, title: event.target.value })} className="mt-1.5 h-10 w-full border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#B58A36]" /></label>
          <label className="text-xs font-medium">Date<input value={record.date} onChange={(event) => onChange({ ...record, date: event.target.value })} className="mt-1.5 h-10 w-full border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#B58A36]" /></label>
          <label className="text-xs font-medium">Status<select value={record.status} onChange={(event) => onChange({ ...record, status: event.target.value as ExaminationRecord["status"] })} className="mt-1.5 h-10 w-full border border-input bg-background px-3 text-sm"><option>Prepared</option><option>In progress</option><option>Draft</option></select></label>
        </div>
        <div className="mt-5 flex justify-end gap-2"><button type="button" onClick={onClose} className="h-9 border border-border px-3 text-xs font-semibold hover:bg-muted">Cancel</button><button type="submit" className="h-9 bg-[#174A36] px-4 text-xs font-semibold text-white hover:bg-[#103827]">Save local changes</button></div>
      </form>
    </div>
  );
}

function ExaminationEntry({ panel }: { panel: ResultsPanel }) {
  const [session, setSession] = useState(RESULTS_SESSION);
  const [term, setTerm] = useState(RESULTS_TERM);
  const [category, setCategory] = useState("AH");
  const [title, setTitle] = useState(EXAMINATION_TITLES[0]);
  const [sittings, setSittings] = useState("18");
  const [scores, setScores] = useState<Record<string, string[]>>({});
  const [feedback, setFeedback] = useState("");
  const backHref = panel === "admin" ? "/results/examinations" : "/teacher/results/records";

  function updateScore(studentId: string, columnIndex: number, value: string) {
    const upper = value.toUpperCase();
    if (upper !== "" && upper !== "A" && upper !== "AB" && upper !== "ABS" && !/^\d{0,3}$/.test(upper)) return;
    if (/^\d+$/.test(upper) && Number(upper) > 100) return;
    setScores((current) => {
      const studentScores = [...(current[studentId] ?? EXAMINATION_STUDENTS.find((student) => student.id === studentId)!.scores)];
      studentScores[columnIndex] = upper;
      return { ...current, [studentId]: studentScores };
    });
  }

  return (
    <div className="space-y-5">
      <ResultsHeading eyebrow={panel === "admin" ? "Administrator · Results" : "Teacher workspace · Results"} title="Enter Examination Results" description="Enter the 18 sitting values. Totals, averages and remarks are static illustrative examples and do not recalculate." action={<ActionLink href={backHref} subtle>Examination records</ActionLink>} />
      <ResultsNotice>Score edits are kept in temporary browser-page state only. The TOTAL, AVERAGE and REMARK columns are read-only mock values; no grading rules or automatic calculations are applied.</ResultsNotice>
      <ExaminationInfoFields session={session} term={term} category={category} title={title} sittings={sittings} onSession={setSession} onTerm={setTerm} onCategory={setCategory} onTitle={setTitle} onSittings={setSittings} />
      {category !== "AH" && <p role="status" className="border border-border bg-muted/40 px-4 py-3 text-xs text-muted-foreground">The fictional 23-student roster provided for this prototype is Category AH; other category selections update the form only.</p>}
      <ResultsSection title={`Category ${category} · ${title}`} detail={`${EXAMINATION_STUDENTS.length} fictional student records · ${sittings} sitting columns`}>
        <ExaminationResultTable students={EXAMINATION_STUDENTS} editable scoresByStudent={scores} onScoreChange={updateScore} />
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border p-4">
          <p className="text-xs text-muted-foreground">Changes disappear when you leave this page.</p>
          <div className="flex gap-2">
            <ActionLink href={`${panel === "admin" ? "/results" : "/teacher/results"}/preview/exam-ah-term1`} subtle>Preview sheet</ActionLink>
            <button type="button" onClick={() => setFeedback("Local draft updated for this page only. Nothing was stored or submitted.")} className="inline-flex min-h-9 items-center gap-2 bg-[#174A36] px-3 text-xs font-semibold text-white hover:bg-[#103827]">Save local draft</button>
          </div>
        </div>
      </ResultsSection>
      {feedback && <p role="status" className="border border-[#174A36]/20 bg-[#174A36]/5 px-4 py-3 text-xs">{feedback}</p>}
    </div>
  );
}

function SheetPreview({ panel, recordId }: { panel: ResultsPanel; recordId: string }) {
  const record = EXAMINATION_RECORDS.find((item) => item.id === recordId) ?? EXAMINATION_RECORDS[0];
  return (
    <div className="space-y-6">
      <ResultsHeading eyebrow={panel === "admin" ? "Administrator · Print preview" : "Teacher workspace · Print preview"} title="Result Preview" description="Print-ready examination sheet using fictional demonstration records." />
      <ExaminationSheetPreview record={record} backHref={panel === "admin" ? "/results/examinations" : "/teacher/results/records"} />
    </div>
  );
}

function AssignedCategories() {
  return (
    <div className="space-y-6">
      <ResultsHeading eyebrow="Teacher workspace · Results" title="Assigned Categories" description="Review fictional category assignments and open a roster or score-entry workspace." />
      <ResultsNotice>Category assignments shown here are illustrative only. No teacher assignment or permission logic is connected.</ResultsNotice>
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {ASSIGNED_CATEGORIES.map((category) => (
          <article key={category.name} className="border border-border bg-card p-5 shadow-xs">
            <div className="flex items-start justify-between gap-3"><div><p className="text-[11px] font-bold uppercase tracking-wide text-[#174A36]">Assigned category</p><h2 className="mt-1 text-xl font-bold">{category.name === "AH" ? "Category AH" : category.name}</h2></div><UsersRound className="size-5 text-[#174A36]" /></div>
            <dl className="mt-5 grid grid-cols-2 gap-4 text-sm"><div><dt className="text-xs text-muted-foreground">Students</dt><dd className="mt-1 font-semibold">{category.students}</dd></div><div><dt className="text-xs text-muted-foreground">Examination status</dt><dd className="mt-1"><ResultStatusBadge status={category.status} /></dd></div><div className="col-span-2"><dt className="text-xs text-muted-foreground">Academic session · term</dt><dd className="mt-1 font-medium">{category.session}<br />{category.term}</dd></div></dl>
            <div className="mt-5 flex flex-wrap gap-2"><ActionLink href="/teacher/results/records" subtle><UsersRound className="size-3.5" />View students</ActionLink><ActionLink href="/teacher/results/enter"><FilePenLine className="size-3.5" />Enter results</ActionLink></div>
          </article>
        ))}
      </section>
    </div>
  );
}

function TeacherExaminationRecords() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [term, setTerm] = useState("all");
  const students = useMemo(() => EXAMINATION_STUDENTS.filter((student) => {
    const matchingText = `${student.name} ${student.studentNumber}`.toLowerCase().includes(search.toLowerCase());
    const matchingCategory = category === "all" || student.category === category;
    const matchingTerm = term === "all" || term === RESULTS_TERM;
    return matchingText && matchingCategory && matchingTerm;
  }), [search, category, term]);
  const record = EXAMINATION_RECORDS[0];

  return (
    <div className="space-y-6">
      <ResultsHeading eyebrow="Teacher workspace · Results" title="Examination Records" description="Search the fictional student result register and open an individual result or the full examination sheet." action={<ActionLink href="/teacher/results/enter"><FilePenLine className="size-4" />Enter results</ActionLink>} />
      <section className="grid gap-3 border border-border bg-card p-4 sm:grid-cols-[minmax(220px,1fr)_180px_180px]">
        <label className="relative block text-xs font-medium"><span className="sr-only">Search student</span><Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search student name or number" className="h-10 w-full border border-input bg-background pl-9 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#B58A36]" /></label>
        <FilterSelect label="Category" value={category} onChange={setCategory} options={["AH", "A", "B"]} />
        <FilterSelect label="Term" value={term} onChange={setTerm} options={["First Term", "Second Term", "Third Term"]} />
      </section>
      <ResultsSection title="Student examination records" detail={`${students.length} fictional student results · ${record.title}`}>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1100px] text-left text-xs">
            <thead className="bg-muted/50 text-[10px] uppercase tracking-wide text-muted-foreground"><tr>{["Student name", "Student number", "Category", "Academic session", "Term", "Examination title", "Result status", "Actions"].map((heading) => <th key={heading} className="px-3 py-3 font-semibold">{heading}</th>)}</tr></thead>
            <tbody className="divide-y divide-border">
              {students.map((student) => (
                <tr key={student.id} className="hover:bg-muted/30">
                  <td className="px-3 py-3 font-semibold">{student.name}</td><td className="px-3 py-3 font-mono">{student.studentNumber}</td><td className="px-3 py-3">{student.category}</td><td className="px-3 py-3">{record.session}</td><td className="px-3 py-3">{record.term}</td><td className="px-3 py-3">{record.title}</td><td className="px-3 py-3"><ResultStatusBadge status={student.resultStatus} /></td>
                  <td className="px-3 py-3"><div className="flex gap-1"><ActionLink href={`/teacher/results/student/${student.id}`} subtle>View result</ActionLink><Link href={`/teacher/results/preview/${record.id}`} className="inline-flex min-h-9 items-center justify-center border border-border px-3 text-xs font-semibold hover:bg-muted">Preview sheet</Link></div></td>
                </tr>
              ))}
              {!students.length && <tr><td colSpan={8} className="px-4 py-10 text-center text-muted-foreground">No student records match those filters.</td></tr>}
            </tbody>
          </table>
        </div>
      </ResultsSection>
    </div>
  );
}

function StudentPreview({ studentId }: { studentId: string }) {
  const student = EXAMINATION_STUDENTS.find((item) => item.id === studentId);
  if (!student) return <div className="space-y-4"><ResultsHeading eyebrow="Teacher workspace · Results" title="Result not found" description="This sample student is not in the demonstration roster." /><ActionLink href="/teacher/results/records" subtle>Back to Examination Records</ActionLink></div>;
  return <div className="space-y-6"><ResultsHeading eyebrow="Teacher workspace · Results" title="Individual Student Result" description="View one student's illustrative examination result." /><IndividualStudentResult student={student} record={EXAMINATION_RECORDS[0]} backHref="/teacher/results/records" /></div>;
}
