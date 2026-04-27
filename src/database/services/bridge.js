/**
 * bridge.js — Bridge course service (thin wrapper over courses.js).
 * Preserved for backwards compatibility with BridgeCourses feature page.
 */
import supabase from '@database/supabaseClient'
import { auth, isFirebaseConfigured } from '@auth/firebase'

const COURSES_FALLBACK = [
  { id: 'python', title: 'Python Fundamentals', icon_name: 'Terminal', color: 'from-blue-500 to-indigo-500', bgColor: 'bg-blue-50', textColor: 'text-blue-600', progress: 0, totalLessons: 12, completedLessons: 0, xpReward: 1200, description: 'Variables, Loops, Functions, OOP, and Mini-projects. Perfect first language.', status: 'unlocked' },
  { id: 'c-cpp', title: 'C/C++ Bootcamp', icon_name: 'Code', color: 'from-slate-700 to-slate-900', bgColor: 'bg-slate-100', textColor: 'text-slate-700', progress: 0, totalLessons: 15, completedLessons: 0, xpReward: 1500, description: 'Pointers, Arrays, and DSA basics. Essential for engineering first year.', status: 'locked' },
  { id: 'excel', title: 'Excel Mastery', icon_name: 'FileSpreadsheet', color: 'from-emerald-500 to-teal-500', bgColor: 'bg-emerald-50', textColor: 'text-emerald-600', progress: 0, totalLessons: 8, completedLessons: 0, xpReward: 800, description: 'Formulas, Pivot Tables, and Data Analysis. The most useful tool.', status: 'unlocked' },
  { id: 'comm', title: 'Communication Skills', icon_name: 'MessageSquare', color: 'from-rose-400 to-rose-600', bgColor: 'bg-rose-50', textColor: 'text-rose-600', progress: 0, totalLessons: 10, completedLessons: 0, xpReward: 1000, description: 'Email writing, Presentations, and GDs. Stand out in placements.', status: 'unlocked' },
  { id: 'finance', title: 'Financial Literacy', icon_name: 'Landmark', color: 'from-amber-400 to-orange-500', bgColor: 'bg-amber-50', textColor: 'text-amber-600', progress: 0, totalLessons: 6, completedLessons: 0, xpReward: 600, description: 'Budgeting, Ed Loans, and Investing 101 for students.', status: 'unlocked' },
  { id: 'survival', title: 'College Survival', icon_name: 'BrainCircuit', color: 'from-purple-500 to-pink-500', bgColor: 'bg-purple-50', textColor: 'text-purple-600', progress: 0, totalLessons: 5, completedLessons: 0, xpReward: 500, description: 'Time management, ragging prevention, and mental health.', status: 'unlocked' },
]

const ICON_MAP = {
  python: 'Terminal', 'c-cpp': 'Code', excel: 'FileSpreadsheet',
  comm: 'MessageSquare', finance: 'Landmark', survival: 'BrainCircuit',
}
const COLOR_MAP = {
  python: { color: 'from-blue-500 to-indigo-500', bgColor: 'bg-blue-50', textColor: 'text-blue-600' },
  'c-cpp': { color: 'from-slate-700 to-slate-900', bgColor: 'bg-slate-100', textColor: 'text-slate-700' },
  excel: { color: 'from-emerald-500 to-teal-500', bgColor: 'bg-emerald-50', textColor: 'text-emerald-600' },
  comm: { color: 'from-rose-400 to-rose-600', bgColor: 'bg-rose-50', textColor: 'text-rose-600' },
  finance: { color: 'from-amber-400 to-orange-500', bgColor: 'bg-amber-50', textColor: 'text-amber-600' },
  survival: { color: 'from-purple-500 to-pink-500', bgColor: 'bg-purple-50', textColor: 'text-purple-600' },
}

export async function getBridgeCourses() {
  if (!supabase) return COURSES_FALLBACK

  const userEmail = isFirebaseConfigured && auth?.currentUser ? auth.currentUser.email : null

  const { data: coursesData, error } = await supabase.from('courses').select('*')
  if (error || !coursesData?.length) return COURSES_FALLBACK

  let progressMap = {}
  if (userEmail) {
    const { data: progressData } = await supabase
      .from('user_course_progress')
      .select('course_id, completed')
      .eq('user_email', userEmail)
      .eq('completed', true)
    if (progressData) {
      progressData.forEach(p => {
        progressMap[p.course_id] = (progressMap[p.course_id] || 0) + 1
      })
    }
  }

  return coursesData.map(c => {
    const slug = c.slug || c.id
    const completed = progressMap[c.id] || 0
    const total = c.lesson_count || 1
    const pct = Math.min(Math.round((completed / total) * 100), 100)
    const colors = COLOR_MAP[slug] || { color: 'from-indigo-500 to-purple-600', bgColor: 'bg-indigo-50', textColor: 'text-indigo-600' }
    return {
      id: c.id,
      slug: c.slug,
      title: c.title,
      icon_name: ICON_MAP[slug] || 'Code',
      ...colors,
      progress: pct,
      totalLessons: total,
      completedLessons: completed,
      xpReward: c.total_xp || 500,
      description: c.description || '',
      status: pct === 100 ? 'completed' : pct > 0 ? 'in_progress' : 'unlocked',
    }
  })
}
