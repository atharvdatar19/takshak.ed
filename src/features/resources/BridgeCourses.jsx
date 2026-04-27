import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Code, Terminal, FileSpreadsheet, MessageSquare, Landmark, BrainCircuit, Play, CheckCircle2, Trophy, Flame, Zap, ChevronRight, Lock } from "lucide-react"
import { getBridgeCourses } from "@database/services/bridge"

const ICON_MAP = {
    Terminal, Code, FileSpreadsheet, MessageSquare, Landmark, BrainCircuit
}

// --- DEMO DATA ---
const USER_STATS = {
    xp: 2450,
    level: 5,
    streak: 12,
    rank: 42
}

export default function BridgeCourses() {
    const [courses, setCourses] = useState([])

    useEffect(() => {
        getBridgeCourses().then(setCourses)
    }, [])
    return (
        <div className="mx-auto max-w-7xl animate-fade-in space-y-8">

            {/* ── HEADER & GAMIFICATION BAR ── */}
            <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between">
                <div>
                    <div className="inline-flex items-center gap-2 rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-700 mb-3 border border-amber-200">
                        <Zap size={14} className="fill-amber-500 text-amber-500" /> Skill Speedrun
                    </div>
                    <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-slate-900">
                        Bridge Courses
                    </h1>
                    <p className="mt-2 text-lg text-slate-500 max-w-2xl">
                        Gamified, bite-sized modules to fill the 3-month void between exams and college. Level up your skills before Day 1.
                    </p>
                </div>

                {/* Gamification Stats */}
                <div className="flex gap-3 w-full lg:w-auto overflow-x-auto pb-2 scrollbar-hide shrink-0">
                    <div className="bg-white rounded-2xl border border-slate-200 p-3 shadow-sm flex items-center gap-3 min-w-[140px]">
                        <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
                            <Zap size={20} className="text-amber-500 fill-amber-500" />
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total XP</p>
                            <p className="font-black text-slate-900 leading-tight">{USER_STATS.xp}</p>
                        </div>
                    </div>
                    <div className="bg-white rounded-2xl border border-slate-200 p-3 shadow-sm flex items-center gap-3 min-w-[140px]">
                        <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
                            <Flame size={20} className="text-orange-500 fill-orange-500" />
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Day Streak</p>
                            <p className="font-black text-slate-900 leading-tight">{USER_STATS.streak}</p>
                        </div>
                    </div>
                    <div className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl border border-indigo-500 p-3 shadow-md shadow-indigo-200 flex items-center gap-3 min-w-[140px] text-white">
                        <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
                            <Trophy size={20} className="text-white" />
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-indigo-200 uppercase tracking-wider">Global Rank</p>
                            <p className="font-black leading-tight text-white">#{USER_STATS.rank}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── COURSE GRID ── */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {courses.map(course => (
                    <CourseCard key={course.id} course={course} />
                ))}
            </div>

            {/* ── LEADERBOARD PREVIEW ── */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 md:p-8 shadow-sm">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="font-bold text-slate-900 text-xl flex items-center gap-2">
                        <Trophy className="text-amber-500" /> Top Freshers This Week
                    </h3>
                    <button className="text-indigo-600 font-semibold text-sm hover:underline">View All</button>
                </div>

                <div className="space-y-3">
                    {[
                        { rank: 1, name: "Siddharth J.", college: "IIT Delhi", xp: 5420, avatar: "bg-rose-500" },
                        { rank: 2, name: "Ananya R.", college: "BITSAT Goa", xp: 4890, avatar: "bg-blue-500" },
                        { rank: 3, name: "You", college: "NIT Trichy", xp: 2450, avatar: "bg-indigo-500", isYou: true },
                    ].map((user) => (
                        <div key={user.rank} className={`flex items-center gap-4 p-3 rounded-2xl border ${user.isYou ? 'bg-indigo-50 border-indigo-200' : 'bg-slate-50 border-slate-100'}`}>
                            <div className={`w-8 font-black text-center ${user.rank === 1 ? 'text-amber-500' : user.rank === 2 ? 'text-slate-400' : user.rank === 3 && !user.isYou ? 'text-amber-700' : 'text-slate-900'}`}>
                                #{user.rank}
                            </div>
                            <div className={`w-10 h-10 rounded-full text-white font-bold flex items-center justify-center text-sm shadow-sm ${user.avatar}`}>
                                {user.name.charAt(0)}
                            </div>
                            <div className="flex-1">
                                <p className="font-bold text-slate-900 text-sm">{user.name}</p>
                                <p className="text-xs text-slate-500">{user.college}</p>
                            </div>
                            <div className="text-right">
                                <p className="font-black text-slate-900">{user.xp} XP</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

        </div>
    )
}

function CourseCard({ course }) {
    const Icon = ICON_MAP[course.icon_name] || Terminal
    const isCompleted = course.status === "completed"
    const isLocked = course.status === "locked"

    return (
        <div className={`relative rounded-3xl border ${isLocked ? 'bg-slate-50 border-slate-200 opacity-75' : 'bg-white border-slate-200'} p-6 shadow-sm overflow-hidden group hover:shadow-xl transition-all duration-300 flex flex-col`}>
            {/* Top row */}
            <div className="flex justify-between items-start mb-4">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center bg-gradient-to-br ${course.color} shadow-lg text-white`}>
                    <Icon size={28} />
                </div>
                {isCompleted && (
                    <div className="bg-emerald-100 text-emerald-700 p-2 rounded-full">
                        <CheckCircle2 size={20} className="fill-emerald-200" />
                    </div>
                )}
                {isLocked && (
                    <div className="bg-slate-200 text-slate-500 p-2 rounded-full">
                        <Lock size={16} />
                    </div>
                )}
            </div>

            {/* Content */}
            <h3 className="font-bold text-xl text-slate-900 mb-2">{course.title}</h3>
            <p className="text-slate-500 text-sm mb-6 flex-1">{course.description}</p>

            {/* XP Badge */}
            <div className="flex items-center gap-1.5 mb-6">
                <Zap size={14} className="text-amber-500 fill-amber-500" />
                <span className="text-xs font-bold text-slate-600">Earn {course.xpReward} XP</span>
            </div>

            {/* Progress / CTA */}
            <div className="mt-auto">
                {!isLocked ? (
                    <div className="space-y-3">
                        <div className="flex justify-between text-xs font-bold">
                            <span className={course.textColor}>{course.progress}% Completed</span>
                            <span className="text-slate-400">{course.completedLessons}/{course.totalLessons} Lessons</span>
                        </div>
                        <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${course.progress}%` }}
                                transition={{ duration: 1, ease: "easeOut" }}
                                className={`h-full bg-gradient-to-r ${course.color} rounded-full`}
                            />
                        </div>

                        <button className={`w-full mt-4 flex items-center justify-center gap-2 py-3 rounded-xl font-bold transition ${isCompleted
                            ? 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                            : `bg-gradient-to-r ${course.color} text-white hover:scale-[1.02] shadow-md`
                            }`}>
                            {isCompleted ? "Review Course" : course.progress > 0 ? "Continue Learning" : "Start Course"}
                            {!isCompleted && <Play size={16} className="fill-white/20" />}
                        </button>
                    </div>
                ) : (
                    <div className="mt-4 flex items-center justify-center gap-2 py-3 rounded-xl font-bold bg-slate-200 text-slate-500 cursor-not-allowed">
                        <Lock size={16} /> Complete Python to Unlock
                    </div>
                )}
            </div>
        </div>
    )
}
