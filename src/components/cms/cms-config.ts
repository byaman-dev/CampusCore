/** Declarative field configuration for the generic RecordManager, driven off
 * the exact column names in src/integrations/supabase/types.ts. */

export type FieldType = "text" | "textarea" | "number" | "boolean" | "select" | "date" | "image" | "file" | "tags";

export type FieldConfig = {
  name: string;
  label: string;
  type: FieldType;
  required?: boolean;
  options?: string[];
  placeholder?: string;
};

export type TableName =
  | "notices"
  | "events"
  | "achievements"
  | "facilities"
  | "activities"
  | "faculty_members"
  | "documents"
  | "gallery_albums"
  | "gallery_photos"
  | "content_blocks"
  | "navigation_items"
  | "classes"
  | "subjects"
  | "admission_enquiries"
  | "contact_messages";

export type CmsConfig = {
  table: TableName;
  label: string;
  description?: string;
  listColumns: string[];
  fields: FieldConfig[];
  defaultSort: string;
  ascending?: boolean;
};

export const cmsConfigs: Record<TableName, CmsConfig> = {
  notices: {
    table: "notices",
    label: "Notices",
    description: "Announcements shown on the public notice board.",
    listColumns: ["title", "category", "publish_date", "published", "pinned"],
    defaultSort: "publish_date",
    ascending: false,
    fields: [
      { name: "title", label: "Title", type: "text", required: true },
      { name: "category", label: "Category", type: "text", required: true },
      { name: "summary", label: "Summary", type: "textarea", required: true },
      { name: "body", label: "Body", type: "textarea" },
      { name: "publish_date", label: "Publish date", type: "date", required: true },
      { name: "expiry_date", label: "Expiry date", type: "date" },
      { name: "attachment_url", label: "Attachment", type: "file" },
      { name: "attachment_name", label: "Attachment name", type: "text" },
      { name: "sort_order", label: "Sort order", type: "number" },
      { name: "pinned", label: "Pinned", type: "boolean" },
      { name: "verified", label: "Verified", type: "boolean" },
      { name: "published", label: "Published", type: "boolean" },
      { name: "archived", label: "Archived", type: "boolean" },
    ],
  },
  events: {
    table: "events",
    label: "Events",
    description: "School calendar events.",
    listColumns: ["title", "category", "event_date", "published", "featured"],
    defaultSort: "event_date",
    ascending: false,
    fields: [
      { name: "title", label: "Title", type: "text", required: true },
      { name: "category", label: "Category", type: "text", required: true },
      { name: "description", label: "Description", type: "textarea", required: true },
      { name: "event_date", label: "Event date", type: "date" },
      { name: "event_time", label: "Event time", type: "text" },
      { name: "location", label: "Location", type: "text" },
      { name: "image_url", label: "Image", type: "image" },
      { name: "attachment_url", label: "Attachment", type: "file" },
      { name: "sort_order", label: "Sort order", type: "number" },
      { name: "featured", label: "Featured", type: "boolean" },
      { name: "published", label: "Published", type: "boolean" },
      { name: "archived", label: "Archived", type: "boolean" },
    ],
  },
  achievements: {
    table: "achievements",
    label: "Achievements",
    description: "Student and school achievements.",
    listColumns: ["title", "achiever", "year", "published", "featured"],
    defaultSort: "sort_order",
    fields: [
      { name: "title", label: "Title", type: "text", required: true },
      { name: "category", label: "Category", type: "text", required: true },
      { name: "achiever", label: "Achiever", type: "text" },
      { name: "year", label: "Year", type: "text" },
      { name: "description", label: "Description", type: "textarea", required: true },
      { name: "image_url", label: "Image", type: "image" },
      { name: "sort_order", label: "Sort order", type: "number" },
      { name: "featured", label: "Featured", type: "boolean" },
      { name: "verified", label: "Verified", type: "boolean" },
      { name: "published", label: "Published", type: "boolean" },
      { name: "archived", label: "Archived", type: "boolean" },
    ],
  },
  facilities: {
    table: "facilities",
    label: "Campus facilities",
    description: "Facilities shown on the campus page.",
    listColumns: ["name", "slug", "visible"],
    defaultSort: "sort_order",
    fields: [
      { name: "name", label: "Name", type: "text", required: true },
      { name: "slug", label: "Slug", type: "text", required: true },
      { name: "blurb", label: "Short blurb", type: "textarea", required: true },
      { name: "detail", label: "Detail", type: "textarea", required: true },
      { name: "image_url", label: "Image", type: "image" },
      { name: "sort_order", label: "Sort order", type: "number" },
      { name: "visible", label: "Visible", type: "boolean" },
    ],
  },
  activities: {
    table: "activities",
    label: "Activities",
    description: "Clubs, sports and co-curricular activities.",
    listColumns: ["title", "group_name", "visible"],
    defaultSort: "sort_order",
    fields: [
      { name: "title", label: "Title", type: "text", required: true },
      { name: "group_name", label: "Group", type: "text", required: true },
      { name: "note", label: "Note", type: "textarea", required: true },
      { name: "image_url", label: "Image", type: "image" },
      { name: "sort_order", label: "Sort order", type: "number" },
      { name: "verified", label: "Verified", type: "boolean" },
      { name: "visible", label: "Visible", type: "boolean" },
    ],
  },
  faculty_members: {
    table: "faculty_members",
    label: "Faculty",
    description: "Staff directory shown on the website.",
    listColumns: ["full_name", "designation", "group_name", "public_visible"],
    defaultSort: "sort_order",
    fields: [
      { name: "full_name", label: "Full name", type: "text", required: true },
      { name: "designation", label: "Designation", type: "text", required: true },
      { name: "qualification", label: "Qualification", type: "text", required: true },
      { name: "group_name", label: "Group", type: "text", required: true },
      { name: "subjects", label: "Subjects", type: "tags" },
      { name: "bio", label: "Bio", type: "textarea" },
      { name: "photo_url", label: "Photo", type: "image" },
      { name: "sort_order", label: "Sort order", type: "number" },
      { name: "active", label: "Active", type: "boolean" },
      { name: "public_visible", label: "Visible on website", type: "boolean" },
    ],
  },
  documents: {
    table: "documents",
    label: "Documents",
    description: "Downloadable circulars, forms and reports.",
    listColumns: ["title", "kind", "group_name", "is_public"],
    defaultSort: "sort_order",
    fields: [
      { name: "title", label: "Title", type: "text", required: true },
      { name: "description", label: "Description", type: "textarea", required: true },
      { name: "kind", label: "Kind", type: "text", required: true },
      { name: "group_name", label: "Group", type: "text", required: true },
      { name: "session", label: "Session", type: "text" },
      { name: "doc_date", label: "Document date", type: "date" },
      { name: "file_url", label: "File", type: "file" },
      { name: "sort_order", label: "Sort order", type: "number" },
      { name: "is_public", label: "Public", type: "boolean" },
      { name: "verified", label: "Verified", type: "boolean" },
      { name: "archived", label: "Archived", type: "boolean" },
    ],
  },
  gallery_albums: {
    table: "gallery_albums",
    label: "Gallery albums",
    description: "Photo albums.",
    listColumns: ["name", "category", "visible"],
    defaultSort: "sort_order",
    fields: [
      { name: "name", label: "Name", type: "text", required: true },
      { name: "slug", label: "Slug", type: "text", required: true },
      { name: "category", label: "Category", type: "text", required: true },
      { name: "description", label: "Description", type: "textarea", required: true },
      { name: "cover_url", label: "Cover image", type: "image" },
      { name: "sort_order", label: "Sort order", type: "number" },
      { name: "visible", label: "Visible", type: "boolean" },
    ],
  },
  gallery_photos: {
    table: "gallery_photos",
    label: "Gallery photos",
    description: "Individual photos, optionally linked to an album.",
    listColumns: ["title", "category", "featured", "show_on_home"],
    defaultSort: "sort_order",
    fields: [
      { name: "title", label: "Title", type: "text", required: true },
      { name: "caption", label: "Caption", type: "textarea", required: true },
      { name: "alt_text", label: "Alt text", type: "text", required: true },
      { name: "category", label: "Category", type: "text", required: true },
      { name: "album_id", label: "Album ID", type: "text" },
      { name: "image_url", label: "Image", type: "image", required: true },
      { name: "taken_on", label: "Taken on", type: "date" },
      { name: "sort_order", label: "Sort order", type: "number" },
      { name: "featured", label: "Featured", type: "boolean" },
      { name: "show_on_home", label: "Show on home page", type: "boolean" },
      { name: "archived", label: "Archived", type: "boolean" },
    ],
  },
  content_blocks: {
    table: "content_blocks",
    label: "Home & pages content",
    description: "Editable text/image blocks for the public pages.",
    listColumns: ["label", "page", "key", "enabled"],
    defaultSort: "sort_order",
    fields: [
      { name: "page", label: "Page", type: "text", required: true },
      { name: "key", label: "Key", type: "text", required: true },
      { name: "label", label: "Admin label", type: "text", required: true },
      { name: "heading", label: "Heading", type: "text" },
      { name: "subheading", label: "Subheading", type: "text" },
      { name: "body", label: "Body", type: "textarea" },
      { name: "image_url", label: "Image", type: "image" },
      { name: "link_label", label: "Link label", type: "text" },
      { name: "link_to", label: "Link to", type: "text" },
      { name: "sort_order", label: "Sort order", type: "number" },
      { name: "enabled", label: "Enabled", type: "boolean" },
    ],
  },
  navigation_items: {
    table: "navigation_items",
    label: "Navigation",
    description: "Header/footer navigation links.",
    listColumns: ["label", "route", "visible"],
    defaultSort: "sort_order",
    fields: [
      { name: "label", label: "Label", type: "text", required: true },
      { name: "route", label: "Route", type: "text", required: true },
      { name: "parent_key", label: "Parent key", type: "text" },
      { name: "sort_order", label: "Sort order", type: "number" },
      { name: "featured", label: "Featured", type: "boolean" },
      { name: "visible", label: "Visible", type: "boolean" },
    ],
  },
  classes: {
    table: "classes",
    label: "Classes",
    description: "School classes and sections.",
    listColumns: ["name", "section"],
    defaultSort: "name",
    fields: [
      { name: "name", label: "Name", type: "text", required: true },
      { name: "section", label: "Section", type: "text", required: true },
    ],
  },
  subjects: {
    table: "subjects",
    label: "Subjects",
    description: "Subjects taught across classes.",
    listColumns: ["name", "code"],
    defaultSort: "sort_order",
    fields: [
      { name: "name", label: "Name", type: "text", required: true },
      { name: "code", label: "Code", type: "text" },
      { name: "sort_order", label: "Sort order", type: "number" },
    ],
  },
  admission_enquiries: {
    table: "admission_enquiries",
    label: "Admission enquiries",
    description: "Enquiries received through the admissions form.",
    listColumns: ["student_name", "class_applied", "source", "status"],
    defaultSort: "created_at",
    ascending: false,
    fields: [
      { name: "student_name", label: "Student name", type: "text", required: true },
      { name: "parent_name", label: "Parent name", type: "text" },
      { name: "class_applied", label: "Class applied for", type: "text" },
      { name: "email", label: "Email", type: "text" },
      { name: "phone", label: "Phone", type: "text" },
      { name: "source", label: "Source", type: "text", required: true },
      {
        name: "status",
        label: "Status",
        type: "select",
        options: ["new", "contacted", "documents pending", "admitted", "closed"],
      },
      { name: "message", label: "Message", type: "textarea" },
      { name: "admin_note", label: "Office note", type: "textarea" },
    ],
  },
  contact_messages: {
    table: "contact_messages",
    label: "Contact messages",
    description: "Messages sent through the website contact form.",
    listColumns: ["name", "subject", "status"],
    defaultSort: "created_at",
    ascending: false,
    fields: [
      { name: "name", label: "Name", type: "text", required: true },
      { name: "email", label: "Email", type: "text" },
      { name: "phone", label: "Phone", type: "text" },
      { name: "subject", label: "Subject", type: "text" },
      { name: "message", label: "Message", type: "textarea", required: true },
      { name: "status", label: "Status", type: "select", options: ["new", "read", "replied", "closed"] },
    ],
  },
};

export const cmsTableOrder: TableName[] = [
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
  "navigation_items",
  "classes",
  "subjects",
  "admission_enquiries",
  "contact_messages",
];
