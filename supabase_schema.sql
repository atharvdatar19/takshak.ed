-- TAKSHAK Next-Gen Features Schema

-- ============================================================================
-- 1. PRE-FRESHERS NETWORK TABLES
-- ============================================================================

-- Stores verified fresher profiles for roommate matching and networking
CREATE TABLE public.fresher_profiles (
    user_id UUID REFERENCES auth.users(id) PRIMARY KEY,
    college TEXT NOT NULL,
    branch TEXT,
    city_from TEXT,
    habits JSONB DEFAULT '{"sleep": "night_owl", "study": "music", "cleanliness": "relaxed", "social": "extrovert"}'::jsonb,
    bio TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- College-specific posts (Campus Hub)
CREATE TABLE public.campus_posts (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    author_id UUID REFERENCES auth.users(id) NOT NULL,
    college TEXT NOT NULL,
    content TEXT NOT NULL,
    post_type TEXT CHECK (post_type IN ('intro', 'question', 'tip', 'event')) DEFAULT 'intro',
    is_pinned BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ============================================================================
-- 2. MATERIAL MARKETPLACE TABLES
-- ============================================================================

-- Used study material listings
CREATE TABLE public.marketplace_listings (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    seller_id UUID REFERENCES auth.users(id) NOT NULL,
    title TEXT NOT NULL,
    exam TEXT NOT NULL,
    material_type TEXT NOT NULL,
    condition TEXT NOT NULL,
    price numeric NOT NULL,
    mrp numeric,
    city TEXT NOT NULL,
    state TEXT,
    photos TEXT[] DEFAULT '{}',
    status TEXT CHECK (status IN ('available', 'sold', 'hidden')) DEFAULT 'available',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ============================================================================
-- 3. BRIDGE COURSES TABLES
-- ============================================================================

-- Courses metadata (Read-only for most users)
CREATE TABLE public.courses (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    category TEXT NOT NULL,
    total_xp INT NOT NULL,
    lesson_count INT NOT NULL,
    description TEXT
);

-- Tracks user progress, XP, and active streaks
CREATE TABLE public.user_course_progress (
    user_id UUID REFERENCES auth.users(id) NOT NULL,
    course_id TEXT REFERENCES public.courses(id) NOT NULL,
    completed_lessons INT DEFAULT 0,
    xp_earned INT DEFAULT 0,
    last_activity DATE DEFAULT CURRENT_DATE,
    current_streak INT DEFAULT 0,
    status TEXT CHECK (status IN ('locked', 'unlocked', 'in_progress', 'completed')) DEFAULT 'unlocked',
    PRIMARY KEY (user_id, course_id)
);

-- ============================================================================
-- SECURITY (Row Level Security)
-- ============================================================================

ALTER TABLE public.fresher_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.campus_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.marketplace_listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_course_progress ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read profiles/posts/listings/courses
CREATE POLICY "Allow public read access" ON public.fresher_profiles FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON public.campus_posts FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON public.marketplace_listings FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON public.courses FOR SELECT USING (true);

-- Allow authenticated users to create/update their own data
CREATE POLICY "Users can insert their own profile" ON public.fresher_profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own profile" ON public.fresher_profiles FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can create posts" ON public.campus_posts FOR INSERT WITH CHECK (auth.uid() = author_id);
CREATE POLICY "Users can update own posts" ON public.campus_posts FOR UPDATE USING (auth.uid() = author_id);

CREATE POLICY "Users can create listings" ON public.marketplace_listings FOR INSERT WITH CHECK (auth.uid() = seller_id);
CREATE POLICY "Users can update own listings" ON public.marketplace_listings FOR UPDATE USING (auth.uid() = seller_id);

CREATE POLICY "Users can read own progress" ON public.user_course_progress FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own progress" ON public.user_course_progress FOR ALL USING (auth.uid() = user_id);
