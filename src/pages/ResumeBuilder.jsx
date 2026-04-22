import { useState } from "react";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";
import { FileText, Plus, Trash2, Download, Briefcase, GraduationCap, Code } from "lucide-react";

export default function ResumeBuilder() {
  const [personalInfo, setPersonalInfo] = useState({ name: "", email: "", phone: "", linkedin: "" });
  const [education, setEducation] = useState([]);
  const [experience, setExperience] = useState([]);
  const [skills, setSkills] = useState("");

  const addEducation = () => setEducation([...education, { id: Date.now(), school: "", degree: "", year: "" }]);
  const updateEducation = (id, field, value) => setEducation(education.map(e => e.id === id ? { ...e, [field]: value } : e));
  const removeEducation = (id) => setEducation(education.filter(e => e.id !== id));

  const addExperience = () => setExperience([...experience, { id: Date.now(), company: "", role: "", duration: "", description: "" }]);
  const updateExperience = (id, field, value) => setExperience(experience.map(e => e.id === id ? { ...e, [field]: value } : e));
  const removeExperience = (id) => setExperience(experience.filter(e => e.id !== id));

  // A simple print function. In a real app, you might use a library to generate a PDF.
  const handleDownload = () => {
    window.print();
  };

  return (
    <div className="space-y-8 pb-10">
      <Helmet>
        <title>Resume Builder | TAKSHAK</title>
        <meta name="description" content="Build your professional resume tailored for internships and placements." />
        <style>
          {`
            @media print {
              body * { visibility: hidden; }
              #resume-preview, #resume-preview * { visibility: visible; }
              #resume-preview { position: absolute; left: 0; top: 0; width: 100%; padding: 20px; }
            }
          `}
        </style>
      </Helmet>

      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="hero-gradient px-8 py-12 rounded-[32px] text-white shadow-xl"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-sm">
            <FileText size={28} />
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight">Resume Builder</h1>
        </div>
        <p className="text-indigo-100 max-w-xl text-lg">
          Craft a standout resume for your next big opportunity. Fill in the details and download.
        </p>
      </motion.section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Editor Section */}
        <motion.div
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-6"
        >
          {/* Personal Info */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-card">
            <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2"><FileText size={18} /> Personal Info</h2>
            <div className="grid grid-cols-2 gap-4">
              <input placeholder="Full Name" value={personalInfo.name} onChange={e => setPersonalInfo({...personalInfo, name: e.target.value})} className="col-span-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none focus:border-indigo-400" />
              <input placeholder="Email" type="email" value={personalInfo.email} onChange={e => setPersonalInfo({...personalInfo, email: e.target.value})} className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none focus:border-indigo-400" />
              <input placeholder="Phone" value={personalInfo.phone} onChange={e => setPersonalInfo({...personalInfo, phone: e.target.value})} className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none focus:border-indigo-400" />
              <input placeholder="LinkedIn / Portfolio" value={personalInfo.linkedin} onChange={e => setPersonalInfo({...personalInfo, linkedin: e.target.value})} className="col-span-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none focus:border-indigo-400" />
            </div>
          </div>

          {/* Education */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-card">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2"><GraduationCap size={18} /> Education</h2>
              <button onClick={addEducation} className="text-indigo-600 hover:bg-indigo-50 p-1.5 rounded-lg"><Plus size={18} /></button>
            </div>
            <div className="space-y-4">
              {education.map((edu) => (
                <div key={edu.id} className="relative grid grid-cols-2 gap-3 p-4 border border-slate-100 rounded-xl bg-slate-50">
                  <button onClick={() => removeEducation(edu.id)} className="absolute top-2 right-2 text-slate-400 hover:text-rose-500"><Trash2 size={14} /></button>
                  <input placeholder="School / College" value={edu.school} onChange={e => updateEducation(edu.id, 'school', e.target.value)} className="col-span-2 rounded-lg border border-slate-200 px-3 py-2 text-sm" />
                  <input placeholder="Degree / Stream" value={edu.degree} onChange={e => updateEducation(edu.id, 'degree', e.target.value)} className="rounded-lg border border-slate-200 px-3 py-2 text-sm" />
                  <input placeholder="Year (e.g. 2020-2024)" value={edu.year} onChange={e => updateEducation(edu.id, 'year', e.target.value)} className="rounded-lg border border-slate-200 px-3 py-2 text-sm" />
                </div>
              ))}
              {education.length === 0 && <p className="text-xs text-slate-400">Add your educational background.</p>}
            </div>
          </div>

          {/* Experience / Projects */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-card">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2"><Briefcase size={18} /> Experience & Projects</h2>
              <button onClick={addExperience} className="text-indigo-600 hover:bg-indigo-50 p-1.5 rounded-lg"><Plus size={18} /></button>
            </div>
            <div className="space-y-4">
              {experience.map((exp) => (
                <div key={exp.id} className="relative flex flex-col gap-3 p-4 border border-slate-100 rounded-xl bg-slate-50">
                  <button onClick={() => removeExperience(exp.id)} className="absolute top-2 right-2 text-slate-400 hover:text-rose-500"><Trash2 size={14} /></button>
                  <div className="grid grid-cols-2 gap-3 pr-6">
                     <input placeholder="Company / Project Name" value={exp.company} onChange={e => updateExperience(exp.id, 'company', e.target.value)} className="rounded-lg border border-slate-200 px-3 py-2 text-sm" />
                     <input placeholder="Role" value={exp.role} onChange={e => updateExperience(exp.id, 'role', e.target.value)} className="rounded-lg border border-slate-200 px-3 py-2 text-sm" />
                  </div>
                  <input placeholder="Duration (e.g. Summer 2023)" value={exp.duration} onChange={e => updateExperience(exp.id, 'duration', e.target.value)} className="rounded-lg border border-slate-200 px-3 py-2 text-sm" />
                  <textarea placeholder="Description / Bullet points" value={exp.description} onChange={e => updateExperience(exp.id, 'description', e.target.value)} className="rounded-lg border border-slate-200 px-3 py-2 text-sm h-20 resize-none" />
                </div>
              ))}
              {experience.length === 0 && <p className="text-xs text-slate-400">Add relevant experience or projects.</p>}
            </div>
          </div>

          {/* Skills */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-card">
            <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2"><Code size={18} /> Skills</h2>
            <textarea placeholder="e.g. JavaScript, React, Python, Communication (comma separated)" value={skills} onChange={e => setSkills(e.target.value)} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm h-24 resize-none outline-none focus:border-indigo-400" />
          </div>
        </motion.div>

        {/* Preview Section */}
        <motion.div
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="sticky top-24"
        >
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden flex flex-col h-[800px]">
            <div className="bg-slate-50 p-4 border-b border-slate-200 flex justify-between items-center">
              <h3 className="font-bold text-slate-700">Preview</h3>
              <button onClick={handleDownload} className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-indigo-700 transition">
                <Download size={16} /> Print / Save PDF
              </button>
            </div>

            {/* Actual Resume Content */}
            <div id="resume-preview" className="p-8 flex-1 overflow-y-auto bg-white font-serif text-slate-800">
               <div className="border-b-2 border-slate-800 pb-4 mb-6 text-center">
                 <h1 className="text-3xl font-bold uppercase tracking-wider">{personalInfo.name || "Your Name"}</h1>
                 <div className="text-sm mt-2 flex justify-center gap-4 flex-wrap text-slate-600">
                    <span>{personalInfo.email || "email@example.com"}</span>
                    <span>{personalInfo.phone || "+91 1234567890"}</span>
                    <span>{personalInfo.linkedin || "linkedin.com/in/username"}</span>
                 </div>
               </div>

               {education.length > 0 && (
                 <div className="mb-6">
                   <h2 className="text-lg font-bold uppercase border-b border-slate-300 mb-3 tracking-wide">Education</h2>
                   <div className="space-y-3">
                     {education.map(edu => (
                       <div key={edu.id} className="flex justify-between items-start">
                         <div>
                           <h3 className="font-bold text-md">{edu.school || "University Name"}</h3>
                           <p className="text-sm italic">{edu.degree || "Degree Program"}</p>
                         </div>
                         <span className="text-sm font-medium">{edu.year || "Year"}</span>
                       </div>
                     ))}
                   </div>
                 </div>
               )}

               {experience.length > 0 && (
                 <div className="mb-6">
                   <h2 className="text-lg font-bold uppercase border-b border-slate-300 mb-3 tracking-wide">Experience & Projects</h2>
                   <div className="space-y-4">
                     {experience.map(exp => (
                       <div key={exp.id}>
                         <div className="flex justify-between items-start">
                           <div>
                             <h3 className="font-bold text-md">{exp.company || "Organization / Project"}</h3>
                             <p className="text-sm font-semibold">{exp.role || "Role"}</p>
                           </div>
                           <span className="text-sm font-medium">{exp.duration || "Duration"}</span>
                         </div>
                         <p className="text-sm mt-1 text-slate-700 whitespace-pre-wrap">{exp.description || "Description of your responsibilities and achievements."}</p>
                       </div>
                     ))}
                   </div>
                 </div>
               )}

               {skills && (
                 <div className="mb-6">
                   <h2 className="text-lg font-bold uppercase border-b border-slate-300 mb-3 tracking-wide">Skills</h2>
                   <p className="text-sm">{skills}</p>
                 </div>
               )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
