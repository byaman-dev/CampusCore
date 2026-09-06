import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { FileText, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { PortalLayout, Widget } from "@/components/portal/PortalLayout";
import { useSession } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import {
  useClassAssignments,
  useClassHomework,
  usePortalNotices,
  useStudentAttendance,
  useStudentResults,
} from "@/hooks/use-portal-data";

export const Route = createFileRoute("/_authenticated/portal/parent")({
  head: () => ({
    meta: [
      { title: "Parent Dashboard — Mangalam Vidya Vihar Portal" },
      {
        name: "description",
        content: "Parent workspace: homework, attendance, results and notices for your linked children.",
      },
      { property: "og:title", content: "Parent Dashboard — Mangalam Vidya Vihar" },
      { property: "og:description", content: "Follow your child's classwork, attendance and results." },
    ],
  }),
  component: ParentPortal,
});

type Child = {
  id: string;
  full_name: string;
  login_id: string | null;
  section: string | null;
  roll_number: string | null;
  student_id: string | null;
  admission_number: string | null;
  class_id: string | null;
};

const NO_DATA = "No records yet — the school office has not added data.";

function Empty({ children }: { children: React.ReactNode }) {
  return <p className="py-4 text-sm text-background/50">{children}</p>;
}

function ParentPortal() {
  const { user } = useSession();
  const [selected, setSelected] = useState<string | null>(null);

  const children = useQuery({
    queryKey: ["my-children", user?.id ?? null],
    enabled: Boolean(user),
    queryFn: async (): Promise<Child[]> => {
      const links = await supabase.from("parent_students").select("student_user_id").eq("parent_user_id", user!.id);
      if (links.error) throw links.error;
      const ids = (links.data ?? []).map((l) => l.student_user_id);
      if (ids.length === 0) return [];
      const { data, error } = await supabase
        .from("profiles")
        .select("id, full_name, login_id, section, roll_number, student_id, admission_number, class_id")
        .in("id", ids);
      if (error) throw error;
      return data ?? [];
    },
  });

  const list = children.data ?? [];
  useEffect(() => {
    if (!selected && list[0]) setSelected(list[0].id);
  }, [list, selected]);

  const child = list.find((c) => c.id === selected) ?? list[0];
  const classId = child?.class_id ?? null;
  const childId = child?.id ?? null;

  const homework = useClassHomework(classId);
  const assignments = useClassAssignments(classId);
  const attendance = useStudentAttendance(childId);
  const results = useStudentResults(childId);
  const notices = usePortalNotices();

  const attendancePresentPct =
    attendance.data && attendance.data.length > 0
      ? Math.round((attendance.data.filter((a) => a.status === "present").length / attendance.data.length) * 100)
      : null;

  return (
    <PortalLayout
      role="parent"
      title={child ? `Following ${child.full_name}` : "Parent workspace"}
      subtitle="Attendance, classwork and results for the children linked to your account by the school office."
    >
      {children.isLoading ? (
        <p className="py-16 text-center font-mono text-[11px] uppercase tracking-[0.2em] text-background/50">
          Loading your children…
        </p>
      ) : list.length === 0 ? (
        <div className="mx-auto max-w-xl rounded-md border border-dashed border-background/25 px-6 py-12 text-center">
          <Users className="mx-auto size-6 text-background/50" aria-hidden="true" />
          <h2 className="mt-4 font-display text-2xl text-background">No child linked yet</h2>
          <p className="mx-auto mt-3 max-w-[46ch] text-sm text-background/60">
            The school office has not linked a student to this parent account. Please contact the office so the link
            can be added.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {list.length > 1 ? (
            <nav aria-label="Select child" className="flex flex-wrap gap-2">
              {list.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setSelected(c.id)}
                  aria-pressed={c.id === child?.id}
                  className={`min-h-11 rounded-sm px-3 font-mono text-[11px] uppercase tracking-[0.15em] transition-colors ${
                    c.id === child?.id
                      ? "bg-background text-foreground"
                      : "text-background/60 ring-1 ring-background/20 hover:bg-background/10"
                  }`}
                >
                  {c.full_name || c.login_id}
                </button>
              ))}
            </nav>
          ) : null}

          <div className="grid gap-4 lg:grid-cols-3">
            <Widget label="Student record">
              <dl className="space-y-2 text-sm">
                {[
                  ["Name", child?.full_name],
                  ["Student ID", child?.student_id ?? child?.login_id],
                  ["Section", child?.section],
                  ["Roll number", child?.roll_number],
                  ["Admission number", child?.admission_number],
                ].map(([k, v]) => (
                  <div key={k as string} className="flex items-baseline justify-between gap-3">
                    <dt className="font-mono text-[10px] uppercase tracking-[0.14em] text-background/50">{k}</dt>
                    <dd className="text-background/85">{v || "—"}</dd>
                  </div>
                ))}
              </dl>
            </Widget>

            <Widget label="Homework & assignments" className="lg:col-span-2">
              {!classId ? (
                <Empty>No class assigned yet — the school office has not added data.</Empty>
              ) : homework.isLoading || assignments.isLoading ? (
                <Empty>Loading…</Empty>
              ) : (homework.data ?? []).length === 0 && (assignments.data ?? []).length === 0 ? (
                <Empty>{NO_DATA}</Empty>
              ) : (
                <ul className="divide-y divide-background/10">
                  {[...(homework.data ?? []), ...(assignments.data ?? [])].map((h) => (
                    <li key={h.id} className="flex items-start gap-3 py-2.5">
                      <FileText className="mt-0.5 size-4 shrink-0 text-background/40" aria-hidden="true" />
                      <div className="min-w-0">
                        <p className="text-sm">{h.title}</p>
                        <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-background/45">
                          {h.subject} · due {h.due_date ?? "—"}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </Widget>

            <Widget label="Attendance">
              {attendance.isLoading ? (
                <Empty>Loading…</Empty>
              ) : (attendance.data ?? []).length === 0 ? (
                <Empty>{NO_DATA}</Empty>
              ) : (
                <div>
                  <p className="font-mono text-3xl text-background">{attendancePresentPct}%</p>
                  <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.14em] text-background/45">
                    Present across last {attendance.data?.length} recorded days
                  </p>
                </div>
              )}
            </Widget>

            <Widget label="Results">
              {results.isLoading ? (
                <Empty>Loading…</Empty>
              ) : (results.data ?? []).length === 0 ? (
                <Empty>{NO_DATA}</Empty>
              ) : (
                <ul className="divide-y divide-background/10">
                  {(results.data ?? []).map((r) => (
                    <li key={r.id} className="flex items-center justify-between gap-3 py-2">
                      <span className="text-sm">{r.subject}</span>
                      <span className="font-mono text-[11px] text-background/60">
                        {r.marks ?? "—"}/{r.max_marks} {r.grade ? `· ${r.grade}` : ""}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </Widget>

            <Widget label="Announcements & notices" className="lg:col-span-2">
              {notices.isLoading ? (
                <Empty>Loading…</Empty>
              ) : (notices.data ?? []).length === 0 ? (
                <Empty>{NO_DATA}</Empty>
              ) : (
                <ul className="divide-y divide-background/10">
                  {(notices.data ?? []).map((n) => (
                    <li key={n.id} className="py-2">
                      <p className="text-sm">{n.title}</p>
                      <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-background/45">
                        {n.category} · {n.publish_date}
                      </p>
                    </li>
                  ))}
                </ul>
              )}
            </Widget>
          </div>
        </div>
      )}
    </PortalLayout>
  );
}
