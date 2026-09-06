import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useProfile, useSession } from "@/hooks/use-auth";

const WEEKDAY_LABELS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export function todayWeekday() {
  return new Date().getDay();
}

export function weekdayLabel(n: number) {
  return WEEKDAY_LABELS[n] ?? "";
}

/** Student's own timetable for today, scoped to their class_id. */
export function useStudentTimetable(classId: string | null | undefined) {
  return useQuery({
    queryKey: ["timetable_slots", classId, todayWeekday()],
    enabled: Boolean(classId),
    queryFn: async () => {
      const { data, error } = await supabase
        .from("timetable_slots")
        .select("id, period, subject, room, start_time, end_time, weekday")
        .eq("class_id", classId!)
        .eq("weekday", todayWeekday())
        .order("period", { ascending: true });
      if (error) throw error;
      return data ?? [];
    },
  });
}

/** Homework for a class. */
export function useClassHomework(classId: string | null | undefined) {
  return useQuery({
    queryKey: ["homework", classId],
    enabled: Boolean(classId),
    queryFn: async () => {
      const { data, error } = await supabase
        .from("homework")
        .select("id, title, detail, subject, due_date, attachment_path, class_id, created_at")
        .eq("class_id", classId!)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });
}

/** Assignments for a class. */
export function useClassAssignments(classId: string | null | undefined) {
  return useQuery({
    queryKey: ["assignments", classId],
    enabled: Boolean(classId),
    queryFn: async () => {
      const { data, error } = await supabase
        .from("assignments")
        .select("id, title, detail, subject, due_date, max_marks, attachment_path, class_id, created_at")
        .eq("class_id", classId!)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });
}

/** Notices visible to portal users (published). */
export function usePortalNotices() {
  return useQuery({
    queryKey: ["notices", "portal"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("notices")
        .select("id, title, summary, category, publish_date, pinned")
        .eq("published", true)
        .order("pinned", { ascending: false })
        .order("publish_date", { ascending: false })
        .limit(10);
      if (error) throw error;
      return data ?? [];
    },
  });
}

/** Downloadable documents (public or for portal). */
export function usePortalDocuments() {
  return useQuery({
    queryKey: ["documents", "portal"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("documents")
        .select("id, title, description, kind, group_name, file_url, file_path, doc_date")
        .eq("archived", false)
        .order("created_at", { ascending: false })
        .limit(20);
      if (error) throw error;
      return data ?? [];
    },
  });
}

/** A student's own attendance summary. */
export function useStudentAttendance(studentUserId: string | null | undefined) {
  return useQuery({
    queryKey: ["attendance", "student", studentUserId],
    enabled: Boolean(studentUserId),
    queryFn: async () => {
      const { data, error } = await supabase
        .from("attendance")
        .select("id, date, status")
        .eq("student_user_id", studentUserId!)
        .order("date", { ascending: false })
        .limit(60);
      if (error) throw error;
      return data ?? [];
    },
  });
}

/** A student's own results. */
export function useStudentResults(studentUserId: string | null | undefined) {
  return useQuery({
    queryKey: ["results", "student", studentUserId],
    enabled: Boolean(studentUserId),
    queryFn: async () => {
      const { data, error } = await supabase
        .from("results")
        .select("id, subject, exam_name, term, marks, max_marks, grade, session")
        .eq("student_user_id", studentUserId!)
        .eq("published", true)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });
}

/** Classes assigned to a teacher. */
export function useTeacherClasses(teacherUserId: string | null | undefined) {
  return useQuery({
    queryKey: ["teacher_classes", teacherUserId],
    enabled: Boolean(teacherUserId),
    queryFn: async () => {
      const { data, error } = await supabase
        .from("teacher_classes")
        .select("id, class_id, subject, classes(id, name, section)")
        .eq("teacher_user_id", teacherUserId!);
      if (error) throw error;
      return data ?? [];
    },
  });
}

/** Roster (students) for a class. */
export function useClassRoster(classId: string | null | undefined) {
  return useQuery({
    queryKey: ["roster", classId],
    enabled: Boolean(classId),
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("id, full_name, roll_number")
        .eq("class_id", classId!)
        .order("roll_number", { ascending: true });
      if (error) throw error;
      return data ?? [];
    },
  });
}

export function useSubjectsList() {
  return useQuery({
    queryKey: ["subjects", "list"],
    queryFn: async () => {
      const { data, error } = await supabase.from("subjects").select("id, name").order("sort_order");
      if (error) throw error;
      return data ?? [];
    },
  });
}

/** Submit attendance for a roster of students on a given date. */
export function useSubmitAttendance() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (params: {
      classId: string;
      date: string;
      recordedBy: string;
      records: { studentUserId: string; status: "present" | "absent" }[];
    }) => {
      const rows = params.records.map((r) => ({
        class_id: params.classId,
        date: params.date,
        student_user_id: r.studentUserId,
        status: r.status,
        recorded_by: params.recordedBy,
      }));
      const { error } = await supabase.from("attendance").insert(rows);
      if (error) throw error;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["attendance"] });
    },
  });
}

export function useAddHomework() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (item: {
      classId: string;
      subject: string;
      title: string;
      detail: string;
      dueDate: string | null;
      postedBy: string;
    }) => {
      const { error } = await supabase.from("homework").insert({
        class_id: item.classId,
        subject: item.subject,
        title: item.title,
        detail: item.detail,
        due_date: item.dueDate,
        posted_by: item.postedBy,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["homework"] });
    },
  });
}

export function useAddAssignment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (item: {
      classId: string;
      subject: string;
      title: string;
      detail: string;
      dueDate: string | null;
      maxMarks: number | null;
      postedBy: string;
    }) => {
      const { error } = await supabase.from("assignments").insert({
        class_id: item.classId,
        subject: item.subject,
        title: item.title,
        detail: item.detail,
        due_date: item.dueDate,
        max_marks: item.maxMarks,
        posted_by: item.postedBy,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["assignments"] });
    },
  });
}

export function useAddDocument() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (item: { title: string; description: string; kind: string; groupName: string; fileUrl: string | null }) => {
      const { error } = await supabase.from("documents").insert({
        title: item.title,
        description: item.description,
        kind: item.kind,
        group_name: item.groupName,
        file_url: item.fileUrl,
        is_public: false,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["documents"] });
    },
  });
}

export function useAddNotice() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (item: { title: string; summary: string; category: string }) => {
      const { error } = await supabase.from("notices").insert({
        title: item.title,
        summary: item.summary,
        category: item.category,
        published: true,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["notices"] });
    },
  });
}

export { useProfile, useSession };
