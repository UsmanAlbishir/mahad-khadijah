"use client";

import { useEffect, useMemo, useState } from "react";
import { BookOpenCheck, Plus, Search, Target } from "lucide-react";
import { demoMemorisation, demoStudents, formatDate, localDateValue } from "@/components/teacher/teacher-demo-data";
import { DemoNotice, EmptyState, PageHeading, StatusBadge } from "@/components/teacher/teacher-ui";

const grades = ["Mumtaz (Excellent)", "Jayyid Jiddan (Very Good)", "Jayyid (Good)", "Maqbool (Fair)", "Needs Revision"] as const;
type Grade = (typeof grades)[number];

interface DraftRecord {
  id: string;
  studentId: string;
  date: string;
  surah: string;
  fromAyah: number;
  toAyah: number;
  newPortion: string;
  revision: string;
  grade: Grade;
  remarks: string;
}

export default function TeacherMemorisationPage() {
  const [records, setRecords] = useState<DraftRecord[]>([]);
  const [studentId, setStudentId] = useState("");
  const [date, setDate] = useState("");
  const [surah, setSurah] = useState("");
  const [fromAyah, setFromAyah] = useState("");
  const [toAyah, setToAyah] = useState("");
  const [newPortion, setNewPortion] = useState("");
  const [revision, setRevision] = useState("");
  const [grade, setGrade] = useState<Grade>(grades[0]);
  const [remarks, setRemarks] = useState("");
  const [feedback, setFeedback] = useState("");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");

  const recordRows = useMemo(() => [
    ...records.map((record) => ({ ...record, source: "draft" as const })),
    ...demoMemorisation.map((record) => ({
      id: record.id,
      studentId: record.studentId,
      date: record.date,
      surah: `${record.surahStart} – ${record.surahEnd}`,
      fromAyah: record.ayahStart,
      toAyah: record.ayahEnd,
      newPortion: record.status === "revision" ? "Not recorded separately" : record.status.replace("_", " "),
      revision: record.status === "revision" ? `${record.surahStart} ${record.ayahStart} – ${record.surahEnd} ${record.ayahEnd}` : "Not recorded separately",
      grade: record.grade,
      remarks: record.notes ?? "",
      source: "sample" as const,
    })),
  ].sort((a, b) => b.date.localeCompare(a.date)), [records]);

  const filteredRecords = recordRows.filter((record) => {
    const student = demoStudents.find((item) => item.id === record.studentId);
    return student && (category === "all" || student.category === category) &&
      (!search || `${student.fullName} ${record.surah}`.toLowerCase().includes(search.toLowerCase()));
  });

  useEffect(() => {
    setDate(localDateValue());
  }, []);

  function addRecord(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const firstAyah = Number(fromAyah);
    const lastAyah = Number(toAyah);
    if (!studentId || !date || Number.isNaN(Date.parse(date)) || !surah.trim() || firstAyah < 1 || lastAyah < firstAyah) {
      setFeedback("Enter a student, valid date, Surah, and ayah range where the ending ayah is not before the starting ayah.");
      return;
    }
    if (!newPortion.trim() && !revision.trim()) {
      setFeedback("Enter the new memorisation portion, revision portion, or both.");
      return;
    }

    setRecords((current) => [{
      id: `draft-${Date.now()}`,
      studentId,
      date,
      surah: surah.trim(),
      fromAyah: firstAyah,
      toAyah: lastAyah,
      newPortion: newPortion.trim(),
      revision: revision.trim(),
      grade,
      remarks: remarks.trim(),
    }, ...current]);
    setFeedback("Demo record added to this page's temporary state only. Refreshing will discard it.");
    setSurah("");
    setFromAyah("");
    setToAyah("");
    setNewPortion("");
    setRevision("");
    setRemarks("");
  }

  return (
    <div className="space-y-6">
      <PageHeading eyebrow="Tahfiz" title="Qur’an memorisation" description="Record a structured practice entry and review the sample memorisation history." />
      <DemoNotice>Current memorisation data is fictional sample data. New entries exist only in page memory; the Surah field is text because no approved Qur’an reference dataset or backend record API is present.</DemoNotice>

      <section className="grid gap-3 md:grid-cols-2">
        <div className="flex items-center justify-between border border-[#452D24]/20 bg-card p-4"><div><p className="text-[11px] font-semibold uppercase text-muted-foreground">Category A target</p><p className="mt-1 text-sm font-semibold">1 Juz per week</p></div><Target className="size-5 text-[#9B4123]" /></div>
        <div className="flex items-center justify-between border border-[#E84F12]/40 bg-card p-4"><div><p className="text-[11px] font-semibold uppercase text-muted-foreground">Category B target</p><p className="mt-1 text-sm font-semibold">½ Juz per week</p></div><Target className="size-5 text-[#9B4123]" /></div>
      </section>

      <section className="border border-border bg-card p-5">
        <div className="mb-5 flex items-center gap-2"><BookOpenCheck className="size-4 text-primary" /><h3 className="text-sm font-semibold">Add memorisation entry</h3></div>
        <form onSubmit={addRecord} className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <label className="text-xs font-medium">Student<select value={studentId} onChange={(event) => setStudentId(event.target.value)} required className="mt-1.5 h-10 w-full border border-input bg-background px-3 text-sm"><option value="">Select a demo student</option>{demoStudents.filter((student) => student.status === "active").map((student) => <option key={student.id} value={student.id}>{student.fullName} · Category {student.category}</option>)}</select></label>
          <label className="text-xs font-medium">Assessment date<input type="date" value={date} onChange={(event) => setDate(event.target.value)} required className="mt-1.5 h-10 w-full border border-input bg-background px-3 text-sm" /></label>
          <label className="text-xs font-medium md:col-span-2">Surah<input value={surah} onChange={(event) => setSurah(event.target.value)} required maxLength={80} placeholder="Enter Surah name" className="mt-1.5 h-10 w-full border border-input bg-background px-3 text-sm" /></label>
          <label className="text-xs font-medium">From ayah<input type="number" min="1" value={fromAyah} onChange={(event) => setFromAyah(event.target.value)} required className="mt-1.5 h-10 w-full border border-input bg-background px-3 text-sm" /></label>
          <label className="text-xs font-medium">To ayah<input type="number" min={fromAyah || 1} value={toAyah} onChange={(event) => setToAyah(event.target.value)} required className="mt-1.5 h-10 w-full border border-input bg-background px-3 text-sm" /></label>
          <label className="text-xs font-medium md:col-span-2">New memorisation<textarea value={newPortion} onChange={(event) => setNewPortion(event.target.value)} rows={2} placeholder="New portion covered (optional if revision is entered)" className="mt-1.5 w-full resize-y border border-input bg-background px-3 py-2 text-sm" /></label>
          <label className="text-xs font-medium md:col-span-2">Revision<textarea value={revision} onChange={(event) => setRevision(event.target.value)} rows={2} placeholder="Previously memorised portion revised" className="mt-1.5 w-full resize-y border border-input bg-background px-3 py-2 text-sm" /></label>
          <label className="text-xs font-medium md:col-span-2">Assessment<select value={grade} onChange={(event) => setGrade(event.target.value as Grade)} className="mt-1.5 h-10 w-full border border-input bg-background px-3 text-sm">{grades.map((item) => <option key={item} value={item}>{item}</option>)}</select><span className="mt-1 block text-[11px] text-muted-foreground">This qualitative grade is not converted into a numeric score.</span></label>
          <label className="text-xs font-medium md:col-span-2">Teacher remarks<textarea value={remarks} onChange={(event) => setRemarks(event.target.value)} rows={2} maxLength={500} placeholder="Observation or revision note" className="mt-1.5 w-full resize-y border border-input bg-background px-3 py-2 text-sm" /></label>
          <div className="flex items-end md:col-span-2 xl:col-span-4"><button type="submit" className="inline-flex h-10 items-center gap-2 bg-primary px-4 text-sm font-semibold text-primary-foreground hover:bg-primary/90"><Plus className="size-4" />Add demo entry</button></div>
        </form>
        {feedback && <p role="status" className="mt-4 border border-[#452D24]/20 bg-[#452D24]/5 px-3 py-2 text-sm">{feedback}</p>}
      </section>

      <section className="border border-border bg-card">
        <div className="flex flex-col gap-3 border-b border-border p-4 sm:flex-row sm:items-center sm:justify-between">
          <div><h3 className="text-sm font-semibold">Memorisation records</h3><p className="mt-1 text-xs text-muted-foreground">Ayah range and qualitative assessment are shown separately.</p></div>
          <div className="grid gap-2 sm:grid-cols-[minmax(190px,1fr)_150px]">
            <label className="relative"><span className="sr-only">Search records</span><Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search student or Surah" className="h-9 w-full border border-input bg-background pl-9 pr-3 text-xs" /></label>
            <label className="sr-only" htmlFor="mem-category">Filter category</label><select id="mem-category" value={category} onChange={(event) => setCategory(event.target.value)} className="h-9 border border-input bg-background px-2 text-xs"><option value="all">All categories</option><option value="A">Category A</option><option value="B">Category B</option></select>
          </div>
        </div>
        {filteredRecords.length ? <div className="overflow-x-auto"><table className="w-full min-w-[1050px] text-left text-xs"><thead className="bg-muted/50 font-semibold uppercase text-muted-foreground"><tr><th className="px-3 py-3">Student / Date</th><th className="px-3 py-3">Surah · ayah range</th><th className="px-3 py-3">New memorisation</th><th className="px-3 py-3">Revision</th><th className="px-3 py-3">Score</th><th className="px-3 py-3">Remarks</th><th className="px-3 py-3">Source</th></tr></thead><tbody className="divide-y divide-border">{filteredRecords.map((record) => { const student = demoStudents.find((item) => item.id === record.studentId); return <tr key={record.id}><td className="px-3 py-3"><span className="font-medium">{student?.fullName ?? "Unknown student"}</span><span className="mt-1 block text-muted-foreground">{formatDate(record.date)}</span></td><td className="px-3 py-3">{record.surah}<span className="mt-1 block text-muted-foreground">Ayah {record.fromAyah}–{record.toAyah}</span></td><td className="max-w-[190px] px-3 py-3 text-muted-foreground">{record.newPortion || "Not recorded separately"}</td><td className="max-w-[190px] px-3 py-3 text-muted-foreground">{record.revision || "Not recorded separately"}</td><td className="px-3 py-3">Not provided<span className="mt-1 block text-muted-foreground">{record.grade}</span></td><td className="max-w-[220px] px-3 py-3 text-muted-foreground">{record.remarks || "—"}</td><td className="px-3 py-3"><StatusBadge tone={record.source === "draft" ? "warning" : "neutral"}>{record.source === "draft" ? "Page draft" : "Sample"}</StatusBadge></td></tr>; })}</tbody></table></div> : <EmptyState title="No memorisation records match">Try adjusting your filters or add a new demo entry.</EmptyState>}
      </section>
    </div>
  );
}