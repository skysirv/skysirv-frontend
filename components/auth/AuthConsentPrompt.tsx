"use client"

import Link from "next/link"

type AuthConsentPromptProps = {
  open: boolean
  onCancel: () => void
  onAccept: () => void
}

export default function AuthConsentPrompt({
  open,
  onCancel,
  onAccept,
}: AuthConsentPromptProps) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-[1200] flex items-center justify-center bg-slate-950/35 px-4 backdrop-blur-[2px]">
      <div className="w-full max-w-[360px] rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_24px_70px_rgba(15,23,42,0.22)]">
        <div className="flex items-start gap-3">
          <img
            src="/branding/icon/skysirv-icon-512.png"
            alt="Skysirv"
            className="mt-0.5 h-8 w-8 shrink-0 rounded-xl"
          />

          <div className="min-w-0">
            <p className="text-sm font-semibold leading-6 text-slate-700">
              I agree to Skysirv’s{" "}
              <Link
                href="/terms"
                className="font-bold text-blue-700 underline underline-offset-2 transition hover:text-blue-800"
              >
                Terms
              </Link>{" "}
              and{" "}
              <Link
                href="/privacy"
                className="font-bold text-blue-700 underline underline-offset-2 transition hover:text-blue-800"
              >
                Privacy Policy
              </Link>
              .
            </p>
          </div>
        </div>

        <div className="mt-5 flex justify-end gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="inline-flex min-h-[38px] items-center justify-center rounded-lg border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={onAccept}
            className="inline-flex min-h-[38px] items-center justify-center rounded-lg border border-orange-500 bg-orange-500 px-4 text-sm font-bold text-white transition hover:border-orange-600 hover:bg-orange-600"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  )
}