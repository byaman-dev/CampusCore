import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { z } from "zod";
import type { Json } from "@/integrations/supabase/types";

/**
 * Administrator content management. Every function verifies the caller holds the
 * admin role through their own (row level security bound) client before the
 * service-role client is loaded, so nothing privileged is reachable otherwise.
 */

/** Tables the school office may edit from the admin console. */
const editableTables = [
  "site_settings",
  "navigation_items",
  "content_blocks",
  "notices",
  "events",
  "achievements",
  "facilities",
  "activities",
  "faculty_members",
  "documents",
  "gallery_albums",
  "gallery_photos",
  "classes",
  "subjects",
  "timetable_slots",
  "results",
  "admission_enquiries",
  "contact_messages",
  "profiles",
  "parent_students",
  "teacher_classes",
] as const;

const tableName = z.enum(editableTables);

async function assertAdmin(context: { supabase: unknown; userId: string }) {
  const supabase = context.supabase as {
    rpc: (fn: string, args: Record<string, unknown>) => Promise<{ data: unknown; error: unknown }>;
  };
  const { data, error } = await supabase.rpc("has_role", { _user_id: context.userId, _role: "admin" });
  if (error || data !== true) throw new Error("Forbidden: administrator access required");
}

async function audit(
  userId: string,
  action: string,
  table: string,
  recordId: string | null,
  details: Record<string, Json>,
) {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  await supabaseAdmin
    .from("audit_logs")
    .insert({
      actor_user_id: userId,
      action,
      object_type: table,
      object_id: recordId,
      detail: details as Json,
    })
    .then(
      () => undefined,
      () => undefined,
    );
}

/** Reads any editable table, including unpublished rows. */
export const adminList = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) =>
    z
      .object({
        table: tableName,
        orderBy: z.string().max(40).optional(),
        ascending: z.boolean().optional(),
        limit: z.number().int().min(1).max(500).optional(),
      })
      .parse(input),
  )
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    let query = supabaseAdmin.from(data.table).select("*").limit(data.limit ?? 200);
    if (data.orderBy) query = query.order(data.orderBy, { ascending: data.ascending ?? true });
    const { data: rows, error } = await query;
    if (error) throw new Error(error.message);
    return (rows ?? []) as unknown as Record<string, Json>[];
  });

/** Creates or updates a single row. Pass `id` to update, omit it to create. */
export const adminSave = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) =>
    z
      .object({
        table: tableName,
        id: z.union([z.string(), z.number()]).optional(),
        values: z.record(z.string(), z.custom<Json>()),
      })
      .parse(input),
  )
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    if (data.id !== undefined && data.id !== "") {
      const { data: row, error } = await supabaseAdmin
        .from(data.table)
        .update(data.values as never)
        .eq("id", data.id as never)
        .select()
        .maybeSingle();
      if (error) throw new Error(error.message);
      await audit(context.userId, "update", data.table, String(data.id), data.values);
      return row as unknown as Record<string, Json> | null;
    }

    const { data: row, error } = await supabaseAdmin
      .from(data.table)
      .insert(data.values as never)
      .select()
      .maybeSingle();
    if (error) throw new Error(error.message);
    const created = row as unknown as Record<string, Json> | null;
    await audit(context.userId, "create", data.table, created ? String(created["id"]) : null, data.values);
    return created;
  });

/** Deletes a row. */
export const adminDelete = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) =>
    z.object({ table: tableName, id: z.union([z.string(), z.number()]) }).parse(input),
  )
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin
      .from(data.table)
      .delete()
      .eq("id", data.id as never);
    if (error) throw new Error(error.message);
    await audit(context.userId, "delete", data.table, String(data.id), {});
    return { ok: true as const };
  });

/** Uploads a file (base64 payload) and returns the public website URL for it. */
export const adminUpload = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) =>
    z
      .object({
        bucket: z.enum(["media", "documents"]),
        filename: z.string().trim().min(1).max(160),
        contentType: z.string().trim().max(120).optional(),
        base64: z.string().min(1),
      })
      .parse(input),
  )
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const safeName = data.filename.replace(/[^A-Za-z0-9._-]/g, "-").slice(-120);
    const path = `${new Date().getFullYear()}/${Date.now()}-${safeName}`;
    const binary = Uint8Array.from(atob(data.base64), (c) => c.charCodeAt(0));

    const uploaded = await supabaseAdmin.storage.from(data.bucket).upload(path, binary, {
      contentType: data.contentType || "application/octet-stream",
      upsert: false,
    });
    if (uploaded.error) throw new Error(uploaded.error.message);

    const url = `/api/public/media/${data.bucket}/${path}`;
    await supabaseAdmin.from("media_assets").insert({
      bucket: data.bucket,
      path,
      url,
      title: safeName,
      mime_type: data.contentType ?? null,
      size_bytes: binary.byteLength,
      uploaded_by: context.userId,
    });
    await audit(context.userId, "upload", "media_assets", null, { path, bucket: data.bucket });

    return { path, url };
  });

/** Media library listing for the picker. */
export const adminMediaLibrary = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data } = await supabaseAdmin
      .from("media_assets")
      .select("id, bucket, path, url, title, mime_type, size_bytes, created_at")
      .order("created_at", { ascending: false })
      .limit(200);
    return data ?? [];
  });

/** Accounts list for the account manager and parent/child linking. */
export const adminAccounts = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const [profiles, roles] = await Promise.all([
      supabaseAdmin
        .from("profiles")
        .select(
          "id, full_name, login_id, email, active, must_change_password, student_id, class_id, section, roll_number, admission_number, employee_id, subjects, parent_id, admin_id, admin_level, created_at",
        )
        .order("created_at", { ascending: false }),
      supabaseAdmin.from("user_roles").select("user_id, role"),
    ]);
    const roleFor = new Map<string, string>();
    for (const row of roles.data ?? []) roleFor.set(row.user_id, row.role);
    return (profiles.data ?? []).map((p) => ({ ...p, role: roleFor.get(p.id) ?? null }));
  });
