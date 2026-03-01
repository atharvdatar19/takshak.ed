import { CHATBOT_CONFIG } from "../../lib/chatbotConfig"

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
  courses: ["bridge", "learn", "python", "skills", "excel", "c++", "course"],
}

function hasAnyKeyword(message, category) {
  const norm = message.toLowerCase();
  return KNOWLEDGE_BASE[category].some(kw => norm.includes(kw));
}

export async function getAssistantResponse(userMessage, messageHistory = []) {
  // Artificial delay to simulate thinking
  await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 500));

  const text = userMessage.toLowerCase();

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
        { label: "Browse Marketplace", path: "/marketplace" },
        { label: "Sell my modules", path: "/marketplace" }
      ]
    }
  }

  if (hasAnyKeyword(text, "courses")) {
    return {
      content: "The 3 months before college are crucial. We offer **Bridge Courses** in Python, C++, Excel, and Communication to get you ready for Day 1.",
      quickReplies: [
        { label: "View Bridge Courses", path: "/bridge" }
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
      content: "Hi there! 👋 I am Medha, your AI mentor. I can help you with predicting colleges, deciding on a drop year, finding roommates, or getting study materials. What do you need help with?",
      quickReplies: [
        { label: "Predict my colleges", action: "counseling" },
        { label: "Drop vs Join?", action: "planB" },
        { label: "Buy/Sell Books", action: "marketplace" },
      ]
    }
  }

  // Default Smart Fallback with context awareness
  return {
    content: `I understand you're asking about "${userMessage}". While I'm still learning about that specific topic, I'm fully equipped to help you with college counseling, financial ROI analysis for drop years, and connecting with seniors!`,
    quickReplies: [
      { label: "Contact Human Support", action: "support" },
      { label: "Back to Main Menu", action: "greetings" }
    ]
  }
}

export function getWelcomeMessage() {
  return {
    content: "Hi! I'm **Medha**, MentorBhaiyaaa's smart assistant. 🎓\n\nI can help you explore our advanced tools like the *Rank-vs-Reality Engine*, *Drop Analyzer*, or directly connect you with the *Senior Marketplace*.\n\nWhat are you looking for today?",
    quickReplies: [
      { label: "Predict Colleges", action: "predict" },
      { label: "Drop Year Analyzer", action: "drop" },
      { label: "Find a Roommate", action: "roommate" },
      { label: "Buy Used Modules", action: "buy" }
    ]
  }
}
