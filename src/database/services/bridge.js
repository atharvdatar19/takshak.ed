import supabase, { isDemoMode } from "@database/supabaseClient"

// --- DEMO DATA FALLBACKS ---
const COURSES = [
    {
        id: "python",
        title: "Python Fundamentals",
        icon_name: "Terminal",
        color: "from-blue-500 to-indigo-500",
        bgColor: "bg-blue-50",
        textColor: "text-blue-600",
        progress: 65,
        totalLessons: 12,
        completedLessons: 8,
        xpReward: 1200,
        description: "Variables, Loops, Functions, OOP, and Mini-projects. Perfect first language.",
        status: "in_progress"
    },
    {
        id: "c-cpp",
        title: "C/C++ Bootcamp",
        icon_name: "Code",
        color: "from-slate-700 to-slate-900",
        bgColor: "bg-slate-100",
        textColor: "text-slate-700",
        progress: 0,
        totalLessons: 15,
        completedLessons: 0,
        xpReward: 1500,
        description: "Pointers, Arrays, and DSA basics. Essential for engineering first year.",
        status: "locked"
    },
    {
        id: "excel",
        title: "Excel Mastery",
        icon_name: "FileSpreadsheet",
        color: "from-emerald-500 to-teal-500",
        bgColor: "bg-emerald-50",
        textColor: "text-emerald-600",
        progress: 100,
        totalLessons: 8,
        completedLessons: 8,
        xpReward: 800,
        description: "Formulas, Pivot Tables, and Data Analysis. The most useful tool you'll learn.",
        status: "completed"
    },
    {
        id: "comm",
        title: "Communication Skills",
        icon_name: "MessageSquare",
        color: "from-rose-400 to-rose-600",
        bgColor: "bg-rose-50",
        textColor: "text-rose-600",
        progress: 20,
        totalLessons: 10,
        completedLessons: 2,
        xpReward: 1000,
        description: "Email writing, Presentations, and GDs. Stand out in college placements.",
        status: "in_progress"
    },
    {
        id: "finance",
        title: "Financial Literacy",
        icon_name: "Landmark",
        color: "from-amber-400 to-orange-500",
        bgColor: "bg-amber-50",
        textColor: "text-amber-600",
        progress: 0,
        totalLessons: 6,
        completedLessons: 0,
        xpReward: 600,
        description: "Budgeting, Ed Loans, and Investing 101 for students.",
        status: "unlocked"
    },
    {
        id: "survival",
        title: "College Survival",
        icon_name: "BrainCircuit",
        color: "from-purple-500 to-pink-500",
        bgColor: "bg-purple-50",
        textColor: "text-purple-600",
        progress: 0,
        totalLessons: 5,
        completedLessons: 0,
        xpReward: 500,
        description: "Time management, ragging prevention, and mental health.",
        status: "unlocked"
    }
]

// --- SERVICES ---

export async function getBridgeCourses() {
    if (isDemoMode) return COURSES

    const { data: userData } = await supabase.auth.getUser()

    // Fetch courses
    const { data: coursesData, error: coursesError } = await supabase
        .from('courses')
        .select('*')

    if (coursesError || !coursesData || coursesData.length === 0) return COURSES

    // If logged in, fetch user progress
    let progressMap = {}
    if (userData?.user) {
        const { data: progressData } = await supabase
            .from('user_course_progress')
            .select('*')
            .eq('user_id', userData.user.id)

        if (progressData) {
            progressData.forEach(p => {
                progressMap[p.course_id] = p
            })
        }
    }

    // Merge and format
    return coursesData.map(c => {
        const progress = progressMap[c.id]
        const completed = progress?.completed_lessons || 0
        const total = c.lesson_count || 1
        const percent = Math.round((completed / total) * 100)

        // Mock UI colors for now based on index/id
        return {
            id: c.id,
            title: c.title,
            icon_name: c.id.includes('python') ? 'Terminal' : 'Code',
            color: "from-indigo-500 to-purple-600",
            bgColor: "bg-indigo-50",
            textColor: "text-indigo-600",
            progress: percent,
            totalLessons: total,
            completedLessons: completed,
            xpReward: c.total_xp,
            description: c.description || "",
            status: progress?.status || "unlocked"
        }
    })
}
