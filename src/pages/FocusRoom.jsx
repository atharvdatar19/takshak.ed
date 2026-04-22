import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";
import { Play, Pause, RotateCcw, Check, Plus, Trash2, Clock } from "lucide-react";

export default function FocusRoom() {
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState("focus"); // focus, shortBreak, longBreak
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");

  useEffect(() => {
    let interval = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      // Play a sound or show notification here in a real app
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  const toggleTimer = () => setIsActive(!isActive);

  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(mode === "focus" ? 25 * 60 : mode === "shortBreak" ? 5 * 60 : 15 * 60);
  };

  const changeMode = (newMode) => {
    setMode(newMode);
    setIsActive(false);
    setTimeLeft(newMode === "focus" ? 25 * 60 : newMode === "shortBreak" ? 5 * 60 : 15 * 60);
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const addTask = (e) => {
    e.preventDefault();
    if (!newTask.trim()) return;
    setTasks([...tasks, { id: Date.now(), text: newTask, completed: false }]);
    setNewTask("");
  };

  const toggleTask = (id) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const removeTask = (id) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  return (
    <div className="space-y-8 pb-10">
      <Helmet>
        <title>Focus Room | TAKSHAK</title>
        <meta name="description" content="Boost your productivity with our Pomodoro timer and task manager." />
      </Helmet>

      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="hero-gradient px-8 py-12 rounded-[32px] text-white shadow-xl"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-sm">
            <Clock size={28} />
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight">Focus Room</h1>
        </div>
        <p className="text-indigo-100 max-w-xl text-lg">
          Master your time with the Pomodoro technique. Stay focused, take breaks, and get things done.
        </p>
      </motion.section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Timer Section */}
        <motion.div
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-3xl bg-white border border-slate-200 p-8 shadow-card flex flex-col items-center"
        >
          <div className="flex bg-slate-100 p-1 rounded-xl mb-8 w-full max-w-sm">
            {[{ id: "focus", label: "Focus" }, { id: "shortBreak", label: "Short Break" }, { id: "longBreak", label: "Long Break" }].map((m) => (
              <button
                key={m.id}
                onClick={() => changeMode(m.id)}
                className={`flex-1 py-2 text-sm font-bold rounded-lg transition-colors ${
                  mode === m.id ? "bg-white text-indigo-600 shadow" : "text-slate-500 hover:text-slate-700"
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>

          <div className="text-[120px] font-black tracking-tighter text-slate-800 leading-none mb-8 font-mono">
            {formatTime(timeLeft)}
          </div>

          <div className="flex gap-4">
            <button
              onClick={toggleTimer}
              className={`flex items-center gap-2 px-8 py-4 rounded-2xl font-bold text-white shadow-lg transition-transform hover:-translate-y-1 ${
                isActive ? "bg-rose-500 hover:bg-rose-600" : "bg-indigo-600 hover:bg-indigo-700"
              }`}
            >
              {isActive ? <Pause size={24} /> : <Play size={24} />}
              {isActive ? "Pause" : "Start"}
            </button>
            <button
              onClick={resetTimer}
              className="flex items-center justify-center w-14 h-14 rounded-2xl bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors"
            >
              <RotateCcw size={24} />
            </button>
          </div>
        </motion.div>

        {/* Tasks Section */}
        <motion.div
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-3xl bg-white border border-slate-200 p-6 shadow-card"
        >
          <h2 className="text-xl font-bold text-slate-900 mb-6">Session Tasks</h2>

          <form onSubmit={addTask} className="flex gap-2 mb-6">
            <input
              type="text"
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              placeholder="What are you working on?"
              className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-indigo-400 focus:bg-white"
            />
            <button
              type="submit"
              className="flex items-center justify-center w-12 h-12 rounded-xl bg-indigo-100 text-indigo-600 hover:bg-indigo-200 transition-colors"
            >
              <Plus size={20} />
            </button>
          </form>

          <div className="space-y-3">
            {tasks.length === 0 ? (
              <p className="text-center text-slate-400 py-8 text-sm">No tasks added yet. Add one above!</p>
            ) : (
              tasks.map((task) => (
                <div
                  key={task.id}
                  className={`flex items-center justify-between p-4 rounded-xl border transition-colors ${
                    task.completed ? "bg-slate-50 border-slate-200 opacity-60" : "bg-white border-slate-200 shadow-sm"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => toggleTask(task.id)}
                      className={`flex items-center justify-center w-6 h-6 rounded border ${
                        task.completed ? "bg-emerald-500 border-emerald-500 text-white" : "border-slate-300 hover:border-indigo-400"
                      }`}
                    >
                      {task.completed && <Check size={14} />}
                    </button>
                    <span className={`text-sm font-medium ${task.completed ? "line-through text-slate-500" : "text-slate-800"}`}>
                      {task.text}
                    </span>
                  </div>
                  <button
                    onClick={() => removeTask(task.id)}
                    className="text-slate-400 hover:text-rose-500 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
