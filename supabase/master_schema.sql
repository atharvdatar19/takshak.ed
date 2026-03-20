-- ============================================================
-- MASTER SCHEMA — All New Tables + RLS + Triggers
-- Run in Supabase SQL Editor AFTER existing tables.
-- Project: rhijpejgbfaohjemkacp.supabase.co
-- ============================================================

-- 1. ADD ROLE COLUMN TO EXISTING USERS TABLE
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'student'
  CHECK (role IN ('student', 'mentor', 'admin'));

-- ============================================================
-- 2. MENTORS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.mentors (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  photo_url TEXT,
  college TEXT NOT NULL,
  college_type TEXT CHECK (college_type IN ('IIT','NIT','IIIT','AIIMS','Other')) NOT NULL,
  branch TEXT NOT NULL,
  grad_year INT NOT NULL,
  city_origin TEXT NOT NULL,
  languages TEXT[] NOT NULL DEFAULT '{"Hindi"}',
  exam_focus TEXT[] NOT NULL,
  subjects TEXT[] NOT NULL,
  bio TEXT,
  rate_30min_inr NUMERIC NOT NULL,
  rate_60min_inr NUMERIC NOT NULL,
  total_sessions INT DEFAULT 0,
  rating NUMERIC(3,2) DEFAULT 0.00,
  is_verified BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  linkedin_url TEXT,
  college_email TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Payout details: separate table, admin-only read
CREATE TABLE IF NOT EXISTS public.mentor_payout_details (
  mentor_id UUID REFERENCES public.mentors(id) PRIMARY KEY,
  account_holder_name TEXT NOT NULL,
  account_number TEXT NOT NULL,
  ifsc_code TEXT NOT NULL,
  bank_name TEXT,
  razorpay_contact_id TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- 3. AVAILABILITY
-- ============================================================
CREATE TABLE IF NOT EXISTS public.mentor_availability (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  mentor_id UUID REFERENCES public.mentors(id) NOT NULL,
  slot_start TIMESTAMPTZ NOT NULL,
  slot_end TIMESTAMPTZ NOT NULL,
  is_booked BOOLEAN DEFAULT false,
  is_locked BOOLEAN DEFAULT false,
  locked_at TIMESTAMPTZ,
  recurring_rule TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- 4. SESSIONS (CORE BOOKING TABLE)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.sessions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  student_id UUID REFERENCES auth.users(id) NOT NULL,
  mentor_id UUID REFERENCES public.mentors(id) NOT NULL,
  availability_slot_id UUID REFERENCES public.mentor_availability(id) NOT NULL,
  duration_minutes INT CHECK (duration_minutes IN (30, 60)) NOT NULL,
  agreed_rate_inr NUMERIC NOT NULL,
  meet_link TEXT,
  topic TEXT,
  status TEXT DEFAULT 'pending_payment'
    CHECK (status IN ('pending_payment','confirmed','completed','cancelled','disputed','refunded')),
  cancelled_by TEXT CHECK (cancelled_by IN ('student','mentor','admin','system')),
  cancellation_reason TEXT,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- 5. TRANSACTIONS (FULL AUDIT TRAIL — NEVER DELETE)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.transactions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  type TEXT CHECK (type IN ('session_payment','payout','refund','partial_refund')) NOT NULL,
  payer_id UUID REFERENCES auth.users(id),
  payee_id UUID REFERENCES auth.users(id),
  session_id UUID REFERENCES public.sessions(id),
  amount_inr NUMERIC NOT NULL,
  platform_fee_inr NUMERIC DEFAULT 0,
  razorpay_order_id TEXT UNIQUE,
  razorpay_payment_id TEXT,
  idempotency_key TEXT UNIQUE NOT NULL,
  status TEXT DEFAULT 'pending'
    CHECK (status IN ('pending','captured','refunded','partial_refund','failed')),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- 6. REVIEWS (IMMUTABLE — NO UPDATE EVER)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.reviews (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  session_id UUID REFERENCES public.sessions(id) UNIQUE NOT NULL,
  reviewer_id UUID REFERENCES auth.users(id) NOT NULL,
  mentor_id UUID REFERENCES public.mentors(id) NOT NULL,
  rating INT CHECK (rating BETWEEN 1 AND 5) NOT NULL,
  comment TEXT,
  is_flagged BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- 7. MENTOR STRIKES
-- ============================================================
CREATE TABLE IF NOT EXISTS public.mentor_strikes (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  mentor_id UUID REFERENCES public.mentors(id) NOT NULL,
  session_id UUID REFERENCES public.sessions(id),
  reason TEXT CHECK (reason IN ('no_show','late_cancel','misconduct')) NOT NULL,
  issued_by UUID REFERENCES auth.users(id),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- 8. EDUCATORS (CURATED RESOURCE DIRECTORY)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.educators (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  photo_url TEXT,
  tagline TEXT,
  subject TEXT NOT NULL,
  exam_focus TEXT[] NOT NULL,
  platform TEXT NOT NULL CHECK (platform IN ('YouTube','Telegram','Website','Unacademy','PW','Other')),
  language TEXT[] NOT NULL,
  level TEXT NOT NULL CHECK (level IN ('Beginner','Intermediate','Advanced','All Levels')),
  is_famous BOOLEAN DEFAULT false,
  curator_note TEXT NOT NULL,
  primary_link TEXT NOT NULL,
  playlist_links JSONB DEFAULT '[]',
  upvotes INT DEFAULT 0,
  is_verified BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.educator_upvotes (
  user_id UUID REFERENCES auth.users(id),
  educator_id UUID REFERENCES public.educators(id),
  PRIMARY KEY (user_id, educator_id)
);

-- ============================================================
-- 9. COLLEGES + EXAMS TIMELINE (IF NOT EXISTS)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.colleges (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  city TEXT,
  state TEXT NOT NULL,
  streams_supported TEXT[] DEFAULT '{}',
  admission_mode TEXT,
  application_start DATE,
  application_end DATE,
  is_featured BOOLEAN DEFAULT false,
  website TEXT,
  established_year INT,
  facilities JSONB DEFAULT '{}'
);

CREATE TABLE IF NOT EXISTS public.exams_timeline (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  stream TEXT,
  target_exam TEXT,
  start_date DATE,
  end_date DATE,
  priority INT DEFAULT 0,
  is_national BOOLEAN DEFAULT true,
  state TEXT
);

-- ============================================================
-- 9.5 MARKETPLACE, CAMPUS POSTS, REPORTS (Admin Dependencies)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.marketplace_listings (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  seller_id UUID REFERENCES auth.users(id) NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  price_inr NUMERIC NOT NULL,
  status TEXT DEFAULT 'available' CHECK (status IN ('available', 'sold', 'hidden')),
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.campus_posts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  author_id UUID REFERENCES auth.users(id) NOT NULL,
  college_id UUID REFERENCES public.colleges(id),
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.reports (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  reporter_id UUID REFERENCES auth.users(id) NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('marketplace_listing', 'campus_post', 'review', 'user')),
  target_id TEXT NOT NULL,
  title TEXT NOT NULL,
  reason TEXT NOT NULL,
  status TEXT DEFAULT 'open' CHECK (status IN ('open', 'dismissed', 'hidden', 'banned')),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- 10. ADMIN AUDIT LOG (IMMUTABLE)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.admin_audit_log (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  admin_id UUID REFERENCES auth.users(id) NOT NULL,
  action TEXT NOT NULL,
  target_table TEXT,
  target_id UUID,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- ROW LEVEL SECURITY — ALL NEW TABLES
-- ============================================================

-- MENTORS
ALTER TABLE public.mentors ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Public can read verified mentors" ON public.mentors
    FOR SELECT USING (is_verified = true AND is_active = true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  CREATE POLICY "Mentor can update own row" ON public.mentors
    FOR UPDATE USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  CREATE POLICY "Anyone can insert mentor application" ON public.mentors
    FOR INSERT WITH CHECK (auth.uid() = user_id AND is_verified = false);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- PAYOUT DETAILS — admin-only via service_role
ALTER TABLE public.mentor_payout_details ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "No direct client access" ON public.mentor_payout_details FOR ALL USING (false);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- AVAILABILITY
ALTER TABLE public.mentor_availability ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Public read availability" ON public.mentor_availability FOR SELECT USING (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  CREATE POLICY "Mentor manages own slots" ON public.mentor_availability
    FOR ALL USING (mentor_id IN (SELECT id FROM public.mentors WHERE user_id = auth.uid()));
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- SESSIONS
ALTER TABLE public.sessions ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Student or mentor can view own sessions" ON public.sessions
    FOR SELECT USING (auth.uid() = student_id OR
      mentor_id IN (SELECT id FROM public.mentors WHERE user_id = auth.uid()));
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  CREATE POLICY "Student can insert session" ON public.sessions
    FOR INSERT WITH CHECK (auth.uid() = student_id);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- TRANSACTIONS
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "User reads own transactions" ON public.transactions
    FOR SELECT USING (auth.uid() = payer_id OR auth.uid() = payee_id);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- REVIEWS
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Public read reviews" ON public.reviews FOR SELECT USING (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  CREATE POLICY "Student inserts review for own session" ON public.reviews
    FOR INSERT WITH CHECK (
      auth.uid() = reviewer_id AND
      session_id IN (
        SELECT id FROM public.sessions
        WHERE student_id = auth.uid() AND status = 'completed'
      )
    );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- STRIKES
ALTER TABLE public.mentor_strikes ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "No direct client access to strikes" ON public.mentor_strikes FOR ALL USING (false);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- EDUCATORS
ALTER TABLE public.educators ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Public read educators" ON public.educators FOR SELECT USING (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

ALTER TABLE public.educator_upvotes ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Auth user can upvote" ON public.educator_upvotes
    FOR INSERT WITH CHECK (auth.uid() = user_id);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  CREATE POLICY "User can remove own upvote" ON public.educator_upvotes
    FOR DELETE USING (auth.uid() = user_id);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  CREATE POLICY "User reads own upvotes" ON public.educator_upvotes
    FOR SELECT USING (auth.uid() = user_id);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- COLLEGES + EXAMS
ALTER TABLE public.colleges ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Public read colleges" ON public.colleges FOR SELECT USING (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
ALTER TABLE public.exams_timeline ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Public read exams" ON public.exams_timeline FOR SELECT USING (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- MARKETPLACE, CAMPUS POSTS, REPORTS
ALTER TABLE public.marketplace_listings ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Public read available listings" ON public.marketplace_listings FOR SELECT USING (status = 'available');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

ALTER TABLE public.campus_posts ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Public read campus posts" ON public.campus_posts FOR SELECT USING (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;

-- AUDIT LOG
ALTER TABLE public.admin_audit_log ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "No direct client access audit" ON public.admin_audit_log FOR ALL USING (false);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- ============================================================
-- TRIGGERS
-- ============================================================

-- Auto-update mentor rating when a review is inserted
CREATE OR REPLACE FUNCTION update_mentor_rating()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.mentors
  SET rating = (SELECT AVG(rating) FROM public.reviews WHERE mentor_id = NEW.mentor_id),
      total_sessions = total_sessions + 1
  WHERE id = NEW.mentor_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_review_inserted ON public.reviews;
CREATE TRIGGER on_review_inserted
  AFTER INSERT ON public.reviews
  FOR EACH ROW EXECUTE FUNCTION update_mentor_rating();

-- Auto-suspend mentor on 3rd strike
CREATE OR REPLACE FUNCTION check_mentor_strikes()
RETURNS TRIGGER AS $$
BEGIN
  IF (SELECT COUNT(*) FROM public.mentor_strikes WHERE mentor_id = NEW.mentor_id) >= 3 THEN
    UPDATE public.mentors SET is_active = false WHERE id = NEW.mentor_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_strike_issued ON public.mentor_strikes;
CREATE TRIGGER on_strike_issued
  AFTER INSERT ON public.mentor_strikes
  FOR EACH ROW EXECUTE FUNCTION check_mentor_strikes();

-- Auto-enforce 5-listing max on marketplace
CREATE OR REPLACE FUNCTION check_listing_limit()
RETURNS TRIGGER AS $$
BEGIN
  IF (SELECT COUNT(*) FROM public.marketplace_listings
      WHERE seller_id = NEW.seller_id AND status = 'available') >= 5 THEN
    RAISE EXCEPTION 'Maximum 5 active listings allowed per user';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS enforce_listing_limit ON public.marketplace_listings;
CREATE TRIGGER enforce_listing_limit
  BEFORE INSERT ON public.marketplace_listings
  FOR EACH ROW EXECUTE FUNCTION check_listing_limit();

-- ============================================================
-- DONE. Run this file in Supabase SQL Editor.
-- ============================================================
