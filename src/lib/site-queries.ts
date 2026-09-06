import { queryOptions } from "@tanstack/react-query";
import {
  getAchievements,
  getActivities,
  getContentBlocks,
  getDocuments,
  getEvents,
  getFacilities,
  getFaculty,
  getGallery,
  getNavigation,
  getNotices,
  getSiteSettings,
} from "@/lib/cms.functions";

/** Shared TanStack Query options for the public website's server functions. */

export const siteSettingsOptions = () =>
  queryOptions({
    queryKey: ["site", "settings"],
    queryFn: () => getSiteSettings(),
  });

export const contentBlocksOptions = (page?: string) =>
  queryOptions({
    queryKey: ["site", "content-blocks", page ?? "all"],
    queryFn: () => getContentBlocks({ data: page ? { page } : {} }),
  });

export const navigationOptions = () =>
  queryOptions({
    queryKey: ["site", "navigation"],
    queryFn: () => getNavigation(),
  });

export const noticesOptions = () =>
  queryOptions({
    queryKey: ["site", "notices"],
    queryFn: () => getNotices(),
  });

export const eventsOptions = () =>
  queryOptions({
    queryKey: ["site", "events"],
    queryFn: () => getEvents(),
  });

export const achievementsOptions = () =>
  queryOptions({
    queryKey: ["site", "achievements"],
    queryFn: () => getAchievements(),
  });

export const facilitiesOptions = () =>
  queryOptions({
    queryKey: ["site", "facilities"],
    queryFn: () => getFacilities(),
  });

export const activitiesOptions = () =>
  queryOptions({
    queryKey: ["site", "activities"],
    queryFn: () => getActivities(),
  });

export const facultyOptions = () =>
  queryOptions({
    queryKey: ["site", "faculty"],
    queryFn: () => getFaculty(),
  });

export const documentsOptions = () =>
  queryOptions({
    queryKey: ["site", "documents"],
    queryFn: () => getDocuments(),
  });

export const galleryOptions = () =>
  queryOptions({
    queryKey: ["site", "gallery"],
    queryFn: () => getGallery(),
  });

// ---------------------------------------------------------------------------
// Row -> display-type mappers. The admin portal stores free-text categories,
// so these coerce into the narrower literal unions used by the existing
// presentational components without ever throwing at runtime.
// ---------------------------------------------------------------------------

import type { Achievement, Activity, Facility, GalleryItem, Notice, Resource, SchoolEvent } from "@/data/school";

function formatDateLabel(iso: string | null): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short" });
}

export function mapNotice(row: {
  id: string;
  title: string;
  summary: string;
  category: string;
  publish_date: string;
  pinned: boolean;
  attachment_url: string | null;
  attachment_name: string | null;
  verified: boolean;
}): Notice {
  return {
    id: row.id,
    title: row.title,
    date: row.publish_date,
    dateLabel: formatDateLabel(row.publish_date),
    summary: row.summary,
    category: row.category as Notice["category"],
    verified: row.verified,
    ...(row.attachment_name ? { file: row.attachment_name } : {}),
  };

}

export function mapEvent(row: {
  id: string;
  title: string;
  event_date: string | null;
  event_time: string | null;
  location: string | null;
  category: string;
}): SchoolEvent {
  const d = row.event_date ? new Date(row.event_date) : null;
  const valid = d && !Number.isNaN(d.getTime());
  return {
    id: row.id,
    title: row.title,
    day: valid ? d!.toLocaleDateString("en-GB", { day: "2-digit" }) : "—",
    month: valid ? d!.toLocaleDateString("en-GB", { month: "short" }) : "",
    where: row.location ?? "",
    time: row.event_time ?? "",
    category: row.category as SchoolEvent["category"],
  };
}

export function mapAchievement(row: { id: string; title: string; year: string | null; verified: boolean }): Achievement {
  return { id: row.id, title: row.title, year: row.year ?? "", verified: row.verified };
}

export function mapActivity(row: { id: string; title: string; note: string; verified: boolean }): Activity {
  return { id: row.id, title: row.title, note: row.note, verified: row.verified };
}

export function mapFacility(row: {
  slug: string;
  name: string;
  blurb: string;
  detail: string;
  sort_order: number;
}): Facility {
  return {
    slug: row.slug,
    name: row.name,
    index: String(row.sort_order + 1).padStart(2, "0"),
    blurb: row.blurb,
    detail: row.detail.split("\n").map((s) => s.trim()).filter(Boolean),
  };
}

export function mapGalleryPhoto(row: {
  id: string;
  title: string;
  category: string;
  image_url: string;
  alt_text: string;
}): GalleryItem {
  return {
    id: row.id,
    title: row.title,
    category: row.category as GalleryItem["category"],
    src: row.image_url,
    width: 1024,
    height: 1024,
    alt: row.alt_text,
  };
}

export function mapDocument(row: {
  id: string;
  title: string;
  kind: string;
  group_name: string;
  description: string;
  file_url: string | null;
  verified: boolean;
}): Resource {
  return {
    id: row.id,
    title: row.title,
    kind: row.kind as Resource["kind"],
    group: row.group_name as Resource["group"],
    note: row.description,
    verified: row.verified,
  };
}
