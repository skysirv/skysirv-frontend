"use client"

import { FormEvent, useEffect, useMemo, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"

type HomepageLabLucyModalProps = {
  open: boolean
  initialQuestion: string
  onClose: () => void
}

type LucyModalMessage = {
  id: string
  role: "user" | "lucy"
  text: string
}

function createMessageId() {
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`
}

function buildLucyDemoReply(question: string) {
  const normalized = question.toLowerCase()

  if (
    normalized.includes("boston") ||
    normalized.includes("miami") ||
    normalized.includes("track")
  ) {
    return "I can help you understand route behavior, fare movement, and whether prices look unusually strong. Create a free Skysirv account when you’re ready, and I can monitor that route for you."
  }

  if (
    normalized.includes("tokyo") ||
    normalized.includes("compare") ||
    normalized.includes("flight")
  ) {
    return "I can help compare flight options by price, timing, stops, airline preference, and booking confidence — not just the cheapest fare on the screen."
  }

  if (
    normalized.includes("fare") ||
    normalized.includes("price") ||
    normalized.includes("movement")
  ) {
    return "I watch for meaningful fare movement, not every tiny price change. The goal is to help you understand when a route looks strong, high, stable, or worth waiting on."
  }

  if (
    normalized.includes("remember") ||
    normalized.includes("preference") ||
    normalized.includes("style")
  ) {
    return "Yes — when you’re signed in, I can remember travel preferences like nonstop flights, preferred airlines, family travel style, home airports, and loyalty alliances."
  }

  return "I can help with route tracking, fare timing, flight comparisons, travel preferences, and booking confidence. Ask me like you would ask a personal AI flight attendant."
}

export default function HomepageLabLucyModal({
  open,
  initialQuestion,
  onClose,
}: HomepageLabLucyModalProps) {
  const [input, setInput] = useState("")
  const [messages, setMessages] = useState<LucyModalMessage[]>([])

  const cleanInitialQuestion = useMemo(
    () => initialQuestion.trim(),
    [initialQuestion]
  )

  useEffect(() => {
    if (!open) return

    const originalOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"

    return () => {
      document.body.style.overflow = originalOverflow
    }
  }, [open])

  useEffect(() => {
    if (!open || !cleanInitialQuestion) return

    setInput("")
    setMessages([
      {
        id: createMessageId(),
        role: "user",
        text: cleanInitialQuestion,
      },
      {
        id: createMessageId(),
        role: "lucy",
        text: buildLucyDemoReply(cleanInitialQuestion),
      },
    ])
  }, [open, cleanInitialQuestion])

  function handleAskLucy(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const message = input.trim()

    if (!message) return

    setMessages((current) => [
      ...current,
      {
        id: createMessageId(),
        role: "user",
        text: message,
      },
      {
        id: createMessageId(),
        role: "lucy",
        text: buildLucyDemoReply(message),
      },
    ])

    setInput("")
  }

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="fixed inset-0 z-[120] flex items-center justify-center px-4 py-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <button
            type="button"
            aria-label="Close Lucy preview"
            onClick={onClose}
            className="absolute inset-0 bg-slate-950/35 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 18, scale: 0.98 }}
            transition={{ duration: 0.28, ease: "easeOut" }}
            className="relative flex max-h-[min(720px,calc(100dvh-2rem))] w-full max-w-2xl flex-col overflow-hidden rounded-[2rem] border border-white/70 bg-white shadow-[0_28px_90px_rgba(15,23,42,0.22)]"
          >
            <div className="relative overflow-hidden border-b border-slate-200 bg-gradient-to-br from-sky-50 via-white to-indigo-50 px-5 py-5 sm:px-6">
              <div className="pointer-events-none absolute right-[-70px] top-[-90px] h-52 w-52 rounded-full bg-cyan-200/60 blur-3xl" />
              <div className="pointer-events-none absolute bottom-[-90px] left-[-70px] h-48 w-48 rounded-full bg-indigo-200/50 blur-3xl" />

              <div className="relative flex items-start justify-between gap-4">
                <div className="flex min-w-0 items-center gap-3">
                  <div className="min-w-0">
                    <h2 className="mt-1 text-2xl font-bold tracking-tight text-slate-800">
                      Ask Lucy
                    </h2>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={onClose}
                  className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white/80 text-slate-500 shadow-sm transition hover:bg-white hover:text-slate-950"
                >
                  <span className="text-2xl leading-none">×</span>
                </button>
              </div>

              <p className="relative mt-4 max-w-xl text-sm leading-6 text-slate-700">
                Lucy can answer public travel questions now. Sign in when you
                want her to track routes, save flights, or remember preferences
                for future Skysirv sessions.
              </p>
            </div>

            <div className="flex-1 overflow-y-auto bg-gradient-to-b from-white to-sky-50/45 px-5 py-5 sm:px-6">
              <div className="space-y-4">
                {messages.map((message) =>
                  message.role === "user" ? (
                    <div key={message.id} className="flex justify-end">
                      <div className="max-w-[86%] rounded-2xl rounded-br-md bg-slate-800 px-4 py-3 text-sm leading-6 text-white shadow-sm">
                        {message.text}
                      </div>
                    </div>
                  ) : (
                    <div key={message.id} className="flex justify-start">
                      <div className="max-w-[90%]">
                        <p className="text-sm leading-7 text-slate-700">
                          {message.text}
                        </p>
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>

            <div className="border-t border-slate-200 bg-white px-5 py-4 sm:px-6">
              <form onSubmit={handleAskLucy} className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(event) => setInput(event.target.value)}
                  placeholder="Ask Lucy another travel question..."
                  className="min-h-[48px] min-w-0 flex-1 rounded-full border border-slate-200 bg-slate-50 px-4 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-cyan-300 focus:bg-white focus:ring-4 focus:ring-cyan-100"
                />

                <button
                  type="submit"
                  disabled={!input.trim()}
                  className="inline-flex min-h-[48px] shrink-0 items-center justify-center rounded-full bg-slate-950 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-45"
                >
                  Ask
                </button>
              </form>

              <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                <p className="text-xs leading-5 text-slate-500">
                  Route tracking and saved-flight actions require an account.
                </p>

                <div className="flex gap-2">
                  <a
                    href="/signin"
                    className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
                  >
                    Sign in
                  </a>

                  <a
                    href="/create-account"
                    className="rounded-full bg-cyan-500 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-cyan-600"
                  >
                    Create account
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}