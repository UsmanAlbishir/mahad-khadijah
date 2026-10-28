import React from "react";
import { AppShell } from "@/components/layout/app-shell";
import { TeacherRegistrationForm } from "@/components/teachers/teacher-registration-form";

export default function NewTeacherPage() {
  return (
    <AppShell>
      <TeacherRegistrationForm />
    </AppShell>
  );
}
