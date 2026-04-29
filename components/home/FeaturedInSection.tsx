"use client"

const featuredInItems = [
  "TechCrunch",
  "Forbes",
  "The Points Guy",
  "Condé Nast Traveler",
  "Travel + Leisure",
  "PhocusWire",
  "Skift",
  "Business Insider",
]

export default function FeaturedInSection() {
  const repeatedItems = [...featuredInItems, ...featuredInItems]

  return (
    <section className="relative w-full overflow-hidden bg-white py-20">
      <div className="mx-auto max-w-5xl px-6 text-center">
        <h2 className="text-5xl font-bold tracking-tight text-slate-900 sm:text-6xl">
          Featured in
        </h2>

        <p className="mx-auto mt-8 max-w-3xl text-lg leading-8 text-slate-600 sm:text-xl">
          Skysirv™ is built for the intersection of travel, technology, and
          smarter booking intelligence.
        </p>
      </div>

      <div className="mx-auto mt-12 max-w-6xl overflow-hidden px-6">
        <div className="relative overflow-hidden">
          <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-20 bg-gradient-to-r from-white via-white to-transparent" />
          <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-20 bg-gradient-to-l from-white via-white to-transparent" />

          <div className="featured-in-track flex w-max items-center gap-16">
            {repeatedItems.map((item, index) => (
              <div
                key={`${item}-${index}`}
                className="flex min-w-max items-center justify-center text-lg font-bold uppercase tracking-[0.18em] text-slate-300 transition hover:text-slate-500"
              >
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}