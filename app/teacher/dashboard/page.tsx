import Link from "next/link";
import {
  ArrowRight,
  BookOpenCheck,
  CalendarCheck2,
  ClipboardList,
  GraduationCap,
  History,
  UsersRound,
} from "lucide-react";
import { demoActivities, demoAttendance, demoMemorisation, demoSession, demoTeacher, formatDate } from "@/components/teacher/teacher-demo-data";
import { DemoNotice, PageHeading, SectionTitle, StatusBadge } from "@/components/teacher/teacher-ui";
import { TodayDate } from "@/components/teacher/today-date";

const quickActions = [
  { title: "Record attendance", detail: "Open the daily register", href: "/teacher/attendance", icon: CalendarCheck2 },
  { title: "Add memorisation", detail: "Review a student's recitation", href: "/teacher/memorisation", icon: BookOpenCheck },
  { title: "View students", detail: "Browse the demo roster", href: "/teacher/students", icon: GraduationCap },
  { title: "Daily reports", detail: "Review report availability", href: "/teacher/reports/daily", icon: ClipboardList },
];

export default function TeacherDashboardPage() {
  const latestAttendanceDate = demoAttendance.reduce<string | null>(
    (latest, record) => (latest === null || record.date > latest ? record.date : latest),
    null,
  );
  const latestAttendance = latestAttendanceDate
    ? demoAttendance.filter((record) => record.date === latestAttendanceDate)
    : [];
  const latestCounts = latestAttendance.reduce(
    (counts, record) => ({ ...counts, [record.status]: counts[record.status] + 1 }),
    { present: 0, absent: 0, late: 0, excused: 0 },
  );
  const metrics = [
    { label: "Assigned students", value: "—", detail: "Teacher assignment data unavailable", icon: UsersRound },
    { label: "Present today", value: "—", detail: "No attendance record for today", icon: CalendarCheck2 },
    { label: "Absent today", value: "—", detail: "No attendance record for today", icon: CalendarCheck2 },
    { label: "Students with memorisation", value: new Set(demoMemorisation.map((record) => record.studentId)).size, detail: "Existing historical sample records", icon: BookOpenCheck },
    { label: "Pending reports", value: "—", detail: "Report workflow is not connected", icon: ClipboardList },
  ];

  return (
    <div className="space-y-6">
      <PageHeading eyebrow="Teacher dashboard" title="Assalamu Alaikum" description="A focused view of students, attendance and Qur’an memorisation." />
      <DemoNotice>
        This workspace displays existing fictional demo records, not an authenticated teacher&apos;s assigned students. Current teacher identity, group, attendance and report workflow must come from the backend.
      </DemoNotice>

      <section className="grid gap-4 border border-[#452D24]/15 bg-card p-5 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center sm:p-6">
        <div>
          <p className="text-xs font-medium text-muted-foreground">Teacher profile shown for layout preview</p>
          <h3 className="mt-1 text-xl font-semibold">{demoTeacher?.fullName ?? "Teacher profile unavailable"}</h3>
          <p className="mt-1 text-sm text-muted-foreground">{demoTeacher?.role ?? "Role not configured"} · Category {demoTeacher?.assignedCategories.join(" & ") ?? "not configured"}</p>
        </div>
        <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
          <div><p className="text-xs text-muted-foreground">Academic session</p><p className="mt-1 font-medium">{demoSession?.name ?? "Not configured"}</p></div>
          <div><p className="text-xs text-muted-foreground">Current term</p><p className="mt-1 font-medium">{demoSession?.currentTerm ?? "Not configured"}</p></div>
          <div><p className="text-xs text-muted-foreground">Today</p><p className="mt-1 font-medium"><TodayDate /></p></div>
        </div>
      </section>

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5" aria-label="Teacher summary">
        {metrics.map(({ label, value, detail, icon: Icon }) => (
          <div key={label} className="border border-border bg-card p-4">
            <div className="flex items-start justify-between gap-3">
              <p className="text-xs font-medium text-muted-foreground">{label}</p>
              <Icon className="size-4 text-[#9B4123]" />
            </div>
            <p className="mt-4 text-2xl font-semibold tabular-nums">{value}</p>
            <p className="mt-1 text-xs text-muted-foreground">{detail}</p>
          </div>
        ))}
      </section>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <section className="border border-border bg-card p-5">
          <SectionTitle title="Latest attendance sample" detail={latestAttendanceDate ? formatDate(latestAttendanceDate) : "No records"} />
          {latestAttendanceDate ? (
            <>
              <p className="mb-4 text-xs text-muted-foreground">Partial demo register only; it is not a complete class attendance summary.</p>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {Object.entries(latestCounts).map(([status, count]) => (
                  <div key={status} className="border border-border px-3 py-3">
                    <p className="text-[11px] capitalize text-muted-foreground">{status}</p>
                    <p className="mt-1 text-xl font-semibold tabular-nums">{count}</p>
                  </div>
                ))}
              </div>
              <Link href="/teacher/attendance" className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline">Open register <ArrowRight className="size-3.5" /></Link>
            </>
          ) : <p className="text-sm text-muted-foreground">Attendance is not available yet.</p>}
        </section>

        <section className="border border-border bg-card p-5">
          <SectionTitle title="Memorisation targets" detail="Weekly guidance" />
          <div className="space-y-3">
            <div className="flex items-center justify-between border border-border px-3 py-3"><span className="text-sm font-medium">Category A</span><StatusBadge tone="success">1 Juz / week</StatusBadge></div>
            <div className="flex items-center justify-between border border-border px-3 py-3"><span className="text-sm font-medium">Category B</span><StatusBadge tone="warning">½ Juz / week</StatusBadge></div>
          </div>
          <p className="mt-3 text-xs leading-5 text-muted-foreground">Progress against targets needs a confirmed backend unit model and reporting period; no totals are inferred from the current sample records.</p>
        </section>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <section className="border border-border bg-card p-5">
          <SectionTitle title="Quick actions" />
          <div className="grid gap-2 sm:grid-cols-2">
            {quickActions.map(({ title, detail, href, icon: Icon }) => (
              <Link key={href} href={href} className="group flex items-center gap-3 border border-border p-3 transition-colors hover:border-[#452D24]/40 hover:bg-muted/40">
                <span className="flex size-9 shrink-0 items-center justify-center bg-[#452D24]/8 text-primary"><Icon className="size-4" /></span>
                <span className="min-w-0 flex-1"><span className="block text-sm font-semibold">{title}</span><span className="mt-0.5 block truncate text-xs text-muted-foreground">{detail}</span></span>
                <ArrowRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
              </Link>
            ))}
          </div>
        </section>

        <section className="border border-border bg-card p-5">
          <SectionTitle title="Recent activity samples" detail="From school demo feed" />
          <div className="divide-y divide-border">
            {demoActivities.filter((activity) => activity.category === "memorisation" || activity.category === "attendance").map((activity) => (
              <div key={activity.id} className="flex items-start gap-3 py-3 first:pt-0 last:pb-0">
                <History className="mt-0.5 size-4 shrink-0 text-[#9B4123]" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{activity.title}</p>
                  <p className="mt-0.5 line-clamp-2 text-xs leading-5 text-muted-foreground">{activity.description}</p>
                </div>
                <span className="shrink-0 text-[11px] text-muted-foreground">{activity.timeAgo}</span>
              </div>
            ))}
          </div>
          <Link href="/teacher/memorisation" className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline">View memorisation <ArrowRight className="size-3.5" /></Link>
        </section>
      </div>
    </div>
  );
}