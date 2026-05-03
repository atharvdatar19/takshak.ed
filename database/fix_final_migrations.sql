-- ============================================================
-- FINAL PRODUCTION FIXES & MIGRATIONS
-- ============================================================

-- 1. FIX-2: Sanitize duplicate sessions before enforcing unique constraint
DELETE FROM public.sessions a USING public.sessions b
WHERE a.id > b.id AND a.availability_slot_id = b.availability_slot_id;

-- 2. FIX-2: Add unique constraint to prevent double-booking at DB level
ALTER TABLE public.sessions DROP CONSTRAINT IF EXISTS unique_slot_booking;
ALTER TABLE public.sessions ADD CONSTRAINT unique_slot_booking UNIQUE (availability_slot_id);

-- 3. FIX-4: Materialized View for performance-optimized landing stats
DROP MATERIALIZED VIEW IF EXISTS public.mv_platform_stats;
CREATE MATERIALIZED VIEW public.mv_platform_stats AS
SELECT 
  (SELECT count(*) FROM public.users) as user_count,
  (SELECT count(*) FROM public.mentors WHERE is_verified = true) as mentor_count,
  (SELECT count(*) FROM public.colleges) as college_count,
  (SELECT count(*) FROM public.sessions WHERE status = 'completed') as session_count;

-- Function to refresh the stats concurrently
CREATE OR REPLACE FUNCTION public.refresh_platform_stats()
RETURNS void AS $$
BEGIN
  REFRESH MATERIALIZED VIEW CONCURRENTLY public.mv_platform_stats;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. FIX-1: Security — Use Firebase Custom Claims for Admin check
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  -- Check for 'admin' claim in the Firebase Auth JWT
  RETURN (auth.jwt() ->> 'admin' = 'true');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- 5. Cleanup: Remove role-based fallback policies if any
-- (Assuming we rely on is_admin() which we just updated)
