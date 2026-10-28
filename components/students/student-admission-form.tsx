"use client";

import React, { useState, ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/navigation";
import {
  User,
  Phone,
  BookOpen,
  CreditCard,
  Upload,
  AlertTriangle,
  ArrowLeft,
  CheckCircle2,
} from "lucide-react";
import { StudentCategory, ArabicLiteracyLevel } from "@/types";
import { createStudent } from "@/lib/mock-services";
import { MockFeedback, MockFeedbackNotice } from "@/components/ui/mock-feedback";

interface FormData {
  fullName: string;
  gender: "male" | "female";
  dateOfBirth: string;
  admissionDate: string;
  address: string;
  guardianName: string;
  guardianPhone: string;
  guardianRelation: string;
  previousSchool: string;
  arabicLiteracyLevel: ArabicLiteracyLevel;
  previousMemorisation: string;
  category: StudentCategory;
  academicSession: string;
  currentTerm: string;
  notes: string;
  photoPreview?: string;
  // Initial payment
  includePayment: boolean;
  paymentAmount: string;
  paymentDate: string;
  paymentMethod: "cash" | "bank_transfer" | "pos" | "cheque";
  paymentReference: string;
}

const INITIAL_FORM: FormData = {
  fullName: "",
  gender: "male",
  dateOfBirth: "2014-05-10",
  admissionDate: new Date().toISOString().split("T")[0],
  address: "",
  guardianName: "",
  guardianPhone: "",
  guardianRelation: "Father",
  previousSchool: "",
  arabicLiteracyLevel: "intermediate",
  previousMemorisation: "1 Juz (Juz Amma)",
  category: "A",
  academicSession: "2025/2026 Academic Session",
  currentTerm: "First Term",
  notes: "",
  includePayment: false,
  paymentAmount: "150000",
  paymentDate: new Date().toISOString().split("T")[0],
  paymentMethod: "bank_transfer",
  paymentReference: "",
};

export function StudentAdmissionForm() {
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>(INITIAL_FORM);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<MockFeedbackNotice | null>(null);
  const [isDirty, setIsDirty] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    setIsDirty(true);

    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }

    // Clear inline error when typing
    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const handlePhotoUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsDirty(true);
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({
          ...prev,
          photoPreview: reader.result as string,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Student full name is required.";
    } else if (formData.fullName.trim().length < 3) {
      newErrors.fullName = "Full name must be at least 3 characters.";
    }

    if (!formData.admissionDate) {
      newErrors.admissionDate = "Admission date is required.";
    }

    if (!formData.address.trim()) {
      newErrors.address = "Residential address is required.";
    }

    if (!formData.guardianName.trim()) {
      newErrors.guardianName = "Guardian name is required.";
    }

    if (!formData.guardianPhone.trim()) {
      newErrors.guardianPhone = "Guardian phone number is required.";
    } else {
      const phoneDigits = formData.guardianPhone.replace(/[^0-9]/g, "");
      if (phoneDigits.length < 9) {
        newErrors.guardianPhone = "Enter a valid phone number (at least 9 digits).";
      }
    }

    if (formData.includePayment) {
      const amount = Number(formData.paymentAmount);
      if (isNaN(amount) || amount <= 0) {
        newErrors.paymentAmount = "Payment amount must be greater than zero.";
      }
      if (!formData.paymentReference.trim()) {
        newErrors.paymentReference = "Payment reference or receipt number is required.";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      // Scroll to top of errors
      window.scrollTo({ top: 120, behavior: "smooth" });
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await createStudent({
        fullName: formData.fullName,
        gender: formData.gender,
        dateOfBirth: formData.dateOfBirth,
        admissionDate: formData.admissionDate,
        address: formData.address,
        guardianName: formData.guardianName,
        guardianPhone: formData.guardianPhone,
        guardianRelation: formData.guardianRelation,
        previousSchool: formData.previousSchool,
        arabicLiteracyLevel: formData.arabicLiteracyLevel,
        previousMemorisation: formData.previousMemorisation,
        category: formData.category,
        academicSession: formData.academicSession,
        currentTerm: formData.currentTerm,
        notes: formData.notes,
        photoUrl: formData.photoPreview,
        initialPayment: formData.includePayment
          ? {
              includePayment: true,
              amount: Number(formData.paymentAmount),
              paymentDate: formData.paymentDate,
              method: formData.paymentMethod,
              reference: formData.paymentReference,
            }
          : undefined,
      });

      setFeedback({
        type: "success",
        title: "Student Admitted Successfully (Mock Operation)",
        message: `${res.student.fullName} has been assigned Admission No ${res.student.admissionNumber} and placed into Category ${res.student.category}.`,
        meta: "Simulated in-memory save • No live Supabase database mutation performed",
      });

      setIsDirty(false);

      // Redirect to newly admitted student's profile after brief delay
      setTimeout(() => {
        router.push(`/students/${res.student.id}`);
      }, 1600);
    } catch {
      setFeedback({
        type: "warning",
        title: "Simulation Error",
        message: "Failed to simulate student admission. Please check input values.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (isDirty) {
      setShowCancelModal(true);
    } else {
      router.push("/students");
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header & Back Link */}
      <div className="flex items-center justify-between pb-3 border-b border-border">
        <button
          type="button"
          onClick={handleCancel}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Students Directory</span>
        </button>

        <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-muted text-[#174D3A] dark:text-[#C6A45A]">
          Auto-generating Admission No: MK/2026/011
        </span>
      </div>

      <div>
        <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-foreground font-serif">
          New Student Admission (Talib Registration)
        </h2>
        <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
          Enroll a new talib into Madad Khadijah Litahfizil Qur’an. Complete personal, guardian, and placement details.
        </p>
      </div>

      {/* Feedback banner */}
      {feedback && (
        <MockFeedback notice={feedback} onClose={() => setFeedback(null)} />
      )}

      {/* Main Multi-section Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* SECTION 1: Personal Information */}
        <div className="bg-card text-card-foreground rounded-xl border border-border p-5 shadow-xs space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-border">
            <div className="p-1.5 rounded-lg bg-[#174D3A]/10 text-[#174D3A] dark:text-[#C6A45A]">
              <User className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-foreground">
                1. Personal Information
              </h3>
              <p className="text-[11px] text-muted-foreground">
                Student demographic identity and admission record.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Full Name */}
            <div className="sm:col-span-2 space-y-1">
              <label className="text-xs font-semibold text-foreground">
                Student Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="e.g. Zayn Al-Abidin Bello"
                className={`w-full px-3 py-2 rounded-lg bg-background border text-xs focus:outline-hidden focus:ring-2 focus:ring-[#174D3A] ${
                  errors.fullName ? "border-red-500" : "border-border"
                }`}
              />
              {errors.fullName && (
                <p className="text-[11px] text-red-500">{errors.fullName}</p>
              )}
            </div>

            {/* Admission Number (System generated preview) */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-foreground">
                Admission Number
              </label>
              <div className="px-3 py-2 rounded-lg bg-muted/60 border border-border text-xs font-mono text-muted-foreground flex items-center justify-between">
                <span>MK/2026/011</span>
                <span className="text-[10px] uppercase font-semibold text-[#174D3A] dark:text-[#C6A45A]">
                  System Generated
                </span>
              </div>
            </div>

            {/* Gender */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-foreground">
                Gender <span className="text-red-500">*</span>
              </label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-lg bg-background border border-border text-xs focus:outline-hidden focus:ring-2 focus:ring-[#174D3A]"
              >
                <option value="male">Male (Boy)</option>
                <option value="female">Female (Girl)</option>
              </select>
            </div>

            {/* Date of Birth */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-foreground">
                Date of Birth
              </label>
              <input
                type="date"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-lg bg-background border border-border text-xs focus:outline-hidden focus:ring-2 focus:ring-[#174D3A]"
              />
            </div>

            {/* Date of Admission */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-foreground">
                Date of Admission <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                name="admissionDate"
                value={formData.admissionDate}
                onChange={handleChange}
                className={`w-full px-3 py-2 rounded-lg bg-background border text-xs focus:outline-hidden focus:ring-2 focus:ring-[#174D3A] ${
                  errors.admissionDate ? "border-red-500" : "border-border"
                }`}
              />
              {errors.admissionDate && (
                <p className="text-[11px] text-red-500">{errors.admissionDate}</p>
              )}
            </div>

            {/* Residential Address */}
            <div className="sm:col-span-2 space-y-1">
              <label className="text-xs font-semibold text-foreground">
                Residential Address <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="e.g. No. 12 Sultan Road, Kaduna"
                className={`w-full px-3 py-2 rounded-lg bg-background border text-xs focus:outline-hidden focus:ring-2 focus:ring-[#174D3A] ${
                  errors.address ? "border-red-500" : "border-border"
                }`}
              />
              {errors.address && (
                <p className="text-[11px] text-red-500">{errors.address}</p>
              )}
            </div>

            {/* Optional Photo Upload */}
            <div className="sm:col-span-2 space-y-1.5">
              <label className="text-xs font-semibold text-foreground">
                Student Passport Photo (Optional)
              </label>
              <div className="flex items-center gap-4">
                {formData.photoPreview ? (
                  <div className="relative w-16 h-16 rounded-xl overflow-hidden border-2 border-[#174D3A] shrink-0">
                    <img
                      src={formData.photoPreview}
                      alt="Student Preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-16 h-16 rounded-xl bg-muted border border-dashed border-border flex items-center justify-center text-muted-foreground shrink-0">
                    <Upload className="w-5 h-5 opacity-50" />
                  </div>
                )}
                <div className="flex-1">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="text-xs file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-muted file:text-foreground hover:file:bg-muted/80 cursor-pointer"
                  />
                  <p className="text-[10px] text-muted-foreground mt-1">
                    PNG, JPG, or WebP preview handled locally in-browser.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 2: Guardian and Educational Background */}
        <div className="bg-card text-card-foreground rounded-xl border border-border p-5 shadow-xs space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-border">
            <div className="p-1.5 rounded-lg bg-[#C6A45A]/15 text-[#A87518] dark:text-[#C6A45A]">
              <Phone className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-foreground">
                2. Guardian & Educational Background
              </h3>
              <p className="text-[11px] text-muted-foreground">
                Contact information, past school, and baseline Arabic literacy.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Guardian Full Name */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-foreground">
                Father / Guardian Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="guardianName"
                value={formData.guardianName}
                onChange={handleChange}
                placeholder="e.g. Alhaji Bello Sanusi"
                className={`w-full px-3 py-2 rounded-lg bg-background border text-xs focus:outline-hidden focus:ring-2 focus:ring-[#174D3A] ${
                  errors.guardianName ? "border-red-500" : "border-border"
                }`}
              />
              {errors.guardianName && (
                <p className="text-[11px] text-red-500">{errors.guardianName}</p>
              )}
            </div>

            {/* Guardian Relationship */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-foreground">
                Relationship
              </label>
              <select
                name="guardianRelation"
                value={formData.guardianRelation}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-lg bg-background border border-border text-xs focus:outline-hidden focus:ring-2 focus:ring-[#174D3A]"
              >
                <option value="Father">Father</option>
                <option value="Mother">Mother</option>
                <option value="Uncle">Uncle</option>
                <option value="Guardian">Legal Guardian</option>
              </select>
            </div>

            {/* Guardian Phone */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-foreground">
                Guardian Phone Number <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                name="guardianPhone"
                value={formData.guardianPhone}
                onChange={handleChange}
                placeholder="e.g. +234 803 123 4567"
                className={`w-full px-3 py-2 rounded-lg bg-background border text-xs focus:outline-hidden focus:ring-2 focus:ring-[#174D3A] ${
                  errors.guardianPhone ? "border-red-500" : "border-border"
                }`}
              />
              {errors.guardianPhone && (
                <p className="text-[11px] text-red-500">{errors.guardianPhone}</p>
              )}
            </div>

            {/* Previous School */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-foreground">
                Previous School (Optional)
              </label>
              <input
                type="text"
                name="previousSchool"
                value={formData.previousSchool}
                onChange={handleChange}
                placeholder="e.g. Standard Model School"
                className="w-full px-3 py-2 rounded-lg bg-background border border-border text-xs focus:outline-hidden focus:ring-2 focus:ring-[#174D3A]"
              />
            </div>

            {/* Arabic Literacy Level */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-foreground">
                Arabic Literacy Level
              </label>
              <select
                name="arabicLiteracyLevel"
                value={formData.arabicLiteracyLevel}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-lg bg-background border border-border text-xs focus:outline-hidden focus:ring-2 focus:ring-[#174D3A]"
              >
                <option value="beginner">Beginner (Basic Letters & Vowels)</option>
                <option value="intermediate">Intermediate (Fluent Reading with Tajweed)</option>
                <option value="advanced">Advanced (Complete Tajweed & Tartil)</option>
              </select>
            </div>

            {/* Previous Qur'an Memorisation */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-foreground">
                Previous Memorisation Level
              </label>
              <input
                type="text"
                name="previousMemorisation"
                value={formData.previousMemorisation}
                onChange={handleChange}
                placeholder="e.g. 2 Juz (Juz Amma & Tabarak)"
                className="w-full px-3 py-2 rounded-lg bg-background border border-border text-xs focus:outline-hidden focus:ring-2 focus:ring-[#174D3A]"
              />
            </div>
          </div>
        </div>

        {/* SECTION 3: Academic Placement */}
        <div className="bg-card text-card-foreground rounded-xl border border-border p-5 shadow-xs space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-border">
            <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-700 dark:text-emerald-300">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-foreground">
                3. Academic Placement & Memorisation Category
              </h3>
              <p className="text-[11px] text-muted-foreground">
                Select the target memorisation pace and halaqah cohort.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Category Option A Card */}
            <label
              className={`p-4 rounded-xl border-2 cursor-pointer transition flex flex-col justify-between ${
                formData.category === "A"
                  ? "border-[#174D3A] bg-[#174D3A]/5 shadow-xs"
                  : "border-border hover:border-border/80"
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="category"
                      value="A"
                      checked={formData.category === "A"}
                      onChange={handleChange}
                      className="text-[#174D3A] focus:ring-[#174D3A]"
                    />
                    <span className="font-bold text-sm text-foreground">
                      Category A
                    </span>
                  </div>
                  <p className="text-xs font-semibold text-[#174D3A] dark:text-[#C6A45A] mt-1">
                    Target: 1 Juz Per Week
                  </p>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#174D3A] text-white">
                  Accelerated
                </span>
              </div>
              <p className="text-[11px] text-muted-foreground mt-2 leading-relaxed">
                Intensive track tailored for talaba with strong retention and daily disciplined revision circles.
              </p>
            </label>

            {/* Category Option B Card */}
            <label
              className={`p-4 rounded-xl border-2 cursor-pointer transition flex flex-col justify-between ${
                formData.category === "B"
                  ? "border-[#C6A45A] bg-[#C6A45A]/5 shadow-xs"
                  : "border-border hover:border-border/80"
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="category"
                      value="B"
                      checked={formData.category === "B"}
                      onChange={handleChange}
                      className="text-[#C6A45A] focus:ring-[#C6A45A]"
                    />
                    <span className="font-bold text-sm text-foreground">
                      Category B
                    </span>
                  </div>
                  <p className="text-xs font-semibold text-[#A87518] dark:text-[#E8D8A7] mt-1">
                    Target: ½ Juz Per Week
                  </p>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#C6A45A] text-[#103729]">
                  Standard
                </span>
              </div>
              <p className="text-[11px] text-muted-foreground mt-2 leading-relaxed">
                Balanced track emphasizing thorough phonetics (Tajweed), pronunciation, and steady retention.
              </p>
            </label>

            {/* Academic Session */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-foreground">
                Academic Session
              </label>
              <select
                name="academicSession"
                value={formData.academicSession}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-lg bg-background border border-border text-xs focus:outline-hidden focus:ring-2 focus:ring-[#174D3A]"
              >
                <option value="2025/2026 Academic Session">
                  2025/2026 Academic Session (Current)
                </option>
              </select>
            </div>

            {/* Term */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-foreground">
                Term Placement
              </label>
              <select
                name="currentTerm"
                value={formData.currentTerm}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-lg bg-background border border-border text-xs focus:outline-hidden focus:ring-2 focus:ring-[#174D3A]"
              >
                <option value="First Term">First Term</option>
                <option value="Second Term">Second Term</option>
                <option value="Third Term">Third Term</option>
              </select>
            </div>
          </div>
        </div>

        {/* SECTION 4: Initial Payment (Optional) */}
        <div className="bg-card text-card-foreground rounded-xl border border-border p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-border">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-700 dark:text-amber-300">
                <CreditCard className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-foreground">
                  4. Initial Tuition & Fee Payment (Optional)
                </h3>
                <p className="text-[11px] text-muted-foreground">
                  Record an admission deposit or term payment now, or defer to Bursary later.
                </p>
              </div>
            </div>

            <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold">
              <input
                type="checkbox"
                name="includePayment"
                checked={formData.includePayment}
                onChange={handleChange}
                className="rounded border-border text-[#174D3A] focus:ring-[#174D3A]"
              />
              <span>Record Initial Payment</span>
            </label>
          </div>

          {formData.includePayment && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 animate-in fade-in">
              {/* Payment Amount */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-foreground">
                  Payment Amount (NGN ₦) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="paymentAmount"
                  value={formData.paymentAmount}
                  onChange={handleChange}
                  placeholder="150000"
                  className={`w-full px-3 py-2 rounded-lg bg-background border text-xs focus:outline-hidden focus:ring-2 focus:ring-[#174D3A] ${
                    errors.paymentAmount ? "border-red-500" : "border-border"
                  }`}
                />
                {errors.paymentAmount && (
                  <p className="text-[11px] text-red-500">{errors.paymentAmount}</p>
                )}
              </div>

              {/* Payment Date */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-foreground">
                  Payment Date
                </label>
                <input
                  type="date"
                  name="paymentDate"
                  value={formData.paymentDate}
                  onChange={handleChange}
                  className="w-full px-3 py-2 rounded-lg bg-background border border-border text-xs focus:outline-hidden focus:ring-2 focus:ring-[#174D3A]"
                />
              </div>

              {/* Payment Method */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-foreground">
                  Payment Method
                </label>
                <select
                  name="paymentMethod"
                  value={formData.paymentMethod}
                  onChange={handleChange}
                  className="w-full px-3 py-2 rounded-lg bg-background border border-border text-xs focus:outline-hidden focus:ring-2 focus:ring-[#174D3A]"
                >
                  <option value="bank_transfer">Direct Bank Transfer</option>
                  <option value="pos">POS Terminal</option>
                  <option value="cash">Bursary Cash Counter</option>
                  <option value="cheque">Bank Draft / Cheque</option>
                </select>
              </div>

              {/* Reference */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-foreground">
                  Payment Reference / Bank Ref <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="paymentReference"
                  value={formData.paymentReference}
                  onChange={handleChange}
                  placeholder="e.g. MK-TRF-2026-99"
                  className={`w-full px-3 py-2 rounded-lg bg-background border text-xs focus:outline-hidden focus:ring-2 focus:ring-[#174D3A] ${
                    errors.paymentReference ? "border-red-500" : "border-border"
                  }`}
                />
                {errors.paymentReference && (
                  <p className="text-[11px] text-red-500">
                    {errors.paymentReference}
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-4 border-t border-border">
          <button
            type="button"
            onClick={handleCancel}
            className="px-4 py-2 rounded-xl border border-border text-xs sm:text-sm font-semibold hover:bg-muted text-muted-foreground hover:text-foreground transition"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#174D3A] text-white text-xs sm:text-sm font-bold hover:bg-[#103729] disabled:opacity-50 transition shadow-md ring-1 ring-[#C6A45A]/30 cursor-pointer"
          >
            {isSubmitting ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Simulating Admission Save...</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4 text-[#C6A45A]" />
                <span>Complete Student Admission</span>
              </>
            )}
          </button>
        </div>
      </form>

      {/* Discard Changes Confirmation Dialog */}
      {showCancelModal && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in"
        >
          <div className="bg-card text-card-foreground border border-border rounded-xl shadow-2xl max-w-sm w-full p-6 space-y-4">
            <div className="flex items-center gap-3 text-amber-600 dark:text-amber-400">
              <AlertTriangle className="w-6 h-6 shrink-0" />
              <h3 className="text-base font-bold text-foreground">
                Discard Admission Form?
              </h3>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              You have entered student details that have not been submitted. If you leave now, these changes will be discarded.
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowCancelModal(false)}
                className="px-3 py-1.5 rounded-lg border border-border text-xs font-semibold hover:bg-muted"
              >
                Keep Editing
              </button>
              <button
                type="button"
                onClick={() => router.push("/students")}
                className="px-3 py-1.5 rounded-lg bg-red-600 text-white text-xs font-semibold hover:bg-red-700"
              >
                Discard & Exit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
