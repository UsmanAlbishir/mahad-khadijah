import {
  MOCK_ACADEMIC_SESSIONS,
  MOCK_ATTENDANCE_RECORDS,
  MOCK_MEMORISATION_RECORDS,
  MOCK_RECENT_ACTIVITIES,
  MOCK_STUDENTS,
  MOCK_TEACHERS,
} from "@/lib/mock-data";

export const demoStudents = MOCK_STUDENTS;
export const demoTeacher = MOCK_TEACHERS[0];
export const demoSession = MOCK_ACADEMIC_SESSIONS.find((session) => session.isCurrent) ?? MOCK_ACADEMIC_SESSIONS[0];
export const demoAttendance = MOCK_ATTENDANCE_RECORDS;
export const demoMemorisation = MOCK_MEMORISATION_RECORDS;
export const demoActivities = MOCK_RECENT_ACTIVITIES;

export function getDemoStudent(studentId: string) {
  return demoStudents.find((student) => student.id === studentId) ?? null;
}

export function getStudentAttendance(studentId: string) {
  return demoAttendance.filter((record) => record.studentId === studentId);
}

export function getStudentMemorisation(studentId: string) {
  return demoMemorisation.filter((record) => record.studentId === studentId);
}

export function formatDate(date: string, options?: Intl.DateTimeFormatOptions) {
  if (!date) return "Not configured";
  return new Intl.DateTimeFormat("en", options ?? { dateStyle: "medium" }).format(new Date(`${date}T12:00:00`));
}

export function localDateValue() {
  const date = new Date();
  const offset = date.getTimezoneOffset();
  return new Date(date.getTime() - offset * 60_000).toISOString().slice(0, 10);
}