-- ═══════════════════════════════════════════════════════════════
--  RESOURCE HUB — Schema + Seed Data
--  Run this in Supabase SQL Editor after the base tables exist.
-- ═══════════════════════════════════════════════════════════════

-- 1) Educators table
CREATE TABLE IF NOT EXISTS public.educators (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  handle TEXT,
  platform TEXT NOT NULL,
  profile_url TEXT NOT NULL,
  thumbnail_url TEXT,
  subjects TEXT[] DEFAULT '{}',
  exams TEXT[] DEFAULT '{}',
  language TEXT DEFAULT 'Hindi',
  is_free BOOLEAN DEFAULT true,
  description TEXT,
  subscriber_count TEXT,
  rating NUMERIC DEFAULT 0,
  city_origin TEXT,
  verified BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 2) Resource links table
CREATE TABLE IF NOT EXISTS public.resource_links (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  educator_id UUID REFERENCES public.educators(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  url TEXT NOT NULL,
  resource_type TEXT NOT NULL,
  subject TEXT NOT NULL,
  topic TEXT,
  exam TEXT NOT NULL,
  duration_hours NUMERIC,
  is_pinned BOOLEAN DEFAULT false,
  upvotes INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 3) Community upvotes (one per user per resource)
CREATE TABLE IF NOT EXISTS public.resource_upvotes (
  user_id UUID REFERENCES auth.users(id),
  resource_id UUID REFERENCES public.resource_links(id),
  PRIMARY KEY (user_id, resource_id)
);

-- ═══ RLS Policies ═══
ALTER TABLE public.educators ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resource_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resource_upvotes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read educators" ON public.educators FOR SELECT USING (true);
CREATE POLICY "Public read resources" ON public.resource_links FOR SELECT USING (true);
CREATE POLICY "Users can upvote" ON public.resource_upvotes FOR ALL USING (auth.uid() = user_id);

-- ═══ Seed Data: Educators ═══
INSERT INTO public.educators (name, handle, platform, profile_url, subjects, exams, language, description, subscriber_count, city_origin, verified, rating)
VALUES
('Alakh Pandey', '@PhysicsWallah', 'youtube', 'https://youtube.com/@PhysicsWallahAlakhPandey', ARRAY['Physics','Chemistry'], ARRAY['JEE','NEET'], 'Hinglish', 'Best for conceptual clarity. Started from Allahabad, built for Tier-2 students.', '10.2M', 'Allahabad', true, 4.9),
('Vedantu JEE', '@VedantuJEEEnglish', 'youtube', 'https://youtube.com/@VedantuJEEEnglish', ARRAY['Physics','Maths','Chemistry'], ARRAY['JEE'], 'English', 'Structured live + recorded sessions. Good for English-medium students.', '2.1M', 'Bengaluru', true, 4.7),
('Arvind Kalia', '@ExamPundit', 'youtube', 'https://youtube.com/@ArvindKalia', ARRAY['Maths'], ARRAY['JEE','Class 12'], 'Hindi', 'Pure Hindi Maths — best for students who struggle with English explanations.', '890K', 'Jaipur', true, 4.6),
('Paaras Thakur', '@PaarasThakur', 'youtube', 'https://youtube.com/@PaarasThakur', ARRAY['Chemistry'], ARRAY['JEE','NEET'], 'Hinglish', 'Organic Chemistry made simple. Legendary for named reactions.', '3.4M', 'Kota', true, 4.8),
('Khan Academy India', '@KhanAcademyHindi', 'youtube', 'https://youtube.com/@khanacademyhindi', ARRAY['Maths','Science'], ARRAY['Class 10','Class 12','CUET'], 'Hindi', 'Foundational concepts in pure Hindi. Perfect for building basics from scratch.', '1.2M', NULL, true, 4.5);

-- ═══ Seed Data: Resource Links ═══
INSERT INTO public.resource_links (educator_id, title, url, resource_type, subject, topic, exam, duration_hours, is_pinned, upvotes)
SELECT id, 'Complete Electrostatics Series', 'https://youtube.com/playlist?list=PLECFJzFIBbMXXUhDoO8iBVMBN0NzjFJhN', 'playlist', 'Physics', 'Electrostatics', 'JEE', 12, true, 342
FROM public.educators WHERE handle = '@PhysicsWallah';

INSERT INTO public.resource_links (educator_id, title, url, resource_type, subject, topic, exam, duration_hours, is_pinned, upvotes)
SELECT id, 'NEET Chemistry Complete Revision', 'https://youtube.com/playlist?list=neet-chem', 'playlist', 'Chemistry', NULL, 'NEET', 20, false, 218
FROM public.educators WHERE handle = '@PhysicsWallah';

INSERT INTO public.resource_links (educator_id, title, url, resource_type, subject, topic, exam, duration_hours, is_pinned, upvotes)
SELECT id, 'JEE Mains 2025 Full Crash Course', 'https://youtube.com/playlist?list=vedantu-crash', 'playlist', 'Maths', NULL, 'JEE', 40, true, 156
FROM public.educators WHERE handle = '@VedantuJEEEnglish';

INSERT INTO public.resource_links (educator_id, title, url, resource_type, subject, topic, exam, duration_hours, is_pinned, upvotes)
SELECT id, 'Class 12 Integration Made Easy', 'https://youtube.com/playlist?list=integration', 'playlist', 'Maths', 'Integration', 'Class 12', 8, false, 89
FROM public.educators WHERE handle = '@ExamPundit';

INSERT INTO public.resource_links (educator_id, title, url, resource_type, subject, topic, exam, duration_hours, is_pinned, upvotes)
SELECT id, 'Organic Chemistry Named Reactions One-Shot', 'https://youtube.com/watch?v=named-rxn', 'video', 'Chemistry', 'Named Reactions', 'JEE', 3, true, 430
FROM public.educators WHERE handle = '@PaarasThakur';

INSERT INTO public.resource_links (educator_id, title, url, resource_type, subject, topic, exam, duration_hours, is_pinned, upvotes)
SELECT id, 'CUET General Test — Full Course', 'https://youtube.com/playlist?list=cuet-gen', 'playlist', 'Science', NULL, 'CUET', 15, false, 67
FROM public.educators WHERE handle = '@KhanAcademyHindi';
