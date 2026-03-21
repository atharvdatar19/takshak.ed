import { useEffect, useRef, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { Bot, MessageSquare, Send, User, X, Sparkles, ChevronRight } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { getAssistantResponse, getWelcomeMessage } from "../../services/chatbot/responseEngine"

export default function ChatbotAssistant() {
  const [isOpen, setIsOpen] = useState(false)
  const [input, setInput] = useState("")
  const [isResponding, setIsResponding] = useState(false)
  const [messages, setMessages] = useState([{ role: "assistant", ...getWelcomeMessage() }])
  const navigate = useNavigate()

  const widgetRef = useRef(null)
  const messagesEndRef = useRef(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, isOpen, isResponding])

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

  async function handleSend(overrideText = null, overrideAction = null) {
    const userMessage = overrideText || input.trim()
    if (!userMessage && !overrideAction) return
    if (isResponding) return

    setInput("")

    // If it's pure logic action without text, we might not show it as user message, but usually we do
    if (userMessage) {
      setMessages(prev => [...prev, { role: "user", content: userMessage }])
    }

    setIsResponding(true)

    // Send the actual text or the action key to the engine
    const query = overrideAction || userMessage
    const response = await getAssistantResponse(query, messages)

    setMessages(prev => [...prev, { role: "assistant", ...response }])
    setIsResponding(false)
  }

  function handleInputKeyDown(event) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault()
      handleSend()
    }
  }

  const handleQuickReply = (reply) => {
    if (reply.path) {
      navigate(reply.path)
      setIsOpen(false)
    } else if (reply.action) {
      handleSend(reply.label, reply.action)
    } else {
      handleSend(reply.label)
    }
  }

  // Simple markdown bold parser for chat
  const renderMessageContent = (text) => {
    if (!text) return null;
    const parts = text.split(/(\*\*.*?\*\*|\*.*?\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={i} className="font-bold text-slate-900">{part.slice(2, -2)}</strong>
      }
      if (part.startsWith('*') && part.endsWith('*')) {
        return <em key={i} className="italic text-slate-800">{part.slice(1, -1)}</em>
      }
      return <span key={i}>{part}</span>
    });
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
            className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-xl shadow-indigo-200 transition hover:shadow-2xl hover:scale-105 active:scale-95 group relative"
          >
            <Sparkles size={16} className="absolute top-2 right-2 text-yellow-300 opacity-0 group-hover:opacity-100 transition-opacity" />
            <MessageSquare size={24} />
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.section
            role="dialog"
            aria-label="Medha - TAKSHAK assistant"
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.96 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="w-[calc(100vw-2rem)] max-w-sm sm:w-96 overflow-hidden rounded-[32px] glass-panel shadow-2xl flex flex-col h-[600px] max-h-[85vh] reveal-up"
          >
            <header className="flex items-center justify-between bg-gradient-to-r from-slate-900 to-indigo-950 px-5 py-4 text-white shrink-0">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 shadow-inner">
                    <Bot size={20} className="text-white" />
                  </span>
                  <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-emerald-400 border-2 border-indigo-950"></span>
                </div>
                <div>
                  <p className="text-sm font-bold tracking-wide flex items-center gap-1.5">
                    Medha AI <Sparkles size={12} className="text-yellow-400" />
                  </p>
                  <p className="text-xs text-indigo-200">Online & ready to help</p>
                </div>
              </div>
              <button
                type="button"
                aria-label="Close chatbot assistant"
                onClick={() => setIsOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20 active:scale-95"
              >
                <X size={16} />
              </button>
            </header>

            <div className="flex-1 overflow-y-auto bg-slate-50/30 p-5 scrollbar-thin">
              <div className="space-y-5">
                {messages.map((message, index) => (
                  <div key={`${message.role}-${index}`} className="space-y-3">
                    <div className={`flex gap-3 ${message.role === "user" ? "flex-row-reverse" : ""}`}>
                      <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${message.role === "user" ? "bg-indigo-600 shadow-md" : "bg-gradient-to-br from-indigo-100 to-purple-100 border border-indigo-200 shadow-sm"}`}>
                        {message.role === "user" ? <User size={14} className="text-white" /> : <Bot size={14} className="text-indigo-600" />}
                      </div>
                      <div
                        className={`max-w-[80%] whitespace-pre-wrap rounded-2xl px-4 py-2.5 text-sm leading-relaxed shadow-sm ${message.role === "user"
                          ? "bg-indigo-600 text-white rounded-tr-sm"
                          : "border border-slate-200 bg-white text-slate-600 rounded-tl-sm"
                          }`}
                      >
                        {message.role === "user" ? message.content : renderMessageContent(message.content)}
                      </div>
                    </div>

                    {/* Render Quick Replies if this is the last message and from assistant */}
                    {message.role === "assistant" && message.quickReplies && index === messages.length - 1 && (
                      <div className="flex flex-wrap gap-2 pl-11 pt-1">
                        {message.quickReplies.map((reply, i) => (
                          <button
                            key={i}
                            onClick={() => handleQuickReply(reply)}
                            className="text-xs font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 px-3 py-1.5 rounded-full transition-colors flex items-center gap-1 active:scale-95"
                          >
                            {reply.label} {reply.path && <ChevronRight size={12} />}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}

                {isResponding && (
                  <div className="flex gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 border border-indigo-200">
                      <Bot size={14} className="text-indigo-600" />
                    </div>
                    <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm flex items-center gap-1">
                      <motion.span animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1.4 }} className="h-1.5 w-1.5 bg-slate-400 rounded-full" />
                      <motion.span animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1.4, delay: 0.2 }} className="h-1.5 w-1.5 bg-slate-400 rounded-full" />
                      <motion.span animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1.4, delay: 0.4 }} className="h-1.5 w-1.5 bg-slate-400 rounded-full" />
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </div>

            <footer className="shrink-0 border-t border-slate-200/50 bg-white/40 backdrop-blur-md p-4">
              <div className="flex items-end gap-2 bg-slate-50 border border-slate-200 rounded-2xl p-1.5 focus-within:border-indigo-400 focus-within:bg-white transition-colors shadow-sm">
                <textarea
                  aria-label="Type your message"
                  value={input}
                  onChange={event => setInput(event.target.value)}
                  onKeyDown={handleInputKeyDown}
                  placeholder="Ask Medha anything..."
                  className="w-full max-h-32 min-h-[44px] resize-none bg-transparent px-3 py-2.5 text-sm text-slate-800 outline-none placeholder:text-slate-400 scrollbar-hide"
                  rows={1}
                />
                <button
                  type="button"
                  aria-label="Send message"
                  onClick={() => handleSend()}
                  disabled={!input.trim() || isResponding}
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-600 text-white transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-500 active:scale-95"
                >
                  <Send size={16} />
                </button>
              </div>
              <p className="mt-3 text-center text-[10px] uppercase tracking-wider font-bold text-slate-400">
                AI can make mistakes. Verify critical info.
              </p>
            </footer>
          </motion.section>
        )}
      </AnimatePresence>
    </div>
  )
}
