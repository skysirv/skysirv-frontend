"use client"

import Image from "next/image"
import Link from "next/link"

type SkysirvLiveHeaderProps = {
  mode?: "overview" | "airport"
  airportName?: string
  airportCode?: string
  localTimeLabel?: string
  tickerItems?: string[]
  alertBarClassName?: string
  lastUpdatedAt?: string
}

function formatLocalUpdateTime(timestamp?: string) {
  if (!timestamp) return "Loading..."

  const date = new Date(timestamp)

  if (Number.isNaN(date.getTime())) {
    return "Loading..."
  }

  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(date)
}

export default function SkysirvLiveHeader({
  mode = "overview",
  airportName,
  airportCode,
  localTimeLabel,
  tickerItems = [],
  alertBarClassName = "bg-red-600",
  lastUpdatedAt,
}: SkysirvLiveHeaderProps) {
  return (
    <header className="pointer-events-auto absolute left-5 right-5 top-5 z-30">
      <div className="overflow-hidden rounded-[1.35rem] shadow-[0_18px_50px_rgba(15,23,42,0.28)]">
        <div className="flex min-h-[76px] items-center justify-between bg-blue-700 px-6 text-white backdrop-blur-xl">
          <div className="flex items-center gap-4">
            <Link
              href={mode === "airport" ? "/skysirv-live" : "/"}
              className="inline-flex h-11 items-center gap-1.5 rounded-full bg-white py-0 pl-3 pr-4 text-sm font-bold text-slate-800 transition hover:bg-slate-100"
            >
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M15 18l-6-6 6-6" />
              </svg>

              {mode === "airport" ? "Live" : "Home"}
            </Link>

            <div>
              {mode === "airport" ? (
                <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                  <h1 className="text-2xl font-black tracking-tight sm:text-4xl">
                    {airportName}
                  </h1>

                  {localTimeLabel && (
                    <span className="text-sm font-bold text-white/55 sm:text-base">
                      {localTimeLabel}
                    </span>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Image
                    src="/branding/icon/skysirv-icon-white-32.png"
                    alt=""
                    width={32}
                    height={32}
                    priority
                    className="h-8 w-8 shrink-0"
                  />

                  <h1 className="text-2xl tracking-tight sm:text-3xl">
                    <span className="font-black">Skysirv</span>{" "}
                    <span className="font-normal">Live</span>
                  </h1>
                </div>
              )}
            </div>
          </div>

          <div className="hidden items-center gap-3 text-xl font-bold text-white md:flex">
            <span className="h-4 w-4 rounded-full bg-red-500 shadow-[0_0_18px_rgba(239,68,68,0.9)]" />
            {mode === "airport"
              ? "SKYSIRV.COM/LIVE"
              : `Live FAA Data · Last update: ${formatLocalUpdateTime(lastUpdatedAt)}`}
          </div>
        </div>

        {mode === "airport" && (
          <div
            className={`flex h-9 items-center overflow-hidden px-5 text-sm font-bold text-white ${alertBarClassName}`}
          >
            <span className="mr-3 h-2 w-2 shrink-0 rounded-full bg-white" />

            <span className="whitespace-nowrap">
              {tickerItems.length > 0
                ? tickerItems.join(" · ")
                : `${airportCode} is showing elevated airport pressure right now.`}
            </span>
          </div>
        )}
      </div>
    </header>
  )
}