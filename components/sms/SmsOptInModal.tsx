"use client"

import { useEffect, useMemo, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

const VISITOR_ID_KEY = "skysirv_sms_visitor_id"
const MODAL_STATUS_KEY = "skysirv_sms_modal_status"

type SmsModalStatus = "opted_in" | "dismissed"

type SmsOptInModalProps = {
  sourcePage?: string
  delayMs?: number
}

function createVisitorId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return `visitor-${crypto.randomUUID()}`
  }

  return `visitor-${Date.now()}-${Math.random().toString(36).slice(2)}`
}

function getOrCreateVisitorId() {
  const existingVisitorId = window.localStorage.getItem(VISITOR_ID_KEY)

  if (existingVisitorId) {
    return existingVisitorId
  }

  const visitorId = createVisitorId()
  window.localStorage.setItem(VISITOR_ID_KEY, visitorId)

  return visitorId
}

function getStoredModalStatus() {
  return window.localStorage.getItem(MODAL_STATUS_KEY) as SmsModalStatus | null
}

function storeModalStatus(status: SmsModalStatus) {
  window.localStorage.setItem(MODAL_STATUS_KEY, status)
}

function isValidE164PhoneNumber(phoneNumber: string) {
  return /^\+[1-9]\d{7,14}$/.test(phoneNumber.trim())
}

export default function SmsOptInModal({
  sourcePage = "homepage",
  delayMs = 4200,
}: SmsOptInModalProps) {
  const [open, setOpen] = useState(false)
  const [phoneNumber, setPhoneNumber] = useState("")
  const [error, setError] = useState("")
  const [successMessage, setSuccessMessage] = useState("")
  const [loading, setLoading] = useState(false)

  const apiBaseUrl = useMemo(() => {
    return API_BASE_URL?.replace(/\/$/, "") ?? ""
  }, [])

  useEffect(() => {
    const status = getStoredModalStatus()

    if (status === "opted_in" || status === "dismissed") {
      return
    }

    const timer = window.setTimeout(() => {
      setOpen(true)
    }, delayMs)

    return () => window.clearTimeout(timer)
  }, [delayMs])

  async function dismissModal() {
    setError("")
    setLoading(true)

    const visitorId = getOrCreateVisitorId()
    storeModalStatus("dismissed")
    setOpen(false)

    try {
      await fetch(`${apiBaseUrl}/api/public/sms/dismiss`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          visitorId,
          sourcePage,
        }),
      })
    } catch {
      // Local suppression already happened. Backend logging can safely fail silently here.
    } finally {
      setLoading(false)
    }
  }

  async function subscribeToSms() {
    const cleanedPhoneNumber = phoneNumber.trim()

    setError("")
    setSuccessMessage("")

    if (!isValidE164PhoneNumber(cleanedPhoneNumber)) {
      setError("Enter your phone number with country code, for example +15551234567.")
      return
    }

    setLoading(true)

    try {
      const visitorId = getOrCreateVisitorId()

      const response = await fetch(`${apiBaseUrl}/api/public/sms/subscribe`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          visitorId,
          phoneNumber: cleanedPhoneNumber,
          sourcePage,
        }),
      })

      const data = await response.json().catch(() => null)

      if (!response.ok || !data?.success) {
        throw new Error(data?.error || "Unable to save SMS preference.")
      }

      storeModalStatus("opted_in")
      setSuccessMessage("You’re signed up for Skysirv SMS alerts.")

      window.setTimeout(() => {
        setOpen(false)
      }, 1400)
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to save SMS preference. Please try again."
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="fixed inset-0 z-[90] flex items-center justify-center bg-slate-950/45 px-4 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="sms-opt-in-title"
            className="relative w-full max-w-md overflow-hidden rounded-[2rem] border border-slate-200 bg-white p-6 text-slate-950 shadow-[0_30px_90px_rgba(15,23,42,0.22)]"
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 18, scale: 0.97 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
          >
            <div className="pointer-events-none absolute right-[-60px] top-[-60px] h-44 w-44 rounded-full bg-sky-100 blur-3xl" />
            <div className="pointer-events-none absolute bottom-[-70px] left-[-70px] h-44 w-44 rounded-full bg-indigo-100 blur-3xl" />

            <div className="relative">
              <div className="mb-5 inline-flex items-center rounded-full border border-sky-100 bg-sky-50 px-3 py-1 text-xs font-semibold text-sky-700">
                Skysirv SMS Alerts
              </div>

              <h2
                id="sms-opt-in-title"
                className="text-2xl font-bold tracking-tight text-slate-950"
              >
                Want flight alerts by text?
              </h2>

              <p className="mt-3 text-sm leading-6 text-slate-600">
                Receive Skysirv updates, flight tracking alerts, price movement notices,
                and route intelligence by SMS.
              </p>

              <div className="mt-5">
                <label
                  htmlFor="sms-phone-number"
                  className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500"
                >
                  Phone number
                </label>

                <input
                  id="sms-phone-number"
                  type="tel"
                  value={phoneNumber}
                  onChange={(event) => {
                    setPhoneNumber(event.target.value)
                    setError("")
                  }}
                  placeholder="+15551234567"
                  className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-sky-400 focus:ring-4 focus:ring-sky-100"
                />
              </div>

              <p className="mt-3 text-xs leading-5 text-slate-500">
                By signing up, you agree to receive SMS alerts from Skysirv.
                Message and data rates may apply. Reply STOP to opt out.
              </p>

              {error ? (
                <p className="mt-3 rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {error}
                </p>
              ) : null}

              {successMessage ? (
                <p className="mt-3 rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                  {successMessage}
                </p>
              ) : null}

              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={subscribeToSms}
                  disabled={loading}
                  className="inline-flex flex-1 items-center justify-center rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? "Saving..." : "Send me SMS alerts"}
                </button>

                <button
                  type="button"
                  onClick={dismissModal}
                  disabled={loading}
                  className="inline-flex flex-1 items-center justify-center rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  No thank you
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}