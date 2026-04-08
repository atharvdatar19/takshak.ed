export const takshakExams = [
    { id: 'gate', name: 'GATE', fullName: 'Graduate Aptitude Test in Engineering', category: 'Engineering' },
    { id: 'jee', name: 'JEE', fullName: 'Joint Entrance Examination', category: 'Engineering' },
    { id: 'cat', name: 'CAT', fullName: 'Common Admission Test', category: 'Management' },
    { id: 'upsc', name: 'UPSC', fullName: 'Union Public Service Commission', category: 'Civil Services' }
];

export const takshakProviders = [
    'PhysicsWallah',
    'Unacademy',
    "Byju's",
    'Made Easy',
    'Ace Academy',
    'YouTube (Free)'
];

export const takshakEducators = [
    {
        id: 'edu_1',
        name: 'Alakh Pandey',
        provider: 'PhysicsWallah',
        subject: 'Physics',
        level: 'Beginner',
        teachingStyle: 'Conceptual',
        rating: 5,
        reach: '15M+',
        tags: ['Physics', 'Conceptual Teaching', 'Engaging']
    },
    {
        id: 'edu_2',
        name: 'NV Sir',
        provider: 'Unacademy',
        subject: 'Mathematics',
        level: 'Advanced',
        teachingStyle: 'Problem Solving',
        rating: 4.8,
        reach: '5M+',
        tags: ['Mathematics', 'JEE Advanced', 'Shortcuts']
    },
    {
        id: 'edu_3',
        name: 'Mrunal Patel',
        provider: 'Unacademy',
        subject: 'General Studies',
        level: 'Comprehensive',
        teachingStyle: 'Exam Focused',
        rating: 4.9,
        reach: '8M+',
        tags: ['UPSC', 'Economy', 'Comprehensive']
    },
    {
        id: 'edu_4',
        name: 'Ravindra Babu',
        provider: 'Made Easy',
        subject: 'Computer Science',
        level: 'Intermediate',
        teachingStyle: 'Conceptual',
        rating: 4.7,
        reach: '2M+',
        tags: ['GATE', 'CS/IT', 'In-depth']
    },
    {
        id: 'edu_5',
        name: 'Harkirat Singh',
        provider: '100xDevs',
        subject: 'Hackathons',
        level: 'Advanced',
        teachingStyle: 'Problem Solving',
        rating: 4.9,
        reach: '500K+',
        tags: ['Open Source', 'Web3', 'Hackathons']
    },
    {
        id: 'edu_6',
        name: 'Striver (Raj Vikramaditya)',
        provider: 'TakeUForward',
        subject: 'Internships',
        level: 'Comprehensive',
        teachingStyle: 'Exam Focused',
        rating: 5.0,
        reach: '1M+',
        tags: ['DSA', 'FAANG', 'Placements', 'Internships']
    }
];

export const takshakCourses = [
    {
        id: 'crs_1',
        title: 'Lakshya JEE 2026',
        provider: 'PhysicsWallah',
        exam: 'JEE',
        mode: 'Live',
        price: 4500,
        rating: 4.8,
        educatorIds: ['edu_1'],
        tags: ['Live Classes', 'Doubt Engine', 'Mock Tests']
    },
    {
        id: 'crs_2',
        title: 'GATE CS Complete Syllabus',
        provider: 'Made Easy',
        exam: 'GATE',
        mode: 'Recorded',
        price: 15000,
        rating: 4.7,
        educatorIds: ['edu_4'],
        tags: ['Recorded', 'High Yield', 'Test Series']
    },
    {
        id: 'crs_3',
        title: 'UPSC GS Foundation',
        provider: 'Unacademy',
        exam: 'UPSC',
        mode: 'Hybrid',
        price: 35000,
        rating: 4.9,
        educatorIds: ['edu_3'],
        tags: ['Live + Recorded', 'Mains Answer Writing']
    }
];

export const takshakDeadlines = [
    {
        id: 'dl_1',
        title: 'JEE Main Session 2 Registration',
        type: 'Exam',
        organizingBody: 'NTA',
        description: 'Last date to apply for JEE Main 2026 Session 2 without late fee.',
        date: '2026-04-10',
        prizeOrStipend: 'N/A',
        link: 'https://jeemain.nta.ac.in/'
    },
    {
        id: 'dl_2',
        title: 'Smart India Hackathon 2026',
        type: 'Hackathon',
        organizingBody: 'MoE India',
        description: 'National-level hackathon open to all UG/PG engineering students.',
        date: '2026-05-01',
        prizeOrStipend: '₹1 Lakh per team',
        link: 'https://www.sih.gov.in/'
    },
    {
        id: 'dl_3',
        title: 'NEET UG 2026 Registration',
        type: 'Exam',
        organizingBody: 'NTA',
        description: 'Apply for NEET UG 2026 before the deadline to secure your seat.',
        date: '2026-04-20',
        prizeOrStipend: 'N/A',
        link: 'https://neet.nta.nic.in/'
    },
    {
        id: 'dl_4',
        title: 'Google STEP Internship 2026',
        type: 'Internship',
        organizingBody: 'Google',
        description: 'Summer Trainee Engineering Program for 1st/2nd year CS students.',
        date: '2026-05-15',
        prizeOrStipend: 'Industry Standard',
        link: 'https://careers.google.com/students/'
    }
];

export const takshakFilters = {
    subjects: ['Physics', 'Chemistry', 'Mathematics', 'Reasoning', 'English', 'General Studies', 'Computer Science'],
    levels: ['Beginner', 'Intermediate', 'Advanced', 'Comprehensive'],
    teachingStyles: ['Conceptual', 'Problem Solving', 'Exam Focused', 'Comprehensive'],
    learningModes: ['Live', 'Recorded', 'Hybrid']
};
