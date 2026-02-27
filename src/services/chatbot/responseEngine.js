import { CHATBOT_CONFIG } from "../../lib/chatbotConfig"

function normalizeMessage(message) {
  return message.toLowerCase().replace(/[^a-z\s]/g, " ")
}

function hasKeywords(message, keywords) {
  return keywords.some(keyword => message.includes(keyword))
}

function fallbackResponse() {
  return `Thank you for your question! 😊\n\nFor personalized assistance, contact us at:\n${CHATBOT_CONFIG.supportEmail}\n\nYou can also explore:\n• Find a Mentor\n• Career Assessment\n• Study Materials\n• Academic Timeline`
}

function buildRuleBasedResponse(userMessage) {
  const normalizedMessage = normalizeMessage(userMessage)

  const intentMap = [
    {
      keywords: ["mentor", "find mentor", "book session"],
      response:
        `🎓 Visit the Find a Mentor section to connect with experienced mentors and book sessions.\n\nNeed direct help? ${CHATBOT_CONFIG.supportEmail}`,
    },
    {
      keywords: ["exam", "timeline", "deadline", "registration"],
      response:
        `📅 Check the Academic Timeline page for upcoming exams, registrations, and deadlines.\n\nFor support: ${CHATBOT_CONFIG.supportEmail}`,
    },
    {
      keywords: ["career", "assessment", "stream"],
      response:
        `🎯 Take the Career Assessment to discover suitable career paths and next steps.\n\nNeed guidance? ${CHATBOT_CONFIG.supportEmail}`,
    },
    {
      keywords: ["study", "material", "jee", "neet", "nda", "subject"],
      response:
        `📚 Explore Study Materials for competitive exams and subjects.\n\nQuestions? ${CHATBOT_CONFIG.supportEmail}`,
    },
    {
      keywords: ["college", "admission", "opportunity"],
      response:
        `🏫 Open College Directory to compare institutions, admission types, and important deadlines.\n\nAdmission support: ${CHATBOT_CONFIG.supportEmail}`,
    },
    {
      keywords: ["doubt", "question", "help"],
      response:
        `💬 For quick assistance, use the relevant platform sections or contact our support team at ${CHATBOT_CONFIG.supportEmail}`,
    },
  ]

  const intent = intentMap.find(item => hasKeywords(normalizedMessage, item.keywords))
  return intent?.response || fallbackResponse()
}

async function fetchApiResponse(userMessage) {
  const response = await fetch(CHATBOT_CONFIG.endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message: userMessage }),
  })

  if (!response.ok) {
    throw new Error("Chatbot API request failed")
  }

  const payload = await response.json()
  return payload?.reply || fallbackResponse()
}

export async function getAssistantResponse(userMessage) {
  if (CHATBOT_CONFIG.mode === "api") {
    try {
      return await fetchApiResponse(userMessage)
    } catch {
      return buildRuleBasedResponse(userMessage)
    }
  }

  return buildRuleBasedResponse(userMessage)
}

export function getWelcomeMessage() {
  return `👋 Hello! I'm the MentorBhaiyaaa assistant.\n\n📧 For support, contact:\n${CHATBOT_CONFIG.supportEmail}\n\nExplore:\n• Find a Mentor\n• Career Assessment\n• Academic Timeline\n• Study Materials\n\nHow can I help you today?`
}
