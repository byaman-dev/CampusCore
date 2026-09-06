-- 1. Fourth role
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'parent';

-- 2. Profile fields
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS login_id TEXT,
  ADD COLUMN IF NOT EXISTS active BOOLEAN NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS phone TEXT,
  ADD COLUMN IF NOT EXISTS student_id TEXT,
  ADD COLUMN IF NOT EXISTS class_id UUID,
  ADD COLUMN IF NOT EXISTS section TEXT,
  ADD COLUMN IF NOT EXISTS roll_number TEXT,
  ADD COLUMN IF NOT EXISTS admission_number TEXT,
  ADD COLUMN IF NOT EXISTS employee_id TEXT,
  ADD COLUMN IF NOT EXISTS subjects TEXT[] NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS parent_id TEXT,
  ADD COLUMN IF NOT EXISTS admin_id TEXT,
  ADD COLUMN IF NOT EXISTS admin_level TEXT,
  ADD COLUMN IF NOT EXISTS must_change_password BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT now();

CREATE UNIQUE INDEX IF NOT EXISTS profiles_login_id_lower_key
  ON public.profiles (lower(login_id)) WHERE login_id IS NOT NULL;

-- 3. Classes register
CREATE TABLE IF NOT EXISTS public.classes (
  id UUID NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  section TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (name, section)
);
GRANT SELECT ON public.classes TO authenticated;
GRANT INSERT, UPDATE, DELETE ON public.classes TO authenticated;
GRANT ALL ON public.classes TO service_role;
ALTER TABLE public.classes ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.profiles
  DROP CONSTRAINT IF EXISTS profiles_class_id_fkey;
ALTER TABLE public.profiles
  ADD CONSTRAINT profiles_class_id_fkey
  FOREIGN KEY (class_id) REFERENCES public.classes(id) ON DELETE SET NULL;

-- 4. Parent -> student links
CREATE TABLE IF NOT EXISTS public.parent_students (
  id UUID NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_user_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  student_user_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  relation TEXT NOT NULL DEFAULT 'guardian',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (parent_user_id, student_user_id)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.parent_students TO authenticated;
GRANT ALL ON public.parent_students TO service_role;
ALTER TABLE public.parent_students ENABLE ROW LEVEL SECURITY;

-- 5. Teacher -> class links
CREATE TABLE IF NOT EXISTS public.teacher_classes (
  id UUID NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
  teacher_user_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  class_id UUID NOT NULL REFERENCES public.classes(id) ON DELETE CASCADE,
  subject TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (teacher_user_id, class_id, subject)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.teacher_classes TO authenticated;
GRANT ALL ON public.teacher_classes TO service_role;
ALTER TABLE public.teacher_classes ENABLE ROW LEVEL SECURITY;

-- 6. Authorization helpers
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin'
  )
$$;
REVOKE ALL ON FUNCTION public.is_admin() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated;

CREATE OR REPLACE FUNCTION public.is_my_child(_student_user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.parent_students
    WHERE parent_user_id = auth.uid() AND student_user_id = _student_user_id
  )
$$;
REVOKE ALL ON FUNCTION public.is_my_child(UUID) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.is_my_child(UUID) TO authenticated;

CREATE OR REPLACE FUNCTION public.teaches_class(_class_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT _class_id IS NOT NULL AND EXISTS (
    SELECT 1 FROM public.teacher_classes
    WHERE teacher_user_id = auth.uid() AND class_id = _class_id
  )
$$;
REVOKE ALL ON FUNCTION public.teaches_class(UUID) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.teaches_class(UUID) TO authenticated;

CREATE OR REPLACE FUNCTION public.teaches_student(_student_user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.profiles p
    JOIN public.teacher_classes tc ON tc.class_id = p.class_id
    WHERE p.id = _student_user_id AND tc.teacher_user_id = auth.uid()
  )
$$;
REVOKE ALL ON FUNCTION public.teaches_student(UUID) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.teaches_student(UUID) TO authenticated;

-- 7. Policies
DROP POLICY IF EXISTS "Parents can view linked children" ON public.profiles;
CREATE POLICY "Parents can view linked children" ON public.profiles
  FOR SELECT TO authenticated USING (public.is_my_child(id));

DROP POLICY IF EXISTS "Teachers can view their students" ON public.profiles;
CREATE POLICY "Teachers can view their students" ON public.profiles
  FOR SELECT TO authenticated USING (public.teaches_student(id));

DROP POLICY IF EXISTS "Admins can update all profiles" ON public.profiles;
CREATE POLICY "Admins can update all profiles" ON public.profiles
  FOR UPDATE TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Everyone signed in can read classes" ON public.classes;
CREATE POLICY "Everyone signed in can read classes" ON public.classes
  FOR SELECT TO authenticated USING (true);
DROP POLICY IF EXISTS "Admins manage classes" ON public.classes;
CREATE POLICY "Admins manage classes" ON public.classes
  FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Parents see own links" ON public.parent_students;
CREATE POLICY "Parents see own links" ON public.parent_students
  FOR SELECT TO authenticated USING (auth.uid() = parent_user_id OR auth.uid() = student_user_id);
DROP POLICY IF EXISTS "Admins manage parent links" ON public.parent_students;
CREATE POLICY "Admins manage parent links" ON public.parent_students
  FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Teachers see own class links" ON public.teacher_classes;
CREATE POLICY "Teachers see own class links" ON public.teacher_classes
  FOR SELECT TO authenticated USING (auth.uid() = teacher_user_id OR public.is_admin());
DROP POLICY IF EXISTS "Admins manage teacher links" ON public.teacher_classes;
CREATE POLICY "Admins manage teacher links" ON public.teacher_classes
  FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

-- 8. updated_at maintenance
CREATE OR REPLACE FUNCTION public.touch_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;
REVOKE ALL ON FUNCTION public.touch_updated_at() FROM PUBLIC, anon, authenticated;

DROP TRIGGER IF EXISTS touch_profiles_updated_at ON public.profiles;
CREATE TRIGGER touch_profiles_updated_at BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

DROP TRIGGER IF EXISTS touch_classes_updated_at ON public.classes;
CREATE TRIGGER touch_classes_updated_at BEFORE UPDATE ON public.classes
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- 9. Profile creation trigger also stores the school login id
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email, login_id)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', NEW.raw_user_meta_data ->> 'name', ''),
    NEW.email,
    NULLIF(NEW.raw_user_meta_data ->> 'login_id', '')
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;
REVOKE ALL ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;