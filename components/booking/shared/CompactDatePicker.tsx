import { motion } from "framer-motion"
import { useEffect, useRef, useState } from "react"

import type { CalendarMode, DateRange } from "./bookingLabTypes"
import {
  cn,
  getMonthDays,
  isDateBetween,
  isSameDate,
} from "./bookingLabUtils"

export default function CompactDatePicker({
  mode,
  range,
  singleDate,
  onSelectDate,
  onClose,
}: {
  mode: CalendarMode
  range: DateRange
  singleDate: Date | null
  onSelectDate: (date: Date) => void
  onClose: () => void
}) {
  const pickerRef = useRef<HTMLDivElement | null>(null)

  const [visibleMonth, setVisibleMonth] = useState(() => {
    const today = new Date()
    return new Date(today.getFullYear(), today.getMonth(), 1)
  })

  const [hoverDate, setHoverDate] = useState<Date | null>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (!pickerRef.current) return

      if (!pickerRef.current.contains(event.target as Node)) {
        onClose()
      }
    }

    document.addEventListener("mousedown", handleClickOutside)

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [onClose])

  const secondMonth = new Date(
    visibleMonth.getFullYear(),
    visibleMonth.getMonth() + 1,
    1,
  )

  const activeSelection =
    mode === "range" && range.start && !range.end ? "return" : "departure"

  const rangeEnd = range.end || (activeSelection === "return" ? hoverDate : null)

  function moveMonth(amount: number) {
    setVisibleMonth(
      (current) =>
        new Date(current.getFullYear(), current.getMonth() + amount, 1),
    )
  }

  function renderMonth(monthDate: Date) {
    const days = getMonthDays(monthDate)
    const monthLabel = monthDate.toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    })

    return (
      <div className="min-w-0">
        <p className="text-center text-xs font-bold text-slate-900">
          {monthLabel}
        </p>

        <div className="mt-3 grid grid-cols-7 gap-0.5 text-center text-[10px] font-bold text-slate-400">
          {["S", "M", "T", "W", "T", "F", "S"].map((day) => (
            <div key={day}>{day}</div>
          ))}
        </div>

        <div className="mt-1.5 grid grid-cols-7 gap-0.5">
          {days.map((date, index) => {
            if (!date) {
              return <div key={`empty-${index}`} className="h-7" />
            }

            const isSingleSelected =
              mode === "single" && !!singleDate && isSameDate(date, singleDate)
            const isStart =
              mode === "range" && !!range.start && isSameDate(date, range.start)
            const isEnd =
              mode === "range" && !!range.end && isSameDate(date, range.end)
            const isInRange =
              mode === "range" && isDateBetween(date, range.start, rangeEnd)

            return (
              <button
                key={date.toISOString()}
                type="button"
                onMouseEnter={() => setHoverDate(date)}
                onMouseLeave={() => setHoverDate(null)}
                onClick={() => onSelectDate(date)}
                className={cn(
                  "flex h-7 items-center justify-center rounded-full text-xs font-bold transition",
                  isSingleSelected || isStart || isEnd
                    ? "bg-blue-700 text-white"
                    : isInRange
                      ? "bg-blue-50 text-blue-700"
                      : "text-slate-700 hover:bg-blue-50 hover:text-blue-700",
                )}
              >
                {date.getDate()}
              </button>
            )
          })}
        </div>
      </div>
    )
  }

  return (
    <motion.div
      ref={pickerRef}
      initial={{ opacity: 0, y: 8, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className={cn(
        "absolute left-0 top-full z-50 mt-2 rounded-[1.35rem] border border-slate-200 bg-white p-4 shadow-[0_22px_65px_rgba(15,23,42,0.18)]",
        mode === "range"
          ? "w-[min(640px,calc(100vw-48px))]"
          : "w-[min(320px,calc(100vw-48px))]",
      )}
    >
      <div className="mb-4 flex items-center justify-between">
        <button
          type="button"
          onClick={() => moveMonth(-1)}
          className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-white text-sm text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
          aria-label="Previous month"
        >
          ←
        </button>

        <p className="text-xs font-bold text-slate-900">
          {mode === "range" && activeSelection === "return"
            ? "Select return date"
            : "Select departure date"}
        </p>

        <button
          type="button"
          onClick={() => moveMonth(1)}
          className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-white text-sm text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
          aria-label="Next month"
        >
          →
        </button>
      </div>

      <div
        className={cn(
          "grid gap-5",
          mode === "range" ? "sm:grid-cols-2" : "sm:grid-cols-1",
        )}
      >
        {renderMonth(visibleMonth)}
        {mode === "range" && renderMonth(secondMonth)}
      </div>

      <div className="mt-4 flex justify-end">
        <button
          type="button"
          onClick={onClose}
          className="inline-flex min-h-[36px] items-center justify-center rounded-full border border-slate-200 bg-white px-4 text-xs font-bold text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
        >
          Done
        </button>
      </div>
    </motion.div>
  )
}