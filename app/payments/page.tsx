"use client";

import React, { useState } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { Plus, CheckCircle2, Search } from "lucide-react";
import { MOCK_PAYMENTS, MOCK_STUDENTS } from "@/lib/mock-data";
import { MockFeedback, MockFeedbackNotice } from "@/components/ui/mock-feedback";

export default function PaymentsPage() {
  const [payments, setPayments] = useState(MOCK_PAYMENTS);
  const [search, setSearch] = useState("");
  const [methodFilter, setMethodFilter] = useState("all");
  const [feedback, setFeedback] = useState<MockFeedbackNotice | null>(null);
  const [showPayModal, setShowPayModal] = useState(false);

  const [form, setForm] = useState({
    studentId: "std-005",
    amount: "75000",
    method: "bank_transfer" as "cash" | "bank_transfer" | "pos" | "cheque",
    reference: "MK-TRF-MOCK-901",
    description: "Second Term Tuition Deposit",
  });

  const handleRecordPayment = (e: React.FormEvent) => {
    e.preventDefault();
    const student = MOCK_STUDENTS.find((s) => s.id === form.studentId) || MOCK_STUDENTS[0];
    const newRecord = {
      id: `pay-${Date.now()}`,
      studentId: student.id,
      studentName: student.fullName,
      admissionNumber: student.admissionNumber,
      amount: Number(form.amount),
      date: new Date().toISOString().split("T")[0],
      method: form.method,
      reference: form.reference,
      term: "First Term",
      session: "2025/2026 Academic Session",
      status: "verified" as const,
      description: form.description,
    };

    setPayments([newRecord, ...payments]);
    setShowPayModal(false);
    setFeedback({
      type: "success",
      title: "Payment Receipt Issued (Mock Operation)",
      message: `Recorded payment of ₦${Number(form.amount).toLocaleString()} for ${student.fullName} (Ref: ${form.reference}).`,
      meta: "In-memory test ledger • No live database mutation",
    });
  };

  const filtered = payments.filter((p) => {
    const matchesSearch =
      p.studentName.toLowerCase().includes(search.toLowerCase()) ||
      p.admissionNumber.toLowerCase().includes(search.toLowerCase()) ||
      p.reference.toLowerCase().includes(search.toLowerCase());
    const matchesMethod = methodFilter === "all" || p.method === methodFilter;
    return matchesSearch && matchesMethod;
  });

  const totalSum = payments.reduce((acc, curr) => acc + curr.amount, 0);

  return (
    <AppShell>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-foreground font-serif">
              Tuition & Fee Collections Ledger
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
              Review verified receipts, bank transfers, and student tuition statuses.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowPayModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#174D3A] text-white text-xs sm:text-sm font-bold hover:bg-[#103729] transition shadow-xs ring-1 ring-[#C6A45A]/30 shrink-0"
          >
            <Plus className="w-4 h-4 text-[#C6A45A]" />
            <span>Record Payment Receipt (Mock)</span>
          </button>
        </div>

        {feedback && (
          <MockFeedback notice={feedback} onClose={() => setFeedback(null)} />
        )}

        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-card text-card-foreground rounded-xl border border-border p-5 shadow-xs">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Total Collections (First Term)
            </span>
            <h3 className="text-2xl font-extrabold text-foreground mt-1.5 font-serif">
              ₦{totalSum.toLocaleString()}
            </h3>
            <p className="text-xs text-muted-foreground mt-1">Across all verified talaba receipts</p>
          </div>

          <div className="bg-card text-card-foreground rounded-xl border border-border p-5 shadow-xs">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Issued Receipts Count
            </span>
            <h3 className="text-2xl font-extrabold text-[#174D3A] dark:text-[#C6A45A] mt-1.5 font-serif">
              {payments.length} Receipts
            </h3>
            <p className="text-xs text-muted-foreground mt-1">100% verified by bursary</p>
          </div>

          <div className="bg-card text-card-foreground rounded-xl border border-border p-5 shadow-xs">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Outstanding Balances
            </span>
            <h3 className="text-2xl font-extrabold text-amber-600 dark:text-amber-400 mt-1.5 font-serif">
              ₦220,000
            </h3>
            <p className="text-xs text-muted-foreground mt-1">3 students with partial or unpaid status</p>
          </div>
        </div>

        {/* Filter bar */}
        <div className="bg-card text-card-foreground rounded-xl border border-border p-4 shadow-xs flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by student name, admission no, receipt reference..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-lg bg-background border border-border text-xs"
            />
          </div>

          <select
            value={methodFilter}
            onChange={(e) => setMethodFilter(e.target.value)}
            className="px-3 py-2 rounded-lg bg-background border border-border text-xs"
          >
            <option value="all">All Payment Methods</option>
            <option value="bank_transfer">Bank Transfer</option>
            <option value="pos">POS Terminal</option>
            <option value="cash">Cash</option>
          </select>
        </div>

        {/* Ledger Table */}
        <div className="bg-card text-card-foreground rounded-xl border border-border shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-muted/60 border-b border-border font-semibold text-muted-foreground uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3 px-4">Receipt Ref</th>
                  <th className="py-3 px-4">Student</th>
                  <th className="py-3 px-4">Amount</th>
                  <th className="py-3 px-4">Method</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Description</th>
                  <th className="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.map((pay) => (
                  <tr key={pay.id} className="hover:bg-muted/30 transition">
                    <td className="py-3.5 px-4 font-mono font-bold text-[#174D3A] dark:text-[#C6A45A]">
                      {pay.reference}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-bold text-foreground block">{pay.studentName}</span>
                      <span className="font-mono text-[11px] text-muted-foreground">{pay.admissionNumber}</span>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-foreground">
                      ₦{pay.amount.toLocaleString()}
                    </td>
                    <td className="py-3.5 px-4 uppercase text-[11px] text-muted-foreground">
                      {pay.method.replace("_", " ")}
                    </td>
                    <td className="py-3.5 px-4 text-muted-foreground">{pay.date}</td>
                    <td className="py-3.5 px-4 text-foreground/80 max-w-xs truncate">{pay.description}</td>
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-800 dark:text-emerald-300">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Verified</span>
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal: Record Payment */}
        {showPayModal && (
          <div
            role="dialog"
            aria-modal="true"
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in"
          >
            <div className="bg-card text-card-foreground border border-border rounded-xl shadow-2xl max-w-md w-full p-6 space-y-4">
              <h3 className="text-base font-bold font-serif text-foreground">
                Issue Fee Receipt (Mock Payment)
              </h3>

              <form onSubmit={handleRecordPayment} className="space-y-3 text-xs">
                <div>
                  <label className="font-semibold block mb-1">Student</label>
                  <select
                    value={form.studentId}
                    onChange={(e) => setForm({ ...form, studentId: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-background border border-border"
                  >
                    {MOCK_STUDENTS.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.fullName} ({s.admissionNumber})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-semibold block mb-1">Amount (₦)</label>
                  <input
                    type="number"
                    value={form.amount}
                    onChange={(e) => setForm({ ...form, amount: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-background border border-border"
                  />
                </div>

                <div>
                  <label className="font-semibold block mb-1">Payment Method</label>
                  <select
                    value={form.method}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        method: e.target.value as "cash" | "bank_transfer" | "pos" | "cheque",
                      })
                    }
                    className="w-full px-3 py-2 rounded-lg bg-background border border-border"
                  >
                    <option value="bank_transfer">Bank Transfer</option>
                    <option value="pos">POS Terminal</option>
                    <option value="cash">Cash Counter</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold block mb-1">Receipt Reference</label>
                  <input
                    type="text"
                    value={form.reference}
                    onChange={(e) => setForm({ ...form, reference: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-background border border-border"
                  />
                </div>

                <div>
                  <label className="font-semibold block mb-1">Payment Description</label>
                  <input
                    type="text"
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-background border border-border"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t border-border">
                  <button
                    type="button"
                    onClick={() => setShowPayModal(false)}
                    className="px-3 py-1.5 rounded-lg border border-border text-xs font-semibold hover:bg-muted"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 rounded-lg bg-[#174D3A] text-white text-xs font-semibold hover:bg-[#103729]"
                  >
                    Confirm Receipt (Mock)
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
