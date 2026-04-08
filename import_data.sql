-- MENTORBHAIYAA DATA UPDATE

-- 0. Prepare Schema (Safely allow data import without all mandatory fields)
DO $$ 
BEGIN 
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='mentors' AND column_name='user_id') THEN
    ALTER TABLE mentors ALTER COLUMN user_id DROP NOT NULL;
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='mentors' AND column_name='college_type') THEN
    ALTER TABLE mentors ALTER COLUMN college_type DROP NOT NULL;
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='mentors' AND column_name='branch') THEN
    ALTER TABLE mentors ALTER COLUMN branch DROP NOT NULL;
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='mentors' AND column_name='grad_year') THEN
    ALTER TABLE mentors ALTER COLUMN grad_year DROP NOT NULL;
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='mentors' AND column_name='city_origin') THEN
    ALTER TABLE mentors ALTER COLUMN city_origin DROP NOT NULL;
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='mentors' AND column_name='applied_at') THEN
    ALTER TABLE mentors ALTER COLUMN applied_at DROP NOT NULL;
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='mentors' AND column_name='linkedin_url') THEN
    ALTER TABLE mentors ALTER COLUMN linkedin_url DROP NOT NULL;
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='mentors' AND column_name='college_email') THEN
    ALTER TABLE mentors ALTER COLUMN college_email DROP NOT NULL;
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='exams_timeline' AND column_name='state') THEN
    ALTER TABLE exams_timeline ALTER COLUMN state DROP NOT NULL;
  END IF;
END $$;

-- 1. Cleanup Mentors (Preserving specific ones)
DELETE FROM mentors WHERE NOT (
    LOWER(full_name) LIKE '%raghav mishra%' OR 
    LOWER(full_name) LIKE '%hemant singh bhadoriya%' OR 
    LOWER(full_name) LIKE '%hemant bhadoriya%'
  );

-- 2. Insert New Mentors
INSERT INTO mentors (full_name, photo_url, bio, college, rating, languages, subjects, exam_focus, rate_30min_inr, rate_60min_inr, is_verified, total_sessions)
VALUES ('paarth ainchwar', 'https://base44.app/api/apps/68b276d48626205b99d1f6d7/files/public/68b276d48626205b99d1f6d7/6522ad2f1_52893.webp', 'Medico 
2nd year 
Studying at venkateshwara institute of medical sciences delhi', 'MBBS', 5, ARRAY['English', 'Hindi'], ARRAY['Biology'], ARRAY[]::text[], 0, 0, true, 0);
INSERT INTO mentors (full_name, photo_url, bio, college, rating, languages, subjects, exam_focus, rate_30min_inr, rate_60min_inr, is_verified, total_sessions)
VALUES ('anshika pathak', 'https://base44.app/api/apps/68b276d48626205b99d1f6d7/files/public/68b276d48626205b99d1f6d7/095b9f551_IMG-20251213-WA0013.jpg', 'Hello there! I’m Anshika Pathak currently pursuing B.Tech in Computer Science with specialization in AI & ML at VIT Bhopal. I’m a core member of both technical and non-technical clubs and enjoy sketching in my free time. I’m deeply passionate about mentoring students, especially JEE and NEET aspirants, helping them with academics, exam strategies, and also personal doubts. I believe the right guidance and emotional support can truly change a student’s journey, and I’m always open for students to connect, learn, and grow together.', 'VIT Bhopal, B.Tech CSE (AI&ML)', 5, ARRAY['English', 'Hindi'], ARRAY['Physics', 'Chemistry', 'Mathematics', 'English', 'Hindi', 'Python'], ARRAY[]::text[], 0, 0, true, 0);
INSERT INTO mentors (full_name, photo_url, bio, college, rating, languages, subjects, exam_focus, rate_30min_inr, rate_60min_inr, is_verified, total_sessions)
VALUES ('shagufta behlim ', 'https://via.placeholder.com/150', 'My name is Shagufta Behlim, a BTech student in Computer Science and Engineering with a specialization in Artificial Intelligence. With a deep interest in physics and chemistry, I enjoy connecting core concepts across disciplines and simplifying them for students in a clear, structured way.  I completed my schooling at St. Thomas Sr. Sec. School, achieving excellent results in CBSE Class 10 and 12, along with a strong percentile in JEE. These experiences shaped a disciplined yet supportive approach to studies, which I now bring into my role as a mentor.  As a student-mentor, I strive to be a calm, reliable guide—like an elder sibling—who understands the pressure of exams and helps students with focused planning, concept clarity, and steady motivation. My goal is to create a comforting, growth-oriented environment where learners feel heard, supported, and empowered to reach their academic goals.', 'St. Thomas Sr. Sec. School ', 5, ARRAY['English', 'Hindi'], ARRAY['Physics', 'Chemistry'], ARRAY[]::text[], 0, 0, true, 0);
INSERT INTO mentors (full_name, photo_url, bio, college, rating, languages, subjects, exam_focus, rate_30min_inr, rate_60min_inr, is_verified, total_sessions)
VALUES ('navdeep singh', 'https://via.placeholder.com/150', 'Hi, i am Navdeep Singh from NIT Jalandhar and I am a math and physics expert', 'Nit jalandhar ', 5, ARRAY['English', 'Hindi'], ARRAY['Maths and physics'], ARRAY[]::text[], 0, 0, true, 0);
INSERT INTO mentors (full_name, photo_url, bio, college, rating, languages, subjects, exam_focus, rate_30min_inr, rate_60min_inr, is_verified, total_sessions)
VALUES ('abhinay yadav', 'https://i.postimg.cc/7ZZFj8q1/abhinay.jpg', 'Hey there! Abhinay this side, currently pursuing B-tech from Thapar University. Cleared NDA written twice and attended 3 SSBs (including NDA, TES, NAVY TECH Enteries)', 'Army Public School, Patiala (Punjab)', 5, ARRAY['English', 'Hindi'], ARRAY['NDA SUBJECTS'], ARRAY[]::text[], 0, 0, true, 0);
INSERT INTO mentors (full_name, photo_url, bio, college, rating, languages, subjects, exam_focus, rate_30min_inr, rate_60min_inr, is_verified, total_sessions)
VALUES ('soham kakkar', 'https://base44.app/api/apps/68b276d48626205b99d1f6d7/files/public/68b276d48626205b99d1f6d7/4332a6dff_1000045161.jpg', 'Hi there! I''m a programmer and a 2nd year undergraduate student at the Indian Institute of Technology, Jammu. I’ve worked on professional web development projects and led multiple initiatives as Coding Club Coordinator and core team member across IIT Jammu’s tech and creative communities. I aim to help others grow by sharing practical insights, clean coding habits, and real-world problem-solving approaches.', 'Currently pursuing B.Tech at IIT Jammu.', 5, ARRAY[]::text[], ARRAY['Programming', 'Web Development'], ARRAY[]::text[], 0, 0, true, 0);
INSERT INTO mentors (full_name, photo_url, bio, college, rating, languages, subjects, exam_focus, rate_30min_inr, rate_60min_inr, is_verified, total_sessions)
VALUES ('anvesha joshi ', 'https://i.postimg.cc/sX8bQn6s/IMG-20251003-120318-168.jpg', 'I am a BBA student at Banasthali Vidyapeeth, with a strong academic foundation in Humanities (History, Economics, and English Literature) from Class 12, where I secured an impressive 91%. I have successfully cleared CUET and attempted IPMAT, further honing my academic and analytical skills. I have served as a mentor for English proficiency in both board examinations (10th & 12th) as well as competitive entrance tests, enabling students to master communication and comprehension. With a flair for time management, I effectively balance multiple internships, extracurriculars, and academic pursuits on a daily basis. Additionally, I am passionate about counselling and personality development, having completed psychology-based courses on traits and personalities, which allows me to conduct insightful and empathetic counselling sessions.', 'Banasthali Vidyapeeth', 5, ARRAY[]::text[], ARRAY['English proficiency', 'Academic Coach'], ARRAY[]::text[], 0, 0, true, 0);
INSERT INTO mentors (full_name, photo_url, bio, college, rating, languages, subjects, exam_focus, rate_30min_inr, rate_60min_inr, is_verified, total_sessions)
VALUES ('priyanka nihalani', 'https://i.postimg.cc/QtnXj7Kk/pri.jpg', 'I am a B.Tech IT student at IET DAVV, Indore, with a proven academic record as CBSE District Topper (97.6%, Class 10) and 89.4% in Class 12 with distinction. I mentor students in Board exams (PCM, CS, English) and CUET preparation, offering 1-on-1 academic support, doubt-solving, and motivational guidance.  Beyond academics, I focus on skill development in Python, SQL, C++, Web Development, Flask, Flutterflow, and Canva editing. As an active member of Google Developer Groups (IET campus), I continuously build communication, time management, and problem-solving skills.  I aim to guide learners not only in excelling academically but also in developing practical skills and personal resilience.', 'St. thomas Sr. Sec. School', 4.9, ARRAY[]::text[], ARRAY['Code with Python', 'Mathematics of Class 10th and 12th', 'CUET', 'Doubt solving', 'Web Development', 'SQL', 'English', 'PCM', 'Team Leadership'], ARRAY[]::text[], 0, 0, true, 0);

-- 3. Cleanup Timeline
DELETE FROM exams_timeline;

-- 4. Insert New Timeline Events
INSERT INTO exams_timeline (exam_name, stream, exam_date, official_link)
VALUES ('NIFT Entrance Exam 2026', 'All', '2026-02-09', 'https://nift.ac.in');
INSERT INTO exams_timeline (exam_name, stream, exam_date, official_link)
VALUES ('AFCAT (I) 2026', 'All', '2026-02-24', 'https://afcat.cdac.in');
INSERT INTO exams_timeline (exam_name, stream, exam_date, official_link)
VALUES ('IISER Aptitude Test 2026', 'Science', '2026-05-25', 'https://iiseradmission.in');
INSERT INTO exams_timeline (exam_name, stream, exam_date, official_link)
VALUES ('KVPY Fellowship Test 2026', 'Science', '2026-11-07', 'http://kvpy.iisc.ernet.in');
INSERT INTO exams_timeline (exam_name, stream, exam_date, official_link)
VALUES ('IPM Aptitude Test (IPMAT) 2026', 'Commerce', '2026-05-17', 'https://www.iimidr.ac.in');
INSERT INTO exams_timeline (exam_name, stream, exam_date, official_link)
VALUES ('CLAT 2027 Registration', 'All', '2026-07-15', 'https://consortiumofnlus.ac.in');
INSERT INTO exams_timeline (exam_name, stream, exam_date, official_link)
VALUES ('CUET (UG) 2026', 'All', '2026-05-15', 'https://cuet.nta.nic.in');
INSERT INTO exams_timeline (exam_name, stream, exam_date, official_link)
VALUES ('CDS (I) 2026 Examination', 'All', '2026-04-12', 'https://upsconline.nic.in');
INSERT INTO exams_timeline (exam_name, stream, exam_date, official_link)
VALUES ('NEST 2026', 'Science', '2026-05-30', 'https://www.nestexam.in');
INSERT INTO exams_timeline (exam_name, stream, exam_date, official_link)
VALUES ('NDA & NA Examination (I) 2026', 'All', '2026-04-19', 'https://upsconline.nic.in');
INSERT INTO exams_timeline (exam_name, stream, exam_date, official_link)
VALUES ('SSC CGL 2026 - Combined Graduate Level Exam', 'All', '2026-04-15', 'https://ssc.nic.in/SSCFileServer/PortalManagement/UploadedFiles/apply.html');
INSERT INTO exams_timeline (exam_name, stream, exam_date, official_link)
VALUES ('UPSC CSE 2026 - Civil Services Examination', 'All', '2026-05-31', 'https://upsconline.nic.in');
INSERT INTO exams_timeline (exam_name, stream, exam_date, official_link)
VALUES ('IBPS PO 2026 - Bank PO Recruitment', 'All', '2026-09-15', 'https://ibps.in/apply-online');
INSERT INTO exams_timeline (exam_name, stream, exam_date, official_link)
VALUES ('CAT 2026 - Common Admission Test', 'Commerce', '2026-11-29', 'https://iimcat.ac.in/per/g01/pub/756/ASM/WebPortal/1/index.html');
INSERT INTO exams_timeline (exam_name, stream, exam_date, official_link)
VALUES ('NDA & NA Exam I 2026', 'All', '2026-04-20', 'https://upsconline.nic.in');
INSERT INTO exams_timeline (exam_name, stream, exam_date, official_link)
VALUES ('NDA & NA Exam II 2026', 'All', '2026-09-06', 'https://upsconline.nic.in');
INSERT INTO exams_timeline (exam_name, stream, exam_date, official_link)
VALUES ('AFCAT 2026 - Air Force Common Admission Test', 'All', '2026-02-25', 'https://careerairforce.nic.in/en');
INSERT INTO exams_timeline (exam_name, stream, exam_date, official_link)
VALUES ('GATE 2027 - Graduate Aptitude Test in Engineering', 'Science', '2027-02-06', 'https://gate.iisc.ac.in/gate2027.html');
INSERT INTO exams_timeline (exam_name, stream, exam_date, official_link)
VALUES ('CUET UG 2026 - Common University Entrance Test', 'All', '2026-05-15', 'https://cuet.nta.nic.in');
INSERT INTO exams_timeline (exam_name, stream, exam_date, official_link)
VALUES ('Indian Navy SSR/AA Recruitment 2026', 'All', '2026-06-01', 'https://joinindiannavy.gov.in');
INSERT INTO exams_timeline (exam_name, stream, exam_date, official_link)
VALUES ('CBSE Class 10 Board Exams 2025', 'All', '2025-02-15', 'https://cbse.gov.in/registration');
INSERT INTO exams_timeline (exam_name, stream, exam_date, official_link)
VALUES ('National Scholarship Portal 2025', 'All', '2025-01-15', 'https://scholarships.gov.in/fresh/loginPage');
INSERT INTO exams_timeline (exam_name, stream, exam_date, official_link)
VALUES ('NEET UG 2025 Registration', 'Science', '2025-03-15', 'https://neet.nta.nic.in/registration');
INSERT INTO exams_timeline (exam_name, stream, exam_date, official_link)
VALUES ('MHT CET 2025 Registration', 'Science', '2025-03-01', 'https://mhtcet2025.mahacet.org');
INSERT INTO exams_timeline (exam_name, stream, exam_date, official_link)
VALUES ('NDA 2025 Application', 'All', '2025-01-10', 'https://upsconline.nic.in/ora/VacancyNoticePub.php');
INSERT INTO exams_timeline (exam_name, stream, exam_date, official_link)
VALUES ('CLAT 2025 Registration', 'Arts', '2025-03-01', 'https://consortiumofnlus.ac.in/clat-2025.html');
INSERT INTO exams_timeline (exam_name, stream, exam_date, official_link)
VALUES ('GUJCET 2025 Application', 'Science', '2025-03-15', 'https://gujcet.gseb.org/registration');
INSERT INTO exams_timeline (exam_name, stream, exam_date, official_link)
VALUES ('JEE Main 2025 Application', 'Science', '2025-02-01', 'https://jeemain.nta.nic.in/registration');
INSERT INTO exams_timeline (exam_name, stream, exam_date, official_link)
VALUES ('CBSE Class 12 Board Exams 2025', 'All', '2025-02-15', 'https://cbse.gov.in/registration');
INSERT INTO exams_timeline (exam_name, stream, exam_date, official_link)
VALUES ('VITEEE 2025 Application', 'Science', '2025-02-01', 'https://viteee.vit.ac.in/registration');
INSERT INTO exams_timeline (exam_name, stream, exam_date, official_link)
VALUES ('JEE Main 2026', 'Engineering', '2026-01-01', '');
INSERT INTO exams_timeline (exam_name, stream, exam_date, official_link)
VALUES ('JEE Main 2026', 'Engineering', '2026-04-01', '');
INSERT INTO exams_timeline (exam_name, stream, exam_date, official_link)
VALUES ('CLAT 2026', 'Law', '2026-05-01', '');
INSERT INTO exams_timeline (exam_name, stream, exam_date, official_link)
VALUES ('State-Level Engineering Entrance Exams 2026', 'Engineering', '2026-05-01', '');
INSERT INTO exams_timeline (exam_name, stream, exam_date, official_link)
VALUES ('NEET UG 2026', 'Medical', '2026-05-01', '');
INSERT INTO exams_timeline (exam_name, stream, exam_date, official_link)
VALUES ('JEE Advanced 2026', 'Engineering', '2026-05-01', '');
INSERT INTO exams_timeline (exam_name, stream, exam_date, official_link)
VALUES ('Colgate Keep India Smiling Scholarship', 'All', '2026-11-01', '');
INSERT INTO exams_timeline (exam_name, stream, exam_date, official_link)
VALUES ('U-Go Scholarship Program', 'All', '2026-11-01', '');
INSERT INTO exams_timeline (exam_name, stream, exam_date, official_link)
VALUES ('Reliance Foundation Scholarships', 'All', '2026-10-01', '');
INSERT INTO exams_timeline (exam_name, stream, exam_date, official_link)
VALUES ('State-Level Medical Entrance Exams 2026', 'Medical', '2026-05-01', '');
INSERT INTO exams_timeline (exam_name, stream, exam_date, official_link)
VALUES ('National Scholarship Portal (NSP) Application Window', 'All', '2026-07-01', '');
INSERT INTO exams_timeline (exam_name, stream, exam_date, official_link)
VALUES ('State-Level Law Entrance Exams 2026', 'Law', '2026-05-01', '');
INSERT INTO exams_timeline (exam_name, stream, exam_date, official_link)
VALUES ('GSK Scholars Programme', 'All', '2026-11-01', '');
INSERT INTO exams_timeline (exam_name, stream, exam_date, official_link)
VALUES ('Dr. Reddy’s Foundation Sashakt Scholarship', 'All', '2026-10-01', '');
INSERT INTO exams_timeline (exam_name, stream, exam_date, official_link)
VALUES ('JEE Advanced 2026', 'Engineering', '2026-05-18', '');
INSERT INTO exams_timeline (exam_name, stream, exam_date, official_link)
VALUES ('JEE Main 2026', 'Engineering', '2026-04-01', '');
INSERT INTO exams_timeline (exam_name, stream, exam_date, official_link)
VALUES ('NEET UG 2026', 'Medical', '2026-05-03', '');
INSERT INTO exams_timeline (exam_name, stream, exam_date, official_link)
VALUES ('Swami Dayanand Education Foundation Merit-cum-Means Scholarship', 'All', '2025-08-01', '');
INSERT INTO exams_timeline (exam_name, stream, exam_date, official_link)
VALUES ('JEE Main 2026', 'Engineering', '2026-01-22', '');
INSERT INTO exams_timeline (exam_name, stream, exam_date, official_link)
VALUES ('NEET UG 2026', 'Medical', '2026-05-03', '');
INSERT INTO exams_timeline (exam_name, stream, exam_date, official_link)
VALUES ('Dr. Reddy’s Foundation Sashakt Scholarship', 'Science', '2025-10-01', '');
INSERT INTO exams_timeline (exam_name, stream, exam_date, official_link)
VALUES ('CLAT 2026', 'Law', '2026-12-07', '');
INSERT INTO exams_timeline (exam_name, stream, exam_date, official_link)
VALUES ('Reliance Foundation Scholarships', 'All', '2025-10-01', '');
INSERT INTO exams_timeline (exam_name, stream, exam_date, official_link)
VALUES ('Colgate Keep India Smiling Scholarship', 'All', '2025-11-01', '');
INSERT INTO exams_timeline (exam_name, stream, exam_date, official_link)
VALUES ('TS EAMCET 2026', 'Engineering', '2026-05-02', '');
INSERT INTO exams_timeline (exam_name, stream, exam_date, official_link)
VALUES ('Vidyavridhi Medical Scholarship', 'Medical', '2025-06-01', '');
INSERT INTO exams_timeline (exam_name, stream, exam_date, official_link)
VALUES ('GSK Scholars Programme', 'Science', '2025-11-01', '');
INSERT INTO exams_timeline (exam_name, stream, exam_date, official_link)
VALUES ('WBJEE 2026', 'Engineering', '2026-04-27', '');
INSERT INTO exams_timeline (exam_name, stream, exam_date, official_link)
VALUES ('AP EAPCET 2026', 'Engineering', '2026-05-21', '');
INSERT INTO exams_timeline (exam_name, stream, exam_date, official_link)
VALUES ('MHT CET 2026', 'Engineering', '2026-04-19', '');
INSERT INTO exams_timeline (exam_name, stream, exam_date, official_link)
VALUES ('U-Go Scholarship Program', 'All', '2025-11-01', '');
INSERT INTO exams_timeline (exam_name, stream, exam_date, official_link)
VALUES ('GSK Scholars Programme', 'All', '2025-11-01', '');
INSERT INTO exams_timeline (exam_name, stream, exam_date, official_link)
VALUES ('WBJEE 2026', 'Engineering', '2026-04-27', '');
INSERT INTO exams_timeline (exam_name, stream, exam_date, official_link)
VALUES ('Dr. Reddy’s Foundation Sashakt Scholarship', 'All', '2025-10-01', '');
INSERT INTO exams_timeline (exam_name, stream, exam_date, official_link)
VALUES ('CLAT 2026', 'Law', '2025-12-07', '');
INSERT INTO exams_timeline (exam_name, stream, exam_date, official_link)
VALUES ('MHT CET 2026', 'Engineering', '2026-04-19', '');
INSERT INTO exams_timeline (exam_name, stream, exam_date, official_link)
VALUES ('U-Go Scholarship Program', 'All', '2025-11-01', '');
INSERT INTO exams_timeline (exam_name, stream, exam_date, official_link)
VALUES ('Colgate Keep India Smiling Scholarship', 'All', '2025-11-01', '');
INSERT INTO exams_timeline (exam_name, stream, exam_date, official_link)
VALUES ('Reliance Foundation Scholarships', 'All', '2025-10-01', '');
INSERT INTO exams_timeline (exam_name, stream, exam_date, official_link)
VALUES ('Swami Dayanand Education Foundation Merit-cum-Means Scholarship', 'All', '2025-08-01', '');
INSERT INTO exams_timeline (exam_name, stream, exam_date, official_link)
VALUES ('NEET UG 2026', 'Medical', '2026-05-03', '');
INSERT INTO exams_timeline (exam_name, stream, exam_date, official_link)
VALUES ('JEE Main 2026', 'Engineering', '2026-04-01', '');
INSERT INTO exams_timeline (exam_name, stream, exam_date, official_link)
VALUES ('Reliance Foundation Scholarships 2026 Application Period', 'All', '2025-10-01', '');
INSERT INTO exams_timeline (exam_name, stream, exam_date, official_link)
VALUES ('U-Go Scholarship Program 2026 Application Period', 'All', '2025-11-01', '');
INSERT INTO exams_timeline (exam_name, stream, exam_date, official_link)
VALUES ('Dr. Reddy’s Foundation Sashakt Scholarship 2026 Application Period', 'All', '2025-10-01', '');
INSERT INTO exams_timeline (exam_name, stream, exam_date, official_link)
VALUES ('WBJEE 2026 Application Period', 'Engineering', '2026-01-01', '');
INSERT INTO exams_timeline (exam_name, stream, exam_date, official_link)
VALUES ('JEE Main 2026 Exam Date', 'Engineering', '2026-04-01', '');
INSERT INTO exams_timeline (exam_name, stream, exam_date, official_link)
VALUES ('NEET UG 2026 Application Period', 'Medical', '2026-02-01', '');
INSERT INTO exams_timeline (exam_name, stream, exam_date, official_link)
VALUES ('MHT CET 2026 Exam Date', 'Engineering', '2026-04-01', '');
INSERT INTO exams_timeline (exam_name, stream, exam_date, official_link)
VALUES ('MHT CET 2026 Application Period', 'Engineering', '2025-12-01', '');
INSERT INTO exams_timeline (exam_name, stream, exam_date, official_link)
VALUES ('CLAT 2026 Application Period', 'Law', '2025-07-01', '');
INSERT INTO exams_timeline (exam_name, stream, exam_date, official_link)
VALUES ('NEET UG 2026 Exam Date', 'Medical', '2026-05-03', '');
INSERT INTO exams_timeline (exam_name, stream, exam_date, official_link)
VALUES ('Colgate Keep India Smiling Scholarship 2026 Application Period', 'All', '2025-11-01', '');
INSERT INTO exams_timeline (exam_name, stream, exam_date, official_link)
VALUES ('WBJEE 2026 Exam Date', 'Engineering', '2026-04-01', '');
INSERT INTO exams_timeline (exam_name, stream, exam_date, official_link)
VALUES ('CLAT 2026 Exam Date', 'Law', '2025-12-01', '');
INSERT INTO exams_timeline (exam_name, stream, exam_date, official_link)
VALUES ('Swami Dayanand Education Foundation Merit-cum-Means Scholarship 2026 Application Period', 'All', '2025-08-01', '');
INSERT INTO exams_timeline (exam_name, stream, exam_date, official_link)
VALUES ('GSK Scholars Programme 2026 Application Period', 'All', '2025-11-01', '');
INSERT INTO exams_timeline (exam_name, stream, exam_date, official_link)
VALUES ('JEE Main 2026 Application Period', 'Engineering', '2026-02-01', '');
INSERT INTO exams_timeline (exam_name, stream, exam_date, official_link)
VALUES ('GSK Scholars Programme', 'Science', '2025-11-01', '');
INSERT INTO exams_timeline (exam_name, stream, exam_date, official_link)
VALUES ('JEE Main 2026', 'Engineering', '2026-01-01', '');
INSERT INTO exams_timeline (exam_name, stream, exam_date, official_link)
VALUES ('Reliance Foundation Scholarships', 'All', '2025-10-01', '');
INSERT INTO exams_timeline (exam_name, stream, exam_date, official_link)
VALUES ('Dr. Reddy’s Foundation Sashakt Scholarship', 'Science', '2025-10-01', '');
INSERT INTO exams_timeline (exam_name, stream, exam_date, official_link)
VALUES ('Swami Dayanand Education Foundation Merit-cum-Means Scholarship', 'All', '2025-08-01', '');
INSERT INTO exams_timeline (exam_name, stream, exam_date, official_link)
VALUES ('U-Go Scholarship Program', 'All', '2025-11-01', '');
INSERT INTO exams_timeline (exam_name, stream, exam_date, official_link)
VALUES ('NEET UG 2026', 'Medical', '2026-05-01', '');
INSERT INTO exams_timeline (exam_name, stream, exam_date, official_link)
VALUES ('Colgate Keep India Smiling Scholarship', 'All', '2025-11-01', '');
INSERT INTO exams_timeline (exam_name, stream, exam_date, official_link)
VALUES ('WBJEE 2026', 'Engineering', '2026-04-01', '');
INSERT INTO exams_timeline (exam_name, stream, exam_date, official_link)
VALUES ('CLAT 2026', 'Law', '2026-07-01', '');
INSERT INTO exams_timeline (exam_name, stream, exam_date, official_link)
VALUES ('MHT CET 2026', 'Engineering', '2026-04-01', '');
INSERT INTO exams_timeline (exam_name, stream, exam_date, official_link)
VALUES ('JEE Main 2026 Exam Date', 'Engineering', '2026-04-01', '');
INSERT INTO exams_timeline (exam_name, stream, exam_date, official_link)
VALUES ('WBJEE 2026 Exam Date', 'Engineering', '2026-04-01', '');
INSERT INTO exams_timeline (exam_name, stream, exam_date, official_link)
VALUES ('TS EAMCET 2026 Exam Date', 'Engineering', '2026-05-01', '');
INSERT INTO exams_timeline (exam_name, stream, exam_date, official_link)
VALUES ('JEE/NEET/CBSE 2026 Scholarship Cum Admission Test', 'Engineering', '2025-08-10', '');
INSERT INTO exams_timeline (exam_name, stream, exam_date, official_link)
VALUES ('NEET UG 2026 Exam Date', 'Medical', '2026-05-03', '');
INSERT INTO exams_timeline (exam_name, stream, exam_date, official_link)
VALUES ('CLAT 2026 Application Period', 'Law', '2025-07-15', '');
INSERT INTO exams_timeline (exam_name, stream, exam_date, official_link)
VALUES ('WBJEE 2026 Application Period', 'Engineering', '2026-01-01', '');
INSERT INTO exams_timeline (exam_name, stream, exam_date, official_link)
VALUES ('AP EAPCET 2026 Exam Date', 'Engineering', '2026-05-01', '');
INSERT INTO exams_timeline (exam_name, stream, exam_date, official_link)
VALUES ('NEET UG 2026 Application Period', 'Medical', '2026-02-01', '');
INSERT INTO exams_timeline (exam_name, stream, exam_date, official_link)
VALUES ('JEE Main 2026 Application Period', 'Engineering', '2026-02-01', '');
INSERT INTO exams_timeline (exam_name, stream, exam_date, official_link)
VALUES ('MHT CET 2026 Exam Date', 'Engineering', '2026-04-01', '');
INSERT INTO exams_timeline (exam_name, stream, exam_date, official_link)
VALUES ('TS EAMCET 2026 Application Period', 'Engineering', '2026-02-01', '');
INSERT INTO exams_timeline (exam_name, stream, exam_date, official_link)
VALUES ('MHT CET 2026 Application Period', 'Engineering', '2025-12-01', '');
INSERT INTO exams_timeline (exam_name, stream, exam_date, official_link)
VALUES ('AP EAPCET 2026 Application Period', 'Engineering', '2026-03-01', '');
INSERT INTO exams_timeline (exam_name, stream, exam_date, official_link)
VALUES ('CLAT 2026 Exam Date', 'Law', '2025-12-01', '');
INSERT INTO exams_timeline (exam_name, stream, exam_date, official_link)
VALUES ('NEET UG 2026 Scholarship Test', 'Medical', '2025-09-14', '');
INSERT INTO exams_timeline (exam_name, stream, exam_date, official_link)
VALUES ('JEE Main 2025 Session 1', 'Engineering', '2025-01-22', '');
INSERT INTO exams_timeline (exam_name, stream, exam_date, official_link)
VALUES ('JEE Main 2025 Session 2', 'Engineering', '2025-04-01', '');
INSERT INTO exams_timeline (exam_name, stream, exam_date, official_link)
VALUES ('TS EAMCET 2025', 'Engineering', '2025-05-02', '');
INSERT INTO exams_timeline (exam_name, stream, exam_date, official_link)
VALUES ('NEET UG 2025', 'Medical', '2025-05-04', '');
INSERT INTO exams_timeline (exam_name, stream, exam_date, official_link)
VALUES ('MHT CET 2025', 'Engineering', '2025-05-21', '');
INSERT INTO exams_timeline (exam_name, stream, exam_date, official_link)
VALUES ('WBJEE 2025', 'Engineering', '2025-04-27', '');
INSERT INTO exams_timeline (exam_name, stream, exam_date, official_link)
VALUES ('Chaatravriti Scholarship Yojana 2025', 'All', '2025-06-01', '');
INSERT INTO exams_timeline (exam_name, stream, exam_date, official_link)
VALUES ('INSPIRE Scholarship 2025', 'Science', '2025-10-15', '');
INSERT INTO exams_timeline (exam_name, stream, exam_date, official_link)
VALUES ('Post Matric Scholarships Scheme for Minority Sections 2025', 'All', '2025-06-01', '');
INSERT INTO exams_timeline (exam_name, stream, exam_date, official_link)
VALUES ('AP EAPCET 2025', 'Engineering', '2025-05-21', '');
INSERT INTO exams_timeline (exam_name, stream, exam_date, official_link)
VALUES ('AICTE Pragati Scholarship for Girls 2025', 'All', '2025-11-01', '');
INSERT INTO exams_timeline (exam_name, stream, exam_date, official_link)
VALUES ('JEE Advanced 2025', 'Engineering', '2025-05-18', '');
INSERT INTO exams_timeline (exam_name, stream, exam_date, official_link)
VALUES ('Swami Vivekananda Scholarship (SVMCM) 2025', 'All', '2024-11-20', '');
INSERT INTO exams_timeline (exam_name, stream, exam_date, official_link)
VALUES ('Schindler Igniting Minds Scholarship 2025', 'Science', '2025-06-01', '');
INSERT INTO exams_timeline (exam_name, stream, exam_date, official_link)
VALUES ('CLAT 2025', 'Law', '2024-12-07', '');
INSERT INTO exams_timeline (exam_name, stream, exam_date, official_link)
VALUES ('Central Sector Scholarship 2025', 'All', '2025-06-01', '');
INSERT INTO exams_timeline (exam_name, stream, exam_date, official_link)
VALUES ('National Scholarship Test (NST) 2025', 'All', '2025-05-01', '');
INSERT INTO exams_timeline (exam_name, stream, exam_date, official_link)
VALUES ('KEAM 2025', 'Engineering', '2025-04-23', '');
INSERT INTO exams_timeline (exam_name, stream, exam_date, official_link)
VALUES ('Merit-Cum-Means Scholarship 2025', 'All', '2025-10-01', '');
INSERT INTO exams_timeline (exam_name, stream, exam_date, official_link)
VALUES ('JEE Main 2025 Exam Dates', 'Engineering', '2025-04-01', '');
INSERT INTO exams_timeline (exam_name, stream, exam_date, official_link)
VALUES ('AICTE Pragati & Saksham Scholarships Application Deadline', 'Technical Education', '2025-12-01', '');
INSERT INTO exams_timeline (exam_name, stream, exam_date, official_link)
VALUES ('JEE Main 2025 Application Period', 'Engineering', '2025-02-01', '');
INSERT INTO exams_timeline (exam_name, stream, exam_date, official_link)
VALUES ('MHT CET 2025 Application Period', 'Engineering', '2025-04-19', '');
INSERT INTO exams_timeline (exam_name, stream, exam_date, official_link)
VALUES ('MHT CET 2025 Exam Dates', 'Engineering', '2024-12-30', '');
INSERT INTO exams_timeline (exam_name, stream, exam_date, official_link)
VALUES ('JEE Advanced 2025 Application Period', 'Engineering', '2025-04-23', '');
INSERT INTO exams_timeline (exam_name, stream, exam_date, official_link)
VALUES ('CLAT 2025 Exam Date', 'Law', '2024-12-07', '');
INSERT INTO exams_timeline (exam_name, stream, exam_date, official_link)
VALUES ('INSPIRE Scholarship Application Deadline', 'Science', '2025-11-01', '');
INSERT INTO exams_timeline (exam_name, stream, exam_date, official_link)
VALUES ('CLAT 2025 Application Period', 'Law', '2024-07-15', '');
INSERT INTO exams_timeline (exam_name, stream, exam_date, official_link)
VALUES ('JEE Advanced 2025 Exam Date', 'Engineering', '2025-05-18', '');
INSERT INTO exams_timeline (exam_name, stream, exam_date, official_link)
VALUES ('NEET UG 2025 Application Period', 'Medical', '2025-02-07', '');
INSERT INTO exams_timeline (exam_name, stream, exam_date, official_link)
VALUES ('NEET UG 2025 Exam Date', 'Medical', '2025-05-04', '');
INSERT INTO exams_timeline (exam_name, stream, exam_date, official_link)
VALUES ('JEE Advanced 2026 Exam', 'Engineering', '2026-05-01', '');
INSERT INTO exams_timeline (exam_name, stream, exam_date, official_link)
VALUES ('GATE 2026 Exam', 'Engineering', '2026-02-01', '');
INSERT INTO exams_timeline (exam_name, stream, exam_date, official_link)
VALUES ('UPSC Civil Services (Main) Examination 2026', 'General Studies', '2026-08-21', '');
INSERT INTO exams_timeline (exam_name, stream, exam_date, official_link)
VALUES ('UPSC S.O./Steno (GD-B/GD-I) LDCE 2026', 'General Studies', '2026-12-12', '');
INSERT INTO exams_timeline (exam_name, stream, exam_date, official_link)
VALUES ('JEE Main 2026 Exam', 'Engineering', '2026-04-01', '');
INSERT INTO exams_timeline (exam_name, stream, exam_date, official_link)
VALUES ('UPSC NDA & NA Examination (II) 2026', 'Defence', '2026-09-13', '');
INSERT INTO exams_timeline (exam_name, stream, exam_date, official_link)
VALUES ('NEET 2026 Exam', 'Medical', '2026-05-01', '');
INSERT INTO exams_timeline (exam_name, stream, exam_date, official_link)
VALUES ('UPSC Engineering Services (Main) Examination 2026', 'Engineering', '2026-06-21', '');
INSERT INTO exams_timeline (exam_name, stream, exam_date, official_link)
VALUES ('UPSC Indian Forest Service (Main) Examination 2026', 'Forestry', '2026-11-22', '');
INSERT INTO exams_timeline (exam_name, stream, exam_date, official_link)
VALUES ('UPSC Civil Services (Main) Examination 2026', 'General Studies', '2026-08-21', '');
INSERT INTO exams_timeline (exam_name, stream, exam_date, official_link)
VALUES ('UPSC S.O./Steno (GD-B/GD-I) LDCE 2026', 'General Studies', '2026-12-12', '');
INSERT INTO exams_timeline (exam_name, stream, exam_date, official_link)
VALUES ('UPSC Combined Geo-Scientist (Main) Examination 2026', 'Geoscience', '2026-06-20', '');
INSERT INTO exams_timeline (exam_name, stream, exam_date, official_link)
VALUES ('CLAT 2026 Exam', 'Law', '2025-12-07', '');
INSERT INTO exams_timeline (exam_name, stream, exam_date, official_link)
VALUES ('UPSC Combined Medical Services Examination 2026', 'Medical', '2026-08-02', '');
INSERT INTO exams_timeline (exam_name, stream, exam_date, official_link)
VALUES ('UPSC Civil Services (Preliminary) Examination 2026', 'General Studies', '2026-05-24', '');
INSERT INTO exams_timeline (exam_name, stream, exam_date, official_link)
VALUES ('UPSC CDS Examination (II) 2026', 'Defence', '2026-09-26', '');
INSERT INTO exams_timeline (exam_name, stream, exam_date, official_link)
VALUES ('JEE Advanced 2026 Exam', 'Engineering', '2026-04-01', '');
INSERT INTO exams_timeline (exam_name, stream, exam_date, official_link)
VALUES ('GATE 2026 Exam', 'Engineering', '2025-10-01', '');
INSERT INTO exams_timeline (exam_name, stream, exam_date, official_link)
VALUES ('NEET 2026 Exam', 'Medical', '2026-03-01', '');
INSERT INTO exams_timeline (exam_name, stream, exam_date, official_link)
VALUES ('JEE Main 2026 Exam', 'Engineering', '2026-02-01', '');
INSERT INTO exams_timeline (exam_name, stream, exam_date, official_link)
VALUES ('CLAT 2026 Exam', 'Law', '2025-08-01', '');
INSERT INTO exams_timeline (exam_name, stream, exam_date, official_link)
VALUES ('CLAT 2026 Application Period', 'Law', '2025-07-01', '');
INSERT INTO exams_timeline (exam_name, stream, exam_date, official_link)
VALUES ('Colgate Keep India Smiling Scholarship Application Deadline', 'All', '2025-11-01', '');
INSERT INTO exams_timeline (exam_name, stream, exam_date, official_link)
VALUES ('U-Go Scholarship Program Application Deadline', 'All', '2025-11-01', '');
INSERT INTO exams_timeline (exam_name, stream, exam_date, official_link)
VALUES ('JEE Main 2026 Application Period', 'Engineering', '2025-02-01', '');
INSERT INTO exams_timeline (exam_name, stream, exam_date, official_link)
VALUES ('Swami Dayanand Education Foundation Merit-cum-Means Scholarship Application Deadline', 'All', '2025-08-01', '');
INSERT INTO exams_timeline (exam_name, stream, exam_date, official_link)
VALUES ('WBJEE 2025 Application Period', 'Engineering', '2025-01-01', '');
INSERT INTO exams_timeline (exam_name, stream, exam_date, official_link)
VALUES ('MHT CET 2025 Application Period', 'Engineering', '2024-12-01', '');
INSERT INTO exams_timeline (exam_name, stream, exam_date, official_link)
VALUES ('Reliance Foundation Scholarships Application Deadline', 'All', '2025-10-01', '');
INSERT INTO exams_timeline (exam_name, stream, exam_date, official_link)
VALUES ('NEET UG 2026 Application Period', 'Medical', '2025-02-01', '');
INSERT INTO exams_timeline (exam_name, stream, exam_date, official_link)
VALUES ('NEET UG 2025 Application Period', 'Medical', '2025-02-01', '');
INSERT INTO exams_timeline (exam_name, stream, exam_date, official_link)
VALUES ('Dr. Reddy’s Foundation Sashakt Scholarship Application Deadline', 'All', '2025-10-30', '');
INSERT INTO exams_timeline (exam_name, stream, exam_date, official_link)
VALUES ('GSK Scholars Programme Application Deadline', 'All', '2025-11-01', '');
INSERT INTO exams_timeline (exam_name, stream, exam_date, official_link)
VALUES ('CLAT 2026 Exam Date', 'Law', '2025-12-01', '');
INSERT INTO exams_timeline (exam_name, stream, exam_date, official_link)
VALUES ('JEE Main 2026 Exam Date', 'Engineering', '2026-04-01', '');
INSERT INTO exams_timeline (exam_name, stream, exam_date, official_link)
VALUES ('NEET UG 2026 Application Period', 'Medical', '2026-02-01', '');
INSERT INTO exams_timeline (exam_name, stream, exam_date, official_link)
VALUES ('NEET UG 2026 Scholarship Test', 'Medical', '2025-09-14', '');
INSERT INTO exams_timeline (exam_name, stream, exam_date, official_link)
VALUES ('JEE Main 2026 Application Period', 'Engineering', '2026-02-01', '');
INSERT INTO exams_timeline (exam_name, stream, exam_date, official_link)
VALUES ('WBJEE 2026 Exam Date', 'Engineering', '2026-04-01', '');
INSERT INTO exams_timeline (exam_name, stream, exam_date, official_link)
VALUES ('WBJEE 2026 Application Period', 'Engineering', '2026-01-01', '');
INSERT INTO exams_timeline (exam_name, stream, exam_date, official_link)
VALUES ('NEET UG 2026 Exam Date', 'Medical', '2026-05-03', '');
INSERT INTO exams_timeline (exam_name, stream, exam_date, official_link)
VALUES ('CLAT 2026 Application Period', 'Law', '2025-07-01', '');
INSERT INTO exams_timeline (exam_name, stream, exam_date, official_link)
VALUES ('MHT CET 2026 Exam Date', 'Engineering', '2026-04-01', '');
INSERT INTO exams_timeline (exam_name, stream, exam_date, official_link)
VALUES ('MHT CET 2026 Application Period', 'Engineering', '2025-12-01', '');
INSERT INTO exams_timeline (exam_name, stream, exam_date, official_link)
VALUES ('JEE/NEET/CBSE 2026 Scholarship Cum Admission Test', 'Engineering', '2025-08-10', '');
INSERT INTO exams_timeline (exam_name, stream, exam_date, official_link)
VALUES ('T.I.M.E. JEE/NEET/CBSE 2026 All-India Scholarship Cum Admission Test', 'Engineering', '2026-08-10', '');
INSERT INTO exams_timeline (exam_name, stream, exam_date, official_link)
VALUES ('MHT CET 2026', 'Engineering', '2026-04-01', '');
INSERT INTO exams_timeline (exam_name, stream, exam_date, official_link)
VALUES ('NEET Adda Scholarship Test 2026', 'Medical', '2026-09-14', '');
INSERT INTO exams_timeline (exam_name, stream, exam_date, official_link)
VALUES ('CLAT 2026', 'Law', '2026-07-01', '');
INSERT INTO exams_timeline (exam_name, stream, exam_date, official_link)
VALUES ('JEE Main 2026', 'Engineering', '2026-01-01', '');
INSERT INTO exams_timeline (exam_name, stream, exam_date, official_link)
VALUES ('NEET UG 2026', 'Medical', '2026-05-01', '');
INSERT INTO exams_timeline (exam_name, stream, exam_date, official_link)
VALUES ('WBJEE 2026', 'Engineering', '2026-04-01', '');
INSERT INTO exams_timeline (exam_name, stream, exam_date, official_link)
VALUES ('NEET UG 2026 Application Period', 'Medical', '2026-02-01', '');
INSERT INTO exams_timeline (exam_name, stream, exam_date, official_link)
VALUES ('JEE Main 2026 Exam Date', 'Engineering', '2026-04-01', '');
INSERT INTO exams_timeline (exam_name, stream, exam_date, official_link)
VALUES ('JEE/NEET/CBSE 2026 Scholarship Cum Admission Test', 'Engineering', '2025-08-10', '');
INSERT INTO exams_timeline (exam_name, stream, exam_date, official_link)
VALUES ('JEE Main 2026 Application Period', 'Engineering', '2026-02-01', '');
INSERT INTO exams_timeline (exam_name, stream, exam_date, official_link)
VALUES ('MHT CET 2026 Exam Date', 'Engineering', '2026-04-01', '');
INSERT INTO exams_timeline (exam_name, stream, exam_date, official_link)
VALUES ('MHT CET 2026 Application Period', 'Engineering', '2025-12-01', '');
INSERT INTO exams_timeline (exam_name, stream, exam_date, official_link)
VALUES ('CLAT 2026 Application Period', 'Law', '2025-07-01', '');
INSERT INTO exams_timeline (exam_name, stream, exam_date, official_link)
VALUES ('WBJEE 2026 Application Period', 'Engineering', '2026-01-01', '');
INSERT INTO exams_timeline (exam_name, stream, exam_date, official_link)
VALUES ('WBJEE 2026 Exam Date', 'Engineering', '2026-04-01', '');
INSERT INTO exams_timeline (exam_name, stream, exam_date, official_link)
VALUES ('CLAT 2026 Exam Date', 'Law', '2025-12-01', '');
INSERT INTO exams_timeline (exam_name, stream, exam_date, official_link)
VALUES ('NEET UG 2026 Scholarship Test', 'Medical', '2025-09-14', '');
INSERT INTO exams_timeline (exam_name, stream, exam_date, official_link)
VALUES ('NEET UG 2026 Exam Date', 'Medical', '2026-05-03', '');
INSERT INTO exams_timeline (exam_name, stream, exam_date, official_link)
VALUES ('NEET UG 2026', 'Medical', '2026-05-01', '');
INSERT INTO exams_timeline (exam_name, stream, exam_date, official_link)
VALUES ('JEE Main 2026', 'Engineering', '2026-01-01', '');
INSERT INTO exams_timeline (exam_name, stream, exam_date, official_link)
VALUES ('CLAT 2026', 'Law', '2026-12-01', '');
INSERT INTO exams_timeline (exam_name, stream, exam_date, official_link)
VALUES ('MHT CET 2026', 'Engineering', '2026-04-01', '');
INSERT INTO exams_timeline (exam_name, stream, exam_date, official_link)
VALUES ('WBJEE 2026', 'Engineering', '2026-04-01', '');
INSERT INTO exams_timeline (exam_name, stream, exam_date, official_link)
VALUES ('Reliance Foundation Scholarships', 'All', '2025-10-01', '');
INSERT INTO exams_timeline (exam_name, stream, exam_date, official_link)
VALUES ('GSK Scholars Programme', 'All', '2025-11-01', '');
INSERT INTO exams_timeline (exam_name, stream, exam_date, official_link)
VALUES ('AP EAPCET 2026', 'Engineering', '2026-05-01', '');
INSERT INTO exams_timeline (exam_name, stream, exam_date, official_link)
VALUES ('Swami Dayanand Education Foundation Merit-cum-Means Scholarship', 'All', '2025-08-01', '');
INSERT INTO exams_timeline (exam_name, stream, exam_date, official_link)
VALUES ('TS EAMCET 2026', 'Engineering', '2026-05-01', '');
INSERT INTO exams_timeline (exam_name, stream, exam_date, official_link)
VALUES ('Colgate Keep India Smiling Scholarship', 'All', '2025-11-01', '');
INSERT INTO exams_timeline (exam_name, stream, exam_date, official_link)
VALUES ('U-Go Scholarship Program', 'All', '2025-11-01', '');
INSERT INTO exams_timeline (exam_name, stream, exam_date, official_link)
VALUES ('Dr. Reddy’s Foundation Sashakt Scholarship', 'All', '2025-10-01', '');
INSERT INTO exams_timeline (exam_name, stream, exam_date, official_link)
VALUES ('Dr. Reddy’s Foundation Sashakt Scholarship', 'All', '2025-10-01', '');
INSERT INTO exams_timeline (exam_name, stream, exam_date, official_link)
VALUES ('NEET UG 2026', 'Medical', '2026-05-01', '');
INSERT INTO exams_timeline (exam_name, stream, exam_date, official_link)
VALUES ('MHT CET 2026', 'Engineering', '2026-04-01', '');
INSERT INTO exams_timeline (exam_name, stream, exam_date, official_link)
VALUES ('JEE Main 2026', 'Engineering', '2026-01-01', '');
INSERT INTO exams_timeline (exam_name, stream, exam_date, official_link)
VALUES ('WBJEE 2026', 'Engineering', '2026-04-01', '');
INSERT INTO exams_timeline (exam_name, stream, exam_date, official_link)
VALUES ('TS EAMCET 2026', 'Engineering', '2026-04-01', '');
INSERT INTO exams_timeline (exam_name, stream, exam_date, official_link)
VALUES ('Swami Dayanand Education Foundation Merit-cum-Means Scholarship', 'All', '2025-08-01', '');
INSERT INTO exams_timeline (exam_name, stream, exam_date, official_link)
VALUES ('CLAT 2026', 'Law', '2026-07-01', '');
INSERT INTO exams_timeline (exam_name, stream, exam_date, official_link)
VALUES ('Reliance Foundation Scholarships', 'All', '2025-10-01', '');
INSERT INTO exams_timeline (exam_name, stream, exam_date, official_link)
VALUES ('AP EAPCET 2026', 'Engineering', '2026-04-01', '');
INSERT INTO exams_timeline (exam_name, stream, exam_date, official_link)
VALUES ('Vidyavridhi Medical Scholarship', 'Medical', '2025-06-01', '');
INSERT INTO exams_timeline (exam_name, stream, exam_date, official_link)
VALUES ('Colgate Keep India Smiling Scholarship', 'All', '2025-11-01', '');
INSERT INTO exams_timeline (exam_name, stream, exam_date, official_link)
VALUES ('GSK Scholars Programme', 'All', '2025-11-01', '');
INSERT INTO exams_timeline (exam_name, stream, exam_date, official_link)
VALUES ('U-Go Scholarship Program', 'All', '2025-11-01', '');
INSERT INTO exams_timeline (exam_name, stream, exam_date, official_link)
VALUES ('Colgate Keep India Smiling Scholarship', 'All', '2025-11-01', '');
INSERT INTO exams_timeline (exam_name, stream, exam_date, official_link)
VALUES ('U-Go Scholarship Program', 'All', '2025-11-01', '');
INSERT INTO exams_timeline (exam_name, stream, exam_date, official_link)
VALUES ('GSK Scholars Programme', 'All', '2025-11-01', '');
INSERT INTO exams_timeline (exam_name, stream, exam_date, official_link)
VALUES ('Vidyavridhi Medical Scholarship', 'Medical', '2025-06-01', '');
INSERT INTO exams_timeline (exam_name, stream, exam_date, official_link)
VALUES ('Dr. Reddy’s Foundation Sashakt Scholarship', 'All', '2025-10-01', '');
INSERT INTO exams_timeline (exam_name, stream, exam_date, official_link)
VALUES ('JEE Main 2026', 'Engineering', '2026-01-01', '');
INSERT INTO exams_timeline (exam_name, stream, exam_date, official_link)
VALUES ('Reliance Foundation Scholarships', 'All', '2025-10-01', '');
INSERT INTO exams_timeline (exam_name, stream, exam_date, official_link)
VALUES ('CLAT 2026', 'Law', '2026-12-01', '');
INSERT INTO exams_timeline (exam_name, stream, exam_date, official_link)
VALUES ('MHT CET 2026', 'Engineering', '2026-04-01', '');
INSERT INTO exams_timeline (exam_name, stream, exam_date, official_link)
VALUES ('NEET UG 2026', 'Medical', '2026-05-01', '');
INSERT INTO exams_timeline (exam_name, stream, exam_date, official_link)
VALUES ('TS EAMCET 2026', 'Engineering', '2026-05-01', '');
INSERT INTO exams_timeline (exam_name, stream, exam_date, official_link)
VALUES ('WBJEE 2026', 'Engineering', '2026-04-01', '');
INSERT INTO exams_timeline (exam_name, stream, exam_date, official_link)
VALUES ('AP EAPCET 2026', 'Engineering', '2026-05-01', '');
INSERT INTO exams_timeline (exam_name, stream, exam_date, official_link)
VALUES ('Swami Dayanand Education Foundation Merit-cum-Means Scholarship', 'All', '2025-08-01', '');
INSERT INTO exams_timeline (exam_name, stream, exam_date, official_link)
VALUES ('TS EAMCET 2025 Application Period', 'Engineering', '2025-05-02', '');
INSERT INTO exams_timeline (exam_name, stream, exam_date, official_link)
VALUES ('GSK Scholars Programme Application Deadline', 'All', '2025-11-01', '');
INSERT INTO exams_timeline (exam_name, stream, exam_date, official_link)
VALUES ('MHT CET 2025 Application Period', 'Engineering', '2025-04-19', '');
INSERT INTO exams_timeline (exam_name, stream, exam_date, official_link)
VALUES ('Swami Dayanand Education Foundation Merit-cum-Means Scholarship Application Deadline', 'All', '2025-08-01', '');
INSERT INTO exams_timeline (exam_name, stream, exam_date, official_link)
VALUES ('NEET UG 2026 Application Period', 'Medical', '2025-02-01', '');
INSERT INTO exams_timeline (exam_name, stream, exam_date, official_link)
VALUES ('CLAT 2026 Application Period', 'Law', '2025-07-01', '');
INSERT INTO exams_timeline (exam_name, stream, exam_date, official_link)
VALUES ('Dr. Reddy’s Foundation Sashakt Scholarship Application Deadline', 'All', '2025-10-30', '');
INSERT INTO exams_timeline (exam_name, stream, exam_date, official_link)
VALUES ('U-Go Scholarship Program Application Deadline', 'All', '2025-11-01', '');
INSERT INTO exams_timeline (exam_name, stream, exam_date, official_link)
VALUES ('JEE Main 2026 Application Period', 'Engineering', '2025-02-01', '');
INSERT INTO exams_timeline (exam_name, stream, exam_date, official_link)
VALUES ('Colgate Keep India Smiling Scholarship Application Deadline', 'All', '2025-11-01', '');
INSERT INTO exams_timeline (exam_name, stream, exam_date, official_link)
VALUES ('Reliance Foundation Scholarships Application Deadline', 'All', '2025-10-01', '');
INSERT INTO exams_timeline (exam_name, stream, exam_date, official_link)
VALUES ('AP EAPCET 2025 Application Period', 'Engineering', '2025-05-21', '');
INSERT INTO exams_timeline (exam_name, stream, exam_date, official_link)
VALUES ('Vidyavridhi Medical Scholarship Application Deadline', 'Medical', '2025-06-23', '');
INSERT INTO exams_timeline (exam_name, stream, exam_date, official_link)
VALUES ('WBJEE 2025 Application Deadline', 'Engineering', '2025-04-27', '');
INSERT INTO exams_timeline (exam_name, stream, exam_date, official_link)
VALUES ('Haryana Post Matric Scholarship 2025', 'Engineering', '2025-11-30', '');
INSERT INTO exams_timeline (exam_name, stream, exam_date, official_link)
VALUES ('JEE Main 2025 Session 2 Exam', 'Engineering', '2025-04-06', '');
INSERT INTO exams_timeline (exam_name, stream, exam_date, official_link)
VALUES ('Reliance Foundation Scholarship 2025', 'Engineering', '2025-10-04', '');
INSERT INTO exams_timeline (exam_name, stream, exam_date, official_link)
VALUES ('CLAT 2025 Exam', 'Law', '2024-12-01', '');
INSERT INTO exams_timeline (exam_name, stream, exam_date, official_link)
VALUES ('MHT CET 2025 Exam', 'Engineering', '2025-04-09', '');
INSERT INTO exams_timeline (exam_name, stream, exam_date, official_link)
VALUES ('NEET UG 2025 Exam', 'Medical', '2025-05-04', '');
INSERT INTO exams_timeline (exam_name, stream, exam_date, official_link)
VALUES ('MP Super 100 Scheme 2025', 'Engineering', '2025-09-01', '');
INSERT INTO exams_timeline (exam_name, stream, exam_date, official_link)
VALUES ('MP Super 100 Scheme 2025 Application', 'Engineering', '2025-09-01', '');
INSERT INTO exams_timeline (exam_name, stream, exam_date, official_link)
VALUES ('Haryana Post Matric Scholarship 2025', 'Engineering', '2025-11-30', '');
INSERT INTO exams_timeline (exam_name, stream, exam_date, official_link)
VALUES ('CLAT 2025 Exam', 'Law', '2024-12-01', '');
INSERT INTO exams_timeline (exam_name, stream, exam_date, official_link)
VALUES ('MHT CET 2025 Exam', 'Engineering', '2025-04-09', '');
INSERT INTO exams_timeline (exam_name, stream, exam_date, official_link)
VALUES ('Reliance Foundation Scholarship 2025', 'Engineering', '2025-10-04', '');
INSERT INTO exams_timeline (exam_name, stream, exam_date, official_link)
VALUES ('NEET UG 2025 Exam', 'Medical', '2025-05-04', '');
INSERT INTO exams_timeline (exam_name, stream, exam_date, official_link)
VALUES ('JEE Main 2025 Session 2 Exam', 'Engineering', '2025-04-06', '');
INSERT INTO exams_timeline (exam_name, stream, exam_date, official_link)
VALUES ('Colgate Keep India Smiling Scholarship 2025 Application Deadline', 'All', '2025-11-01', '');
INSERT INTO exams_timeline (exam_name, stream, exam_date, official_link)
VALUES ('Reliance Foundation Scholarship 2025 Application Deadline', 'Engineering', '2025-10-04', '');
INSERT INTO exams_timeline (exam_name, stream, exam_date, official_link)
VALUES ('U-Go Scholarship Program 2025 Application Deadline', 'All', '2025-11-01', '');
INSERT INTO exams_timeline (exam_name, stream, exam_date, official_link)
VALUES ('WBJEE 2026 Application Period', 'Engineering', '2025-12-01', '');
INSERT INTO exams_timeline (exam_name, stream, exam_date, official_link)
VALUES ('MHT CET 2026 Application Period', 'Engineering', '2026-03-01', '');
INSERT INTO exams_timeline (exam_name, stream, exam_date, official_link)
VALUES ('JEE Main 2026 Application Period', 'Engineering', '2025-12-01', '');
INSERT INTO exams_timeline (exam_name, stream, exam_date, official_link)
VALUES ('Dr. Reddy’s Foundation Sashakt Scholarship 2025 Application Deadline', 'Medical', '2025-10-30', '');
INSERT INTO exams_timeline (exam_name, stream, exam_date, official_link)
VALUES ('GSK Scholars Programme 2025 Application Deadline', 'Medical', '2025-11-01', '');
INSERT INTO exams_timeline (exam_name, stream, exam_date, official_link)
VALUES ('NEET UG 2026 Application Period', 'Medical', '2026-02-01', '');
INSERT INTO exams_timeline (exam_name, stream, exam_date, official_link)
VALUES ('CLAT 2026 Application Period', 'Law', '2026-01-01', '');
