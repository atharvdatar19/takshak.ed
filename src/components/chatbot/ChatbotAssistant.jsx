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

    if (userMessage) {
      setMessages(prev => [...prev, { role: "user", content: userMessage }])
    }

    setIsResponding(true)

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
        return <strong key={i} className="font-bold text-on-surface">{part.slice(2, -2)}</strong>
      }
      if (part.startsWith('*') && part.endsWith('*')) {
        return <em key={i} className="italic text-on-surface">{part.slice(1, -1)}</em>
      }
      return <span key={i}>{part}</span>
    });
  }

  return (
    <div ref={widgetRef} className="fixed bottom-4 right-4 z-[90] sm:bottom-8 sm:right-8">
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            type="button"
            aria-label="Open chatbot assistant"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            onClick={() => setIsOpen(true)}
            className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-on-primary shadow-[0_0_30px_rgba(255,180,165,0.3)] transition-all duration-400 hover:scale-105 group relative"
          >
            <Sparkles size={14} className="absolute top-2 right-2 text-tertiary opacity-0 group-hover:opacity-100 transition-opacity duration-400" />
            <MessageSquare size={24} />
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.section
            role="dialog"
            aria-label="AI Counselor - TAKSHAK assistant"
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.96 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="w-[calc(100vw-2rem)] max-w-sm sm:w-96 overflow-hidden rounded-xl glass shadow-[0_40px_80px_rgba(29,16,12,0.2)] flex flex-col h-[520px] max-h-[85vh]"
          >
            {/* Header */}
            <header className="flex items-center justify-between bg-surface-container-high px-6 py-4 shrink-0">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-on-primary shadow-[0_0_15px_rgba(255,180,165,0.2)]">
                    <Bot size={20} />
                  </span>
                  <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-tertiary border-2 border-surface-container-high"></span>
                </div>
                <div>
                  <p className="font-headline font-bold italic text-on-surface text-sm flex items-center gap-1.5">
                    AI Counselor <Sparkles size={12} className="text-tertiary" />
                  </p>
                  <p className="text-[10px] font-label uppercase tracking-wider text-on-surface-variant/60">Online & ready</p>
                </div>
              </div>
              <button
                type="button"
                aria-label="Close chatbot assistant"
                onClick={() => setIsOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-full glass text-on-surface-variant hover:text-on-surface hover:bg-surface-bright transition-all duration-400"
              >
                <X size={16} />
              </button>
            </header>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {messages.map((message, index) => (
                <div key={`${message.role}-${index}`} className="space-y-3">
                  <div className={`flex gap-3 ${message.role === "user" ? "flex-row-reverse" : ""}`}>
                    <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                      message.role === "user"
                        ? "bg-primary text-on-primary"
                        : "bg-surface-container text-primary"
                    }`}>
                      {message.role === "user" ? <User size={14} /> : <Bot size={14} />}
                    </div>
                    <div
                      className={`max-w-[85%] whitespace-pre-wrap rounded-lg px-4 py-3 text-sm leading-relaxed ${
                        message.role === "user"
                          ? "bg-primary/20 rounded-br-sm text-on-surface ml-auto"
                          : "bg-surface-container rounded-bl-sm text-on-surface font-light"
                      }`}
                    >
                      {message.role === "user" ? message.content : renderMessageContent(message.content)}
                    </div>
                  </div>

                  {/* Quick Replies */}
                  {message.role === "assistant" && message.quickReplies && index === messages.length - 1 && (
                    <div className="flex flex-wrap gap-2 pl-11 pt-1">
                      {message.quickReplies.map((reply, i) => (
                        <button
                          key={i}
                          onClick={() => handleQuickReply(reply)}
                          className="text-[10px] font-label font-bold uppercase tracking-wider text-primary bg-primary/10 hover:bg-primary/20 px-3 py-1.5 rounded-full transition-all duration-400 flex items-center gap-1"
                        >
                          {reply.label} {reply.path && <ChevronRight size={10} />}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              {isResponding && (
                <div className="flex gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-surface-container text-primary">
                    <Bot size={14} />
                  </div>
                  <div className="bg-surface-container rounded-lg rounded-bl-sm px-4 py-3 flex items-center gap-1.5">
                    <motion.span animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1.4 }} className="h-1.5 w-1.5 bg-on-surface-variant/40 rounded-full" />
                    <motion.span animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1.4, delay: 0.2 }} className="h-1.5 w-1.5 bg-on-surface-variant/40 rounded-full" />
                    <motion.span animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1.4, delay: 0.4 }} className="h-1.5 w-1.5 bg-on-surface-variant/40 rounded-full" />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input bar */}
            <footer className="shrink-0 bg-surface-container-high p-4 border-t border-outline-variant/10">
              <div className="flex items-end gap-3">
                <textarea
                  aria-label="Type your message"
                  value={input}
                  onChange={event => setInput(event.target.value)}
                  onKeyDown={handleInputKeyDown}
                  placeholder="Ask anything..."
                  className="w-full max-h-32 min-h-[44px] resize-none bg-transparent border-0 border-b border-outline-variant/40 rounded-none px-0 py-2.5 text-sm text-on-surface font-light outline-none placeholder:text-on-surface-variant/40 focus:border-primary transition-all duration-400"
                  rows={1}
                />
                <button
                  type="button"
                  aria-label="Send message"
                  onClick={() => handleSend()}
                  disabled={!input.trim() || isResponding}
                  className="btn-primary px-4 py-2.5 text-xs shrink-0 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <Send size={14} />
                </button>
              </div>
              <p className="mt-3 text-center text-[9px] uppercase tracking-wider font-label font-bold text-on-surface-variant/30">
                AI can make mistakes. Verify critical info.
              </p>
            </footer>
          </motion.section>
        )}
      </AnimatePresence>
    </div>
  )
}
