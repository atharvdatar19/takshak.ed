import { useEffect, useRef, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { Bot, MessageSquare, Send, User, X } from "lucide-react"
import { CHATBOT_CONFIG } from "../../lib/chatbotConfig"
import { getAssistantResponse, getWelcomeMessage } from "../../services/chatbot/responseEngine"

export default function ChatbotAssistant() {
  const [isOpen, setIsOpen] = useState(false)
  const [input, setInput] = useState("")
  const [isResponding, setIsResponding] = useState(false)
  const [messages, setMessages] = useState([{ role: "assistant", content: getWelcomeMessage() }])

  const widgetRef = useRef(null)
  const messagesEndRef = useRef(null)
  const responseTimerRef = useRef(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, isOpen])

  useEffect(() => {
    function handleOutsideClick(event) {
      if (!isOpen || !widgetRef.current) return
      if (!widgetRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    function handleEscape(event) {
      if (event.key === "Escape") {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleOutsideClick)
    document.addEventListener("keydown", handleEscape)

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick)
      document.removeEventListener("keydown", handleEscape)
    }
  }, [isOpen])

  useEffect(() => {
    return () => {
      if (responseTimerRef.current) {
        clearTimeout(responseTimerRef.current)
      }
    }
  }, [])

  async function handleSend() {
    const userMessage = input.trim()
    if (!userMessage || isResponding) return

    setInput("")
    setMessages(previous => [...previous, { role: "user", content: userMessage }])
    setIsResponding(true)

    responseTimerRef.current = setTimeout(async () => {
      const response = await getAssistantResponse(userMessage)
      setMessages(previous => [...previous, { role: "assistant", content: response }])
      setIsResponding(false)
    }, 250)
  }

  function handleInputKeyDown(event) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault()
      handleSend()
    }
  }

  return (
    <div ref={widgetRef} className="fixed bottom-4 right-4 z-50 sm:bottom-6 sm:right-6">
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            type="button"
            aria-label="Open chatbot assistant"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={() => setIsOpen(true)}
            className="flex h-14 w-14 items-center justify-center rounded-full bg-indigo-600 text-white shadow-xl transition hover:bg-indigo-500"
          >
            <MessageSquare size={24} />
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.section
            role="dialog"
            aria-label="MentorBhaiyaaa assistant"
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.96 }}
            transition={{ duration: 0.2 }}
            className="w-[calc(100vw-2rem)] max-w-sm overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl"
          >
            <header className="flex items-center justify-between bg-slate-900 px-4 py-3 text-white">
              <div className="flex items-center gap-3">
                <span className="rounded-full bg-slate-700 p-2">
                  <Bot size={18} />
                </span>
                <div>
                  <p className="text-sm font-semibold">MentorBhaiyaaa Assistant</p>
                  <p className="text-xs text-slate-300">Online support</p>
                </div>
              </div>
              <button
                type="button"
                aria-label="Close chatbot assistant"
                onClick={() => setIsOpen(false)}
                className="rounded-md p-1 text-slate-200 transition hover:bg-slate-700"
              >
                <X size={18} />
              </button>
            </header>

            <div className="h-80 overflow-y-auto bg-slate-50 p-4">
              <div className="space-y-4">
                {messages.map((message, index) => (
                  <div
                    key={`${message.role}-${index}`}
                    className={`flex gap-2 ${message.role === "user" ? "flex-row-reverse" : ""}`}
                  >
                    <span
                      className={`mt-1 rounded-full p-1.5 ${
                        message.role === "user" ? "bg-indigo-600 text-white" : "bg-slate-200 text-slate-700"
                      }`}
                    >
                      {message.role === "user" ? <User size={14} /> : <Bot size={14} />}
                    </span>
                    <p
                      className={`max-w-[80%] whitespace-pre-wrap rounded-2xl px-3 py-2 text-sm ${
                        message.role === "user"
                          ? "bg-indigo-600 text-white"
                          : "border border-slate-200 bg-white text-slate-700"
                      }`}
                    >
                      {message.content}
                    </p>
                  </div>
                ))}

                {isResponding && <p className="text-xs text-slate-500">Assistant is typing...</p>}
                <div ref={messagesEndRef} />
              </div>
            </div>

            <footer className="border-t border-slate-200 bg-white p-3">
              <div className="flex gap-2">
                <input
                  aria-label="Type your message"
                  value={input}
                  onChange={event => setInput(event.target.value)}
                  onKeyDown={handleInputKeyDown}
                  placeholder="Ask about mentors, exams, careers..."
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-800 outline-none focus:border-indigo-500"
                />
                <button
                  type="button"
                  aria-label="Send message"
                  onClick={handleSend}
                  disabled={!input.trim() || isResponding}
                  className="rounded-lg bg-indigo-600 px-3 text-white transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:bg-slate-300"
                >
                  <Send size={16} />
                </button>
              </div>
              <p className="mt-2 text-center text-xs text-slate-500">Support: {CHATBOT_CONFIG.supportEmail}</p>
            </footer>
          </motion.section>
        )}
      </AnimatePresence>
    </div>
  )
}
