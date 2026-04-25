"use client"

import { useState } from "react"

type FeedbackModalProps = {
  open: boolean
  onClose: () => void
  onSubmit?: (payload: { rating: number; message: string }) => void
}

export default function FeedbackModal({
  open,
  onClose,
  onSubmit,
}: FeedbackModalProps) {
  const [rating, setRating] = useState(0)
  const [message, setMessage] = useState("")

  if (!open) return null

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault()

    onSubmit?.({
      rating,
      message,
    })

    setRating(0)
    setMessage("")
    onClose()
  }

  return (
    <div
      className="fixed inset-0 z-[1200] flex items-center justify-center bg-black/50 px-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">
              Share your feedback
            </h2>
            <p className="mt-1 text-sm leading-6 text-slate-600">
              Help us improve the Skysirv experience during beta.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close feedback modal"
            className="rounded-full border border-slate-200 px-3 py-1.5 text-sm text-slate-500 transition hover:bg-slate-50 hover:text-slate-900"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div>
            <p className="mb-2 text-sm font-medium text-slate-700">
              How would you rate your experience?
            </p>

            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  aria-label={`Rate ${star} star${star === 1 ? "" : "s"}`}
                  className={`text-3xl transition ${star <= rating
                      ? "text-amber-400"
                      : "text-slate-300 hover:text-amber-300"
                    }`}
                >
                  ★
                </button>
              ))}
            </div>
          </div>

          <div className="mt-5">
            <label className="mb-2 block text-sm font-medium text-slate-700">
              What should we improve?
            </label>

            <textarea
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              placeholder="Tell us what worked, what felt confusing, or what you would love to see next..."
              rows={5}
              className="w-full resize-none rounded-2xl border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10"
            />
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={!rating || !message.trim()}
              className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              Submit feedback
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}