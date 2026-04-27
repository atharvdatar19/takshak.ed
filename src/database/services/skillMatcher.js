/**
 * skillMatcher.js — AI Skill Matching Engine
 * Scores income paths against user's skills, interests, and preferences.
 */
import supabase, { isDemoMode } from "@database/supabaseClient"
import { INCOME_PATHS, MATCH_WEIGHTS } from "@/data/SkillMatcherData"

/**
 * Core matching algorithm: scores every income path against user inputs.
 * Returns sorted array of paths with match percentage and reasoning.
 */
export function matchIncomePaths(selectedSkills = [], selectedInterests = [], preferences = {}) {
    const {
        maxInvestment = Infinity,
        difficulty = "all",       // "all" | "Beginner" | "Intermediate" | "Advanced"
    } = preferences

    const results = INCOME_PATHS.map(path => {
        let score = 0
        const reasons = []

        // ── 1. Required Skill Match (40%) ──
        const requiredMatched = path.requiredSkills.filter(s => selectedSkills.includes(s))
        const requiredRatio = path.requiredSkills.length > 0
            ? requiredMatched.length / path.requiredSkills.length
            : 0

        if (requiredRatio > 0) {
            score += requiredRatio * MATCH_WEIGHTS.requiredSkillMatch
            if (requiredRatio === 1) {
                reasons.push("You have all the core skills needed")
            } else {
                reasons.push(`You have ${requiredMatched.length}/${path.requiredSkills.length} core skills`)
            }
        }

        // ── 2. Bonus Skill Match (15%) ──
        const bonusMatched = path.bonusSkills.filter(s => selectedSkills.includes(s))
        if (bonusMatched.length > 0) {
            const bonusRatio = bonusMatched.length / path.bonusSkills.length
            score += bonusRatio * MATCH_WEIGHTS.bonusSkillMatch
            reasons.push(`${bonusMatched.length} bonus skills give you an edge`)
        }

        // ── 3. Interest Match (25%) ──
        const interestMatched = path.matchingInterests.filter(i => selectedInterests.includes(i))
        if (interestMatched.length > 0) {
            const interestRatio = interestMatched.length / path.matchingInterests.length
            score += interestRatio * MATCH_WEIGHTS.interestMatch
            reasons.push("Aligns with your interests")
        }

        // ── 4. Difficulty Preference (10%) ──
        if (difficulty === "all" || difficulty === path.difficulty) {
            score += MATCH_WEIGHTS.difficultyPreference
        } else {
            // Partial credit for adjacent difficulty levels
            const levels = ["Beginner", "Intermediate", "Advanced"]
            const prefIdx = levels.indexOf(difficulty)
            const pathIdx = levels.indexOf(path.difficulty)
            if (Math.abs(prefIdx - pathIdx) === 1) {
                score += MATCH_WEIGHTS.difficultyPreference * 0.5
            }
        }

        // ── 5. Budget Fit (10%) ──
        if (maxInvestment >= path.startupCost.max) {
            score += MATCH_WEIGHTS.budgetFit
            reasons.push("Within your budget")
        } else if (maxInvestment >= path.startupCost.min) {
            score += MATCH_WEIGHTS.budgetFit * 0.6
            reasons.push("Partially within budget")
        }

        return {
            ...path,
            matchScore: Math.min(Math.round(score), 100),
            reasons,
        }
    })

    // Filter out zero-score results and sort by score descending
    return results
        .filter(r => r.matchScore > 0)
        .sort((a, b) => b.matchScore - a.matchScore)
}

/**
 * Save user's skill profile to Supabase (or localStorage in demo mode)
 */
export async function saveSkillProfile(userId, profile) {
    if (isDemoMode || !supabase) {
        try {
            localStorage.setItem(`skill_profile_${userId || "demo"}`, JSON.stringify(profile))
        } catch { /* silent */ }
        return profile
    }

    const { data, error } = await supabase
        .from("skill_profiles")
        .upsert({
            user_id: userId,
            skills: profile.skills,
            interests: profile.interests,
            preferences: profile.preferences,
            updated_at: new Date().toISOString(),
        }, { onConflict: "user_id" })
        .select()
        .single()

    if (error) {
        console.warn("Skill profile save error, falling back to localStorage:", error.message)
        try {
            localStorage.setItem(`skill_profile_${userId}`, JSON.stringify(profile))
        } catch { /* silent */ }
        return profile
    }
    return data
}

/**
 * Retrieve saved skill profile
 */
export async function getSavedProfile(userId) {
    if (isDemoMode || !supabase) {
        try {
            const stored = localStorage.getItem(`skill_profile_${userId || "demo"}`)
            return stored ? JSON.parse(stored) : null
        } catch {
            return null
        }
    }

    const { data, error } = await supabase
        .from("skill_profiles")
        .select("*")
        .eq("user_id", userId)
        .single()

    if (error && error.code !== "PGRST116") {
        console.warn("Skill profile fetch error:", error.message)
    }
    return data || null
}
