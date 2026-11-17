import { Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, BookOpenCheck, MapPin, Phone } from "lucide-react";
import { demoTeacher, formatDate, getDemoStudent, getStudentAttendance, getStudentMemorisation } from "@/components/teacher/teacher-demo-data";
import { DemoNotice, PageHeading, SectionTitle, StatusBadge } from "@/components/teacher/teacher-ui";

async function TeacherStudentProfileContent({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const student = getDemoStudent(id);
  if (!student) notFound();

  const attendance = getStudentAttendance(student.id).sort((a, b) => b.date.localeCompare(a.date));
  const memorisation = getStudentMemorisation(student.id).sort((a, b) => b.date.localeCompare(a.date));
  const attendanceCounts = attendance.reduce((counts, record) => ({ ...counts, [record.status]: counts[record.status] + 1 }), { present: 0, absent: 0, late: 0, excused: 0 });

  return (
    <div className="space-y-6">
      <Link href="/teacher/students" className="inline-flex items-center gap-2 text-xs font-semibold text-muted-foreground hover:text-foreground"><ArrowLeft className="size-4" />Back to students</Link>
      <PageHeading eyebrow="Student profile · demo" title={student.fullName} description={`${student.admissionNumber} · Category ${student.category}`} action={<StatusBadge tone={student.status === "active" ? "success" : "neutral"}>{student.status}</StatusBadge>} />
      <DemoNotice>This profile is assembled from sample application records. Assignment permissions, report data, and verified teacher identity must be enforced and supplied by the backend.</DemoNotice>

      <section className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
        <div className="border border-border bg-card p-5">
          <SectionTitle title="Personal information" />
          <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
            <Field label="Admission number" value={student.admissionNumber} />
            <Field label="Date of birth" value={formatDate(student.dateOfBirth)} />
            <Field label="Date admitted" value={formatDate(student.admissionDate)} />
            <Field label="Arabic literacy" value={student.arabicLiteracyLevel} />
            <Field label="Previous school" value={student.previousSchool ?? "Not recorded"} />
            <Field label="Previous memorisation" value={student.previousMemorisation} />
            <Field label="Address" value={student.address} wide />
            <Field label="Guardian" value={`${student.guardianName} · ${student.guardianRelation}`} wide />
            <Field label="Guardian phone" value={student.guardianPhone} icon={<Phone className="size-3.5" />} />
          </dl>
        </div>
        <div className="space-y-6">
          <div className="border border-border bg-card p-5">
            <SectionTitle title="Academic information" />
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Assigned teacher" value={demoTeacher?.fullName ?? "Not configured"} />
              <Field label="Assigned group" value="Not configured by backend" />
              <Field label="Academic session" value={student.academicSession} />
              <Field label="Current term" value={student.currentTerm} />
              <Field label="Weekly memorisation target" value={student.category === "A" ? "1 Juz (school guidance)" : "½ Juz (school guidance)"} />
              <Field label="Current progress" value={`${student.currentJuz} Juz · sample value`} />
            </div>
          </div>
          <div className="border border-border bg-card p-5">
            <SectionTitle title="Attendance history" detail={`${attendance.length} sample records`} />
            <div className="mb-4 grid grid-cols-4 gap-2">
              {Object.entries(attendanceCounts).map(([label, count]) => <div key={label} className="bg-muted/50 p-2 text-center"><p className="text-lg font-semibold tabular-nums">{count}</p><p className="text-[10px] capitalize text-muted-foreground">{label}</p></div>)}
            </div>
            <div className="divide-y divide-border">
              {attendance.slice(0, 5).map((record) => <div key={record.id} className="flex items-center justify-between gap-3 py-2.5 text-sm"><span>{formatDate(record.date)}<span className="ml-2 text-xs text-muted-foreground">{record.session}</span></span><StatusBadge tone={record.status === "present" ? "success" : record.status === "late" ? "warning" : record.status === "absent" ? "danger" : "info"}>{record.status}</StatusBadge></div>)}
              {!attendance.length && <p className="py-4 text-sm text-muted-foreground">No sample attendance history.</p>}
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="border border-border bg-card p-5">
          <SectionTitle title="Memorisation history" detail={`${memorisation.length} sample records`} />
          <div className="divide-y divide-border">
            {memorisation.map((record) => <div key={record.id} className="flex gap-3 py-3 first:pt-0"><BookOpenCheck className="mt-0.5 size-4 shrink-0 text-[#9B4123]" /><div className="min-w-0 flex-1"><p className="text-sm font-medium">{record.surahStart} {record.ayahStart} – {record.surahEnd} {record.ayahEnd}</p><p className="mt-1 text-xs text-muted-foreground">{formatDate(record.date)} · Juz {record.juzNumber} · {record.status.replace("_", " ")}</p>{record.notes && <p className="mt-2 text-xs leading-5 text-muted-foreground">{record.notes}</p>}</div><StatusBadge tone={record.grade.startsWith("Mumtaz") ? "success" : record.grade.startsWith("Needs") ? "danger" : "info"}>{record.grade.split(" (")[0]}</StatusBadge></div>)}
            {!memorisation.length && <p className="py-4 text-sm text-muted-foreground">No sample memorisation history.</p>}
          </div>
        </div>
        <div className="border border-border bg-card p-5">
          <SectionTitle title="Reports" detail="Source report contracts unavailable" />
          <div className="space-y-3">
            {["Daily reports", "Weekly reports", "Monthly reports"].map((label, index) => <Link key={label} href={`/teacher/reports/${["daily", "weekly", "monthly"][index]}`} className="flex items-center justify-between border border-border px-3 py-3 text-sm hover:bg-muted/40"><span className="font-medium">{label}</span><span className="text-xs text-muted-foreground">No report records configured</span></Link>)}
          </div>
          <p className="mt-4 flex items-center gap-2 text-xs text-muted-foreground"><MapPin className="size-3.5" />Student editing is intentionally unavailable.</p>
        </div>
      </section>
    </div>
  );
}

function Field({ label, value, wide, icon }: { label: string; value: string; wide?: boolean; icon?: React.ReactNode }) {
  return <div className={wide ? "sm:col-span-2 lg:col-span-1 xl:col-span-2" : ""}><dt className="text-[11px] font-medium text-muted-foreground">{label}</dt><dd className="mt-1 flex items-start gap-1.5 break-words text-sm font-medium capitalize">{icon}{value}</dd></div>;
}

export default function TeacherStudentProfilePage({ params }: { params: Promise<{ id: string }> }) {
  return (
    <Suspense fallback={<div className="min-h-64 animate-pulse bg-card" />}>
      <TeacherStudentProfileContent params={params} />
    </Suspense>
  );
}