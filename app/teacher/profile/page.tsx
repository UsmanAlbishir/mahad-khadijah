import { Mail, Phone, ShieldCheck, UserRound } from "lucide-react";
import { demoTeacher } from "@/components/teacher/teacher-demo-data";
import { DemoNotice, PageHeading, SectionTitle, StatusBadge } from "@/components/teacher/teacher-ui";

export default function TeacherProfilePage() {
  return (
    <div className="space-y-6">
      <PageHeading eyebrow="Account" title="My profile" description="Review the sample teacher profile. Editing is unavailable until permitted profile fields are defined by the backend." />
      <DemoNotice>The profile displayed is fictional demo data and is not linked to an account. This page does not allow changes to identity, role, or permissions.</DemoNotice>
      <section className="grid gap-6 lg:grid-cols-[minmax(240px,0.7fr)_1.3fr]">
        <div className="border border-border bg-card p-6 text-center">
          <div className="mx-auto flex size-20 items-center justify-center rounded-full bg-[#452D24] text-xl font-semibold text-white ring-4 ring-[#E84F12]/25">{demoTeacher?.fullName.split(" ").slice(-2).map((part) => part[0]).join("") ?? "T"}</div>
          <h2 className="mt-4 text-lg font-semibold">{demoTeacher?.fullName ?? "Teacher record unavailable"}</h2>
          <p className="mt-1 text-sm text-muted-foreground">{demoTeacher?.role ?? "Role not configured"}</p>
          <div className="mt-4"><StatusBadge tone={demoTeacher?.status === "active" ? "success" : "neutral"}>{demoTeacher?.status.replace("_", " ") ?? "Not configured"}</StatusBadge></div>
          <div className="mt-6 border-t border-border pt-4 text-left"><p className="text-[11px] font-medium text-muted-foreground">Employee number</p><p className="mt-1 font-mono text-sm">{demoTeacher?.employeeId ?? "Not configured"}</p></div>
        </div>
        <div className="space-y-6">
          <div className="border border-border bg-card p-5">
            <SectionTitle title="Contact information" />
            <div className="grid gap-5 sm:grid-cols-2">
              <ProfileField icon={<Mail className="size-4" />} label="Email" value={demoTeacher?.email ?? "Not configured"} />
              <ProfileField icon={<Phone className="size-4" />} label="Phone" value={demoTeacher?.phone ?? "Not configured"} />
              <ProfileField icon={<UserRound className="size-4" />} label="Address" value={demoTeacher?.address ?? "Not configured"} />
              <ProfileField icon={<ShieldCheck className="size-4" />} label="Account status" value="Requires authenticated backend profile" />
            </div>
          </div>
          <div className="border border-border bg-card p-5">
            <SectionTitle title="Teaching assignment" />
            <div className="grid gap-5 sm:grid-cols-2">
              <ProfileField icon={<UserRound className="size-4" />} label="Demo category coverage" value={demoTeacher?.assignedCategories.map((category) => `Category ${category}`).join(", ") ?? "Not configured"} />
              <ProfileField icon={<UserRound className="size-4" />} label="Assigned group" value="Not configured by backend" />
              <ProfileField icon={<UserRound className="size-4" />} label="Joined date" value={demoTeacher?.joinedDate ?? "Not configured"} />
              <ProfileField icon={<UserRound className="size-4" />} label="Qualifications" value={demoTeacher?.qualifications ?? "Not configured"} />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function ProfileField({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return <div><p className="flex items-center gap-2 text-[11px] font-medium text-muted-foreground">{icon}{label}</p><p className="mt-1.5 break-words text-sm font-medium">{value}</p></div>;
}