"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

import CarsBookingMode from "@/components/booking/modes/cars/CarsBookingMode"
import CruisesBookingMode from "@/components/booking/modes/cruises/CruisesBookingMode"
import ExperiencesBookingMode from "@/components/booking/modes/experiences/ExperiencesBookingMode"
import FlightsBookingMode from "@/components/booking/modes/flights/FlightsBookingMode"
import HotelsBookingMode from "@/components/booking/modes/hotels/HotelsBookingMode"
import BookingDealsSection, {
  type BookingDealCard,
  type BookingDiscoverMoreSection,
  type BookingTravelerExperiencesSection,
} from "@/components/booking/shared/BookingDealsSection"
import { BookingLucyComposerProvider } from "@/components/booking/shared/BookingLucyComposerContext"
import {
  bookingModeOrder,
  bookingModes,
} from "@/components/booking/shared/bookingLabConfig"
import type {
  BookingMode,
  FlightTripType,
  PlanToBookingHandoff,
} from "@/components/booking/shared/bookingLabTypes"
import { cn } from "@/components/booking/shared/bookingLabUtils"
import LargeChevron from "@/components/ui/LargeChevron"

type BookingDealsContent = {
  title: string
  subtitle: string
  cards: BookingDealCard[]
  discoverMore?: BookingDiscoverMoreSection
  travelerExperiences?: BookingTravelerExperiencesSection
}

function getBookingModeSlug(mode: BookingMode): string {
  const slugs: Record<BookingMode, string> = {
    flights: "flights",
    hotels: "hotels",
    cars: "car-rentals",
    cruises: "cruises",
    experiences: "featured-experiences",
  }

  return slugs[mode]
}

function getBookingModeHeroImage(mode: BookingMode): string {
  const images: Record<BookingMode, string> = {
    flights: "/images/stock/booking/flights-mode-strip.jpg",
    hotels: "/images/stock/booking/hotels-mode-strip.jpg",
    cars: "/images/stock/booking/cars-mode-strip.jpg",
    cruises: "/images/stock/booking/cruises-mode-strip.jpg",
    experiences: "/images/stock/booking/experiences-mode-strip.jpg",
  }

  return images[mode]
}

const bookingDealsContent = {
  flights: {
    title: "Popular flight deals right now",
    subtitle: "Explore sample fares and destination ideas before you search",
    cards: [
      {
        id: "flight-barcelona",
        imageSrc: "/images/stock/booking/deals/flights/deals-1.jpg",
        eyebrow: "Europe escape",
        title: "Barcelona",
        location: "Catalonia, Spain",
        price: "$486",
        meta: "sample round trip fare",
      },
      {
        id: "flight-miami",
        imageSrc: "/images/stock/booking/deals/flights/deals-2.jpg",
        eyebrow: "Sun and skyline",
        title: "Miami",
        location: "Florida, United States",
        price: "$303",
        meta: "sample round trip fare",
      },
      {
        id: "flight-bangkok",
        imageSrc: "/images/stock/booking/deals/flights/deals-3.jpg",
        eyebrow: "Asia getaway",
        title: "Bangkok",
        location: "Thailand",
        price: "$739",
        meta: "sample round trip fare",
      },
      {
        id: "flight-cancun",
        imageSrc: "/images/stock/booking/deals/flights/deals-4.jpg",
        eyebrow: "Warm weekend",
        title: "Cancún",
        location: "Quintana Roo, Mexico",
        price: "$314",
        meta: "sample round trip fare",
      },
    ],
  },
  hotels: {
    title: "Stays for every travel style",
    subtitle: "Average prices based on current calendar month",
    cards: [
      {
        id: "hotel-malaga",
        imageSrc: "/images/stock/booking/deals/hotels/deals-1.jpg",
        eyebrow: "Mediterranean Vibes",
        title: "Málaga",
        location: "Andalusia, Spain",
        price: "$186",
        meta: "avg per night",
      },
      {
        id: "hotel-rio",
        imageSrc: "/images/stock/booking/deals/hotels/deals-2.jpg",
        eyebrow: "Coastal flair",
        title: "Rio de Janeiro",
        location: "State of Rio de Janeiro, Brazil",
        price: "$303",
        meta: "avg per night",
      },
      {
        id: "hotel-pattaya",
        imageSrc: "/images/stock/booking/deals/hotels/deals-3.jpg",
        eyebrow: "Gulf secrets",
        title: "Pattaya",
        location: "Chonburi Province, Thailand",
        price: "$39",
        meta: "avg per night",
      },
      {
        id: "hotel-miami-beach",
        imageSrc: "/images/stock/booking/deals/hotels/deals-4.jpg",
        eyebrow: "Relaxing beaches",
        title: "Marco Island",
        location: "Florida, United States",
        price: "$314",
        meta: "avg per night",
      },
    ],
  },
  cars: {
    title: "Car rentals for every trip style",
    subtitle: "Sample rental inspiration while live cars access is being prepared",
    cards: [
      {
        id: "car-miami",
        imageSrc: "/images/stock/booking/deals/cars/deals-1.jpg",
        eyebrow: "City ready",
        title: "Miami",
        location: "Florida, United States",
        price: "$42",
        meta: "avg per day",
      },
      {
        id: "car-los-angeles",
        imageSrc: "/images/stock/booking/deals/cars/deals-2.jpg",
        eyebrow: "Coastal drive",
        title: "San Fransisco",
        location: "California, United States",
        price: "$58",
        meta: "avg per day",
      },
      {
        id: "car-orlando",
        imageSrc: "/images/stock/booking/deals/cars/deals-3.jpg",
        eyebrow: "Family friendly",
        title: "Orlando",
        location: "Florida, United States",
        price: "$39",
        meta: "avg per day",
      },
      {
        id: "car-las-vegas",
        imageSrc: "/images/stock/booking/deals/cars/deals-4.jpg",
        eyebrow: "Weekend escape",
        title: "Las Vegas",
        location: "Nevada, United States",
        price: "$47",
        meta: "avg per day",
      },
    ],
  },
  cruises: {
    title: "Cruises for every travel style",
    subtitle: "Sample cruise inspiration while live cruise inventory is being prepared",
    cards: [
      {
        id: "cruise-bahamas",
        imageSrc: "/images/stock/booking/deals/cruises/deals-1.jpg",
        eyebrow: "Island classic",
        title: "Bahamas",
        location: "Caribbean",
        price: "$399",
        meta: "sample starting fare",
      },
      {
        id: "cruise-mediterranean",
        imageSrc: "/images/stock/booking/deals/cruises/deals-2.jpg",
        eyebrow: "Old world coast",
        title: "Mediterranean",
        location: "Europe",
        price: "$699",
        meta: "sample starting fare",
      },
      {
        id: "cruise-alaska",
        imageSrc: "/images/stock/booking/deals/cruises/deals-3.jpg",
        eyebrow: "Scenic adventure",
        title: "Alaska",
        location: "United States",
        price: "$849",
        meta: "sample starting fare",
      },
      {
        id: "cruise-mexico",
        imageSrc: "/images/stock/booking/deals/cruises/deals-4.jpg",
        eyebrow: "Warm getaway",
        title: "Mexican Riviera",
        location: "Mexico",
        price: "$529",
        meta: "sample starting fare",
      },
    ],
  },
  experiences: {
    title: "Featured experiences worth exploring",
    subtitle: "Explore featured travel companies, local experience providers, and premium partners selected to elevate every trip.",
    cards: [
      {
        id: "experience-private-tour",
        imageSrc: "/images/stock/booking/deals/experiences/featured/experience-1.jpg",
        eyebrow: "Curated local guide",
        title: "ULU Sailing",
        location: "Gunayala/San Blas Islands, Panama",
        price: "Partner",
        meta: "featured experience",
        href: "https://www.itravelbyboat.com/",
        logoSrc: "/images/stock/booking/partners/ulu-sailing-logo.png",
        companyDescription:
          "ULU Sailing offers private and shared sailing experiences through the Gunayala and San Blas Islands, connecting travelers with turquoise waters, island culture, and unforgettable days at sea.",
      },
      {
        id: "experience-transfers",
        imageSrc: "/images/stock/booking/deals/experiences/featured/experience-2.jpg",
        eyebrow: "Travel made easier",
        title: "....",
        location: "....",
        price: "Partner",
        meta: "premium service",
        href: "https://PARTNER-WEBSITE-HERE.com",
        companyDescription:
          "A featured travel partner offering premium experiences designed to make the journey smoother, more memorable, and easier to personalize.",
      },
      {
        id: "experience-adventure",
        imageSrc: "/images/stock/booking/deals/experiences/featured/experience-3.jpg",
        eyebrow: "Adventure ready",
        title: "....",
        location: "....",
        price: "Partner",
        meta: "curated activity",
        href: "https://PARTNER-WEBSITE-HERE.com",
        companyDescription:
          "A curated experience provider for travelers looking to go beyond the usual route with outdoor adventures, local discovery, and unique destination moments.",
      },
      {
        id: "experience-luxury",
        imageSrc: "/images/stock/booking/deals/experiences/featured/experience-4.jpg",
        eyebrow: "Premium travel",
        title: "....",
        location: "....",
        price: "Partner",
        meta: "featured offer",
        href: "https://PARTNER-WEBSITE-HERE.com",
        companyDescription:
          "A premium partner showcase for elevated trip add-ons, luxury services, and hand-picked travel experiences that complement the Skysirv booking journey.",
      },
    ],
    discoverMore: {
      title: "Discover more",
      subtitle:
        "Discover hidden gems, rare local experiences, and remarkable places waiting beyond the usual travel path.",
      cards: [
        {
          id: "discover-peru",
          imageSrc: "/images/stock/booking/deals/experiences/discoveries/discover-1.jpg",
          title: "Machu Picchu - Peru",
          subtitle: "A legendary 15th-century Inca citadel set high in the Andes, with ancient stone ruins, terraces, and unforgettable mountain scenery.",
        },
        {
          id: "discover-bolivia",
          imageSrc: "/images/stock/booking/deals/experiences/discoveries/discover-2.jpg",
          title: "Uyuni Salt Flat - Bolivia",
          subtitle: "A surreal Bolivian salt flat with endless white horizons, mirror-like reflections, and flamingo-filled lagoons.",
        },
        {
          id: "discover-philippines",
          imageSrc: "/images/stock/booking/deals/experiences/discoveries/discover-3.jpg",
          title: "Palawan - Philippines",
          subtitle: "A Philippine island paradise known for crystal-clear lagoons, limestone cliffs, hidden beaches, and vibrant coral reefs.",
        },
        {
          id: "discover-faroe-islands",
          imageSrc: "/images/stock/booking/deals/experiences/discoveries/discover-4.jpg",
          title: "Faroe Islands - Denmark",
          subtitle:
            "A remote North Atlantic escape with dramatic sea cliffs, grass-roof villages, misty mountains, waterfalls, and untouched coastal beauty.",
        },
        {
          id: "discover-lencois",
          imageSrc: "/images/stock/booking/deals/experiences/discoveries/discover-5.jpg",
          title: "Lençóis Maranhenses - Brazil",
          subtitle:
            "A surreal landscape of rolling white dunes and seasonal freshwater lagoons that look almost painted into the earth.",
        },
        {
          id: "discover-meteora",
          imageSrc: "/images/stock/booking/deals/experiences/discoveries/discover-6.jpg",
          title: "Meteora - Greece",
          subtitle:
            "Ancient monasteries perched on towering sandstone pillars, blending dramatic nature with centuries of spiritual history.",
        },
        {
          id: "discover-svaneti",
          imageSrc: "/images/stock/booking/deals/experiences/discoveries/discover-7.jpg",
          title: "Svaneti - Georgia",
          subtitle:
            "Remote Caucasus mountain villages known for medieval stone towers, alpine valleys, and timeless highland culture.",
        },
        {
          id: "discover-raja-ampat",
          imageSrc: "/images/stock/booking/deals/experiences/discoveries/discover-8.jpg",
          title: "Raja Ampat - Indonesia",
          subtitle:
            "A remote island paradise with turquoise waters, jungle-covered limestone islands, and some of the richest marine life on Earth.",
        },
        {
          id: "discover-wadi-rum",
          imageSrc: "/images/stock/booking/deals/experiences/discoveries/discover-9.jpg",
          title: "Wadi Rum - Jordan",
          subtitle:
            "A cinematic desert wilderness of red sand, sandstone cliffs, hidden canyons, and unforgettable Bedouin-led adventures.",
        },
        {
          id: "discover-cappadocia",
          imageSrc: "/images/stock/booking/deals/experiences/discoveries/discover-10.jpg",
          title: "Cappadocia - Türkiye",
          subtitle:
            "A dreamlike region of fairy chimneys, cave dwellings, underground cities, and sunrise skies filled with hot air balloons.",
        },
        {
          id: "discover-kotor-bay",
          imageSrc: "/images/stock/booking/deals/experiences/discoveries/discover-11.jpg",
          title: "Kotor Bay - Montenegro",
          subtitle:
            "A dramatic Adriatic bay framed by mountains, medieval walls, stone alleys, and old-world coastal charm.",
        },
        {
          id: "discover-chefchaouen",
          imageSrc: "/images/stock/booking/deals/experiences/discoveries/discover-12.jpg",
          title: "Chefchaouen - Morocco",
          subtitle:
            "A peaceful blue-painted mountain town tucked into the Rif Mountains, known for winding alleys and soft, photogenic color.",
        },
        {
          id: "discover-socotra",
          imageSrc: "/images/stock/booking/deals/experiences/discoveries/discover-13.jpg",
          title: "Socotra - Yemen",
          subtitle:
            "A remote island world famous for alien-like dragon blood trees, rare landscapes, and species found nowhere else.",
        },
        {
          id: "discover-azores",
          imageSrc: "/images/stock/booking/deals/experiences/discoveries/discover-14.jpg",
          title: "Azores - Portugal",
          subtitle:
            "Volcanic islands filled with crater lakes, hot springs, green cliffs, whale watching, and Atlantic adventure.",
        },
        {
          id: "discover-lofoten",
          imageSrc: "/images/stock/booking/deals/experiences/discoveries/discover-15.jpg",
          title: "Lofoten Islands - Norway",
          subtitle:
            "Arctic fishing villages, sharp mountains, glassy fjords, wild beaches, and dramatic northern light scenery.",
        },
        {
          id: "discover-tsingy",
          imageSrc: "/images/stock/booking/deals/experiences/discoveries/discover-16.jpg",
          title: "Tsingy de Bemaraha - Madagascar",
          subtitle:
            "A stone forest of razor-sharp limestone pinnacles, hanging bridges, caves, and rare wildlife.",
        },
      ],
    },
    travelerExperiences: {
      title: "Travelers Experiences",
      subtitle:
        "Real destination moments, hidden gems, and unforgettable travel stories shared by the Skysirv community.",
      cards: [
        {
          id: "traveler-experience-1",
          imageSrc: "/images/stock/booking/deals/experiences/travelers/traveler-1.jpg",
          mediaType: "image",
          destination: "Santorini, Greece",
          feedback:
            "The sunset views were unreal, but the best part was finding quiet little streets away from the crowds.",
          travelerName: "Alyssa M.",
          rating: 5,
        },
        {
          id: "traveler-experience-2",
          imageSrc: "/images/stock/booking/deals/experiences/travelers/traveler-2.mp4",
          mediaType: "video",
          destination: "Cusco, Peru",
          feedback:
            "Every corner felt historic. The food, the mountain air, and the local culture made this trip unforgettable.",
          travelerName: "Daniel R.",
          rating: 5,
        },
        {
          id: "traveler-experience-3",
          imageSrc: "/images/stock/booking/deals/experiences/travelers/traveler-3.jpg",
          mediaType: "image",
          destination: "Kyoto, Japan",
          feedback:
            "Peaceful temples, hidden gardens, and tiny cafés made Kyoto feel calm, beautiful, and deeply memorable.",
          travelerName: "Mia T.",
          rating: 5,
        },
        {
          id: "traveler-experience-4",
          imageSrc: "/images/stock/booking/deals/experiences/travelers/traveler-4.mp4",
          mediaType: "video",
          destination: "Amalfi Coast, Italy",
          feedback:
            "The coastline was stunning, but the small villages and family-run restaurants gave the trip its magic.",
          travelerName: "Chris B.",
          rating: 5,
        },
        {
          id: "traveler-experience-5",
          imageSrc: "/images/stock/booking/deals/experiences/travelers/traveler-5.jpg",
          mediaType: "image",
          destination: "Bali, Indonesia",
          feedback:
            "Rice terraces, beaches, temples, and warm local hospitality made Bali feel like several trips in one.",
          travelerName: "Sofia L.",
          rating: 5,
        },
        {
          id: "traveler-experience-6",
          imageSrc: "/images/stock/booking/deals/experiences/travelers/traveler-6.mp4",
          mediaType: "video",
          destination: "Banff, Canada",
          feedback:
            "The lakes looked impossible in real life. Every hike felt like walking through a postcard.",
          travelerName: "Ethan K.",
          rating: 5,
        },
      ],
    },
  },
} satisfies Record<BookingMode, BookingDealsContent>

function FeaturedExperiencesHeroIntro() {
  return (
    <div className="mx-auto flex h-full max-w-4xl flex-col items-center justify-center px-4 pt-10 text-center">
      <h1 className="text-4xl font-bold tracking-tight text-white drop-shadow-[0_8px_34px_rgba(2,6,23,0.35)] sm:text-5xl md:text-6xl lg:text-6xl">
        Go beyond the booking.
      </h1>

      <p className="mx-auto mt-6 max-w-3xl text-base font-semibold leading-8 text-white drop-shadow-[0_4px_18px_rgba(2,6,23,0.35)] sm:text-xl">
        Explore featured travel companies, rare local experiences, and premium partners curated to turn every trip into something unforgettable.
      </p>
    </div>
  )
}

export default function BookingLabShell({
  initialMode = "flights",
}: {
  initialMode?: BookingMode
}) {
  const router = useRouter()
  const [activeMode, setActiveMode] = useState<BookingMode>(initialMode)
  const [searchSeed, setSearchSeed] = useState(0)
  const [showHeroImage, setShowHeroImage] = useState(true)
  const [flightTripType, setFlightTripType] =
    useState<FlightTripType>("round-trip")

  const [composerText, setComposerText] = useState("")
  const [planHandoff, setPlanHandoff] =
    useState<PlanToBookingHandoff | null>(null)

  useEffect(() => {
    const storedHandoff = window.sessionStorage.getItem(
      "skysirv-plan-to-booking-handoff",
    )

    if (!storedHandoff) return

    try {
      const handoff = JSON.parse(storedHandoff) as PlanToBookingHandoff

      if (handoff.source !== "plan-with-lucy") return

      setPlanHandoff(handoff)

      if (handoff.mode === "flights") {
        const nextFlightTripType = getFlightTripTypeFromHandoff(handoff)

        if (nextFlightTripType) {
          setFlightTripType(nextFlightTripType)
        }
      }

      const promptText = handoff.prompt?.trim()

      if (!promptText) return

      setComposerText(
        `Lucy, use this planning context to help with my booking: ${promptText}`,
      )
    } catch {
      window.sessionStorage.removeItem("skysirv-plan-to-booking-handoff")
    }
  }, [])

  const activeConfig = bookingModes[activeMode]
  const activeHeroImage = getBookingModeHeroImage(activeMode)
  const activeDealsContent = bookingDealsContent[activeMode]
  const itineraryIncludedModes = getItineraryIncludedModes()

  function resetSearch(nextMode: BookingMode = activeMode) {
    setActiveMode(nextMode)
    setShowHeroImage(true)
    setSearchSeed((current) => current + 1)

    router.push(`/booking/${getBookingModeSlug(nextMode)}`)
  }

  function getFlightTripTypeFromHandoff(
    handoff: PlanToBookingHandoff,
  ): FlightTripType | null {
    const flightTypeLabel = handoff.confirmedAnswers?.["flight-type"]?.label

    if (flightTypeLabel === "One-way trip") return "one-way"
    if (flightTypeLabel === "Round trip") return "round-trip"
    if (flightTypeLabel === "Multi-city travel") return "multi-city"

    return null
  }

  function getItineraryIncludedModes(): BookingMode[] {
    if (planHandoff?.mode !== "itinerary") return []

    const values = planHandoff.confirmedAnswers?.["trip-includes"]?.values ?? []

    return bookingModeOrder.filter((modeId) => values.includes(modeId))
  }

  function renderActiveMode() {
    if (activeMode === "flights") {
      return (
        <FlightsBookingMode
          key={`${activeMode}-${searchSeed}`}
          config={activeConfig}
          flightTripType={flightTripType}
          onFlightTripTypeChange={setFlightTripType}
          planHandoff={planHandoff}
          onHeroImageVisibilityChange={setShowHeroImage}
        />
      )
    }

    if (activeMode === "hotels") {
      return (
        <HotelsBookingMode
          key={`${activeMode}-${searchSeed}`}
          config={activeConfig}
          planHandoff={planHandoff}
        />
      )
    }

    if (activeMode === "cars") {
      return (
        <CarsBookingMode
          key={`${activeMode}-${searchSeed}`}
          config={activeConfig}
          planHandoff={planHandoff}
        />
      )
    }

    if (activeMode === "cruises") {
      return (
        <CruisesBookingMode
          key={`${activeMode}-${searchSeed}`}
          config={activeConfig}
          planHandoff={planHandoff}
        />
      )
    }

    return (
      <ExperiencesBookingMode
        key={`${activeMode}-${searchSeed}`}
        config={activeConfig}
        planHandoff={planHandoff}
      />
    )
  }

  return (
    <BookingLucyComposerProvider
      value={{
        modeLabel: activeConfig.label,
        composerText,
        onComposerChange: setComposerText,
      }}
    >
      <main className="h-screen overflow-y-auto bg-white text-slate-950 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <section className="skysirv-booking-lab relative min-h-screen overflow-visible bg-white px-5 pb-44 pt-24 sm:px-8 sm:pt-24">
          {showHeroImage ? (
            <div
              aria-hidden="true"
              className="pointer-events-none absolute left-1/2 top-0 z-0 h-[660px] w-screen -translate-x-1/2 overflow-hidden"
            >
              <div
                className="h-full w-full bg-cover bg-center"
                style={{
                  backgroundImage: `linear-gradient(90deg, rgba(255,255,255,0.00), rgba(255,255,255,0.00), rgba(255,255,255,0.00)), linear-gradient(180deg, rgba(255,255,255,0), rgba(255,255,255,0.08) 58%, rgba(255,255,255,0.42)), url('${activeHeroImage}')`,
                }}
              />

              <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-b from-transparent to-white" />
            </div>
          ) : null}

          <Link
            href="/"
            className="fixed left-5 top-5 z-50 inline-flex min-h-[42px] items-center gap-2 rounded-full border border-blue-700 bg-blue-700 px-4 text-sm font-bold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-blue-600"
          >
            <LargeChevron direction="left" />
            Home
          </Link>

          <div className="fixed left-1/2 top-5 z-50 flex -translate-x-1/2 justify-center">
            <div className="flex w-fit max-w-[calc(100vw-160px)] items-center justify-center gap-1 overflow-x-auto rounded-xl border border-slate-200/70 bg-white p-1 shadow-sm">
              {bookingModeOrder.map((modeId) => {
                const mode = bookingModes[modeId]
                const itineraryModeIndex = itineraryIncludedModes.indexOf(modeId)
                const hasItineraryContext = itineraryModeIndex !== -1

                return (
                  <button
                    key={mode.id}
                    type="button"
                    onClick={() => resetSearch(mode.id)}
                    className={cn(
                      "inline-flex min-h-[38px] min-w-[120px] shrink-0 items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition",
                      activeMode === mode.id
                        ? "bg-blue-700 text-white shadow-sm"
                        : "text-slate-500 hover:text-slate-900",
                    )}
                  >
                    {mode.label}

                    {hasItineraryContext && (
                      <span
                        className={cn(
                          "inline-flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[10px] font-black leading-none",
                          activeMode === mode.id
                            ? "bg-white text-blue-700"
                            : "bg-orange-500 text-white",
                        )}
                        aria-label={`Lucy itinerary context ${itineraryModeIndex + 1}`}
                        title="Lucy itinerary context ready"
                      >
                        {itineraryModeIndex + 1}
                      </span>
                    )}
                  </button>
                )
              })}
            </div>
          </div>

          <aside className={activeMode === "experiences" ? "hidden" : "hidden lg:block"}>
            <div className="fixed left-4 top-1/2 z-40 flex -translate-y-1/2 flex-col items-center gap-5 rounded-3xl border border-slate-200 bg-white px-3 py-5 shadow-[0_18px_45px_rgba(15,23,42,0.10)]">
              <button
                type="button"
                onClick={() => resetSearch(activeMode)}
                className="flex flex-col items-center gap-1 text-slate-700 transition hover:text-slate-800"
                aria-label="Start a new booking search"
                title="Start a new booking search"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-lg">
                  +
                </span>
                <span className="text-[11px] font-semibold">New search</span>
              </button>

              <button
                type="button"
                disabled
                className="flex cursor-not-allowed flex-col items-center gap-1 text-slate-400"
                aria-label="Booking history will be available later"
                title="Booking history will be available later"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-lg">
                  ◷
                </span>
                <span className="text-[11px] font-semibold">History</span>
              </button>
            </div>
          </aside>

          <div className="relative z-10 h-[540px] overflow-visible">
            {activeMode === "experiences" ? (
              <FeaturedExperiencesHeroIntro />
            ) : (
              <div className="mx-auto mt-6 max-w-3xl">
                {renderActiveMode()}
              </div>
            )}
          </div>

          <div className="relative z-10">
            <BookingDealsSection
              {...activeDealsContent}
              className={activeMode === "experiences" ? "mt-16" : "mt-12"}
              variant={activeMode === "experiences" ? "featureGrid" : "standard"}
            />
          </div>
        </section>
      </main>
    </BookingLucyComposerProvider>
  )
}