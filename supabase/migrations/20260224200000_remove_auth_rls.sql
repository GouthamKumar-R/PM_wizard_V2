-- Remove auth-based RLS policies and replace with open policies (no authentication required)

-- ─── Documents ────────────────────────────────────────────────────────────────
DROP POLICY IF EXISTS "Users can view their own documents" ON public.documents;
DROP POLICY IF EXISTS "Users can insert their own documents" ON public.documents;
DROP POLICY IF EXISTS "Users can update their own documents" ON public.documents;
DROP POLICY IF EXISTS "Users can delete their own documents" ON public.documents;

CREATE POLICY "Allow all select on documents" ON public.documents FOR SELECT USING (true);
CREATE POLICY "Allow all insert on documents" ON public.documents FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow all update on documents" ON public.documents FOR UPDATE USING (true);
CREATE POLICY "Allow all delete on documents" ON public.documents FOR DELETE USING (true);

-- ─── Insights ─────────────────────────────────────────────────────────────────
DROP POLICY IF EXISTS "Users can view their own insights" ON public.insights;
DROP POLICY IF EXISTS "Users can insert their own insights" ON public.insights;
DROP POLICY IF EXISTS "Users can delete their own insights" ON public.insights;

CREATE POLICY "Allow all select on insights" ON public.insights FOR SELECT USING (true);
CREATE POLICY "Allow all insert on insights" ON public.insights FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow all delete on insights" ON public.insights FOR DELETE USING (true);

-- ─── Storage ──────────────────────────────────────────────────────────────────
DROP POLICY IF EXISTS "Users can upload their own documents" ON storage.objects;
DROP POLICY IF EXISTS "Users can view their own documents" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own documents" ON storage.objects;

CREATE POLICY "Allow all uploads to documents bucket" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'documents');
CREATE POLICY "Allow all reads from documents bucket" ON storage.objects FOR SELECT USING (bucket_id = 'documents');
CREATE POLICY "Allow all deletes from documents bucket" ON storage.objects FOR DELETE USING (bucket_id = 'documents');
