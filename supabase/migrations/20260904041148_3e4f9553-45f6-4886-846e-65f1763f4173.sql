-- Data API grants for all public tables (RLS still enforces row-level rules)

-- Publicly readable content
GRANT SELECT ON public.achievements, public.activities, public.content_blocks, public.documents,
  public.events, public.facilities, public.faculty_members, public.gallery_albums,
  public.gallery_photos, public.media_assets, public.navigation_items, public.notices,
  public.site_settings, public.subjects TO anon;

-- Public submissions
GRANT INSERT ON public.admission_enquiries, public.contact_messages TO anon;

-- Signed-in users (RLS scopes rows)
GRANT SELECT, INSERT, UPDATE, DELETE ON
  public.achievements, public.activities, public.admission_enquiries, public.assignment_submissions,
  public.assignments, public.attendance, public.classes, public.contact_messages, public.content_blocks,
  public.documents, public.events, public.facilities, public.faculty_members, public.gallery_albums,
  public.gallery_photos, public.homework, public.media_assets, public.navigation_items, public.notices,
  public.parent_students, public.profiles, public.results, public.site_settings, public.subjects,
  public.teacher_classes, public.timetable_slots, public.user_roles TO authenticated;

GRANT SELECT ON public.audit_logs TO authenticated;

-- Server/admin role
GRANT ALL ON public.achievements, public.activities, public.admission_enquiries, public.assignment_submissions,
  public.assignments, public.attendance, public.audit_logs, public.classes, public.contact_messages,
  public.content_blocks, public.documents, public.events, public.facilities, public.faculty_members,
  public.gallery_albums, public.gallery_photos, public.homework, public.media_assets, public.navigation_items,
  public.notices, public.parent_students, public.profiles, public.results, public.site_settings,
  public.subjects, public.teacher_classes, public.timetable_slots, public.user_roles TO service_role;