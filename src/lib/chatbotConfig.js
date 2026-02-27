const fallbackSupportEmail = "mentorbhaiyaaa.notifications@gmail.com"

export const CHATBOT_CONFIG = {
  supportEmail: import.meta.env.VITE_SUPPORT_EMAIL || fallbackSupportEmail,
  mode: import.meta.env.VITE_CHATBOT_MODE || "rule-based",
  endpoint: import.meta.env.VITE_CHATBOT_API_ENDPOINT || "/api/chatbot/respond",
}
