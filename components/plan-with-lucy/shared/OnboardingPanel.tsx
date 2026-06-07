"use client"

import { useRef, useState } from "react"
import { motion } from "framer-motion"
import AuthPanel from "@/components/auth/AuthPanel"
import AuthConsentPrompt from "@/components/auth/AuthConsentPrompt"

type AuthSuccessPayload = {
  token: string
  user: {
    is_admin?: boolean
    [key: string]: any
  }
}

type OnboardingPanelProps = {
  onClose: () => void
  onSigninComplete?: (payload: AuthSuccessPayload) => void
  onSignupComplete?: () => void
}

export default function OnboardingPanel({
  onClose,
  onSigninComplete,
  onSignupComplete,
}: OnboardingPanelProps) {
  const [consentAccepted, setConsentAccepted] = useState(false)
  const [consentPromptOpen, setConsentPromptOpen] = useState(false)
  const pendingConsentActionRef = useRef<(() => void) | null>(null)

  function handleRequestConsent(afterAccept: () => void) {
    pendingConsentActionRef.current = afterAccept
    setConsentPromptOpen(true)
  }

  function handleAcceptConsent() {
    setConsentAccepted(true)
    setConsentPromptOpen(false)

    const pendingAction = pendingConsentActionRef.current
    pendingConsentActionRef.current = null

    pendingAction?.()
  }

  function handleCancelConsent() {
    pendingConsentActionRef.current = null
    setConsentPromptOpen(false)
  }

  return (
    <>
      <motion.aside
        initial={{ opacity: 0, x: 24 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 24 }}
        transition={{ duration: 0.32, ease: "easeOut" }}
        className="fixed right-6 top-20 z-40 hidden h-[calc(100vh-7.25rem)] w-[420px] xl:block"
      >
        <div className="relative h-full overflow-hidden rounded-[1.85rem] p-[3px] shadow-[0_28px_90px_rgba(15,23,42,0.14)]">
          <div
            aria-hidden="true"
            className="absolute inset-[-80%] animate-[spin_12s_linear_infinite] bg-[conic-gradient(from_90deg,transparent_0deg,rgba(34,211,238,0.95)_35deg,rgba(59,130,246,0.95)_90deg,rgba(168,85,247,0.95)_145deg,rgba(236,72,153,0.95)_205deg,rgba(251,146,60,0.95)_265deg,rgba(34,197,94,0.95)_325deg,transparent_360deg)] opacity-90"
          />

          <div className="relative flex h-full flex-col overflow-hidden rounded-[calc(1.85rem-3px)] bg-white">
            <div className="relative h-40 shrink-0 overflow-hidden bg-slate-100">
              <div
                className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                style={{
                  backgroundImage: "url('/images/stock/onboarding-hero.jpg')",
                }}
              />

              <div className="absolute inset-0 bg-gradient-to-br from-slate-950/10 via-slate-950/10 to-blue-700/25" />

              <button
                type="button"
                onClick={onClose}
                className="absolute right-5 top-5 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-white/85 text-2xl leading-none text-slate-500 shadow-sm backdrop-blur-xl transition hover:bg-white hover:text-slate-900"
                aria-label="Close onboarding panel"
              >
                ×
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-4 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              <div className="mb-3">
                <h2 className="mt-1 text-2xl font-bold tracking-tight text-orange-500">
                  Unlock smarter planning.
                </h2>

                <div className="mt-3 space-y-2 text-sm leading-5 text-slate-700">
                  <p>✓ Save planning sessions to your Skysirv dashboard.</p>
                  <p>✓ Let Lucy remember preferences across future trips.</p>
                  <p>✓ Continue into itinerary, flight, hotel, car, and cruise planning.</p>
                </div>
              </div>

              <AuthPanel
                requireConsent
                consentAccepted={consentAccepted}
                onRequestConsent={handleRequestConsent}
                onSigninComplete={(payload) => {
                  window.dispatchEvent(new Event("skysirv-auth-changed"))

                  if (onSigninComplete) {
                    onSigninComplete(payload)
                    return
                  }

                  onClose()
                }}
                onSignupComplete={() => {
                  if (onSignupComplete) {
                    onSignupComplete()
                    return
                  }

                  onClose()
                }}
              />
            </div>
          </div>
        </div>
      </motion.aside>

      <AuthConsentPrompt
        open={consentPromptOpen}
        onCancel={handleCancelConsent}
        onAccept={handleAcceptConsent}
      />
    </>
  )
}