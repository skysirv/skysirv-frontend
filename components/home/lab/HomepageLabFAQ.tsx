"use client"

import { useState } from "react"
import { motion } from "framer-motion"

const faqs = [
  {
    question: "What is Skysirv?",
    answer:
      "Skysirv is a fully AI-powered travel intelligence network designed to help travelers compare flights, explore hotels and car rentals, plan cruises and itineraries, understand pricing signals, and make calmer travel decisions with Lucy.",
  },
  {
    question: "Is Skysirv a booking site?",
    answer:
      "Skysirv includes booking for flights, hotels, car rentals, cruises and future travel products, but its bigger purpose is intelligence. The goal is to help travelers understand the why behind trip options, pricing movement, timing, and travel decisions — not just show another list of prices.",
  },
  {
    question: "Who is Lucy?",
    answer:
      "Lucy is Skysirv’s AI travel companion. She helps explain fare movement, compare trip options, remember travel preferences, build itineraries, and guide travelers through smarter planning decisions.",
  },
  {
    question: "Can Lucy remember how I like to travel?",
    answer:
      "Yes. When signed in, Lucy can use preferences like home airports, preferred airlines, hotel style, rental car needs, cruise preferences, family travel style, cabin preferences, and favorite destinations to make future planning feel more personal.",
  },
  {
    question: "What can I ask Lucy about?",
    answer:
      "You can ask Lucy about flights, route timing, hotel choices, car rentals, cruises, itinerary ideas, travel preferences, airport conditions, and how different trip options compare before you book.",
  },
  {
    question: "What is Skysirv Live?",
    answer:
      "Skysirv Live is the live airport intelligence layer for Skysirv. It helps travelers understand airport disruption, delay pressure, weather impact, route risk, and live travel conditions with Lucy translating what the signals mean.",
  },
]

export default function HomepageLabFAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <section className="relative overflow-hidden bg-white px-6 pb-12 pt-12 sm:pb-16 sm:pt-10">
      <div className="relative mx-auto grid max-w-7xl gap-14 lg:min-h-[620px] lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
        <motion.div
          initial={{ opacity: 0, x: -14 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.38, ease: "easeOut" }}
          className="mx-auto max-w-xl text-center lg:mx-0 lg:text-left"
        >
          <h2 className="mt-4 text-4xl font-bold tracking-tight text-slate-800 sm:text-5xl">
            A calmer way to understand what Skysirv does.
          </h2>

          <p className="mt-6 text-base leading-8 text-slate-700 sm:text-lg">
            Skysirv is being built as an AI travel intelligence layer — with Lucy
            helping travelers understand the signal behind flights, stays, cars,
            cruises, itineraries, and live travel conditions.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 14 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.22 }}
          transition={{ duration: 0.38, ease: "easeOut", delay: 0.04 }}
          className="mx-auto w-full max-w-3xl"
        >
          <div className="divide-y divide-slate-200 rounded-[2rem] border border-slate-200 bg-white shadow-[0_18px_55px_rgba(15,23,42,0.06)]">
            {faqs.map((item, index) => {
              const isOpen = openIndex === index

              return (
                <div key={item.question}>
                  <button
                    type="button"
                    onClick={() => setOpenIndex(isOpen ? null : index)}
                    className="flex w-full items-center justify-between gap-5 px-5 py-5 text-left sm:px-6"
                  >
                    <span className="text-base font-bold text-slate-800 sm:text-lg">
                      {item.question}
                    </span>

                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-600 text-lg font-bold text-white">
                      {isOpen ? "−" : "+"}
                    </span>
                  </button>

                  {isOpen ? (
                    <div className="px-5 pb-5 sm:px-6">
                      <p className="max-w-2xl text-sm leading-7 text-slate-700 sm:text-base">
                        {item.answer}
                      </p>
                    </div>
                  ) : null}
                </div>
              )
            })}
          </div>
        </motion.div>
      </div>
    </section>
  )
}