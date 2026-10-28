"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  User,
  Phone,
  BookOpen,
  ClipboardCheck,
  CreditCard,
  History,
  CheckCircle2,
  Clock,
  Edit,
  Sparkles,
  ShieldAlert,
  X,
} from "lucide-react";
import {
  Student,
  MemorisationRecord,
  AttendanceRecord,
  PaymentRecord,
  StudentCategory,
  StudentStatus,
} from "@/types";
import {
  getStudentById,
  getStudentMemorisationRecords,
  getStudentAttendanceRecords,
  getStudentPaymentRecords,
  updateStudent,
} from "@/lib/mock-services";
import { MockFeedback, MockFeedbackNotice } from "@/components/ui/mock-feedback";

interface StudentProfileProps {
  studentId: string;
}

export function StudentProfile({ studentId }: StudentProfileProps) {
  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<
    "overview" | "memorisation" | "attendance" | "payments" | "history"
  >("overview");

  // Tab datasets
  const [memorisationRecords, setMemorisationRecords] = useState<MemorisationRecord[]>([]);
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [paymentRecords, setPaymentRecords] = useState<PaymentRecord[]>([]);
  const [feedback, setFeedback] = useState<MockFeedbackNotice | null>(null);

  // Edit Modal State
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    fullName: "",
    guardianPhone: "",
    address: "",
    category: "A" as StudentCategory,
    status: "active" as StudentStatus,
    notes: "",
  });

  useEffect(() => {
    async function loadStudentData() {
      try {
        setLoading(true);
        const st = await getStudentById(studentId);
        if (st) {
          setStudent(st);
          setEditForm({
            fullName: st.fullName,
            guardianPhone: st.guardianPhone,
            address: st.address,
            category: st.category,
            status: st.status,
            notes: st.notes || "",
          });

          // Fetch associated sub-records
          const [mems, atts, pays] = await Promise.all([
            getStudentMemorisationRecords(st.id),
            getStudentAttendanceRecords(st.id),
            getStudentPaymentRecords(st.id),
          ]);
          setMemorisationRecords(mems);
          setAttendanceRecords(atts);
          setPaymentRecords(pays);
        }
      } finally {
        setLoading(false);
      }
    }
    loadStudentData();
  }, [studentId]);

  const handleSaveEdit = async () => {
    if (!student) return;
    try {
      const updated = await updateStudent(student.id, editForm);
      setStudent(updated);
      setIsEditing(false);
      setFeedback({
        type: "success",
        title: "Profile Updated (Mock Operation)",
        message: `Updated profile details for ${updated.fullName}. Stored in active browser memory.`,
      });
    } catch {
      setFeedback({
        type: "warning",
        title: "Update Failed",
        message: "Failed to apply profile changes in demo session.",
      });
    }
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse max-w-5xl mx-auto">
        <div className="h-6 w-32 bg-muted rounded" />
        <div className="h-44 bg-card border border-border rounded-2xl" />
        <div className="h-64 bg-card border border-border rounded-2xl" />
      </div>
    );
  }

  // Graceful invalid route ID handling
  if (!student) {
    return (
      <div className="max-w-2xl mx-auto my-12 bg-card text-card-foreground border border-border rounded-2xl p-8 text-center space-y-4 shadow-sm">
        <div className="w-14 h-14 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 mx-auto flex items-center justify-center">
          <ShieldAlert className="w-7 h-7" />
        </div>
        <h2 className="text-xl font-bold font-serif text-foreground">
          Student Record Not Found
        </h2>
        <p className="text-xs text-muted-foreground leading-relaxed">
          The requested admission ID <code className="font-mono bg-muted px-1.5 py-0.5 rounded">{studentId}</code> does not correspond to an enrolled talib in this prototype session.
        </p>
        <div className="pt-2">
          <Link
            href="/students"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#174D3A] text-white text-xs font-semibold hover:bg-[#103729]"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Student Directory</span>
          </Link>
        </div>
      </div>
    );
  }

  const categoryBadge =
    student.category === "A" ? (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#174D3A] text-white shadow-xs">
        <BookOpen className="w-3.5 h-3.5 text-[#C6A45A]" />
        <span>Category A (1 Juz / Week)</span>
      </span>
    ) : (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#C6A45A] text-[#103729] shadow-xs">
        <BookOpen className="w-3.5 h-3.5 text-[#103729]" />
        <span>Category B (½ Juz / Week)</span>
      </span>
    );

  const statusBadge =
    student.status === "active" ? (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30">
        <CheckCircle2 className="w-3 h-3" />
        <span>Enrolled & Active</span>
      </span>
    ) : (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-rose-500/10 text-rose-700 dark:text-rose-300 border border-rose-500/30">
        <Clock className="w-3 h-3" />
        <span className="capitalize">{student.status}</span>
      </span>
    );

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Back button */}
      <div className="flex items-center justify-between pb-2 border-b border-border">
        <Link
          href="/students"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Student Directory</span>
        </Link>

        <button
          type="button"
          onClick={() => setIsEditing(true)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-card text-xs font-semibold hover:bg-muted text-foreground transition"
        >
          <Edit className="w-3.5 h-3.5" />
          <span>Edit Profile</span>
        </button>
      </div>

      {feedback && (
        <MockFeedback notice={feedback} onClose={() => setFeedback(null)} />
      )}

      {/* Hero Header Card */}
      <div className="bg-card text-card-foreground rounded-2xl border border-border p-6 shadow-xs relative overflow-hidden">
        {/* Subtle geometric pattern */}
        <div className="absolute right-0 top-0 bottom-0 w-1/4 opacity-5 pointer-events-none bg-islamic-pattern" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="flex items-start gap-4">
            {/* Avatar / Photo */}
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-[#174D3A] to-[#103729] text-[#C6A45A] font-bold text-2xl flex items-center justify-center shrink-0 shadow-md border-2 border-[#C6A45A]/30">
              {student.photoUrl ? (
                <img
                  src={student.photoUrl}
                  alt={student.fullName}
                  className="w-full h-full object-cover rounded-2xl"
                />
              ) : (
                student.fullName
                  .split(" ")
                  .map((n) => n[0])
                  .slice(0, 2)
                  .join("")
              )}
            </div>

            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-muted text-[#174D3A] dark:text-[#C6A45A]">
                  {student.admissionNumber}
                </span>
                {statusBadge}
                {categoryBadge}
              </div>

              <h2 className="text-xl sm:text-2xl font-extrabold text-foreground font-serif">
                {student.fullName}
              </h2>

              <p className="text-xs text-muted-foreground flex items-center gap-2">
                <span>Admitted: {student.admissionDate}</span>
                <span>•</span>
                <span>{student.academicSession}</span>
              </p>
            </div>
          </div>

          {/* Quick Metric Pills */}
          <div className="flex flex-wrap gap-2.5 sm:self-center">
            <div className="px-4 py-2 rounded-xl bg-muted/60 border border-border text-center">
              <span className="text-[10px] uppercase font-bold text-muted-foreground block">
                Current Level
              </span>
              <span className="text-base font-extrabold text-[#174D3A] dark:text-[#C6A45A]">
                Juz {student.currentJuz} / 30
              </span>
            </div>

            <div className="px-4 py-2 rounded-xl bg-muted/60 border border-border text-center">
              <span className="text-[10px] uppercase font-bold text-muted-foreground block">
                Hizb Total
              </span>
              <span className="text-base font-extrabold text-foreground">
                {student.totalHizbCompleted} Hizb
              </span>
            </div>

            <div className="px-4 py-2 rounded-xl bg-muted/60 border border-border text-center">
              <span className="text-[10px] uppercase font-bold text-muted-foreground block">
                Fee Status
              </span>
              <span className="text-base font-extrabold capitalize text-emerald-700 dark:text-emerald-400">
                {student.paymentStatus}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="border-b border-border flex items-center gap-2 overflow-x-auto scrollbar-none">
        {[
          { id: "overview", label: "Overview", icon: User },
          { id: "memorisation", label: "Qur’an Memorisation", icon: BookOpen },
          { id: "attendance", label: "Attendance Logs", icon: ClipboardCheck },
          { id: "payments", label: "Tuition & Fees", icon: CreditCard },
          { id: "history", label: "Academic History", icon: History },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`flex items-center gap-2 px-4 py-3 text-xs sm:text-sm font-semibold border-b-2 whitespace-nowrap transition cursor-pointer ${
                isActive
                  ? "border-[#174D3A] text-[#174D3A] dark:text-[#C6A45A] dark:border-[#C6A45A]"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB CONTENT: Overview */}
      {activeTab === "overview" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Personal Demographic Details */}
          <div className="bg-card text-card-foreground rounded-xl border border-border p-5 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-foreground pb-2 border-b border-border flex items-center gap-2">
              <User className="w-4 h-4 text-[#174D3A] dark:text-[#C6A45A]" />
              <span>Personal Information</span>
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-1 border-b border-border/50">
                <span className="text-muted-foreground">Full Name:</span>
                <span className="font-semibold text-foreground">{student.fullName}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-border/50">
                <span className="text-muted-foreground">Gender:</span>
                <span className="font-semibold text-foreground capitalize">{student.gender}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-border/50">
                <span className="text-muted-foreground">Date of Birth:</span>
                <span className="font-semibold text-foreground">{student.dateOfBirth}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-border/50">
                <span className="text-muted-foreground">Admission Date:</span>
                <span className="font-semibold text-foreground">{student.admissionDate}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-border/50">
                <span className="text-muted-foreground">Address:</span>
                <span className="font-semibold text-foreground text-right max-w-xs">{student.address}</span>
              </div>
            </div>
          </div>

          {/* Guardian & Educational Background */}
          <div className="bg-card text-card-foreground rounded-xl border border-border p-5 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-foreground pb-2 border-b border-border flex items-center gap-2">
              <Phone className="w-4 h-4 text-[#C6A45A]" />
              <span>Guardian & Prior Tahfiz Background</span>
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-1 border-b border-border/50">
                <span className="text-muted-foreground">Guardian Name:</span>
                <span className="font-semibold text-foreground">{student.guardianName} ({student.guardianRelation})</span>
              </div>
              <div className="flex justify-between py-1 border-b border-border/50">
                <span className="text-muted-foreground">Guardian Phone:</span>
                <a
                  href={`tel:${student.guardianPhone}`}
                  className="font-semibold text-[#174D3A] dark:text-[#C6A45A] hover:underline"
                >
                  {student.guardianPhone}
                </a>
              </div>
              <div className="flex justify-between py-1 border-b border-border/50">
                <span className="text-muted-foreground">Previous School:</span>
                <span className="font-semibold text-foreground">{student.previousSchool || "N/A"}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-border/50">
                <span className="text-muted-foreground">Arabic Literacy:</span>
                <span className="font-semibold text-foreground capitalize">{student.arabicLiteracyLevel}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-border/50">
                <span className="text-muted-foreground">Prior Memorisation:</span>
                <span className="font-semibold text-foreground">{student.previousMemorisation}</span>
              </div>
            </div>
          </div>

          {/* Teacher Notes & Observation */}
          <div className="md:col-span-2 bg-card text-card-foreground rounded-xl border border-border p-5 shadow-xs space-y-3">
            <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#C6A45A]" />
              <span>Muhaffiz Halaqah Notes</span>
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed bg-muted/40 p-3.5 rounded-lg border border-border">
              {student.notes || "No special instructional notes recorded for this talib yet."}
            </p>
          </div>
        </div>
      )}

      {/* TAB CONTENT: Memorisation */}
      {activeTab === "memorisation" && (
        <div className="space-y-6">
          {/* Target pacing status */}
          <div className="bg-card text-card-foreground rounded-xl border border-border p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold text-[#174D3A] dark:text-[#C6A45A] uppercase tracking-wider">
                Current Curriculum Standing
              </span>
              <h3 className="text-lg font-bold text-foreground mt-0.5">
                Juz {student.currentJuz} of 30 Completed
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Enrolled in <strong>Category {student.category}</strong> (
                {student.category === "A" ? "1 Juz / week accelerated pace" : "½ Juz / week steady pace"}
                ).
              </p>
            </div>

            <div className="w-full md:w-64 space-y-1.5">
              <div className="flex justify-between text-xs font-bold">
                <span>Total Qur’an Progress</span>
                <span>{Math.round((student.currentJuz / 30) * 100)}%</span>
              </div>
              <div className="h-3 w-full bg-muted rounded-full overflow-hidden p-0.5 border border-border">
                <div
                  className="h-full bg-gradient-to-r from-[#174D3A] to-[#237A52] rounded-full"
                  style={{ width: `${(student.currentJuz / 30) * 100}%` }}
                />
              </div>
            </div>
          </div>

          {/* Memorisation Log Table */}
          <div className="bg-card text-card-foreground rounded-xl border border-border shadow-xs overflow-hidden">
            <div className="p-4 border-b border-border flex items-center justify-between">
              <h4 className="text-sm font-bold text-foreground">
                Halaqah Sabqi & Assessment Evaluations
              </h4>
              <span className="text-xs text-muted-foreground font-mono">
                {memorisationRecords.length} records logged
              </span>
            </div>

            {memorisationRecords.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground">
                <BookOpen className="w-8 h-8 mx-auto mb-2 opacity-40" />
                <p className="text-sm font-semibold text-foreground">
                  No memorisation evaluations recorded yet
                </p>
                <p className="text-xs mt-0.5">
                  Assessments conducted by assigned Muhaffiz will display here.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-muted/60 border-b border-border text-muted-foreground font-semibold">
                    <tr>
                      <th className="py-2.5 px-4">Evaluation Date</th>
                      <th className="py-2.5 px-4">Juz Level</th>
                      <th className="py-2.5 px-4">Surah Range</th>
                      <th className="py-2.5 px-4">Grade</th>
                      <th className="py-2.5 px-4">Evaluating Muhaffiz</th>
                      <th className="py-2.5 px-4">Instructor Feedback</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {memorisationRecords.map((m) => (
                      <tr key={m.id} className="hover:bg-muted/30">
                        <td className="py-3 px-4 font-medium text-foreground">{m.date}</td>
                        <td className="py-3 px-4 font-bold text-[#174D3A] dark:text-[#C6A45A]">
                          Juz {m.juzNumber}
                        </td>
                        <td className="py-3 px-4">
                          {m.surahStart} ({m.ayahStart}) - {m.surahEnd} ({m.ayahEnd})
                        </td>
                        <td className="py-3 px-4">
                          <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-500/10 text-emerald-800 dark:text-emerald-300">
                            {m.grade}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-muted-foreground">{m.teacherName}</td>
                        <td className="py-3 px-4 text-foreground/80 italic">{m.notes}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB CONTENT: Attendance */}
      {activeTab === "attendance" && (
        <div className="space-y-6">
          <div className="bg-card text-card-foreground rounded-xl border border-border p-5 shadow-xs">
            <h4 className="text-sm font-bold text-foreground mb-3">
              Halaqah Attendance Record
            </h4>
            {attendanceRecords.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground">
                <ClipboardCheck className="w-8 h-8 mx-auto mb-2 opacity-40" />
                <p className="text-sm font-semibold text-foreground">
                  No daily attendance entries for this student
                </p>
              </div>
            ) : (
              <div className="divide-y divide-border">
                {attendanceRecords.map((att) => (
                  <div key={att.id} className="py-3 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-emerald-500" />
                      <div>
                        <p className="font-semibold text-foreground">{att.session}</p>
                        <p className="text-[11px] text-muted-foreground">{att.date}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="px-2 py-0.5 rounded text-[11px] font-semibold uppercase bg-emerald-500/10 text-emerald-700 dark:text-emerald-300">
                        {att.status}
                      </span>
                      {att.remarks && (
                        <p className="text-[11px] text-muted-foreground mt-0.5">{att.remarks}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB CONTENT: Payments */}
      {activeTab === "payments" && (
        <div className="space-y-6">
          <div className="bg-card text-card-foreground rounded-xl border border-border p-5 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-border mb-4">
              <div>
                <h4 className="text-sm font-bold text-foreground">
                  Fee Payments & Receipt Ledger
                </h4>
                <p className="text-xs text-muted-foreground">
                  Fictional Bursary payment records associated with Admission {student.admissionNumber}.
                </p>
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-muted text-foreground">
                Payment Status: <strong className="uppercase">{student.paymentStatus}</strong>
              </span>
            </div>

            {paymentRecords.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground">
                <CreditCard className="w-8 h-8 mx-auto mb-2 opacity-40" />
                <p className="text-sm font-semibold text-foreground">No payment records found</p>
                <p className="text-xs mt-0.5">Use &quot;Record Payment&quot; to issue an initial fee receipt.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {paymentRecords.map((pay) => (
                  <div
                    key={pay.id}
                    className="p-3.5 rounded-lg border border-border bg-muted/30 flex items-center justify-between text-xs"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-foreground">
                          ₦{pay.amount.toLocaleString()}
                        </span>
                        <span className="font-mono text-[11px] px-1.5 py-0.2 rounded bg-muted text-muted-foreground">
                          {pay.reference}
                        </span>
                      </div>
                      <p className="text-[11px] text-muted-foreground mt-0.5">
                        {pay.description} • {pay.method.toUpperCase()}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-500/10 text-emerald-800 dark:text-emerald-300">
                        {pay.status}
                      </span>
                      <p className="text-[11px] text-muted-foreground mt-0.5">{pay.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB CONTENT: History */}
      {activeTab === "history" && (
        <div className="bg-card text-card-foreground rounded-xl border border-border p-5 shadow-xs space-y-4">
          <h4 className="text-sm font-bold text-foreground pb-2 border-b border-border">
            Academic & Enrollment Timeline
          </h4>

          <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-border">
            <div className="relative">
              <span className="absolute -left-6 top-1 w-2.5 h-2.5 rounded-full bg-[#174D3A] ring-4 ring-card" />
              <p className="text-xs font-bold text-foreground">
                Admitted into Category {student.category}
              </p>
              <p className="text-[11px] text-muted-foreground">
                {student.admissionDate} • Registered under {student.academicSession}
              </p>
            </div>

            <div className="relative">
              <span className="absolute -left-6 top-1 w-2.5 h-2.5 rounded-full bg-[#C6A45A] ring-4 ring-card" />
              <p className="text-xs font-bold text-foreground">
                Baseline Literacy Assessed
              </p>
              <p className="text-[11px] text-muted-foreground">
                Level: {student.arabicLiteracyLevel} • Previous memorisation: {student.previousMemorisation}
              </p>
            </div>

            <div className="relative">
              <span className="absolute -left-6 top-1 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-4 ring-card" />
              <p className="text-xs font-bold text-foreground">
                Current Level Active (Juz {student.currentJuz})
              </p>
              <p className="text-[11px] text-muted-foreground">
                Target pace monitored weekly in halaqah circles.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Edit Profile Modal Dialog */}
      {isEditing && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in"
        >
          <div className="bg-card text-card-foreground border border-border rounded-xl shadow-2xl max-w-lg w-full p-6 space-y-4 relative">
            <button
              onClick={() => setIsEditing(false)}
              className="absolute top-4 right-4 p-1 rounded-md text-muted-foreground hover:text-foreground"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-base font-bold font-serif text-foreground">
              Edit Student Details (Mock Session)
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-semibold block mb-1">Full Name</label>
                <input
                  type="text"
                  value={editForm.fullName}
                  onChange={(e) =>
                    setEditForm({ ...editForm, fullName: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-lg bg-background border border-border"
                />
              </div>

              <div>
                <label className="font-semibold block mb-1">Guardian Phone</label>
                <input
                  type="text"
                  value={editForm.guardianPhone}
                  onChange={(e) =>
                    setEditForm({ ...editForm, guardianPhone: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-lg bg-background border border-border"
                />
              </div>

              <div>
                <label className="font-semibold block mb-1">Residential Address</label>
                <input
                  type="text"
                  value={editForm.address}
                  onChange={(e) =>
                    setEditForm({ ...editForm, address: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-lg bg-background border border-border"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold block mb-1">Placement Category</label>
                  <select
                    value={editForm.category}
                    onChange={(e) =>
                      setEditForm({
                        ...editForm,
                        category: e.target.value as StudentCategory,
                      })
                    }
                    className="w-full px-3 py-2 rounded-lg bg-background border border-border"
                  >
                    <option value="A">Category A (1 Juz/wk)</option>
                    <option value="B">Category B (½ Juz/wk)</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold block mb-1">Status</label>
                  <select
                    value={editForm.status}
                    onChange={(e) =>
                      setEditForm({
                        ...editForm,
                        status: e.target.value as StudentStatus,
                      })
                    }
                    className="w-full px-3 py-2 rounded-lg bg-background border border-border"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="graduated">Graduated</option>
                    <option value="suspended">Suspended</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-semibold block mb-1">Halaqah Notes</label>
                <textarea
                  rows={3}
                  value={editForm.notes}
                  onChange={(e) =>
                    setEditForm({ ...editForm, notes: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-lg bg-background border border-border"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-border">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-3 py-1.5 rounded-lg border border-border text-xs font-semibold hover:bg-muted"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveEdit}
                className="px-4 py-1.5 rounded-lg bg-[#174D3A] text-white text-xs font-semibold hover:bg-[#103729]"
              >
                Save Changes (Mock)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
