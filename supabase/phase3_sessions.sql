-- ═══════════════════════════════════════════════════════════════
-- TAKSHAK Phase 3: Sessions, Bookings & Payments Schema
-- Run this in Supabase SQL Editor
-- ═══════════════════════════════════════════════════════════════

-- 1. Sessions Table (Core booking entity)
CREATE TABLE IF NOT EXISTS public.sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    mentor_id UUID NOT NULL REFERENCES public.mentors(id) ON DELETE CASCADE,
    status TEXT NOT NULL DEFAULT 'pending'
        CHECK (status IN ('pending','accepted','rejected','completed','cancelled','expired')),
    duration_minutes INT NOT NULL DEFAULT 10,
    topic TEXT,
    agreed_rate_inr INT NOT NULL DEFAULT 0,
    is_free_session BOOLEAN DEFAULT false,
    meet_link TEXT,
    meet_password TEXT,
    scheduled_at TIMESTAMPTZ,
    razorpay_order_id TEXT,
    razorpay_payment_id TEXT,
    mentor_notes TEXT,
    student_email TEXT,
    mentor_email TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Free Session Tracker (Ensures one free session per student-mentor pair)
CREATE TABLE IF NOT EXISTS public.free_session_tracker (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    mentor_id UUID NOT NULL REFERENCES public.mentors(id) ON DELETE CASCADE,
    session_id UUID REFERENCES public.sessions(id),
    used_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(student_id, mentor_id)
);

-- 3. Indexes for performance
CREATE INDEX IF NOT EXISTS idx_sessions_student ON public.sessions(student_id);
CREATE INDEX IF NOT EXISTS idx_sessions_mentor ON public.sessions(mentor_id);
CREATE INDEX IF NOT EXISTS idx_sessions_status ON public.sessions(status);
CREATE INDEX IF NOT EXISTS idx_free_tracker_student_mentor ON public.free_session_tracker(student_id, mentor_id);

-- 4. Enable RLS
ALTER TABLE public.sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.free_session_tracker ENABLE ROW LEVEL SECURITY;

-- 5. RLS Policies for sessions
-- Students can view their own sessions
CREATE POLICY "Students view own sessions"
    ON public.sessions FOR SELECT
    USING (auth.uid() = student_id);

-- Mentors can view sessions assigned to them
CREATE POLICY "Mentors view assigned sessions"
    ON public.sessions FOR SELECT
    USING (mentor_id IN (SELECT id FROM public.mentors WHERE user_id = auth.uid()));

-- Students can insert (create bookings)
CREATE POLICY "Students create bookings"
    ON public.sessions FOR INSERT
    WITH CHECK (auth.uid() = student_id);

-- Mentors can update sessions they're assigned to (accept/reject, add meet link)
CREATE POLICY "Mentors update assigned sessions"
    ON public.sessions FOR UPDATE
    USING (mentor_id IN (SELECT id FROM public.mentors WHERE user_id = auth.uid()));

-- Students can update their own sessions (cancel)
CREATE POLICY "Students update own sessions"
    ON public.sessions FOR UPDATE
    USING (auth.uid() = student_id);

-- 6. RLS Policies for free_session_tracker
CREATE POLICY "Users view own free sessions"
    ON public.free_session_tracker FOR SELECT
    USING (auth.uid() = student_id);

CREATE POLICY "Users insert own free session record"
    ON public.free_session_tracker FOR INSERT
    WITH CHECK (auth.uid() = student_id);

-- 7. Auto-update updated_at on sessions
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER sessions_updated_at
    BEFORE UPDATE ON public.sessions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();
