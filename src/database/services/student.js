/**
 * student.js — Re-exports from domain services for backwards compatibility.
 * Prefer importing directly from the specific domain service.
 */

export { getCutoffData, getExamBySlug } from './exams'
export { getUserApplications, createApplication, updateApplicationStatus, deleteApplication } from './applications'
export { getScholarships, getUserSavedScholarships, saveScholarship } from './scholarships'
export { getDocumentChecklist, updateDocumentStatus } from './study'
export { logStress, getStressLogs } from './wellness'
export { getForumPosts, createPost, getPostReplies, createReply } from './forum'
export { getUserStudyPlans, createStudyPlan } from './study'
export { getUserBookings, createBooking } from './sessions'

export function predictChances(rank, cutoffs = []) {
  return cutoffs.map(c => {
    const ratio = rank / c.closing_rank
    let chance = 'Low'
    let color = 'rose'
    if (ratio <= 0.7) { chance = 'High'; color = 'emerald' }
    else if (ratio <= 1.0) { chance = 'Medium'; color = 'amber' }
    return { ...c, chance, color }
  })
}

export const DEFAULT_DOCUMENTS = [
  'Aadhaar Card',
  '10th Marksheet',
  '12th Marksheet',
  'Transfer Certificate',
  'Migration Certificate',
  'Category Certificate (if applicable)',
  'Income Certificate',
  'Domicile Certificate',
  'Passport Size Photos (6)',
  'Character Certificate',
  'Medical Fitness Certificate',
  'Entrance Exam Scorecard',
]

export function getDefaultDocuments() {
  return DEFAULT_DOCUMENTS
}
