-- ============================================================
-- TAKSHAK PLATFORM — COMPLETE DATABASE SCHEMA v2.0
-- One-stop mentorship & guidance platform for students
-- Run this in Supabase SQL Editor (safe to re-run, idempotent)
-- ============================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- ============================================================
-- 1. USERS & AUTH
-- ============================================================

CREATE TABLE IF NOT EXISTS public.users (
  id           UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  email        TEXT UNIQUE NOT NULL,
  full_name    TEXT NOT NULL,
  role         TEXT DEFAULT 'student' CHECK (role IN ('student','mentor','admin','moderator','content_editor','finance_viewer')),
  avatar_url   TEXT,
  phone        TEXT,
  stream       TEXT,        -- JEE / NEET / UPSC / CAT / GATE / CUET / Defence
  state        TEXT,
  target_year  INT,
  is_premium   BOOLEAN DEFAULT false,
  is_active    BOOLEAN DEFAULT true,
  last_seen_at TIMESTAMPTZ,
  created_at   TIMESTAMPTZ DEFAULT now(),
  updated_at   TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- 2. MENTORS
-- ============================================================

CREATE TABLE IF NOT EXISTS public.mentors (
  id                    UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id               UUID REFERENCES public.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  full_name             TEXT NOT NULL,
  photo_url             TEXT,
  college               TEXT NOT NULL,
  college_type          TEXT CHECK (college_type IN ('IIT','NIT','IIIT','AIIMS','BITS','IIM','NLU','Other')) NOT NULL,
  branch                TEXT NOT NULL,
  grad_year             INT NOT NULL,
  city_origin           TEXT,
  bio                   TEXT,
  languages             TEXT[] NOT NULL DEFAULT '{"Hindi","English"}',
  exam_focus            TEXT[] NOT NULL DEFAULT '{}',
  subjects              TEXT[] NOT NULL DEFAULT '{}',
  specialties           TEXT[] DEFAULT '{}',    -- 'defence_prep', 'female_mentor', 'first_free'
  rate_30min_inr        NUMERIC NOT NULL DEFAULT 0,
  rate_60min_inr        NUMERIC NOT NULL DEFAULT 0,
  total_sessions        INT DEFAULT 0,
  rating                NUMERIC(3,2) DEFAULT 0.00,
  is_verified           BOOLEAN DEFAULT false,
  is_active             BOOLEAN DEFAULT true,
  free_session_available BOOLEAN DEFAULT true,
  linkedin_url          TEXT,
  college_email         TEXT,
  created_at            TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.mentor_payout_details (
  mentor_id               UUID REFERENCES public.mentors(id) PRIMARY KEY,
  account_holder_name     TEXT NOT NULL,
  account_number          TEXT NOT NULL,
  ifsc_code               TEXT NOT NULL,
  bank_name               TEXT,
  upi_id                  TEXT,
  razorpay_contact_id     TEXT,
  razorpay_fund_account_id TEXT,
  created_at              TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.mentor_availability (
  id             UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  mentor_id      UUID REFERENCES public.mentors(id) ON DELETE CASCADE NOT NULL,
  slot_start     TIMESTAMPTZ NOT NULL,
  slot_end       TIMESTAMPTZ NOT NULL,
  is_booked      BOOLEAN DEFAULT false,
  is_locked      BOOLEAN DEFAULT false,
  locked_at      TIMESTAMPTZ,
  recurring_rule TEXT,
  created_at     TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.mentor_strikes (
  id         UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  mentor_id  UUID REFERENCES public.mentors(id) NOT NULL,
  session_id UUID,
  reason     TEXT CHECK (reason IN ('no_show','late_cancel','misconduct','poor_quality')) NOT NULL,
  issued_by  UUID REFERENCES public.users(id) NOT NULL,
  notes      TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- 3. SESSIONS & PAYMENTS
-- ============================================================

CREATE TABLE IF NOT EXISTS public.sessions (
  id                   UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  student_id           UUID REFERENCES public.users(id) NOT NULL,
  mentor_id            UUID REFERENCES public.mentors(id) NOT NULL,
  availability_slot_id UUID REFERENCES public.mentor_availability(id),
  duration_minutes     INT CHECK (duration_minutes IN (30,60)) NOT NULL,
  agreed_rate_inr      NUMERIC NOT NULL,
  is_free_session      BOOLEAN DEFAULT false,
  meet_link            TEXT,
  topic                TEXT NOT NULL,
  student_notes        TEXT,
  mentor_notes         TEXT,
  status               TEXT DEFAULT 'pending_payment'
                       CHECK (status IN ('pending_payment','confirmed','in_progress','completed','cancelled','disputed','refunded','no_show')),
  cancelled_by         TEXT CHECK (cancelled_by IN ('student','mentor','admin')),
  cancellation_reason  TEXT,
  scheduled_at         TIMESTAMPTZ,
  completed_at         TIMESTAMPTZ,
  created_at           TIMESTAMPTZ DEFAULT now(),
  updated_at           TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.transactions (
  id                 UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  type               TEXT CHECK (type IN ('session_payment','payout','refund','platform_fee')) NOT NULL,
  payer_id           UUID REFERENCES public.users(id),
  payee_id           UUID REFERENCES public.users(id),
  session_id         UUID REFERENCES public.sessions(id),
  amount_inr         NUMERIC NOT NULL,
  platform_fee_inr   NUMERIC DEFAULT 0,
  razorpay_order_id  TEXT,
  razorpay_payment_id TEXT,
  idempotency_key    TEXT UNIQUE,
  status             TEXT DEFAULT 'created' CHECK (status IN ('created','captured','failed','refunded')),
  notes              TEXT,
  created_at         TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.reviews (
  id          UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  session_id  UUID REFERENCES public.sessions(id) UNIQUE NOT NULL,
  reviewer_id UUID REFERENCES public.users(id) NOT NULL,
  mentor_id   UUID REFERENCES public.mentors(id) NOT NULL,
  rating      INT CHECK (rating BETWEEN 1 AND 5) NOT NULL,
  comment     TEXT,
  is_flagged  BOOLEAN DEFAULT false,
  created_at  TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- 4. COLLEGE & EXAM DISCOVERY
-- ============================================================

CREATE TABLE IF NOT EXISTS public.colleges (
  id               UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name             TEXT NOT NULL,
  short_name       TEXT,
  city             TEXT NOT NULL,
  state            TEXT NOT NULL,
  college_type     TEXT DEFAULT 'Other'
                   CHECK (college_type IN ('IIT','NIT','IIIT','AIIMS','BITS','IIM','NLU','Central','State','Private','Deemed','Other')),
  streams_supported TEXT[] DEFAULT '{}',
  admission_mode   TEXT DEFAULT 'Other'
                   CHECK (admission_mode IN ('JEE','NEET','CUET','CAT','GATE','CLAT','State_CET','Direct','Other')),
  application_start DATE,
  application_end   DATE,
  established_year  INT,
  nirf_rank         INT,
  website           TEXT,
  logo_url          TEXT,
  photo_url         TEXT,
  facilities        TEXT[] DEFAULT '{}',
  is_featured       BOOLEAN DEFAULT false,
  is_active         BOOLEAN DEFAULT true,
  created_at        TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.exams_timeline (
  id                 UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name               TEXT NOT NULL,
  full_name          TEXT,
  stream             TEXT NOT NULL,
  target_exam        TEXT,
  start_date         DATE,
  end_date           DATE,
  result_date        DATE,
  registration_start DATE,
  registration_end   DATE,
  exam_type          TEXT DEFAULT 'entrance'
                     CHECK (exam_type IN ('entrance','qualifying','scholarship','olympiad')),
  is_national        BOOLEAN DEFAULT true,
  state              TEXT,
  official_url       TEXT,
  created_at         TIMESTAMPTZ DEFAULT now()
);

-- JEE/NEET/CUET cutoff data by college, year, round, category
CREATE TABLE IF NOT EXISTS public.cutoff_data (
  id           UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  college_id   UUID REFERENCES public.colleges(id) ON DELETE CASCADE,
  exam         TEXT NOT NULL,            -- JEE_MAIN, JEE_ADV, NEET, CUET
  year         INT NOT NULL,
  round        INT NOT NULL DEFAULT 1,
  branch       TEXT,
  category     TEXT NOT NULL DEFAULT 'OPEN',  -- OPEN, OBC-NCL, SC, ST, EWS, PwD
  opening_rank INT,
  closing_rank INT,
  quota        TEXT DEFAULT 'AI',         -- AI, HS, OS, State
  gender       TEXT DEFAULT 'Gender-Neutral',
  created_at   TIMESTAMPTZ DEFAULT now(),
  UNIQUE (college_id, exam, year, round, branch, category, quota, gender)
);

-- ============================================================
-- 5. STUDENT TOOLS — APPLICATION, SCHOLARSHIP, DOCUMENTS
-- ============================================================

CREATE TABLE IF NOT EXISTS public.applications (
  id              UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id         UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  college_id      UUID REFERENCES public.colleges(id),
  college_name    TEXT NOT NULL,
  program         TEXT NOT NULL,
  stream          TEXT,
  status          TEXT DEFAULT 'researching'
                  CHECK (status IN ('researching','applied','documents_submitted','interview','admitted','rejected','waitlisted','withdrawn')),
  application_date DATE,
  deadline         DATE,
  priority         INT DEFAULT 1 CHECK (priority BETWEEN 0 AND 3),  -- 0=dream,1=target,2=safety,3=backup
  notes            TEXT,
  created_at       TIMESTAMPTZ DEFAULT now(),
  updated_at       TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.scholarships (
  id              UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name            TEXT NOT NULL,
  provider        TEXT NOT NULL,
  amount_min_inr  NUMERIC,
  amount_max_inr  NUMERIC,
  stream          TEXT[],
  category        TEXT[],          -- OPEN, SC, ST, OBC, EWS, Minority
  min_percentage  NUMERIC,
  deadline        DATE,
  website         TEXT,
  description     TEXT,
  is_active       BOOLEAN DEFAULT true,
  created_at      TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.user_scholarships (
  user_id        UUID REFERENCES public.users(id) ON DELETE CASCADE,
  scholarship_id UUID REFERENCES public.scholarships(id) ON DELETE CASCADE,
  status         TEXT DEFAULT 'saved' CHECK (status IN ('saved','applied','received','rejected')),
  applied_at     DATE,
  notes          TEXT,
  created_at     TIMESTAMPTZ DEFAULT now(),
  PRIMARY KEY (user_id, scholarship_id)
);

CREATE TABLE IF NOT EXISTS public.user_doc_progress (
  id             UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id        UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  college_name   TEXT NOT NULL,
  document_name  TEXT NOT NULL,
  is_completed   BOOLEAN DEFAULT false,
  completed_at   TIMESTAMPTZ,
  updated_at     TIMESTAMPTZ DEFAULT now(),
  UNIQUE (user_id, college_name, document_name)
);

-- ============================================================
-- 6. WELLNESS & MENTAL HEALTH
-- ============================================================

CREATE TABLE IF NOT EXISTS public.stress_logs (
  id            UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id       UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  mood          TEXT CHECK (mood IN ('great','good','okay','low','struggling')) NOT NULL,
  stress_level  INT CHECK (stress_level BETWEEN 1 AND 10) NOT NULL,
  energy_level  INT CHECK (energy_level BETWEEN 1 AND 10),
  sleep_hours   NUMERIC,
  note          TEXT,
  created_at    TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- 7. STUDY & LEARNING
-- ============================================================

CREATE TABLE IF NOT EXISTS public.study_plans (
  id           UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id      UUID REFERENCES public.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  target_exam  TEXT NOT NULL,
  target_date  DATE,
  daily_hours  INT DEFAULT 6,
  subjects     JSONB DEFAULT '[]',   -- [{name, allocatedHours, completedHours, color}]
  updated_at   TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.study_sessions (
  id               UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id          UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  subject          TEXT NOT NULL,
  topic            TEXT,
  duration_minutes INT NOT NULL,
  quality_rating   INT CHECK (quality_rating BETWEEN 1 AND 5),
  notes            TEXT,
  created_at       TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.quiz_attempts (
  id                  UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id             UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  subject             TEXT NOT NULL,
  topic               TEXT,
  score               INT NOT NULL DEFAULT 0,
  max_score           INT NOT NULL DEFAULT 100,
  time_taken_minutes  INT,
  created_at          TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.goals (
  id           UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id      UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  title        TEXT NOT NULL,
  description  TEXT,
  target_date  DATE,
  is_completed BOOLEAN DEFAULT false,
  completed_at TIMESTAMPTZ,
  created_at   TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- 8. BRIDGE COURSES & LEARNING CONTENT
-- ============================================================

CREATE TABLE IF NOT EXISTS public.courses (
  id             UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title          TEXT NOT NULL,
  description    TEXT,
  provider       TEXT NOT NULL,
  stream         TEXT,
  subject        TEXT,
  mode           TEXT CHECK (mode IN ('free','paid','freemium')) DEFAULT 'free',
  price_inr      NUMERIC DEFAULT 0,
  duration_hours INT,
  level          TEXT CHECK (level IN ('beginner','intermediate','advanced')) DEFAULT 'beginner',
  thumbnail_url  TEXT,
  external_url   TEXT,
  is_featured    BOOLEAN DEFAULT false,
  is_active      BOOLEAN DEFAULT true,
  order_index    INT DEFAULT 0,
  created_at     TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.course_lessons (
  id               UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  course_id        UUID REFERENCES public.courses(id) ON DELETE CASCADE NOT NULL,
  title            TEXT NOT NULL,
  description      TEXT,
  video_url        TEXT,
  resource_url     TEXT,
  duration_minutes INT,
  order_index      INT NOT NULL,
  is_free          BOOLEAN DEFAULT false,
  created_at       TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.user_course_progress (
  user_id          UUID REFERENCES public.users(id) ON DELETE CASCADE,
  course_id        UUID REFERENCES public.courses(id) ON DELETE CASCADE,
  completed_lessons UUID[] DEFAULT '{}',
  progress_percent INT DEFAULT 0,
  is_completed     BOOLEAN DEFAULT false,
  completed_at     TIMESTAMPTZ,
  last_lesson_id   UUID REFERENCES public.course_lessons(id),
  started_at       TIMESTAMPTZ DEFAULT now(),
  updated_at       TIMESTAMPTZ DEFAULT now(),
  PRIMARY KEY (user_id, course_id)
);

-- ============================================================
-- 9. COMMUNITY — FORUM, CAMPUS, ROOMMATES
-- ============================================================

CREATE TABLE IF NOT EXISTS public.forum_posts (
  id          UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  author_id   UUID REFERENCES public.users(id),
  title       TEXT NOT NULL,
  content     TEXT NOT NULL,
  category    TEXT DEFAULT 'doubt'
              CHECK (category IN ('doubt','discussion','resource','experience','announcement')),
  stream      TEXT,
  tags        TEXT[] DEFAULT '{}',
  upvotes     INT DEFAULT 0,
  reply_count INT DEFAULT 0,
  is_anonymous  BOOLEAN DEFAULT false,
  is_pinned     BOOLEAN DEFAULT false,
  is_resolved   BOOLEAN DEFAULT false,
  is_flagged    BOOLEAN DEFAULT false,
  created_at    TIMESTAMPTZ DEFAULT now(),
  updated_at    TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.forum_replies (
  id              UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  post_id         UUID REFERENCES public.forum_posts(id) ON DELETE CASCADE NOT NULL,
  author_id       UUID REFERENCES public.users(id),
  content         TEXT NOT NULL,
  parent_reply_id UUID REFERENCES public.forum_replies(id),
  upvotes         INT DEFAULT 0,
  is_anonymous    BOOLEAN DEFAULT false,
  is_answer       BOOLEAN DEFAULT false,
  is_flagged      BOOLEAN DEFAULT false,
  created_at      TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.forum_votes (
  user_id     UUID REFERENCES public.users(id) ON DELETE CASCADE,
  target_type TEXT CHECK (target_type IN ('post','reply')) NOT NULL,
  target_id   UUID NOT NULL,
  vote        INT CHECK (vote IN (1,-1)) NOT NULL DEFAULT 1,
  created_at  TIMESTAMPTZ DEFAULT now(),
  PRIMARY KEY (user_id, target_type, target_id)
);

CREATE TABLE IF NOT EXISTS public.fresher_profiles (
  id                UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id           UUID REFERENCES public.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  college_id        UUID REFERENCES public.colleges(id),
  college_name      TEXT NOT NULL,
  hometown          TEXT,
  state             TEXT,
  gender            TEXT CHECK (gender IN ('male','female','other','prefer_not')),
  sleep_time        TEXT CHECK (sleep_time IN ('early','normal','late','very_late')),
  study_hours       TEXT CHECK (study_hours IN ('light','moderate','heavy','extreme')),
  cleanliness       TEXT CHECK (cleanliness IN ('very_clean','clean','moderate','relaxed')),
  food_preference   TEXT CHECK (food_preference IN ('veg','non_veg','vegan','jain','any')),
  hobbies           TEXT[] DEFAULT '{}',
  languages_spoken  TEXT[] DEFAULT '{}',
  about             TEXT,
  contact_info      TEXT,
  is_visible        BOOLEAN DEFAULT true,
  created_at        TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.campus_posts (
  id           UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  author_id    UUID REFERENCES public.users(id),
  college_id   UUID REFERENCES public.colleges(id),
  college_name TEXT NOT NULL,
  content      TEXT NOT NULL,
  category     TEXT DEFAULT 'general'
               CHECK (category IN ('general','lost_found','event','buy_sell','alert')),
  upvotes      INT DEFAULT 0,
  is_anonymous BOOLEAN DEFAULT true,
  is_flagged   BOOLEAN DEFAULT false,
  created_at   TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- 10. SKILL MATCHER & CAREER
-- ============================================================

CREATE TABLE IF NOT EXISTS public.skill_profiles (
  user_id              UUID REFERENCES public.users(id) ON DELETE CASCADE PRIMARY KEY,
  skills               TEXT[] DEFAULT '{}',
  interests            TEXT[] DEFAULT '{}',
  preferred_difficulty TEXT CHECK (preferred_difficulty IN ('easy','medium','hard')) DEFAULT 'medium',
  budget_constraint    TEXT CHECK (budget_constraint IN ('free','low','medium','any')) DEFAULT 'any',
  top_matches          JSONB DEFAULT '[]',
  updated_at           TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- 11. MARKETPLACE
-- ============================================================

CREATE TABLE IF NOT EXISTS public.marketplace_listings (
  id             UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  seller_id      UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  title          TEXT NOT NULL,
  description    TEXT,
  price_inr      NUMERIC NOT NULL DEFAULT 0,
  is_negotiable  BOOLEAN DEFAULT true,
  condition      TEXT DEFAULT 'good'
                 CHECK (condition IN ('new','like_new','good','fair','poor')),
  category       TEXT DEFAULT 'books'
                 CHECK (category IN ('books','notes','devices','stationery','other')),
  stream         TEXT,
  subject        TEXT,
  image_urls     TEXT[] DEFAULT '{}',
  location       TEXT,
  status         TEXT DEFAULT 'available'
                 CHECK (status IN ('available','sold','hidden','reserved')),
  view_count     INT DEFAULT 0,
  created_at     TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- 12. EDUCATORS & RESOURCES
-- ============================================================

CREATE TABLE IF NOT EXISTS public.educators (
  id          UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name        TEXT NOT NULL,
  photo_url   TEXT,
  tagline     TEXT,
  bio         TEXT,
  subjects    TEXT[] NOT NULL DEFAULT '{}',
  exam_focus  TEXT[] NOT NULL DEFAULT '{}',
  platform    TEXT CHECK (platform IN ('YouTube','Unacademy','PW','Aakash','BYJU''S','Vedantu','Self','Other')) NOT NULL,
  language    TEXT[] DEFAULT '{"Hindi"}',
  level       TEXT CHECK (level IN ('beginner','intermediate','advanced','all_levels')) DEFAULT 'all_levels',
  youtube_url TEXT,
  website_url TEXT,
  is_famous   BOOLEAN DEFAULT false,
  upvotes     INT DEFAULT 0,
  is_active   BOOLEAN DEFAULT true,
  created_at  TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.educator_upvotes (
  user_id     UUID REFERENCES public.users(id) ON DELETE CASCADE,
  educator_id UUID REFERENCES public.educators(id) ON DELETE CASCADE,
  created_at  TIMESTAMPTZ DEFAULT now(),
  PRIMARY KEY (user_id, educator_id)
);

CREATE TABLE IF NOT EXISTS public.resource_links (
  id               UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  educator_id      UUID REFERENCES public.educators(id) ON DELETE CASCADE NOT NULL,
  title            TEXT NOT NULL,
  url              TEXT NOT NULL,
  resource_type    TEXT DEFAULT 'video'
                   CHECK (resource_type IN ('video','playlist','notes','test','book')),
  exam             TEXT,
  subject          TEXT,
  topic            TEXT,
  is_free          BOOLEAN DEFAULT true,
  upvotes          INT DEFAULT 0,
  duration_minutes INT,
  created_at       TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.resource_upvotes (
  user_id     UUID REFERENCES public.users(id) ON DELETE CASCADE,
  resource_id UUID REFERENCES public.resource_links(id) ON DELETE CASCADE,
  PRIMARY KEY (user_id, resource_id)
);

-- ============================================================
-- 13. NOTIFICATIONS, REPORTS, ADMIN
-- ============================================================

CREATE TABLE IF NOT EXISTS public.notifications (
  id         UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id    UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  title      TEXT NOT NULL,
  message    TEXT NOT NULL,
  type       TEXT DEFAULT 'info'
             CHECK (type IN ('info','success','warning','error','session','payment','alert','system')),
  action_url TEXT,
  is_read    BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.reports (
  id               UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  reporter_id      UUID REFERENCES public.users(id),
  type             TEXT CHECK (type IN ('marketplace_listing','campus_post','review','forum_post','user','mentor')) NOT NULL,
  target_id        UUID NOT NULL,
  reason           TEXT NOT NULL,
  status           TEXT DEFAULT 'pending' CHECK (status IN ('pending','reviewed','actioned','dismissed')),
  resolved_by      UUID REFERENCES public.users(id),
  resolution_notes TEXT,
  created_at       TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.admin_audit_log (
  id           UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  admin_id     UUID REFERENCES public.users(id) NOT NULL,
  action       TEXT NOT NULL,
  target_table TEXT,
  target_id    UUID,
  notes        TEXT,
  ip_address   TEXT,
  created_at   TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.site_content (
  key        TEXT PRIMARY KEY,
  value      JSONB NOT NULL,
  description TEXT,
  updated_by UUID REFERENCES public.users(id),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- INDEXES
-- ============================================================

CREATE INDEX IF NOT EXISTS idx_sessions_student     ON public.sessions(student_id, status);
CREATE INDEX IF NOT EXISTS idx_sessions_mentor      ON public.sessions(mentor_id, status);
CREATE INDEX IF NOT EXISTS idx_avail_mentor_slot    ON public.mentor_availability(mentor_id, slot_start) WHERE is_booked = false;
CREATE INDEX IF NOT EXISTS idx_cutoff_lookup        ON public.cutoff_data(college_id, exam, year, category);
CREATE INDEX IF NOT EXISTS idx_forum_stream         ON public.forum_posts(stream, category, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_notifications_user   ON public.notifications(user_id, is_read, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_stress_user_time     ON public.stress_logs(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_applications_user    ON public.applications(user_id, status);
CREATE INDEX IF NOT EXISTS idx_marketplace_browse   ON public.marketplace_listings(status, stream, category) WHERE status = 'available';
CREATE INDEX IF NOT EXISTS idx_colleges_fts         ON public.colleges USING gin(to_tsvector('english', name));
CREATE INDEX IF NOT EXISTS idx_study_sessions_user  ON public.study_sessions(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_transactions_session ON public.transactions(session_id);

-- ============================================================
-- TRIGGER FUNCTIONS
-- ============================================================

-- Auto-update mentor rating & session count
CREATE OR REPLACE FUNCTION public.update_mentor_rating()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.mentors SET
    rating = (SELECT ROUND(AVG(rating)::numeric, 2) FROM public.reviews WHERE mentor_id = NEW.mentor_id),
    total_sessions = (SELECT COUNT(*) FROM public.sessions WHERE mentor_id = NEW.mentor_id AND status = 'completed')
  WHERE id = NEW.mentor_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_review_inserted ON public.reviews;
CREATE TRIGGER on_review_inserted
  AFTER INSERT ON public.reviews
  FOR EACH ROW EXECUTE FUNCTION public.update_mentor_rating();

-- Auto-suspend mentor on 3rd strike
CREATE OR REPLACE FUNCTION public.check_mentor_strikes()
RETURNS TRIGGER AS $$
DECLARE strike_count INT;
BEGIN
  SELECT COUNT(*) INTO strike_count FROM public.mentor_strikes WHERE mentor_id = NEW.mentor_id;
  IF strike_count >= 3 THEN
    UPDATE public.mentors SET is_active = false WHERE id = NEW.mentor_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_strike_issued ON public.mentor_strikes;
CREATE TRIGGER on_strike_issued
  AFTER INSERT ON public.mentor_strikes
  FOR EACH ROW EXECUTE FUNCTION public.check_mentor_strikes();

-- Cap marketplace at 5 active listings per user
CREATE OR REPLACE FUNCTION public.check_listing_limit()
RETURNS TRIGGER AS $$
DECLARE listing_count INT;
BEGIN
  SELECT COUNT(*) INTO listing_count
  FROM public.marketplace_listings
  WHERE seller_id = NEW.seller_id AND status != 'hidden';
  IF listing_count >= 5 THEN
    RAISE EXCEPTION 'Maximum 5 active listings allowed per user.';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS enforce_listing_limit ON public.marketplace_listings;
CREATE TRIGGER enforce_listing_limit
  BEFORE INSERT ON public.marketplace_listings
  FOR EACH ROW EXECUTE FUNCTION public.check_listing_limit();

-- Auto-update forum reply_count
CREATE OR REPLACE FUNCTION public.update_forum_reply_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.forum_posts SET reply_count = reply_count + 1, updated_at = now() WHERE id = NEW.post_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.forum_posts SET reply_count = GREATEST(0, reply_count - 1) WHERE id = OLD.post_id;
  END IF;
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_forum_reply ON public.forum_replies;
CREATE TRIGGER on_forum_reply
  AFTER INSERT OR DELETE ON public.forum_replies
  FOR EACH ROW EXECUTE FUNCTION public.update_forum_reply_count();

-- Auto-calculate course progress percent
CREATE OR REPLACE FUNCTION public.update_course_progress()
RETURNS TRIGGER AS $$
DECLARE total_lessons INT; completed_count INT;
BEGIN
  SELECT COUNT(*) INTO total_lessons FROM public.course_lessons WHERE course_id = NEW.course_id;
  completed_count := COALESCE(array_length(NEW.completed_lessons, 1), 0);
  IF total_lessons > 0 THEN
    NEW.progress_percent := ROUND((completed_count::float / total_lessons) * 100);
    NEW.is_completed := (NEW.progress_percent = 100);
    IF NEW.is_completed AND NOT OLD.is_completed THEN
      NEW.completed_at := now();
    END IF;
  END IF;
  NEW.updated_at := now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_course_progress_update ON public.user_course_progress;
CREATE TRIGGER on_course_progress_update
  BEFORE UPDATE ON public.user_course_progress
  FOR EACH ROW EXECUTE FUNCTION public.update_course_progress();

-- Generic updated_at
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS sessions_updated_at    ON public.sessions;
DROP TRIGGER IF EXISTS applications_updated_at ON public.applications;
DROP TRIGGER IF EXISTS users_updated_at       ON public.users;

CREATE TRIGGER sessions_updated_at     BEFORE UPDATE ON public.sessions     FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER applications_updated_at BEFORE UPDATE ON public.applications FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER users_updated_at        BEFORE UPDATE ON public.users        FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Prevent role escalation
CREATE OR REPLACE FUNCTION public.prevent_role_escalation()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.role IS DISTINCT FROM OLD.role THEN
    IF NOT (SELECT is_admin()) THEN
      RAISE EXCEPTION 'Security: role escalation denied.';
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS role_escalation_trigger ON public.users;
CREATE TRIGGER role_escalation_trigger
  BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION public.prevent_role_escalation();

-- ============================================================
-- RLS ENABLE
-- ============================================================

DO $$ DECLARE t TEXT; BEGIN
  FOR t IN SELECT tablename FROM pg_tables WHERE schemaname = 'public' LOOP
    EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY', t);
  END LOOP;
END $$;

-- ============================================================
-- HELPER FUNCTIONS
-- ============================================================

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.users WHERE email = (auth.jwt() ->> 'email') AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

CREATE OR REPLACE FUNCTION public.auth_email()
RETURNS TEXT AS $$
BEGIN RETURN auth.jwt() ->> 'email'; END;
$$ LANGUAGE plpgsql STABLE;

CREATE OR REPLACE FUNCTION public.my_user_id()
RETURNS UUID AS $$
BEGIN RETURN (SELECT id FROM public.users WHERE email = auth_email() LIMIT 1); END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- ============================================================
-- RLS POLICIES
-- ============================================================

-- PUBLIC READ
CREATE POLICY "public_read_mentors"        ON public.mentors              FOR SELECT USING (is_verified AND is_active);
CREATE POLICY "public_read_colleges"       ON public.colleges             FOR SELECT USING (is_active);
CREATE POLICY "public_read_exams"          ON public.exams_timeline       FOR SELECT USING (true);
CREATE POLICY "public_read_cutoffs"        ON public.cutoff_data          FOR SELECT USING (true);
CREATE POLICY "public_read_educators"      ON public.educators            FOR SELECT USING (is_active);
CREATE POLICY "public_read_resources"      ON public.resource_links       FOR SELECT USING (true);
CREATE POLICY "public_read_courses"        ON public.courses              FOR SELECT USING (is_active);
CREATE POLICY "public_read_lessons"        ON public.course_lessons       FOR SELECT USING (true);
CREATE POLICY "public_read_scholarships"   ON public.scholarships         FOR SELECT USING (is_active);
CREATE POLICY "public_read_forum_posts"    ON public.forum_posts          FOR SELECT USING (true);
CREATE POLICY "public_read_forum_replies"  ON public.forum_replies        FOR SELECT USING (true);
CREATE POLICY "public_read_campus_posts"   ON public.campus_posts         FOR SELECT USING (NOT is_flagged);
CREATE POLICY "public_read_marketplace"    ON public.marketplace_listings FOR SELECT USING (status = 'available');
CREATE POLICY "public_read_freshers"       ON public.fresher_profiles     FOR SELECT USING (is_visible);
CREATE POLICY "public_read_site_content"   ON public.site_content         FOR SELECT USING (true);
CREATE POLICY "public_read_avail"          ON public.mentor_availability  FOR SELECT USING (NOT is_booked AND slot_start > now());
CREATE POLICY "public_read_reviews"        ON public.reviews              FOR SELECT USING (true);

-- USER OWN DATA (using email from Firebase JWT)
CREATE POLICY "own_user_profile"           ON public.users                FOR ALL  USING (email = auth_email());
CREATE POLICY "own_applications"           ON public.applications         FOR ALL  USING (user_id = my_user_id());
CREATE POLICY "own_doc_progress"           ON public.user_doc_progress    FOR ALL  USING (user_id = my_user_id());
CREATE POLICY "own_stress_logs"            ON public.stress_logs          FOR ALL  USING (user_id = my_user_id());
CREATE POLICY "own_study_plan"             ON public.study_plans          FOR ALL  USING (user_id = my_user_id());
CREATE POLICY "own_study_sessions"         ON public.study_sessions       FOR ALL  USING (user_id = my_user_id());
CREATE POLICY "own_quiz_attempts"          ON public.quiz_attempts        FOR ALL  USING (user_id = my_user_id());
CREATE POLICY "own_goals"                  ON public.goals                FOR ALL  USING (user_id = my_user_id());
CREATE POLICY "own_course_progress"        ON public.user_course_progress FOR ALL  USING (user_id = my_user_id());
CREATE POLICY "own_skill_profile"          ON public.skill_profiles       FOR ALL  USING (user_id = my_user_id());
CREATE POLICY "own_user_scholarships"      ON public.user_scholarships    FOR ALL  USING (user_id = my_user_id());
CREATE POLICY "own_notifications"          ON public.notifications        FOR ALL  USING (user_id = my_user_id());
CREATE POLICY "own_fresher_profile"        ON public.fresher_profiles     FOR ALL  USING (user_id = my_user_id());
CREATE POLICY "own_educator_upvotes"       ON public.educator_upvotes     FOR ALL  USING (user_id = my_user_id());
CREATE POLICY "own_resource_upvotes"       ON public.resource_upvotes     FOR ALL  USING (user_id = my_user_id());
CREATE POLICY "own_forum_votes"            ON public.forum_votes          FOR ALL  USING (user_id = my_user_id());

-- FORUM (authenticated can post)
CREATE POLICY "auth_forum_post"            ON public.forum_posts          FOR INSERT WITH CHECK (auth_email() IS NOT NULL);
CREATE POLICY "own_forum_post_update"      ON public.forum_posts          FOR UPDATE USING (author_id = my_user_id());
CREATE POLICY "auth_forum_reply"           ON public.forum_replies        FOR INSERT WITH CHECK (auth_email() IS NOT NULL);
CREATE POLICY "auth_campus_post"           ON public.campus_posts         FOR INSERT WITH CHECK (auth_email() IS NOT NULL);

-- MARKETPLACE (authenticated can list/update own)
CREATE POLICY "auth_marketplace_create"    ON public.marketplace_listings FOR INSERT WITH CHECK (auth_email() IS NOT NULL);
CREATE POLICY "own_marketplace_update"     ON public.marketplace_listings FOR UPDATE USING (seller_id = my_user_id());

-- SESSIONS (student or mentor on their own sessions)
CREATE POLICY "session_participants"       ON public.sessions             FOR SELECT USING (
  student_id = my_user_id() OR
  mentor_id IN (SELECT id FROM public.mentors WHERE user_id = my_user_id())
);
CREATE POLICY "session_status_update"      ON public.sessions             FOR UPDATE USING (
  mentor_id IN (SELECT id FROM public.mentors WHERE user_id = my_user_id())
);

-- TRANSACTIONS (payer or payee)
CREATE POLICY "transaction_participants"   ON public.transactions         FOR SELECT USING (
  payer_id = my_user_id() OR payee_id = my_user_id()
);

-- REVIEWS (anyone reads, only reviewer writes)
CREATE POLICY "auth_review_insert"         ON public.reviews              FOR INSERT WITH CHECK (reviewer_id = my_user_id());

-- MENTOR OWN DATA
CREATE POLICY "mentor_own_update"          ON public.mentors              FOR UPDATE USING (user_id = my_user_id());
CREATE POLICY "mentor_own_payout"          ON public.mentor_payout_details FOR ALL USING (
  mentor_id IN (SELECT id FROM public.mentors WHERE user_id = my_user_id())
);
CREATE POLICY "mentor_own_availability"    ON public.mentor_availability  FOR ALL USING (
  mentor_id IN (SELECT id FROM public.mentors WHERE user_id = my_user_id())
);
CREATE POLICY "mentor_own_sessions"        ON public.sessions             FOR SELECT USING (
  mentor_id IN (SELECT id FROM public.mentors WHERE user_id = my_user_id())
);

-- REPORTS (authenticated can submit)
CREATE POLICY "auth_reports"               ON public.reports              FOR INSERT WITH CHECK (auth_email() IS NOT NULL);

-- ADMIN FULL ACCESS (all tables)
CREATE POLICY "admin_all_users"            ON public.users                FOR ALL USING (is_admin());
CREATE POLICY "admin_all_mentors"          ON public.mentors              FOR ALL USING (is_admin());
CREATE POLICY "admin_all_sessions"         ON public.sessions             FOR ALL USING (is_admin());
CREATE POLICY "admin_all_transactions"     ON public.transactions         FOR ALL USING (is_admin());
CREATE POLICY "admin_all_colleges"         ON public.colleges             FOR ALL USING (is_admin());
CREATE POLICY "admin_all_exams"            ON public.exams_timeline       FOR ALL USING (is_admin());
CREATE POLICY "admin_all_cutoffs"          ON public.cutoff_data          FOR ALL USING (is_admin());
CREATE POLICY "admin_all_educators"        ON public.educators            FOR ALL USING (is_admin());
CREATE POLICY "admin_all_courses"          ON public.courses              FOR ALL USING (is_admin());
CREATE POLICY "admin_all_scholarships"     ON public.scholarships         FOR ALL USING (is_admin());
CREATE POLICY "admin_all_reports"          ON public.reports              FOR ALL USING (is_admin());
CREATE POLICY "admin_all_audit"            ON public.admin_audit_log      FOR ALL USING (is_admin());
CREATE POLICY "admin_all_site_content"     ON public.site_content         FOR ALL USING (is_admin());
CREATE POLICY "admin_all_notifications"    ON public.notifications        FOR ALL USING (is_admin());
CREATE POLICY "admin_all_payout_details"   ON public.mentor_payout_details FOR ALL USING (is_admin());
CREATE POLICY "admin_all_strikes"          ON public.mentor_strikes       FOR ALL USING (is_admin());
CREATE POLICY "admin_all_marketplace"      ON public.marketplace_listings FOR ALL USING (is_admin());
CREATE POLICY "admin_all_forum"            ON public.forum_posts          FOR ALL USING (is_admin());
