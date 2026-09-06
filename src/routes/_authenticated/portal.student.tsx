import { createFileRoute } from "@tanstack/react-router";
import { Clock, FileText } from "lucide-react";
import { PortalLayout, Widget } from "@/components/portal/PortalLayout";
import { useProfile, useSession } from "@/hooks/use-auth";
import {
  useClassAssignments,
  useClassHomework,
  usePortalDocuments,
  usePortalNotices,
  useStudentAttendance,
  useStudentResults,
  useStudentTimetable,
} from "@/hooks/use-portal-data";

export const Route = createFileRoute("/_authenticated/portal/student")({
  head: () => ({
    meta: [
      { title: "Student Dashboard — Mangalam Vidya Vihar Portal" },
      {
        name: "description",
        content:
          "Student workspace: today's timetable, homework, assignments, class resources, attendance and term results.",
      },
      { property: "og:title", content: "Student Dashboard — Mangalam Vidya Vihar" },
      { property: "og:description", content: "Timetable, homework, resources and results in one student workspace." },
    ],
  }),
  component: StudentPortal,
});

function Empty({ children }: { children: React.ReactNode }) {
  return <p className="py-4 text-sm text-background/50">{children}</p>;
}

const NO_DATA = "No records yet — the school office has not added data.";

function StudentPortal() {
  const { user } = useSession();
  const profile = useProfile(user);
  const classId = profile.data?.class_id ?? null;
  const studentId = user?.id ?? null;

  const timetable = useStudentTimetable(classId);
  const homework = useClassHomework(classId);
  const assignments = useClassAssignments(classId);
  const notices = usePortalNotices();
  const documents = usePortalDocuments();
  const attendance = useStudentAttendance(studentId);
  const results = useStudentResults(studentId);

  const attendancePresentPct =
    attendance.data && attendance.data.length > 0
      ? Math.round((attendance.data.filter((a) => a.status === "present").length / attendance.data.length) * 100)
      : null;

  return (
    <PortalLayout
      role="student"
      title={`Good day, ${profile.data?.full_name || "Student"}`}
      subtitle="Your day, your work and your class material — pulled live from school records."
    >
      <div className="grid gap-4 lg:grid-cols-3">
        <Widget label="Today's timetable" className="lg:row-span-2">
          {!classId ? (
            <Empty>No class assigned yet — the school office has not added data.</Empty>
          ) : timetable.isLoading ? (
            <Empty>Loading…</Empty>
          ) : (timetable.data ?? []).length === 0 ? (
            <Empty>{NO_DATA}</Empty>
          ) : (
            <ol className="space-y-2">
              {(timetable.data ?? []).map((p) => (
                <li
                  key={p.id}
                  className="flex items-center gap-3 rounded-sm bg-background/[0.06] px-3 py-2.5 ring-1 ring-background/15"
                >
                  <span className="font-mono text-[11px] text-background/50">{String(p.period).padStart(2, "0")}</span>
                  <span className="min-w-0">
                    <span className="block text-sm">{p.subject}</span>
                    <span className="block font-mono text-[10px] text-background/45">{p.room ?? "—"}</span>
                  </span>
                  <span className="ml-auto flex items-center gap-1.5 font-mono text-[11px] text-background/60">
                    <Clock className="size-3.5" aria-hidden="true" />
                    {p.start_time ?? ""}
                  </span>
                </li>
              ))}
            </ol>
          )}
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
                <li key={h.id} className="py-3 first:pt-0 last:pb-0">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <p className="text-sm font-medium text-background">{h.title}</p>
                    <span className="font-mono text-[11px] text-background/50">Due {h.due_date ?? "—"}</span>
                  </div>
                  <p className="mt-1 text-[13px] text-background/60">{h.detail}</p>
                  <div className="mt-2 flex flex-wrap items-center gap-2 font-mono text-[10px] uppercase tracking-[0.14em] text-background/45">
                    <span>{h.subject}</span>
                    {h.attachment_path ? (
                      <span className="inline-flex items-center gap-1 normal-case tracking-normal">
                        <FileText className="size-3" aria-hidden="true" />
                        {h.attachment_path}
                      </span>
                    ) : null}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Widget>

        <Widget label="Class resources">
          {documents.isLoading ? (
            <Empty>Loading…</Empty>
          ) : (documents.data ?? []).length === 0 ? (
            <Empty>{NO_DATA}</Empty>
          ) : (
            <ul className="space-y-2">
              {(documents.data ?? []).map((r) => (
                <li key={r.id} className="flex items-center gap-3 rounded-sm px-3 py-2.5 ring-1 ring-background/10">
                  <FileText className="size-4 shrink-0 text-background/50" aria-hidden="true" />
                  <a
                    href={r.file_url ?? undefined}
                    target="_blank"
                    rel="noreferrer"
                    className="min-w-0 hover:underline"
                  >
                    <span className="block truncate text-sm">{r.title}</span>
                    <span className="block font-mono text-[10px] text-background/45">
                      {r.kind} · {r.group_name}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          )}
        </Widget>

        <Widget label="Announcements & notices">
          {notices.isLoading ? (
            <Empty>Loading…</Empty>
          ) : (notices.data ?? []).length === 0 ? (
            <Empty>{NO_DATA}</Empty>
          ) : (
            <ul className="space-y-3">
              {(notices.data ?? []).map((a) => (
                <li key={a.id}>
                  <p className="text-sm">{a.title}</p>
                  <p className="mt-1 text-[13px] text-background/60">{a.summary}</p>
                  <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.14em] text-background/40">
                    {a.category} · {a.publish_date}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </Widget>

        <Widget label="Attendance">
          {!studentId ? (
            <Empty>{NO_DATA}</Empty>
          ) : attendance.isLoading ? (
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

        <Widget label="Results" className="lg:col-span-2">
          {!studentId ? (
            <Empty>{NO_DATA}</Empty>
          ) : results.isLoading ? (
            <Empty>Loading…</Empty>
          ) : (results.data ?? []).length === 0 ? (
            <Empty>{NO_DATA}</Empty>
          ) : (
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-background/20 font-mono text-[10px] uppercase tracking-[0.14em] text-background/50">
                  <th scope="col" className="py-2 pr-4">Subject</th>
                  <th scope="col" className="py-2 pr-4">Exam</th>
                  <th scope="col" className="py-2 pr-4">Marks</th>
                  <th scope="col" className="py-2">Grade</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-background/10">
                {(results.data ?? []).map((r) => (
                  <tr key={r.id}>
                    <td className="py-2.5 pr-4">{r.subject}</td>
                    <td className="py-2.5 pr-4 font-mono text-[13px] text-background/70">
                      {r.exam_name}
                      {r.term ? ` · ${r.term}` : ""}
                    </td>
                    <td className="py-2.5 pr-4 font-mono text-[13px] text-background/70">
                      {r.marks ?? "—"}/{r.max_marks}
                    </td>
                    <td className="py-2.5 font-mono text-[13px] text-background">{r.grade ?? "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </Widget>
      </div>
    </PortalLayout>
  );
}
