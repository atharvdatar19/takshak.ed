import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";
import { Calculator, Plus, Trash2, TrendingUp, AlertCircle } from "lucide-react";

const GRADE_POINTS = {
  "O": 10, "A+": 9, "A": 8, "B+": 7, "B": 6, "C": 5, "F": 0
};

export default function GpaCalculator() {
  const [semesters, setSemesters] = useState([
    {
      id: 1,
      courses: [
        { id: 11, name: "Mathematics", credits: 4, grade: "A+" },
        { id: 12, name: "Physics", credits: 4, grade: "A" }
      ]
    }
  ]);

  const addSemester = () => {
    setSemesters([...semesters, { id: Date.now(), courses: [] }]);
  };

  const removeSemester = (semId) => {
    setSemesters(semesters.filter(s => s.id !== semId));
  };

  const addCourse = (semId) => {
    setSemesters(semesters.map(s => {
      if (s.id === semId) {
        return { ...s, courses: [...s.courses, { id: Date.now(), name: "", credits: 3, grade: "A" }] };
      }
      return s;
    }));
  };

  const updateCourse = (semId, courseId, field, value) => {
    setSemesters(semesters.map(s => {
      if (s.id === semId) {
        return {
          ...s,
          courses: s.courses.map(c => c.id === courseId ? { ...c, [field]: value } : c)
        };
      }
      return s;
    }));
  };

  const removeCourse = (semId, courseId) => {
    setSemesters(semesters.map(s => {
      if (s.id === semId) {
        return { ...s, courses: s.courses.filter(c => c.id !== courseId) };
      }
      return s;
    }));
  };

  // Calculations
  const calculateGPA = (courses) => {
    let totalCredits = 0;
    let totalPoints = 0;
    courses.forEach(c => {
      const credits = parseFloat(c.credits) || 0;
      const points = GRADE_POINTS[c.grade] || 0;
      totalCredits += credits;
      totalPoints += credits * points;
    });
    return totalCredits > 0 ? (totalPoints / totalCredits).toFixed(2) : "0.00";
  };

  const cgpaData = useMemo(() => {
    let cumulativeCredits = 0;
    let cumulativePoints = 0;
    semesters.forEach(s => {
      s.courses.forEach(c => {
        const credits = parseFloat(c.credits) || 0;
        const points = GRADE_POINTS[c.grade] || 0;
        cumulativeCredits += credits;
        cumulativePoints += credits * points;
      });
    });
    return {
      cgpa: cumulativeCredits > 0 ? (cumulativePoints / cumulativeCredits).toFixed(2) : "0.00",
      totalCredits: cumulativeCredits
    };
  }, [semesters]);

  return (
    <div className="space-y-8 pb-10">
      <Helmet>
        <title>GPA & CGPA Calculator | TAKSHAK</title>
        <meta name="description" content="Calculate your semester GPA and cumulative CGPA easily." />
      </Helmet>

      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="hero-gradient px-8 py-12 rounded-[32px] text-white shadow-xl"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-sm">
            <Calculator size={28} />
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight">GPA Calculator</h1>
        </div>
        <p className="text-indigo-100 max-w-xl text-lg">
          Keep track of your academic performance. Calculate your SGPA and overall CGPA effortlessly.
        </p>
      </motion.section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Editor Area */}
        <motion.div
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-2 space-y-6"
        >
          {semesters.map((sem, index) => (
            <div key={sem.id} className="bg-white rounded-3xl p-6 border border-slate-200 shadow-card">
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
                <h2 className="text-xl font-bold text-slate-900">Semester {index + 1}</h2>
                <div className="flex items-center gap-4">
                  <div className="bg-indigo-50 px-3 py-1.5 rounded-lg border border-indigo-100">
                     <span className="text-sm font-semibold text-indigo-800">SGPA: {calculateGPA(sem.courses)}</span>
                  </div>
                  <button onClick={() => removeSemester(sem.id)} className="text-slate-400 hover:text-rose-500">
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>

              <div className="space-y-3 mb-4">
                <div className="grid grid-cols-12 gap-3 px-2 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  <div className="col-span-5">Course Name</div>
                  <div className="col-span-3">Credits</div>
                  <div className="col-span-3">Grade</div>
                  <div className="col-span-1"></div>
                </div>
                {sem.courses.map(course => (
                  <div key={course.id} className="grid grid-cols-12 gap-3 items-center">
                    <div className="col-span-5">
                      <input
                        placeholder="Course Name"
                        value={course.name}
                        onChange={e => updateCourse(sem.id, course.id, 'name', e.target.value)}
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-indigo-400"
                      />
                    </div>
                    <div className="col-span-3">
                      <input
                        type="number"
                        min="1"
                        max="10"
                        value={course.credits}
                        onChange={e => updateCourse(sem.id, course.id, 'credits', e.target.value)}
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-indigo-400"
                      />
                    </div>
                    <div className="col-span-3">
                      <select
                        value={course.grade}
                        onChange={e => updateCourse(sem.id, course.id, 'grade', e.target.value)}
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-indigo-400"
                      >
                        {Object.keys(GRADE_POINTS).map(g => (
                          <option key={g} value={g}>{g}</option>
                        ))}
                      </select>
                    </div>
                    <div className="col-span-1 flex justify-center">
                      <button onClick={() => removeCourse(sem.id, course.id)} className="text-slate-400 hover:text-rose-500 p-1">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <button
                onClick={() => addCourse(sem.id)}
                className="flex items-center gap-2 text-sm font-semibold text-indigo-600 hover:text-indigo-800 transition px-2"
              >
                <Plus size={16} /> Add Course
              </button>
            </div>
          ))}

          <button
            onClick={addSemester}
            className="w-full py-4 border-2 border-dashed border-slate-300 rounded-3xl text-slate-500 font-bold hover:bg-slate-50 hover:text-indigo-600 hover:border-indigo-300 transition flex justify-center items-center gap-2"
          >
            <Plus size={20} /> Add Another Semester
          </button>
        </motion.div>

        {/* Results Sidebar */}
        <motion.div
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="sticky top-24"
        >
          <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-3xl p-6 text-white shadow-xl">
            <h2 className="text-lg font-bold mb-6 flex items-center gap-2 text-indigo-100">
              <TrendingUp size={20} /> Overall Performance
            </h2>

            <div className="text-center mb-8 bg-white/10 rounded-2xl p-6 backdrop-blur-sm border border-white/20">
              <p className="text-sm text-indigo-200 mb-1 font-medium uppercase tracking-wider">Cumulative CGPA</p>
              <p className="text-6xl font-black">{cgpaData.cgpa}</p>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center pb-4 border-b border-white/10">
                <span className="text-indigo-200">Total Credits Earned</span>
                <span className="font-bold text-xl">{cgpaData.totalCredits}</span>
              </div>
              <div className="flex justify-between items-center pb-4 border-b border-white/10">
                <span className="text-indigo-200">Total Semesters</span>
                <span className="font-bold text-xl">{semesters.length}</span>
              </div>
            </div>

            <div className="mt-8 bg-black/20 p-4 rounded-xl flex items-start gap-3">
              <AlertCircle size={20} className="text-amber-300 shrink-0 mt-0.5" />
              <p className="text-xs text-indigo-100 leading-relaxed">
                Calculations are based on a standard 10-point scale. Check with your university guidelines for specific conversion formulas to percentages.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
