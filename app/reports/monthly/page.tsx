import { AppShell } from "@/components/layout/app-shell";
import { AdminReportingDashboard } from "@/components/reports/admin-reporting-dashboard";

export default function MonthlyReportsPage() {
  return <AppShell><AdminReportingDashboard view="monthly" /></AppShell>;
}
