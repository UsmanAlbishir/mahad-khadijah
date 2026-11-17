"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, Eye, Search, UsersRound } from "lucide-react";
import { demoAttendance, demoMemorisation, demoStudents, formatDate } from "@/components/teacher/teacher-demo-data";
import { DemoNotice, EmptyState, PageHeading, StatusBadge } from "@/components/teacher/teacher-ui";

const pageSize = 7;

export default function TeacherStudentsPage() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [status, setStatus] = useState("all");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => demoStudents.filter((student) => {
    const searchText = `${student.fullName} ${student.admissionNumber}`.toLowerCase();
    return (!query || searchText.includes(query.toLowerCase())) &&
      (category === "all" || student.category === category) &&
      (status === "all" || student.status === status);
  }), [category, query, status]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
  const visibleStudents = filtered.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div className="space-y-6">
      <PageHeading eyebrow="Teaching" title="My students" description="Search the sample student roster and open read-only academic profiles." />
      <DemoNotice>The current backend contract does not expose teacher assignments. This directory uses existing fictional sample students and is not an authoritative list of students assigned to you.</DemoNotice>

      <section className="border border-border bg-card">
        <div className="flex flex-col gap-3 border-b border-border p-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap gap-2 text-xs">
            <StatusBadge>{filtered.length} demo students</StatusBadge>
            <StatusBadge tone="success">{filtered.filter((student) => student.status === "active").length} active</StatusBadge>
          </div>
          <div className="grid gap-2 sm:grid-cols-[minmax(220px,1fr)_150px_150px]">
            <label className="relative block">
              <span className="sr-only">Search by name or admission number</span>
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <input value={query} onChange={(event) => { setQuery(event.target.value); setPage(1); }} placeholder="Name or admission number" className="h-10 w-full border border-input bg-background pl-9 pr-3 text-sm outline-none focus:ring-2 focus:ring-ring" />
            </label>
            <label className="sr-only" htmlFor="student-category">Filter category</label>
            <select id="student-category" value={category} onChange={(event) => { setCategory(event.target.value); setPage(1); }} className="h-10 border border-input bg-background px-3 text-sm">
              <option value="all">All categories</option><option value="A">Category A</option><option value="B">Category B</option>
            </select>
            <label className="sr-only" htmlFor="student-status">Filter status</label>
            <select id="student-status" value={status} onChange={(event) => { setStatus(event.target.value); setPage(1); }} className="h-10 border border-input bg-background px-3 text-sm">
              <option value="all">All statuses</option><option value="active">Active</option><option value="inactive">Inactive</option><option value="suspended">Suspended</option><option value="graduated">Graduated</option>
            </select>
          </div>
        </div>

        {visibleStudents.length ? (
          <>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[790px] text-left text-sm">
                <thead className="bg-muted/50 text-[11px] font-semibold uppercase text-muted-foreground">
                  <tr><th className="px-4 py-3">Admission no.</th><th className="px-4 py-3">Student</th><th className="px-4 py-3">Category</th><th className="px-4 py-3">Latest attendance</th><th className="px-4 py-3">Memorisation</th><th className="px-4 py-3">Status</th><th className="px-4 py-3 text-right">Profile</th></tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {visibleStudents.map((student) => {
                    const attendance = demoAttendance.filter((record) => record.studentId === student.id).sort((a, b) => b.date.localeCompare(a.date))[0];
                    const memorisation = demoMemorisation.filter((record) => record.studentId === student.id).sort((a, b) => b.date.localeCompare(a.date))[0];
                    return (
                      <tr key={student.id} className="hover:bg-muted/30">
                        <td className="whitespace-nowrap px-4 py-3 font-mono text-xs text-muted-foreground">{student.admissionNumber}</td>
                        <td className="px-4 py-3"><span className="block font-medium">{student.fullName}</span><span className="mt-0.5 block text-xs text-muted-foreground">{student.gender === "female" ? "Female" : "Male"}</span></td>
                        <td className="px-4 py-3"><StatusBadge tone={student.category === "A" ? "success" : "warning"}>Category {student.category}</StatusBadge></td>
                        <td className="px-4 py-3">{attendance ? <span className="capitalize">{attendance.status} <span className="text-xs text-muted-foreground">· {formatDate(attendance.date)}</span></span> : <span className="text-xs text-muted-foreground">No sample record</span>}</td>
                        <td className="px-4 py-3">{memorisation ? <span className="block">Juz {memorisation.juzNumber}<span className="mt-0.5 block text-xs text-muted-foreground">{memorisation.grade.split(" (")[0]} · {formatDate(memorisation.date)}</span></span> : <span className="text-xs text-muted-foreground">No sample record</span>}</td>
                        <td className="px-4 py-3"><StatusBadge tone={student.status === "active" ? "success" : "neutral"}>{student.status}</StatusBadge></td>
                        <td className="px-4 py-3 text-right"><Link href={`/teacher/students/${student.id}`} aria-label={`View ${student.fullName}`} className="inline-flex size-9 items-center justify-center border border-border hover:bg-muted"><Eye className="size-4" /></Link></td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <div className="flex items-center justify-between border-t border-border px-4 py-3">
              <p className="text-xs text-muted-foreground">Page {page} of {pageCount} · {filtered.length} results</p>
              <div className="flex gap-2">
                <button type="button" onClick={() => setPage((value) => Math.max(1, value - 1))} disabled={page === 1} className="inline-flex h-9 items-center gap-1 border border-border px-3 text-xs font-medium disabled:opacity-40"><ArrowLeft className="size-3.5" />Previous</button>
                <button type="button" onClick={() => setPage((value) => Math.min(pageCount, value + 1))} disabled={page >= pageCount} className="inline-flex h-9 items-center gap-1 border border-border px-3 text-xs font-medium disabled:opacity-40">Next<ArrowRight className="size-3.5" /></button>
              </div>
            </div>
          </>
        ) : (
          <EmptyState title="No students match these filters"><UsersRound className="hidden" />Try changing the search or category filters.</EmptyState>
        )}
      </section>
    </div>
  );
}