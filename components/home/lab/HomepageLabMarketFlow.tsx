"use client"

const marketCards = [
  {
    route: "Boston",
    image: "/images/stock/market-boston.jpg",
    label: "BOS",
    price: "$214",
  },
  {
    route: "Miami",
    image: "/images/stock/market-miami.jpg",
    label: "MIA",
    price: "$198",
  },
  {
    route: "Paris",
    image: "/images/stock/market-paris.jpg",
    label: "CDG",
    price: "$458",
  },
]

export default function HomepageLabMarketFlow() {
  return (
    <section className="relative hidden overflow-hidden bg-white px-6 pb-24 pt-6 sm:block sm:pb-28 sm:pt-8">
      <div className="relative mx-auto max-w-7xl">
        <div className="mx-auto hidden max-w-4xl text-center sm:block">
          <h2 className="text-4xl font-bold tracking-tight text-slate-800 sm:text-5xl lg:text-6xl">
            How Skysirv reads travel signals.
          </h2>

          <p className="mt-6 text-base leading-8 text-slate-700 sm:text-lg">
            Lucy helps turn changing prices, availability, timing, and trip context
            into clearer signals, so travelers can understand what is worth watching,
            comparing, or booking with more confidence.
          </p>
        </div>

        <div className="mx-auto mt-0 grid max-w-6xl gap-14 sm:mt-20 lg:grid-cols-[0.82fr_1.18fr] lg:items-center">
          <div className="mx-auto max-w-xl text-center lg:mx-0 lg:text-left">
            <h3 className="mt-4 text-3xl font-bold tracking-tight text-slate-800 sm:text-5xl">
              Plan travel without chasing every price change.
            </h3>

            <p className="mt-6 text-base leading-8 text-slate-700 sm:text-lg">
              Skysirv is designed to help Lucy compare travel behavior across flights,
              stays, car rentals, cruises, and itinerary timing — so the signal feels
              clear before you book.
            </p>

            <p className="mt-6 text-base leading-8 text-slate-700 sm:text-lg">
              Instead of giving travelers another wall of options, Lucy turns travel
              movement into simple guidance: watch, compare, wait, adjust the plan,
              or review a stronger opportunity.
            </p>
          </div>

          <div className="relative mx-auto h-[430px] w-full max-w-3xl sm:h-[500px] lg:translate-y-10">
            <div className="absolute left-[4%] top-[9%] z-10 h-[64%] w-[44%] overflow-hidden rounded-[1.75rem] bg-slate-200 shadow-[0_24px_70px_rgba(15,23,42,0.18)]">
              <MarketImageCard item={marketCards[0]} />
            </div>

            <div className="absolute left-[35%] top-[19%] z-20 h-[60%] w-[42%] overflow-hidden rounded-[1.75rem] bg-slate-200 shadow-[0_24px_70px_rgba(15,23,42,0.20)]">
              <MarketImageCard item={marketCards[1]} />
            </div>

            <div className="absolute right-[2%] top-[4%] z-30 h-[67%] w-[38%] overflow-hidden rounded-[1.75rem] bg-slate-200 shadow-[0_24px_70px_rgba(15,23,42,0.18)]">
              <MarketImageCard item={marketCards[2]} />
            </div>

            <svg
              viewBox="0 0 700 420"
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 z-30 h-full w-full"
              fill="none"
            >
              <path
                d="M118 238 C215 292, 328 292, 432 240 C510 202, 582 214, 632 250"
                stroke="white"
                strokeWidth="3.2"
                strokeLinecap="round"
                strokeDasharray="2 13"
                className="drop-shadow-[0_3px_8px_rgba(2,6,23,0.48)]"
              />

              <circle
                cx="118"
                cy="238"
                r="6"
                fill="white"
                className="drop-shadow-[0_3px_8px_rgba(2,6,23,0.45)]"
              />

              <circle
                cx="432"
                cy="240"
                r="6"
                fill="white"
                className="drop-shadow-[0_3px_8px_rgba(2,6,23,0.45)]"
              />

              <circle
                cx="632"
                cy="250"
                r="6"
                fill="white"
                className="drop-shadow-[0_3px_8px_rgba(2,6,23,0.45)]"
              />

              <text
                x="286"
                y="287"
                fill="white"
                fontSize="22"
                fontWeight="700"
                className="drop-shadow-[0_3px_8px_rgba(2,6,23,0.5)]"
                transform="rotate(-8 286 287)"
              >
                ✈
              </text>
            </svg>

            <div className="absolute left-[26%] top-[76%] z-40 flex items-center gap-2">
              <div className="rounded-xl border border-white/40 bg-white/85 px-4 py-3 text-slate-950 shadow-xl backdrop-blur-xl">
                <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                  Lucy signal
                </p>

                <p className="mt-1 whitespace-nowrap text-sm font-semibold italic leading-5 text-slate-900">
                  “Miami is showing a stronger trip-value signal right now.”
                </p>
              </div>

              <img
                src="/images/stock/lucy/lucy-signal-pointing.png"
                alt="Lucy pointing to the signal"
                className="h-36 w-36 shrink-0 object-contain drop-shadow-[0_14px_28px_rgba(15,23,42,0.22)]"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function MarketImageCard({
  item,
}: {
  item: {
    route: string
    image: string
    label: string
    price: string
  }
}) {
  return (
    <div className="relative h-full w-full">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat brightness-[0.82]"
        style={{ backgroundImage: `url('${item.image}')` }}
      />

      <div className="absolute inset-0 bg-gradient-to-b from-slate-950/15 via-transparent to-slate-950/60" />

      <div className="relative z-10 flex h-full flex-col justify-end p-5 text-white">
        <div>
          <h4 className="text-2xl font-bold drop-shadow-[0_3px_12px_rgba(2,6,23,0.45)]">
            {item.route}
          </h4>

          <p className="mt-1 text-sm font-semibold text-white/90 drop-shadow-[0_3px_12px_rgba(2,6,23,0.45)]">
            From {item.price}
          </p>
        </div>
      </div>
    </div>
  )
}