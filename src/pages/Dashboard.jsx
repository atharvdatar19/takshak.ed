import { useEffect, useState } from "react"
import supabase from "../supabaseClient"
import { motion } from "framer-motion"
import { Building2, CalendarDays, AlertTriangle, TrendingUp } from "lucide-react"

export default function Dashboard() {
  const [colleges, setColleges] = useState([])
  const [exams, setExams] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      const { data: collegeData } = await supabase.from("colleges").select("*")
      const { data: examData } = await supabase.from("exams_timeline").select("*")
      setColleges(collegeData || [])
      setExams(examData || [])
      setLoading(false)
    }
    fetchData()
  }, [])

  const today = new Date()

  const closingSoon = colleges.filter(c => {
    if (!c.application_end) return false
    const diff = (new Date(c.application_end) - today) / (1000 * 60 * 60 * 24)
    return diff <= 5 && diff >= 0
  })

  const upcomingExams = exams.filter(e => {
    if (!e.exam_date) return false
    const diff = (new Date(e.exam_date) - today) / (1000 * 60 * 60 * 24)
    return diff >= 0 && diff <= 7
  })

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse text-gray-400">Loading Dashboard...</div>
      </div>
    )
  }

  return (
    <div className="p-6 md:p-10 bg-gray-50 min-h-screen">
      
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-10"
      >
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
          Dashboard Overview
        </h1>
        <p className="text-gray-500 mt-2">
          Track opportunities, deadlines, and upcoming exams.
        </p>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">

        <StatCard 
          icon={Building2}
          title="Total Opportunities"
          value={colleges.length}
          color="blue"
        />

        <StatCard 
          icon={CalendarDays}
          title="Upcoming Exams (7 days)"
          value={upcomingExams.length}
          color="purple"
        />

        <StatCard 
          icon={AlertTriangle}
          title="Closing Soon"
          value={closingSoon.length}
          color="red"
        />

        <StatCard 
          icon={TrendingUp}
          title="Active Listings"
          value={colleges.length}
          color="green"
        />

      </div>

      {/* Alert Section */}
      {closingSoon.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-red-50 border border-red-200 p-6 rounded-xl"
        >
          <h3 className="font-semibold text-red-700 mb-3">
            ⚠ Applications Closing Soon
          </h3>
          <ul className="space-y-2 text-sm text-red-600">
            {closingSoon.slice(0, 3).map((c, i) => (
              <li key={i}>
                {c.name} – closes on {new Date(c.application_end).toLocaleDateString()}
              </li>
            ))}
          </ul>
        </motion.div>
      )}
    </div>
  )
}


/* Reusable Stat Card Component */

function StatCard({ icon: Icon, title, value, color }) {

  const colorMap = {
    blue: "bg-blue-50 text-blue-600",
    purple: "bg-purple-50 text-purple-600",
    red: "bg-red-50 text-red-600",
    green: "bg-green-50 text-green-600",
  }

  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      className="bg-white p-6 rounded-2xl shadow-md transition"
    >
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-xl ${colorMap[color]}`}>
          <Icon size={22} />
        </div>
      </div>
      <h3 className="text-gray-500 text-sm">{title}</h3>
      <p className="text-3xl font-bold mt-2">{value}</p>
    </motion.div>
  )
}
