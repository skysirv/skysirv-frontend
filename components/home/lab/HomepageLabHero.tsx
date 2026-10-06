"use client"

import {
  FormEvent,
  useEffect,
  useRef,
  useState,
} from "react"
import { useRouter } from "next/navigation"

import LargeChevron from "@/components/ui/LargeChevron"

const LUCY_HOMEPAGE_PROMPT_KEY =
  "skysirv-lucy-homepage-prompt"

const heroVideos = [
  "/video/home/hero-01-beach.mp4",
  "/video/home/hero-02-mountain.mp4",
  "/video/home/hero-03-hotairballoons.mp4",
  "/video/home/hero-04-familybeach.mp4",
]

const HERO_VIDEO_FADE_MS = 1600

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

export default function HomepageLabHero() {
  const router = useRouter()

  const [activeVideoIndex, setActiveVideoIndex] =
    useState(0)

  const heroVideoRefs =
    useRef<Array<HTMLVideoElement | null>>([])

  const previousVideoIndexRef =
    useRef<number | null>(null)

  const [chatInput, setChatInput] = useState("")
  const [placeholderIndex, setPlaceholderIndex] =
    useState(0)

  useEffect(() => {
    const activeVideo =
      heroVideoRefs.current[activeVideoIndex]

    if (activeVideo) {
      activeVideo.currentTime = 0

      void activeVideo.play().catch(() => {
        // Autoplay can occasionally be blocked by the browser.
      })
    }

    const previousVideoIndex =
      previousVideoIndexRef.current

    let pauseTimer: number | undefined

    if (
      previousVideoIndex !== null &&
      previousVideoIndex !== activeVideoIndex
    ) {
      pauseTimer = window.setTimeout(() => {
        const previousVideo =
          heroVideoRefs.current[
          previousVideoIndex
          ]

        previousVideo?.pause()
      }, HERO_VIDEO_FADE_MS)
    }

    previousVideoIndexRef.current =
      activeVideoIndex

    return () => {
      if (pauseTimer) {
        window.clearTimeout(pauseTimer)
      }
    }
  }, [activeVideoIndex])

  useEffect(() => {
    const timer = window.setInterval(() => {
      setPlaceholderIndex(
        (current) =>
          (current + 1) %
          rotatingPromptPlaceholders.length
      )
    }, 6000)

    return () => window.clearInterval(timer)
  }, [])

  function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault()

    const message = chatInput.trim()

    if (message) {
      sessionStorage.setItem(
        LUCY_HOMEPAGE_PROMPT_KEY,
        message
      )

      localStorage.setItem(
        LUCY_HOMEPAGE_PROMPT_KEY,
        message
      )
    } else {
      sessionStorage.removeItem(
        LUCY_HOMEPAGE_PROMPT_KEY
      )

      localStorage.removeItem(
        LUCY_HOMEPAGE_PROMPT_KEY
      )
    }

    router.push("/lucy")
  }

  return (
    <section className="relative isolate min-h-[calc(100svh+160px)] overflow-hidden bg-white sm:min-h-[calc(100dvh+160px)]">
      <div className="absolute inset-0 z-0 overflow-hidden bg-white">
        {heroVideos.map((src, index) => (
          <video
            key={src}
            ref={(element) => {
              heroVideoRefs.current[index] = element
            }}
            src={src}
            muted
            playsInline
            preload="auto"
            onTimeUpdate={(event) => {
              if (index !== activeVideoIndex) return

              const video = event.currentTarget

              if (
                !Number.isFinite(video.duration) ||
                video.duration <= 0
              ) {
                return
              }

              const remaining =
                video.duration - video.currentTime

              if (
                remaining <= HERO_VIDEO_FADE_MS / 1000
              ) {
                setActiveVideoIndex((current) =>
                  current === index
                    ? (current + 1) % heroVideos.length
                    : current
                )
              }
            }}
            aria-hidden="true"
            className={[
              "absolute inset-0 h-full w-full object-cover transition-opacity ease-in-out",
              index === activeVideoIndex
                ? "opacity-100"
                : "opacity-0",
            ].join(" ")}
            style={{
              transitionDuration: `${HERO_VIDEO_FADE_MS}ms`,
            }}
          />
        ))}
      </div>

      <div className="absolute inset-0 z-10 flex translate-y-[96px] items-center justify-center px-6 text-center sm:px-8 lg:px-12">
        <div
          className="flex w-full max-w-7xl flex-col items-center"
        >
          <div className="mx-auto max-w-5xl">
            <h1 className="text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl md:text-6xl lg:text-6xl">
              AI-powered travel intelligence,
              guided by Lucy.
            </h1>

            <p className="mx-auto mt-6 max-w-3xl text-base font-semibold leading-6 text-slate-800 sm:text-xl">
              Meet Lucy — your personal travel companion. She learns how you like to travel, keeps track of what matters, and stays one step ahead so every trip feels more like yours.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="mx-auto mt-9 w-full max-w-[880px]"
          >
            <div className="relative w-full overflow-hidden rounded-[2rem] p-[3px] text-left">
              <div
                aria-hidden="true"
                className="absolute inset-0 flex items-center justify-center overflow-hidden"
              >
                <div className="aspect-square w-[160%] shrink-0 animate-[spin_12s_linear_infinite] bg-[conic-gradient(from_90deg,transparent_0deg,rgba(34,211,238,0.95)_35deg,rgba(59,130,246,0.95)_90deg,rgba(168,85,247,0.95)_145deg,rgba(236,72,153,0.95)_205deg,rgba(251,146,60,0.95)_265deg,rgba(34,197,94,0.95)_325deg,transparent_360deg)] opacity-90" />
              </div>

              <div className="relative flex min-h-[76px] items-center gap-3 rounded-[calc(2rem-3px)] bg-white px-5 py-4 sm:px-6">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(event) =>
                    setChatInput(event.target.value)
                  }
                  placeholder={
                    rotatingPromptPlaceholders[
                    placeholderIndex
                    ]
                  }
                  className="min-w-0 flex-1 bg-transparent text-sm font-medium text-slate-950 outline-none placeholder:text-slate-600 sm:text-base"
                />

                <button
                  type="submit"
                  aria-label="Open Lucy"
                  className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-700 text-white transition hover:-translate-y-0.5 hover:bg-blue-600"
                >
                  <LargeChevron direction="right" />
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </section>
  )
}