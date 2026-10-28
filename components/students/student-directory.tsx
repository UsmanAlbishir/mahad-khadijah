"use client";

import React, { useState, useEffect, useTransition } from "react";
import Link from "next/link";
import {
  Search,
  Plus,
  ArrowUpDown,
  Eye,
  Edit,
  GraduationCap,
  CheckCircle,
  AlertCircle,
  Clock,
  ChevronLeft,
  ChevronRight,
  BookOpen,
} from "lucide-react";
import { StudentCategory, StudentStatus, PaymentStatus } from "@/types";
import { getStudents, StudentListResult } from "@/lib/mock-services";

export function StudentDirectory() {
  const [isPending, startTransition] = useTransition();
  const [data, setData] = useState<StudentListResult>({
    students: [],
    total: 0,
    page: 1,
    pageSize: 10,
    totalPages: 1,
  });

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<StudentCategory | "all">("all");
  const [status, setStatus] = useState<StudentStatus | "all">("all");
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus | "all">("all");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortBy, setSortBy] = useState<"fullName" | "admissionNumber" | "admissionDate" | "currentJuz">("admissionNumber");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  // Fetch students with current filter parameters
  useEffect(() => {
    startTransition(async () => {
      const result = await getStudents({
        search,
        category,
        status,
        paymentStatus,
        page,
        pageSize,
        sortBy,
        sortOrder,
      });
      setData(result);
    });
  }, [search, category, status, paymentStatus, page, pageSize, sortBy, sortOrder]);

  const handleSort = (field: typeof sortBy) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
  };

  const getPaymentBadge = (st: PaymentStatus) => {
    switch (st) {
      case "paid":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30">
            <CheckCircle className="w-3 h-3" />
            <span>Paid</span>
          </span>
        );
      case "partial":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/30">
            <Clock className="w-3 h-3" />
            <span>Partial</span>
          </span>
        );
      case "unpaid":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-red-500/10 text-red-700 dark:text-red-300 border border-red-500/30">
            <AlertCircle className="w-3 h-3" />
            <span>Unpaid</span>
          </span>
        );
      case "overdue":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-rose-500/15 text-rose-800 dark:text-rose-300 border border-rose-500/40">
            <AlertCircle className="w-3 h-3" />
            <span>Overdue</span>
          </span>
        );
    }
  };

  const getCategoryBadge = (cat: StudentCategory) => {
    if (cat === "A") {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold bg-[#174D3A] text-white">
          <span>Cat A</span>
          <span className="text-[10px] text-emerald-200/90 font-normal">
            (1 Juz/wk)
          </span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold bg-[#C6A45A] text-[#103729]">
        <span>Cat B</span>
        <span className="text-[10px] text-[#103729]/80 font-normal">
          (½ Juz/wk)
        </span>
      </span>
    );
  };

  return (
    <div className="space-y-5">
      {/* Page Heading & Top CTA */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-foreground font-serif">
            Student Directory
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Manage student registrations, academic placements, and memorisation targets.
          </p>
        </div>

        <Link
          href="/students/new"
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#174D3A] text-white text-xs sm:text-sm font-semibold hover:bg-[#103729] transition shadow-xs ring-1 ring-[#C6A45A]/30 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Student</span>
        </Link>
      </div>

      {/* Filter and Search Controls */}
      <div className="bg-card text-card-foreground rounded-xl border border-border p-4 shadow-xs space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          {/* Search bar */}
          <div className="md:col-span-5 relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by student name, admission no, guardian..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="w-full pl-9 pr-4 py-2 rounded-lg bg-background border border-border text-xs focus:outline-hidden focus:ring-2 focus:ring-[#174D3A]"
            />
          </div>

          {/* Category Filter */}
          <div className="md:col-span-2">
            <select
              value={category}
              onChange={(e) => {
                setCategory(e.target.value as StudentCategory | "all");
                setPage(1);
              }}
              className="w-full px-3 py-2 rounded-lg bg-background border border-border text-xs focus:outline-hidden focus:ring-2 focus:ring-[#174D3A]"
            >
              <option value="all">All Categories</option>
              <option value="A">Category A (1 Juz/wk)</option>
              <option value="B">Category B (½ Juz/wk)</option>
            </select>
          </div>

          {/* Status Filter */}
          <div className="md:col-span-2">
            <select
              value={status}
              onChange={(e) => {
                setStatus(e.target.value as StudentStatus | "all");
                setPage(1);
              }}
              className="w-full px-3 py-2 rounded-lg bg-background border border-border text-xs focus:outline-hidden focus:ring-2 focus:ring-[#174D3A]"
            >
              <option value="all">All Statuses</option>
              <option value="active">Active Only</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          {/* Payment Status Filter */}
          <div className="md:col-span-3">
            <select
              value={paymentStatus}
              onChange={(e) => {
                setPaymentStatus(e.target.value as PaymentStatus | "all");
                setPage(1);
              }}
              className="w-full px-3 py-2 rounded-lg bg-background border border-border text-xs focus:outline-hidden focus:ring-2 focus:ring-[#174D3A]"
            >
              <option value="all">All Payment Statuses</option>
              <option value="paid">Paid</option>
              <option value="partial">Partial</option>
              <option value="unpaid">Unpaid</option>
              <option value="overdue">Overdue</option>
            </select>
          </div>
        </div>

        {/* Dynamic Count and Reset */}
        <div className="flex items-center justify-between pt-2 border-t border-border/60 text-xs text-muted-foreground">
          <div>
            Showing <strong className="text-foreground">{data.students.length}</strong> of{" "}
            <strong className="text-foreground">{data.total}</strong> students
            {isPending && <span className="ml-2 text-emerald-600 animate-pulse">• Updating...</span>}
          </div>

          {(search || category !== "all" || status !== "all" || paymentStatus !== "all") && (
            <button
              type="button"
              onClick={() => {
                setSearch("");
                setCategory("all");
                setStatus("all");
                setPaymentStatus("all");
                setPage(1);
              }}
              className="text-[#174D3A] dark:text-[#C6A45A] font-medium hover:underline"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Desktop Table View (Hidden on mobile) */}
      <div className="hidden md:block bg-card text-card-foreground rounded-xl border border-border shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-muted/60 border-b border-border font-semibold text-muted-foreground uppercase tracking-wider text-[11px]">
              <tr>
                <th
                  onClick={() => handleSort("admissionNumber")}
                  className="py-3 px-4 cursor-pointer hover:text-foreground"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Admission No</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort("fullName")}
                  className="py-3 px-4 cursor-pointer hover:text-foreground"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Student Name</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="py-3 px-4">Category</th>
                <th
                  onClick={() => handleSort("currentJuz")}
                  className="py-3 px-4 cursor-pointer hover:text-foreground"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Current Juz</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort("admissionDate")}
                  className="py-3 px-4 cursor-pointer hover:text-foreground"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Admission Date</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="py-3 px-4">Fee Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {data.students.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-muted-foreground">
                    <GraduationCap className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p className="font-semibold text-foreground text-sm">No students found</p>
                    <p className="text-xs mt-0.5">Try refining your search terms or filters.</p>
                  </td>
                </tr>
              ) : (
                data.students.map((student) => (
                  <tr
                    key={student.id}
                    className="hover:bg-muted/40 transition-colors group"
                  >
                    <td className="py-3.5 px-4 font-mono font-medium text-foreground">
                      <Link
                        href={`/students/${student.id}`}
                        className="hover:underline text-[#174D3A] dark:text-[#C6A45A] font-semibold"
                      >
                        {student.admissionNumber}
                      </Link>
                    </td>
                    <td className="py-3.5 px-4">
                      <div>
                        <Link
                          href={`/students/${student.id}`}
                          className="font-bold text-foreground hover:underline"
                        >
                          {student.fullName}
                        </Link>
                        <p className="text-[11px] text-muted-foreground">
                          Guardian: {student.guardianName} ({student.guardianPhone})
                        </p>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      {getCategoryBadge(student.category)}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-muted text-foreground font-semibold">
                        <BookOpen className="w-3 h-3 text-[#174D3A] dark:text-[#C6A45A]" />
                        <span>Juz {student.currentJuz} / 30</span>
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-muted-foreground">
                      {new Date(student.admissionDate).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                    <td className="py-3.5 px-4">
                      {getPaymentBadge(student.paymentStatus)}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link
                          href={`/students/${student.id}`}
                          className="p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition"
                          title="View Profile"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        <Link
                          href={`/students/${student.id}?edit=true`}
                          className="p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition"
                          title="Edit Student"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Student Cards View (Visible on mobile only) */}
      <div className="block md:hidden space-y-3">
        {data.students.length === 0 ? (
          <div className="bg-card border border-border rounded-xl p-8 text-center text-muted-foreground">
            <GraduationCap className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="font-semibold text-foreground text-sm">No students found</p>
            <p className="text-xs mt-0.5">Adjust search query or filter tags.</p>
          </div>
        ) : (
          data.students.map((student) => (
            <div
              key={student.id}
              className="bg-card text-card-foreground border border-border rounded-xl p-4 shadow-xs space-y-3"
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-muted text-[#174D3A] dark:text-[#C6A45A]">
                    {student.admissionNumber}
                  </span>
                  <h3 className="font-bold text-sm text-foreground mt-1">
                    <Link href={`/students/${student.id}`} className="hover:underline">
                      {student.fullName}
                    </Link>
                  </h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Guardian: {student.guardianName}
                  </p>
                </div>
                {getPaymentBadge(student.paymentStatus)}
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-border/60">
                <div>
                  <span className="text-muted-foreground block text-[10px] uppercase font-semibold">
                    Placement
                  </span>
                  <div className="mt-0.5">{getCategoryBadge(student.category)}</div>
                </div>
                <div>
                  <span className="text-muted-foreground block text-[10px] uppercase font-semibold">
                    Current Milestone
                  </span>
                  <span className="font-bold text-foreground">
                    Juz {student.currentJuz} / 30
                  </span>
                </div>
              </div>

              <div className="pt-2 border-t border-border/60 flex items-center justify-between">
                <span className="text-[11px] text-muted-foreground">
                  Admitted: {student.admissionDate}
                </span>
                <div className="flex items-center gap-2">
                  <Link
                    href={`/students/${student.id}`}
                    className="px-3 py-1 rounded-md bg-[#174D3A] text-white text-xs font-medium hover:bg-[#103729]"
                  >
                    View Profile
                  </Link>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination & Page Size Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-2">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span>Rows per page:</span>
          <select
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setPage(1);
            }}
            className="px-2 py-1 rounded border border-border bg-background text-foreground text-xs"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
          </select>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          <button
            type="button"
            disabled={page <= 1}
            onClick={() => setPage(page - 1)}
            className="p-1.5 rounded-md border border-border bg-card text-muted-foreground hover:text-foreground disabled:opacity-40 disabled:cursor-not-allowed"
            aria-label="Previous page"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <span className="text-xs font-medium text-foreground px-2">
            Page {data.page} of {data.totalPages}
          </span>

          <button
            type="button"
            disabled={page >= data.totalPages}
            onClick={() => setPage(page + 1)}
            className="p-1.5 rounded-md border border-border bg-card text-muted-foreground hover:text-foreground disabled:opacity-40 disabled:cursor-not-allowed"
            aria-label="Next page"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
