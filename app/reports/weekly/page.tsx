import { AppShell } from "@/components/layout/app-shell";
import { AdminReportingDashboard } from "@/components/reports/admin-reporting-dashboard";

export default function WeeklyReportsPage() {
  return <AppShell><AdminReportingDashboard view="weekly" /></AppShell>;
}
