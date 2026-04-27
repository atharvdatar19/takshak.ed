-- Migration: bring exams_timeline in line with app expectations
-- Run this in Supabase SQL Editor once, then run: npm run seed:exams

ALTER TABLE exams_timeline
  ADD COLUMN IF NOT EXISTS name          TEXT,
  ADD COLUMN IF NOT EXISTS category      TEXT,
  ADD COLUMN IF NOT EXISTS exam_date     DATE,
  ADD COLUMN IF NOT EXISTS registration_end DATE,
  ADD COLUMN IF NOT EXISTS slug          TEXT UNIQUE;

-- Back-fill name from old title column (if any rows existed)
UPDATE exams_timeline SET name = title WHERE name IS NULL AND title IS NOT NULL;

-- Make name NOT NULL after back-fill
ALTER TABLE exams_timeline ALTER COLUMN name SET NOT NULL;
