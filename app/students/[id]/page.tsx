import React, { Suspense } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { StudentProfile } from "@/components/students/student-profile";
import { MOCK_STUDENTS } from "@/lib/mock-data";

export function generateStaticParams() {
  return MOCK_STUDENTS.map((student) => ({
    id: student.id,
  }));
}

interface PageProps {
  params: Promise<{ id: string }>;
}

async function StudentContent({ params }: PageProps) {
  const { id } = await params;
  return <StudentProfile studentId={id} />;
}

export default function StudentDetailPage(props: PageProps) {
  return (
    <AppShell>
      <Suspense
        fallback={
          <div className="space-y-6 animate-pulse max-w-5xl mx-auto">
            <div className="h-6 w-32 bg-muted rounded" />
            <div className="h-44 bg-card border border-border rounded-2xl" />
            <div className="h-64 bg-card border border-border rounded-2xl" />
          </div>
        }
      >
        <StudentContent {...props} />
      </Suspense>
    </AppShell>
  );
}
