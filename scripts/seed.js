import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import { parse } from 'csv-parse/sync';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
// Seed scripts require the service role key to bypass RLS — never the anon key
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing VITE_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env file");
  console.error("Seed scripts must use the service role key, not the anon key.");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Parse JSON string fields from CSV correctly
const parseJSONStr = (str) => {
  if (!str) return [];
  try {
    return JSON.parse(str.replace(/""/g, '"'));
  } catch (e) {
    return [];
  }
};

const importMentors = () => {
  return new Promise((resolve, reject) => {
    try {
      const mentors = [];
      const fileContent = fs.readFileSync(path.resolve(process.cwd(), 'Mentor_export.csv'), 'utf-8');
      const records = parse(fileContent, {
        columns: true,
        skip_empty_lines: true
      });

      for (const data of records) {
        mentors.push({
          name: data.name,
          email: data.email,
          profile_picture_url: data.profile_picture_url,
          headline: data.headline,
          expertise: parseJSONStr(data.expertise),
          specializations: parseJSONStr(data.specializations),
          intro_video_url: data.intro_video_url,
          experience_years: parseInt(data.experience_years) || 0,
          rating: parseFloat(data.rating) || 5.0,
          total_reviews: parseInt(data.total_reviews) || 0,
          bio: data.bio,
          alma_mater: data.alma_mater,
          achievements: parseJSONStr(data.achievements),
          preferred_communication: parseJSONStr(data.preferred_communication),
          languages: parseJSONStr(data.languages),
          teaching_style: data.teaching_style,
          // ignoring id, created_date etc as they will be re-generated or mapped
        });
      }

      console.log(`Loaded ${mentors.length} mentors from CSV.`);
      resolve(mentors);
    } catch (err) {
      reject(err);
    }
  });
};

const run = async () => {
    console.log("Starting CSV Migration...");
    await importMentors();
};

run();
