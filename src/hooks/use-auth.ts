import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import type { Role } from "@/data/portal";

export type PortalRole = Extract<Role, "student" | "parent" | "teacher" | "admin">;

export const portalRoles: PortalRole[] = ["student", "parent", "teacher", "admin"];

/** Current auth session, kept in sync with the Supabase client. */
export function useSession() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    const { data } = supabase.auth.onAuthStateChange((_event, next) => {
      if (!active) return;
      setSession(next);
      setLoading(false);
    });
    void supabase.auth.getSession().then(({ data: got }) => {
      if (!active) return;
      setSession(got.session);
      setLoading(false);
    });
    return () => {
      active = false;
      data.subscription.unsubscribe();
    };
  }, []);

  return { session, user: session?.user ?? null, loading };
}

/**
 * Roles granted to the signed-in account. The query is explicitly scoped to the
 * authenticated user id; row level security enforces the same scope server-side.
 */
export function useRoles(user: User | null) {
  const query = useQuery({
    queryKey: ["user-roles", user?.id ?? null],
    enabled: Boolean(user),
    queryFn: async (): Promise<PortalRole[]> => {
      const { data, error } = await supabase.from("user_roles").select("role").eq("user_id", user!.id);
      if (error) throw error;
      return (data ?? []).map((r) => r.role as PortalRole);
    },
  });

  return {
    roles: query.data ?? [],
    loading: query.isLoading,
    error: query.error as Error | null,
  };
}

/** Profile row for the signed-in account. */
export function useProfile(user: User | null) {
  return useQuery({
    queryKey: ["profile", user?.id ?? null],
    enabled: Boolean(user),
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select(
          "id, full_name, email, login_id, active, must_change_password, student_id, class_id, section, roll_number, admission_number, employee_id, subjects, parent_id, admin_id, admin_level",
        )
        .eq("id", user!.id)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });
}

export const homeFor: Record<PortalRole, string> = {
  student: "/portal/student",
  parent: "/portal/parent",
  teacher: "/portal/teacher",
  admin: "/portal/admin",
};
