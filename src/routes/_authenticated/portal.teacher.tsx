import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { PortalLayout, Widget } from "@/components/portal/PortalLayout";
import { useProfile, useSession } from "@/hooks/use-auth";
import {
  useAddAssignment,
  useAddDocument,
  useAddHomework,
  useAddNotice,
  useClassRoster,
  useSubjectsList,
  useSubmitAttendance,
  useTeacherClasses,
} from "@/hooks/use-portal-data";

export const Route = createFileRoute("/_authenticated/portal/teacher")({
  head: () => ({
    meta: [
      { title: "Teacher Dashboard — Mangalam Vidya Vihar Portal" },
      {
        name: "description",
        content:
          "Teacher workspace: mark class attendance, post homework and assignments, upload notes and publish announcements.",
      },
      { property: "og:title", content: "Teacher Dashboard — Mangalam Vidya Vihar" },
      { property: "og:description", content: "Attendance, homework, notes and announcements for teaching staff." },
    ],
  }),
  component: TeacherPortal,
});

const field =
  "mt-1 w-full rounded-sm border border-background/20 bg-background/[0.06] px-3 py-2.5 text-sm text-background outline-none transition focus:border-background/50";
const button =
  "min-h-11 w-full rounded-sm bg-background px-4 font-mono text-[11px] uppercase tracking-[0.14em] text-foreground transition-opacity hover:opacity-90 disabled:opacity-50";
const label = "font-mono text-[10px] uppercase tracking-[0.15em] text-background/50";

type TeacherClassOption = { id: string; class_id: string; label: string };

function useTeacherClassOptions(teacherId: string | null) {
  const q = useTeacherClasses(teacherId);
  const options: TeacherClassOption[] = (q.data ?? []).map((tc) => {
    const cls = tc.classes as { name?: string; section?: string } | null;
    const label = cls ? `${cls.name ?? ""}${cls.section ? "-" + cls.section : ""}` : tc.class_id;
    return { id: tc.id, class_id: tc.class_id, label };
  });
  return { ...q, options };
}

function AttendanceWidget({ options, teacherId }: { options: TeacherClassOption[]; teacherId: string }) {
  const [classId, setClassId] = useState<string>(options[0]?.class_id ?? "");
  const roster = useClassRoster(classId || null);
  const [absent, setAbsent] = useState<string[]>([]);
  const submit = useSubmitAttendance();

  const effectiveClassId = classId || options[0]?.class_id || "";
  if (!classId && options[0]) setClassId(options[0].class_id);

  const list = roster.data ?? [];
  const toggle = (id: string) => setAbsent((a) => (a.includes(id) ? a.filter((x) => x !== id) : [...a, id]));

  return (
    <Widget
      label="Attendance"
      action={<span className="font-mono text-[10px] text-background/45">{list.length - absent.length} present</span>}
    >
      {options.length === 0 ? (
        <p className="py-4 text-sm text-background/50">No classes assigned yet — the school office has not added data.</p>
      ) : (
        <>
          <label className="block">
            <span className={label}>Class</span>
            <select
              value={effectiveClassId}
              onChange={(e) => {
                setClassId(e.target.value);
                setAbsent([]);
              }}
              className={field}
            >
              {options.map((c) => (
                <option key={c.id} value={c.class_id}>
                  {c.label}
                </option>
              ))}
            </select>
          </label>

          {roster.isLoading ? (
            <p className="mt-3 text-sm text-background/50">Loading roster…</p>
          ) : list.length === 0 ? (
            <p className="mt-3 text-sm text-background/50">No students in this class yet.</p>
          ) : (
            <ul className="mt-3 max-h-72 space-y-1.5 overflow-y-auto pr-1">
              {list.map((s) => {
                const isAbsent = absent.includes(s.id);
                return (
                  <li key={s.id}>
                    <button
                      type="button"
                      aria-pressed={isAbsent}
                      onClick={() => toggle(s.id)}
                      className={`flex min-h-11 w-full items-center gap-3 rounded-sm px-3 text-left text-sm transition-colors ${
                        isAbsent ? "bg-seal/25 ring-1 ring-seal/50" : "ring-1 ring-background/10 hover:bg-background/[0.06]"
                      }`}
                    >
                      <span className="font-mono text-[11px] text-background/50">{s.roll_number ?? "—"}</span>
                      <span className="min-w-0 truncate">{s.full_name}</span>
                      <span className="ml-auto font-mono text-[10px] uppercase tracking-[0.14em] text-background/55">
                        {isAbsent ? "Absent" : "Present"}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}

          <button
            type="button"
            disabled={list.length === 0 || submit.isPending}
            onClick={() => {
              const records = list.map((s) => ({
                studentUserId: s.id,
                status: (absent.includes(s.id) ? "absent" : "present") as "present" | "absent",
              }));
              submit.mutate(
                {
                  classId: effectiveClassId,
                  date: new Date().toISOString().slice(0, 10),
                  recordedBy: teacherId,
                  records,
                },
                {
                  onSuccess: () => {
                    toast.success(`Attendance submitted`, {
                      description: `${list.length - absent.length} present · ${absent.length} absent`,
                    });
                    setAbsent([]);
                  },
                  onError: (e) => toast.error("Could not submit attendance", { description: (e as Error).message }),
                },
              );
            }}
            className={`${button} mt-3`}
          >
            Submit attendance
          </button>
        </>
      )}
    </Widget>
  );
}

function HomeworkWidget({ options, teacherId }: { options: TeacherClassOption[]; teacherId: string }) {
  const subjects = useSubjectsList();
  const addHomework = useAddHomework();
  const [form, setForm] = useState({ classId: options[0]?.class_id ?? "", subject: "", title: "", detail: "", due: "" });

  return (
    <Widget label="Post homework">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (!form.classId || !form.subject) return;
          addHomework.mutate(
            {
              classId: form.classId,
              subject: form.subject,
              title: form.title,
              detail: form.detail,
              dueDate: form.due || null,
              postedBy: teacherId,
            },
            {
              onSuccess: () => {
                toast.success("Homework posted to the class");
                setForm((f) => ({ ...f, title: "", detail: "", due: "" }));
              },
              onError: (e) => toast.error("Could not post homework", { description: (e as Error).message }),
            },
          );
        }}
        className="space-y-3"
      >
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="block">
            <span className={label}>Class</span>
            <select value={form.classId} onChange={(e) => setForm({ ...form, classId: e.target.value })} className={field}>
              {options.map((c) => (
                <option key={c.id} value={c.class_id}>
                  {c.label}
                </option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className={label}>Subject</span>
            <select value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} className={field}>
              <option value="">Select</option>
              {(subjects.data ?? []).map((s) => (
                <option key={s.id} value={s.name}>
                  {s.name}
                </option>
              ))}
            </select>
          </label>
        </div>
        <label className="block">
          <span className={label}>Title</span>
          <input
            required
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className={field}
            placeholder="Numericals set 5"
          />
        </label>
        <label className="block">
          <span className={label}>Details</span>
          <textarea
            required
            rows={3}
            value={form.detail}
            onChange={(e) => setForm({ ...form, detail: e.target.value })}
            className={field}
          />
        </label>
        <label className="block">
          <span className={label}>Due date</span>
          <input
            type="date"
            value={form.due}
            onChange={(e) => setForm({ ...form, due: e.target.value })}
            className={field}
          />
        </label>
        <button type="submit" disabled={options.length === 0 || addHomework.isPending} className={button}>
          Post to class
        </button>
      </form>
    </Widget>
  );
}

function AssignmentWidget({ options, teacherId }: { options: TeacherClassOption[]; teacherId: string }) {
  const subjects = useSubjectsList();
  const addAssignment = useAddAssignment();
  const [form, setForm] = useState({
    classId: options[0]?.class_id ?? "",
    subject: "",
    title: "",
    detail: "",
    due: "",
    maxMarks: "",
  });

  return (
    <Widget label="Create assignment">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (!form.classId || !form.subject) return;
          addAssignment.mutate(
            {
              classId: form.classId,
              subject: form.subject,
              title: form.title,
              detail: form.detail,
              dueDate: form.due || null,
              maxMarks: form.maxMarks ? Number(form.maxMarks) : null,
              postedBy: teacherId,
            },
            {
              onSuccess: () => {
                toast.success("Assignment created");
                setForm((f) => ({ ...f, title: "", detail: "", due: "", maxMarks: "" }));
              },
              onError: (e) => toast.error("Could not create assignment", { description: (e as Error).message }),
            },
          );
        }}
        className="space-y-3"
      >
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="block">
            <span className={label}>Class</span>
            <select value={form.classId} onChange={(e) => setForm({ ...form, classId: e.target.value })} className={field}>
              {options.map((c) => (
                <option key={c.id} value={c.class_id}>
                  {c.label}
                </option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className={label}>Subject</span>
            <select value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} className={field}>
              <option value="">Select</option>
              {(subjects.data ?? []).map((s) => (
                <option key={s.id} value={s.name}>
                  {s.name}
                </option>
              ))}
            </select>
          </label>
        </div>
        <label className="block">
          <span className={label}>Title</span>
          <input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className={field} />
        </label>
        <label className="block">
          <span className={label}>Details</span>
          <textarea required rows={3} value={form.detail} onChange={(e) => setForm({ ...form, detail: e.target.value })} className={field} />
        </label>
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="block">
            <span className={label}>Due date</span>
            <input type="date" value={form.due} onChange={(e) => setForm({ ...form, due: e.target.value })} className={field} />
          </label>
          <label className="block">
            <span className={label}>Max marks</span>
            <input type="number" value={form.maxMarks} onChange={(e) => setForm({ ...form, maxMarks: e.target.value })} className={field} />
          </label>
        </div>
        <button type="submit" disabled={options.length === 0 || addAssignment.isPending} className={button}>
          Create assignment
        </button>
      </form>
    </Widget>
  );
}

function NotesWidget({ }: { options: TeacherClassOption[] }) {
  const addDocument = useAddDocument();
  const [form, setForm] = useState({ title: "", kind: "PDF", description: "", fileUrl: "" });

  return (
    <Widget label="Upload notes / link">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          addDocument.mutate(
            {
              title: form.title,
              description: form.description,
              kind: form.kind,
              groupName: "Class notes",
              fileUrl: form.fileUrl || null,
            },
            {
              onSuccess: () => {
                toast.success("Note listed for the class");
                setForm({ title: "", kind: form.kind, description: "", fileUrl: "" });
              },
              onError: (e) => toast.error("Could not add note", { description: (e as Error).message }),
            },
          );
        }}
        className="space-y-3"
      >
        <label className="block">
          <span className={label}>Title</span>
          <input
            required
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className={field}
            placeholder="Chapter 6 notes"
          />
        </label>
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="block">
            <span className={label}>Type</span>
            <select value={form.kind} onChange={(e) => setForm({ ...form, kind: e.target.value })} className={field}>
              {["PDF", "Image", "Worksheet", "Link"].map((k) => (
                <option key={k}>{k}</option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className={label}>Link / file URL</span>
            <input value={form.fileUrl} onChange={(e) => setForm({ ...form, fileUrl: e.target.value })} className={field} placeholder="https://…" />
          </label>
        </div>
        <label className="block">
          <span className={label}>Description</span>
          <textarea rows={2} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className={field} />
        </label>
        <button type="submit" disabled={addDocument.isPending} className={button}>
          Add note
        </button>
      </form>
    </Widget>
  );
}

function AnnouncementWidget() {
  const addNotice = useAddNotice();
  const [form, setForm] = useState({ title: "", body: "", category: "General" });

  return (
    <Widget label="Publish announcement">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          addNotice.mutate(
            { title: form.title, summary: form.body, category: form.category },
            {
              onSuccess: () => {
                toast.success("Announcement published to the portal");
                setForm({ ...form, title: "", body: "" });
              },
              onError: (e) => toast.error("Could not publish announcement", { description: (e as Error).message }),
            },
          );
        }}
        className="space-y-3"
      >
        <label className="block">
          <span className={label}>Title</span>
          <input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className={field} />
        </label>
        <label className="block">
          <span className={label}>Message</span>
          <textarea
            required
            rows={3}
            value={form.body}
            onChange={(e) => setForm({ ...form, body: e.target.value })}
            className={field}
          />
        </label>
        <label className="block">
          <span className={label}>Category</span>
          <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className={field}>
            {["General", "Academic", "Event", "Exam"].map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </label>
        <button type="submit" disabled={addNotice.isPending} className={button}>
          Publish
        </button>
      </form>
    </Widget>
  );
}

function TeacherPortal() {
  const { user } = useSession();
  const profile = useProfile(user);
  const teacherId = user?.id ?? "";
  const { options, isLoading } = useTeacherClassOptions(teacherId || null);

  return (
    <PortalLayout
      role="teacher"
      title={`Teaching workspace — ${profile.data?.full_name || ""}`}
      subtitle="Mark attendance, set work and share material with your classes."
    >
      <div className="grid gap-4 lg:grid-cols-3">
        {isLoading ? (
          <p className="text-sm text-background/50">Loading your classes…</p>
        ) : (
          <>
            <AttendanceWidget options={options} teacherId={teacherId} />
            <HomeworkWidget options={options} teacherId={teacherId} />
            <div className="space-y-4">
              <NotesWidget options={options} />
              <AnnouncementWidget />
            </div>
            <AssignmentWidget options={options} teacherId={teacherId} />
          </>
        )}
      </div>
    </PortalLayout>
  );
}
