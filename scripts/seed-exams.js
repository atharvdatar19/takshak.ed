/**
 * seed-exams.js
 * Seed comprehensive Indian national + state exam schedule into Supabase.
 * Run: node scripts/seed-exams.js
 *
 * Dates verified against official sources (NTA, UPSC, IIT, Consortium of NLUs)
 * for the 2025–26 cycle. Update annually before each academic year.
 *
 * CORRECTIONS LOG (vs previous version):
 *  - JEE Main S1: start Jan 21 (was 22), end Jan 29 (was 31), reg_end Nov 27 (was Nov 30)
 *  - JEE Main S2: end Apr 8 (was Apr 13), reg_end Feb 25 (was Mar 4)
 *  - JEE Advanced: reg_end May 4 (was Apr 28)
 *  - GATE 2026: start Feb 7 (was Feb 1), end Feb 15 (was Feb 16), reg_end Oct 7 (was Oct 5)
 *  - NEET UG: reg_end Mar 8 (was Mar 7)
 *  - CLAT 2026: reg_end Nov 7 (was Oct 15)
 *  - AILET 2026: exam Dec 14 (was Dec 7)
 *  - CUET UG: start/exam May 11 (was May 8)
 *  - CUET PG: start/exam Mar 6 (was Mar 15), end Mar 27 (was Mar 28), reg_end Jan 23 (was Jan 31)
 *  - UPSC CSE Prelims: reg_end Feb 24 (was Mar 4)
 *  - UPSC CSE Mains: start/exam Aug 21 (was Sep 18), end Aug 25 (was Sep 27)
 *  - NDA 1 2026: exam Apr 12 (was Apr 19), reg_end Dec 30 2025 (was Mar 4 2026)
 *  - CDS 1 2026: exam Apr 12 (was Feb 8), reg_end Dec 30 2025 (was Dec 17 2025)
 *  - CAPF AC 2026: exam Jul 19 (was Aug 2)
 *  - NIFT 2026: reg_end Jan 16 (was Jan 4)
 */

import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: path.resolve(__dirname, '..', '.env') })

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
)

// ─────────────────────────────────────────────────────────────────────────────
// EXAM DATA — 2025-26 Cycle
// Sources: NTA (jeemain.nta.nic.in, neet.nta.nic.in, nta.ac.in),
//          IIT Roorkee (jeeadv.ac.in), IIT Guwahati (gate2026.iitg.ac.in),
//          UPSC (upsc.gov.in), Consortium of NLUs (consortiumofnlus.ac.in)
// ─────────────────────────────────────────────────────────────────────────────
const EXAMS = [
  // ── ENGINEERING (National) ──────────────────────────────────────────────────
  {
    name: "JEE Main 2026 — Session 1",
    stream: "Engineering",
    category: "Engineering",
    start_date: "2026-01-21",   // Was 2026-01-22 — NTA conducted Jan 21–29
    end_date: "2026-01-29",     // Was 2026-01-31
    exam_date: "2026-01-21",
    registration_end: "2025-11-27", // Was 2025-11-30 — NTA closed Nov 27, 2025
    priority: 1,
    is_national: true,
    slug: "jee-main-2026-s1",
  },
  {
    name: "JEE Main 2026 — Session 2",
    stream: "Engineering",
    category: "Engineering",
    start_date: "2026-04-02",
    end_date: "2026-04-08",     // Was 2026-04-13 — NTA conducted Apr 2–8
    exam_date: "2026-04-02",
    registration_end: "2026-02-25", // Was 2026-03-04 — NTA closed Feb 25, 2026
    priority: 1,
    is_national: true,
    slug: "jee-main-2026-s2",
  },
  {
    name: "JEE Advanced 2026",
    stream: "Engineering",
    category: "Engineering",
    start_date: "2026-05-17",
    end_date: "2026-05-17",
    exam_date: "2026-05-17",
    registration_end: "2026-05-04", // Was 2026-04-28 — IIT Roorkee fee deadline May 4
    priority: 1,
    is_national: true,
    slug: "jee-advanced-2026",
  },
  {
    name: "BITSAT 2026",
    stream: "Engineering",
    category: "Engineering",
    start_date: "2026-05-20",
    end_date: "2026-05-27",
    exam_date: "2026-05-20",
    registration_end: "2026-03-31",
    priority: 2,
    is_national: true,
    slug: "bitsat-2026",
  },
  {
    name: "VITEEE 2026",
    stream: "Engineering",
    category: "Engineering",
    start_date: "2026-04-19",
    end_date: "2026-04-25",
    exam_date: "2026-04-19",
    registration_end: "2026-03-31",
    priority: 2,
    is_national: true,
    slug: "viteee-2026",
  },
  {
    name: "SRMJEEE 2026",
    stream: "Engineering",
    category: "Engineering",
    start_date: "2026-04-16",
    end_date: "2026-04-25",
    exam_date: "2026-04-16",
    registration_end: "2026-03-31",
    priority: 2,
    is_national: true,
    slug: "srmjeee-2026",
  },
  {
    name: "Manipal MET 2026",
    stream: "Engineering",
    category: "Engineering",
    start_date: "2026-04-10",
    end_date: "2026-04-30",
    exam_date: "2026-04-10",
    registration_end: "2026-03-31",
    priority: 3,
    is_national: true,
    slug: "met-manipal-2026",
  },

  // ── ENGINEERING (State) ─────────────────────────────────────────────────────
  {
    name: "MHT-CET 2026 (PCM)",
    stream: "Engineering",
    category: "Engineering",
    start_date: "2026-04-15",
    end_date: "2026-04-30",
    exam_date: "2026-04-15",
    registration_end: "2026-02-28",
    priority: 2,
    is_national: false,
    slug: "mhtcet-2026-pcm",
  },
  {
    name: "AP EAPCET 2026",
    stream: "Engineering",
    category: "Engineering",
    start_date: "2026-05-10",
    end_date: "2026-05-13",
    exam_date: "2026-05-10",
    registration_end: "2026-03-20",
    priority: 2,
    is_national: false,
    slug: "ap-eapcet-2026",
  },
  {
    name: "TS EAPCET 2026",
    stream: "Engineering",
    category: "Engineering",
    start_date: "2026-05-05",
    end_date: "2026-05-08",
    exam_date: "2026-05-05",
    registration_end: "2026-03-15",
    priority: 2,
    is_national: false,
    slug: "ts-eapcet-2026",
  },
  {
    name: "KCET 2026",
    stream: "Engineering",
    category: "Engineering",
    start_date: "2026-04-18",
    end_date: "2026-04-20",
    exam_date: "2026-04-18",
    registration_end: "2026-02-28",
    priority: 2,
    is_national: false,
    slug: "kcet-2026",
  },
  {
    name: "WBJEE 2026",
    stream: "Engineering",
    category: "Engineering",
    start_date: "2026-04-19",
    end_date: "2026-04-19",
    exam_date: "2026-04-19",
    registration_end: "2026-02-15",
    priority: 2,
    is_national: false,
    slug: "wbjee-2026",
  },
  {
    name: "GUJCET 2026",
    stream: "Engineering",
    category: "Engineering",
    start_date: "2026-03-28",
    end_date: "2026-03-28",
    exam_date: "2026-03-28",
    registration_end: "2026-02-15",
    priority: 2,
    is_national: false,
    slug: "gujcet-2026",
  },
  {
    name: "COMEDK UGET 2026",
    stream: "Engineering",
    category: "Engineering",
    start_date: "2026-05-10",
    end_date: "2026-05-10",
    exam_date: "2026-05-10",
    registration_end: "2026-04-10",
    priority: 2,
    is_national: false,
    slug: "comedk-2026",
  },
  {
    name: "Kerala CEE 2026",
    stream: "Engineering",
    category: "Engineering",
    start_date: "2026-04-24",
    end_date: "2026-04-25",
    exam_date: "2026-04-24",
    registration_end: "2026-03-10",
    priority: 2,
    is_national: false,
    slug: "kerala-cee-2026",
  },
  {
    name: "OJEE 2026",
    stream: "Engineering",
    category: "Engineering",
    start_date: "2026-05-03",
    end_date: "2026-05-03",
    exam_date: "2026-05-03",
    registration_end: "2026-03-31",
    priority: 3,
    is_national: false,
    slug: "ojee-2026",
  },
  {
    name: "UPCET 2026",
    stream: "Engineering",
    category: "Engineering",
    start_date: "2026-05-17",
    end_date: "2026-05-17",
    exam_date: "2026-05-17",
    registration_end: "2026-04-05",
    priority: 3,
    is_national: false,
    slug: "upcet-2026",
  },
  {
    name: "GCET 2026 (Goa)",
    stream: "Engineering",
    category: "Engineering",
    start_date: "2026-05-21",
    end_date: "2026-05-22",
    exam_date: "2026-05-21",
    registration_end: "2026-04-15",
    priority: 3,
    is_national: false,
    slug: "gcet-goa-2026",
  },

  // ── ENGINEERING — GATE ──────────────────────────────────────────────────────
  {
    name: "GATE 2026",
    stream: "Engineering",
    category: "Engineering",
    start_date: "2026-02-07",   // Was 2026-02-01 — IIT Guwahati: Feb 7,8,14,15
    end_date: "2026-02-15",     // Was 2026-02-16
    exam_date: "2026-02-07",
    registration_end: "2025-10-07", // Was 2025-10-05 — GOAPS closed Oct 7 (Oct 13 with late fee)
    priority: 1,
    is_national: true,
    slug: "gate-2026",
  },

  // ── MEDICAL (National) ───────────────────────────────────────────────────────
  {
    name: "NEET UG 2026",
    stream: "Medical",
    category: "Medical",
    start_date: "2026-05-03",
    end_date: "2026-05-03",
    exam_date: "2026-05-03",
    registration_end: "2026-03-08", // Was 2026-03-07 — NTA closed Mar 8, 2026
    priority: 1,
    is_national: true,
    slug: "neet-ug-2026",
  },
  {
    name: "NEET PG 2026",
    stream: "Medical",
    category: "Medical",
    start_date: "2026-06-15",
    end_date: "2026-06-15",
    exam_date: "2026-06-15",
    registration_end: "2026-05-10",
    priority: 1,
    is_national: true,
    slug: "neet-pg-2026",
  },
  {
    name: "AIIMS PG 2026 (Jan session)",
    stream: "Medical",
    category: "Medical",
    start_date: "2026-01-18",
    end_date: "2026-01-18",
    exam_date: "2026-01-18",
    registration_end: "2025-11-30",
    priority: 2,
    is_national: true,
    slug: "aiims-pg-2026-jan",
  },
  {
    name: "MHT-CET 2026 (PCB)",
    stream: "Medical",
    category: "Medical",
    start_date: "2026-04-15",
    end_date: "2026-04-30",
    exam_date: "2026-04-15",
    registration_end: "2026-02-28",
    priority: 2,
    is_national: false,
    slug: "mhtcet-2026-pcb",
  },

  // ── LAW ──────────────────────────────────────────────────────────────────────
  {
    name: "CLAT 2026",
    stream: "Law",
    category: "Law",
    start_date: "2025-12-07",
    end_date: "2025-12-07",
    exam_date: "2025-12-07",
    registration_end: "2025-11-07", // Was 2025-10-15 — Consortium extended to Nov 7, 2025
    priority: 1,
    is_national: true,
    slug: "clat-2026",
  },
  {
    name: "AILET 2026",
    stream: "Law",
    category: "Law",
    start_date: "2025-12-14",   // Was 2025-12-07 — NLU Delhi rescheduled to Dec 14 to avoid CLAT clash
    end_date: "2025-12-14",
    exam_date: "2025-12-14",
    registration_end: "2025-10-31",
    priority: 2,
    is_national: true,
    slug: "ailet-2026",
  },
  {
    name: "LSAT India 2026",
    stream: "Law",
    category: "Law",
    start_date: "2026-01-18",
    end_date: "2026-01-18",
    exam_date: "2026-01-18",
    registration_end: "2025-12-15",
    priority: 2,
    is_national: true,
    slug: "lsat-india-2026",
  },
  {
    name: "DU LLB Entrance 2026",
    stream: "Law",
    category: "Law",
    start_date: "2026-06-15",
    end_date: "2026-06-15",
    exam_date: "2026-06-15",
    registration_end: "2026-05-10",
    priority: 3,
    is_national: false,
    slug: "du-llb-2026",
  },

  // ── MANAGEMENT ───────────────────────────────────────────────────────────────
  {
    name: "CAT 2025",
    stream: "Management",
    category: "Management",
    start_date: "2025-11-23",
    end_date: "2025-11-23",
    exam_date: "2025-11-23",
    registration_end: "2025-09-13",
    priority: 1,
    is_national: true,
    slug: "cat-2025",
  },
  {
    name: "XAT 2026",
    stream: "Management",
    category: "Management",
    start_date: "2026-01-05",
    end_date: "2026-01-05",
    exam_date: "2026-01-05",
    registration_end: "2025-11-30",
    priority: 1,
    is_national: true,
    slug: "xat-2026",
  },
  {
    name: "SNAP 2025",
    stream: "Management",
    category: "Management",
    start_date: "2025-12-07",
    end_date: "2025-12-21",
    exam_date: "2025-12-07",
    registration_end: "2025-11-24",
    priority: 2,
    is_national: true,
    slug: "snap-2025",
  },
  {
    name: "NMAT 2025",
    stream: "Management",
    category: "Management",
    start_date: "2025-10-10",
    end_date: "2025-12-19",
    exam_date: "2025-10-10",
    registration_end: "2025-10-03",
    priority: 2,
    is_national: true,
    slug: "nmat-2025",
  },
  {
    name: "IIFT 2026",
    stream: "Management",
    category: "Management",
    start_date: "2025-12-07",
    end_date: "2025-12-07",
    exam_date: "2025-12-07",
    registration_end: "2025-10-28",
    priority: 2,
    is_national: true,
    slug: "iift-2026",
  },
  {
    name: "CMAT 2026",
    stream: "Management",
    category: "Management",
    start_date: "2026-01-25",
    end_date: "2026-01-25",
    exam_date: "2026-01-25",
    registration_end: "2025-12-20",
    priority: 2,
    is_national: true,
    slug: "cmat-2026",
  },
  {
    name: "MAT 2026 (February)",
    stream: "Management",
    category: "Management",
    start_date: "2026-02-01",
    end_date: "2026-02-28",
    exam_date: "2026-02-01",
    registration_end: "2026-01-20",
    priority: 3,
    is_national: true,
    slug: "mat-feb-2026",
  },
  {
    name: "TISSNET 2026",
    stream: "Management",
    category: "Management",
    start_date: "2026-01-10",
    end_date: "2026-01-10",
    exam_date: "2026-01-10",
    registration_end: "2025-11-30",
    priority: 2,
    is_national: true,
    slug: "tissnet-2026",
  },

  // ── CIVIL SERVICES ──────────────────────────────────────────────────────────
  {
    name: "UPSC CSE Prelims 2026",
    stream: "Civil Services",
    category: "Civil Services",
    start_date: "2026-05-24",   // Confirmed: May 24, 2026 (Sunday)
    end_date: "2026-05-24",
    exam_date: "2026-05-24",
    registration_end: "2026-02-24", // Was 2026-03-04 — UPSC closed Feb 24, 2026
    priority: 1,
    is_national: true,
    slug: "upsc-cse-prelims-2026",
  },
  {
    name: "UPSC CSE Mains 2026",
    stream: "Civil Services",
    category: "Civil Services",
    start_date: "2026-08-21",   // Was 2026-09-18 — UPSC calendar: Aug 21 (5 days)
    end_date: "2026-08-25",     // Was 2026-09-27
    exam_date: "2026-08-21",
    registration_end: "2026-09-01", // Mains DAF opens after Prelims result; keeping as placeholder
    priority: 1,
    is_national: true,
    slug: "upsc-cse-mains-2026",
  },
  {
    name: "UPPSC PCS Prelims 2026",
    stream: "Civil Services",
    category: "Civil Services",
    start_date: "2026-02-22",
    end_date: "2026-02-22",
    exam_date: "2026-02-22",
    registration_end: "2026-01-15",
    priority: 2,
    is_national: false,
    slug: "uppsc-pcs-prelims-2026",
  },
  {
    name: "MPSC State Services Prelims 2026",
    stream: "Civil Services",
    category: "Civil Services",
    start_date: "2026-04-12",
    end_date: "2026-04-12",
    exam_date: "2026-04-12",
    registration_end: "2026-02-28",
    priority: 2,
    is_national: false,
    slug: "mpsc-state-2026",
  },
  {
    name: "SSC CGL Tier 1 2025",
    stream: "Civil Services",
    category: "Civil Services",
    start_date: "2025-09-13",
    end_date: "2025-10-30",
    exam_date: "2025-09-13",
    registration_end: "2025-07-24",
    priority: 2,
    is_national: true,
    slug: "ssc-cgl-2025",
  },
  {
    name: "SSC CHSL 2026",
    stream: "Civil Services",
    category: "Civil Services",
    start_date: "2026-06-01",
    end_date: "2026-06-30",
    exam_date: "2026-06-01",
    registration_end: "2026-04-10",
    priority: 2,
    is_national: true,
    slug: "ssc-chsl-2026",
  },
  {
    name: "SSC MTS 2026",
    stream: "Civil Services",
    category: "Civil Services",
    start_date: "2026-07-01",
    end_date: "2026-07-31",
    exam_date: "2026-07-01",
    registration_end: "2026-05-15",
    priority: 3,
    is_national: true,
    slug: "ssc-mts-2026",
  },

  // ── BANKING / FINANCE ────────────────────────────────────────────────────────
  {
    name: "IBPS PO 2025",
    stream: "Banking",
    category: "Banking",
    start_date: "2025-10-04",
    end_date: "2025-10-12",
    exam_date: "2025-10-04",
    registration_end: "2025-08-22",
    priority: 1,
    is_national: true,
    slug: "ibps-po-2025",
  },
  {
    name: "IBPS Clerk 2025",
    stream: "Banking",
    category: "Banking",
    start_date: "2025-12-06",
    end_date: "2025-12-07",
    exam_date: "2025-12-06",
    registration_end: "2025-10-28",
    priority: 2,
    is_national: true,
    slug: "ibps-clerk-2025",
  },
  {
    name: "SBI PO 2026",
    stream: "Banking",
    category: "Banking",
    start_date: "2026-03-01",
    end_date: "2026-03-15",
    exam_date: "2026-03-01",
    registration_end: "2026-01-31",
    priority: 1,
    is_national: true,
    slug: "sbi-po-2026",
  },
  {
    name: "SBI Clerk 2026",
    stream: "Banking",
    category: "Banking",
    start_date: "2026-02-15",
    end_date: "2026-02-28",
    exam_date: "2026-02-15",
    registration_end: "2026-01-15",
    priority: 2,
    is_national: true,
    slug: "sbi-clerk-2026",
  },
  {
    name: "RBI Grade B 2025",
    stream: "Banking",
    category: "Banking",
    start_date: "2025-11-16",
    end_date: "2025-11-16",
    exam_date: "2025-11-16",
    registration_end: "2025-10-07",
    priority: 1,
    is_national: true,
    slug: "rbi-grade-b-2025",
  },
  {
    name: "NABARD Grade A 2026",
    stream: "Banking",
    category: "Banking",
    start_date: "2026-04-05",
    end_date: "2026-04-05",
    exam_date: "2026-04-05",
    registration_end: "2026-03-01",
    priority: 2,
    is_national: true,
    slug: "nabard-grade-a-2026",
  },
  {
    name: "IBPS RRB PO 2025",
    stream: "Banking",
    category: "Banking",
    start_date: "2025-08-03",
    end_date: "2025-08-10",
    exam_date: "2025-08-03",
    registration_end: "2025-07-01",
    priority: 2,
    is_national: true,
    slug: "ibps-rrb-po-2025",
  },

  // ── DEFENCE ──────────────────────────────────────────────────────────────────
  {
    name: "NDA 1 2026",
    stream: "Defence",
    category: "Defence",
    start_date: "2026-04-12",   // Was 2026-04-19 — UPSC confirmed Apr 12, 2026
    end_date: "2026-04-12",
    exam_date: "2026-04-12",
    registration_end: "2025-12-30", // Was 2026-03-04 — UPSC notification Dec 10, closed Dec 30
    priority: 1,
    is_national: true,
    slug: "nda-1-2026",
  },
  {
    name: "NDA 2 2025",
    stream: "Defence",
    category: "Defence",
    start_date: "2025-09-14",
    end_date: "2025-09-14",
    exam_date: "2025-09-14",
    registration_end: "2025-08-06",
    priority: 1,
    is_national: true,
    slug: "nda-2-2025",
  },
  {
    name: "CDS 1 2026",
    stream: "Defence",
    category: "Defence",
    start_date: "2026-04-12",   // Was 2026-02-08 — UPSC confirmed Apr 12, 2026
    end_date: "2026-04-12",
    exam_date: "2026-04-12",
    registration_end: "2025-12-30", // Was 2025-12-17 — UPSC notification Dec 10, closed Dec 30
    priority: 1,
    is_national: true,
    slug: "cds-1-2026",
  },
  {
    name: "CDS 2 2025",
    stream: "Defence",
    category: "Defence",
    start_date: "2025-09-14",
    end_date: "2025-09-14",
    exam_date: "2025-09-14",
    registration_end: "2025-08-06",
    priority: 1,
    is_national: true,
    slug: "cds-2-2025",
  },
  {
    name: "AFCAT 1 2026",
    stream: "Defence",
    category: "Defence",
    start_date: "2026-02-22",
    end_date: "2026-02-23",
    exam_date: "2026-02-22",
    registration_end: "2025-12-30",
    priority: 2,
    is_national: true,
    slug: "afcat-1-2026",
  },
  {
    name: "CAPF AC 2026",
    stream: "Defence",
    category: "Defence",
    start_date: "2026-07-19",   // Was 2026-08-02 — UPSC Calendar 2026: Jul 19
    end_date: "2026-07-19",
    exam_date: "2026-07-19",
    registration_end: "2026-06-10",
    priority: 2,
    is_national: true,
    slug: "capf-ac-2026",
  },

  // ── UNIVERSITY / CENTRAL ─────────────────────────────────────────────────────
  {
    name: "CUET UG 2026",
    stream: "University",
    category: "University",
    start_date: "2026-05-11",   // Was 2026-05-08 — NTA confirmed May 11–31
    end_date: "2026-05-31",     // Was 2026-05-28
    exam_date: "2026-05-11",
    registration_end: "2026-03-22",
    priority: 1,
    is_national: true,
    slug: "cuet-ug-2026",
  },
  {
    name: "CUET PG 2026",
    stream: "University",
    category: "University",
    start_date: "2026-03-06",   // Was 2026-03-15 — NTA conducted Mar 6–27
    end_date: "2026-03-27",     // Was 2026-03-28
    exam_date: "2026-03-06",
    registration_end: "2026-01-23", // Was 2026-01-31 — NTA closed Jan 23, 2026
    priority: 1,
    is_national: true,
    slug: "cuet-pg-2026",
  },
  {
    name: "BHU UET 2026",
    stream: "University",
    category: "University",
    start_date: "2026-05-10",
    end_date: "2026-05-20",
    exam_date: "2026-05-10",
    registration_end: "2026-03-31",
    priority: 2,
    is_national: true,
    slug: "bhu-uet-2026",
  },
  {
    name: "DUET (DU PG Entrance) 2026",
    stream: "University",
    category: "University",
    start_date: "2026-06-01",
    end_date: "2026-06-15",
    exam_date: "2026-06-01",
    registration_end: "2026-04-15",
    priority: 2,
    is_national: false,
    slug: "duet-pg-2026",
  },
  {
    name: "JNUEE 2026",
    stream: "University",
    category: "University",
    start_date: "2026-04-10",
    end_date: "2026-04-10",
    exam_date: "2026-04-10",
    registration_end: "2026-03-01",
    priority: 3,
    is_national: true,
    slug: "jnuee-2026",
  },

  // ── DESIGN ───────────────────────────────────────────────────────────────────
  {
    name: "NIFT Entrance 2026",
    stream: "Design",
    category: "Design",
    start_date: "2026-02-08",
    end_date: "2026-02-08",
    exam_date: "2026-02-08",
    registration_end: "2026-01-16", // Was 2026-01-04 — NTA closed Jan 16 (without late fee)
    priority: 1,
    is_national: true,
    slug: "nift-2026",
  },
  {
    name: "NID DAT 2026 (Prelims)",
    stream: "Design",
    category: "Design",
    start_date: "2026-01-05",
    end_date: "2026-01-05",
    exam_date: "2026-01-05",
    registration_end: "2025-11-30",
    priority: 1,
    is_national: true,
    slug: "nid-dat-2026",
  },
  {
    name: "UCEED 2026",
    stream: "Design",
    category: "Design",
    start_date: "2026-01-18",
    end_date: "2026-01-18",
    exam_date: "2026-01-18",
    registration_end: "2025-11-10",
    priority: 2,
    is_national: true,
    slug: "uceed-2026",
  },
  {
    name: "CEED 2026",
    stream: "Design",
    category: "Design",
    start_date: "2026-01-18",
    end_date: "2026-01-18",
    exam_date: "2026-01-18",
    registration_end: "2025-11-10",
    priority: 2,
    is_national: true,
    slug: "ceed-2026",
  },
  {
    name: "NATA 2026 (Session 1)",
    stream: "Architecture",
    category: "Architecture",
    start_date: "2026-04-05",
    end_date: "2026-04-05",
    exam_date: "2026-04-05",
    registration_end: "2026-03-10",
    priority: 1,
    is_national: true,
    slug: "nata-2026-s1",
  },

  // ── PHARMACY / ALLIED ────────────────────────────────────────────────────────
  {
    name: "GPAT 2026",
    stream: "Pharmacy",
    category: "Medical",
    start_date: "2026-03-08",
    end_date: "2026-03-08",
    exam_date: "2026-03-08",
    registration_end: "2026-01-31",
    priority: 2,
    is_national: true,
    slug: "gpat-2026",
  },
  {
    name: "NCHMCT JEE 2026",
    stream: "Hotel Management",
    category: "Hotel Management",
    start_date: "2026-04-29",
    end_date: "2026-04-29",
    exam_date: "2026-04-29",
    registration_end: "2026-03-31",
    priority: 2,
    is_national: true,
    slug: "nchmct-jee-2026",
  },
]

// ─────────────────────────────────────────────────────────────────────────────

async function main() {
  console.log(`\n🎓 TAKSHAK — Exam Seed Script`)
  console.log(`📅 Seeding ${EXAMS.length} exams into exams_timeline...\n`)

  let inserted = 0
  let updated = 0
  let failed = 0

  for (const exam of EXAMS) {
    const { data, error } = await supabase
      .from('exams_timeline')
      .upsert(exam, { onConflict: 'slug', ignoreDuplicates: false })
      .select()
      .single()

    if (error) {
      console.error(`  ✗ ${exam.name} — ${error.message}`)
      failed++
    } else {
      const isNew = !data?.created_at || Date.now() - new Date(data.created_at).getTime() < 5000
      console.log(`  ✓ ${exam.name}`)
      if (isNew) {
        inserted++
      } else {
        updated++
      }
    }
  }

  console.log(`\n─────────────────────────────────`)
  console.log(`  Inserted : ${inserted}`)
  console.log(`  Updated  : ${updated}`)
  console.log(`  Failed   : ${failed}`)
  console.log(`  Total    : ${EXAMS.length}`)
  console.log(`─────────────────────────────────\n`)

  if (failed > 0) process.exit(1)
}

main().catch(err => { console.error(err); process.exit(1) })
