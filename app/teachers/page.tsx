import React from "react";
import { AppShell } from "@/components/layout/app-shell";
import { TeacherDirectory } from "@/components/teachers/teacher-directory";

export default function TeachersPage() {
  return (
    <AppShell>
      <TeacherDirectory />
    </AppShell>
  );
}
