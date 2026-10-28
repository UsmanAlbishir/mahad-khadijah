"use client";

import React, { useState, ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/navigation";
import {
  User,
  ArrowLeft,
  CheckCircle2,
  Upload,
  AlertTriangle,
} from "lucide-react";
import { StudentCategory } from "@/types";
import { createTeacher } from "@/lib/mock-services";
import { MockFeedback, MockFeedbackNotice } from "@/components/ui/mock-feedback";

interface FormData {
  fullName: string;
  phone: string;
  email: string;
  dateOfBirth: string;
  address: string;
  qualifications: string;
  categorySelection: "A" | "B" | "both";
  role: string;
  photoPreview?: string;
}

const INITIAL_FORM: FormData = {
  fullName: "",
  phone: "",
  email: "",
  dateOfBirth: "1988-06-15",
  address: "",
  qualifications: "Hafiz al-Qur'an with Ijazah in Hafs 'an 'Asim",
  categorySelection: "both",
  role: "Tahfiz & Tajweed Instructor",
};

export function TeacherRegistrationForm() {
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
    const { name, value } = e.target;
    setIsDirty(true);
    setFormData((prev) => ({ ...prev, [name]: value }));

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
      newErrors.fullName = "Teacher full name is required.";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required.";
    } else {
      const digits = formData.phone.replace(/[^0-9]/g, "");
      if (digits.length < 9) {
        newErrors.phone = "Enter a valid phone number (at least 9 digits).";
      }
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email address is required.";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Enter a valid email address.";
    }

    if (!formData.address.trim()) {
      newErrors.address = "Residential address is required.";
    }

    if (!formData.qualifications.trim()) {
      newErrors.qualifications = "Memorisation credentials or Ijazah details are required.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      setIsSubmitting(true);

      const assignedCategories: StudentCategory[] =
        formData.categorySelection === "both"
          ? ["A", "B"]
          : [formData.categorySelection as StudentCategory];

      const newTeacher = await createTeacher({
        fullName: formData.fullName,
        phone: formData.phone,
        email: formData.email,
        dateOfBirth: formData.dateOfBirth,
        address: formData.address,
        qualifications: formData.qualifications,
        assignedCategories,
        role: formData.role,
        photoUrl: formData.photoPreview,
      });

      setFeedback({
        type: "success",
        title: "Instructor Registered (Mock Operation)",
        message: `${newTeacher.fullName} has been added with Employee ID ${newTeacher.employeeId}.`,
        meta: "Simulated in-memory save • No live Supabase database write",
      });

      setIsDirty(false);

      setTimeout(() => {
        router.push("/teachers");
      }, 1500);
    } catch {
      setFeedback({
        type: "warning",
        title: "Error Registering Teacher",
        message: "Failed to simulate teacher registration in demo session.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (isDirty) {
      setShowCancelModal(true);
    } else {
      router.push("/teachers");
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header & Back link */}
      <div className="flex items-center justify-between pb-3 border-b border-border">
        <button
          type="button"
          onClick={handleCancel}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Faculty Directory</span>
        </button>

        <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-muted text-[#174D3A] dark:text-[#C6A45A]">
          Auto Employee ID: MK-T-006
        </span>
      </div>

      <div>
        <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-foreground font-serif">
          Register New Tahfiz Instructor (Muhaffiz)
        </h2>
        <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
          Add an Ustadh or Ustadha to the halaqah faculty with their Qira’at credentials and category assignments.
        </p>
      </div>

      {feedback && (
        <MockFeedback notice={feedback} onClose={() => setFeedback(null)} />
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-card text-card-foreground rounded-xl border border-border p-5 shadow-xs space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-border">
            <div className="p-1.5 rounded-lg bg-[#174D3A]/10 text-[#174D3A] dark:text-[#C6A45A]">
              <User className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-foreground">
                Instructor Details & Credentials
              </h3>
              <p className="text-[11px] text-muted-foreground">
                Personal identity, contact details, and halaqah cohort allocation.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Full Name */}
            <div className="sm:col-span-2 space-y-1">
              <label className="text-xs font-semibold text-foreground">
                Full Name (including Title) <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="e.g. Ustadh Idris Al-Mustapha"
                className={`w-full px-3 py-2 rounded-lg bg-background border text-xs focus:outline-hidden focus:ring-2 focus:ring-[#174D3A] ${
                  errors.fullName ? "border-red-500" : "border-border"
                }`}
              />
              {errors.fullName && (
                <p className="text-[11px] text-red-500">{errors.fullName}</p>
              )}
            </div>

            {/* Role / Title */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-foreground">
                Institutional Role
              </label>
              <input
                type="text"
                name="role"
                value={formData.role}
                onChange={handleChange}
                placeholder="e.g. Tahfiz & Tajweed Instructor"
                className="w-full px-3 py-2 rounded-lg bg-background border border-border text-xs focus:outline-hidden focus:ring-2 focus:ring-[#174D3A]"
              />
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

            {/* Phone */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-foreground">
                Phone Number <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="e.g. +234 803 777 8899"
                className={`w-full px-3 py-2 rounded-lg bg-background border text-xs focus:outline-hidden focus:ring-2 focus:ring-[#174D3A] ${
                  errors.phone ? "border-red-500" : "border-border"
                }`}
              />
              {errors.phone && (
                <p className="text-[11px] text-red-500">{errors.phone}</p>
              )}
            </div>

            {/* Email */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-foreground">
                Email Address <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="e.g. idris.mustapha@madadkhadijah.sch.ng"
                className={`w-full px-3 py-2 rounded-lg bg-background border text-xs focus:outline-hidden focus:ring-2 focus:ring-[#174D3A] ${
                  errors.email ? "border-red-500" : "border-border"
                }`}
              />
              {errors.email && (
                <p className="text-[11px] text-red-500">{errors.email}</p>
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
                placeholder="e.g. No. 15 Rabah Road, Malali, Kaduna"
                className={`w-full px-3 py-2 rounded-lg bg-background border text-xs focus:outline-hidden focus:ring-2 focus:ring-[#174D3A] ${
                  errors.address ? "border-red-500" : "border-border"
                }`}
              />
              {errors.address && (
                <p className="text-[11px] text-red-500">{errors.address}</p>
              )}
            </div>

            {/* Memorisation Qualifications / Ijazah */}
            <div className="sm:col-span-2 space-y-1">
              <label className="text-xs font-semibold text-foreground">
                Memorisation Credentials & Ijazah Details <span className="text-red-500">*</span>
              </label>
              <textarea
                rows={2}
                name="qualifications"
                value={formData.qualifications}
                onChange={handleChange}
                placeholder="e.g. Hafiz al-Qur'an, Ijazah in Hafs & Warsh with connected Sanad, B.A. Islamic Studies"
                className={`w-full px-3 py-2 rounded-lg bg-background border text-xs focus:outline-hidden focus:ring-2 focus:ring-[#174D3A] ${
                  errors.qualifications ? "border-red-500" : "border-border"
                }`}
              />
              {errors.qualifications && (
                <p className="text-[11px] text-red-500">{errors.qualifications}</p>
              )}
            </div>

            {/* Assigned Category Placement */}
            <div className="sm:col-span-2 space-y-1">
              <label className="text-xs font-semibold text-foreground">
                Assigned Student Category Cohort
              </label>
              <select
                name="categorySelection"
                value={formData.categorySelection}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-lg bg-background border border-border text-xs focus:outline-hidden focus:ring-2 focus:ring-[#174D3A]"
              >
                <option value="both">Both Categories (A & B)</option>
                <option value="A">Category A Only (1 Juz/week pace)</option>
                <option value="B">Category B Only (½ Juz/week pace)</option>
              </select>
            </div>

            {/* Optional Photo Upload */}
            <div className="sm:col-span-2 space-y-1.5">
              <label className="text-xs font-semibold text-foreground">
                Instructor Photograph (Optional)
              </label>
              <div className="flex items-center gap-4">
                {formData.photoPreview ? (
                  <div className="w-14 h-14 rounded-xl overflow-hidden border-2 border-[#174D3A] shrink-0">
                    <img
                      src={formData.photoPreview}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-14 h-14 rounded-xl bg-muted border border-dashed border-border flex items-center justify-center text-muted-foreground shrink-0">
                    <Upload className="w-5 h-5 opacity-40" />
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="text-xs file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-muted file:text-foreground hover:file:bg-muted/80 cursor-pointer"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Submit Actions */}
        <div className="flex items-center justify-between pt-3 border-t border-border">
          <button
            type="button"
            onClick={handleCancel}
            className="px-4 py-2 rounded-xl border border-border text-xs font-semibold hover:bg-muted text-muted-foreground"
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
                <span>Registering Faculty...</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4 text-[#C6A45A]" />
                <span>Confirm Registration (Mock)</span>
              </>
            )}
          </button>
        </div>
      </form>

      {/* Discard Modal */}
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
                Discard Changes?
              </h3>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              You have entered instructor details that have not been submitted. Do you wish to discard?
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
                onClick={() => router.push("/teachers")}
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
