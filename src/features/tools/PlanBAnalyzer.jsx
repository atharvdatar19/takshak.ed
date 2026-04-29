import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Info, GitCompare, ChevronRight, Calculator, AlertTriangle, ArrowRight, ShieldCheck, Banknote, Target, TrendingUp, HelpCircle } from "lucide-react"

export default function PlanBAnalyzer() {
    const [currentCollege, setCurrentCollege] = useState("Private Univ X - CSE")
    const [targetCollege, setTargetCollege] = useState("Tier 1 NIT - CSE")

    const [feesJoin, setFeesJoin] = useState(1600000)
    const [avgPlacementJoin, setAvgPlacementJoin] = useState(650000)

    const [coachingCost, setCoachingCost] = useState(150000)
    const [feesTarget, setFeesTarget] = useState(800000)
    const [avgPlacementTarget, setAvgPlacementTarget] = useState(1600000)
    const [successProbability, setSuccessProbability] = useState(40) // %

    const [hasCalculated, setHasCalculated] = useState(false)

    const handleCalculate = (e) => {
        e.preventDefault()
        setHasCalculated(true)
    }

    // -- Magic Logic --
    // ROI = (AvgPlacement * 5 years) - Total Cost
    const costJoin = feesJoin
    const roiJoin = (avgPlacementJoin * 5) - costJoin

    // Drop Scenario (assumed 1 year drop)
    const costDropSuccess = feesTarget + coachingCost // Opportunity cost ignored for simplicity to keep numbers friendly
    const roiDropSuccess = (avgPlacementTarget * 4) - costDropSuccess // Only 4 years of earnings compared to 5 to account for 1 year loss

    // Drop Scenario Failure (assumes they go back to similar joining college)
    const roiDropFailure = (avgPlacementJoin * 4) - (feesJoin + coachingCost)

    const riskAdjustedDropRoi = (roiDropSuccess * (successProbability / 100)) + (roiDropFailure * ((100 - successProbability) / 100))

    const isDropFavorable = riskAdjustedDropRoi > roiJoin
    const difference = Math.abs(riskAdjustedDropRoi - roiJoin)

    return (
        <div className="mx-auto max-w-6xl animate-fade-in space-y-6 md:space-y-8">
            <div className="flex flex-col gap-2 md:flex-row md:items-end justify-between">
                <div>
                    <h1 className="text-3xl font-extrabold text-slate-900 md:text-4xl flex items-center gap-3">
                        <GitCompare className="text-indigo-600" size={32} />
                        Plan B Analyzer
                    </h1>
                    <p className="mt-2 text-slate-500 max-w-2xl">
                        A purely data-driven model to help you decide whether to <strong className="text-slate-700">Join Now</strong> or <strong className="text-slate-700">Take a Drop Year</strong> based on risk-adjusted 5-year ROI.
                    </p>
                </div>
            </div>

            <div className="grid lg:grid-cols-12 gap-6">

                {/* ── INPUT FORM ── */}
                <div className="lg:col-span-4 space-y-6">
                    <form onSubmit={handleCalculate} className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200">
                        <div className="space-y-6">

                            {/* Section 1: Join Now */}
                            <div>
                                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-4 flex items-center gap-2">
                                    <ShieldCheck size={16} /> Scenario: Join Now
                                </h3>
                                <div className="space-y-4">
                                    <div>
                                        <label className="text-xs font-semibold text-slate-600 mb-1 block">Best Current Option</label>
                                        <input type="text" value={currentCollege} onChange={e => setCurrentCollege(e.target.value)} className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 outline-none" />
                                    </div>
                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <label className="text-xs font-semibold text-slate-600 mb-1 block">Total Fees (₹)</label>
                                            <input type="number" value={feesJoin} onChange={e => setFeesJoin(Number(e.target.value))} className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 outline-none" />
                                        </div>
                                        <div>
                                            <label className="text-xs font-semibold text-slate-600 mb-1 block">Avg Package (₹)</label>
                                            <input type="number" value={avgPlacementJoin} onChange={e => setAvgPlacementJoin(Number(e.target.value))} className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 outline-none" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="h-px bg-slate-100" />

                            {/* Section 2: Drop Year */}
                            <div>
                                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-4 flex items-center gap-2">
                                    <Target size={16} /> Scenario: Drop Year
                                </h3>
                                <div className="space-y-4">
                                    <div>
                                        <label className="text-xs font-semibold text-slate-600 mb-1 block">Target College</label>
                                        <input type="text" value={targetCollege} onChange={e => setTargetCollege(e.target.value)} className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 outline-none" />
                                    </div>
                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <label className="text-xs font-semibold text-slate-600 mb-1 block">Target Fees (₹)</label>
                                            <input type="number" value={feesTarget} onChange={e => setFeesTarget(Number(e.target.value))} className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 outline-none" />
                                        </div>
                                        <div>
                                            <label className="text-xs font-semibold text-slate-600 mb-1 block">Target Avg Pkg (₹)</label>
                                            <input type="number" value={avgPlacementTarget} onChange={e => setAvgPlacementTarget(Number(e.target.value))} className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 outline-none" />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <label className="text-xs font-semibold text-slate-600 mb-1 block">Drop Cost (Coaching)</label>
                                            <input type="number" value={coachingCost} onChange={e => setCoachingCost(Number(e.target.value))} className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 outline-none" />
                                        </div>
                                        <div>
                                            <label className="text-xs font-semibold text-slate-600 mb-1 block">Drop Success Prob %</label>
                                            <input type="number" value={successProbability} onChange={e => setSuccessProbability(Number(e.target.value))} className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 outline-none" max="100" min="0" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="w-full rounded-xl bg-slate-900 px-4 py-3.5 font-bold text-white shadow-xl shadow-slate-200 transition hover:bg-slate-800 flex justify-center items-center gap-2"
                            >
                                <Calculator size={18} /> Analyze 5-Year Impact
                            </button>
                        </div>
                    </form>
                </div>

                {/* ── ANALYSIS DASHBOARD ── */}
                <div className="lg:col-span-8">
                    {!hasCalculated ? (
                        <div className="h-full bg-slate-50 border-2 border-dashed border-slate-200 flex flex-col items-center justify-center rounded-3xl p-12 text-center text-slate-400">
                            <GitCompare size={64} className="mb-6 opacity-20" />
                            <h3 className="text-xl font-bold text-slate-500 mb-2">Configure scenarios to analyze</h3>
                            <p className="max-w-md mx-auto text-sm">Provide details about your current college offer and your expectations for a drop year to calculate risk-adjusted returns.</p>
                        </div>
                    ) : (
                        <AnimatePresence mode="wait">
                            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-6">

                                {/* The Verdict */}
                                <div className={`relative overflow-hidden rounded-3xl p-8 shadow-lg border ${isDropFavorable ? 'bg-gradient-to-br from-indigo-900 to-purple-900 border-indigo-700' : 'bg-gradient-to-br from-emerald-800 to-teal-900 border-emerald-700'} text-white`}>
                                    <div className="absolute right-0 top-0 w-64 h-64 bg-white/5 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2" />
                                    <p className="text-sm font-semibold uppercase tracking-wider text-white/50 mb-2">AI Verdict</p>
                                    <h2 className="text-4xl md:text-5xl font-extrabold mb-4 flex items-center gap-4">
                                        {isDropFavorable ? "Take the Drop 🚀" : "Join Now ✅"}
                                    </h2>
                                    <p className="text-lg text-white/80 max-w-xl">
                                        Based on your inputs, {isDropFavorable ? 'taking a drop year yields a better risk-adjusted return over 5 years.' : 'joining now and avoiding opportunity + coaching costs is the mathematically safer choice.'}
                                        <br /><br />
                                        <span className="inline-block bg-white/10 px-3 py-1 rounded-lg text-sm font-mono border border-white/20">
                                            Difference: ₹{(difference / 100000).toFixed(2)}L
                                        </span>
                                    </p>
                                </div>

                                {/* Comparison Stats */}
                                <div className="grid md:grid-cols-2 gap-6">
                                    {/* Join Card */}
                                    <div className={`p-6 rounded-2xl border-2 transition-colors ${!isDropFavorable ? 'bg-emerald-50 border-emerald-200' : 'bg-white border-slate-200'}`}>
                                        <h3 className="text-lg font-bold text-slate-900 mb-1 flex items-center justify-between">
                                            Join {currentCollege.split("-")[0]}
                                            {!isDropFavorable && <span className="bg-emerald-500 text-white text-xs px-2 py-0.5 rounded uppercase tracking-wider font-bold">Winner</span>}
                                        </h3>
                                        <p className="text-sm text-slate-500 mb-6">Guaranteed path</p>

                                        <div className="space-y-4">
                                            <div className="flex justify-between items-end border-b border-slate-200/50 pb-2">
                                                <div className="text-sm text-slate-500">5-Year Earnings</div>
                                                <div className="font-mono font-semibold text-slate-900">₹{((avgPlacementJoin * 5) / 100000).toFixed(1)}L</div>
                                            </div>
                                            <div className="flex justify-between items-end border-b border-slate-200/50 pb-2">
                                                <div className="text-sm text-slate-500">Total Costs</div>
                                                <div className="font-mono font-semibold text-red-600">- ₹{(costJoin / 100000).toFixed(1)}L</div>
                                            </div>
                                            <div className="flex justify-between items-end pt-2">
                                                <div className="text-sm font-bold text-slate-900">Net 5-Year ROI</div>
                                                <div className="font-mono font-black text-xl text-emerald-600">₹{(roiJoin / 100000).toFixed(1)}L</div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Drop Card */}
                                    <div className={`p-6 rounded-2xl border-2 transition-colors ${isDropFavorable ? 'bg-indigo-50 border-indigo-200' : 'bg-white border-slate-200'}`}>
                                        <h3 className="text-lg font-bold text-slate-900 mb-1 flex items-center justify-between">
                                            Aim for {targetCollege.split("-")[0]}
                                            {isDropFavorable && <span className="bg-indigo-500 text-white text-xs px-2 py-0.5 rounded uppercase tracking-wider font-bold">Winner</span>}
                                        </h3>
                                        <p className="text-sm text-slate-500 mb-6">High risk, high reward ({successProbability}% success prob)</p>

                                        <div className="space-y-4">
                                            <div className="flex justify-between items-end border-b border-slate-200/50 pb-2">
                                                <div className="text-sm text-slate-500">Target 4-Yr Earnings*</div>
                                                <div className="font-mono font-semibold text-slate-900">₹{((avgPlacementTarget * 4) / 100000).toFixed(1)}L</div>
                                            </div>
                                            <div className="flex justify-between items-end border-b border-slate-200/50 pb-2">
                                                <div className="text-sm text-slate-500">Drop + Target Costs</div>
                                                <div className="font-mono font-semibold text-red-600">- ₹{(costDropSuccess / 100000).toFixed(1)}L</div>
                                            </div>
                                            <div className="flex justify-between items-end pt-2">
                                                <div className="text-sm font-bold text-slate-900">Risk-Adj ROI</div>
                                                <div className="font-mono font-black text-xl text-indigo-600">₹{(riskAdjustedDropRoi / 100000).toFixed(1)}L</div>
                                            </div>
                                        </div>
                                        <div className="mt-4 pt-4 border-t border-slate-200">
                                            <p className="text-[14px] text-slate-400 flex items-start gap-1">
                                                <Info size={12} className="shrink-0 mt-0.5" />
                                                *Calculated over 4 working years instead of 5 to account for the gap year, ensuring true apples-to-apples comparison. Risk-adjusted ROI factors in the {(100 - successProbability)}% chance of failure returning to current state.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </AnimatePresence>
                    )}
                </div>
            </div>
        </div>
    )
}
