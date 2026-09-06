import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { z } from "zod";

/** Login IDs are school-issued: letters, digits, dash and underscore only. */
const loginId = z
  .string()
  .trim()
  .min(3)
  .max(40)
  .regex(/^[A-Za-z0-9_-]+$/, "Login ID may only contain letters, numbers, dash and underscore");

const role = z.enum(["student", "parent", "teacher", "admin"]);

const createInput = z.object({
  login_id: loginId,
  full_name: z.string().trim().min(1).max(120),
  role,
  password: z.string().min(8).max(72),
  email: z.string().trim().email().max(255).optional().or(z.literal("")),
  phone: z.string().trim().max(30).optional(),
  student_id: z.string().trim().max(40).optional(),
  class_id: z.string().uuid().optional().or(z.literal("")),
  section: z.string().trim().max(10).optional(),
  roll_number: z.string().trim().max(20).optional(),
  admission_number: z.string().trim().max(40).optional(),
  employee_id: z.string().trim().max(40).optional(),
  subjects: z.array(z.string().trim().max(60)).max(20).optional(),
  parent_id: z.string().trim().max(40).optional(),
  admin_id: z.string().trim().max(40).optional(),
  admin_level: z.string().trim().max(40).optional(),
  must_change_password: z.boolean().optional(),
  child_user_ids: z.array(z.string().uuid()).max(20).optional(),
});

/** Synthetic address used when the school has no email for the account holder. */
export function syntheticEmail(id: string) {
  return `${id.trim().toLowerCase()}@login.mangalamvidyavihar.local`;
}

async function assertAdmin(context: { supabase: unknown; userId: string }) {
  const supabase = context.supabase as {
    rpc: (fn: string, args: Record<string, unknown>) => Promise<{ data: unknown; error: unknown }>;
  };
  const { data, error } = await supabase.rpc("has_role", { _user_id: context.userId, _role: "admin" });
  if (error || data !== true) throw new Error("Forbidden: administrator access required");
}

function nullable(value: string | undefined) {
  const trimmed = value?.trim();
  return trimmed ? trimmed : null;
}

/** Creates the auth identity, profile row and role row in one server-side operation. */
export const createAccount = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => createInput.parse(data))
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const existing = await supabaseAdmin
      .from("profiles")
      .select("id")
      .ilike("login_id", data.login_id)
      .maybeSingle();
    if (existing.data) throw new Error(`Login ID ${data.login_id} is already in use`);

    const email = data.email ? data.email.trim().toLowerCase() : syntheticEmail(data.login_id);

    const created = await supabaseAdmin.auth.admin.createUser({
      email,
      password: data.password,
      email_confirm: true,
      user_metadata: { full_name: data.full_name, login_id: data.login_id },
    });
    if (created.error || !created.data.user) {
      throw new Error(created.error?.message ?? "Could not create the account");
    }
    const userId = created.data.user.id;

    const profile = await supabaseAdmin
      .from("profiles")
      .update({
        full_name: data.full_name,
        login_id: data.login_id,
        email,
        active: true,
        must_change_password: data.must_change_password ?? true,
        phone: nullable(data.phone),
        student_id: nullable(data.student_id),
        class_id: data.class_id ? data.class_id : null,
        section: nullable(data.section),
        roll_number: nullable(data.roll_number),
        admission_number: nullable(data.admission_number),
        employee_id: nullable(data.employee_id),
        subjects: data.subjects ?? [],
        parent_id: nullable(data.parent_id),
        admin_id: nullable(data.admin_id),
        admin_level: nullable(data.admin_level),
      })
      .eq("id", userId);

    if (profile.error) {
      await supabaseAdmin.auth.admin.deleteUser(userId);
      throw new Error(profile.error.message);
    }

    const roleRow = await supabaseAdmin.from("user_roles").insert({ user_id: userId, role: data.role });
    if (roleRow.error) {
      await supabaseAdmin.auth.admin.deleteUser(userId);
      throw new Error(roleRow.error.message);
    }

    if (data.role === "parent" && data.child_user_ids?.length) {
      const links = data.child_user_ids.map((student_user_id) => ({
        parent_user_id: userId,
        student_user_id,
      }));
      const linked = await supabaseAdmin.from("parent_students").insert(links);
      if (linked.error) throw new Error(linked.error.message);
    }

    return { userId, login_id: data.login_id, email };
  });

/** Sets a new or temporary password. The old password is never readable. */
export const resetAccountPassword = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) =>
    z
      .object({
        user_id: z.string().uuid(),
        password: z.string().min(8).max(72),
        temporary: z.boolean().optional(),
      })
      .parse(data),
  )
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const updated = await supabaseAdmin.auth.admin.updateUserById(data.user_id, { password: data.password });
    if (updated.error) throw new Error(updated.error.message);

    const flagged = await supabaseAdmin
      .from("profiles")
      .update({ must_change_password: data.temporary ?? true })
      .eq("id", data.user_id);
    if (flagged.error) throw new Error(flagged.error.message);

    return { ok: true as const };
  });

/** Deactivated accounts keep their records but can no longer use the portal. */
export const setAccountActive = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) =>
    z.object({ user_id: z.string().uuid(), active: z.boolean() }).parse(data),
  )
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    if (data.user_id === context.userId && !data.active) {
      throw new Error("You cannot deactivate your own administrator account");
    }
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const updated = await supabaseAdmin.from("profiles").update({ active: data.active }).eq("id", data.user_id);
    if (updated.error) throw new Error(updated.error.message);

    if (!data.active) {
      // Drop any live session so deactivation takes effect immediately.
      await supabaseAdmin.auth.admin.signOut(data.user_id, "global").catch(() => undefined);
    }
    return { ok: true as const };
  });

/** Clears the "must change password" flag once the holder has set their own. */
export const completePasswordChange = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin
      .from("profiles")
      .update({ must_change_password: false })
      .eq("id", context.userId);
    if (error) throw new Error("Could not update the profile");
    return { ok: true as const };
  });
