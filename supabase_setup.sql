-- 1. Create tables

CREATE TABLE public.colleges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    state TEXT NOT NULL,
    city TEXT NOT NULL,
    streams_supported TEXT[] DEFAULT '{}',
    admission_mode TEXT,
    application_end DATE,
    is_featured BOOLEAN DEFAULT false,
    website TEXT,
    established_year INT,
    facilities JSONB DEFAULT '[]',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE public.exams_timeline (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    stream TEXT NOT NULL,
    target_exam TEXT,
    start_date DATE,
    end_date DATE,
    priority INT DEFAULT 0,
    is_national BOOLEAN DEFAULT true,
    state TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE public.mentors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID, -- REFERENCES auth.users(id) ON DELETE CASCADE
    stream TEXT NOT NULL,
    rating NUMERIC(3,2) DEFAULT 0.0,
    college TEXT NOT NULL,
    branch TEXT NOT NULL,
    bio TEXT,
    photo_url TEXT,
    rate_inr INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Enable RLS
ALTER TABLE public.colleges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exams_timeline ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mentors ENABLE ROW LEVEL SECURITY;

-- 3. Create Policies
-- Colleges: public read, authenticated insert/update
CREATE POLICY "Enable read access for all users" ON public.colleges FOR SELECT USING (true);
CREATE POLICY "Enable insert for authenticated users only" ON public.colleges FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Enable update for authenticated users only" ON public.colleges FOR UPDATE TO authenticated USING (true);

-- Exams Timeline: public read, authenticated insert/update
CREATE POLICY "Enable read access for all users" ON public.exams_timeline FOR SELECT USING (true);
CREATE POLICY "Enable insert for authenticated users only" ON public.exams_timeline FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Enable update for authenticated users only" ON public.exams_timeline FOR UPDATE TO authenticated USING (true);

-- Mentors: public read, authenticated insert/update
CREATE POLICY "Enable read access for all users" ON public.mentors FOR SELECT USING (true);
CREATE POLICY "Enable insert for authenticated users only" ON public.mentors FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Enable update for authenticated users only" ON public.mentors FOR UPDATE TO authenticated USING (true);

-- 4. Seed Data

-- Seed 8 colleges
INSERT INTO public.colleges (id, name, state, city, streams_supported, admission_mode, application_end, is_featured, website, established_year, facilities) VALUES
(gen_random_uuid(), 'NIT Trichy', 'Tamil Nadu', 'Tiruchirappalli', '{"Engineering", "Architecture"}', 'JEE Main', '2026-06-30', true, 'https://www.nitt.edu', 1964, '["Hostel", "Library", "WiFi", "Sports"]'),
(gen_random_uuid(), 'IIT Bombay', 'Maharashtra', 'Mumbai', '{"Engineering", "Science", "Design"}', 'JEE Advanced', '2026-06-25', true, 'https://www.iitb.ac.in', 1958, '["Hostel", "Library", "WiFi", "Sports", "Gym"]'),
(gen_random_uuid(), 'SGSITS Indore', 'Madhya Pradesh', 'Indore', '{"Engineering", "Pharmacy"}', 'MP DTE / JEE Main', '2026-07-15', true, 'https://www.sgsits.ac.in', 1952, '["Hostel", "Library", "WiFi"]'),
(gen_random_uuid(), 'MANIT Bhopal', 'Madhya Pradesh', 'Bhopal', '{"Engineering", "Architecture", "Planning"}', 'JEE Main', '2026-06-30', false, 'https://www.manit.ac.in', 1960, '["Hostel", "Central Library", "Sports Complex"]'),
(gen_random_uuid(), 'NIT Patna', 'Bihar', 'Patna', '{"Engineering", "Architecture"}', 'JEE Main', '2026-06-30', false, 'https://www.nitp.ac.in', 1886, '["Hostel", "Library", "Computer Center"]'),
(gen_random_uuid(), 'VNIT Nagpur', 'Maharashtra', 'Nagpur', '{"Engineering", "Architecture"}', 'JEE Main', '2026-06-30', true, 'https://vnit.ac.in', 1960, '["Hostel", "Library", "WiFi", "Healthcare"]'),
(gen_random_uuid(), 'BIT Mesra', 'Jharkhand', 'Ranchi', '{"Engineering", "Management", "Pharmacy"}', 'JEE Main', '2026-06-20', false, 'https://www.bitmesra.ac.in', 1955, '["Hostel", "Library", "WiFi", "Sports"]'),
(gen_random_uuid(), 'Jadavpur University', 'West Bengal', 'Kolkata', '{"Engineering", "Arts", "Science"}', 'WBJEE', '2026-07-10', true, 'http://www.jaduniv.edu.in', 1905, '["Hostel", "Library", "WiFi", "Clubs"]');

-- Seed 6 exam timeline entries
INSERT INTO public.exams_timeline (id, name, stream, target_exam, start_date, end_date, priority, is_national, state) VALUES
(gen_random_uuid(), 'JEE Main Session 1', 'Engineering', 'JEE MAIN', '2026-01-24', '2026-02-01', 1, true, null),
(gen_random_uuid(), 'JEE Main Session 2', 'Engineering', 'JEE MAIN', '2026-04-01', '2026-04-15', 1, true, null),
(gen_random_uuid(), 'JEE Advanced', 'Engineering', 'JEE ADV', '2026-05-26', '2026-05-26', 1, true, null),
(gen_random_uuid(), 'MHT CET', 'Engineering', 'MHT CET', '2026-05-02', '2026-05-17', 2, false, 'Maharashtra'),
(gen_random_uuid(), 'MP PAT', 'Agriculture', 'MP PAT', '2026-06-15', '2026-06-16', 2, false, 'Madhya Pradesh'),
(gen_random_uuid(), 'NEET UG', 'Medical', 'NEET', '2026-05-05', '2026-05-05', 1, true, null);

-- Seed 4 mentors representing Tier 2/3 city students
INSERT INTO public.mentors (id, user_id, stream, rating, college, branch, bio, photo_url, rate_inr) VALUES
(gen_random_uuid(), null, 'Engineering', 4.8, 'SGSITS Indore', 'Computer Science', 'Cracked MP DTE and JEE Main from a Tier 2 city. Helping you plan your engineering journey.', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Rohan', 299),
(gen_random_uuid(), null, 'Engineering', 4.9, 'MANIT Bhopal', 'Mechanical', 'Expert in counselling for NITs. Bhopal native with 3 years mentoring experience.', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Neha', 399),
(gen_random_uuid(), null, 'Engineering', 4.7, 'NIT Patna', 'Electrical', 'Struggled with state board vs JEE balance? Let me guide you. Proven track record from Bihar.', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Vikram', 249),
(gen_random_uuid(), null, 'Engineering', 5.0, 'VNIT Nagpur', 'Civil', 'MHT CET and JEE Main expert. Can help you navigate state quotas and branch choices.', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Pooja', 349);
