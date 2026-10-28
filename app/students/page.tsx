import React from "react";
import { AppShell } from "@/components/layout/app-shell";
import { StudentDirectory } from "@/components/students/student-directory";

export default function StudentsPage() {
  return (
    <AppShell>
      <StudentDirectory />
    </AppShell>
  );
}
