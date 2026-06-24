"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { getAuthToken } from "@/utils/auth-storage"
import LucyTripComposer from "@/components/lucy-trip/shared/LucyTripComposer"
import OnboardingPanel from "@/components/plan-with-lucy/shared/OnboardingPanel"
import LargeChevron from "@/components/ui/LargeChevron"

export default function PlanSmarterLabShell() {
  const router = useRouter()

  const [showOnboardingPanel, setShowOnboardingPanel] = useState(false)
  const [isSignedIn, setIsSignedIn] = useState(false)
  const [lucyPrompt, setLucyPrompt] = useState("")
  const [initialAuthMode, setInitialAuthMode] = useState<"signin" | "signup">(
    "signin",
  )

  useEffect(() => {
    function syncAuthState() {
      const signedIn = Boolean(getAuthToken())

      setIsSignedIn(signedIn)

      if (!signedIn) {
        setInitialAuthMode("signin")
        setShowOnboardingPanel(true)
      }
    }

    syncAuthState()

    window.addEventListener("focus", syncAuthState)
    window.addEventListener("storage", syncAuthState)
    window.addEventListener("skysirv-auth-changed", syncAuthState as EventListener)

    return () => {
      window.removeEventListener("focus", syncAuthState)
      window.removeEventListener("storage", syncAuthState)
      window.removeEventListener(
        "skysirv-auth-changed",
        syncAuthState as EventListener,
      )
    }
  }, [])

  function openOnboardingPanel(mode: "signin" | "signup") {
    setInitialAuthMode(mode)
    setShowOnboardingPanel(true)
  }

  function prepareLucyTripLaunch(
    mode: "continue-topic" | "discovery",
    prompt = "",
  ) {
    const cleanPrompt = prompt.trim()

    window.sessionStorage.setItem(
      "skysirv-lucy-trip-launch",
      JSON.stringify({
        source: "plan-smarter",
        mode,
        initialIdea: cleanPrompt,
        createdAt: new Date().toISOString(),
      }),
    )

    if (mode === "continue-topic" && cleanPrompt) {
      window.sessionStorage.setItem("skysirv-plan-smarter-lucy-prompt", cleanPrompt)
      return
    }

    window.sessionStorage.removeItem("skysirv-plan-smarter-lucy-prompt")
  }

  function handleAskLucyClick() {
    prepareLucyTripLaunch("discovery")

    const token = getAuthToken()

    if (!token) {
      openOnboardingPanel("signin")
      return
    }

    router.push("/lucy-trip")
  }

  function handleLucyComposerSubmit() {
    const prompt = lucyPrompt.trim()

    if (!prompt) {
      handleAskLucyClick()
      return
    }

    prepareLucyTripLaunch("continue-topic", prompt)

    const token = getAuthToken()

    if (!token) {
      openOnboardingPanel("signin")
      return
    }

    router.push("/lucy-trip")
  }

  return (
    <main className="h-screen overflow-hidden bg-white text-slate-950">
      <section className="relative h-screen overflow-hidden bg-white px-5 pb-10 pt-10 sm:px-8">
        <Link
          href="/"
          className="fixed left-5 top-5 z-50 inline-flex min-h-[42px] items-center gap-2 rounded-full border border-blue-700 bg-blue-700 px-4 text-sm font-bold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-blue-600"
        >
          <LargeChevron direction="left" />
          Home
        </Link>

        <aside className="hidden lg:block">
          <div className="fixed left-4 top-1/2 z-40 flex -translate-y-1/2 flex-col items-center gap-5 rounded-3xl border border-slate-200 bg-white px-3 py-5 shadow-[0_18px_45px_rgba(15,23,42,0.10)]">
            <button
              type="button"
              className="flex flex-col items-center gap-1 text-slate-700 transition hover:text-slate-950"
              aria-label="Start a new planning chat"
              title="Start a new planning chat"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-lg">
                +
              </span>
              <span className="text-[11px] font-semibold">New chat</span>
            </button>

            <button
              type="button"
              disabled
              className="flex cursor-not-allowed flex-col items-center gap-1 text-slate-400"
              aria-label="Planning history will be available later"
              title="Planning history will be available later"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-lg">
                ◷
              </span>
              <span className="text-[11px] font-semibold">History</span>
            </button>
          </div>
        </aside>

        <div
          className={`mx-auto flex h-full max-w-4xl flex-col justify-start pt-[48px] transition-transform duration-300 ${showOnboardingPanel ? "xl:-translate-x-[220px]" : "xl:translate-x-0"
            }`}
        >
          <div className="text-center sm:text-left">
            <h1 className="mt-4 text-4xl font-bold tracking-tight text-slate-800 sm:text-5xl">
              Begin your next trip with the right first step.
            </h1>

            <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
              Tell Lucy what you want to do next — build a full itinerary, find
              flights, compare hotels, or let Lucy guide you when you are not
              sure where to start.
            </p>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-[1.05fr_1fr_0.9fr]">
            <Link
              href="/plan-with-lucy/itinerary"
              className="group flex min-h-[310px] flex-col overflow-hidden rounded-[1.75rem] border border-orange-100 bg-gradient-to-br from-orange-100 via-yellow-50 to-white p-6 shadow-[0_22px_65px_rgba(15,23,42,0.08)] transition hover:-translate-y-1 hover:shadow-[0_28px_80px_rgba(15,23,42,0.12)]"
            >
              <h2 className="text-xl font-bold text-slate-900">
                Create itinerary
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-600">
                Create a full trip flow with pace, budget, duration, and trip
                style.
              </p>

              <div className="flex flex-1 items-center justify-center pt-5">
                <img
                  src="/images/stock/plan-smarter/itinerary-icon.png"
                  alt=""
                  aria-hidden="true"
                  className="h-50 w-50 object-contain transition group-hover:scale-105"
                />
              </div>
            </Link>

            <div className="grid gap-4">
              <Link
                href="/booking/flights"
                className="group grid min-h-[147px] grid-cols-[1fr_130px] items-center gap-4 overflow-hidden rounded-[1.5rem] border border-blue-100 bg-gradient-to-br from-blue-100 via-sky-50 to-white p-5 shadow-[0_18px_50px_rgba(15,23,42,0.07)] transition hover:-translate-y-1 hover:shadow-[0_24px_65px_rgba(15,23,42,0.11)]"
              >
                <span>
                  <h2 className="text-xl font-bold text-slate-900">
                    Search flights
                  </h2>

                  <p className="mt-2 text-sm leading-5 text-slate-600">
                    Search flight options with Skysirv intelligence.
                  </p>
                </span>

                <span
                  className="relative h-28 w-28 justify-self-end overflow-visible"
                  aria-hidden="true"
                >
                  <img
                    src="/images/stock/plan-smarter/flights-icon.png"
                    alt=""
                    className="absolute left-[32%] top-[38%] max-w-none -translate-x-1/2 -translate-y-1/2 object-contain transition group-hover:scale-105"
                    style={{ width: "160px", height: "160px" }}
                  />
                </span>
              </Link>

              <Link
                href="/booking/hotels"
                className="group grid min-h-[147px] grid-cols-[130px_1fr] items-center gap-4 overflow-hidden rounded-[1.5rem] border border-purple-100 bg-gradient-to-br from-purple-100 via-pink-50 to-white p-5 shadow-[0_18px_50px_rgba(15,23,42,0.07)] transition hover:-translate-y-1 hover:shadow-[0_24px_65px_rgba(15,23,42,0.11)]"
              >
                <span
                  className="relative h-28 w-28 overflow-visible"
                  aria-hidden="true"
                >
                  <img
                    src="/images/stock/plan-smarter/hotels-icon.png"
                    alt=""
                    className="absolute left-[56%] top-[46%] max-w-none -translate-x-1/2 -translate-y-1/2 object-contain transition group-hover:scale-105"
                    style={{ width: "160px", height: "160px" }}
                  />
                </span>

                <span>
                  <h2 className="text-xl font-bold text-slate-900">
                    Browse hotels
                  </h2>

                  <p className="mt-2 text-sm leading-5 text-slate-600">
                    Compare stays by location, comfort, and trip style.
                  </p>
                </span>
              </Link>
            </div>

            <button
              type="button"
              onClick={handleAskLucyClick}
              className="group flex min-h-[310px] flex-col rounded-[1.75rem] border border-slate-200 bg-white p-6 text-left shadow-[0_22px_65px_rgba(15,23,42,0.07)] transition hover:-translate-y-1 hover:shadow-[0_28px_80px_rgba(15,23,42,0.12)]"
            >
              <h2 className="text-xl font-bold text-slate-900">Not sure? Ask Lucy!</h2>

              <p className="mt-2 text-sm leading-6 text-slate-600">
                Let Lucy suggest a great trip, step by step.
              </p>

              <div className="flex flex-1 items-center justify-center pt-5">
                <span
                  className="relative block shrink-0 overflow-hidden"
                  aria-hidden="true"
                  style={{ width: "230px", height: "230px" }}
                >
                  <video
                    src="/images/stock/plan-smarter/not-sure-lucy-animated.mp4"
                    autoPlay
                    loop
                    muted
                    playsInline
                    preload="auto"
                    aria-hidden="true"
                    className="h-50 w-50 object-contain transition group-hover:scale-105"
                  />
                </span>
              </div>
            </button>
          </div>
        </div>

        <div
          className={`fixed bottom-6 z-40 w-[min(760px,calc(100vw-40px))] transition-all duration-300 ${showOnboardingPanel
            ? "left-[calc(50%-220px)] -translate-x-1/2"
            : "left-1/2 -translate-x-1/2"
            }`}
        >
          {isSignedIn ? (
            <LucyTripComposer
              fixed={false}
              value={lucyPrompt}
              onChange={setLucyPrompt}
              onSubmit={handleLucyComposerSubmit}
              placeholder="Let Lucy know what you have in mind..."
            />
          ) : (
            <div className="flex min-h-[74px] items-center justify-between gap-5 rounded-[1.35rem] border border-orange-100 bg-white/90 px-5 py-3 shadow-[0_18px_55px_rgba(15,23,42,0.12)] backdrop-blur-xl">
              <div className="flex min-w-0 items-center gap-4">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-orange-50 text-2xl text-orange-500 ring-8 ring-orange-100/70">
                  🔒
                </span>

                <span className="min-w-0">
                  <span className="block text-xs font-bold text-slate-800">
                    Sign up to save planning sessions and unlock Lucy’s deeper
                    travel memory.
                  </span>
                </span>
              </div>

              <button
                type="button"
                onClick={() => openOnboardingPanel("signup")}
                className="inline-flex min-h-[42px] shrink-0 items-center justify-center rounded-lg border border-orange-500 bg-orange-500 px-5 text-sm font-bold text-white shadow-sm transition hover:-translate-y-0.5 hover:border-orange-600 hover:bg-orange-600"
              >
                Sign up now
              </button>
            </div>
          )}
        </div>

        {showOnboardingPanel && (
          <OnboardingPanel
            variant="drawer"
            initialAuthMode={initialAuthMode}
            onClose={() => {
              setShowOnboardingPanel(false)
              setIsSignedIn(Boolean(getAuthToken()))
            }}
          />
        )}
      </section>
    </main>
  )
}