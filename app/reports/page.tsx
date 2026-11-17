import { AppShell } from "@/components/layout/app-shell";
import { AdminReportingDashboard } from "@/components/reports/admin-reporting-dashboard";

export default function ReportsPage() {
  return <AppShell><AdminReportingDashboard view="overview" /></AppShell>;
}
