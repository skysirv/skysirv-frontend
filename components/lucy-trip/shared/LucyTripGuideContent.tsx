import LucyTripSectionNav from "@/components/lucy-trip/shared/LucyTripSectionNav"
import LucyTripStatusCard from "@/components/lucy-trip/shared/LucyTripStatusCard"

export default function LucyTripGuideContent() {
  return (
    <div className="h-full overflow-y-auto px-2 pb-40 pt-[88px] [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      <div className="mx-auto max-w-[760px]">
        <div className="space-y-9">
          <div className="relative">
            <div className="absolute -left-14 top-0 flex h-9 w-9 items-center justify-center rounded-full bg-emerald-700 text-sm font-bold text-white">
              A
            </div>

            <p className="pt-1 text-sm font-medium leading-7 text-slate-700">
              I want to make a trip plan. What is the first step for me?
            </p>
          </div>

          <div className="relative">
            <div className="absolute -left-14 top-0 flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-orange-400 to-yellow-300 text-lg font-bold text-white shadow-sm">
              L
            </div>

            <div className="w-full pt-1">
              <LucyTripStatusCard />

              <div className="relative mt-8">
                <LucyTripSectionNav />

                <article className="space-y-8 text-slate-800">
                  <section>
                    <h2 className="flex items-center gap-2 text-2xl font-extrabold tracking-tight text-emerald-500">
                      <span aria-hidden="true">◆</span>
                      Trip direction
                    </h2>

                    <p className="mt-3 text-sm leading-7 text-slate-600">
                      The smartest first step is to give Lucy one anchor for the
                      trip. That anchor can be a destination, date range, budget,
                      airport, hotel style, food preference, or the overall vibe
                      you want the trip to have.
                    </p>

                    <div className="mt-5 overflow-hidden rounded-xl border border-slate-200">
                      <div className="grid grid-cols-3 bg-slate-50 text-sm font-bold text-slate-700">
                        <div className="px-4 py-3">Planning layer</div>
                        <div className="px-4 py-3">Lucy reviews</div>
                        <div className="px-4 py-3">Skysirv value</div>
                      </div>

                      <div className="grid grid-cols-3 border-t border-slate-200 text-sm text-slate-600">
                        <div className="px-4 py-3 font-semibold text-slate-800">
                          Destination fit
                        </div>
                        <div className="px-4 py-3">
                          Season, distance, traveler style, timing
                        </div>
                        <div className="px-4 py-3">
                          Keeps the trip realistic and useful
                        </div>
                      </div>

                      <div className="grid grid-cols-3 border-t border-slate-200 text-sm text-slate-600">
                        <div className="px-4 py-3 font-semibold text-slate-800">
                          Flight path
                        </div>
                        <div className="px-4 py-3">
                          Routes, stops, airports, timing friction
                        </div>
                        <div className="px-4 py-3">
                          Helps avoid bad connection choices
                        </div>
                      </div>

                      <div className="grid grid-cols-3 border-t border-slate-200 text-sm text-slate-600">
                        <div className="px-4 py-3 font-semibold text-slate-800">
                          Stay strategy
                        </div>
                        <div className="px-4 py-3">
                          Neighborhoods, access, comfort, trip rhythm
                        </div>
                        <div className="px-4 py-3">
                          Makes the itinerary easier to follow
                        </div>
                      </div>
                    </div>

                    <p className="mt-5 text-sm leading-7 text-slate-600">
                      A strong Lucy prompt does not need to be perfect. Start
                      with what you know, and Lucy can help fill in the missing
                      pieces.
                    </p>
                  </section>

                  <section>
                    <h2 className="flex items-center gap-2 text-2xl font-extrabold tracking-tight text-orange-500">
                      <span aria-hidden="true">◇</span>
                      Travel profile
                    </h2>

                    <p className="mt-3 text-sm leading-7 text-slate-600">
                      Before Lucy recommends flights, hotels, restaurants, or
                      daily plans, she should understand what kind of trip you
                      are actually trying to build.
                    </p>

                    <div className="mt-5 space-y-3 text-sm leading-7 text-slate-600">
                      <p>
                        <span className="font-bold text-slate-900">
                          Comfort check:
                        </span>{" "}
                        Are you trying to minimize cost, protect convenience,
                        avoid stressful connections, or balance all three?
                      </p>

                      <p>
                        <span className="font-bold text-slate-900">
                          Better starting prompt:
                        </span>{" "}
                        “Lucy, help me shape this trip around my budget, timing,
                        comfort level, and preferred travel style.”
                      </p>
                    </div>
                  </section>

                  <section>
                    <h2 className="flex items-center gap-2 text-2xl font-extrabold tracking-tight text-blue-600">
                      <span aria-hidden="true">✈</span>
                      Flight angle
                    </h2>

                    <p className="mt-3 text-sm leading-7 text-slate-600">
                      Once Lucy understands the trip direction, she can help
                      think through airport choices, routing options, trip dates,
                      and whether the flight plan supports the rest of the trip
                      instead of fighting against it.
                    </p>
                  </section>
                </article>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}