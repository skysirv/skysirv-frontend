"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useRef, useState } from "react"
import { getAuthToken } from "@/utils/auth-storage"

import {
  currencyOptions,
  defaultCurrencyCode,
  defaultRegionId,
  getCurrencyByCode,
  getRegionById,
  regionOptions,
} from "@/components/plan-smarter/shared/regionCurrencyOptions"
import OnboardingPanel from "@/components/plan-with-lucy/shared/OnboardingPanel"

type ActivePicker = "region" | "currency" | null

export default function PlanSmarterLabShell() {
  const router = useRouter()
  const [showOnboardingPanel, setShowOnboardingPanel] = useState(true)
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

  function handleAskLucyClick() {
    const token = getAuthToken()

    if (!token) {
      setShowOnboardingPanel(true)
      return
    }

    router.push("/dev/lucy-trip-lab")
  }

  return (
    <main className="h-screen overflow-hidden bg-white text-slate-950">
      <section className="relative h-screen overflow-hidden bg-white px-5 pb-10 pt-10 sm:px-8">
        <Link
          href="/dev/homepage-lab"
          className="fixed left-5 top-5 z-50 inline-flex min-h-[42px] items-center gap-2 rounded-full border border-blue-700 bg-blue-700 px-4 text-sm font-bold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-blue-600"
        >
          <span aria-hidden="true">←</span>
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

        <div className="fixed right-5 top-5 z-50 flex items-start gap-3">
          <div
            ref={regionMenuRef}
            className="relative"
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
                        const isSelected =
                          currency.code === selectedCurrency.code

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

          <button
            type="button"
            onClick={() => setShowOnboardingPanel(true)}
            className="inline-flex min-h-[38px] items-center justify-center rounded-lg border border-blue-700 bg-blue-700 px-4 text-sm font-bold text-white shadow-sm transition hover:-translate-y-0.5 hover:border-blue-600 hover:bg-blue-600"
          >
            Sign in
          </button>
        </div>

        <div className="mx-auto flex h-full max-w-4xl flex-col justify-start pt-[48px]">
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
              href="/dev/plan-with-lucy-lab/itinerary"
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
                href="/dev/booking-lab/flights"
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
                href="/dev/booking-lab/hotels"
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
              className="group flex min-h-[310px] flex-col rounded-[1.75rem] border border-slate-100 bg-white p-6 text-left shadow-[0_22px_65px_rgba(15,23,42,0.07)] transition hover:-translate-y-1 hover:shadow-[0_28px_80px_rgba(15,23,42,0.12)]"
            >
              <h2 className="text-xl font-bold text-slate-900">Ask Lucy</h2>

              <p className="mt-2 text-sm leading-6 text-slate-600">
                Let Lucy suggest the best starting point based on your trip goals.
              </p>

              <div className="flex flex-1 items-center justify-center pt-5">
                <img
                  src="/images/stock/plan-smarter/not-sure-icon.png"
                  alt=""
                  aria-hidden="true"
                  className="h-50 w-50 object-contain transition group-hover:scale-105"
                />
              </div>
            </button>
          </div>
        </div>

        <div className="fixed bottom-6 left-1/2 z-40 w-[min(760px,calc(100vw-40px))] -translate-x-1/2">
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
              onClick={() => setShowOnboardingPanel(true)}
              className="inline-flex min-h-[42px] shrink-0 items-center justify-center rounded-lg border border-orange-500 bg-orange-500 px-5 text-sm font-bold text-white shadow-sm transition hover:-translate-y-0.5 hover:border-orange-600 hover:bg-orange-600"
            >
              Sign up now
            </button>
          </div>
        </div>

        {showOnboardingPanel && (
          <OnboardingPanel onClose={() => setShowOnboardingPanel(false)} />
        )}
      </section>
    </main>
  )
}