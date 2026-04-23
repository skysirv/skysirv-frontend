"use client"

import { motion } from "framer-motion"

const testimonials = [
  {
    name: "Crystal C.",
    handle: "@crystalac",
    date: "Apr 11, 2026",
    rating: 5,
    image:
      "https://unsplash.com/photos/woman-in-white-crew-neck-shirt-smiling-IF9TK5Uy-KI?auto=format&fit=crop&w=120&q=80",
    quote:
      "Skysirv brings a much more structured feel to airfare tracking. Instead of reacting blindly, I can actually understand what the market is doing.",
  },
  {
    name: "Christina P.",
    handle: "@clouisep",
    date: "Mar 20, 2026",
    rating: 5,
    image:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=120&q=80",
    quote:
      "It feels polished, intentional, and calm. Skysirv turns fare movement into something readable instead of overwhelming.",
  },
  {
    name: "Tiago C.",
    handle: "@tiagoc25",
    date: "Mar 23, 2026",
    rating: 5,
    image:
      "https://images.unsplash.com/photo-1504257432389-52343af06ae3?auto=format&fit=crop&w=120&q=80",
    quote:
      "A smart travel product should reduce noise and improve confidence. That’s exactly what stands out to me here.",
  },
  {
    name: "Claudia N.",
    handle: "@cng25",
    date: "Apr 05, 2026",
    rating: 5,
    image:
      "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80",
    quote:
      "Skysirv feels less like a basic search tool and more like a better decision environment for people who actually care about timing.",
  },
  {
    name: "Isabella C.",
    handle: "@bella16",
    date: "Apr 14, 2026",
    rating: 5,
    image:
      "https://images.unsplash.com/photo-1504593811423-6dd665756598?auto=format&fit=crop&w=120&q=80",
    quote:
      "The intelligence layer is what makes it interesting. You can feel the difference between simple fare listings and something built to guide decisions.",
  },
  {
    name: "Sofia G.",
    handle: "@sofiaguzman26",
    date: "Apr 18, 2026",
    rating: 5,
    image:
      "https://images.unsplash.com/photo-1502685104226-ee32379fefbe?auto=format&fit=crop&w=120&q=80",
    quote:
      "Premium travel tools should feel clean, useful, and dependable. Skysirv already feels like it is moving in that direction.",
  },
]

function StarRow({ rating }: { rating: number }) {
  return (
    <div className="mt-3 flex items-center gap-1">
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
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
            What users are saying
          </h2>

          <p className="mt-6 text-base leading-7 text-slate-600 sm:text-lg">
            Real traveler feedback on a smarter, calmer way to track airfare.
          </p>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={`${testimonial.name}-${index}`}
              whileHover={{ y: -5, boxShadow: "0 20px 50px rgba(15,23,42,0.18)" }}
              transition={{ duration: 0.22 }}
              className="h-full rounded-[2rem] border border-slate-800/80 bg-[linear-gradient(180deg,#0b1728_0%,#0f1d31_42%,#13243b_100%)] p-6 text-white shadow-[0_20px_50px_rgba(2,6,23,0.18)]"
            >
              <div className="flex h-full flex-col">
                <div className="flex items-start gap-4">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="h-12 w-12 rounded-full object-cover"
                  />

                  <div className="min-w-0">
                    <p className="truncate text-base font-semibold text-white">
                      {testimonial.name}
                    </p>
                    <p className="truncate text-sm text-slate-400">
                      {testimonial.handle}
                    </p>
                    <p className="mt-2 text-sm text-slate-400">
                      {testimonial.date}
                    </p>

                    <StarRow rating={testimonial.rating} />
                  </div>
                </div>

                <p className="mt-6 text-sm leading-7 text-slate-300 sm:text-base">
                  {testimonial.quote}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}