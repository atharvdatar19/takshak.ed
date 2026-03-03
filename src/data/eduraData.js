export const eduraExams = [
    { id: 'gate', name: 'GATE', fullName: 'Graduate Aptitude Test in Engineering', category: 'Engineering' },
    { id: 'jee', name: 'JEE', fullName: 'Joint Entrance Examination', category: 'Engineering' },
    { id: 'cat', name: 'CAT', fullName: 'Common Admission Test', category: 'Management' },
    { id: 'upsc', name: 'UPSC', fullName: 'Union Public Service Commission', category: 'Civil Services' }
];

export const eduraProviders = [
    'PhysicsWallah',
    'Unacademy',
    "Byju's",
    'Made Easy',
    'Ace Academy',
    'YouTube (Free)'
];

export const eduraEducators = [
    {
        id: 'edu_1',
        name: 'Alakh Pandey',
        provider: 'PhysicsWallah',
        subject: 'Physics',
        level: 'Beginner',
        teachingStyle: 'Conceptual',
        rating: 4.9,
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
    }
];

export const eduraCourses = [
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

export const eduraDeadlines = [
    {
        id: 'dl_1',
        title: 'GATE 2025 Registration',
        type: 'Exam',
        organizingBody: 'IIT Roorkee',
        description: 'Last date to register for GATE 2025 without late fee.',
        date: '2025-09-30',
        prizeOrStipend: 'N/A',
        link: 'https://gate.iitr.ac.in/'
    },
    {
        id: 'dl_2',
        title: 'Flipkart GRiD 6.0',
        type: 'Hackathon',
        organizingBody: 'Flipkart',
        description: 'National level hackathon for engineering students.',
        date: '2025-10-15',
        prizeOrStipend: '₹1.5 Lakhs + PPI',
        link: 'https://unstop.com/'
    },
    {
        id: 'dl_3',
        title: 'KVPY Scholarship',
        type: 'Scholarship',
        organizingBody: 'IISc Bangalore',
        description: 'Kishore Vaigyanik Protsahan Yojana for basic sciences.',
        date: '2025-08-20',
        prizeOrStipend: '₹5000 - ₹7000/month',
        link: 'http://kvpy.iisc.ernet.in/'
    },
    {
        id: 'dl_4',
        title: 'Google STEP Internship 2025',
        type: 'Internship',
        organizingBody: 'Google',
        description: 'Summer Trainee Engineering Program for 1st/2nd year students.',
        date: '2025-11-10',
        prizeOrStipend: 'Industry Standard',
        link: 'https://careers.google.com/students/'
    }
];

export const eduraFilters = {
    subjects: ['Physics', 'Chemistry', 'Mathematics', 'Reasoning', 'English', 'General Studies', 'Computer Science'],
    levels: ['Beginner', 'Intermediate', 'Advanced', 'Comprehensive'],
    teachingStyles: ['Conceptual', 'Problem Solving', 'Exam Focused', 'Comprehensive'],
    learningModes: ['Live', 'Recorded', 'Hybrid']
};
