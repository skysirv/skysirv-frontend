"use client"

import { FormEvent, useEffect, useState } from "react"
import { motion } from "framer-motion"
import HomepageLabLucyModal from "@/components/home/lab/HomepageLabLucyModal"

const rotatingPromptPlaceholders = [
  "Ask Lucy if Boston to Panama is showing a smart time to book...",
  "Ask Lucy to compare the best nonstop options from Miami...",
  "Ask Lucy to explain what changed in your route’s fare behavior...",
  "Ask Lucy to remember your travel preferences for future trips...",
  "Ask Lucy what the best route is to Santa Cruz de la Sierra...",
]

type PromptPillIconName = "find" | "track" | "fare" | "memory"

const promptPills: Array<{
  label: string
  icon: PromptPillIconName
}> = [
    {
      label: "Find flights",
      icon: "find",
    },
    {
      label: "Track a route",
      icon: "track",
    },
    {
      label: "Watch fare movement",
      icon: "fare",
    },
    {
      label: "Remember my travel style",
      icon: "memory",
    },
  ]

export default function HomepageLabHero() {
  const [prompt, setPrompt] = useState("")
  const [placeholderIndex, setPlaceholderIndex] = useState(0)
  const [lucyModalOpen, setLucyModalOpen] = useState(false)
  const [lucyInitialQuestion, setLucyInitialQuestion] = useState("")

  useEffect(() => {
    const timer = window.setInterval(() => {
      setPlaceholderIndex((current) =>
        (current + 1) % rotatingPromptPlaceholders.length
      )
    }, 6000)

    return () => window.clearInterval(timer)
  }, [])

  function openLucyModal(message: string) {
    const cleanMessage = message.trim()

    if (!cleanMessage) return

    setLucyInitialQuestion(cleanMessage)
    setLucyModalOpen(true)
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    openLucyModal(prompt)
  }

  function handlePromptPillClick(value: string) {
    setPrompt(value)
    openLucyModal(value)
  }

  return (
    <>
      <section className="relative isolate min-h-[calc(100dvh+156px)] overflow-hidden bg-slate-950">
        <div className="absolute inset-0">
          <div
            className="absolute inset-0 bg-[length:100%_auto] bg-center bg-no-repeat"
            style={{
              backgroundImage: "url('/images/stock/lucy-hero-13.jpg')",
            }}
          />

          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/5 via-slate-950/5 to-slate-950/25" />
          <div className="absolute inset-0 bg-gradient-to-r from-sky-950/5 via-transparent to-indigo-950/5" />

          <motion.div
            aria-hidden="true"
            animate={{
              x: [0, 36, 0],
              y: [0, -24, 0],
              opacity: [0.22, 0.42, 0.22],
            }}
            transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
            className="absolute left-[-90px] top-20 h-80 w-80 rounded-full bg-cyan-300/30 blur-3xl"
          />

          <motion.div
            aria-hidden="true"
            animate={{
              x: [0, -42, 0],
              y: [0, 28, 0],
              opacity: [0.16, 0.32, 0.16],
            }}
            transition={{ duration: 11, repeat: Infinity, ease: "easeInOut" }}
            className="absolute bottom-10 right-[-120px] h-[26rem] w-[26rem] rounded-full bg-indigo-300/30 blur-3xl"
          />
        </div>

        <div className="relative z-10 mx-auto flex min-h-[100dvh] max-w-7xl flex-col items-center justify-center px-6 pb-16 pt-32 text-center sm:px-8 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 26 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, ease: "easeOut" }}
            className="mx-auto max-w-5xl"
          >
            <h1 className="text-4xl font-bold tracking-tight text-white drop-shadow-[0_8px_34px_rgba(2,6,23,0.35)] sm:text-5xl md:text-6xl lg:text-6xl">
              AI-powered flight intelligence, guided by Lucy.
            </h1>

            <p className="mx-auto mt-6 max-w-3xl text-base font-semibold leading-8 text-white drop-shadow-[0_4px_18px_rgba(2,6,23,0.35)] sm:text-xl">
              Skysirv's Lucy helps you track routes, understand fare movement,
              remember how you like to travel, and decide when to book with more
              confidence.
            </p>
          </motion.div>

          <motion.form
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.18, duration: 0.7, ease: "easeOut" }}
            onSubmit={handleSubmit}
            className="mx-auto mt-9 w-full max-w-[880px]"
          >
            <div className="relative min-h-[176px] overflow-hidden rounded-[1.85rem] border border-white/70 bg-white text-left shadow-[0_24px_90px_rgba(2,6,23,0.24)] ring-1 ring-cyan-200/50 lg:grid lg:grid-cols-[190px_1fr]">
              <div className="relative hidden overflow-hidden border-r border-slate-200 bg-gradient-to-br from-sky-50 via-white to-indigo-50 lg:block">
                <img
                  src="/images/stock/lucy/lucy-pos-1.png"
                  alt="Lucy welcoming visitors"
                  className="pointer-events-none absolute left-[50%] top-[-130px] h-[360px] w-auto -translate-x-1/2 scale-[1.4] origin-top object-contain drop-shadow-[0_22px_36px_rgba(15,23,42,0.18)] xl:h-[385px]"
                />
              </div>

              <div className="relative px-5 py-5">
                <textarea
                  value={prompt}
                  onChange={(event) => setPrompt(event.target.value)}
                  placeholder={rotatingPromptPlaceholders[placeholderIndex]}
                  rows={4}
                  className="min-h-[132px] w-full resize-none bg-transparent pr-16 text-base font-medium leading-7 text-slate-950 outline-none placeholder:text-slate-950 lg:min-h-[148px]"
                />

                <button
                  type="submit"
                  aria-label="Ask Lucy"
                  className="absolute bottom-5 right-5 inline-flex h-10 w-10 items-center justify-center rounded-full bg-blue-700 text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-slate-800"
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
          </motion.form>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.65, ease: "easeOut" }}
            className="mt-5 flex w-full max-w-5xl flex-col items-center gap-2"
          >
            <div className="flex flex-wrap items-center justify-center gap-2 lg:flex-nowrap">
              {promptPills.map((item) => (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => handlePromptPillClick(item.label)}
                  className="group relative isolate inline-flex shrink-0 overflow-hidden rounded-full p-[2px] text-sm font-semibold text-slate-800 shadow-[0_10px_28px_rgba(15,23,42,0.12)] transition hover:-translate-y-0.5"
                >
                  <span className="pointer-events-none absolute left-1/2 top-1/2 h-[190%] w-[190%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[conic-gradient(from_90deg,transparent_0deg,rgba(34,211,238,0.98)_45deg,rgba(59,130,246,0.98)_95deg,rgba(168,85,247,0.98)_150deg,rgba(236,72,153,0.98)_210deg,rgba(251,146,60,0.98)_270deg,rgba(34,197,94,0.98)_325deg,transparent_360deg)] opacity-0 transition-opacity duration-300 group-hover:animate-[spin_4.5s_linear_infinite] group-hover:opacity-100" />

                  <span className="relative z-10 inline-flex items-center gap-2 rounded-full border border-white/80 bg-white px-4 py-2 text-slate-800 backdrop-blur-xl transition group-hover:border-cyan-200 group-hover:bg-white">
                    <PromptPillIcon name={item.icon} />
                    {item.label}
                  </span>
                </button>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <HomepageLabLucyModal
        open={lucyModalOpen}
        initialQuestion={lucyInitialQuestion}
        onClose={() => setLucyModalOpen(false)}
      />
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

  if (name === "track") {
    return (
      <svg
        viewBox="0 0 24 24"
        aria-hidden="true"
        className="h-5 w-5 text-cyan-700"
        fill="none"
      >
        <path
          d="M12 21s6-5.2 6-11a6 6 0 1 0-12 0c0 5.8 6 11 6 11Z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinejoin="round"
        />
        <circle
          cx="12"
          cy="10"
          r="2"
          stroke="currentColor"
          strokeWidth="2"
        />
      </svg>
    )
  }

  if (name === "fare") {
    return (
      <svg
        viewBox="0 0 24 24"
        aria-hidden="true"
        className="h-5 w-5 text-emerald-600"
        fill="none"
      >
        <circle
          cx="10.5"
          cy="10.5"
          r="5.75"
          stroke="currentColor"
          strokeWidth="2"
        />
        <path
          d="M15 15 20 20"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    )
  }

  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="h-5 w-5 text-fuchsia-600"
      fill="none"
    >
      <path
        d="M7 5.5A1.5 1.5 0 0 1 8.5 4h7A1.5 1.5 0 0 1 17 5.5V20l-5-3-5 3V5.5Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  )
}