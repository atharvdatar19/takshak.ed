import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { BookOpen, Briefcase, Calendar, ChevronRight, GraduationCap, Target } from 'lucide-react'
import RevealSection from '../motion/RevealSection'

const TABS = ['Overview', 'Eligibility', 'Important Dates', 'Courses']

/**
 * Sticky tab navigation for exam detail pages.
 * Inspired by Edura Image 2, dark-themed for Takshak.
 *
 * @prop {object}   exam           - exam object with all fields
 * @prop {number}   coursesCount   - for "Courses (N)" label
 */
export default function ExamDetailTabs({ exam = {}, coursesCount = 0 }) {
  const [activeTab, setActiveTab] = useState('Overview')

  const tabLabels = TABS.map((t) => (t === 'Courses' ? `Courses (${coursesCount})` : t))

  return (
    <div>
      {/* ── Sticky Tab Bar ── */}
      <div
        style={{
          position: 'sticky',
          top: '64px',
          zIndex: 40,
          background: 'rgba(11,19,38,0.95)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          borderBottom: '1px solid rgba(64,72,93,0.4)',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            padding: '0 4px',
            overflowX: 'auto',
          }}
        >
          {tabLabels.map((label, i) => {
            const key = TABS[i]
            const isActive = activeTab === key
            return (
              <button
                key={key}
                type="button"
                onClick={() => setActiveTab(key)}
                style={{
                  position: 'relative',
                  padding: '14px 20px',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: isActive ? 700 : 500,
                  color: isActive ? '#dee5ff' : '#a3aac4',
                  whiteSpace: 'nowrap',
                  transition: 'color 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  if (!isActive) e.currentTarget.style.color = '#dee5ff'
                }}
                onMouseLeave={(e) => {
                  if (!isActive) e.currentTarget.style.color = '#a3aac4'
                }}
              >
                {label}
                {/* Animated underline indicator */}
                {isActive && (
                  <motion.div
                    layoutId="tab-indicator"
                    style={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      right: 0,
                      height: '2px',
                      background: '#4edea3',
                      borderRadius: '2px 2px 0 0',
                    }}
                    transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                  />
                )}
              </button>
            )
          })}
        </div>
      </div>

      {/* ── Tab Content ── */}
      <div style={{ padding: '24px 0' }}>
        <AnimatePresence mode="wait">
          {activeTab === 'Overview' && (
            <TabPanel key="overview">
              <OverviewContent exam={exam} />
            </TabPanel>
          )}
          {activeTab === 'Eligibility' && (
            <TabPanel key="eligibility">
              <EligibilityContent exam={exam} />
            </TabPanel>
          )}
          {activeTab === 'Important Dates' && (
            <TabPanel key="dates">
              <DatesContent exam={exam} />
            </TabPanel>
          )}
          {activeTab === 'Courses' && (
            <TabPanel key="courses">
              <CoursesContent exam={exam} />
            </TabPanel>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

function TabPanel({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.22, ease: [0.19, 1, 0.22, 1] }}
    >
      {children}
    </motion.div>
  )
}

function SectionCard({ icon: Icon, title, children }) {
  return (
    <div
      style={{
        background: 'rgba(15,25,48,0.6)',
        border: '1px solid rgba(64,72,93,0.4)',
        borderRadius: '16px',
        padding: '24px',
        marginBottom: '16px',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          marginBottom: '16px',
        }}
      >
        <Icon size={20} style={{ color: '#4edea3' }} />
        <h3
          style={{
            fontSize: '16px',
            fontWeight: 700,
            color: '#dee5ff',
            margin: 0,
          }}
        >
          {title}
        </h3>
      </div>
      {children}
    </div>
  )
}

function PillTag({ label }) {
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        padding: '5px 14px',
        borderRadius: '9999px',
        background: 'rgba(78,222,163,0.08)',
        border: '1px solid rgba(78,222,163,0.2)',
        color: '#4edea3',
        fontSize: '13px',
        fontWeight: 600,
        margin: '4px',
      }}
    >
      {label}
    </span>
  )
}

function OverviewContent({ exam }) {
  const careerOutcomes = exam.career_outcomes || [
    'PSU Jobs (ONGC, BHEL, IOCL)',
    'M.Tech in IITs/NITs',
    'Research positions',
    'Private sector R&D',
  ]

  return (
    <RevealSection stagger staggerSpeed="mid" variant="fadeUp">
      <SectionCard icon={BookOpen} title={`About ${exam.name || 'this Exam'}`}>
        <p style={{ fontSize: '15px', color: '#a3aac4', lineHeight: 1.7, margin: 0 }}>
          {exam.description || 'This is a national-level competitive examination for admission to premier institutions across India.'}
        </p>
      </SectionCard>

      <SectionCard icon={Briefcase} title="Career Outcomes">
        <div style={{ display: 'flex', flexWrap: 'wrap', margin: '-4px' }}>
          {careerOutcomes.map((o) => (
            <PillTag key={o} label={o} />
          ))}
        </div>
      </SectionCard>

      <SectionCard icon={Target} title="Exam Pattern">
        <p style={{ fontSize: '15px', color: '#a3aac4', lineHeight: 1.7, margin: 0 }}>
          {exam.exam_pattern || '3 hours, 65 questions (MCQ + NAT), 100 marks total. Negative marking for MCQs only.'}
        </p>
      </SectionCard>
    </RevealSection>
  )
}

function EligibilityContent({ exam }) {
  const criteria = exam.eligibility_criteria || [
    'Indian Nationals, NRIs, OCIs, PIOs, and Foreign Nationals can apply',
    "Bachelor's degree in Engineering/Technology or the final year",
    'No age limit for Indian nationals',
    'Valid score card for 3 years from result declaration',
  ]

  return (
    <RevealSection stagger staggerSpeed="mid" variant="fadeLeft">
      <SectionCard icon={GraduationCap} title="Eligibility Criteria">
        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {criteria.map((c, i) => (
            <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
              <ChevronRight size={16} style={{ color: '#4edea3', flexShrink: 0, marginTop: '3px' }} />
              <span style={{ fontSize: '14px', color: '#a3aac4', lineHeight: 1.6 }}>{c}</span>
            </li>
          ))}
        </ul>
      </SectionCard>
    </RevealSection>
  )
}

function DatesContent({ exam }) {
  const dates = exam.important_dates || [
    { label: 'Notification Released', date: 'September 2025' },
    { label: 'Application Start', date: 'October 2025' },
    { label: 'Application End', date: 'November 2025' },
    { label: 'Admit Card', date: 'January 2026' },
    { label: 'Exam Date', date: 'February 2026' },
    { label: 'Result', date: 'March 2026' },
  ]

  return (
    <RevealSection stagger staggerSpeed="slow" variant="fadeUp">
      <SectionCard icon={Calendar} title="Important Dates">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {dates.map((d, i) => (
            <div
              key={i}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 16px',
                borderRadius: '10px',
                background: 'rgba(20,31,56,0.8)',
                border: '1px solid rgba(64,72,93,0.3)',
              }}
            >
              <span style={{ fontSize: '14px', color: '#dee5ff', fontWeight: 600 }}>{d.label}</span>
              <span
                style={{
                  fontSize: '13px',
                  color: '#4edea3',
                  fontWeight: 700,
                  padding: '3px 12px',
                  borderRadius: '9999px',
                  background: 'rgba(78,222,163,0.08)',
                }}
              >
                {d.date}
              </span>
            </div>
          ))}
        </div>
      </SectionCard>
    </RevealSection>
  )
}

function CoursesContent({ exam }) {
  return (
    <RevealSection variant="scaleIn">
      <SectionCard icon={BookOpen} title="Available Courses">
        <p style={{ fontSize: '14px', color: '#a3aac4' }}>
          No courses listed yet for this exam. Check back soon or explore our{' '}
          <a href="/marketplace" style={{ color: '#4edea3', fontWeight: 600 }}>Study Materials</a>.
        </p>
      </SectionCard>
    </RevealSection>
  )
}
