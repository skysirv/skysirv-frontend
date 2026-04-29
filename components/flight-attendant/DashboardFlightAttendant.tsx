"use client"

import { FormEvent, useEffect, useRef, useState } from "react"
import AuthModal from "@/components/auth/AuthModal"
import AuthPanel from "@/components/auth/AuthPanel"
import { getAuthToken } from "@/utils/auth-storage"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

type DashboardLucyTier = "free" | "pro" | "business"

type DashboardFlightAttendantProps = {
  tier: DashboardLucyTier
  placement?: "inline" | "floating"
  defaultOpen?: boolean
}

type FlightAttendantMessage = {
  id: string
  role: "assistant" | "user"
  label: string
  text: string
}

const tierConfig: Record<
  DashboardLucyTier,
  {
    badge: string
    title: string
    welcome: string
    placeholder: string
  }
> = {
  free: {
    badge: "Limited",
    title: "Free Flight Attendant",
    welcome:
      "Hi, I’m Lucy, your Skysirv Flight Attendant. I can help explain Skysirv basics, watchlists, fare signals, and how to get started with smarter flight monitoring.",
    placeholder: "Ask Lucy about Skysirv basics...",
  },
  pro: {
    badge: "Standard",
    title: "Pro Flight Attendant",
    welcome:
      "Hi, I’m Lucy, your Skysirv Flight Attendant. I can help explain your routes, fare timing, Skyscore, watchlist signals, and booking confidence.",
    placeholder: "Ask Lucy about your route signals...",
  },
  business: {
    badge: "Advanced",
    title: "Business Flight Attendant",
    welcome:
      "Hi, I’m Lucy, your advanced Skysirv Flight Attendant. I can help analyze route behavior, fare intelligence, saved flights, timing signals, and premium booking decisions.",
    placeholder: "Ask Lucy for deeper flight intelligence...",
  },
}

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ")
}

function createMessageId() {
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`
}

function sanitizeLucyText(text: string) {
  return text
    .replace(/\*\*(.*?)\*\*/g, "$1")
    .replace(/__(.*?)__/g, "$1")
    .replace(/^\s{0,3}#{1,6}\s+/gm, "")
    .trim()
}

export default function DashboardFlightAttendant({
  tier,
  placement = "floating",
  defaultOpen = false,
}: DashboardFlightAttendantProps) {
  const config = tierConfig[tier]

  const [open, setOpen] = useState(defaultOpen)
  const [messages, setMessages] = useState<FlightAttendantMessage[]>([
    {
      id: "welcome-1",
      role: "assistant",
      label: "Lucy",
      text: config.welcome,
    },
  ])
  const [chatInput, setChatInput] = useState("")
  const [chatLoading, setChatLoading] = useState(false)
  const [assistantTyping, setAssistantTyping] = useState(false)
  const [authRequired, setAuthRequired] = useState(false)
  const [authModalOpen, setAuthModalOpen] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!open) return

    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    })
  }, [messages, chatLoading, assistantTyping, open])

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

  async function handleSendFlightAttendantMessage(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault()

    const message = chatInput.trim()

    if (!message || chatLoading || assistantTyping) return

    const token = getAuthToken()

    const userMessage: FlightAttendantMessage = {
      id: createMessageId(),
      role: "user",
      label: "You",
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
          label: "Lucy",
          text:
            "Please sign in again to use the live Flight Attendant. This keeps Skysirv intelligence secure and connected to your account.",
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
          label: "Lucy",
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
          tier,
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
          label: "Lucy",
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
          label: "Lucy",
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
    <>
      <div
        className={
          placement === "inline"
            ? "w-full"
            : "fixed right-5 top-24 z-[80] hidden lg:block"
        }
      >
        {open ? (
          <div
            className={cn(
              "overflow-hidden rounded-[1.75rem] border border-slate-200/15 bg-slate-950/95 text-white shadow-[0_18px_42px_rgba(2,6,23,0.22)] backdrop-blur-xl",
              placement === "inline" ? "w-full" : "w-[390px]"
            )}
          >
            <div className="border-b border-white/10 bg-white/[0.04] px-5 py-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                    {config.badge}
                  </p>
                  <p className="mt-1 text-sm text-slate-300">
                    {config.title}
                  </p>
                </div>
              </div>
            </div>

            <div
              className={cn(
                "overflow-y-auto px-5 py-4",
                placement === "inline" ? "h-[230px]" : "h-[360px]"
              )}
            >
              <div className="space-y-4">
                {messages.map((message) => (
                  <AssistantBubble
                    key={message.id}
                    label={message.label}
                    text={message.text}
                    align={message.role === "user" ? "right" : "left"}
                  />
                ))}

                {chatLoading && <ThinkingDotsBubble />}

                <div ref={messagesEndRef} />
              </div>
            </div>

            {authRequired && (
              <div className="border-t border-white/10 bg-sky-400/10 px-5 py-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-xs leading-5 text-sky-100">
                    Sign in again to keep Lucy connected to your account.
                  </p>

                  <button
                    type="button"
                    onClick={() => setAuthModalOpen(true)}
                    className="shrink-0 rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-slate-950 transition hover:bg-slate-200"
                  >
                    Sign in
                  </button>
                </div>
              </div>
            )}

            <form
              onSubmit={handleSendFlightAttendantMessage}
              className="border-t border-white/10 bg-white/[0.03] p-4"
            >
              <div className="flex gap-2">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(event) => setChatInput(event.target.value)}
                  placeholder={config.placeholder}
                  className="min-h-[44px] flex-1 rounded-xl border border-white/10 bg-white/[0.06] px-4 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-sky-300/40 focus:ring-2 focus:ring-sky-300/10"
                />

                <button
                  type="submit"
                  disabled={chatLoading || assistantTyping || !chatInput.trim()}
                  className="inline-flex min-h-[44px] items-center justify-center rounded-xl bg-white px-4 text-sm font-semibold text-slate-950 transition hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {chatLoading ? "..." : assistantTyping ? "..." : "Send"}
                </button>
              </div>
            </form>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="group flex items-center gap-3 rounded-full border border-white/10 bg-slate-950/90 px-4 py-3 text-white shadow-[0_18px_50px_rgba(2,6,23,0.35)] backdrop-blur-xl transition hover:-translate-y-0.5 hover:bg-slate-900"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-sky-400/15 text-sm font-bold text-sky-200 ring-1 ring-sky-300/20">
              L
            </span>

            <span className="text-left">
              <span className="block text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">
                {config.badge}
              </span>
              <span className="block text-sm font-semibold text-white">
                Ask Lucy
              </span>
            </span>
          </button>
        )}
      </div>

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
    </>
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
  const cleanText = sanitizeLucyText(text)

  return (
    <div
      className={cn(
        "flex",
        align === "right" ? "justify-end" : "justify-start"
      )}
    >
      <div
        className={cn(
          "max-w-[86%] rounded-2xl border px-4 py-3",
          align === "right"
            ? "border-sky-400/20 bg-sky-400/10"
            : "border-white/10 bg-white/[0.04]"
        )}
      >
        <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500">
          {label}
        </p>
        <p className="whitespace-pre-line text-sm leading-6 text-slate-300">
          {cleanText}
        </p>
      </div>
    </div>
  )
}

function ThinkingDotsBubble() {
  return (
    <div className="flex justify-start">
      <div className="max-w-[86%] rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3">
        <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500">
          Lucy
        </p>

        <div className="flex items-center gap-1.5 py-1">
          <span className="h-2 w-2 animate-pulse rounded-full bg-slate-400" />
          <span
            className="h-2 w-2 animate-pulse rounded-full bg-slate-400"
            style={{ animationDelay: "120ms" }}
          />
          <span
            className="h-2 w-2 animate-pulse rounded-full bg-slate-400"
            style={{ animationDelay: "240ms" }}
          />
        </div>
      </div>
    </div>
  )
}