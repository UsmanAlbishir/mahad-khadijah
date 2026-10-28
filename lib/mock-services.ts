import {
  Student,
  Teacher,
  AttendanceRecord,
  MemorisationRecord,
  PaymentRecord,
  DashboardMetrics,
  StudentCategory,
  StudentStatus,
  PaymentStatus,
} from "@/types";
import {
  MOCK_STUDENTS,
  MOCK_TEACHERS,
  MOCK_ATTENDANCE_RECORDS,
  MOCK_MEMORISATION_RECORDS,
  MOCK_PAYMENTS,
  MOCK_ACADEMIC_SESSIONS,
  MOCK_RECENT_ACTIVITIES,
} from "./mock-data";

// In-memory runtime stores for dynamic prototype interaction during active browser session
let studentsStore: Student[] = [...MOCK_STUDENTS];
let teachersStore: Teacher[] = [...MOCK_TEACHERS];
let paymentsStore: PaymentRecord[] = [...MOCK_PAYMENTS];
const memorisationStore: MemorisationRecord[] = [...MOCK_MEMORISATION_RECORDS];
const attendanceStore: AttendanceRecord[] = [...MOCK_ATTENDANCE_RECORDS];

// Helper to simulate network latency for realistic UX loading states
const delay = (ms = 200) => new Promise((resolve) => setTimeout(resolve, ms));

export interface StudentFilterParams {
  search?: string;
  category?: StudentCategory | "all";
  status?: StudentStatus | "all";
  paymentStatus?: PaymentStatus | "all";
  page?: number;
  pageSize?: number;
  sortBy?: "fullName" | "admissionNumber" | "admissionDate" | "currentJuz";
  sortOrder?: "asc" | "desc";
}

export interface StudentListResult {
  students: Student[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface TeacherFilterParams {
  search?: string;
  category?: StudentCategory | "both" | "all";
  status?: "active" | "on_leave" | "inactive" | "all";
}

// Student Services
export async function getStudents(
  params: StudentFilterParams = {}
): Promise<StudentListResult> {
  await delay(180);

  const {
    search = "",
    category = "all",
    status = "all",
    paymentStatus = "all",
    page = 1,
    pageSize = 10,
    sortBy = "admissionNumber",
    sortOrder = "asc",
  } = params;

  let filtered = [...studentsStore];

  if (search.trim()) {
    const q = search.trim().toLowerCase();
    filtered = filtered.filter(
      (s) =>
        s.fullName.toLowerCase().includes(q) ||
        s.admissionNumber.toLowerCase().includes(q) ||
        s.guardianName.toLowerCase().includes(q) ||
        s.guardianPhone.toLowerCase().includes(q)
    );
  }

  if (category !== "all") {
    filtered = filtered.filter((s) => s.category === category);
  }

  if (status !== "all") {
    filtered = filtered.filter((s) => s.status === status);
  }

  if (paymentStatus !== "all") {
    filtered = filtered.filter((s) => s.paymentStatus === paymentStatus);
  }

  // Sorting
  filtered.sort((a, b) => {
    let cmp = 0;
    if (sortBy === "fullName") {
      cmp = a.fullName.localeCompare(b.fullName);
    } else if (sortBy === "admissionNumber") {
      cmp = a.admissionNumber.localeCompare(b.admissionNumber);
    } else if (sortBy === "admissionDate") {
      cmp = new Date(a.admissionDate).getTime() - new Date(b.admissionDate).getTime();
    } else if (sortBy === "currentJuz") {
      cmp = a.currentJuz - b.currentJuz;
    }
    return sortOrder === "desc" ? -cmp : cmp;
  });

  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const validPage = Math.min(Math.max(1, page), totalPages);
  const startIndex = (validPage - 1) * pageSize;
  const paginated = filtered.slice(startIndex, startIndex + pageSize);

  return {
    students: paginated,
    total,
    page: validPage,
    pageSize,
    totalPages,
  };
}

export async function getStudentById(id: string): Promise<Student | null> {
  await delay(150);
  const found = studentsStore.find((s) => s.id === id || s.admissionNumber === id);
  return found ? { ...found } : null;
}

export interface CreateStudentPayload {
  fullName: string;
  gender: "male" | "female";
  dateOfBirth: string;
  admissionDate: string;
  address: string;
  guardianName: string;
  guardianPhone: string;
  guardianRelation: string;
  previousSchool?: string;
  arabicLiteracyLevel: "beginner" | "intermediate" | "advanced";
  previousMemorisation: string;
  category: StudentCategory;
  academicSession: string;
  currentTerm: string;
  notes?: string;
  photoUrl?: string;
  initialPayment?: {
    includePayment: boolean;
    amount?: number;
    paymentDate?: string;
    method?: "cash" | "bank_transfer" | "pos" | "cheque";
    reference?: string;
  };
}

export async function createStudent(
  payload: CreateStudentPayload
): Promise<{ student: Student; paymentRecord?: PaymentRecord }> {
  await delay(350);

  // Generate next admission number
  const year = new Date().getFullYear();
  const nextNum = String(studentsStore.length + 1).padStart(3, "0");
  const admissionNumber = `MK/${year}/${nextNum}`;
  const id = `std-${Date.now()}`;

  const hasPayment =
    payload.initialPayment?.includePayment &&
    (payload.initialPayment.amount || 0) > 0;

  const newStudent: Student = {
    id,
    admissionNumber,
    fullName: payload.fullName.trim(),
    gender: payload.gender,
    dateOfBirth: payload.dateOfBirth,
    admissionDate: payload.admissionDate,
    address: payload.address.trim(),
    guardianName: payload.guardianName.trim(),
    guardianPhone: payload.guardianPhone.trim(),
    guardianRelation: payload.guardianRelation,
    previousSchool: payload.previousSchool?.trim() || "N/A",
    arabicLiteracyLevel: payload.arabicLiteracyLevel,
    previousMemorisation: payload.previousMemorisation.trim() || "None",
    category: payload.category,
    academicSession: payload.academicSession,
    currentTerm: payload.currentTerm,
    status: "active",
    paymentStatus: hasPayment ? "paid" : "unpaid",
    currentJuz: 1,
    totalHizbCompleted: 0,
    notes: payload.notes?.trim() || "",
    photoUrl: payload.photoUrl,
    createdAt: new Date().toISOString(),
  };

  // Add to front of store
  studentsStore = [newStudent, ...studentsStore];

  let paymentRecord: PaymentRecord | undefined;

  if (hasPayment && payload.initialPayment) {
    paymentRecord = {
      id: `pay-${Date.now()}`,
      studentId: newStudent.id,
      studentName: newStudent.fullName,
      admissionNumber: newStudent.admissionNumber,
      amount: payload.initialPayment.amount || 0,
      date: payload.initialPayment.paymentDate || new Date().toISOString().split("T")[0],
      method: payload.initialPayment.method || "bank_transfer",
      reference: payload.initialPayment.reference || `MK-MOCK-${Date.now().toString().slice(-6)}`,
      term: newStudent.currentTerm,
      session: newStudent.academicSession,
      status: "verified",
      description: "Initial Admission Term Payment",
    };
    paymentsStore = [paymentRecord, ...paymentsStore];
  }

  return { student: newStudent, paymentRecord };
}

export async function updateStudent(
  id: string,
  partial: Partial<Student>
): Promise<Student> {
  await delay(250);
  const index = studentsStore.findIndex((s) => s.id === id);
  if (index === -1) {
    throw new Error(`Student with id "${id}" not found.`);
  }

  studentsStore[index] = {
    ...studentsStore[index],
    ...partial,
  };

  return { ...studentsStore[index] };
}

// Teacher Services
export async function getTeachers(
  params: TeacherFilterParams = {}
): Promise<Teacher[]> {
  await delay(180);
  const { search = "", category = "all", status = "all" } = params;

  let filtered = [...teachersStore];

  if (search.trim()) {
    const q = search.trim().toLowerCase();
    filtered = filtered.filter(
      (t) =>
        t.fullName.toLowerCase().includes(q) ||
        t.employeeId.toLowerCase().includes(q) ||
        t.email.toLowerCase().includes(q) ||
        t.phone.toLowerCase().includes(q)
    );
  }

  if (category !== "all") {
    if (category === "both") {
      filtered = filtered.filter(
        (t) => t.assignedCategories.includes("A") && t.assignedCategories.includes("B")
      );
    } else {
      filtered = filtered.filter((t) => t.assignedCategories.includes(category));
    }
  }

  if (status !== "all") {
    filtered = filtered.filter((t) => t.status === status);
  }

  return filtered;
}

export async function getTeacherById(id: string): Promise<Teacher | null> {
  await delay(150);
  const found = teachersStore.find((t) => t.id === id || t.employeeId === id);
  return found ? { ...found } : null;
}

export interface CreateTeacherPayload {
  fullName: string;
  phone: string;
  email: string;
  dateOfBirth: string;
  address: string;
  qualifications: string;
  assignedCategories: StudentCategory[];
  photoUrl?: string;
  role?: string;
}

export async function createTeacher(
  payload: CreateTeacherPayload
): Promise<Teacher> {
  await delay(350);

  const num = String(teachersStore.length + 1).padStart(3, "0");
  const employeeId = `MK-T-${num}`;
  const id = `tch-${Date.now()}`;

  const newTeacher: Teacher = {
    id,
    employeeId,
    fullName: payload.fullName.trim(),
    phone: payload.phone.trim(),
    email: payload.email.trim(),
    dateOfBirth: payload.dateOfBirth,
    address: payload.address.trim(),
    qualifications: payload.qualifications.trim(),
    assignedCategories: payload.assignedCategories,
    status: "active",
    photoUrl: payload.photoUrl,
    joinedDate: new Date().toISOString().split("T")[0],
    role: payload.role?.trim() || "Tahfiz Instructor",
  };

  teachersStore = [newTeacher, ...teachersStore];
  return newTeacher;
}

// Student Detail History Services
export async function getStudentMemorisationRecords(
  studentId: string
): Promise<MemorisationRecord[]> {
  await delay(150);
  return memorisationStore.filter((m) => m.studentId === studentId);
}

export async function getStudentAttendanceRecords(
  studentId: string
): Promise<AttendanceRecord[]> {
  await delay(150);
  return attendanceStore.filter((a) => a.studentId === studentId);
}

export async function getStudentPaymentRecords(
  studentId: string
): Promise<PaymentRecord[]> {
  await delay(150);
  return paymentsStore.filter((p) => p.studentId === studentId);
}

// Dashboard Aggregate Metrics Service
export async function getDashboardMetrics(): Promise<DashboardMetrics> {
  await delay(200);

  const totalStudents = studentsStore.length;
  const activeTeachers = teachersStore.filter((t) => t.status === "active").length;
  const categoryACount = studentsStore.filter((s) => s.category === "A").length;
  const categoryBCount = studentsStore.filter((s) => s.category === "B").length;

  const paymentsRecordedSum = paymentsStore.reduce(
    (acc, curr) => acc + curr.amount,
    0
  );

  return {
    totalStudents,
    activeTeachers,
    attendanceTodayPercentage: 94.2, // Fictional calculation based on today's logged attendance
    paymentsRecordedSum,
    categoryACount,
    categoryBCount,
    memorisationPaceWeekly: [
      { weekLabel: "Week 1", catATargetMetPct: 88, catBTargetMetPct: 92 },
      { weekLabel: "Week 2", catATargetMetPct: 91, catBTargetMetPct: 89 },
      { weekLabel: "Week 3", catATargetMetPct: 94, catBTargetMetPct: 95 },
      { weekLabel: "Week 4", catATargetMetPct: 96, catBTargetMetPct: 93 },
    ],
  };
}

export async function getRecentActivities() {
  await delay(150);
  return MOCK_RECENT_ACTIVITIES;
}

export async function getAcademicSessions() {
  await delay(100);
  return MOCK_ACADEMIC_SESSIONS;
}
