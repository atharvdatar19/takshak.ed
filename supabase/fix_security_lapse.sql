-- ==============================================================================
-- SECURITY PATCH: Prevent role escalation in public.users
-- Automatically executed upon running this script in Supabase SQL editor
-- ==============================================================================

CREATE OR REPLACE FUNCTION public.prevent_role_escalation()
RETURNS TRIGGER AS $$
BEGIN
  -- If the role is being changed...
  IF NEW.role IS DISTINCT FROM OLD.role THEN
    -- Check if the request comes from the authenticated client role
    -- and if the email of the caller is NOT in the admin list.
    IF auth.role() = 'authenticated' AND (
      auth.jwt() ->> 'email' NOT IN ('admin@mentorbhaiyaaa.com', 'atharvd10166@gmail.com')
    ) THEN
      RAISE EXCEPTION 'Security Exception: Cannot artificially escalate user roles. Request denied.';
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop trigger if it already exists to allow idempotent runs
DROP TRIGGER IF EXISTS role_escalation_trigger ON public.users;

-- Create the BEFORE UPDATE trigger
CREATE TRIGGER role_escalation_trigger
  BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE PROCEDURE public.prevent_role_escalation();

-- Verify it was created
COMMENT ON FUNCTION public.prevent_role_escalation IS 'Prevents malicious authenticated users from artificially updating their role in the public.users table.';
