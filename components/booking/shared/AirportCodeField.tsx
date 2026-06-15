import { useEffect, useMemo, useRef, useState } from "react"

import type { AirportOption } from "@/lib/airports/major-airports"
import { searchAirports } from "@/lib/airports/major-airports"
import type { FieldIconName } from "./bookingLabTypes"
import FieldIcon from "./FieldIcon"

function getAirportTypeLabel(airport: AirportOption): string {
  if (airport.airportType === "regional") return "Regional"
  if (airport.airportType === "executive") return "Executive"
  if (airport.airportType === "cargo") return "Cargo"
  if (airport.airportType === "reliever") return "Reliever"

  return "Major"
}

function getAirportMetaLabel(airport: AirportOption): string {
  return [airport.region, airport.country].filter(Boolean).join(" · ")
}

function formatSelectedAirportLabel(airport: AirportOption): string {
  return `${airport.name} (${airport.code})`
}

function extractAirportCode(value: string | null | undefined): string | null {
  if (!value) return null

  const normalized = value.trim().toUpperCase()
  const parenthesizedCode = normalized.match(/\(([A-Z0-9]{3})\)/)

  if (parenthesizedCode?.[1]) {
    return parenthesizedCode[1]
  }

  if (/^[A-Z0-9]{3}$/.test(normalized)) {
    return normalized
  }

  return null
}

export default function AirportCodeField({
  placeholder,
  value,
  onChange,
  icon = "search",
  excludeCode,
}: {
  placeholder: string
  value: string
  onChange: (value: string) => void
  icon?: FieldIconName
  excludeCode?: string | null
}) {
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLLabelElement | null>(null)

  const normalizedExcludeCode = extractAirportCode(excludeCode)

  const results = useMemo(() => {
    const query = value.trim()

    if (query.length < 2) return []

    return searchAirports(query)
      .filter((airport) => airport.code !== normalizedExcludeCode)
      .slice(0, 8)
  }, [normalizedExcludeCode, value])

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (!containerRef.current) return

      if (!containerRef.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  return (
    <label ref={containerRef} className="relative block">
      <span className="pointer-events-none absolute left-4 top-1/2 flex -translate-y-1/2 text-blue-700">
        <FieldIcon name={icon} />
      </span>

      <input
        type="text"
        value={value}
        onFocus={() => {
          if (value.trim().length >= 2) {
            setOpen(true)
          }
        }}
        onChange={(event) => {
          const nextValue = event.target.value
          onChange(nextValue)
          setOpen(nextValue.trim().length >= 2)
        }}
        placeholder={placeholder}
        autoComplete="off"
        className="h-[58px] w-full rounded-2xl border border-slate-200 bg-white py-2 pl-12 pr-4 text-sm font-semibold text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-200 focus:ring-4 focus:ring-blue-100"
      />

      {open ? (
        <div className="absolute left-0 top-full z-50 mt-2 w-full min-w-[min(420px,calc(100vw-48px))] overflow-hidden rounded-[1.25rem] border border-slate-200 bg-white p-2 shadow-[0_22px_60px_rgba(15,23,42,0.14)]">
          <div className="max-h-80 overflow-y-auto pr-1">
            {results.length ? (
              <div className="space-y-1">
                {results.map((airport) => (
                  <button
                    key={airport.code}
                    type="button"
                    onClick={() => {
                      onChange(formatSelectedAirportLabel(airport))
                      setOpen(false)
                    }}
                    className="flex w-full items-start justify-between gap-4 rounded-2xl px-4 py-3 text-left transition hover:bg-blue-50"
                  >
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-sm font-black text-slate-950">
                          {airport.code}
                        </span>

                        <span className="text-sm font-bold text-slate-800">
                          {airport.city}
                        </span>

                        <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-black uppercase tracking-[0.12em] text-slate-500">
                          {getAirportTypeLabel(airport)}
                        </span>
                      </div>

                      <p className="mt-1 truncate text-xs font-semibold text-slate-500">
                        {airport.displayName ?? airport.name}
                      </p>
                    </div>

                    <span className="shrink-0 pt-0.5 text-right text-[10px] font-black uppercase tracking-[0.14em] text-slate-400">
                      {getAirportMetaLabel(airport)}
                    </span>
                  </button>
                ))}
              </div>
            ) : (
              <div className="rounded-2xl px-4 py-4 text-sm font-semibold text-slate-500">
                No matching airports found.
              </div>
            )}
          </div>
        </div>
      ) : null}
    </label>
  )
}