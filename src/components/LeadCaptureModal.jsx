import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, Mail, Phone, ChevronRight } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import supabase from '../supabaseClient';
import { PulseGlow } from './animations/AnimationUtils';

export default function LeadCaptureModal() {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [interest, setInterest] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    // Only show to non-logged-in users who haven't dismissed or submitted before
    if (user || localStorage.getItem('lead_captured') === 'true' || localStorage.getItem('lead_dismissed') === 'true') {
      return;
    }

    // Show after 15 seconds of browsing
    const timer = setTimeout(() => {
      setIsOpen(true);
    }, 15000);

    return () => clearTimeout(timer);
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email && !phone) return;
    setLoading(true);

    if (supabase) {
      await supabase.from('visitor_leads').insert([
        { email, phone, interest_area: interest }
      ]);
    }

    localStorage.setItem('lead_captured', 'true');
    setSubmitted(true);
    setLoading(false);
    setTimeout(() => setIsOpen(false), 2500);
  };

  const handleDismiss = () => {
    localStorage.setItem('lead_dismissed', 'true');
    setIsOpen(false);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            className="relative w-full max-w-lg overflow-hidden bg-white shadow-2xl rounded-3xl"
          >
            <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />
            
            <button
              onClick={handleDismiss}
              className="absolute p-2 text-slate-400 transition-colors top-4 right-4 hover:text-slate-600 hover:bg-slate-100 rounded-xl"
            >
              <X size={20} />
            </button>

            <div className="p-8">
              {!submitted ? (
                <>
                  <div className="flex items-center justify-center w-12 h-12 mb-6 bg-indigo-100 rounded-2xl text-indigo-600">
                    <Sparkles size={24} />
                  </div>
                  
                  <h3 className="mb-2 text-2xl font-bold text-slate-800">Unlock Premium Tools</h3>
                  <p className="mb-6 text-slate-500">
                    Get free access to our college cutoff predictors, study planners, and scholarship databases.
                  </p>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <PulseGlow color="rgba(79, 70, 229, 0.1)" activeOnHover>
                      <div className="flex items-center gap-3 px-4 py-3 transition bg-slate-50 border border-slate-200 rounded-xl focus-within:border-indigo-400 focus-within:ring-2 focus-within:ring-indigo-100 focus-within:bg-white">
                        <Mail size={18} className="text-slate-400" />
                        <input
                          type="email"
                          placeholder="Email Address"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full text-sm bg-transparent outline-none"
                        />
                      </div>
                    </PulseGlow>

                    <PulseGlow color="rgba(79, 70, 229, 0.1)" activeOnHover>
                      <div className="flex items-center gap-3 px-4 py-3 transition bg-slate-50 border border-slate-200 rounded-xl focus-within:border-indigo-400 focus-within:ring-2 focus-within:ring-indigo-100 focus-within:bg-white">
                        <Phone size={18} className="text-slate-400" />
                        <input
                          type="tel"
                          placeholder="Phone Number (Optional)"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          className="w-full text-sm bg-transparent outline-none"
                        />
                      </div>
                    </PulseGlow>

                    <div className="relative">
                      <select
                        value={interest}
                        onChange={(e) => setInterest(e.target.value)}
                        className="w-full px-4 py-3 text-sm transition appearance-none bg-slate-50 border border-slate-200 rounded-xl focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 focus:bg-white outline-none"
                      >
                        <option value="">What are you preparing for?</option>
                        <option value="JEE">JEE Main / Advanced</option>
                        <option value="NEET">NEET</option>
                        <option value="CUET">CUET</option>
                        <option value="BITSAT">BITSAT</option>
                        <option value="MHTCET">MHT-CET</option>
                        <option value="Other">Other Exams</option>
                      </select>
                    </div>

                    <button
                      type="submit"
                      disabled={loading || (!email && !phone)}
                      className="flex items-center justify-center w-full gap-2 px-6 py-3.5 mt-2 text-sm font-semibold text-white transition shadow-lg btn-ripple rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:shadow-xl hover:-translate-y-0.5 disabled:opacity-50"
                    >
                      {loading ? (
                        <div className="w-5 h-5 border-2 border-white rounded-full border-t-transparent animate-spin" />
                      ) : (
                        <>
                          Get Free Access <ChevronRight size={18} />
                        </>
                      )}
                    </button>
                  </form>
                  <p className="mt-4 text-xs text-center text-slate-400">
                    We won't spam you. Unsubscribe anytime.
                  </p>
                </>
              ) : (
                <div className="py-8 text-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="flex items-center justify-center w-20 h-20 mx-auto mb-6 bg-emerald-100 text-emerald-500 rounded-full"
                  >
                    <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </motion.div>
                  <h3 className="mb-2 text-2xl font-bold text-slate-800">You're on the list!</h3>
                  <p className="text-slate-500">
                    Thank you! Check out the predictors and dashboards.
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
