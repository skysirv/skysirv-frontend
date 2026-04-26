"use client"

import { useEffect, useState } from "react"

type Testimonial = {
  id?: string
  title?: string
  name: string
  handle: string
  date: string
  rating: number
  quote: string
}

const fallbackTestimonials: Testimonial[] = [
  {
    title: "Structured Airfare Tracking",
    name: "Crystal C.",
    handle: "@crystalac",
    date: "Apr 11, 2026",
    rating: 5,
    quote:
      "Skysirv brings a much more structured feel to airfare tracking. Instead of reacting blindly, I can actually understand what the market is doing.",
  },
  {
    title: "Intentional Travel Intelligence",
    name: "Christina P.",
    handle: "@clouisep",
    date: "Mar 20, 2026",
    rating: 5,
    quote:
      "It feels polished, intentional, and calm. Skysirv turns fare movement into something readable instead of overwhelming.",
  },
  {
    title: "Confidence in Booking",
    name: "Tiago C.",
    handle: "@tiagoc25",
    date: "Mar 23, 2026",
    rating: 5,
    quote:
      "A smart travel product should reduce noise and improve confidence. That’s exactly what stands out to me here.",
  },
  {
    title: "Smarter Travel Decisions",
    name: "Claudia N.",
    handle: "@cng25",
    date: "Apr 05, 2026",
    rating: 5,
    quote:
      "Skysirv feels less like a basic search tool and more like a better decision environment for people who actually care about timing.",
  },
  {
    title: "Clean, Useful, and Dependable",
    name: "Isabella C.",
    handle: "@bella16",
    date: "Apr 14, 2026",
    rating: 5,
    quote:
      "The intelligence layer is what makes it interesting. You can feel the difference between simple fare listings and something built to guide decisions.",
  },
  {
    title: "Premium Travel Experience",
    name: "Sofia G.",
    handle: "@sofiaguzman26",
    date: "Apr 18, 2026",
    rating: 5,
    quote:
      "Premium travel tools should feel clean, useful, and dependable. Skysirv already feels like it is moving in that direction.",
  },
]

function StarRow({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: rating }).map((_, index) => (
        <span key={index} className="text-sm text-amber-500">
          ★
        </span>
      ))}
    </div>
  )
}

export default function TestimonialsSection() {
  const [liveTestimonials, setLiveTestimonials] = useState<Testimonial[]>([])

  useEffect(() => {
    let mounted = true

    async function loadTestimonials() {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/testimonials`
        )

        const data = await res.json().catch(() => null)

        if (!res.ok || !Array.isArray(data?.testimonials)) {
          return
        }

        if (mounted) {
          setLiveTestimonials(data.testimonials)
        }
      } catch {
        // Keep fallback testimonials if the live request fails.
      }
    }

    loadTestimonials()

    return () => {
      mounted = false
    }
  }, [])

  const testimonials =
    liveTestimonials.length > 0
      ? [...liveTestimonials, ...fallbackTestimonials].slice(0, 6)
      : fallbackTestimonials

  return (
    <section className="relative isolate w-full overflow-hidden bg-white py-24">
      <div className="relative z-10 mx-auto max-w-6xl px-6">
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
              key={testimonial.id || `${testimonial.name}-${index}`}
              className="h-full rounded-[1.5rem] border border-white/10 bg-slate-950 p-6 text-white shadow-[0_18px_45px_rgba(15,23,42,0.14)] transition-shadow duration-200 hover:shadow-[0_22px_55px_rgba(15,23,42,0.18)]"
            >
              <div className="flex h-full flex-col">
                <div>
                  <h3 className="text-lg font-semibold tracking-tight text-white">
                    {testimonial.title || "Skysirv Beta Feedback"}
                  </h3>

                  <p className="mt-2 text-sm text-slate-400">
                    {new Date(testimonial.date).toString() !== "Invalid Date"
                      ? new Date(testimonial.date).toLocaleDateString(undefined, {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })
                      : testimonial.date}{" "}
                    · {testimonial.name}
                  </p>

                  <div className="mt-3">
                    <StarRow rating={testimonial.rating} />
                  </div>
                </div>

                <div className="my-6 border-t border-dashed border-white/10" />

                <p className="text-sm leading-7 text-slate-300 sm:text-base">
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