import { AppShell } from "@/components/layout/app-shell";
import { ResultsWorkspace } from "@/components/results/results-workspace";

export default function ExaminationRecordsPage() {
  return <AppShell><ResultsWorkspace panel="admin" view="records" /></AppShell>;
}
