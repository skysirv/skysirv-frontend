"use client"

import { useEffect, useRef, useState } from "react"

import {
  currencyOptions,
  defaultCurrencyCode,
  defaultRegionId,
  getCurrencyByCode,
  getRegionById,
  regionOptions,
} from "@/components/shared/regionCurrencyOptions"

type ActivePicker = "region" | "currency" | null

type RegionCurrencyPickerProps = {
  className?: string
}

export default function RegionCurrencyPicker({
  className = "",
}: RegionCurrencyPickerProps) {
  const [regionMenuOpen, setRegionMenuOpen] = useState(false)
  const [activePicker, setActivePicker] = useState<ActivePicker>(null)
  const [selectedRegionId, setSelectedRegionId] = useState(defaultRegionId)
  const [selectedCurrencyCode, setSelectedCurrencyCode] =
    useState(defaultCurrencyCode)

  const regionMenuRef = useRef<HTMLDivElement | null>(null)

  const selectedRegion = getRegionById(selectedRegionId)
  const selectedCurrency = getCurrencyByCode(selectedCurrencyCode)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (!regionMenuRef.current) return

      if (!regionMenuRef.current.contains(event.target as Node)) {
        setRegionMenuOpen(false)
        setActivePicker(null)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  function toggleMainMenu() {
    setRegionMenuOpen((current) => {
      const nextOpen = !current

      if (!nextOpen) {
        setActivePicker(null)
      }

      return nextOpen
    })
  }

  function togglePicker(picker: Exclude<ActivePicker, null>) {
    setActivePicker((current) => (current === picker ? null : picker))
  }

  return (
    <div
      ref={regionMenuRef}
      className={`relative ${className}`}
      onMouseDown={(event) => event.stopPropagation()}
    >
      <button
        type="button"
        onClick={toggleMainMenu}
        className="inline-flex min-h-[38px] items-center gap-2 rounded-lg border border-slate-200 bg-white/95 px-3 text-sm font-bold text-slate-700 shadow-sm backdrop-blur-xl transition hover:bg-white"
        aria-expanded={regionMenuOpen}
      >
        <span
          aria-hidden="true"
          className={`fi fi-${selectedRegion.flagCode} rounded-[2px]`}
          style={{ width: "20px", height: "15px" }}
        />

        <span>{selectedCurrency.code}</span>

        <svg
          viewBox="0 0 20 20"
          aria-hidden="true"
          className={`h-4 w-4 text-slate-400 transition-transform ${regionMenuOpen ? "rotate-180" : ""
            }`}
          fill="none"
        >
          <path
            d="M5.5 7.5 10 12l4.5-4.5"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {regionMenuOpen && (
        <div className="absolute right-0 top-full z-50 mt-2 w-[330px] rounded-2xl border border-slate-200 bg-white p-4 text-left shadow-[0_22px_60px_rgba(15,23,42,0.14)]">
          <div>
            <p className="text-sm font-bold text-slate-800">
              Country / Region
            </p>

            <button
              type="button"
              onClick={() => togglePicker("region")}
              className={`mt-3 flex min-h-[42px] w-full items-center justify-between rounded-xl border px-3 text-sm font-medium transition ${activePicker === "region"
                ? "border-orange-200 ring-2 ring-orange-100"
                : "border-slate-200 hover:border-slate-300"
                }`}
            >
              <span className="inline-flex items-center gap-3">
                <span
                  aria-hidden="true"
                  className={`fi fi-${selectedRegion.flagCode} rounded-[2px]`}
                  style={{ width: "20px", height: "15px" }}
                />
                <span className="text-slate-700">
                  {selectedRegion.countryName}
                </span>
              </span>

              <svg
                viewBox="0 0 20 20"
                aria-hidden="true"
                className={`h-4 w-4 text-slate-400 transition-transform ${activePicker === "region" ? "rotate-180" : ""
                  }`}
                fill="none"
              >
                <path
                  d="M5.5 7.5 10 12l4.5-4.5"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>

            {activePicker === "region" && (
              <div className="mt-2 max-h-[230px] overflow-y-auto rounded-xl border border-slate-200 bg-white py-1 shadow-[0_12px_35px_rgba(15,23,42,0.08)]">
                {regionOptions.map((region) => {
                  const isSelected = region.id === selectedRegion.id

                  return (
                    <button
                      key={region.id}
                      type="button"
                      onClick={() => {
                        setSelectedRegionId(region.id)
                        setSelectedCurrencyCode(region.defaultCurrencyCode)
                        setActivePicker(null)
                      }}
                      className={`flex min-h-[42px] w-full items-center gap-3 px-3 text-sm font-medium transition ${isSelected
                        ? "bg-slate-50 text-slate-900"
                        : "text-slate-700 hover:bg-slate-50"
                        }`}
                    >
                      <span
                        aria-hidden="true"
                        className={`fi fi-${region.flagCode} rounded-[2px]`}
                        style={{ width: "20px", height: "15px" }}
                      />

                      <span>{region.countryName}</span>
                    </button>
                  )
                })}
              </div>
            )}
          </div>

          <div className="mt-5">
            <p className="text-sm font-bold text-slate-800">Currency</p>

            <button
              type="button"
              onClick={() => togglePicker("currency")}
              className={`mt-3 flex min-h-[42px] w-full items-center justify-between rounded-xl border px-3 text-sm font-medium transition ${activePicker === "currency"
                ? "border-slate-300 ring-2 ring-slate-100"
                : "border-slate-200 hover:border-slate-300"
                }`}
            >
              <span className="text-slate-700">
                {selectedCurrency.code} - {selectedCurrency.name}
              </span>

              <svg
                viewBox="0 0 20 20"
                aria-hidden="true"
                className={`h-4 w-4 text-slate-400 transition-transform ${activePicker === "currency" ? "rotate-180" : ""
                  }`}
                fill="none"
              >
                <path
                  d="M5.5 7.5 10 12l4.5-4.5"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>

            {activePicker === "currency" && (
              <div className="mt-2 max-h-[190px] overflow-y-auto rounded-xl border border-slate-200 bg-white py-1 shadow-[0_12px_35px_rgba(15,23,42,0.08)]">
                {currencyOptions.map((currency) => {
                  const isSelected = currency.code === selectedCurrency.code

                  return (
                    <button
                      key={currency.code}
                      type="button"
                      onClick={() => {
                        setSelectedCurrencyCode(currency.code)
                        setActivePicker(null)
                      }}
                      className={`flex min-h-[42px] w-full items-center px-3 text-sm font-medium transition ${isSelected
                        ? "bg-slate-50 text-slate-900"
                        : "text-slate-700 hover:bg-slate-50"
                        }`}
                    >
                      {currency.code} - {currency.name}
                    </button>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}