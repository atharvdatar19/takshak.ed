-- TAKSHAK Data Seed & Users Table Setup
-- Run this in your Supabase SQL Editor AFTER running the initial schema.

-- 1. Setup missing public.users table (needed for joins in the UI)
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY REFERENCES auth.users(id),
    full_name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    role TEXT DEFAULT 'student',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public profiles are viewable by everyone" ON public.users FOR SELECT USING (true);
CREATE POLICY "Users can insert their own profile" ON public.users FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.users FOR UPDATE USING (auth.uid() = id);

-- (Optional) Create a trigger to automatically insert a user into public.users when they sign up
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, full_name, email, role)
  VALUES (new.id, split_part(new.email, '@', 1), new.email, 'student');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop the trigger if it exists to avoid errors on run
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Create the trigger on auth.users
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- ============================================================================
-- THE FOLLOWING DROPS CONSTRAINTS TEMPORARILY JUST SO YOU CAN SEE THE DEMO DATA 
-- WITHOUT NEEDING TO MANUALLY SIGN UP 5 DIFFERENT USERS
-- ============================================================================

ALTER TABLE public.fresher_profiles DROP CONSTRAINT IF EXISTS fresher_profiles_user_id_fkey;
ALTER TABLE public.campus_posts DROP CONSTRAINT IF EXISTS campus_posts_author_id_fkey;
ALTER TABLE public.marketplace_listings DROP CONSTRAINT IF EXISTS marketplace_listings_seller_id_fkey;
ALTER TABLE public.users DROP CONSTRAINT IF EXISTS users_id_fkey;
ALTER TABLE public.mentors DROP CONSTRAINT IF EXISTS mentors_user_id_fkey;

-- 2. Insert Dummy Users
INSERT INTO public.users (id, full_name, email, role) VALUES 
('11111111-1111-1111-1111-111111111111', 'Admin', 'admin@takshak.com', 'admin'),
('22222222-2222-2222-2222-222222222222', 'Rohan K.', 'rohan@example.com', 'student'),
('33333333-3333-3333-3333-333333333333', 'Neha Das', 'neha@example.com', 'student'),
('44444444-4444-4444-4444-444444444444', 'Vikram Reddy', 'vikram@example.com', 'student')
ON CONFLICT (id) DO NOTHING;

-- 3. Seed Bridge Courses
INSERT INTO public.courses (id, title, category, total_xp, lesson_count, description) VALUES
('python', 'Python Fundamentals', 'Programming', 1200, 12, 'Variables, Loops, Functions, OOP, and Mini-projects. Perfect first language.'),
('c-cpp', 'C/C++ Bootcamp', 'Programming', 1500, 15, 'Pointers, Arrays, and DSA basics. Essential for engineering first year.'),
('excel', 'Excel Mastery', 'Skills', 800, 8, 'Formulas, Pivot Tables, and Data Analysis. The most useful tool you''ll learn.'),
('comm', 'Communication Skills', 'Soft Skills', 1000, 10, 'Email writing, Presentations, and GDs. Stand out in college placements.'),
('finance', 'Financial Literacy', 'Life Skills', 600, 6, 'Budgeting, Ed Loans, and Investing 101 for students.'),
('survival', 'College Survival', 'Life Skills', 500, 5, 'Time management, ragging prevention, and mental health.')
ON CONFLICT (id) DO NOTHING;

-- 4. Seed Campus Posts (NIT Trichy example)
INSERT INTO public.campus_posts (author_id, college, content, post_type, is_pinned) VALUES
('11111111-1111-1111-1111-111111111111', 'NIT Trichy', 'Hostel allotment list will be published on 15th August. Keep your documents ready.', 'event', true),
('33333333-3333-3333-3333-333333333333', 'NIT Trichy', 'Hey everyone! Coming from Kolkata. Anyone on the Coromandel Express on the 18th? Let''s travel together!', 'intro', false),
('22222222-2222-2222-2222-222222222222', 'NIT Trichy', 'Is it necessary to buy laptops before joining, or should we wait for college discounts?', 'question', false);

-- 5. Seed Fresher Profiles (Roommates)
INSERT INTO public.fresher_profiles (user_id, college, branch, city_from, habits, bio) VALUES 
('22222222-2222-2222-2222-222222222222', 'NIT Trichy', 'CSE', 'Delhi', '{"sleep": "Early Bird", "study": "Silent", "cleanliness": "Neat Freak", "social": "Introvert"}'::jsonb, 'Looking for a quiet room to focus on coding. I don''t smoke/drink.'),
('44444444-4444-4444-4444-444444444444', 'NIT Trichy', 'ECE', 'Telangana', '{"sleep": "Night Owl", "study": "Music", "cleanliness": "Neat", "social": "Ambivert"}'::jsonb, 'Usually up late studying or gaming. Easy going, looking to explore campus life.');

-- 6. Seed Marketplace
INSERT INTO public.marketplace_listings (seller_id, title, exam, material_type, condition, price, mrp, city, state, photos, status) VALUES 
('22222222-2222-2222-2222-222222222222', 'Allen JEE Main & Adv Complete Modules (2024)', 'JEE', 'Modules', 'Good', 3500, 12000, 'Pune', 'MH', '{"https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&q=80&w=400&h=300"}', 'available'),
('33333333-3333-3333-3333-333333333333', 'Cengage Mathematics series (Full 5 Books)', 'JEE', 'Books', 'Excellent', 1800, 4500, 'Pune', 'MH', '{"https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&q=80&w=400&h=300"}', 'available'),
('44444444-4444-4444-4444-444444444444', 'Resonance NEET Rank Booster Notes', 'NEET', 'Notes', 'Fair', 800, 2000, 'Pune', 'MH', '{"https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=400&h=300"}', 'available');

-- 7. Seed Colleges
INSERT INTO public.colleges (id, name, city, state, streams_supported, admission_mode, application_start, application_end, is_featured) VALUES
('55555555-5555-5555-5555-555555555555', 'IIT Bombay', 'Mumbai', 'Maharashtra', '{"Engineering", "Science"}', 'JEE Advanced', '2026-05-01', '2026-06-15', true),
('66666666-6666-6666-6666-666666666666', 'AIIMS New Delhi', 'New Delhi', 'Delhi', '{"Medical"}', 'NEET UG', '2026-03-01', '2026-04-10', true),
('77777777-7777-7777-7777-777777777777', 'NIT Trichy', 'Tiruchirappalli', 'Tamil Nadu', '{"Engineering"}', 'JEE Main', '2026-06-01', '2026-07-20', true)
ON CONFLICT (id) DO NOTHING;

-- 8. Seed Mentors (Must use user IDs that exist)
-- Re-using Neha (3333...) and Vikram (4444...)
INSERT INTO public.mentors (id, user_id, full_name, photo_url, college, college_type, branch, grad_year, city_origin, languages, exam_focus, subjects, bio, rate_30min_inr, rate_60min_inr, rating, is_verified) VALUES
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '33333333-3333-3333-3333-333333333333', 'Neha Das', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200&h=200', 'IIT Bombay', 'IIT', 'Computer Science', 2024, 'Pune', '{"English", "Hindi", "Marathi"}', '{"JEE Advanced", "JEE Main"}', '{"Physics", "Maths"}', 'IITB CSE Grad. I can help you master mechanics and calculus.', 299, 499, 4.9, true),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '44444444-4444-4444-4444-444444444444', 'Vikram Reddy', 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&q=80&w=200&h=200', 'AIIMS New Delhi', 'AIIMS', 'MBBS', 2025, 'Hyderabad', '{"English", "Telugu"}', '{"NEET"}', '{"Biology"}', 'AIIMS rank 42. Let''s crack NEET biology together.', 199, 399, 4.8, true)
ON CONFLICT (id) DO NOTHING;

-- 9. Seed Mentor Availability (Future slots)
INSERT INTO public.mentor_availability (mentor_id, slot_start, slot_end, is_booked) VALUES
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', timezone('utc'::text, now() + interval '1 day'), timezone('utc'::text, now() + interval '1 day 1 hour'), false),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', timezone('utc'::text, now() + interval '2 days'), timezone('utc'::text, now() + interval '2 days 1 hour'), false),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', timezone('utc'::text, now() + interval '1 day 4 hours'), timezone('utc'::text, now() + interval '1 day 5 hours'), false),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', timezone('utc'::text, now() + interval '3 days'), timezone('utc'::text, now() + interval '3 days 1 hour'), false);

-- 10. Seed Educators (Resource Hub)
INSERT INTO public.educators (name, photo_url, tagline, subject, exam_focus, platform, language, level, curator_note, primary_link, playlist_links) VALUES
('Alakh Pandey', 'https://images.unsplash.com/photo-1544717302-de2939b7ef71?auto=format&fit=crop&q=80&w=200&h=200', 'Physics Wallah', 'Physics', '{"JEE Main", "NEET"}', 'PW', '{"Hindi", "English"}', 'Beginner', 'Best for building crystal clear concepts from absolute zero.', 'https://youtube.com', '[{"title": "Kinematics 01", "url": "https://youtube.com"}, {"title": "NLM 01", "url": "https://youtube.com"}]'::jsonb),
('NV Sir', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200&h=200', 'Motion', 'Physics', '{"JEE Advanced"}', 'YouTube', '{"Hindi"}', 'Advanced', 'Legendary mechanics teacher. Directly hits advanced level problems.', 'https://youtube.com', '[]'::jsonb);
