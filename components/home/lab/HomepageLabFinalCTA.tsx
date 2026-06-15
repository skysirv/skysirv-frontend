"use client"

import Link from "next/link"

type HomepageLabFinalCTAProps = {
  onCreateAccountClick?: () => void
}

export default function HomepageLabFinalCTA({
  onCreateAccountClick,
}: HomepageLabFinalCTAProps) {
  return (
    <section className="relative overflow-hidden bg-white px-6 pb-28 pt-16 sm:pb-32 sm:pt-20">
      <div className="relative mx-auto max-w-6xl overflow-hidden rounded-[2.5rem] border border-slate-200 bg-white px-6 py-10 text-center shadow-[0_24px_75px_rgba(15,23,42,0.08)] sm:px-10 sm:py-12">
        <div className="relative mx-auto max-w-3xl">
          <h2 className="mt-4 text-4xl font-bold tracking-tight text-slate-800 sm:text-5xl">
            Let Lucy guide your next trip decision.
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-slate-700 sm:text-lg">
            Start with flights, hotels, car rentals, cruises, or itinerary planning —
            then let Skysirv help you understand the signals before you book.
          </p>

          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/plan-with-lucy/itinerary"
              className="inline-flex min-h-[48px] items-center justify-center rounded-full bg-blue-600 px-6 text-sm font-bold text-white shadow-sm hover:bg-blue-700"
            >
              Start planning your trip
            </Link>

            <button
              type="button"
              onClick={() => {
                if (onCreateAccountClick) {
                  onCreateAccountClick()
                  return
                }

                window.dispatchEvent(
                  new CustomEvent("skysirv-open-auth-modal", {
                    detail: { mode: "signup" },
                  })
                )
              }}
              className="inline-flex min-h-[48px] items-center justify-center rounded-full bg-orange-500 px-6 text-sm font-bold text-white shadow-sm hover:bg-orange-600"
            >
              Create account
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}