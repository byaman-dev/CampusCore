CREATE POLICY "media admin write" ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id IN ('media','documents') AND public.is_admin());
CREATE POLICY "media admin update" ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id IN ('media','documents') AND public.is_admin())
  WITH CHECK (bucket_id IN ('media','documents') AND public.is_admin());
CREATE POLICY "media admin delete" ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id IN ('media','documents') AND public.is_admin());
CREATE POLICY "media signed in read" ON storage.objects FOR SELECT TO authenticated
  USING (bucket_id IN ('media','documents'));