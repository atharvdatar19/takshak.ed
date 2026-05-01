import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import csv from 'csv-parser';
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
    const mentors = [];
    fs.createReadStream(path.resolve(process.cwd(), 'Mentor_export.csv'))
      .pipe(csv())
      .on('data', (data) => {
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
      })
      .on('end', async () => {
        console.log(`Loaded ${mentors.length} mentors from CSV.`);
        for (const mentor of mentors) {
          try {
            // First step: We need to see if the user exists in `profiles`, or we create a dummy one, 
            // OR we just directly insert into `mentors`. wait, `mentors.id` usually references `profiles.id`.
            // Let's create a profile first. We bypass Auth, direct to "profiles" table.
            console.log(`Processing mentor: ${mentor.name}`);
            
            // Check if profile exists by email first (we don't have email in profiles usually, but let's see)
            // Wait, we need a UUID for profile.
            // A safer approach: The mentors table has id (UUID PK referencing profiles), but wait, what is the schema?
            // Let's verify the schema of `mentors` table and `profiles`.
            console.log("Will insert later.");
          } catch(e) {
            console.error("Error", e);
          }
        }
        resolve(mentors);
      });
  });
};

const run = async () => {
    console.log("Starting CSV Migration...");
    await importMentors();
};

run();
