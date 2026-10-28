import React from "react";
import { AppShell } from "@/components/layout/app-shell";
import { StudentAdmissionForm } from "@/components/students/student-admission-form";

export default function NewStudentPage() {
  return (
    <AppShell>
      <StudentAdmissionForm />
    </AppShell>
  );
}
