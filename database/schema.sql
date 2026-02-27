-- Users Profile Table (Personalization Engine)
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY,
  full_name TEXT,
  email TEXT UNIQUE,
  class_level TEXT,
  stream TEXT CHECK (stream IN ('PCM', 'PCB', 'Commerce', 'Arts', 'Defence')),
  target_exam TEXT,
  state TEXT,
  city TEXT,
  is_premium BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Colleges Table (SuperApp-ready)
CREATE TABLE IF NOT EXISTS colleges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  state TEXT,
  city TEXT,
  type TEXT,
  streams_supported TEXT[] DEFAULT '{}',
  admission_mode TEXT,
  application_start DATE,
  application_end DATE,
  is_featured BOOLEAN DEFAULT FALSE,
  official_link TEXT
);

-- Smart Timeline Engine
CREATE TABLE IF NOT EXISTS exams_timeline (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  event_type TEXT,
  stream TEXT,
  target_exam TEXT,
  start_date DATE,
  end_date DATE,
  state TEXT,
  is_national BOOLEAN DEFAULT TRUE,
  priority INT DEFAULT 0,
  official_link TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Mentor Marketplace
CREATE TABLE IF NOT EXISTS mentors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  specialization TEXT,
  stream TEXT,
  experience_years INT DEFAULT 0,
  rating NUMERIC(3, 2) DEFAULT 0,
  price NUMERIC(10, 2) DEFAULT 0,
  is_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_email TEXT NOT NULL,
  mentor_id UUID REFERENCES mentors(id),
  topic TEXT,
  requested_datetime TIMESTAMPTZ,
  duration_minutes INT DEFAULT 30,
  status TEXT DEFAULT 'Pending',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Study Tracking
CREATE TABLE IF NOT EXISTS study_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  subject TEXT,
  duration_minutes INT DEFAULT 0,
  created_date TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS quiz_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  subject TEXT,
  score INT DEFAULT 0,
  created_date TIMESTAMPTZ DEFAULT now()
);

-- Goals System
CREATE TABLE IF NOT EXISTS goals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  title TEXT NOT NULL,
  category TEXT,
  target_date DATE,
  progress_percentage INT DEFAULT 0,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Notification Engine
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  type TEXT,
  message TEXT,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT now()
);
