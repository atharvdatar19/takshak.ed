import { CHATBOT_CONFIG } from "../../lib/chatbotConfig"
import { takshakExams, takshakCourses } from "../../data/takshakData"

// Simulated conversational state
let conversationState = {
  step: "initial",
  collectedData: {}
}

const KNOWLEDGE_BASE = {
  greetings: ["hi", "hello", "hey", "start", "namaste"],
  counseling: ["rank", "percentile", "reality", "options", "predict", "predict college", "what can i get"],
  planB: ["drop", "drop year", "join", "roi", "plan b", "worth taking drop"],
  community: ["roommate", "seniors", "connect", "network", "pre", "fresher"],
  marketplace: ["buy", "sell", "books", "material", "modules", "allen", "fiitjee", "second hand"],
  courses: ["bridge", "learn", "python", "skills", "excel", "c++", "course", "upsc", "gate", "jee", "cat", "educator", "educators", "unacademy", "physicswallah"],
  skillMatcher: ["skill", "income", "earn", "business", "career", "freelance", "side hustle", "money", "startup", "self employed", "job"],
  defence: ["nda", "defence", "defense", "cds", "afcat", "ssb", "military", "army", "navy", "air force", "soldier", "officer"],
}

function hasAnyKeyword(message, category) {
  const norm = message.toLowerCase();
  return KNOWLEDGE_BASE[category]?.some(kw => norm.includes(kw));
}

export async function getAssistantResponse(userMessage, messageHistory = []) {
  // Artificial delay to simulate thinking
  await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 500));

  const text = userMessage.toLowerCase();

  // TAKSHAK Specific Intents
  if (userMessage === "gate_info" || text.includes("what is gate")) {
    const gateInfo = takshakExams.find(e => e.id === "gate");
    return {
      content: `**${gateInfo.fullName} (${gateInfo.name})** is a premier examination for Engineering students in India. It tests your comprehensive understanding of undergraduate engineering subjects and is used for admissions into M.Tech programs and PSU recruitments.`,
      quickReplies: [
        { label: "Find GATE Courses", path: "/marketplace" },
        { label: "Check Deadlines", path: "/timeline" }
      ]
    }
  }

  if (userMessage === "compare_exams" || (text.includes("compare") && text.includes("jee") && text.includes("gate"))) {
    return {
      content: "**JEE vs GATE**:\n- **JEE** is an undergraduate entrance exam for B.Tech programs at IITs/NITs, focusing on foundational physics, chemistry, and mathematics.\n- **GATE** is a postgraduate engineering exam focusing on specialized core engineering subjects.\n\nWhile JEE gets you into college, GATE helps you advance to higher education or secure PSU jobs!",
      quickReplies: [
        { label: "Explore Educators", path: "/mentors" },
        { label: "Predict College (JEE)", path: "/rank-reality" }
      ]
    }
  }

  if (userMessage === "upsc_courses" || text.includes("best courses for upsc")) {
    const upscCourses = takshakCourses.filter(c => c.exam === 'UPSC');
    let msg = "Here are the top-rated UPSC courses on our blended Marketplace:\n";
    upscCourses.forEach(c => {
      msg += `- **${c.title}** by ${c.provider} (Rating: ${c.rating} ⭐) [Mode: ${c.mode}]\n`;
    });
    return {
      content: msg,
      quickReplies: [
        { label: "View on Marketplace", path: "/marketplace" },
        { label: "Back to Main Menu", action: "greetings" }
      ]
    }
  }


  // 1. Direct clear intents based on new features
  if (hasAnyKeyword(text, "counseling")) {
    return {
      content: "Looking for realistic college options? Our **Rank-vs-Reality Engine** uses historical JoSAA data to give you Safe, Realistic, and Reach options based on your exact rank.",
      quickReplies: [
        { label: "Go to Counseling Engine", path: "/rank-reality" },
        { label: "How is it calculated?", action: "explain_counseling" }
      ]
    }
  }

  if (hasAnyKeyword(text, "planB")) {
    return {
      content: "Deciding whether to take a drop year? Our **Plan B Analyzer** compares the 5-year financial ROI of joining your current best offer versus taking a drop for a target college.",
      quickReplies: [
        { label: "Analyze Drop vs Join", path: "/plan-b" },
      ]
    }
  }

  if (hasAnyKeyword(text, "community")) {
    return {
      content: "You can find your future roommates, chat with verified seniors, and see your college's official packing list in our **Pre-Freshers Network**.",
      quickReplies: [
        { label: "Find Roommates", path: "/pre-freshers" },
        { label: "Ask Seniors", path: "/pre-freshers" }
      ]
    }
  }

  if (hasAnyKeyword(text, "marketplace")) {
    return {
      content: "Don't pay full price for books! You can buy (or sell) used exam modules directly from verified seniors in your city at steep discounts.",
      quickReplies: [
        { label: "Browse Books Marketplace", path: "/marketplace" },
        { label: "Find Course Educators", path: "/mentors" }
      ]
    }
  }

  if (hasAnyKeyword(text, "courses")) {
    return {
      content: "Looking for competitive exam courses or bridge skills? We consolidate courses from PhysicsWallah, Unacademy, and more!",
      quickReplies: [
        { label: "Browse Marketplace", path: "/marketplace" },
        { label: "Explore Mentors & Educators", path: "/mentors" }
      ]
    }
  }

  if (hasAnyKeyword(text, "skillMatcher")) {
    return {
      content: "Looking for ways to earn? Our **AI Skill Matcher** analyzes your skills and interests to suggest realistic income paths and businesses you can start — from freelancing to startups!",
      quickReplies: [
        { label: "Try AI Skill Matcher", path: "/skill-matcher" },
        { label: "Browse Bridge Courses", path: "/bridge" }
      ]
    }
  }

  if (hasAnyKeyword(text, "defence")) {
    return {
      content: "Want to serve the nation? Our **Defence Exam Command Center** covers NDA, CDS, AFCAT & SSB Interview prep with expert mentors — including an **AIR 371 NDA** holder! First session is **FREE**.",
      quickReplies: [
        { label: "Defence Exam Hub", path: "/defence" },
        { label: "Book 1:1 Session", path: "/sessions" }
      ]
    }
  }

  // 2. Interactive explicit actions (from quick replies)
  if (userMessage === "explain_counseling") {
    return {
      content: "We use the latest JoSAA and CSAB opening-closing ranks across all categories. We map your rank against thousands of branches and calculate a percentage probability of admission based on historical variance.",
      quickReplies: [
        { label: "Try it out", path: "/rank-reality" }
      ]
    }
  }

  // 3. Greeting / Generic Fallback
  if (hasAnyKeyword(text, "greetings")) {
    return {
      content: "Hi there! 👋 I am Medha, your AI mentor. I can help you with discovering courses, comparing educators, predicting colleges, or finding deadlines. What do you need help with?",
      quickReplies: [
        { label: "Predict my colleges", action: "counseling" },
        { label: "What is GATE exam?", action: "gate_info" },
        { label: "Find Courses", action: "courses" },
      ]
    }
  }

  // Default Smart Fallback with context awareness
  return {
    content: `I understand you're asking about "${userMessage}". While I'm still learning about that specific topic, I'm fully equipped to help you discover courses, compare educators, track deadlines, and handle college counseling!`,
    quickReplies: [
      { label: "Explore TAKSHAK Exam Tools", path: "/timeline" },
      { label: "Back to Main Menu", action: "greetings" }
    ]
  }
}

export function getWelcomeMessage() {
  return {
    content: "Hi! I'm **Medha**, TAKSHAK's smart assistant. 🎓\n\nI can help you explore competitive exams, compare top educators, track crucial deadlines, or guide your college counseling.\n\nWhat are you looking for today?",
    quickReplies: [
      { label: "What is GATE exam?", action: "gate_info" },
      { label: "Compare JEE vs GATE", action: "compare_exams" },
      { label: "Find Income Paths", path: "/skill-matcher" },
      { label: "Predict Colleges", action: "predict" }
    ]
  }
}
