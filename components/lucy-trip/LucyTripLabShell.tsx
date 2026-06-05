"use client"

import Link from "next/link"

export default function LucyTripLabShell() {
  return (
    <main className="h-screen overflow-hidden bg-white text-slate-950">
      <section className="relative h-screen overflow-hidden bg-white px-5 pb-10 pt-5 sm:px-8">
        <div className="fixed left-5 top-5 z-50 flex items-center gap-3">
          <Link
            href="/dev/plan-smarter-lab"
            className="inline-flex min-h-[38px] items-center gap-2 rounded-full border border-blue-700 bg-blue-700 px-4 text-sm font-bold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-blue-600"
          >
            <span aria-hidden="true">←</span>
            Plan smarter
          </Link>

          <div className="hidden items-center gap-2 sm:flex">
            <span className="text-sm font-bold text-slate-800">
              Lucy Trip Guide
            </span>

            <button
              type="button"
              className="inline-flex min-h-[32px] items-center gap-2 rounded-lg border border-orange-100 bg-orange-50 px-3 text-xs font-bold text-orange-700 transition hover:bg-orange-100"
            >
              Share
            </button>
          </div>
        </div>

        <aside className="hidden lg:block">
          <div className="fixed left-4 top-1/2 z-40 flex -translate-y-1/2 flex-col items-center gap-5 rounded-3xl border border-slate-200 bg-white px-3 py-5 shadow-[0_18px_45px_rgba(15,23,42,0.10)]">
            <button
              type="button"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-700 text-xl font-bold text-white shadow-sm"
              aria-label="Lucy trip workspace"
              title="Lucy trip workspace"
            >
              *
            </button>

            <div className="h-px w-8 bg-slate-200" />

            <button
              type="button"
              className="flex flex-col items-center gap-1 text-slate-700 transition hover:text-slate-950"
              aria-label="Start a new trip chat"
              title="Start a new trip chat"
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
              aria-label="Trip history will be available later"
              title="Trip history will be available later"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-lg">
                ◷
              </span>
              <span className="text-[11px] font-semibold">History</span>
            </button>
          </div>
        </aside>

        <div className="fixed right-5 top-5 z-50 flex items-center gap-3">
          <button
            type="button"
            className="inline-flex min-h-[38px] items-center gap-2 rounded-lg border border-slate-200 bg-white/95 px-3 text-sm font-bold text-slate-700 shadow-sm backdrop-blur-xl transition hover:bg-white"
          >
            <span
              aria-hidden="true"
              className="fi fi-us rounded-[2px]"
              style={{ width: "20px", height: "15px" }}
            />
            USD
            <span aria-hidden="true" className="text-slate-400">
              ⌄
            </span>
          </button>

          <button
            type="button"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-700 text-sm font-bold text-white shadow-sm"
            aria-label="Account"
            title="Account"
          >
            A
          </button>
        </div>

        <div className="mx-auto flex h-full max-w-3xl flex-col pt-[92px]">
          <div className="space-y-8">
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-700 text-sm font-bold text-white">
                A
              </div>

              <div className="rounded-2xl bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700 shadow-sm">
                I want to make a trip plan. What is the first step for me?
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-orange-400 to-yellow-300 text-lg font-bold text-white shadow-sm">
                *
              </div>

              <div className="w-full rounded-2xl bg-slate-50 px-5 py-4 shadow-sm">
                <div className="space-y-3 text-sm font-medium text-slate-500">
                  <p>Lucy is preparing your trip intelligence...</p>
                  <p>Flights recommendation ready</p>
                  <p>Destination and timing ideas ready</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="fixed bottom-6 left-1/2 z-50 w-[min(760px,calc(100vw-40px))] -translate-x-1/2">
          <div className="rounded-[1.35rem] border border-slate-200 bg-white p-3 shadow-[0_18px_55px_rgba(15,23,42,0.16)]">
            <textarea
              placeholder="Type your needs"
              rows={2}
              className="min-h-[46px] w-full resize-none rounded-xl border-0 bg-transparent px-2 py-2 text-sm font-medium leading-6 text-slate-800 outline-none placeholder:text-slate-400"
            />

            <div className="mt-2 flex flex-wrap items-center gap-2">
              <button
                type="button"
                className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-50 text-lg text-orange-500"
                aria-label="Voice input"
              >
                ◉
              </button>

              <span className="inline-flex min-h-[30px] items-center gap-1 rounded-full border border-slate-200 bg-slate-50 px-3 text-xs font-semibold text-slate-500">
                Deep Planning
                <span aria-hidden="true">🔒</span>
              </span>

              <span className="inline-flex min-h-[30px] items-center rounded-full border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700">
                Trip Guide
              </span>

              <span className="inline-flex min-h-[30px] items-center rounded-full border border-orange-100 bg-orange-50 px-3 text-xs font-semibold text-orange-700">
                Tools
              </span>

              <button
                type="button"
                className="ml-auto flex h-10 w-10 items-center justify-center rounded-full bg-blue-700 text-lg font-bold text-white shadow-sm transition hover:bg-blue-800"
                aria-label="Send to Lucy"
              >
                →
              </button>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}