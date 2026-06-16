"use client"

import { useEffect, useState } from "react"

const userStories = [
  {
    person: "The frequent flyer",
    route: "BOS → MIA",
    quote:
      "A Miami trip changes overnight, but Lucy helps explain whether the flight, hotel, and timing still make sense together.",
    title: "Lucy helps turn trip movement into clearer booking guidance.",
    details:
      "Instead of checking flights, hotels, and prices over and over, travelers can understand whether the full trip looks calm, high, moving, or worth waiting on.",
  },
  {
    person: "The family planner",
    route: "BOS → MCO",
    quote:
      "A family trip starts with preferences Lucy already understands: fewer stops, better hotel comfort, car space, and less airport stress.",
    title: "Skysirv can account for comfort, timing, stays, cars, and preferences.",
    details:
      "Lucy can remember how a family likes to travel, then help make future searches and itineraries feel less repetitive and less stressful.",
  },
  {
    person: "The business traveler",
    route: "NYC → SFO",
    quote:
      "A recurring business trip stays on watch while Skysirv surfaces the routes, hotels, and timing changes that actually need attention.",
    title: "Recurring travel decisions become easier to follow.",
    details:
      "Skysirv helps surface route signals, airport pressure, hotel context, and changing travel conditions so decisions can happen faster and with less noise.",
  },
]

export default function HomepageLabUserStories() {
  const [activeStoryIndex, setActiveStoryIndex] = useState(0)
  const activeStory = userStories[activeStoryIndex]

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveStoryIndex((current) =>
        current === userStories.length - 1 ? 0 : current + 1
      )
    }, 4500)

    return () => window.clearInterval(timer)
  }, [])

  return (
    <section className="relative overflow-hidden bg-white px-6 pb-10 pt-8 sm:py-28">
      <div className="relative mx-auto max-w-7xl">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="mt-0 text-4xl font-bold tracking-tight text-slate-800 sm:mt-4 sm:text-5xl">
            Built around the moments travelers actually feel.
          </h2>

          <p className="mx-auto mt-6 max-w-3xl text-base leading-6 text-slate-700 sm:text-lg">
            Skysirv is designed for the questions travelers ask before
            they book flights, compare stays, plan transportation, build itineraries,
            and react when travel conditions start changing.
          </p>
        </div>

        <div className="mx-auto mt-10 max-w-sm sm:hidden">
          <div className="relative rounded-[2rem] border border-slate-200 bg-white px-5 pb-5 pt-0">
            <article
              key={activeStory.person}
              className="animate-[skysirvStoryFlip_420ms_ease-out]"
              style={{
                transformOrigin: "left center",
                transformStyle: "preserve-3d",
              }}
            >
              <div className="flex items-center justify-between gap-3">
                <p className="mt-8 text-center rounded-full border border-blue-700 bg-blue-700 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.16em] text-white">
                  {activeStory.person}
                </p>

                <p className="mt-8 text-center text-xs font-bold text-slate-800">
                  {activeStory.route}
                </p>
              </div>

              <p className="mt-8 text-center text-xl font-bold italic leading-8 tracking-tight text-slate-800">
                “{activeStory.quote}”
              </p>

              <div className="mt-7 border-t border-slate-200 pt-5 text-center">
                <h3 className="text-base font-bold leading-6 text-orange-500">
                  {activeStory.title}
                </h3>

                <p className="mt-3 text-sm leading-6 text-slate-800">
                  {activeStory.details}
                </p>
              </div>
            </article>
          </div>

          <style>{`
            @keyframes skysirvStoryFlip {
              from {
                transform: rotateY(-0deg) translateX(0px);
              }

              to {
                transform: rotateY(0deg) translateX(0);
              }
            }
          `}</style>
        </div>

        <div className="mx-auto mt-14 hidden max-w-6xl gap-4 sm:grid lg:grid-cols-3">
          {userStories.map((story) => (
            <article
              key={story.person}
              className="relative overflow-hidden rounded-[2rem] border border-slate-200 bg-white p-5 shadow-[0_18px_55px_rgba(15,23,42,0.06)]"
            >
              <div className="flex items-center justify-between gap-3">
                <p className="rounded-full border border-blue-700 bg-blue-700 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.16em] text-white">
                  {story.person}
                </p>
              </div>

              <p className="mt-8 text-xl font-bold italic leading-8 tracking-tight text-slate-800">
                “{story.quote}”
              </p>

              <div className="mt-7 border-t border-slate-200 pt-5">
                <h3 className="text-base font-bold leading-6 text-slate-800">
                  {story.title}
                </h3>

                <p className="mt-3 text-sm leading-6 text-slate-700">
                  {story.details}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}