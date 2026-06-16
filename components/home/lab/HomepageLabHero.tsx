"use client"

import Link from "next/link"
import { FormEvent, useEffect, useRef, useState } from "react"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

const PUBLIC_LUCY_LIMIT_REACHED_MESSAGE =
  "I’d love to keep helping, but public previews are limited for now. Create a free Skysirv account or sign in to continue with the right level of travel support."

const rotatingPromptPlaceholders = [
  "Ask Lucy to compare flights, hotels, and rental cars for your next trip...",
  "Ask Lucy if Boston to Panama is showing a smart time to book...",
  "Ask Lucy to help build a family itinerary around flights, hotels, and activities...",
  "Ask Lucy how to think about hotel location, nightly rates, and total trip value...",
  "Ask Lucy to compare airport rental cars versus off-airport rental options...",
  "Ask Lucy what to consider before booking a cruise vacation...",
  "Ask Lucy to explain what changed in your route’s fare behavior...",
  "Ask Lucy to remember your travel preferences for future trips...",
]

type PromptPillIconName = "find" | "hotel" | "car" | "cruise" | "itinerary"

const promptPills: Array<{
  label: string
  icon: PromptPillIconName
  href: string
}> = [
    {
      label: "Find flights",
      icon: "find",
      href: "/plan-with-lucy/flights",
    },
    {
      label: "Book hotels",
      icon: "hotel",
      href: "/plan-with-lucy/hotels",
    },
    {
      label: "Car rentals",
      icon: "car",
      href: "/plan-with-lucy/car-rentals",
    },
    {
      label: "Book cruises",
      icon: "cruise",
      href: "/plan-with-lucy/cruises",
    },
    {
      label: "Generate itinerary",
      icon: "itinerary",
      href: "/plan-with-lucy/itinerary",
    },
  ]

type HeroLucyMessage = {
  id: string
  role: "user" | "lucy"
  text: string
}

function createMessageId() {
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`
}

export default function HomepageLabHero() {
  const [chatInput, setChatInput] = useState("")
  const [placeholderIndex, setPlaceholderIndex] = useState(0)
  const [messages, setMessages] = useState<HeroLucyMessage[]>([])
  const [chatLoading, setChatLoading] = useState(false)
  const [publicLucyLimitReached, setPublicLucyLimitReached] = useState(false)
  const [isMobileViewport, setIsMobileViewport] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const timer = window.setInterval(() => {
      setPlaceholderIndex((current) =>
        (current + 1) % rotatingPromptPlaceholders.length
      )
    }, 6000)

    return () => window.clearInterval(timer)
  }, [])

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 639px)")

    function updateMobileViewport() {
      setIsMobileViewport(mediaQuery.matches)
    }

    updateMobileViewport()

    mediaQuery.addEventListener("change", updateMobileViewport)

    return () => {
      mediaQuery.removeEventListener("change", updateMobileViewport)
    }
  }, [])

  useEffect(() => {
    let isMounted = true

    async function checkPublicLucyStatus() {
      try {
        if (!API_BASE_URL) return

        const response = await fetch(
          `${API_BASE_URL}/api/flight-attendant/public-chat/status`
        )

        const data = await response.json().catch(() => null)

        if (!isMounted) return

        if (
          response.ok &&
          data?.code === "PUBLIC_LUCY_LIMIT_REACHED"
        ) {
          setPublicLucyLimitReached(true)
        }
      } catch {
        // Keep the public preview usable if the status check fails.
        // The backend POST endpoint still protects tokens.
      }
    }

    void checkPublicLucyStatus()

    return () => {
      isMounted = false
    }
  }, [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    })
  }, [messages, chatLoading])

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const message = chatInput.trim()

    if (!message || chatLoading || publicLucyLimitReached) return

    const nextMessages: HeroLucyMessage[] = [
      ...messages,
      {
        id: createMessageId(),
        role: "user",
        text: message,
      },
    ]

    setMessages(nextMessages)
    setChatInput("")
    setChatLoading(true)

    try {
      if (!API_BASE_URL) {
        throw new Error("Missing NEXT_PUBLIC_API_BASE_URL")
      }

      const response = await fetch(`${API_BASE_URL}/api/flight-attendant/public-chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          surface: "homepage_public",
          message,
          messages: nextMessages.map((item) => ({
            role: item.role === "lucy" ? "assistant" : "user",
            content: item.text,
          })),
        }),
      })

      const data = await response.json().catch(() => null)

      if (response.status === 429 && data?.code === "PUBLIC_LUCY_LIMIT_REACHED") {
        setPublicLucyLimitReached(true)

        setMessages((current) => [
          ...current,
          {
            id: createMessageId(),
            role: "lucy",
            text:
              typeof data?.reply === "string" && data.reply.trim()
                ? data.reply.trim()
                : PUBLIC_LUCY_LIMIT_REACHED_MESSAGE,
          },
        ])

        return
      }

      if (!response.ok) {
        throw new Error(
          data?.reply ||
          data?.error ||
          "I’m having trouble reaching the public preview right now."
        )
      }

      const lucyReply =
        typeof data?.reply === "string" && data.reply.trim()
          ? data.reply.trim()
          : "I’m here, but I could not generate a clean response."

      setMessages((current) => [
        ...current,
        {
          id: createMessageId(),
          role: "lucy",
          text: lucyReply,
        },
      ])
    } catch (error: any) {
      setMessages((current) => [
        ...current,
        {
          id: createMessageId(),
          role: "lucy",
          text:
            error?.message ||
            "I’m having trouble reaching Lucy right now. Please try again in a moment.",
        },
      ])
    } finally {
      setChatLoading(false)
    }
  }

  return (
    <>
      <section className="relative isolate min-h-[calc(100svh+380px)] overflow-hidden bg-[#dbeafe] sm:min-h-[calc(100dvh+220px)]">
        <div className="absolute inset-0">
          <img
            src="/images/stock/lucy-hero-13.jpg"
            alt=""
            loading="eager"
            fetchPriority="high"
            className="absolute inset-0 h-full w-full object-cover"
            style={{ objectPosition: "center 42%" }}
          />

          <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-white/0 to-slate-950/10" />
        </div>

        <div className="absolute inset-0 z-10 flex items-start justify-center px-6 pb-10 pt-60 text-center sm:items-center sm:px-8 sm:pt-24 lg:px-12">
          <div className="flex w-full max-w-7xl flex-col items-center" style={{ transform: "translateY(32px)" }}>
            <div className="mx-auto max-w-5xl">
              <h1 className="text-4xl font-bold tracking-tight text-slate-800 drop-shadow-[0_8px_34px_rgba(2,6,23,0.35)] sm:text-5xl md:text-6xl lg:text-6xl">
                AI-powered travel intelligence, guided by Lucy.
              </h1>

              <p className="mx-auto mt-6 max-w-3xl text-base font-semibold leading-6 text-slate-700 drop-shadow-[0_4px_18px_rgba(2,6,23,0.35)] sm:text-xl">
                Skysirv's Lucy helps you track routes, understand fare movement,
                compare flights, explore hotels and car rentals, build smarter itineraries,
                remember how you like to travel, and decide when to book with more
                confidence.
              </p>
            </div>

            <form
              onSubmit={handleSubmit}
              className="mx-auto mt-9 w-full max-w-[880px]"
            >
              <div className="relative min-h-[240px] overflow-hidden rounded-[1.85rem] border border-white/70 bg-white text-left shadow-[0_24px_90px_rgba(2,6,23,0.24)] ring-1 ring-cyan-200/50">
                <div className="relative flex h-[240px] flex-col px-5 py-4 sm:px-7 lg:h-[250px]">
                  <div className="min-h-0 flex-1 overflow-y-auto pr-2 [scrollbar-width:thin] [scrollbar-color:rgba(148,163,184,0.35)_transparent] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-slate-300/45 hover:[&::-webkit-scrollbar-thumb]:bg-slate-400/60">
                    {messages.length === 0 ? (
                      <div className="pt-5">
                        <p className="max-w-xl text-base font-medium leading-6 text-slate-500">
                          {rotatingPromptPlaceholders[placeholderIndex]}
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-3 pb-1">
                        {messages.map((message) =>
                          message.role === "user" ? (
                            <div key={message.id} className="flex justify-end">
                              <div className="max-w-[84%] rounded-2xl rounded-br-md bg-slate-900 px-4 py-2.5 text-sm leading-6 text-white">
                                {message.text}
                              </div>
                            </div>
                          ) : (
                            <div key={message.id} className="flex justify-start">
                              <p className="max-w-[92%] whitespace-pre-line text-sm font-medium leading-6 text-slate-700">
                                {message.text}
                              </p>
                            </div>
                          )
                        )}

                        {chatLoading && (
                          <div className="flex justify-start">
                            <div className="flex items-center gap-1.5 px-1 py-2">
                              <span className="h-2 w-2 animate-pulse rounded-full bg-blue-600" />
                              <span
                                className="h-2 w-2 animate-pulse rounded-full bg-blue-600"
                                style={{ animationDelay: "120ms" }}
                              />
                              <span
                                className="h-2 w-2 animate-pulse rounded-full bg-blue-600"
                                style={{ animationDelay: "240ms" }}
                              />
                            </div>
                          </div>
                        )}

                        <div ref={messagesEndRef} />
                      </div>
                    )}
                  </div>

                  <div className="mt-3 flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-2">
                    <input
                      type="text"
                      value={chatInput}
                      onChange={(event) => setChatInput(event.target.value)}
                      disabled={publicLucyLimitReached}
                      placeholder={
                        publicLucyLimitReached
                          ? isMobileViewport
                            ? "Public preview limit reached."
                            : "Public preview limit reached. Sign in or create an account to continue."
                          : isMobileViewport
                            ? "Ask Lucy..."
                            : "Ask Lucy about flights, hotels, rentals, or trip planning..."
                      }
                      className="min-w-0 flex-1 bg-transparent text-sm font-medium text-slate-950 outline-none placeholder:text-slate-400 disabled:cursor-not-allowed disabled:text-slate-400"
                    />

                    <button
                      type="submit"
                      disabled={publicLucyLimitReached || !chatInput.trim() || chatLoading}
                      aria-label="Ask Lucy"
                      className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-700 text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-45"
                    >
                      <svg
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                        className="h-5 w-5"
                        fill="none"
                      >
                        <path
                          d="M5 12h13M13 6l6 6-6 6"
                          stroke="currentColor"
                          strokeWidth="3"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </form>

            <div className="mt-5 flex w-full max-w-5xl flex-col items-center gap-2">
              <div className="flex flex-wrap items-center justify-center gap-2 lg:flex-nowrap">
                {promptPills.map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    className="inline-flex shrink-0 items-center gap-2 rounded-full border border-white/80 bg-white px-4 py-2 text-sm font-semibold text-slate-800 shadow-[0_10px_28px_rgba(15,23,42,0.12)]"
                  >
                    <PromptPillIcon name={item.icon} />
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

function PromptPillIcon({ name }: { name: PromptPillIconName }) {
  if (name === "find") {
    return (
      <span
        aria-hidden="true"
        className="inline-flex h-5 w-5 items-center justify-center text-lg leading-none text-sky-600"
      >
        ✈︎
      </span>
    )
  }

  if (name === "hotel") {
    return (
      <svg
        viewBox="0 0 24 24"
        aria-hidden="true"
        className="h-5 w-5 text-cyan-700"
        fill="none"
      >
        <path
          d="M4.5 20V7.5A2.5 2.5 0 0 1 7 5h10a2.5 2.5 0 0 1 2.5 2.5V20"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M7.5 20v-5.5A1.5 1.5 0 0 1 9 13h6a1.5 1.5 0 0 1 1.5 1.5V20"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M8 9h.01M12 9h.01M16 9h.01"
          stroke="currentColor"
          strokeWidth="2.8"
          strokeLinecap="round"
        />
      </svg>
    )
  }

  if (name === "car") {
    return (
      <span
        aria-hidden="true"
        className="h-5 w-5 bg-emerald-600"
        style={{
          WebkitMaskImage: "url('/images/stock/icons/car-icon.svg')",
          maskImage: "url('/images/stock/icons/car-icon.svg')",
          WebkitMaskRepeat: "no-repeat",
          maskRepeat: "no-repeat",
          WebkitMaskPosition: "center",
          maskPosition: "center",
          WebkitMaskSize: "contain",
          maskSize: "contain",
        }}
      />
    )
  }

  if (name === "cruise") {
    return (
      <svg
        viewBox="0 0 24 24"
        aria-hidden="true"
        className="h-5 w-5 text-blue-600"
        fill="none"
      >
        <path
          d="M7 10.5V6.75A1.75 1.75 0 0 1 8.75 5h6.5A1.75 1.75 0 0 1 17 6.75v3.75"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M5.5 10.5h13l-1.35 5.25A3 3 0 0 1 14.25 18h-4.5a3 3 0 0 1-2.9-2.25L5.5 10.5Z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinejoin="round"
        />
        <path
          d="M8.5 8h7"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M4 20c1.25 0 1.25-.75 2.5-.75S7.75 20 9 20s1.25-.75 2.5-.75S12.75 20 14 20s1.25-.75 2.5-.75S17.75 20 19 20"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    )
  }

  if (name === "itinerary") {
    return (
      <svg
        viewBox="0 0 24 24"
        aria-hidden="true"
        className="h-5 w-5 text-fuchsia-600"
        fill="none"
      >
        <circle cx="7" cy="6" r="2" stroke="currentColor" strokeWidth="2" />
        <circle cx="17" cy="18" r="2" stroke="currentColor" strokeWidth="2" />
        <path
          d="M9 6h3.5A3.5 3.5 0 0 1 16 9.5v0A3.5 3.5 0 0 1 12.5 13H11a3 3 0 0 0 0 6h4"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    )
  }
}  