import { MOCK_STUDENTS, MOCK_TEACHERS } from "@/lib/mock-data";

export const REPORT_WEEKS = Array.from({ length: 15 }, (_, index) => index + 1);
export const REPORT_MONTHS = [
  { number: 1, label: "Month 1", weeks: [1, 2, 3, 4, 5] },
  { number: 2, label: "Month 2", weeks: [6, 7, 8, 9, 10] },
  { number: 3, label: "Month 3", weeks: [11, 12, 13, 14, 15] },
] as const;

export type ReportStatus = "Not Started" | "In Progress" | "Ready for Review" | "Submitted";
export type ReportGrade = "A" | "B" | "C" | "D" | "F";

export interface WeeklyReport {
  id: string;
  studentId: string;
  studentName: string;
  admissionNumber: string;
  teacherId: string;
  teacherName: string;
  category: "A" | "B";
  session: string;
  term: string;
  week: number;
  total: number | null;
  average: number | null;
  musafaScore: number | null;
  grade: ReportGrade | null;
  performance: string | null;
  remarks: string;
  status: ReportStatus;
  preparedDate: string | null;
}

export interface MonthlyReport extends Omit<WeeklyReport, "week" | "musafaScore"> {
  month: number;
  weeks: number[];
  weekRecords: WeeklyReport[];
}

export function gradeFromScore(score: number): ReportGrade {
  if (score >= 90) return "A";
  if (score >= 80) return "B";
  if (score >= 70) return "C";
  if (score >= 60) return "D";
  return "F";
}

export function performanceForGrade(grade: ReportGrade): string {
  return { A: "Excellent", B: "Very Good", C: "Good", D: "Fair", F: "Needs Improvement" }[grade];
}

const reportStatuses: ReportStatus[] = ["Submitted", "Ready for Review", "In Progress", "Not Started"];
const reportRemarks = [
  "Strong revision consistency and attentive recitation.",
  "Good progress; continue focused Muraja'ah practice.",
  "Steady improvement across the assigned passages.",
  "Requires additional attention to accuracy and revision.",
];

export const MOCK_WEEKLY_REPORTS: WeeklyReport[] = REPORT_WEEKS.flatMap((week) =>
  MOCK_STUDENTS.map((student, studentIndex) => {
    const status = reportStatuses[(week + studentIndex * 2) % reportStatuses.length];
    const score = Math.max(48, Math.min(98, 76 + ((week * 3 + studentIndex * 7) % 22) - (studentIndex === 4 ? 12 : 0)));
    const grade = gradeFromScore(score);
    const teacher = MOCK_TEACHERS[(studentIndex + (student.category === "B" ? 2 : 0)) % MOCK_TEACHERS.length];
    const assessed = status === "Submitted" || status === "Ready for Review";

    return {
      id: "weekly-" + week + "-" + student.id,
      studentId: student.id,
      studentName: student.fullName,
      admissionNumber: student.admissionNumber,
      teacherId: teacher.id,
      teacherName: teacher.fullName,
      category: student.category,
      session: "2025/2026 Academic Session",
      term: "First Term",
      week,
      total: assessed ? score * 2 : null,
      average: assessed ? score : null,
      musafaScore: assessed ? score : null,
      grade: assessed ? grade : null,
      performance: assessed ? performanceForGrade(grade) : null,
      remarks: assessed ? reportRemarks[(week + studentIndex) % reportRemarks.length] : "Awaiting teacher report submission.",
      status,
      preparedDate: assessed ? "2026-10-" + String(3 + week).padStart(2, "0") : null,
    };
  }),
);

export const MOCK_MONTHLY_REPORTS: MonthlyReport[] = REPORT_MONTHS.flatMap(({ number, weeks }) =>
  MOCK_STUDENTS.map((student) => {
    const records = MOCK_WEEKLY_REPORTS.filter((record) => record.studentId === student.id && weeks.some((item) => item === record.week));
    const assessedRecords = records.filter((record) => record.average !== null);
    const finalRecord = assessedRecords.at(-1) ?? records.at(-1)!;
    const average = assessedRecords.length
      ? Math.round(assessedRecords.reduce((sum, record) => sum + (record.average ?? 0), 0) / assessedRecords.length)
      : null;
    const grade = average === null ? null : gradeFromScore(average);
    const status: ReportStatus = assessedRecords.length === weeks.length ? "Submitted" : assessedRecords.length >= 3 ? "Ready for Review" : assessedRecords.length ? "In Progress" : "Not Started";

    return {
      ...finalRecord,
      id: "monthly-" + number + "-" + student.id,
      month: number,
      weeks: [...weeks],
      weekRecords: records,
      total: average === null ? null : average * 2,
      average,
      grade,
      performance: grade ? performanceForGrade(grade) : null,
      remarks: average === null ? "Monthly report has not been started." : "Illustrative five-week summary: " + reportRemarks[(number + student.currentJuz) % reportRemarks.length],
      status,
      preparedDate: status === "Submitted" ? "2026-10-" + String(18 + number).padStart(2, "0") : null,
    };
  }),
);

export const REPORTING_TEACHERS = MOCK_TEACHERS.map((teacher) => {
  const reports = MOCK_WEEKLY_REPORTS.filter((report) => report.teacherId === teacher.id);
  const assessed = reports.filter((report) => report.average !== null);
  return {
    ...teacher,
    assignedStudents: new Set(reports.map((report) => report.studentId)).size,
    weeklySubmitted: reports.filter((report) => report.status === "Submitted").length,
    monthlySubmitted: MOCK_MONTHLY_REPORTS.filter((report) => report.teacherId === teacher.id && report.status === "Submitted").length,
    pending: reports.filter((report) => report.status === "Not Started" || report.status === "In Progress").length,
    average: assessed.length ? Math.round(assessed.reduce((sum, report) => sum + (report.average ?? 0), 0) / assessed.length) : 0,
    lastActivity: "27 Oct 2026",
  };
});
