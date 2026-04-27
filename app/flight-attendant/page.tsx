"use client"

import Link from "next/link"
import { useEffect, useRef, useState } from "react"
import type { FormEvent, MutableRefObject } from "react"
import { motion } from "framer-motion"
import AuthModal from "@/components/auth/AuthModal"
import AuthPanel from "@/components/auth/AuthPanel"
import { getAuthToken } from "@/utils/auth-storage"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

type FlightAttendantMessage = {
  id: string
  role: "assistant" | "user"
  label: string
  text: string
}

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ")
}

function createMessageId() {
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`
}

const initialMessages: FlightAttendantMessage[] = [
  {
    id: "welcome-1",
    role: "assistant",
    label: "Skysirv Flight Attendant™",
    text:
      "Hi, I’m Lucy, your Skysirv Flight Attendant. Ask me about airfare timing, route behavior, fare signals, or how Skysirv helps you make smarter booking decisions.",
  },
]

export default function FlightAttendantPage() {
  const [messages, setMessages] = useState<FlightAttendantMessage[]>(initialMessages)
  const [chatInput, setChatInput] = useState("")
  const [chatLoading, setChatLoading] = useState(false)
  const [assistantTyping, setAssistantTyping] = useState(false)
  const [authRequired, setAuthRequired] = useState(false)
  const [authModalOpen, setAuthModalOpen] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const originalBackground = document.body.style.background
    const originalBackgroundColor = document.body.style.backgroundColor

    document.body.style.background =
      "linear-gradient(to bottom, rgb(2 6 23), rgb(2 6 23), rgb(15 23 42))"
    document.body.style.backgroundColor = "rgb(2 6 23)"

    return () => {
      document.body.style.background = originalBackground
      document.body.style.backgroundColor = originalBackgroundColor
    }
  }, [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" })
  }, [messages, chatLoading])

  async function typeAssistantReply(messageId: string, fullText: string) {
    setAssistantTyping(true)

    const chunks = fullText.split(/(\s+)/)

    await new Promise<void>((resolve) => {
      let index = 0

      const timer = window.setInterval(() => {
        index += 1

        setMessages((prev) =>
          prev.map((message) =>
            message.id === messageId
              ? {
                ...message,
                text: chunks.slice(0, index).join(""),
              }
              : message
          )
        )

        if (index >= chunks.length) {
          window.clearInterval(timer)
          resolve()
        }
      }, 22)
    })

    setAssistantTyping(false)
  }

  async function handleSendFlightAttendantMessage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const message = chatInput.trim()

    if (!message || chatLoading || assistantTyping) return

    const token = getAuthToken()

    const userMessage: FlightAttendantMessage = {
      id: createMessageId(),
      role: "user",
      label: "Traveler",
      text: message,
    }

    setMessages((prev) => [...prev, userMessage])
    setChatInput("")
    setAuthRequired(false)

    if (!token) {
      setAuthRequired(true)

      setMessages((prev) => [
        ...prev,
        {
          id: createMessageId(),
          role: "assistant",
          label: "Skysirv Flight Attendant™",
          text:
            "Please sign in to use the live Flight Attendant. This keeps Skysirv intelligence secure and allows future answers to connect with your routes, watchlist, and travel history.",
        },
      ])

      return
    }

    if (!API_BASE_URL) {
      setMessages((prev) => [
        ...prev,
        {
          id: createMessageId(),
          role: "assistant",
          label: "Skysirv Flight Attendant™",
          text:
            "The Flight Attendant is not configured yet. Please try again once the API connection is available.",
        },
      ])

      return
    }

    setChatLoading(true)

    try {
      const response = await fetch(`${API_BASE_URL}/api/flight-attendant/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          message,
          messages: [...messages, userMessage].slice(-10).map((item) => ({
            role: item.role,
            content: item.text,
          })),
        }),
      })

      const data = await response.json().catch(() => null)

      if (!response.ok) {
        throw new Error(data?.error || "Unable to reach Skysirv Flight Attendant")
      }

      const assistantMessageId = createMessageId()
      const assistantReply =
        data?.reply || "I’m here, but I could not generate a response."

      setChatLoading(false)

      setMessages((prev) => [
        ...prev,
        {
          id: assistantMessageId,
          role: "assistant",
          label: "Skysirv Flight Attendant™",
          text: "",
        },
      ])

      await typeAssistantReply(assistantMessageId, assistantReply)
    } catch (error: any) {
      setMessages((prev) => [
        ...prev,
        {
          id: createMessageId(),
          role: "assistant",
          label: "Skysirv Flight Attendant™",
          text:
            error?.message ||
            "Something went wrong while contacting the Flight Attendant. Please try again.",
        },
      ])
    } finally {
      setChatLoading(false)
    }
  }

  return (
    <section className="relative -mt-32 overflow-hidden bg-gradient-to-b from-slate-950 via-slate-950 to-slate-900 pt-32 text-white">
      <div className="pointer-events-none absolute inset-0">
        <motion.div
          animate={{ opacity: [0.16, 0.28, 0.16], scale: [1, 1.04, 1] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(56,189,248,0.16),transparent_38%)]"
        />
        <motion.div
          animate={{ x: [0, 24, 0], y: [0, -18, 0] }}
          transition={{ duration: 8.6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute right-[-40px] top-[-20px] h-72 w-72 rounded-full bg-sky-500/10 blur-3xl"
        />
        <motion.div
          animate={{ x: [0, -18, 0], y: [0, 18, 0] }}
          transition={{ duration: 9.2, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-[-40px] left-[-20px] h-80 w-80 rounded-full bg-indigo-500/10 blur-3xl"
        />
      </div>

      <div className="relative mx-auto max-w-7xl px-6 pb-20 pt-8 sm:px-8 sm:pb-24 sm:pt-10 lg:px-12">
        {/* HERO */}
        <div className="grid items-center gap-10 lg:grid-cols-[0.92fr_1.08fr]">
          <div className="text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, y: 18, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.55, ease: "easeOut" }}
              className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-medium uppercase tracking-[0.18em] text-slate-300 backdrop-blur-sm"
            >
              Skysirv Flight Attendant™
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.06, duration: 0.72, ease: "easeOut" }}
              className="mt-8 text-5xl font-bold leading-[1.08] tracking-tight text-white sm:text-6xl md:text-7xl"
            >
              Ask your AI travel companion
              <span className="block">before you book</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.14, duration: 0.62, ease: "easeOut" }}
              className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-slate-300 sm:text-xl lg:mx-0"
            >
              Skysirv Flight Attendant™ helps travelers understand route behavior,
              interpret fare signals, compare options, and make calmer booking decisions
              with intelligence connected directly to the Skysirv platform.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.58, ease: "easeOut" }}
              className="mt-10 flex flex-wrap items-center justify-center gap-3 lg:justify-start"
            >
              <MarketingPill label="Route-aware guidance" />
              <MarketingPill label="Fare signal interpretation" />
              <MarketingPill label="Personalized travel intelligence" />
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.24, duration: 0.58, ease: "easeOut" }}
              className="mt-6 text-sm leading-6 text-slate-400"
            >
              Visitors can preview the assistant. Sign in to send live messages and unlock
              the authenticated Flight Attendant experience.
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.985 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.16, duration: 0.72, ease: "easeOut" }}
          >
            <FlightAttendantChatPanel
              messages={messages}
              input={chatInput}
              loading={chatLoading}
              assistantTyping={assistantTyping}
              authRequired={authRequired}
              messagesEndRef={messagesEndRef}
              onInputChange={setChatInput}
              onSubmit={handleSendFlightAttendantMessage}
              onOpenAuthModal={() => setAuthModalOpen(true)}
            />
          </motion.div>
        </div>

        {/* VALUE STRIP */}
        <div className="mx-auto mt-14 grid max-w-6xl gap-4 md:grid-cols-3">
          <ValuePanel
            title="Route-aware"
            text="Designed to understand monitored routes, pricing behavior, and fare movement over time."
          />
          <ValuePanel
            title="Signal-driven"
            text="Built to explain Skyscore™, fare alerts, route volatility, and booking timing."
          />
          <ValuePanel
            title="Personalized"
            text="A future AI layer shaped around your watchlist, preferences, and travel decisions."
          />
        </div>

        {/* AI DECISION PANEL */}
        <div className="mx-auto mt-16 max-w-6xl">
          <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-white/5 px-6 py-8 shadow-[0_30px_80px_rgba(2,6,23,0.45)] backdrop-blur-sm sm:px-8 sm:py-10">
            <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
              <div className="rounded-[1.75rem] border border-white/10 bg-white/[0.04] p-7">
                <div className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium uppercase tracking-[0.16em] text-slate-400">
                  AI decision layer
                </div>

                <h2 className="mt-4 text-4xl font-bold tracking-tight text-white sm:text-5xl">
                  Ask better travel questions. Get answers grounded in your routes.
                </h2>

                <p className="mt-5 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
                  Most AI assistants can explain general travel concepts. Skysirv
                  Flight Attendant™ is designed to understand your monitored routes,
                  pricing history, Skyscore™, watchlist behavior, and booking timing
                  signals inside Skysirv.
                </p>

                <div className="mt-8 grid gap-4 sm:grid-cols-3">
                  <SlateMetricCard
                    label="Context"
                    value="Route-aware"
                    subtext="Connected to monitored routes"
                  />
                  <SlateMetricCard
                    label="Signal"
                    value="Skyscore™"
                    subtext="Built around fare intelligence"
                  />
                  <SlateMetricCard
                    label="Guidance"
                    value="Personal"
                    subtext="Designed around travel style"
                  />
                </div>
              </div>

              <div className="rounded-[1.75rem] border border-white/10 bg-slate-950/80 p-7 shadow-[0_20px_60px_rgba(2,6,23,0.35)]">
                <p className="text-xs font-medium uppercase tracking-[0.16em] text-slate-400">
                  How it will evolve
                </p>

                <h3 className="mt-4 text-3xl font-bold tracking-tight text-white">
                  From chat assistant to Skysirv-aware intelligence companion.
                </h3>

                <div className="mt-6 space-y-3">
                  <DarkInsightRow
                    label="Today"
                    text="The Flight Attendant can answer authenticated user questions through Skysirv’s backend."
                  />
                  <DarkInsightRow
                    label="Next"
                    text="It will receive route, watchlist, pricing, and saved flight context from Skysirv."
                  />
                  <DarkInsightRow
                    label="Future"
                    text="It will help explain alerts, summarize route behavior, and guide booking decisions."
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* SYSTEM STORY */}
        <div className="mx-auto mt-16 grid max-w-6xl gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="rounded-[2rem] border border-white/10 bg-white/5 p-8 backdrop-blur-sm">
            <p className="text-xs font-medium uppercase tracking-[0.16em] text-slate-400">
              Why this matters
            </p>

            <h2 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl">
              This is not generic AI. It is a specialized travel intelligence assistant.
            </h2>

            <p className="mt-5 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
              Skysirv Flight Attendant™ is being designed to sit on top of the
              Skysirv intelligence engine — helping travelers understand the why
              behind price movement, route timing, alerts, and booking confidence.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              <SlateMetricCard
                label="Watchlist"
                value="Aware"
                subtext="Knows what routes matter"
              />
              <SlateMetricCard
                label="Pricing"
                value="Historic"
                subtext="Uses fare behavior context"
              />
              <SlateMetricCard
                label="Decisions"
                value="Guided"
                subtext="Explains when to act"
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <SlateFeatureCard
              title="Explains"
              text="Translates fare movement into plain-language travel guidance."
            />
            <SlateFeatureCard
              title="Compares"
              text="Helps evaluate routes, timing, and future booking options."
            />
            <SlateFeatureCard
              title="Personalizes"
              text="Built around your monitored routes and travel preferences."
            />
            <SlateFeatureCard
              title="Guides"
              text="Supports calmer, more confident flight decisions."
            />
          </div>
        </div>

        {/* COMPARISON TABLE */}
        <div className="mx-auto mt-20 max-w-6xl">
          <FlightAttendantComparisonTable />
        </div>

        {/* FINAL CTA */}
        <div className="mx-auto mt-20 max-w-6xl">
          <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/5 px-6 py-14 text-center shadow-[0_25px_70px_rgba(2,6,23,0.38)] backdrop-blur-sm sm:px-8 sm:py-16">
            <div className="pointer-events-none absolute inset-0">
              <motion.div
                animate={{ opacity: [0.12, 0.2, 0.12], scale: [1, 1.03, 1] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(56,189,248,0.18),transparent_40%)]"
              />
            </div>

            <div className="relative mx-auto max-w-3xl">
              <h2 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
                The next layer of Skysirv intelligence is coming.
              </h2>

              <p className="mt-6 text-lg leading-8 text-slate-300">
                Skysirv Flight Attendant™ will bring conversational guidance to
                route monitoring, price behavior, alerts, and future booking decisions.
              </p>

              <div className="mt-8 flex flex-wrap justify-center gap-4">
                <Link
                  href="/pricing"
                  className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-200"
                >
                  View Skysirv plans
                </Link>

                <Link
                  href="/"
                  className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/5 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
                >
                  Back to homepage
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <FlightAttendantFooter />

      <AuthModal
        open={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        maxWidthClassName="max-w-sm"
        disableBackdropClose={false}
      >
        <AuthPanel
          onSigninComplete={() => {
            setAuthModalOpen(false)
            setAuthRequired(false)
          }}
          onSignupComplete={() => {
            setAuthModalOpen(false)
          }}
        />
      </AuthModal>
    </section>
  )
}

function FlightAttendantChatPanel({
  messages,
  input,
  loading,
  assistantTyping,
  authRequired,
  messagesEndRef,
  onInputChange,
  onSubmit,
  onOpenAuthModal,
}: {
  messages: FlightAttendantMessage[]
  input: string
  loading: boolean
  assistantTyping: boolean
  authRequired: boolean
  messagesEndRef: MutableRefObject<HTMLDivElement | null>
  onInputChange: (value: string) => void
  onSubmit: (event: FormEvent<HTMLFormElement>) => void
  onOpenAuthModal: () => void
}) {
  return (
    <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-slate-950/85 shadow-[0_30px_80px_rgba(2,6,23,0.48)] backdrop-blur-sm">
      <div className="border-b border-white/10 bg-white/[0.04] px-6 py-4">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.16em] text-slate-400">
              Live Flight Attendant
            </p>
            <p className="mt-1 text-sm text-slate-300">
              Ask about routes, fares, timing, and booking confidence.
            </p>
          </div>

          <div className="flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs font-medium text-emerald-300">
            <span className="h-2 w-2 rounded-full bg-emerald-300" />
            Online
          </div>
        </div>
      </div>

      <div className="h-[430px] overflow-y-auto px-6 py-5">
        <div className="space-y-4">
          {messages.map((message) => (
            <AssistantBubble
              key={message.id}
              label={message.label}
              text={message.text}
              align={message.role === "user" ? "right" : "left"}
            />
          ))}

          {loading && (
            <AssistantBubble
              label="Skysirv Flight Attendant™"
              text="Thinking through your travel question..."
              align="left"
            />
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {authRequired && (
        <div className="border-t border-white/10 bg-sky-400/10 px-6 py-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm leading-6 text-sky-100">
              Sign in to send live messages and connect future answers to your Skysirv account.
            </p>

            <button
              type="button"
              onClick={onOpenAuthModal}
              className="inline-flex shrink-0 items-center justify-center rounded-full bg-white px-4 py-2 text-xs font-semibold text-slate-950 transition hover:bg-slate-200"
            >
              Sign in
            </button>
          </div>
        </div>
      )}

      <form onSubmit={onSubmit} className="border-t border-white/10 bg-white/[0.03] p-4">
        <div className="flex flex-col gap-3 sm:flex-row">
          <input
            type="text"
            value={input}
            onChange={(event) => onInputChange(event.target.value)}
            placeholder="Ask: Should I book now or wait?"
            className="min-h-[48px] flex-1 rounded-xl border border-white/10 bg-white/[0.06] px-4 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-sky-300/40 focus:ring-2 focus:ring-sky-300/10"
          />

          <button
            type="submit"
            disabled={loading || assistantTyping || !input.trim()}
            className="inline-flex min-h-[48px] items-center justify-center rounded-xl bg-white px-5 text-sm font-semibold text-slate-950 transition hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Thinking..." : assistantTyping ? "Typing..." : "Send"}
          </button>
        </div>

        <p className="mt-3 text-xs leading-5 text-slate-500">
          Live answers require sign-in. Future versions will connect directly to your routes,
          watchlist, saved flights, and Skysirv intelligence.
        </p>
      </form>
    </div>
  )
}

function MarketingPill({ label }: { label: string }) {
  return (
    <div className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-300 backdrop-blur-sm">
      {label}
    </div>
  )
}

function ValuePanel({
  title,
  text,
}: {
  title: string
  text: string
}) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
      <h3 className="text-xl font-bold text-white">{title}</h3>
      <p className="mt-3 text-sm leading-7 text-slate-300">{text}</p>
    </div>
  )
}

function SlateMetricCard({
  label,
  value,
  subtext,
}: {
  label: string
  value: string
  subtext: string
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
      <p className="text-xs font-medium uppercase tracking-[0.14em] text-slate-400">
        {label}
      </p>
      <p className="mt-2 text-2xl font-semibold text-white">{value}</p>
      <p className="mt-1 text-xs text-slate-400">{subtext}</p>
    </div>
  )
}

function SlateFeatureCard({
  title,
  text,
}: {
  title: string
  text: string
}) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
      <h3 className="text-xl font-bold text-white">{title}</h3>
      <p className="mt-3 text-sm leading-7 text-slate-300">{text}</p>
    </div>
  )
}

function DarkInsightRow({
  label,
  text,
}: {
  label: string
  text: string
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
      <p className="text-xs font-medium uppercase tracking-[0.14em] text-slate-500">
        {label}
      </p>
      <p className="mt-2 text-sm leading-6 text-slate-300">{text}</p>
    </div>
  )
}

function AssistantBubble({
  label,
  text,
  align,
}: {
  label: string
  text: string
  align: "left" | "right"
}) {
  return (
    <div
      className={cn(
        "flex",
        align === "right" ? "justify-end" : "justify-start"
      )}
    >
      <div
        className={cn(
          "max-w-[88%] rounded-2xl border px-4 py-3",
          align === "right"
            ? "border-sky-400/20 bg-sky-400/10"
            : "border-white/10 bg-white/[0.04]"
        )}
      >
        <p className="mb-1 text-xs font-medium uppercase tracking-[0.14em] text-slate-500">
          {label}
        </p>
        <p className="whitespace-pre-line text-sm leading-6 text-slate-300">
          {text}
        </p>
      </div>
    </div>
  )
}

function FlightAttendantComparisonTable() {
  const rows = [
    {
      label: "General travel questions",
      chatgpt: "Strong",
      skysirv: "Strong",
    },
    {
      label: "Understands your monitored routes",
      chatgpt: "Limited unless manually provided",
      skysirv: "Connected to your Skysirv watchlist",
    },
    {
      label: "Uses airfare history",
      chatgpt: "Not connected by default",
      skysirv: "Built around route pricing history",
    },
    {
      label: "Interprets Skyscore™",
      chatgpt: "Not available",
      skysirv: "Native Skyscore™ explanation",
    },
    {
      label: "Explains booking timing",
      chatgpt: "General guidance",
      skysirv: "Route-specific timing guidance",
    },
    {
      label: "Connects to alerts and signals",
      chatgpt: "Not connected",
      skysirv: "Designed for Skysirv Signals™",
    },
    {
      label: "Future booking workflow",
      chatgpt: "External workflow",
      skysirv: "Planned inside Skysirv experience",
    },
  ]

  return (
    <div className="mx-auto max-w-6xl">
      <h3 className="text-5xl font-semibold text-white">
        ChatGPT vs. Skysirv Flight Attendant™
      </h3>

      <p className="mt-3 max-w-3xl text-lg leading-8 text-slate-400">
        ChatGPT is a powerful general assistant. Skysirv Flight Attendant™ is
        being designed as a specialized travel intelligence assistant connected
        to the Skysirv platform.
      </p>

      <div className="mt-10 overflow-x-auto">
        <div className="overflow-hidden rounded-[1.75rem] border border-white/10 bg-slate-950/80 shadow-[0_20px_60px_rgba(2,6,23,0.35)] backdrop-blur-sm">
          <div className="grid min-w-[760px] grid-cols-3 border-b border-white/10 bg-white/[0.04] text-sm font-medium text-slate-300">
            <div className="px-6 py-4">Capability</div>
            <div className="px-6 py-4 text-center">ChatGPT</div>
            <div className="px-6 py-4 text-center">Skysirv Flight Attendant™</div>
          </div>

          {rows.map((row, index) => (
            <div
              key={row.label}
              className={cn(
                "grid min-w-[760px] grid-cols-3 border-t border-white/5 text-sm",
                index % 2 === 0 ? "bg-transparent" : "bg-white/[0.02]"
              )}
            >
              <div className="px-6 py-4 font-medium text-slate-200">
                {row.label}
              </div>

              <div className="px-6 py-4 text-center text-slate-400">
                {row.chatgpt}
              </div>

              <div className="px-6 py-4 text-center text-slate-200">
                {row.skysirv}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function FlightAttendantFooter() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-16 text-center md:max-w-4xl md:text-left">
      <div className="grid grid-cols-1 gap-12 md:grid-cols-4 md:justify-items-center md:text-center">
        <div className="flex max-w-xs flex-col justify-start text-center md:text-left">
          <Link
            href="/"
            className="text-xl font-bold leading-none text-white transition hover:text-slate-300"
          >
            Skysirv™
          </Link>

          <p className="mt-4 text-sm leading-6 text-slate-400">
            Flight intelligence that helps travelers understand pricing and
            book with more confidence.
          </p>
        </div>

        <div className="text-center md:text-left">
          <h3 className="text-sm font-bold uppercase tracking-[0.14em] text-white">
            Products
          </h3>

          <ul className="mt-4 space-y-3 text-sm text-slate-400">
            <li>
              <Link href="/pricing" className="transition hover:text-white">
                Pricing
              </Link>
            </li>

            <li>
              <Link href="/booking" className="transition hover:text-white">
                Booking
              </Link>
            </li>

            <li>
              <Link href="/flight-attendant" className="transition hover:text-white">
                Skysirv Flight Attendant™
              </Link>
            </li>
          </ul>
        </div>

        <div className="text-center md:text-left">
          <h3 className="text-sm font-bold uppercase tracking-[0.14em] text-white">
            Company
          </h3>

          <ul className="mt-4 space-y-3 text-sm text-slate-400">
            <li>
              <Link href="/about" className="transition hover:text-white">
                About
              </Link>
            </li>

            <li>
              <Link href="/beta" className="transition hover:text-white">
                Skysirv™ Beta
              </Link>
            </li>
          </ul>
        </div>

        <div className="text-center md:text-left">
          <h3 className="text-sm font-bold uppercase tracking-[0.14em] text-white">
            Legal
          </h3>

          <ul className="mt-4 space-y-3 text-sm text-slate-400">
            <li>
              <Link href="/privacy" className="transition hover:text-white">
                Privacy
              </Link>
            </li>

            <li>
              <Link href="/terms" className="transition hover:text-white">
                Terms
              </Link>
            </li>

            <li>
              <Link href="/refund-policy" className="transition hover:text-white">
                Refund Policy
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="mt-12 pt-6 text-center">
        <p className="text-sm text-slate-300">
          &copy; {new Date().getFullYear()} Skysirv™. All rights reserved.
        </p>
      </div>
    </div>
  )
}