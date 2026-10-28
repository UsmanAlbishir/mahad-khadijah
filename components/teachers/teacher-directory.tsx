"use client";

import React, { useState, useEffect, useTransition } from "react";
import Link from "next/link";
import {
  Search,
  UserPlus,
  UserCheck,
  Mail,
  Phone,
  Eye,
  CheckCircle2,
  X,
} from "lucide-react";
import { Teacher, StudentCategory } from "@/types";
import { getTeachers } from "@/lib/mock-services";

export function TeacherDirectory() {
  const [isPending, startTransition] = useTransition();
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<StudentCategory | "both" | "all">("all");
  const [status, setStatus] = useState<"active" | "on_leave" | "inactive" | "all">("all");

  // Selected teacher for modal view
  const [viewTeacher, setViewTeacher] = useState<Teacher | null>(null);

  useEffect(() => {
    startTransition(async () => {
      const result = await getTeachers({
        search,
        category,
        status,
      });
      setTeachers(result);
    });
  }, [search, category, status]);

  const getCategoryBadge = (cats: StudentCategory[]) => {
    const hasA = cats.includes("A");
    const hasB = cats.includes("B");

    if (hasA && hasB) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#174D3A] text-white">
          <span>Categories A & B</span>
        </span>
      );
    }
    if (hasA) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#174D3A] text-white">
          <span>Category A (1 Juz/wk)</span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#C6A45A] text-[#103729]">
        <span>Category B (½ Juz/wk)</span>
      </span>
    );
  };

  return (
    <div className="space-y-5">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-foreground font-serif">
            Tahfiz Faculty & Instructors
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Directory of certified Muhaffizun, Halaqah instructors, and revision coaches.
          </p>
        </div>

        <Link
          href="/teachers/new"
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#174D3A] text-white text-xs sm:text-sm font-semibold hover:bg-[#103729] transition shadow-xs ring-1 ring-[#C6A45A]/30 shrink-0"
        >
          <UserPlus className="w-4 h-4" />
          <span>Register New Teacher</span>
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-card text-card-foreground rounded-xl border border-border p-4 shadow-xs space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          {/* Search bar */}
          <div className="md:col-span-6 relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by instructor name, employee ID, qualification..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-lg bg-background border border-border text-xs focus:outline-hidden focus:ring-2 focus:ring-[#174D3A]"
            />
          </div>

          {/* Category Filter */}
          <div className="md:col-span-3">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as StudentCategory | "both" | "all")}
              className="w-full px-3 py-2 rounded-lg bg-background border border-border text-xs focus:outline-hidden focus:ring-2 focus:ring-[#174D3A]"
            >
              <option value="all">All Category Assignments</option>
              <option value="A">Assigned Category A</option>
              <option value="B">Assigned Category B</option>
              <option value="both">Assigned Both (A & B)</option>
            </select>
          </div>

          {/* Status Filter */}
          <div className="md:col-span-3">
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as "active" | "on_leave" | "inactive" | "all")}
              className="w-full px-3 py-2 rounded-lg bg-background border border-border text-xs focus:outline-hidden focus:ring-2 focus:ring-[#174D3A]"
            >
              <option value="all">All Faculty Statuses</option>
              <option value="active">Active On-Duty</option>
              <option value="on_leave">On Sabbatical / Leave</option>
            </select>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-border/60 text-xs text-muted-foreground">
          <div>
            Showing <strong className="text-foreground">{teachers.length}</strong> instructor profiles
            {isPending && <span className="ml-2 text-emerald-600 animate-pulse">• Updating...</span>}
          </div>

          {(search || category !== "all" || status !== "all") && (
            <button
              type="button"
              onClick={() => {
                setSearch("");
                setCategory("all");
                setStatus("all");
              }}
              className="text-[#174D3A] dark:text-[#C6A45A] font-medium hover:underline"
            >
              Clear Filters
            </button>
          )}
        </div>
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block bg-card text-card-foreground rounded-xl border border-border shadow-xs overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-muted/60 border-b border-border font-semibold text-muted-foreground uppercase tracking-wider text-[11px]">
            <tr>
              <th className="py-3 px-4">Faculty Member</th>
              <th className="py-3 px-4">Role / Title</th>
              <th className="py-3 px-4">Contact Info</th>
              <th className="py-3 px-4">Assigned Cohort</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {teachers.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-12 text-center text-muted-foreground">
                  <UserCheck className="w-8 h-8 mx-auto mb-2 opacity-40" />
                  <p className="font-semibold text-foreground">No instructors found</p>
                  <p className="text-xs mt-0.5">Try adjusting your search criteria.</p>
                </td>
              </tr>
            ) : (
              teachers.map((teacher) => (
                <tr key={teacher.id} className="hover:bg-muted/40 transition">
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#174D3A] to-[#103729] text-[#C6A45A] font-bold text-xs flex items-center justify-center shrink-0">
                        {teacher.fullName
                          .split(" ")
                          .map((n) => n[0])
                          .slice(0, 2)
                          .join("")}
                      </div>
                      <div>
                        <p className="font-bold text-foreground">{teacher.fullName}</p>
                        <p className="text-[11px] font-mono text-muted-foreground">
                          {teacher.employeeId}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="font-medium text-foreground">{teacher.role}</span>
                    <p className="text-[11px] text-muted-foreground truncate max-w-xs">
                      {teacher.qualifications}
                    </p>
                  </td>
                  <td className="py-3.5 px-4 space-y-0.5">
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <Mail className="w-3 h-3 text-[#174D3A] dark:text-[#C6A45A]" />
                      <span className="truncate">{teacher.email}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <Phone className="w-3 h-3 text-[#174D3A] dark:text-[#C6A45A]" />
                      <span>{teacher.phone}</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    {getCategoryBadge(teacher.assignedCategories)}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30">
                      <CheckCircle2 className="w-3 h-3" />
                      <span className="capitalize">{teacher.status.replace("_", " ")}</span>
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      type="button"
                      onClick={() => setViewTeacher(teacher)}
                      className="p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition inline-flex items-center gap-1 text-xs font-semibold"
                    >
                      <Eye className="w-4 h-4" />
                      <span>View</span>
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Teacher Cards View */}
      <div className="block md:hidden space-y-3">
        {teachers.map((teacher) => (
          <div
            key={teacher.id}
            className="bg-card text-card-foreground border border-border rounded-xl p-4 shadow-xs space-y-3"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#174D3A] to-[#103729] text-[#C6A45A] font-bold text-xs flex items-center justify-center shrink-0">
                  {teacher.fullName
                    .split(" ")
                    .map((n) => n[0])
                    .slice(0, 2)
                    .join("")}
                </div>
                <div>
                  <h3 className="font-bold text-sm text-foreground">
                    {teacher.fullName}
                  </h3>
                  <p className="text-[11px] font-mono text-muted-foreground">
                    {teacher.employeeId} • {teacher.role}
                  </p>
                </div>
              </div>
            </div>

            <div className="text-xs space-y-1.5 pt-2 border-t border-border/60">
              <p className="text-[11px] text-muted-foreground italic line-clamp-2">
                {teacher.qualifications}
              </p>
              <div className="flex items-center justify-between pt-1">
                <span className="text-[11px] text-muted-foreground">
                  {teacher.phone}
                </span>
                <div>{getCategoryBadge(teacher.assignedCategories)}</div>
              </div>
            </div>

            <div className="pt-2 border-t border-border/60 flex justify-end">
              <button
                type="button"
                onClick={() => setViewTeacher(teacher)}
                className="px-3 py-1 rounded-md bg-[#174D3A] text-white text-xs font-medium hover:bg-[#103729]"
              >
                View Teacher Details
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Teacher View Details Modal */}
      {viewTeacher && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in"
        >
          <div className="bg-card text-card-foreground border border-border rounded-xl shadow-2xl max-w-lg w-full p-6 space-y-4 relative">
            <button
              onClick={() => setViewTeacher(null)}
              className="absolute top-4 right-4 p-1 rounded-md text-muted-foreground hover:text-foreground"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#174D3A] to-[#103729] text-[#C6A45A] font-bold text-sm flex items-center justify-center shrink-0">
                {viewTeacher.fullName
                  .split(" ")
                  .map((n) => n[0])
                  .slice(0, 2)
                  .join("")}
              </div>
              <div>
                <h3 className="text-base font-bold font-serif text-foreground">
                  {viewTeacher.fullName}
                </h3>
                <p className="text-xs text-muted-foreground font-mono">
                  {viewTeacher.employeeId} • {viewTeacher.role}
                </p>
              </div>
            </div>

            <div className="space-y-2.5 text-xs bg-muted/40 p-4 rounded-xl border border-border">
              <div className="flex justify-between py-1 border-b border-border/50">
                <span className="text-muted-foreground">Qualifications:</span>
                <span className="font-semibold text-foreground text-right max-w-xs">
                  {viewTeacher.qualifications}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-border/50">
                <span className="text-muted-foreground">Phone:</span>
                <a
                  href={`tel:${viewTeacher.phone}`}
                  className="font-semibold text-[#174D3A] dark:text-[#C6A45A]"
                >
                  {viewTeacher.phone}
                </a>
              </div>
              <div className="flex justify-between py-1 border-b border-border/50">
                <span className="text-muted-foreground">Email:</span>
                <span className="font-semibold text-foreground">{viewTeacher.email}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-border/50">
                <span className="text-muted-foreground">Address:</span>
                <span className="font-semibold text-foreground">{viewTeacher.address}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-border/50">
                <span className="text-muted-foreground">Joined Academy:</span>
                <span className="font-semibold text-foreground">{viewTeacher.joinedDate}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-muted-foreground">Assigned Cohorts:</span>
                <div>{getCategoryBadge(viewTeacher.assignedCategories)}</div>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setViewTeacher(null)}
                className="px-4 py-2 bg-primary text-primary-foreground text-xs font-semibold rounded-lg hover:bg-primary/90"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
