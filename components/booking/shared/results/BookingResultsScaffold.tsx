"use client"

import { motion } from "framer-motion"
import type { ReactNode } from "react"

import BookingBottomLucyComposer from "@/components/booking/shared/BookingBottomLucyComposer"
import { useBookingLucyComposer } from "@/components/booking/shared/BookingLucyComposerContext"

export function BookingResultsLayout({
  filters,
  rightRail,
  children,
}: {
  filters: ReactNode
  rightRail?: ReactNode
  children: ReactNode
}) {
  const lucyComposer = useBookingLucyComposer()

  return (
    <div className="relative left-1/2 mt-6 w-[min(calc(100vw-2rem),1240px)] -translate-x-1/2 pb-32 xl:w-[min(calc(100vw-3rem),1360px)]">
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.28, ease: "easeOut" }}
        className={
          rightRail
            ? "grid gap-5 lg:grid-cols-[260px_minmax(0,1fr)] xl:grid-cols-[280px_minmax(0,768px)_260px]"
            : "grid gap-5 lg:grid-cols-[260px_minmax(0,1fr)] xl:grid-cols-[280px_minmax(0,1fr)]"
        }
      >
        <div className="min-w-0 space-y-4">
          {lucyComposer ? (
            <BookingBottomLucyComposer
              modeLabel={lucyComposer.modeLabel}
              composerText={lucyComposer.composerText}
              onComposerChange={lucyComposer.onComposerChange}
              variant="rail"
            />
          ) : null}

          {filters}
        </div>

        <section className="min-w-0 max-w-[768px] space-y-3">{children}</section>

        {rightRail ? (
          <aside className="hidden min-w-0 xl:block">{rightRail}</aside>
        ) : null}
      </motion.div>
    </div>
  )
}

export function BookingQuickChips({ chips }: { chips: string[] }) {
  return (
    <div className="flex flex-wrap gap-2">
      {chips.map((chip) => (
        <button
          key={chip}
          type="button"
          className="inline-flex min-h-[32px] items-center rounded-full border border-slate-200 bg-white px-3 text-xs font-semibold text-blue-700 shadow-sm transition hover:border-blue-100 hover:bg-blue-50"
        >
          {chip}
        </button>
      ))}
    </div>
  )
}

export function BookingResultsHeader({
  title,
  subtitle,
}: {
  title: string
  subtitle?: string
  sortLabel?: string
}) {
  return (
    <div className="px-1 pb-2">
      <p className="mb-2 text-sm font-medium leading-6 text-slate-700">
        Prices are shown in US dollars and include estimated taxes and fees per traveler except for{" "}
        <span className="font-semibold text-blue-700 underline underline-offset-2">
          baggage fees
        </span>
        .
      </p>

      <h3 className="text-2xl font-bold tracking-tight text-slate-800">
        {title}
      </h3>

      {subtitle ? (
        <p className="mt-1 inline-flex items-center gap-1 text-sm font-medium leading-5 text-slate-500">
          {subtitle}
          <span className="inline-flex h-4 w-4 items-center justify-center rounded-full border border-blue-200 text-[10px] font-black text-blue-700">
            i
          </span>
        </p>
      ) : null}
    </div>
  )
}

export function BookingInfoPill({ label }: { label: string }) {
  return (
    <span className="inline-flex min-h-[26px] items-center rounded-full border border-slate-200 bg-white px-2.5 text-xs font-semibold text-slate-600">
      {label}
    </span>
  )
}