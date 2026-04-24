
CREATE TABLE public.reports (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  photo_url TEXT NOT NULL,
  severity TEXT NOT NULL,
  estimated_area TEXT NOT NULL,
  description TEXT NOT NULL,
  latitude DOUBLE PRECISION NOT NULL,
  longitude DOUBLE PRECISION NOT NULL,
  address TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view reports" ON public.reports FOR SELECT USING (true);
CREATE POLICY "Anyone can create reports" ON public.reports FOR INSERT WITH CHECK (true);

INSERT INTO storage.buckets (id, name, public) VALUES ('damage-photos', 'damage-photos', true);

CREATE POLICY "Public can view damage photos" ON storage.objects FOR SELECT USING (bucket_id = 'damage-photos');
CREATE POLICY "Anyone can upload damage photos" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'damage-photos');
