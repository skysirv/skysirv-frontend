"use client"

import { useEffect, useRef, useState, type FormEvent } from "react"

import LargeChevron from "@/components/ui/LargeChevron"

export type BookingDealCard = {
  id: string
  imageSrc: string
  eyebrow: string
  title: string
  location: string
  price: string
  meta: string
  href?: string
  logoSrc?: string
  companyDescription?: string
}
export type BookingDiscoverMoreCard = {
  id: string
  imageSrc: string
  title: string
  subtitle: string
}

export type BookingDiscoverMoreSection = {
  title: string
  subtitle: string
  cards: BookingDiscoverMoreCard[]
}

export type BookingTravelerExperienceCard = {
  id: string
  imageSrc: string
  mediaType?: "image" | "video"
  destination: string
  feedback: string
  travelerName: string
  rating: number
}

export type BookingTravelerExperiencesSection = {
  title: string
  subtitle: string
  cards: BookingTravelerExperienceCard[]
}

type TravelerExperienceFormState = {
  destination: string
  feedback: string
  travelerName: string
  rating: number
  imageSrc: string
  mediaType: "image" | "video"
}

type ExpandedTravelerMedia = {
  src: string
  type: "image" | "video"
  title: string
}

type TravelerSubmitMessage = {
  type: "success" | "error"
  message: string
} | null

export default function BookingDealsSection({
  title,
  subtitle,
  cards,
  className = "mt-52",
  variant = "standard",
  discoverMore,
  travelerExperiences,
}: {
  title: string
  subtitle: string
  cards: BookingDealCard[]
  className?: string
  variant?: "standard" | "featureGrid"
  discoverMore?: BookingDiscoverMoreSection
  travelerExperiences?: BookingTravelerExperiencesSection
}) {
  const [travelerModalOpen, setTravelerModalOpen] = useState(false)
  const [ratingMenuOpen, setRatingMenuOpen] = useState(false)
  const [expandedTravelerMedia, setExpandedTravelerMedia] =
    useState<ExpandedTravelerMedia | null>(null)
  const [approvedTravelerExperiences, setApprovedTravelerExperiences] =
    useState<BookingTravelerExperienceCard[]>([])
  const [selectedTravelerFile, setSelectedTravelerFile] = useState<File | null>(
    null,
  )
  const [travelerSubmitLoading, setTravelerSubmitLoading] = useState(false)
  const [travelerSubmitMessage, setTravelerSubmitMessage] =
    useState<TravelerSubmitMessage>(null)
  const [travelerForm, setTravelerForm] = useState<TravelerExperienceFormState>({
    destination: "",
    feedback: "",
    travelerName: "",
    rating: 5,
    imageSrc: "",
    mediaType: "image",
  })

  const uploadedMediaUrlsRef = useRef<string[]>([])

  useEffect(() => {
    return () => {
      uploadedMediaUrlsRef.current.forEach((url) => {
        URL.revokeObjectURL(url)
      })
    }
  }, [])

  useEffect(() => {
    if (variant !== "featureGrid" || !travelerExperiences) return

    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL

    if (!apiBaseUrl) return

    let isMounted = true

    async function loadApprovedTravelerExperiences() {
      try {
        const response = await fetch(
          `${apiBaseUrl}/booking/experiences/traveler-experiences`,
        )

        if (!response.ok) return

        const payload = await response.json()
        const experiences = payload?.data?.experiences

        if (!isMounted || !Array.isArray(experiences)) return

        setApprovedTravelerExperiences(
          experiences.map((experience: any) => ({
            id: experience.id,
            imageSrc: experience.imageSrc,
            mediaType: experience.mediaType ?? "image",
            destination: experience.destination,
            feedback: experience.feedback,
            travelerName: experience.travelerName,
            rating: experience.rating,
          })),
        )
      } catch {
        // Approved traveler experiences are optional; keep static cards if this fails.
      }
    }

    loadApprovedTravelerExperiences()

    return () => {
      isMounted = false
    }
  }, [variant, travelerExperiences])

  const travelerExperienceCards = travelerExperiences
    ? [...travelerExperiences.cards, ...approvedTravelerExperiences]
    : []

  function resetTravelerForm() {
    setTravelerForm({
      destination: "",
      feedback: "",
      travelerName: "",
      rating: 5,
      imageSrc: "",
      mediaType: "image",
    })

    setSelectedTravelerFile(null)
    setRatingMenuOpen(false)
  }

  async function handleTravelerExperienceSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault()

    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL
    const destination = travelerForm.destination.trim()
    const feedback = travelerForm.feedback.trim()
    const travelerName = travelerForm.travelerName.trim()

    if (!destination || !feedback || !travelerName) {
      setTravelerSubmitMessage({
        type: "error",
        message: "Please complete the destination, feedback, and traveler name.",
      })
      return
    }

    if (!selectedTravelerFile) {
      setTravelerSubmitMessage({
        type: "error",
        message: "Please upload a travel photo or short video before submitting.",
      })
      return
    }

    if (!apiBaseUrl) {
      setTravelerSubmitMessage({
        type: "error",
        message: "Traveler experience submissions are not configured yet.",
      })
      return
    }

    const mediaType = selectedTravelerFile.type.startsWith("video/")
      ? "video"
      : "image"

    const contentType =
      selectedTravelerFile.type ||
      (mediaType === "video" ? "video/mp4" : "image/jpeg")

    setTravelerSubmitLoading(true)
    setTravelerSubmitMessage(null)

    try {
      const uploadUrlResponse = await fetch(
        `${apiBaseUrl}/booking/experiences/upload-url`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            fileName: selectedTravelerFile.name,
            contentType,
            mediaType,
          }),
        },
      )

      const uploadUrlPayload = await uploadUrlResponse.json().catch(() => null)

      if (!uploadUrlResponse.ok || !uploadUrlPayload?.data?.uploadUrl) {
        throw new Error(
          uploadUrlPayload?.error ||
          "Unable to prepare the media upload. Please try again.",
        )
      }

      const { uploadUrl, mediaKey, mediaUrl } = uploadUrlPayload.data

      const mediaUploadResponse = await fetch(uploadUrl, {
        method: "PUT",
        headers: {
          "Content-Type": contentType,
        },
        body: selectedTravelerFile,
      })

      if (!mediaUploadResponse.ok) {
        throw new Error("Unable to upload media. Please try again.")
      }

      const submissionResponse = await fetch(
        `${apiBaseUrl}/booking/experiences/traveler-submissions`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            destination,
            feedback,
            travelerName,
            rating: Math.min(5, Math.max(1, travelerForm.rating)),
            mediaUrl,
            mediaKey,
            mediaType,
          }),
        },
      )

      const submissionPayload = await submissionResponse.json().catch(() => null)

      if (!submissionResponse.ok) {
        throw new Error(
          submissionPayload?.error ||
          "Unable to submit your traveler experience right now.",
        )
      }

      resetTravelerForm()
      setTravelerModalOpen(false)
      setTravelerSubmitMessage({
        type: "success",
        message:
          "Thank you — your travel experience was submitted for review.",
      })
    } catch (error) {
      setTravelerSubmitMessage({
        type: "error",
        message:
          error instanceof Error
            ? error.message
            : "Unable to submit your traveler experience right now.",
      })
    } finally {
      setTravelerSubmitLoading(false)
    }
  }

  if (variant === "featureGrid") {
    return (
      <section className={`mx-auto max-w-7xl px-1 pb-20 ${className}`}>
        <div className="mb-6">
          <h2 className="text-3xl font-black tracking-tight text-slate-800">
            {title}
          </h2>

          <p className="mt-1 text-medium font-medium text-slate-800">
            {subtitle}
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {cards.map((deal) => (
            <div key={deal.id} className="space-y-3">
              <article className="group relative min-h-[560px] overflow-hidden rounded-[1.75rem] bg-slate-900 shadow-[0_18px_46px_rgba(15,23,42,0.18)]">
                <img
                  src={deal.imageSrc}
                  alt=""
                  className="absolute inset-0 h-full w-full object-cover"
                />

                <div className="absolute inset-0 bg-gradient-to-br from-slate-950/72 via-slate-950/24 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/48 via-transparent to-transparent" />
                <div className="absolute left-0 top-0 h-44 w-full bg-gradient-to-b from-slate-950/58 to-transparent" />

                <div className="relative z-10 flex min-h-[560px] flex-col justify-between p-6 sm:p-7">
                  <div className="max-w-[560px]">
                    <h3 className="text-4xl font-black tracking-tight text-white drop-shadow-[0_3px_14px_rgba(15,23,42,0.75)] sm:text-5xl">
                      {deal.title}
                    </h3>

                    <p className="mt-3 max-w-md text-lg font-bold leading-7 text-white drop-shadow-[0_2px_10px_rgba(15,23,42,0.75)]">
                      {deal.location}
                    </p>
                  </div>

                  <div className="flex items-end justify-between gap-5">
                    <div className="min-w-0">
                      {deal.logoSrc ? (
                        <img
                          src={deal.logoSrc}
                          alt={`${deal.title} logo`}
                          className="h-auto w-[260px] max-w-none translate-y-4 object-contain"
                        />
                      ) : null}
                    </div>

                    <div className="shrink-0">
                      {deal.href ? (
                        <a
                          href={deal.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex min-h-[56px] items-center justify-center rounded-full bg-blue-700 px-5 text-medium font-black text-white shadow-sm hover:bg-blue-500"
                        >
                          Explore
                        </a>
                      ) : (
                        <button
                          type="button"
                          className="inline-flex min-h-[56px] items-center justify-center rounded-full bg-blue-700 px-5 text-medium font-black text-white shadow-sm hover:bg-blue-500"
                        >
                          Explore
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </article>

              {deal.companyDescription ? (
                <p className="px-1 text-medium font-medium leading-6 text-slate-800">
                  {deal.companyDescription}
                </p>
              ) : null}
            </div>
          ))}
        </div>

        {discoverMore ? (
          <div className="mt-16">
            <div className="mb-6">
              <h2 className="text-3xl font-black tracking-tight text-slate-800">
                {discoverMore.title}
              </h2>

              <p className="mt-1 text-medium font-medium text-slate-800">
                {discoverMore.subtitle}
              </p>
            </div>

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {discoverMore.cards.map((card) => (
                <article key={card.id} className="group">
                  <div className="h-[260px] overflow-hidden rounded-2xl bg-slate-100 shadow-[0_12px_30px_rgba(15,23,42,0.10)]">
                    <img
                      src={card.imageSrc}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  </div>

                  <div className="mt-3">
                    <h3 className="text-base font-black tracking-tight text-slate-800">
                      {card.title}
                    </h3>

                    <p className="mt-1 text-sm font-medium leading-5 text-slate-600">
                      {card.subtitle}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        ) : null}

        {travelerExperiences ? (
          <div className="mt-20">
            <div className="mb-6">
              <h2 className="text-3xl font-black tracking-tight text-slate-800">
                {travelerExperiences.title}
              </h2>

              <p className="mt-1 max-w-3xl text-medium font-medium leading-6 text-slate-800">
                {travelerExperiences.subtitle}
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {travelerExperienceCards.map((card) => (
                <article key={card.id} className="group">
                  <div className="relative h-[285px] overflow-hidden rounded-2xl bg-slate-100 shadow-[0_12px_30px_rgba(15,23,42,0.10)]">
                    {(card.mediaType ?? "image") === "video" ? (
                      <video
                        src={card.imageSrc}
                        muted
                        autoPlay
                        loop
                        playsInline
                        preload="metadata"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <img
                        src={card.imageSrc}
                        alt=""
                        className="h-full w-full object-cover"
                      />
                    )}

                    <button
                      type="button"
                      onClick={() =>
                        setExpandedTravelerMedia({
                          src: card.imageSrc,
                          type: card.mediaType ?? "image",
                          title: card.destination,
                        })
                      }
                      className="absolute bottom-4 right-4 flex h-8 w-8 items-center justify-center text-white opacity-95 transition hover:scale-110 hover:opacity-100"
                      aria-label={`Expand ${card.destination} media`}
                    >
                      <svg
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                        className="h-7 w-7"
                        fill="none"
                      >
                        <path
                          d="M8 4H4v4"
                          stroke="currentColor"
                          strokeWidth="3"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M16 4h4v4"
                          stroke="currentColor"
                          strokeWidth="3"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M4 16v4h4"
                          stroke="currentColor"
                          strokeWidth="3"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M20 16v4h-4"
                          stroke="currentColor"
                          strokeWidth="3"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </button>
                  </div>

                  <div className="mt-4">
                    <h3 className="text-lg font-black tracking-tight text-slate-800">
                      {card.destination}
                    </h3>

                    <p className="mt-2 text-sm font-medium leading-6 text-slate-600">
                      “{card.feedback}”
                    </p>

                    <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                      <p className="text-sm font-black text-slate-800">
                        {card.travelerName}
                      </p>

                      <div
                        aria-label={`${card.rating} out of 5 stars`}
                        className="flex items-center gap-0.5 text-sm text-orange-500"
                      >
                        {Array.from({ length: 5 }).map((_, index) => (
                          <span key={index}>
                            {index < card.rating ? "★" : "☆"}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            <div className="mx-auto mt-16 max-w-2xl text-center">
              <h3 className="text-3xl font-black tracking-tight text-slate-800">
                Share your travel experience
              </h3>

              <p className="mt-3 text-medium font-medium leading-6 text-slate-800">
                Share a destination, hidden gem, or unforgettable travel moment with the
                Skysirv community. Submitted experiences will be reviewed before appearing
                here, helping other travelers discover places worth remembering.
              </p>

              {travelerSubmitMessage ? (
                <div
                  className={`mx-auto mt-5 max-w-xl rounded-2xl px-4 py-3 text-sm font-bold ${travelerSubmitMessage.type === "success"
                    ? "bg-green-50 text-green-700"
                    : "bg-red-50 text-red-700"
                    }`}
                >
                  {travelerSubmitMessage.message}
                </div>
              ) : null}

              <button
                type="button"
                onClick={() => {
                  setTravelerSubmitMessage(null)
                  setTravelerModalOpen(true)
                }}
                className="mt-6 inline-flex min-h-[46px] items-center justify-center rounded-full bg-blue-700 px-6 text-sm font-black text-white shadow-sm hover:bg-blue-500"
              >
                Add your experience
              </button>
            </div>
          </div>
        ) : null}

        {expandedTravelerMedia ? (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-950/75 px-4 backdrop-blur-sm">
            <div className="relative w-full max-w-5xl overflow-hidden rounded-[1.75rem] bg-slate-950 shadow-[0_28px_90px_rgba(15,23,42,0.38)]">
              <button
                type="button"
                onClick={() => setExpandedTravelerMedia(null)}
                className="absolute right-4 top-4 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-white/95 text-xl font-black text-slate-800 shadow-sm transition hover:bg-white"
                aria-label="Close expanded media"
              >
                ×
              </button>

              <div className="max-h-[82vh] bg-slate-950">
                {expandedTravelerMedia.type === "video" ? (
                  <video
                    src={expandedTravelerMedia.src}
                    controls
                    autoPlay
                    className="max-h-[82vh] w-full object-contain"
                  />
                ) : (
                  <img
                    src={expandedTravelerMedia.src}
                    alt=""
                    className="max-h-[82vh] w-full object-contain"
                  />
                )}
              </div>

              <div className="bg-white px-5 py-4">
                <p className="text-sm font-black text-slate-800">
                  {expandedTravelerMedia.title}
                </p>
              </div>
            </div>
          </div>
        ) : null}

        {travelerModalOpen ? (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-950/55 px-4 backdrop-blur-sm">
            <div className="w-full max-w-xl overflow-hidden rounded-[1.75rem] bg-white shadow-[0_28px_90px_rgba(15,23,42,0.28)]">
              <div className="border-b border-slate-200 px-6 py-5">
                <h3 className="text-2xl font-black tracking-tight text-slate-800">
                  Add your travel experience
                </h3>

                <p className="mt-1 text-sm font-medium leading-6 text-slate-600">
                  Share a destination, hidden gem, or unforgettable travel
                  moment with the Skysirv community.
                </p>
              </div>

              <form
                onSubmit={handleTravelerExperienceSubmit}
                className="space-y-4 px-6 py-5"
              >
                <div>
                  <label className="text-sm font-bold text-slate-800">
                    Destination
                  </label>

                  <input
                    value={travelerForm.destination}
                    onChange={(event) =>
                      setTravelerForm((current) => ({
                        ...current,
                        destination: event.target.value,
                      }))
                    }
                    placeholder="Example: Lake Titicaca, Bolivia"
                    className="mt-2 h-12 w-full rounded-2xl border border-slate-200 px-4 text-sm font-medium text-slate-800 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                  />
                </div>

                <div>
                  <label className="text-sm font-bold text-slate-800">
                    Your feedback
                  </label>

                  <textarea
                    value={travelerForm.feedback}
                    onChange={(event) =>
                      setTravelerForm((current) => ({
                        ...current,
                        feedback: event.target.value,
                      }))
                    }
                    placeholder="Tell travelers what made this place special..."
                    rows={4}
                    className="mt-2 w-full resize-none rounded-2xl border border-slate-200 px-4 py-3 text-sm font-medium leading-6 text-slate-800 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_120px]">
                  <div>
                    <label className="text-sm font-bold text-slate-800">
                      Traveler name
                    </label>

                    <input
                      value={travelerForm.travelerName}
                      onChange={(event) =>
                        setTravelerForm((current) => ({
                          ...current,
                          travelerName: event.target.value,
                        }))
                      }
                      placeholder="Example: Isabella C."
                      className="mt-2 h-12 w-full rounded-2xl border border-slate-200 px-4 text-sm font-medium text-slate-800 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                    />
                  </div>

                  <div className="relative">
                    <label className="text-sm font-bold text-slate-800">
                      Rating
                    </label>

                    <button
                      type="button"
                      onClick={() => setRatingMenuOpen((current) => !current)}
                      className="mt-2 flex h-12 w-full items-center justify-between rounded-2xl border border-slate-200 bg-white px-4 text-sm font-black text-slate-800 shadow-sm outline-none transition hover:border-blue-200 hover:bg-blue-50/30 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                      aria-expanded={ratingMenuOpen}
                    >
                      <span>{travelerForm.rating} stars</span>

                      <span
                        className={`text-blue-700 transition-transform ${ratingMenuOpen ? "rotate-180" : ""
                          }`}
                      >
                        <LargeChevron direction="down" />
                      </span>
                    </button>

                    {ratingMenuOpen ? (
                      <div className="absolute right-0 top-[76px] z-50 w-full overflow-hidden rounded-2xl border border-slate-200 bg-white p-1 shadow-[0_18px_48px_rgba(15,23,42,0.16)]">
                        {[5, 4, 3, 2, 1].map((rating) => (
                          <button
                            key={rating}
                            type="button"
                            onClick={() => {
                              setTravelerForm((current) => ({
                                ...current,
                                rating,
                              }))

                              setRatingMenuOpen(false)
                            }}
                            className={`flex min-h-[42px] w-full items-center rounded-xl px-3 text-left text-sm font-black transition ${travelerForm.rating === rating
                              ? "bg-blue-700 text-white"
                              : "text-slate-700 hover:bg-slate-50"
                              }`}
                          >
                            <span className="whitespace-nowrap">{rating} stars</span>
                          </button>
                        ))}
                      </div>
                    ) : null}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-bold text-slate-800">
                    Upload photo or video
                  </label>

                  <input
                    type="file"
                    accept="image/*,video/*"
                    onChange={(event) => {
                      const file = event.target.files?.[0]

                      if (!file) return

                      const isImage = file.type.startsWith("image/")
                      const isVideo = file.type.startsWith("video/")

                      if (!isImage && !isVideo) return

                      const objectUrl = URL.createObjectURL(file)

                      uploadedMediaUrlsRef.current.push(objectUrl)
                      setSelectedTravelerFile(file)
                      setTravelerSubmitMessage(null)

                      setTravelerForm((current) => ({
                        ...current,
                        imageSrc: objectUrl,
                        mediaType: isVideo ? "video" : "image",
                      }))
                    }}
                    className="mt-2 block w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-800 file:mr-4 file:rounded-full file:border-0 file:bg-blue-700 file:px-4 file:py-2 file:text-sm file:font-black file:text-white hover:file:bg-blue-600"
                  />

                  <p className="mt-2 text-xs font-medium leading-5 text-slate-500">
                    Upload a travel photo or short video. Submissions will be
                    reviewed before appearing publicly.
                  </p>
                </div>

                {travelerSubmitMessage ? (
                  <div
                    className={`rounded-2xl px-4 py-3 text-sm font-bold ${travelerSubmitMessage.type === "success"
                      ? "bg-green-50 text-green-700"
                      : "bg-red-50 text-red-700"
                      }`}
                  >
                    {travelerSubmitMessage.message}
                  </div>
                ) : null}

                <div className="flex flex-wrap justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      resetTravelerForm()
                      setTravelerModalOpen(false)
                    }}
                    className="inline-flex min-h-[42px] items-center justify-center rounded-full border border-slate-200 bg-white px-5 text-sm font-black text-slate-700 transition hover:bg-slate-50"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={travelerSubmitLoading}
                    className="inline-flex min-h-[42px] items-center justify-center rounded-full bg-blue-700 px-5 text-sm font-black text-white shadow-sm hover:bg-blue-600 disabled:cursor-not-allowed disabled:bg-slate-300"
                  >
                    {travelerSubmitLoading
                      ? "Submitting..."
                      : "Submit experience"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        ) : null}
      </section>
    )
  }

  return (
    <section className={`mx-auto max-w-7xl px-1 pb-20 ${className}`}>
      <div className="mb-7">
        <h2 className="text-3xl font-black tracking-tight text-slate-800">
          {title}
        </h2>

        <p className="mt-1 text-sm font-medium text-slate-700">
          {subtitle}
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {cards.map((deal) => (
          <article key={deal.id} className="group">
            <div className="relative h-[176px] overflow-hidden rounded-2xl bg-slate-100 shadow-[0_12px_32px_rgba(15,23,42,0.10)]">
              <img
                src={deal.imageSrc}
                alt=""
                className="h-full w-full object-cover"
              />

              <span className="absolute left-4 top-4 rounded-md bg-orange-500 px-3 py-1.5 text-xs font-black text-white shadow-sm">
                {deal.eyebrow}
              </span>
            </div>

            <div className="mt-4">
              <h3 className="text-xl font-black tracking-tight text-slate-800">
                {deal.title}
              </h3>

              <p className="mt-1 text-sm font-medium text-slate-600">
                {deal.location}
              </p>

              <p className="mt-3 text-2xl font-black tracking-tight text-slate-800">
                {deal.price}
              </p>

              <p className="text-xs font-semibold text-slate-600">
                {deal.meta}
              </p>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}