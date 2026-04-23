"use client"

import { motion } from "framer-motion"

const testimonials = [
  {
    name: "Crystal C.",
    handle: "@crystalac",
    date: "Apr 11, 2026",
    rating: 5,
    image: "/testimonials/crystal-c.jpg",
    quote:
      "Skysirv brings a much more structured feel to airfare tracking. Instead of reacting blindly, I can actually understand what the market is doing.",
  },
  {
    name: "Christina P.",
    handle: "@clouisep",
    date: "Mar 20, 2026",
    rating: 5,
    image: "/testimonials/christina-p.jpg",
    quote:
      "It feels polished, intentional, and calm. Skysirv turns fare movement into something readable instead of overwhelming.",
  },
  {
    name: "Tiago C.",
    handle: "@tiagoc25",
    date: "Mar 23, 2026",
    rating: 5,
    image: "/testimonials/tiago-c.jpg",
    quote:
      "A smart travel product should reduce noise and improve confidence. That’s exactly what stands out to me here.",
  },
  {
    name: "Claudia N.",
    handle: "@cng25",
    date: "Apr 05, 2026",
    rating: 5,
    image: "/testimonials/claudia-n.jpg",
    quote:
      "Skysirv feels less like a basic search tool and more like a better decision environment for people who actually care about timing.",
  },
  {
    name: "Isabella C.",
    handle: "@bella16",
    date: "Apr 14, 2026",
    rating: 5,
    image: "/testimonials/isabella-c.jpg",
    quote:
      "The intelligence layer is what makes it interesting. You can feel the difference between simple fare listings and something built to guide decisions.",
  },
  {
    name: "Sofia G.",
    handle: "@sofiaguzman26",
    date: "Apr 18, 2026",
    rating: 5,
    image: "/testimonials/sofia-g.jpg",
    quote:
      "Premium travel tools should feel clean, useful, and dependable. Skysirv already feels like it is moving in that direction.",
  },
]

function StarRow({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: rating }).map((_, index) => (
        <span key={index} className="text-sm text-amber-400">
          ★
        </span>
      ))}
    </div>
  )
}

export default function TestimonialsSection() {
  return (
    <section className="relative w-full bg-white py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mx-auto max-w-5xl px-6 text-center">
          <h2 className="text-5xl font-bold tracking-tight text-slate-900 sm:text-6xl">
            What users are saying
          </h2>

          <p className="mt-8 text-lg leading-8 text-slate-600 sm:text-xl">
            Real traveler feedback on a smarter, calmer way to track airfare.
          </p>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <div
              key={`${testimonial.name}-${index}`}
              className="h-full rounded-[2rem] border border-slate-800/90 bg-[linear-gradient(180deg,#0f172a_0%,#111827_45%,#172033_100%)] p-6 text-white shadow-[0_24px_60px_rgba(2,6,23,0.18)] transition-transform duration-200 hover:-translate-y-1"
            >
              <div className="flex h-full flex-col">
                <div className="flex items-start gap-4">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="h-12 w-12 rounded-full object-cover"
                  />

                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="truncate text-base font-semibold text-white">
                          {testimonial.name}
                        </p>
                        <p className="truncate text-sm text-slate-400">
                          {testimonial.handle}
                        </p>
                      </div>

                      <div className="shrink-0">
                        <StarRow rating={testimonial.rating} />
                      </div>
                    </div>

                    <p className="mt-2 text-sm text-slate-400">
                      {testimonial.date}
                    </p>
                  </div>
                </div>

                <p className="mt-6 text-sm leading-7 text-slate-300 sm:text-base">
                  {testimonial.quote}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}