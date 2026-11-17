import { TeacherShell } from "@/components/teacher/teacher-shell";

export default async function TeacherLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <TeacherShell>{children}</TeacherShell>;
}