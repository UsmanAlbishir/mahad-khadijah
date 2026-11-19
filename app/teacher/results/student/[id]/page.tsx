import { Suspense } from "react";
import { ResultsWorkspace } from "@/components/results/results-workspace";
import { EXAMINATION_STUDENTS } from "@/lib/results-data";

export function generateStaticParams() {
  return EXAMINATION_STUDENTS.map((student) => ({ id: student.id }));
}

export default function TeacherStudentResultPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <Suspense fallback={<div className="border border-border bg-card p-8 text-center text-sm">Loading student result...</div>}>
      <TeacherStudentResultContent params={params} />
    </Suspense>
  );
}

async function TeacherStudentResultContent({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <ResultsWorkspace panel="teacher" view="student" studentId={id} />;
}
