"use client"

const travelerMoments = [
  {
    label: "Frequent travelers",
    code: "FREQ",
    quote: "I want Lucy to help me compare the whole trip, not just the fare.",
    title: "Understand the why behind the trip.",
    text: "Lucy can help compare flights, stays, timing, and trip value so every booking decision has more context.",
  },
  {
    label: "Families",
    code: "FAM",
    quote: "I need travel plans that work for how my family actually moves.",
    title: "Plan around real preferences.",
    text: "Lucy can remember nonstop flights, hotel comfort, rental car needs, flexible timing, and family travel style.",
  },
  {
    label: "Business travelers",
    code: "BIZ",
    quote: "I do not want to keep checking the same routes and trip options every day.",
    title: "Monitor important travel calmly.",
    text: "Skysirv helps keep an eye on recurring routes, pricing signals, and planning details so teams can move faster with less noise.",
  },
]

export default function HomepageLabTravelerMoments() {
  return (
    <section className="relative overflow-hidden bg-white px-6 pb-24 pt-2 sm:py-28">
      <div className="relative mx-auto grid max-w-7xl gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <div className="mx-auto max-w-xl text-center lg:mx-0 lg:text-left">
          <h2 className="mt-4 text-4xl font-bold tracking-tight text-slate-800 sm:text-5xl">
            For travelers who want the why behind the trip.
          </h2>

          <p className="mt-6 text-base leading-8 text-slate-700 sm:text-lg">
            Skysirv is built for people who do not just want another list of
            options. Lucy helps bring context, timing, preferences, and full-trip
            planning into the decision before you book.
          </p>
        </div>

        <div className="relative mx-auto w-full max-w-3xl">
          <div className="grid gap-3">
            {travelerMoments.map((item, index) => (
              <article
                key={item.label}
                className="relative overflow-hidden rounded-[1.5rem] border border-slate-200 bg-white shadow-[0_16px_45px_rgba(15,23,42,0.06)]"
              >
                <div className="pointer-events-none absolute left-[112px] top-[-10px] h-5 w-5 rounded-full border border-slate-200 bg-white" />
                <div className="pointer-events-none absolute left-[112px] bottom-[-10px] h-5 w-5 rounded-full border border-slate-200 bg-white" />

                <div className="grid min-h-[104px] grid-cols-[96px_1fr]">
                  <div className="relative flex flex-col justify-between bg-blue-700 px-3 py-3 text-white">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-white">
                        Boarding
                      </p>

                      <p className="mt-2 text-2xl font-bold tracking-tight">
                        {item.code}
                      </p>
                    </div>

                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-cyan-200">
                        Skysirv
                      </p>

                      <p className="mt-1 text-xs font-semibold text-white/75">
                        Lucy guided
                      </p>
                    </div>
                  </div>

                  <div className="relative border-l border-dashed border-slate-200 px-4 py-3 sm:px-5">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                      <div className="min-w-0">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                          {item.label}
                        </p>

                        <p className="mt-2 text-sm font-semibold italic leading-6 text-slate-950 sm:text-base">
                          “{item.quote}”
                        </p>
                      </div>

                      <div className="hidden shrink-0 rounded-full bg-blue-700 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-white sm:block">
                        Seat {index + 1}A
                      </div>
                    </div>

                    <div className="mt-4 grid gap-2 sm:grid-cols-[0.9fr_1.1fr] sm:items-start">
                      <h3 className="text-base font-bold tracking-tight text-slate-800">
                        {item.title}
                      </h3>

                      <p className="text-sm leading-6 text-slate-700">
                        {item.text}
                      </p>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}