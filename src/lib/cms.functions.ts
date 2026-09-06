import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import type { Json } from "@/integrations/supabase/types";
import { publicServerClient } from "./supabase-public.server";

/**
 * Public, unauthenticated reads for the website. Every query goes through the
 * publishable key so the `TO anon` row level security policies apply — only
 * published / visible rows ever leave the database.
 */

export type SiteSettings = {
  school_name: string;
  short_name: string;
  tagline: string;
  address: string;
  phones: string[];
  email: string;
  office_hours: string;
  map_url: string | null;
  logo_url: string | null;
  favicon_url: string | null;
  social_links: Record<string, string>;
  academic_session: string;
  footer_text: string;
  seo_title: string;
  seo_description: string;
  seo_image_url: string | null;
};

export type ContentBlock = {
  key: string;
  page: string;
  label: string;
  heading: string | null;
  subheading: string | null;
  body: string | null;
  image_url: string | null;
  link_label: string | null;
  link_to: string | null;
  data: Record<string, Json>;
  enabled: boolean;
  sort_order: number;
};

export const getSiteSettings = createServerFn({ method: "GET" }).handler(async () => {
  const supabase = publicServerClient();
  const { data } = await supabase.from("site_settings").select("*").eq("id", "default").maybeSingle();
  return (data ?? null) as SiteSettings | null;
});

export const getContentBlocks = createServerFn({ method: "GET" })
  .inputValidator((input: unknown) => z.object({ page: z.string().max(40).optional() }).parse(input ?? {}))
  .handler(async ({ data }) => {
    const supabase = publicServerClient();
    let query = supabase.from("content_blocks").select("*").order("sort_order");
    if (data.page) query = query.eq("page", data.page);
    const { data: rows } = await query;
    return (rows ?? []) as unknown as ContentBlock[];
  });

export const getNavigation = createServerFn({ method: "GET" }).handler(async () => {
  const supabase = publicServerClient();
  const { data } = await supabase
    .from("navigation_items")
    .select("label, route, visible, featured, sort_order")
    .eq("visible", true)
    .order("sort_order");
  return data ?? [];
});

export const getNotices = createServerFn({ method: "GET" }).handler(async () => {
  const supabase = publicServerClient();
  const { data } = await supabase
    .from("notices")
    .select("id, title, summary, body, category, publish_date, pinned, attachment_url, attachment_name, verified")
    .order("pinned", { ascending: false })
    .order("publish_date", { ascending: false });
  return data ?? [];
});

export const getEvents = createServerFn({ method: "GET" }).handler(async () => {
  const supabase = publicServerClient();
  const { data } = await supabase
    .from("events")
    .select("id, title, description, event_date, event_time, location, category, image_url, attachment_url, featured")
    .order("event_date", { ascending: true });
  return data ?? [];
});

export const getAchievements = createServerFn({ method: "GET" }).handler(async () => {
  const supabase = publicServerClient();
  const { data } = await supabase
    .from("achievements")
    .select("id, title, description, category, achiever, year, image_url, featured, verified, sort_order")
    .order("sort_order");
  return data ?? [];
});

export const getFacilities = createServerFn({ method: "GET" }).handler(async () => {
  const supabase = publicServerClient();
  const { data } = await supabase
    .from("facilities")
    .select("id, slug, name, blurb, detail, image_url, sort_order")
    .order("sort_order");
  return data ?? [];
});

export const getActivities = createServerFn({ method: "GET" }).handler(async () => {
  const supabase = publicServerClient();
  const { data } = await supabase
    .from("activities")
    .select("id, title, note, group_name, image_url, verified, sort_order")
    .order("sort_order");
  return data ?? [];
});

export const getFaculty = createServerFn({ method: "GET" }).handler(async () => {
  const supabase = publicServerClient();
  const { data } = await supabase
    .from("faculty_members")
    .select("id, full_name, designation, qualification, subjects, group_name, bio, photo_url, sort_order")
    .order("sort_order");
  return data ?? [];
});

export const getDocuments = createServerFn({ method: "GET" }).handler(async () => {
  const supabase = publicServerClient();
  const { data } = await supabase
    .from("documents")
    .select("id, title, description, kind, group_name, file_url, session, doc_date, verified, sort_order")
    .order("sort_order");
  return data ?? [];
});

export const getGallery = createServerFn({ method: "GET" }).handler(async () => {
  const supabase = publicServerClient();
  const [albums, photos] = await Promise.all([
    supabase.from("gallery_albums").select("id, name, slug, description, cover_url, category, sort_order").order("sort_order"),
    supabase
      .from("gallery_photos")
      .select("id, album_id, title, caption, alt_text, image_url, category, taken_on, featured, show_on_home, sort_order")
      .order("sort_order"),
  ]);
  return { albums: albums.data ?? [], photos: photos.data ?? [] };
});

/** Public website forms. Row level security allows insert only. */
export const submitAdmissionEnquiry = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) =>
    z
      .object({
        student_name: z.string().trim().min(1).max(120),
        parent_name: z.string().trim().max(120).optional(),
        phone: z.string().trim().max(30).optional(),
        email: z.string().trim().max(160).optional(),
        class_applied: z.string().trim().max(40).optional(),
        message: z.string().trim().max(2000).optional(),
      })
      .parse(input),
  )
  .handler(async ({ data }) => {
    const supabase = publicServerClient();
    const { error } = await supabase.from("admission_enquiries").insert({
      student_name: data.student_name,
      parent_name: data.parent_name ?? null,
      phone: data.phone ?? null,
      email: data.email ?? null,
      class_applied: data.class_applied ?? null,
      message: data.message ?? null,
      source: "Website",
    });
    if (error) throw new Error("Could not send the enquiry. Please phone the school office.");
    return { ok: true as const };
  });

export const submitContactMessage = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) =>
    z
      .object({
        name: z.string().trim().min(1).max(120),
        email: z.string().trim().max(160).optional(),
        phone: z.string().trim().max(30).optional(),
        subject: z.string().trim().max(160).optional(),
        message: z.string().trim().min(1).max(2000),
      })
      .parse(input),
  )
  .handler(async ({ data }) => {
    const supabase = publicServerClient();
    const { error } = await supabase.from("contact_messages").insert({
      name: data.name,
      message: data.message,
      email: data.email ?? null,
      phone: data.phone ?? null,
      subject: data.subject ?? null,
    });
    if (error) throw new Error("Could not send the message. Please phone the school office.");
    return { ok: true as const };
  });
