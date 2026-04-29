"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { usePathname } from "next/navigation"
import { AnimatePresence, motion } from "framer-motion"

type VisitorMessage = {
  role: "lucy" | "visitor"
  content: string
}

const quickPrompts = [
  "What is Skysirv?",
  "Which plan should I choose?",
  "What does Lucy do?",
  "How does beta access work?",
  "Is booking available?"
]

function getLucyResponse(input: string) {
  const normalized = input.toLowerCase()

  if (
    normalized.includes("plan") ||
    normalized.includes("pricing") ||
    normalized.includes("free") ||
    normalized.includes("pro") ||
    normalized.includes("business")
  ) {
    return "Skysirv has three intelligence levels: Free Plan includes Limited AI access, Pro Plan includes Standard AI access, and Business Plan includes Advanced AI access. If you want basic guidance, Free is a good start. If you want stronger route intelligence, Pro or Business is where Skysirv really opens up."
  }

  if (
    normalized.includes("booking") ||
    normalized.includes("book") ||
    normalized.includes("checkout")
  ) {
    return "Skysirv is currently developing direct booking, and it will be available soon..."
  }

  if (
    normalized.includes("lucy") ||
    normalized.includes("flight attendant") ||
    normalized.includes("ai ")
  ) {
    return "I’m Lucy, the Skysirv Flight Attendant™. Here on the public site, I can help explain Skysirv, plans, beta access, and how our flight intelligence works. For route-specific intelligence, signed-in users can use Lucy inside their dashboard."
  }

  if (
    normalized.includes("beta") ||
    normalized.includes("access") ||
    normalized.includes("invite")
  ) {
    return "Beta access gives early users a chance to try Skysirv while the platform continues to improve. You can create an account, choose a plan, and start exploring the flight intelligence experience from your dashboard."
  }

  if (
    normalized.includes("track") ||
    normalized.includes("route") ||
    normalized.includes("watchlist") ||
    normalized.includes("flight")
  ) {
    return "Skysirv helps users monitor routes and understand airfare behavior. For full route tracking, saved flights, and dashboard intelligence, you’ll want to sign in and use Lucy from your dashboard."
  }

  if (
    normalized.includes("what is skysirv") ||
    normalized.includes("skysirv")
  ) {
    return "Skysirv is a flight intelligence platform built to help travelers understand airfare timing, pricing behavior, and booking confidence. Instead of showing fares alone, Skysirv adds signal, context, and guidance."
  }

  return "I’m still in visitor-guide mode, so I may not have a perfect answer for that yet. I can help with Skysirv Plans, Beta Access, Account Creation, and Booking Availability. For route-specific flight intelligence, sign in and open your dashboard."
}

export default function VisitorFlightAttendantBubble() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const [input, setInput] = useState("")
  const messagesEndRef = useRef<HTMLDivElement | null>(null)
  const bubbleRef = useRef<HTMLDivElement | null>(null)

  const [messages, setMessages] = useState<VisitorMessage[]>([
    {
      role: "lucy",
      content:
        "Hi, I’m Lucy, your Skysirv Flight Attendant. I can help explain Skysirv, plans, beta access, and how our flight intelligence works. For full route intelligence, sign in and open your dashboard."
    }
  ])

  const shouldHide = useMemo(() => {
    if (!pathname) return false

    return pathname.startsWith("/dashboard")
  }, [pathname])

  useEffect(() => {
    if (!isOpen) return

    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end"
    })
  }, [messages, isOpen])

  useEffect(() => {
    if (!isOpen) return

    const handlePointerDown = (event: PointerEvent) => {
      if (
        bubbleRef.current &&
        !bubbleRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }

    document.addEventListener("pointerdown", handlePointerDown)

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown)
    }
  }, [isOpen])

  if (shouldHide) return null

  const sendMessage = (value?: string) => {
    const messageText = (value ?? input).trim()

    if (!messageText) return

    setMessages((current) => [
      ...current,
      {
        role: "visitor",
        content: messageText
      },
      {
        role: "lucy",
        content: getLucyResponse(messageText)
      }
    ])

    setInput("")
    setIsOpen(true)
  }

  return (
    <div
      ref={bubbleRef}
      className="fixed bottom-24 right-6 z-[90] flex w-[min(calc(100vw-3rem),380px)] flex-col items-end"
    >
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 18, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 18, scale: 0.96 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="mb-4 w-full overflow-hidden rounded-3xl border border-sky-400/20 bg-slate-950/95 shadow-[0_28px_80px_rgba(2,6,23,0.45)] backdrop-blur-xl"
          >
            <div className="border-b border-white/10 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 px-5 py-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-sky-400/15 text-sm">
                      ✦
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-white">Lucy</p>
                      <p className="text-xs text-slate-400">
                        Skysirv Flight Attendant™
                      </p>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="rounded-full border border-white/10 px-2.5 py-1 text-xs text-slate-300 transition hover:border-white/20 hover:text-white"
                  aria-label="Close Lucy"
                >
                  Close
                </button>
              </div>
            </div>

            <div className="max-h-[340px] space-y-3 overflow-y-auto px-5 py-4">
              {messages.map((message, index) => (
                <div
                  key={`${message.role}-${index}`}
                  className={
                    message.role === "lucy"
                      ? "mr-8 rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-3 text-sm leading-relaxed text-slate-200"
                      : "ml-8 rounded-2xl border border-sky-300/20 bg-sky-400/10 px-4 py-3 text-sm leading-relaxed text-sky-50"
                  }
                >
                  {message.content}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            <div className="border-t border-white/10 px-5 py-4">
              <div className="mb-3 flex flex-wrap gap-2">
                {quickPrompts.map((prompt) => (
                  <button
                    key={prompt}
                    type="button"
                    onClick={() => sendMessage(prompt)}
                    className="rounded-full border border-white/10 px-3 py-1.5 text-xs text-slate-300 transition hover:border-sky-300/30 hover:bg-sky-300/10 hover:text-sky-100"
                  >
                    {prompt}
                  </button>
                ))}
              </div>

              <form
                onSubmit={(event) => {
                  event.preventDefault()
                  sendMessage()
                }}
                className="flex gap-2"
              >
                <input
                  value={input}
                  onChange={(event) => setInput(event.target.value)}
                  placeholder="Ask about Skysirv…"
                  className="min-w-0 flex-1 rounded-full border border-white/10 bg-white/[0.06] px-4 py-2.5 text-sm text-white placeholder:text-slate-500 outline-none transition focus:border-sky-300/40"
                />
                <button
                  type="submit"
                  className="rounded-full bg-sky-300 px-4 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-sky-200"
                >
                  Send
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        type="button"
        onClick={() => setIsOpen((current) => !current)}
        initial={{ opacity: 0, y: 16, scale: 0.96 }}
        animate={{
          opacity: 1,
          y: [0, -4, 0],
          scale: 1
        }}
        transition={{
          opacity: { duration: 0.25 },
          scale: { duration: 0.25 },
          y: {
            duration: 3.2,
            repeat: Infinity,
            ease: "easeInOut"
          }
        }}
        whileHover={{ y: -5, scale: 1.02 }}
        whileTap={{ scale: 0.96 }}
        className="group relative flex items-center gap-3 rounded-full border border-sky-300/30 bg-slate-950/95 px-4 py-3 text-sky-100 shadow-[0_18px_48px_rgba(14,165,233,0.28)] backdrop-blur-xl transition hover:border-sky-200/60 hover:bg-slate-900"
        aria-label="Open Lucy, your Skysirv Flight Attendant"
      >
        <span className="absolute -inset-1 rounded-full bg-sky-300/20 blur-xl opacity-60 transition group-hover:opacity-90" />

        <span className="relative flex h-9 w-9 items-center justify-center rounded-full border border-sky-300/30 bg-sky-300/10 text-lg">
          ✈︎
          <span className="absolute -right-0.5 -top-0.5 h-3 w-3 rounded-full border border-slate-950 bg-emerald-300 shadow-[0_0_18px_rgba(110,231,183,0.8)]" />
        </span>

        <span className="relative text-left">
          <span className="block text-sm font-semibold leading-none text-white">
            Ask Lucy
          </span>
          <span className="mt-1 block text-[11px] leading-none text-slate-400">
            AI Flight Attendant
          </span>
        </span>
      </motion.button>
    </div>
  )
}