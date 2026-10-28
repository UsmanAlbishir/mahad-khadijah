export type StudentCategory = "A" | "B";

export type StudentStatus = "active" | "inactive" | "graduated" | "suspended";

export type PaymentStatus = "paid" | "partial" | "unpaid" | "overdue";

export type ArabicLiteracyLevel = "beginner" | "intermediate" | "advanced";

export interface Student {
  id: string;
  admissionNumber: string;
  fullName: string;
  gender: "male" | "female";
  dateOfBirth: string;
  admissionDate: string;
  address: string;
  photoUrl?: string;
  guardianName: string;
  guardianPhone: string;
  guardianRelation: string;
  previousSchool?: string;
  arabicLiteracyLevel: ArabicLiteracyLevel;
  previousMemorisation: string;
  category: StudentCategory;
  academicSession: string;
  currentTerm: string;
  status: StudentStatus;
  paymentStatus: PaymentStatus;
  currentJuz: number;
  totalHizbCompleted: number;
  notes?: string;
  createdAt: string;
}

export interface Teacher {
  id: string;
  employeeId: string;
  fullName: string;
  phone: string;
  email: string;
  dateOfBirth: string;
  address: string;
  qualifications: string;
  assignedCategories: StudentCategory[];
  status: "active" | "on_leave" | "inactive";
  photoUrl?: string;
  joinedDate: string;
  role: string;
}

export interface AttendanceRecord {
  id: string;
  studentId: string;
  studentName: string;
  date: string;
  session: string;
  status: "present" | "absent" | "late" | "excused";
  remarks?: string;
}

export interface MemorisationRecord {
  id: string;
  studentId: string;
  date: string;
  juzNumber: number;
  surahStart: string;
  ayahStart: number;
  surahEnd: string;
  ayahEnd: number;
  status: "completed" | "in_progress" | "revision";
  grade: "Mumtaz (Excellent)" | "Jayyid Jiddan (Very Good)" | "Jayyid (Good)" | "Maqbool (Fair)" | "Needs Revision";
  teacherName: string;
  notes?: string;
}

export interface PaymentRecord {
  id: string;
  studentId: string;
  studentName: string;
  admissionNumber: string;
  amount: number;
  date: string;
  method: "cash" | "bank_transfer" | "pos" | "cheque";
  reference: string;
  term: string;
  session: string;
  status: "verified" | "pending" | "receipt_issued";
  description: string;
}

export interface AcademicSession {
  id: string;
  name: string;
  currentTerm: string;
  isCurrent: boolean;
  startDate: string;
  endDate: string;
}

export interface DashboardMetrics {
  totalStudents: number;
  activeTeachers: number;
  attendanceTodayPercentage: number;
  paymentsRecordedSum: number;
  categoryACount: number;
  categoryBCount: number;
  memorisationPaceWeekly: {
    weekLabel: string;
    catATargetMetPct: number;
    catBTargetMetPct: number;
  }[];
}
