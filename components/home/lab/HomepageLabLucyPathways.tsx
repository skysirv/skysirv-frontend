"use client"

const pathwayItems = [
  {
    title: "Find smarter flight options.",
    text: "Search flights when you are ready to book, then let Lucy help you think beyond price alone.",
    image: "/images/stock/find-flights.jpg",
  },
  {
    title: "Compare stays with more context.",
    text: "Explore hotels by location, comfort, flexibility, and total trip value — not just the nightly rate.",
    image: "/images/stock/track-route-2.jpg",
  },
  {
    title: "Plan the right rental car.",
    text: "Think through airport pickup, city pickup, timing, flexibility, and the real cost of getting around.",
    image: "/images/stock/fare-movement.jpg",
  },
  {
    title: "Book cruises with confidence.",
    text: "Use Lucy to think through cruise timing, departure ports, cabin choices, and trip flow before you commit.",
    image: "/images/stock/cruise-booking.jpg",
  },
  {
    title: "Generate the full itinerary.",
    text: "Bring flights, stays, cars, cruises, and activities together into a calmer, smarter travel plan.",
    image: "/images/stock/travel-style.jpg",
  },
]

export default function HomepageLabLucyPathways() {
  return (
    <section className="relative overflow-hidden bg-white px-6 pb-12 pt-14 sm:pb-16 sm:pt-28">
      <div className="relative mx-auto max-w-7xl">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-4xl font-bold tracking-tight text-slate-800 sm:text-5xl lg:text-6xl">
            Let Lucy guide the way you travel.
          </h2>

          <p className="mx-auto mt-6 max-w-3xl text-base leading-6 text-slate-700 sm:text-lg">
            From flights and hotels to car rentals, cruises, and complete itineraries,
            Lucy helps turn travel decisions into a calmer, more informed experience.
          </p>
        </div>

        <div className="relative mx-auto mt-12 max-w-7xl sm:mt-20">
          <div className="relative grid gap-5 md:grid-cols-2 lg:grid-cols-5">
            {pathwayItems.map((item) => (
              <article
                key={item.title}
                className="relative isolate h-[240px] overflow-hidden rounded-[1.75rem] border border-white/70 bg-slate-950 p-5 text-left shadow-sm sm:h-[360px]"
              >
                <div
                  className="absolute inset-0 bg-cover bg-no-repeat brightness-[0.7]"
                  style={{
                    backgroundImage: `url('${item.image}')`,
                    backgroundPosition: "center 75%",
                  }}
                />

                <div className="absolute inset-0 bg-gradient-to-b from-slate-950/72 via-slate-950/28 to-slate-950/10" />

                <div className="relative z-10 flex h-full flex-col justify-start">
                  <h3 className="mt-4 text-xl font-bold leading-tight tracking-tight text-white drop-shadow-[0_3px_14px_rgba(2,6,23,0.45)]">
                    {item.title}
                  </h3>

                  <p className="mt-3 text-medium font-semibold leading-6 text-white/90 drop-shadow-[0_3px_14px_rgba(2,6,23,0.45)]">
                    {item.text}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}