import { Suspense } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { ResultsWorkspace } from "@/components/results/results-workspace";
import { EXAMINATION_RECORDS } from "@/lib/results-data";

export function generateStaticParams() {
  return EXAMINATION_RECORDS.map((record) => ({ id: record.id }));
}

export default function AdminResultPreviewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <AppShell>
      <Suspense fallback={<div className="border border-border bg-card p-8 text-center text-sm">Loading examination preview...</div>}>
        <AdminPreviewContent params={params} />
      </Suspense>
    </AppShell>
  );
}

async function AdminPreviewContent({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <ResultsWorkspace panel="admin" view="preview" recordId={id} />;
}
