import { Suspense } from "react";
import { ResultsWorkspace } from "@/components/results/results-workspace";
import { EXAMINATION_RECORDS } from "@/lib/results-data";

export function generateStaticParams() {
  return EXAMINATION_RECORDS.map((record) => ({ id: record.id }));
}

export default function TeacherResultSheetPreviewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <Suspense fallback={<div className="border border-border bg-card p-8 text-center text-sm">Loading examination preview...</div>}>
      <TeacherPreviewContent params={params} />
    </Suspense>
  );
}

async function TeacherPreviewContent({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <ResultsWorkspace panel="teacher" view="preview" recordId={id} />;
}
