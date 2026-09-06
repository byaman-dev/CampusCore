-- ============ helper ============
CREATE OR REPLACE FUNCTION public.is_teacher()
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'teacher')
$$;

-- ============ SCHOOL RECORDS ============
CREATE TABLE public.subjects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  code text,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.subjects TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.subjects TO authenticated;
GRANT ALL ON public.subjects TO service_role;
ALTER TABLE public.subjects ENABLE ROW LEVEL SECURITY;
CREATE POLICY "subjects public read" ON public.subjects FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "subjects admin write" ON public.subjects FOR ALL TO authenticated USING (is_admin()) WITH CHECK (is_admin());

CREATE TABLE public.timetable_slots (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  class_id uuid NOT NULL REFERENCES public.classes(id) ON DELETE CASCADE,
  weekday int NOT NULL,
  period int NOT NULL,
  subject text NOT NULL,
  teacher_user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  start_time text,
  end_time text,
  room text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.timetable_slots TO authenticated;
GRANT ALL ON public.timetable_slots TO service_role;
ALTER TABLE public.timetable_slots ENABLE ROW LEVEL SECURITY;
CREATE POLICY "timetable read signed in" ON public.timetable_slots FOR SELECT TO authenticated USING (true);
CREATE POLICY "timetable admin write" ON public.timetable_slots FOR ALL TO authenticated USING (is_admin()) WITH CHECK (is_admin());
CREATE POLICY "timetable teacher write" ON public.timetable_slots FOR ALL TO authenticated USING (teaches_class(class_id)) WITH CHECK (teaches_class(class_id));

CREATE TABLE public.attendance (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  class_id uuid REFERENCES public.classes(id) ON DELETE SET NULL,
  date date NOT NULL DEFAULT CURRENT_DATE,
  status text NOT NULL DEFAULT 'present',
  note text,
  recorded_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (student_user_id, date)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.attendance TO authenticated;
GRANT ALL ON public.attendance TO service_role;
ALTER TABLE public.attendance ENABLE ROW LEVEL SECURITY;
CREATE POLICY "attendance own read" ON public.attendance FOR SELECT TO authenticated
  USING (auth.uid() = student_user_id OR is_my_child(student_user_id) OR teaches_student(student_user_id) OR is_admin());
CREATE POLICY "attendance admin write" ON public.attendance FOR ALL TO authenticated USING (is_admin()) WITH CHECK (is_admin());
CREATE POLICY "attendance teacher write" ON public.attendance FOR ALL TO authenticated
  USING (teaches_student(student_user_id)) WITH CHECK (teaches_student(student_user_id));

CREATE TABLE public.homework (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  class_id uuid NOT NULL REFERENCES public.classes(id) ON DELETE CASCADE,
  subject text NOT NULL,
  title text NOT NULL,
  detail text NOT NULL DEFAULT '',
  due_date date,
  attachment_path text,
  posted_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.homework TO authenticated;
GRANT ALL ON public.homework TO service_role;
ALTER TABLE public.homework ENABLE ROW LEVEL SECURITY;
CREATE POLICY "homework read" ON public.homework FOR SELECT TO authenticated USING (
  is_admin() OR teaches_class(class_id)
  OR EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.class_id = homework.class_id)
  OR EXISTS (SELECT 1 FROM public.profiles p JOIN public.parent_students ps ON ps.student_user_id = p.id
             WHERE ps.parent_user_id = auth.uid() AND p.class_id = homework.class_id)
);
CREATE POLICY "homework admin write" ON public.homework FOR ALL TO authenticated USING (is_admin()) WITH CHECK (is_admin());
CREATE POLICY "homework teacher write" ON public.homework FOR ALL TO authenticated USING (teaches_class(class_id)) WITH CHECK (teaches_class(class_id));

CREATE TABLE public.assignments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  class_id uuid NOT NULL REFERENCES public.classes(id) ON DELETE CASCADE,
  subject text NOT NULL,
  title text NOT NULL,
  detail text NOT NULL DEFAULT '',
  due_date date,
  max_marks numeric,
  attachment_path text,
  posted_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.assignments TO authenticated;
GRANT ALL ON public.assignments TO service_role;
ALTER TABLE public.assignments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "assignments read" ON public.assignments FOR SELECT TO authenticated USING (
  is_admin() OR teaches_class(class_id)
  OR EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.class_id = assignments.class_id)
  OR EXISTS (SELECT 1 FROM public.profiles p JOIN public.parent_students ps ON ps.student_user_id = p.id
             WHERE ps.parent_user_id = auth.uid() AND p.class_id = assignments.class_id)
);
CREATE POLICY "assignments admin write" ON public.assignments FOR ALL TO authenticated USING (is_admin()) WITH CHECK (is_admin());
CREATE POLICY "assignments teacher write" ON public.assignments FOR ALL TO authenticated USING (teaches_class(class_id)) WITH CHECK (teaches_class(class_id));

CREATE TABLE public.assignment_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  assignment_id uuid NOT NULL REFERENCES public.assignments(id) ON DELETE CASCADE,
  student_user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  submitted_at timestamptz,
  status text NOT NULL DEFAULT 'pending',
  marks numeric,
  remark text,
  file_path text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (assignment_id, student_user_id)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.assignment_submissions TO authenticated;
GRANT ALL ON public.assignment_submissions TO service_role;
ALTER TABLE public.assignment_submissions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "submissions read" ON public.assignment_submissions FOR SELECT TO authenticated
  USING (auth.uid() = student_user_id OR is_my_child(student_user_id) OR teaches_student(student_user_id) OR is_admin());
CREATE POLICY "submissions student write" ON public.assignment_submissions FOR ALL TO authenticated
  USING (auth.uid() = student_user_id) WITH CHECK (auth.uid() = student_user_id);
CREATE POLICY "submissions teacher write" ON public.assignment_submissions FOR ALL TO authenticated
  USING (teaches_student(student_user_id) OR is_admin()) WITH CHECK (teaches_student(student_user_id) OR is_admin());

CREATE TABLE public.results (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  class_id uuid REFERENCES public.classes(id) ON DELETE SET NULL,
  exam_name text NOT NULL,
  subject text NOT NULL,
  marks numeric,
  max_marks numeric NOT NULL DEFAULT 100,
  grade text,
  term text,
  session text,
  published boolean NOT NULL DEFAULT true,
  recorded_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.results TO authenticated;
GRANT ALL ON public.results TO service_role;
ALTER TABLE public.results ENABLE ROW LEVEL SECURITY;
CREATE POLICY "results read" ON public.results FOR SELECT TO authenticated USING (
  is_admin() OR teaches_student(student_user_id)
  OR (published AND (auth.uid() = student_user_id OR is_my_child(student_user_id)))
);
CREATE POLICY "results admin write" ON public.results FOR ALL TO authenticated USING (is_admin()) WITH CHECK (is_admin());
CREATE POLICY "results teacher write" ON public.results FOR ALL TO authenticated
  USING (teaches_student(student_user_id)) WITH CHECK (teaches_student(student_user_id));

-- ============ MEDIA LIBRARY ============
CREATE TABLE public.media_assets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  bucket text NOT NULL DEFAULT 'media',
  path text NOT NULL,
  url text NOT NULL,
  title text NOT NULL DEFAULT '',
  alt_text text NOT NULL DEFAULT '',
  category text NOT NULL DEFAULT 'general',
  mime_type text,
  size_bytes bigint,
  archived boolean NOT NULL DEFAULT false,
  uploaded_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.media_assets TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.media_assets TO authenticated;
GRANT ALL ON public.media_assets TO service_role;
ALTER TABLE public.media_assets ENABLE ROW LEVEL SECURITY;
CREATE POLICY "media public read" ON public.media_assets FOR SELECT TO anon, authenticated USING (archived = false);
CREATE POLICY "media admin write" ON public.media_assets FOR ALL TO authenticated USING (is_admin()) WITH CHECK (is_admin());

-- ============ PUBLIC WEBSITE CONTENT ============
CREATE TABLE public.notices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  summary text NOT NULL DEFAULT '',
  body text,
  category text NOT NULL DEFAULT 'General',
  publish_date date NOT NULL DEFAULT CURRENT_DATE,
  expiry_date date,
  pinned boolean NOT NULL DEFAULT false,
  published boolean NOT NULL DEFAULT true,
  archived boolean NOT NULL DEFAULT false,
  attachment_url text,
  attachment_name text,
  verified boolean NOT NULL DEFAULT false,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.notices TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.notices TO authenticated;
GRANT ALL ON public.notices TO service_role;
ALTER TABLE public.notices ENABLE ROW LEVEL SECURITY;
CREATE POLICY "notices public read" ON public.notices FOR SELECT TO anon, authenticated
  USING (published AND NOT archived AND publish_date <= CURRENT_DATE AND (expiry_date IS NULL OR expiry_date >= CURRENT_DATE));
CREATE POLICY "notices admin read" ON public.notices FOR SELECT TO authenticated USING (is_admin());
CREATE POLICY "notices admin write" ON public.notices FOR ALL TO authenticated USING (is_admin()) WITH CHECK (is_admin());

CREATE TABLE public.events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL DEFAULT '',
  event_date date,
  event_time text,
  location text,
  category text NOT NULL DEFAULT 'Academic',
  image_url text,
  attachment_url text,
  featured boolean NOT NULL DEFAULT false,
  published boolean NOT NULL DEFAULT true,
  archived boolean NOT NULL DEFAULT false,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.events TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.events TO authenticated;
GRANT ALL ON public.events TO service_role;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "events public read" ON public.events FOR SELECT TO anon, authenticated USING (published AND NOT archived);
CREATE POLICY "events admin read" ON public.events FOR SELECT TO authenticated USING (is_admin());
CREATE POLICY "events admin write" ON public.events FOR ALL TO authenticated USING (is_admin()) WITH CHECK (is_admin());

CREATE TABLE public.achievements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL DEFAULT '',
  category text NOT NULL DEFAULT 'General',
  achiever text,
  year text,
  image_url text,
  featured boolean NOT NULL DEFAULT false,
  published boolean NOT NULL DEFAULT true,
  archived boolean NOT NULL DEFAULT false,
  verified boolean NOT NULL DEFAULT false,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.achievements TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.achievements TO authenticated;
GRANT ALL ON public.achievements TO service_role;
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;
CREATE POLICY "achievements public read" ON public.achievements FOR SELECT TO anon, authenticated USING (published AND NOT archived);
CREATE POLICY "achievements admin read" ON public.achievements FOR SELECT TO authenticated USING (is_admin());
CREATE POLICY "achievements admin write" ON public.achievements FOR ALL TO authenticated USING (is_admin()) WITH CHECK (is_admin());

CREATE TABLE public.facilities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  name text NOT NULL,
  blurb text NOT NULL DEFAULT '',
  detail text NOT NULL DEFAULT '',
  image_url text,
  visible boolean NOT NULL DEFAULT true,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.facilities TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.facilities TO authenticated;
GRANT ALL ON public.facilities TO service_role;
ALTER TABLE public.facilities ENABLE ROW LEVEL SECURITY;
CREATE POLICY "facilities public read" ON public.facilities FOR SELECT TO anon, authenticated USING (visible);
CREATE POLICY "facilities admin read" ON public.facilities FOR SELECT TO authenticated USING (is_admin());
CREATE POLICY "facilities admin write" ON public.facilities FOR ALL TO authenticated USING (is_admin()) WITH CHECK (is_admin());

CREATE TABLE public.activities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  note text NOT NULL DEFAULT '',
  group_name text NOT NULL DEFAULT 'Activities',
  image_url text,
  verified boolean NOT NULL DEFAULT false,
  visible boolean NOT NULL DEFAULT true,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.activities TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.activities TO authenticated;
GRANT ALL ON public.activities TO service_role;
ALTER TABLE public.activities ENABLE ROW LEVEL SECURITY;
CREATE POLICY "activities public read" ON public.activities FOR SELECT TO anon, authenticated USING (visible);
CREATE POLICY "activities admin read" ON public.activities FOR SELECT TO authenticated USING (is_admin());
CREATE POLICY "activities admin write" ON public.activities FOR ALL TO authenticated USING (is_admin()) WITH CHECK (is_admin());

CREATE TABLE public.faculty_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL DEFAULT 'To be published',
  designation text NOT NULL DEFAULT '',
  qualification text NOT NULL DEFAULT '',
  subjects text[] NOT NULL DEFAULT '{}',
  group_name text NOT NULL DEFAULT 'teaching',
  bio text,
  photo_url text,
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  public_visible boolean NOT NULL DEFAULT true,
  active boolean NOT NULL DEFAULT true,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.faculty_members TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.faculty_members TO authenticated;
GRANT ALL ON public.faculty_members TO service_role;
ALTER TABLE public.faculty_members ENABLE ROW LEVEL SECURITY;
CREATE POLICY "faculty public read" ON public.faculty_members FOR SELECT TO anon, authenticated USING (public_visible AND active);
CREATE POLICY "faculty admin read" ON public.faculty_members FOR SELECT TO authenticated USING (is_admin());
CREATE POLICY "faculty admin write" ON public.faculty_members FOR ALL TO authenticated USING (is_admin()) WITH CHECK (is_admin());

CREATE TABLE public.documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL DEFAULT '',
  kind text NOT NULL DEFAULT 'PDF',
  group_name text NOT NULL DEFAULT 'Academics',
  file_url text,
  file_path text,
  session text,
  doc_date date,
  is_public boolean NOT NULL DEFAULT true,
  archived boolean NOT NULL DEFAULT false,
  verified boolean NOT NULL DEFAULT false,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.documents TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.documents TO authenticated;
GRANT ALL ON public.documents TO service_role;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
CREATE POLICY "documents public read" ON public.documents FOR SELECT TO anon, authenticated USING (is_public AND NOT archived);
CREATE POLICY "documents signed in read" ON public.documents FOR SELECT TO authenticated USING (NOT archived);
CREATE POLICY "documents admin read" ON public.documents FOR SELECT TO authenticated USING (is_admin());
CREATE POLICY "documents admin write" ON public.documents FOR ALL TO authenticated USING (is_admin()) WITH CHECK (is_admin());

CREATE TABLE public.gallery_albums (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  description text NOT NULL DEFAULT '',
  cover_url text,
  category text NOT NULL DEFAULT 'Campus',
  visible boolean NOT NULL DEFAULT true,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.gallery_albums TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.gallery_albums TO authenticated;
GRANT ALL ON public.gallery_albums TO service_role;
ALTER TABLE public.gallery_albums ENABLE ROW LEVEL SECURITY;
CREATE POLICY "albums public read" ON public.gallery_albums FOR SELECT TO anon, authenticated USING (visible);
CREATE POLICY "albums admin read" ON public.gallery_albums FOR SELECT TO authenticated USING (is_admin());
CREATE POLICY "albums admin write" ON public.gallery_albums FOR ALL TO authenticated USING (is_admin()) WITH CHECK (is_admin());

CREATE TABLE public.gallery_photos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  album_id uuid REFERENCES public.gallery_albums(id) ON DELETE SET NULL,
  title text NOT NULL DEFAULT '',
  caption text NOT NULL DEFAULT '',
  alt_text text NOT NULL DEFAULT '',
  image_url text NOT NULL,
  storage_path text,
  category text NOT NULL DEFAULT 'Campus',
  taken_on date,
  featured boolean NOT NULL DEFAULT false,
  show_on_home boolean NOT NULL DEFAULT false,
  archived boolean NOT NULL DEFAULT false,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.gallery_photos TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.gallery_photos TO authenticated;
GRANT ALL ON public.gallery_photos TO service_role;
ALTER TABLE public.gallery_photos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "photos public read" ON public.gallery_photos FOR SELECT TO anon, authenticated USING (NOT archived);
CREATE POLICY "photos admin read" ON public.gallery_photos FOR SELECT TO authenticated USING (is_admin());
CREATE POLICY "photos admin write" ON public.gallery_photos FOR ALL TO authenticated USING (is_admin()) WITH CHECK (is_admin());

-- ============ FORM SUBMISSIONS ============
CREATE TABLE public.admission_enquiries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_name text NOT NULL,
  parent_name text,
  phone text,
  email text,
  class_applied text,
  source text NOT NULL DEFAULT 'Website',
  message text,
  status text NOT NULL DEFAULT 'New',
  admin_note text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT INSERT ON public.admission_enquiries TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.admission_enquiries TO authenticated;
GRANT ALL ON public.admission_enquiries TO service_role;
ALTER TABLE public.admission_enquiries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "enquiries public submit" ON public.admission_enquiries FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "enquiries admin manage" ON public.admission_enquiries FOR ALL TO authenticated USING (is_admin()) WITH CHECK (is_admin());

CREATE TABLE public.contact_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text,
  phone text,
  subject text,
  message text NOT NULL,
  status text NOT NULL DEFAULT 'New',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT INSERT ON public.contact_messages TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.contact_messages TO authenticated;
GRANT ALL ON public.contact_messages TO service_role;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "contact public submit" ON public.contact_messages FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "contact admin manage" ON public.contact_messages FOR ALL TO authenticated USING (is_admin()) WITH CHECK (is_admin());

-- ============ CMS SCAFFOLDING ============
CREATE TABLE public.content_blocks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text NOT NULL UNIQUE,
  page text NOT NULL DEFAULT 'home',
  label text NOT NULL DEFAULT '',
  heading text,
  subheading text,
  body text,
  image_url text,
  link_label text,
  link_to text,
  data jsonb NOT NULL DEFAULT '{}'::jsonb,
  enabled boolean NOT NULL DEFAULT true,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.content_blocks TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.content_blocks TO authenticated;
GRANT ALL ON public.content_blocks TO service_role;
ALTER TABLE public.content_blocks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "blocks public read" ON public.content_blocks FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "blocks admin write" ON public.content_blocks FOR ALL TO authenticated USING (is_admin()) WITH CHECK (is_admin());

CREATE TABLE public.site_settings (
  id text PRIMARY KEY DEFAULT 'default',
  school_name text NOT NULL DEFAULT 'Mangalam Vidya Vihar',
  short_name text NOT NULL DEFAULT 'MVV',
  tagline text NOT NULL DEFAULT '',
  address text NOT NULL DEFAULT '',
  phones text[] NOT NULL DEFAULT '{}',
  email text NOT NULL DEFAULT '',
  office_hours text NOT NULL DEFAULT '',
  map_url text,
  map_lat text,
  map_lng text,
  logo_url text,
  favicon_url text,
  social_links jsonb NOT NULL DEFAULT '{}'::jsonb,
  academic_session text NOT NULL DEFAULT '2025-26',
  footer_text text NOT NULL DEFAULT '',
  seo_title text NOT NULL DEFAULT '',
  seo_description text NOT NULL DEFAULT '',
  seo_image_url text,
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.site_settings TO anon;
GRANT SELECT, INSERT, UPDATE ON public.site_settings TO authenticated;
GRANT ALL ON public.site_settings TO service_role;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "settings public read" ON public.site_settings FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "settings admin write" ON public.site_settings FOR ALL TO authenticated USING (is_admin()) WITH CHECK (is_admin());

CREATE TABLE public.navigation_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  label text NOT NULL,
  route text NOT NULL,
  parent_key text,
  visible boolean NOT NULL DEFAULT true,
  featured boolean NOT NULL DEFAULT false,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.navigation_items TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.navigation_items TO authenticated;
GRANT ALL ON public.navigation_items TO service_role;
ALTER TABLE public.navigation_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "nav public read" ON public.navigation_items FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "nav admin write" ON public.navigation_items FOR ALL TO authenticated USING (is_admin()) WITH CHECK (is_admin());

CREATE TABLE public.audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  actor_label text,
  action text NOT NULL,
  object_type text,
  object_id text,
  detail jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.audit_logs TO authenticated;
GRANT ALL ON public.audit_logs TO service_role;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "audit admin read" ON public.audit_logs FOR SELECT TO authenticated USING (is_admin());

-- ============ updated_at triggers ============
DO $$
DECLARE t text;
BEGIN
  FOREACH t IN ARRAY ARRAY['subjects','timetable_slots','attendance','homework','assignments','assignment_submissions','results','media_assets','notices','events','achievements','facilities','activities','faculty_members','documents','gallery_albums','gallery_photos','admission_enquiries','contact_messages','content_blocks','site_settings','navigation_items']
  LOOP
    EXECUTE format('CREATE TRIGGER touch_%1$s_updated_at BEFORE UPDATE ON public.%1$s FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at()', t);
  END LOOP;
END $$;

-- ============ SEED CURRENT WEBSITE CONTENT ============
INSERT INTO public.site_settings (id, school_name, short_name, tagline, address, phones, email, office_hours, academic_session, footer_text, seo_title, seo_description)
VALUES ('default','Mangalam Vidya Vihar','MVV','Run by Mangalam Pragati Foundation · Morak, Kota, Rajasthan',
 'Basant Vihar, Aditya Nager, Morak, District Kota (Rajasthan), PIN 326520',
 ARRAY['9461811678','704433502'],'mvvmorak@gmail.com',
 'Monday – Saturday · 09:00 – 15:00 (verify with school)','2025-26',
 'Mangalam Vidya Vihar, Morak · Run by Mangalam Pragati Foundation',
 'Mangalam Vidya Vihar — School in Morak, Kota',
 'Mangalam Vidya Vihar, Morak (Kota, Rajasthan) — admissions, academics, campus, notices and the school portal.');

INSERT INTO public.navigation_items (label, route, sort_order) VALUES
 ('Home','/',1),('About','/about',2),('Academics','/academics',3),('Admissions','/admissions',4),
 ('Campus','/campus',5),('Activities','/activities',6),('Achievements','/achievements',7),('Faculty','/faculty',8),
 ('Notices','/notices',9),('Events','/events',10),('Gallery','/gallery',11),('Resources','/resources',12),('Contact','/contact',13);

INSERT INTO public.notices (title, summary, category, publish_date, verified, attachment_name) VALUES
 ('Notification for Admission 2025-26','Admission notification published on the school notice board. Verify the current admission cycle with the school office.','Admission','2025-04-02',true,'Notification for Admission 2025-26.pdf'),
 ('Almanac 2025-26 (Nursery to Class XII)','Full academic almanac available as a download in Resources.','Circular','2025-04-01',true,'Almanac 2025-26 NUR TO XII.pdf'),
 ('Parent–teacher meeting for all classes','Discussion of mid-term progress and co-curricular plans.','PTM','2026-03-02',false,NULL),
 ('Computer lab timings revised for Classes IX & X','Updated session blocks posted on the notice board.','General','2026-02-28',false,NULL),
 ('Library reading week opens','Special hours and a new shelf of regional titles.','General','2026-02-24',false,NULL),
 ('Term fee reminder','Please clear dues at the school office before month end.','Circular','2026-02-20',false,NULL),
 ('Periodic test schedule circulated','Datesheet shared with class teachers for distribution.','Examination','2026-02-12',false,NULL);

INSERT INTO public.events (title, event_date, event_time, location, category, sort_order) VALUES
 ('Annual Science Exhibition','2026-03-21','10:00','Science block','Academic',1),
 ('Inter-house athletics','2026-04-04','09:30','School grounds','Sports',2),
 ('Spring recital — music & drama','2026-04-18','17:00','Assembly hall','Cultural',3),
 ('Parent open day','2026-05-09','09:00','Main campus','Parents',4),
 ('Investiture Ceremony','2026-05-24','08:30','Assembly hall','Cultural',5),
 ('Summer camp Umang — enrolment','2026-06-02','08:00','Activity block','Cultural',6);

INSERT INTO public.achievements (title, year, verified, category, sort_order) VALUES
 ('Cricket (Under-19 boys) — Champions at state level','2024-25',true,'Sports',1),
 ('Winner team at district level in cricket','2024-25',true,'Sports',2),
 ('Represented at the district level cricket tournament','2024-25',true,'Sports',3),
 ('Sports Meet — Runner Up','2024-25',true,'Sports',4),
 ('Distribution of certificates for Olympiad & cultural events','2024-25',true,'Academic',5),
 ('हिंदी वाद विवाद प्रतियोगिता — participation','2025-26',true,'Cultural',6);

INSERT INTO public.facilities (slug, name, blurb, detail, sort_order) VALUES
 ('library','Library','Reference shelves, reading tables and periodicals for all classes.','The library serves as the school''s quiet study space with reference sections for each stage.

Detailed collection counts, borrowing rules and reading-period allocation are placeholder content pending school confirmation.',1),
 ('computer-lab','Computer Lab','Practical computing sessions timetabled through the week.','The computer lab supports the school''s computer science and IT practical periods.

System counts, software and internet provisioning details are placeholder content.',2),
 ('physics-lab','Physics Lab','Apparatus for senior secondary practical work.','The physics laboratory supports prescribed practical work for senior classes.

Equipment inventory is placeholder content pending school confirmation.',3),
 ('chemistry-lab','Chemistry Lab','Fume provision, reagent storage and experiment benches.','The chemistry laboratory is used for prescribed experiments with supervised safety procedure.

Safety protocol documentation is placeholder content.',4),
 ('biology-lab','Biology Lab','Microscopes, models and specimen collection.','The biology laboratory supports dissection-free practical work, models and slide study.

Inventory details are placeholder content.',5),
 ('indoor-games','Indoor Games','Indoor games hall used during activity periods.','Indoor games are scheduled through games periods and inter-house activity weeks.

Facility dimensions and equipment lists are placeholder content.',6);

INSERT INTO public.activities (title, note, group_name, verified, sort_order) VALUES
 ('Cultural Activities','Annual cultural calendar including music, dance and drama.','Activities',true,1),
 ('Mask Making Activity','Art and craft activity for junior classes.','Activities',true,2),
 ('Aerobic Exercise & Pyramid','Fitness display performed at school functions.','Activities',true,3),
 ('Nature Walk','Outdoor environment awareness walk.','Activities',true,4),
 ('Swachh Bharat Mission','Cleanliness drive on campus and in the neighbourhood.','Activities',true,5),
 ('Students Council Election','Student council nomination, campaign and election.','Activities',true,6),
 ('Summer Camp Umang','Vacation activity camp for students.','Activities',true,7),
 ('बाल कवि सम्मेलन','Young poets'' assembly.','Activities',true,8),
 ('हिंदी वाद विवाद प्रतियोगिता','Hindi debate competition.','Competitions',true,1),
 ('Olympiad & cultural event certification','Certificates distributed at assembly.','Competitions',true,2),
 ('Inter-house quiz','Placeholder — house-wise general knowledge quiz.','Competitions',false,3),
 ('Cricket academy','Cricket academy inaugurated in 2025.','Sports',true,1),
 ('Annual sports meet','House-wise track and field meet.','Sports',true,2),
 ('Indoor games','Games periods and inter-house indoor fixtures.','Sports',false,3);

INSERT INTO public.faculty_members (designation, qualification, group_name, sort_order) VALUES
 ('Principal','—','administrative',1),('Vice Principal','—','administrative',2),('Office Superintendent','—','administrative',3),
 ('Mathematics','—','teaching',1),('Physics','—','teaching',2),('Chemistry','—','teaching',3),('Biology','—','teaching',4),
 ('English','—','teaching',5),('Hindi','—','teaching',6),('Social Science','—','teaching',7),('Computer Science','—','teaching',8),
 ('Librarian','—','non-teaching',1),('Lab Attendant','—','non-teaching',2),('Transport','—','non-teaching',3);

INSERT INTO public.documents (title, kind, group_name, description, verified, sort_order) VALUES
 ('Almanac 2025-26 (Nursery to Class XII)','PDF','Academics','Existing school download — verify freshness.',true,1),
 ('Notification for Admission 2025-26','PDF','Admissions','Existing school download — verify current cycle.',true,2),
 ('Affiliation 2023-28','PDF','Compliance','Existing school download — affiliation document.',true,3),
 ('Job Application Form','DOC','Careers','Existing school download — recruitment form.',true,4),
 ('Transfer Certificate request','Form','Student services','Placeholder request form for TC issue.',false,5),
 ('School circulars archive','PDF','Academics','Placeholder — circular archive by session.',false,6);

INSERT INTO public.subjects (name, sort_order) VALUES
 ('English',1),('Hindi',2),('Mathematics',3),('Science',4),('Physics',5),('Chemistry',6),('Biology',7),
 ('Social Science',8),('Computer Science',9),('General Knowledge',10);

INSERT INTO public.content_blocks (key, page, label, heading, subheading, body, enabled, sort_order) VALUES
 ('home.hero','home','Homepage hero','Mangalam Vidya Vihar','Morak, District Kota · Rajasthan','A school run by Mangalam Pragati Foundation, offering classes from Nursery to Class XII.',true,1),
 ('home.about','home','Homepage about section','About the school',NULL,'Mangalam Vidya Vihar is run by Mangalam Pragati Foundation at Basant Vihar, Aditya Nager, Morak. Replace this text with the school''s approved introduction.',true,2),
 ('home.stats','home','Homepage statistics','By the numbers',NULL,NULL,true,3),
 ('home.principal','home','Principal message (home)','From the Principal','Principal · To be published','Placeholder message. Replace with the Principal''s approved message.',true,4),
 ('home.gallery','home','Homepage gallery','Life at MVV',NULL,NULL,true,5),
 ('about.history','about','School history','Our history',NULL,'Placeholder history text pending school confirmation.',true,1),
 ('about.vision','about','Vision','Vision',NULL,'Placeholder vision statement pending school confirmation.',true,2),
 ('about.mission','about','Mission','Mission',NULL,'Placeholder mission statement pending school confirmation.',true,3),
 ('about.values','about','Values','Values',NULL,'Placeholder values pending school confirmation.',true,4),
 ('about.principal','about','Principal message','Principal''s message','To be published','Placeholder message pending school confirmation.',true,5),
 ('about.disclosure','about','Mandatory public disclosure','Mandatory public disclosure',NULL,'Affiliation number, school code, principal name, staff counts and infrastructure details are pending school confirmation.',true,6),
 ('academics.school-hours','academics','School hours','School Hours','Daily timings for the school office, assembly and teaching periods.','Placeholder timings: assembly 07:55, first period 08:10, dispersal 13:40. Winter and summer schedules differ.',true,1),
 ('academics.rules-and-regulations','academics','Rules & regulations','Rules & Regulations','General conduct, uniform and attendance expectations.','Students are expected to attend in complete school uniform and carry the school diary daily. Full rules text should be transferred verbatim from the school''s approved handbook.',true,2),
 ('academics.examination-schedule','academics','Examination schedule','Examination Schedule','Periodic tests, half-yearly and annual examination windows.','The current-session datesheet will be published here and in Notices.',true,3),
 ('academics.fee-structure','academics','Fee structure','Fee Structure','Class-wise fee heads and payment schedule.','The school''s approved fee schedule must be uploaded as an official document before this page goes live.',true,4),
 ('academics.note-to-parents','academics','Note to parents','Note to Parents','Guidance on supporting learning at home and staying in touch.','Parents are requested to check the school diary daily, attend parent–teacher meetings and use the school office for all official communication.',true,5),
 ('academics.instructions-to-students','academics','Instructions to students','Instructions to Students','Daily expectations for students on campus.','Reach school before assembly, keep the campus clean, and hand over lost property at the office.',true,6),
 ('admissions.overview','admissions','Admissions overview','Admissions','Admission information for the current session.','Contact the school office for the current admission cycle.',true,1),
 ('admissions.eligibility','admissions','Eligibility','Eligibility',NULL,'Age criteria for entry classes, transfer certificate requirements and previous report card submission apply.',true,2),
 ('admissions.procedure','admissions','Procedure','Admission procedure',NULL,'Interaction for pre-primary entry; written assessment for higher classes in core subjects.',true,3),
 ('admissions.documents','admissions','Required documents','Required documents',NULL,'Birth certificate, transfer certificate, previous report card and passport photographs.',true,4),
 ('admissions.dates','admissions','Important dates','Important dates',NULL,'Pending school confirmation.',true,5),
 ('contact.info','contact','Contact page intro','Contact the school office',NULL,'The school office handles admissions, records and all official communication.',true,1);