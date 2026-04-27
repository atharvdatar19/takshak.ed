-- ============================================================
-- ADMIN RLS POLICIES — Allow admin full CRUD access
-- Run in Supabase SQL Editor
-- Project: rhijpejgbfaohjemkacp.supabase.co
-- ============================================================

-- Helper function: check if current user is admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql SECURITY DEFINER STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.users
    WHERE id = auth.uid()
    AND role = 'admin'
  );
$$;

-- Helper function: check if current user has specific role
CREATE OR REPLACE FUNCTION public.has_role(required_role text)
RETURNS boolean
LANGUAGE sql SECURITY DEFINER STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.users
    WHERE id = auth.uid()
    AND role = required_role
  );
$$;

-- ── Admin full access on all tables ──

DO $$ BEGIN
  -- mentors
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Admin full access on mentors') THEN
    CREATE POLICY "Admin full access on mentors"
      ON public.mentors FOR ALL
      USING (public.is_admin());
  END IF;

  -- sessions
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Admin full access on sessions') THEN
    CREATE POLICY "Admin full access on sessions"
      ON public.sessions FOR ALL
      USING (public.is_admin());
  END IF;

  -- transactions
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Admin full access on transactions') THEN
    CREATE POLICY "Admin full access on transactions"
      ON public.transactions FOR ALL
      USING (public.is_admin());
  END IF;

  -- mentor_availability
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Admin full access on mentor_availability') THEN
    CREATE POLICY "Admin full access on mentor_availability"
      ON public.mentor_availability FOR ALL
      USING (public.is_admin());
  END IF;

  -- reviews
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Admin full access on reviews') THEN
    CREATE POLICY "Admin full access on reviews"
      ON public.reviews FOR ALL
      USING (public.is_admin());
  END IF;

  -- users
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Admin full access on users') THEN
    CREATE POLICY "Admin full access on users"
      ON public.users FOR ALL
      USING (public.is_admin());
  END IF;

  -- marketplace_listings
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Admin full access on marketplace_listings') THEN
    CREATE POLICY "Admin full access on marketplace_listings"
      ON public.marketplace_listings FOR ALL
      USING (public.is_admin());
  END IF;

  -- campus_posts
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Admin full access on campus_posts') THEN
    CREATE POLICY "Admin full access on campus_posts"
      ON public.campus_posts FOR ALL
      USING (public.is_admin());
  END IF;

  -- reports
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Admin full access on reports') THEN
    CREATE POLICY "Admin full access on reports"
      ON public.reports FOR ALL
      USING (public.is_admin());
  END IF;

  -- admin_audit_log (admin only)
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Admin full access on admin_audit_log') THEN
    CREATE POLICY "Admin full access on admin_audit_log"
      ON public.admin_audit_log FOR ALL
      USING (public.is_admin());
  END IF;

  -- educators
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Admin full access on educators') THEN
    CREATE POLICY "Admin full access on educators"
      ON public.educators FOR ALL
      USING (public.is_admin());
  END IF;

  -- colleges
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Admin full access on colleges') THEN
    CREATE POLICY "Admin full access on colleges"
      ON public.colleges FOR ALL
      USING (public.is_admin());
  END IF;
END $$;

-- ── Role-specific read policies ──

-- finance_viewer can read sessions and transactions
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Finance viewer read sessions') THEN
    CREATE POLICY "Finance viewer read sessions"
      ON public.sessions FOR SELECT
      USING (public.has_role('finance_viewer'));
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Finance viewer read transactions') THEN
    CREATE POLICY "Finance viewer read transactions"
      ON public.transactions FOR SELECT
      USING (public.has_role('finance_viewer'));
  END IF;
END $$;

-- moderator can read/update reports and mentor profiles
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Moderator manage reports') THEN
    CREATE POLICY "Moderator manage reports"
      ON public.reports FOR ALL
      USING (public.has_role('moderator'));
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Moderator manage mentors') THEN
    CREATE POLICY "Moderator manage mentors"
      ON public.mentors FOR ALL
      USING (public.has_role('moderator'));
  END IF;
END $$;

-- content_editor can manage educators, colleges, exams
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Content editor manage educators') THEN
    CREATE POLICY "Content editor manage educators"
      ON public.educators FOR ALL
      USING (public.has_role('content_editor'));
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Content editor manage colleges') THEN
    CREATE POLICY "Content editor manage colleges"
      ON public.colleges FOR ALL
      USING (public.has_role('content_editor'));
  END IF;
END $$;
