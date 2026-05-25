"use client"

import { FormEvent, useEffect, useRef, useState } from "react"
import AuthModal from "@/components/auth/AuthModal"
import AuthPanel from "@/components/auth/AuthPanel"
import { getAuthToken } from "@/utils/auth-storage"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

type DashboardLucyTier = "free" | "pro" | "business"

type DashboardRouteContext = {
  id?: string
  origin: string
  destination: string
  departureDate?: string | null
  routeLabel?: string
  latestPrice?: number | null
  averagePrice?: number | null
  bookingSignal?: string | null
  recommendedFlights?: Array<{
    airline?: string | null
    airlineName?: string | null
    airlineLogoSymbolUrl?: string | null
    airlineLogoLockupUrl?: string | null
    flightNumber?: string | null
    price?: number | null
    currency?: string | null
    stopCount?: number | null
  }>
}

type DashboardFlightAttendantProps = {
  tier: DashboardLucyTier
  placement?: "inline" | "floating"
  defaultOpen?: boolean
  dashboardRoutes?: DashboardRouteContext[]
}

type FlightAttendantMessage = {
  id: string
  role: "assistant" | "user"
  label: string
  text: string
}

type LucyWatchlistAction = {
  type: "add_watchlist_route"
  status: "needs_confirmation"
  origin: string
  destination: string
  departureDate: string
  routeLabel?: string
  confirmationPrompt?: string
}

type LucyPreferredAirportsAction = {
  type: "save_preferred_airports"
  status: "needs_confirmation"
  airportCodes: string[]
  airportLabels?: string[]
  confirmationPrompt?: string
}

type LucyPreferredRouteAction = {
  type: "save_preferred_route"
  status: "needs_confirmation"
  origin: string
  destination: string
  routeLabel?: string
  confirmationPrompt?: string
}

type LucySaveFirstNameAction = {
  type: "save_first_name"
  status: "needs_confirmation"
  firstName: string
  confirmationPrompt?: string
}

type LucySaveVisibleFlightAction = {
  type: "save_visible_flight"
  status: "needs_confirmation"
  origin: string
  destination: string
  departureDate?: string | null
  airline?: string | null
  airlineName?: string | null
  flightNumber?: string | null
  price?: number | null
  currency?: string | null
  flightLabel?: string
  confirmationPrompt?: string
}

type LucyAction =
  | LucyWatchlistAction
  | LucyPreferredAirportsAction
  | LucyPreferredRouteAction
  | LucySaveFirstNameAction
  | LucySaveVisibleFlightAction

type FlightAttendantApiResponse = {
  success?: boolean
  model?: string
  reply?: string
  action?: LucyAction | null
  error?: string
}

type LucyVoiceStatus =
  | "idle"
  | "connecting"
  | "listening"
  | "speaking"
  | "error"

type LucyRealtimeSessionResponse = {
  success?: boolean
  model?: string
  voice?: string
  plan?: string
  session?: {
    value?: string
    client_secret?: {
      value?: string
    }
    session?: {
      client_secret?: {
        value?: string
      }
    }
  }
  error?: string
}

const tierConfig: Record<
  DashboardLucyTier,
  {
    badge: string
    title: string
    welcome: string
    placeholder: string
  }
> = {
  free: {
    badge: "Limited",
    title: "Free Flight Attendant",
    welcome:
      "Hi, I’m Lucy, your Skysirv Flight Attendant. I can help explain Skysirv basics, watchlists, fare signals, and how to get started with smarter flight monitoring.",
    placeholder: "Ask Lucy about Skysirv basics...",
  },
  pro: {
    badge: "Standard",
    title: "Pro Flight Attendant",
    welcome:
      "Hi, I’m Lucy, your Skysirv Flight Attendant. I can help explain your routes, fare timing, Skyscore, watchlist signals, and booking confidence.",
    placeholder: "Ask Lucy about your trip...",
  },
  business: {
    badge: "Advanced",
    title: "Business Flight Attendant",
    welcome:
      "Hi, I’m Lucy, your advanced Skysirv Flight Attendant. I can help analyze route behavior, fare intelligence, saved flights, timing signals, and premium booking decisions.",
    placeholder: "Ask Lucy for deeper flight intelligence...",
  },
}

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ")
}

function createMessageId() {
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`
}

function sanitizeLucyText(text: string) {
  return text
    .replace(/\*\*(.*?)\*\*/g, "$1")
    .replace(/__(.*?)__/g, "$1")
    .replace(/^\s{0,3}#{1,6}\s+/gm, "")
    .trim()
}

function normalizeLucyAction(value: unknown): LucyAction | null {
  if (!value || typeof value !== "object") return null

  const input = value as Partial<LucyAction>

  if (input.status !== "needs_confirmation") return null

  if (input.type === "add_watchlist_route") {
    const origin = input.origin?.trim().toUpperCase()
    const destination = input.destination?.trim().toUpperCase()
    const departureDate = input.departureDate?.trim()

    if (!origin || !destination || !departureDate) return null
    if (!/^[A-Z0-9]{3,4}$/.test(origin)) return null
    if (!/^[A-Z0-9]{3,4}$/.test(destination)) return null
    if (!/^\d{2}-\d{2}-\d{4}$/.test(departureDate)) return null
    if (origin === destination) return null

    return {
      type: "add_watchlist_route",
      status: "needs_confirmation",
      origin,
      destination,
      departureDate,
      routeLabel: input.routeLabel,
      confirmationPrompt: input.confirmationPrompt,
    }
  }

  if (input.type === "save_preferred_airports") {
    const rawAirportCodes = Array.isArray(input.airportCodes)
      ? input.airportCodes
      : []

    const airportCodes = Array.from(
      new Set(
        rawAirportCodes
          .map((code) =>
            typeof code === "string" ? code.trim().toUpperCase() : ""
          )
          .filter((code) => /^[A-Z0-9]{3,4}$/.test(code))
      )
    )

    if (!airportCodes.length) return null

    return {
      type: "save_preferred_airports",
      status: "needs_confirmation",
      airportCodes,
      airportLabels: Array.isArray(input.airportLabels)
        ? input.airportLabels.filter(
          (label): label is string => typeof label === "string"
        )
        : undefined,
      confirmationPrompt: input.confirmationPrompt,
    }
  }

  if (input.type === "save_first_name") {
    const firstName =
      typeof input.firstName === "string"
        ? input.firstName.trim().replace(/\s+/g, " ")
        : ""

    if (!firstName || firstName.length > 80) return null

    return {
      type: "save_first_name",
      status: "needs_confirmation",
      firstName,
      confirmationPrompt: input.confirmationPrompt,
    }
  }

  if (input.type === "save_preferred_route") {
    const origin = input.origin?.trim().toUpperCase()
    const destination = input.destination?.trim().toUpperCase()

    if (!origin || !destination) return null
    if (!/^[A-Z0-9]{3,4}$/.test(origin)) return null
    if (!/^[A-Z0-9]{3,4}$/.test(destination)) return null
    if (origin === destination) return null

    return {
      type: "save_preferred_route",
      status: "needs_confirmation",
      origin,
      destination,
      routeLabel: input.routeLabel,
      confirmationPrompt: input.confirmationPrompt,
    }
  }

  if (input.type === "save_visible_flight") {
    const origin = input.origin?.trim().toUpperCase()
    const destination = input.destination?.trim().toUpperCase()

    if (!origin || !destination) return null
    if (!/^[A-Z0-9]{3,4}$/.test(origin)) return null
    if (!/^[A-Z0-9]{3,4}$/.test(destination)) return null
    if (origin === destination) return null

    const departureDate =
      typeof input.departureDate === "string" && input.departureDate.trim()
        ? input.departureDate.trim()
        : null

    const airline =
      typeof input.airline === "string" && input.airline.trim()
        ? input.airline.trim().toUpperCase()
        : null

    const airlineName =
      typeof input.airlineName === "string" && input.airlineName.trim()
        ? input.airlineName.trim()
        : null

    const flightNumber =
      typeof input.flightNumber === "string" && input.flightNumber.trim()
        ? input.flightNumber.trim().toUpperCase()
        : null

    const price =
      typeof input.price === "number" && Number.isFinite(input.price)
        ? input.price
        : null

    const currency =
      typeof input.currency === "string" && input.currency.trim()
        ? input.currency.trim().toUpperCase()
        : "USD"

    const flightLabel =
      typeof input.flightLabel === "string" && input.flightLabel.trim()
        ? input.flightLabel.trim()
        : `${airlineName || airline || "Flight"}${flightNumber ? ` ${flightNumber}` : ""
        }`

    return {
      type: "save_visible_flight",
      status: "needs_confirmation",
      origin,
      destination,
      departureDate,
      airline,
      airlineName,
      flightNumber,
      price,
      currency,
      flightLabel,
      confirmationPrompt: input.confirmationPrompt,
    }
  }

  return null
}

function isAffirmativeRouteConfirmation(message: string) {
  const normalized = message.trim().toLowerCase()

  return (
    /^(yes|yep|yeah|correct|confirm|please|sure|ok|okay)\b/.test(normalized) ||
    normalized.includes("yes please") ||
    normalized.includes("go ahead") ||
    normalized.includes("add it") ||
    normalized.includes("add this") ||
    normalized.includes("track it") ||
    normalized.includes("save it")
  )
}

function isNegativeRouteConfirmation(message: string) {
  const normalized = message.trim().toLowerCase()

  return (
    /^(no|nope|cancel|not now)\b/.test(normalized) ||
    normalized.includes("do not add") ||
    normalized.includes("don't add") ||
    normalized.includes("do not save") ||
    normalized.includes("don't save")
  )
}

function isClearlySkysirvVoiceIntent(message: string) {
  const normalized = message.trim().toLowerCase()

  if (!normalized) return false

  const skysirvSignals = [
    "lucy",
    "skysirv",
    "flight",
    "flights",
    "fare",
    "fares",
    "route",
    "routes",
    "watchlist",
    "watch list",
    "saved flights",
    "save flight",
    "save that flight",
    "track",
    "tracking",
    "airport",
    "airline",
    "price",
    "prices",
    "booking",
    "book",
    "alert",
    "alerts",
    "jfk",
    "mia",
    "bos",
    "iah",
    "ord",
    "lax",
    "houston",
    "miami",
    "boston",
    "chicago",
    "los angeles",
  ]

  return skysirvSignals.some((signal) => normalized.includes(signal))
}

function findRecentlyConfirmedVoiceRoute({
  message,
  confirmedRoutes,
}: {
  message: string
  confirmedRoutes: Array<{
    origin: string
    destination: string
    departureDate: string
    routeLabel?: string
    confirmedAt: number
  }>
}) {
  const normalized = message.toLowerCase()

  return confirmedRoutes.find((route) => {
    const origin = route.origin.toLowerCase()
    const destination = route.destination.toLowerCase()
    const routeLabel = route.routeLabel?.toLowerCase() ?? ""

    const routeMentioned =
      normalized.includes(origin) ||
      normalized.includes(destination) ||
      (routeLabel && normalized.includes(routeLabel))

    const recentlyConfirmed = Date.now() - route.confirmedAt < 10 * 60 * 1000

    return routeMentioned && recentlyConfirmed
  })
}

function getLucyActionLabel(action: LucyAction) {
  if (action.type === "save_first_name") {
    return action.firstName
  }

  if (action.type === "add_watchlist_route") {
    return `${action.origin} → ${action.destination} for ${action.departureDate}`
  }

  if (action.type === "save_preferred_airports") {
    return action.airportCodes.join(" and ")
  }

  return `${action.origin} → ${action.destination}`
}

function normalizeFlightSearchText(value?: string | null) {
  return String(value ?? "").toUpperCase().replace(/\s+/g, "")
}

function isVisibleFlightSaveRequest(message: string) {
  const normalized = message.trim().toLowerCase()

  if (!normalized) return false

  const savedFlightQuestionSignals = [
    "what flights do i have saved",
    "what saved flights",
    "show me my saved flights",
    "do i have that flight saved",
    "is that flight saved",
    "have i saved that flight",
    "which flights are saved",
    "flights do i have saved",
  ]

  if (
    savedFlightQuestionSignals.some((signal) =>
      normalized.includes(signal)
    )
  ) {
    return false
  }

  const directSaveSignals = [
    "save that flight",
    "save this flight",
    "save the flight",
    "save flight",
    "save it to my saved flights",
    "save this one",
    "save that one",
    "add that flight to my saved flights",
    "add this flight to my saved flights",
    "add it to my saved flights",
  ]

  return directSaveSignals.some((signal) => normalized.includes(signal))
}

function formatReadableFlightDate(value?: string | null) {
  if (!value) return null

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) return value

  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  })
}

function formatVisibleFlightPrice(value?: number | null, currency = "USD") {
  if (typeof value !== "number" || !Number.isFinite(value)) return null

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(value)
}

function shouldIgnoreDuplicateVoiceToolCall(
  key: string,
  lastCallRef: {
    current: {
      key: string
      timestamp: number
    } | null
  }
) {
  const now = Date.now()
  const lastCall = lastCallRef.current

  if (
    lastCall &&
    lastCall.key === key &&
    now - lastCall.timestamp < 5000
  ) {
    return true
  }

  lastCallRef.current = {
    key,
    timestamp: now,
  }

  return false
}

function buildLocalVisibleFlightSaveAction({
  message,
  messages,
  dashboardRoutes,
}: {
  message: string
  messages: FlightAttendantMessage[]
  dashboardRoutes: DashboardRouteContext[]
}): LucySaveVisibleFlightAction | null {
  if (!isVisibleFlightSaveRequest(message)) return null

  const visibleFlights = dashboardRoutes.flatMap((route) => {
    const origin = route.origin?.trim().toUpperCase()
    const destination = route.destination?.trim().toUpperCase()

    if (!origin || !destination) return []

    const flights = Array.isArray(route.recommendedFlights)
      ? route.recommendedFlights
      : []

    return flights
      .filter((flight) => flight.flightNumber || flight.airline || flight.airlineName)
      .map((flight) => ({
        route,
        origin,
        destination,
        flight,
        normalizedFlightNumber: normalizeFlightSearchText(flight.flightNumber),
      }))
  })

  if (!visibleFlights.length) return null

  const recentMessages = [...messages].reverse()

  const matchedFlight = recentMessages
    .flatMap((item) => {
      const messageText = normalizeFlightSearchText(item.text)

      return visibleFlights.filter((candidate) => {
        if (!candidate.normalizedFlightNumber) return false

        const numericFlightNumber = candidate.normalizedFlightNumber.replace(
          /^[A-Z]+/,
          ""
        )

        return (
          messageText.includes(candidate.normalizedFlightNumber) ||
          Boolean(
            numericFlightNumber &&
            numericFlightNumber.length >= 2 &&
            messageText.includes(numericFlightNumber)
          )
        )
      })
    })
    .at(0)

  if (!matchedFlight) return null

  const { route, origin, destination, flight } = matchedFlight

  const airline =
    typeof flight.airline === "string" && flight.airline.trim()
      ? flight.airline.trim().toUpperCase()
      : null

  const airlineName =
    typeof flight.airlineName === "string" && flight.airlineName.trim()
      ? flight.airlineName.trim()
      : null

  const flightNumber =
    typeof flight.flightNumber === "string" && flight.flightNumber.trim()
      ? flight.flightNumber.trim().toUpperCase()
      : null

  const price =
    typeof flight.price === "number" && Number.isFinite(flight.price)
      ? flight.price
      : null

  const currency =
    typeof flight.currency === "string" && flight.currency.trim()
      ? flight.currency.trim().toUpperCase()
      : "USD"

  const departureDate =
    typeof route.departureDate === "string" && route.departureDate.trim()
      ? route.departureDate.trim()
      : null

  const flightLabel = `${airlineName || airline || "Flight"}${flightNumber ? ` ${flightNumber}` : ""
    }`.trim()

  const readableDate = formatReadableFlightDate(departureDate)
  const priceLabel = formatVisibleFlightPrice(price, currency)

  const detailParts = [
    `${origin} → ${destination}`,
    readableDate ? `on ${readableDate}` : null,
    priceLabel ? `for ${priceLabel}` : null,
  ].filter(Boolean)

  const confirmationPrompt = `Save ${flightLabel} ${detailParts.join(
    " "
  )} to your Saved Flights?`

  return {
    type: "save_visible_flight",
    status: "needs_confirmation",
    origin,
    destination,
    departureDate,
    airline,
    airlineName,
    flightNumber,
    price,
    currency,
    flightLabel,
    confirmationPrompt,
  }
}

export default function DashboardFlightAttendant({
  tier,
  placement = "floating",
  defaultOpen = false,
  dashboardRoutes = [],
}: DashboardFlightAttendantProps) {
  const config = tierConfig[tier]

  const [open, setOpen] = useState(defaultOpen)
  const [expanded, setExpanded] = useState(false)
  const [messages, setMessages] = useState<FlightAttendantMessage[]>([
    {
      id: "welcome-1",
      role: "assistant",
      label: "Lucy",
      text: config.welcome,
    },
  ])
  const [chatInput, setChatInput] = useState("")
  const [chatLoading, setChatLoading] = useState(false)
  const [assistantTyping, setAssistantTyping] = useState(false)
  const [authRequired, setAuthRequired] = useState(false)
  const [authModalOpen, setAuthModalOpen] = useState(false)
  const [pendingLucyAction, setPendingLucyAction] =
    useState<LucyAction | null>(null)
  const [voiceStatus, setVoiceStatus] = useState<LucyVoiceStatus>("idle")
  const suppressNextVoiceAssistantReplyRef = useRef(false)
  const suppressNextRealtimeSpeechTextRef = useRef(false)
  const localRealtimeSpeechMessageIdRef = useRef<string | null>(null)
  const pendingLucyActionRef = useRef<LucyAction | null>(null)
  const lastVoiceToolCallRef = useRef<{
    key: string
    timestamp: number
  } | null>(null)
  const messagesEndRef = useRef<HTMLDivElement | null>(null)
  const realtimePeerConnectionRef = useRef<RTCPeerConnection | null>(null)
  const realtimeLocalStreamRef = useRef<MediaStream | null>(null)
  const realtimeAudioElementRef = useRef<HTMLAudioElement | null>(null)
  const realtimeDataChannelRef = useRef<RTCDataChannel | null>(null)
  const realtimeMicPausedForLucyRef = useRef(false)
  const latestDashboardRoutesRef = useRef<DashboardRouteContext[]>(dashboardRoutes)
  const confirmedVoiceWatchlistRoutesRef = useRef<
    Array<{
      origin: string
      destination: string
      departureDate: string
      routeLabel?: string
      confirmedAt: number
    }>
  >([])

  useEffect(() => {
    if (!open) return

    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    })
  }, [messages, chatLoading, assistantTyping, open, expanded])

  useEffect(() => {
    if (!expanded) return

    const originalOverflow = document.body.style.overflow

    document.body.style.overflow = "hidden"

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setExpanded(false)
      }
    }

    window.addEventListener("keydown", handleKeyDown)

    return () => {
      document.body.style.overflow = originalOverflow
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [expanded])

  useEffect(() => {
    return () => {
      realtimePeerConnectionRef.current?.close()
      realtimePeerConnectionRef.current = null

      realtimeLocalStreamRef.current?.getTracks().forEach((track) => {
        track.stop()
      })
      realtimeLocalStreamRef.current = null

      if (realtimeAudioElementRef.current) {
        realtimeAudioElementRef.current.pause()
        realtimeAudioElementRef.current.srcObject = null
        realtimeAudioElementRef.current = null
      }
    }
  }, [])

  useEffect(() => {
    latestDashboardRoutesRef.current = dashboardRoutes
  }, [dashboardRoutes])

  async function typeAssistantReply(messageId: string, fullText: string) {
    setAssistantTyping(true)

    const chunks = fullText.split(/(\s+)/)

    await new Promise<void>((resolve) => {
      let index = 0

      const timer = window.setInterval(() => {
        index += 1

        setMessages((prev) =>
          prev.map((message) =>
            message.id === messageId
              ? {
                ...message,
                text: chunks.slice(0, index).join(""),
              }
              : message
          )
        )

        if (index >= chunks.length) {
          window.clearInterval(timer)
          resolve()
        }
      }, 22)
    })

    setAssistantTyping(false)
  }

  async function appendTypedAssistantReply(fullText: string) {
    const assistantMessageId = createMessageId()

    setMessages((prev) => [
      ...prev,
      {
        id: assistantMessageId,
        role: "assistant",
        label: "Lucy",
        text: "",
      },
    ])

    await typeAssistantReply(assistantMessageId, fullText)
  }

  async function handleConfirmPendingLucyAction(action: LucyAction, token: string) {
    if (!API_BASE_URL) return

    setChatLoading(true)

    try {
      let successReply = ""

      if (action.type === "save_first_name") {
        const response = await fetch(
          `${API_BASE_URL}/api/user-preferences/profile-name`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              firstName: action.firstName,
            }),
          }
        )

        const data = await response.json().catch(() => null)

        if (!response.ok) {
          throw new Error(
            data?.error ||
            "I couldn’t save your name yet. Please try again in a moment."
          )
        }

        window.dispatchEvent(
          new CustomEvent("skysirv:profile-name-updated", {
            detail: data,
          })
        )

        successReply = `Done — I’ll remember your name as ${action.firstName} for future Skysirv sessions.`
      }

      if (action.type === "add_watchlist_route") {
        console.log("Lucy watchlist voice action:", action)

        const response = await fetch(`${API_BASE_URL}/watchlist`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            origin: action.origin,
            destination: action.destination,
            departureDate: action.departureDate,
            departure_date: action.departureDate,
          }),
        })

        const data = await response.json().catch(() => null)
        console.log("Lucy watchlist response:", response.status, data)

        if (!response.ok) {
          const message =
            response.status === 403
              ? "Your current plan has reached its watchlist limit. You’ll need to remove a route or upgrade before Lucy can add another one."
              : data?.error ||
              "I couldn’t add that route to your watchlist yet. Please try again in a moment."

          throw new Error(message)
        }

        window.dispatchEvent(
          new CustomEvent("skysirv:watchlist-updated", {
            detail: {
              origin: action.origin,
              destination: action.destination,
              departureDate: action.departureDate,
              result: data,
            },
          })
        )

        confirmedVoiceWatchlistRoutesRef.current = [
          {
            origin: action.origin,
            destination: action.destination,
            departureDate: action.departureDate,
            routeLabel: action.routeLabel,
            confirmedAt: Date.now(),
          },
          ...confirmedVoiceWatchlistRoutesRef.current,
        ].slice(0, 10)

        successReply = "Done — it’s on your watchlist."
      }

      if (action.type === "save_visible_flight") {
        const response = await fetch(`${API_BASE_URL}/saved-flights`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            origin: action.origin,
            destination: action.destination,
            departureDate: action.departureDate ?? null,
            airline: action.airline ?? null,
            flightNumber: action.flightNumber ?? null,
            price: action.price ?? null,
            currency: action.currency ?? "USD",
          }),
        })

        const data = await response.json().catch(() => null)

        if (action.type === "save_visible_flight") {
          const response = await fetch(`${API_BASE_URL}/saved-flights`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              origin: action.origin,
              destination: action.destination,
              departureDate: action.departureDate ?? null,
              airline: action.airline ?? null,
              flightNumber: action.flightNumber ?? null,
              price: action.price ?? null,
              currency: action.currency ?? "USD",
            }),
          })

          const data = await response.json().catch(() => null)

          if (!response.ok) {
            if (response.status === 409) {
              successReply = "That flight is already in your Saved Flights."
            } else {
              throw new Error(
                data?.error ||
                "I couldn’t save that flight yet. Please try again in a moment."
              )
            }
          } else {
            window.dispatchEvent(
              new CustomEvent("skysirv:saved-flights-updated", {
                detail: {
                  origin: action.origin,
                  destination: action.destination,
                  departureDate: action.departureDate,
                  airline: action.airline,
                  airlineName: action.airlineName,
                  flightNumber: action.flightNumber,
                  price: action.price,
                  currency: action.currency,
                  result: data,
                },
              })
            )

            successReply = `Done — I saved ${action.flightLabel || action.flightNumber || "that flight"
              } to your Saved Flights.`
          }
        }

        window.dispatchEvent(
          new CustomEvent("skysirv:saved-flights-updated", {
            detail: {
              origin: action.origin,
              destination: action.destination,
              departureDate: action.departureDate,
              airline: action.airline,
              airlineName: action.airlineName,
              flightNumber: action.flightNumber,
              price: action.price,
              currency: action.currency,
              result: data,
            },
          })
        )

        successReply = `Done — I saved ${action.flightLabel || action.flightNumber || "that flight"
          } to your Saved Flights.`
      }

      if (action.type === "save_preferred_airports") {
        const response = await fetch(
          `${API_BASE_URL}/api/user-preferences/preferred-airports`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              airportCodes: action.airportCodes,
            }),
          }
        )

        const data = await response.json().catch(() => null)

        if (!response.ok) {
          throw new Error(
            data?.error ||
            "I couldn’t save those preferred airports yet. Please try again in a moment."
          )
        }

        window.dispatchEvent(
          new CustomEvent("skysirv:preferred-airports-updated", {
            detail: data,
          })
        )

        successReply = `Done — I saved ${getLucyActionLabel(
          action
        )} as preferred airports.`
      }

      if (action.type === "save_preferred_route") {
        const response = await fetch(
          `${API_BASE_URL}/api/user-preferences/preferred-routes`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              origin: action.origin,
              destination: action.destination,
            }),
          }
        )

        const data = await response.json().catch(() => null)

        if (!response.ok) {
          throw new Error(
            data?.error ||
            "I couldn’t save that preferred route yet. Please try again in a moment."
          )
        }

        window.dispatchEvent(
          new CustomEvent("skysirv:preferred-routes-updated", {
            detail: data,
          })
        )

        successReply = `Done — I saved ${getLucyActionLabel(
          action
        )} as a preferred route.`
      }

      setPendingLucyAction(null)
      pendingLucyActionRef.current = null

      const finalSuccessReply = successReply || "Done — I saved that preference."

      await appendTypedAssistantReply(finalSuccessReply)

      if (voiceStatus !== "idle") {
        speakWithRealtimeLucyVoice(finalSuccessReply)
      }
    } catch (error: any) {
      await appendTypedAssistantReply(
        error?.message ||
        "I couldn’t save that action yet. Please try again in a moment."
      )
    } finally {
      setChatLoading(false)
    }
  }

  function setRealtimeMicrophoneEnabled(enabled: boolean) {
    realtimeLocalStreamRef.current?.getAudioTracks().forEach((track) => {
      track.enabled = enabled
    })
  }

  function pauseRealtimeMicrophoneForLucy() {
    if (realtimeMicPausedForLucyRef.current) return

    realtimeMicPausedForLucyRef.current = true
    setRealtimeMicrophoneEnabled(false)
  }

  function resumeRealtimeMicrophoneAfterLucy() {
    if (!realtimeMicPausedForLucyRef.current) return

    realtimeMicPausedForLucyRef.current = false
    setRealtimeMicrophoneEnabled(true)
  }

  function stopLucyVoiceSession() {
    realtimeMicPausedForLucyRef.current = false
    setRealtimeMicrophoneEnabled(true)

    realtimeDataChannelRef.current?.close()
    realtimeDataChannelRef.current = null
    realtimePeerConnectionRef.current?.close()
    realtimePeerConnectionRef.current = null

    realtimeLocalStreamRef.current?.getTracks().forEach((track) => {
      track.stop()
    })
    realtimeLocalStreamRef.current = null

    if (realtimeAudioElementRef.current) {
      realtimeAudioElementRef.current.pause()
      realtimeAudioElementRef.current.srcObject = null
      realtimeAudioElementRef.current = null
    }

    setVoiceStatus("idle")
  }

  function speakLocalLucyVoice(text: string) {
    if (typeof window === "undefined") return
    if (!("speechSynthesis" in window)) return

    window.speechSynthesis.cancel()

    const utterance = new SpeechSynthesisUtterance(text)
    utterance.rate = 1
    utterance.pitch = 1
    utterance.volume = 1

    window.speechSynthesis.speak(utterance)
  }

  function speakWithRealtimeLucyVoice(text: string) {
    const dataChannel = realtimeDataChannelRef.current
    const cleanText = text.trim()

    if (!dataChannel || dataChannel.readyState !== "open") return
    if (!cleanText) return

    const messageId = createMessageId()
    localRealtimeSpeechMessageIdRef.current = messageId
    suppressNextRealtimeSpeechTextRef.current = false

    setMessages((prev) => [
      ...prev,
      {
        id: messageId,
        role: "assistant",
        label: "Lucy",
        text: "",
      },
    ])

    try {
      dataChannel.send(
        JSON.stringify({
          type: "response.create",
          response: {
            instructions: `Say exactly this in Lucy's voice, in English, with no extra words: ${JSON.stringify(
              cleanText
            )}`,
          },
        })
      )
    } catch {
      localRealtimeSpeechMessageIdRef.current = null

      setMessages((prev) =>
        prev.map((message) =>
          message.id === messageId
            ? {
              ...message,
              text: cleanText,
            }
            : message
        )
      )
    }
  }

  async function startLucyVoiceSession() {
    if (tier === "free") {
      await appendTypedAssistantReply(
        "Lucy voice is available on Pro and Business plans."
      )
      return
    }

    if (!API_BASE_URL) {
      await appendTypedAssistantReply(
        "Lucy voice is not configured yet. Please try again once the API connection is available."
      )
      return
    }

    const token = getAuthToken()

    if (!token) {
      setAuthRequired(true)
      setAuthModalOpen(true)
      return
    }

    if (voiceStatus !== "idle") {
      stopLucyVoiceSession()
      return
    }

    setVoiceStatus("connecting")

    try {
      const sessionResponse = await fetch(
        `${API_BASE_URL}/api/flight-attendant/realtime-session`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            dashboardRoutes: latestDashboardRoutesRef.current,
          }),
        }
      )

      const sessionData =
        (await sessionResponse.json().catch(() => null)) as
        | LucyRealtimeSessionResponse
        | null

      if (!sessionResponse.ok) {
        throw new Error(
          sessionData?.error || "Lucy voice could not be started."
        )
      }

      const clientSecret =
        sessionData?.session?.value ||
        sessionData?.session?.client_secret?.value ||
        sessionData?.session?.session?.client_secret?.value

      if (!clientSecret) {
        throw new Error("Lucy voice session did not return a client secret.")
      }

      const peerConnection = new RTCPeerConnection()
      realtimePeerConnectionRef.current = peerConnection

      const audioElement = document.createElement("audio")
      audioElement.autoplay = true
      realtimeAudioElementRef.current = audioElement

      peerConnection.ontrack = (event) => {
        audioElement.srcObject = event.streams[0]
        setVoiceStatus("speaking")
      }

      const localStream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      })

      realtimeLocalStreamRef.current = localStream

      localStream.getAudioTracks().forEach((track) => {
        peerConnection.addTrack(track, localStream)
      })

      const dataChannel = peerConnection.createDataChannel("oai-events")
      realtimeDataChannelRef.current = dataChannel

      dataChannel.addEventListener("open", () => {
        setVoiceStatus("listening")
      })

      let activeUserVoiceMessageId: string | null = null
      let activeAssistantVoiceMessageId: string | null = null

      function handleRealtimeWatchlistToolCall(item: any) {
        if (item?.name !== "prepare_watchlist_route") return

        const rawArguments =
          typeof item.arguments === "string" ? item.arguments : ""

        if (!rawArguments) return

        try {
          const parsed = JSON.parse(rawArguments)

          const action = normalizeLucyAction({
            type: "add_watchlist_route",
            status: "needs_confirmation",
            origin: parsed.origin,
            destination: parsed.destination,
            departureDate: parsed.departureDate,
            routeLabel: parsed.routeLabel,
            confirmationPrompt: parsed.confirmationPrompt,
          })

          if (!action || action.type !== "add_watchlist_route") return

          const duplicateKey = [
            action.type,
            action.origin,
            action.destination,
            action.departureDate,
          ].join(":")

          if (
            shouldIgnoreDuplicateVoiceToolCall(
              duplicateKey,
              lastVoiceToolCallRef
            )
          ) {
            return
          }

          setPendingLucyAction(action)
          pendingLucyActionRef.current = action
          activeAssistantVoiceMessageId = null
          suppressNextVoiceAssistantReplyRef.current = true

          try {
            realtimeDataChannelRef.current?.send(
              JSON.stringify({
                type: "response.cancel",
              })
            )
          } catch {
            // Ignore cancel errors.
          }

          const confirmationText =
            action.confirmationPrompt ||
            `Add ${action.origin} → ${action.destination} for ${action.departureDate} to your watchlist?`

          setMessages((prev) => {
            const lastMessage = prev[prev.length - 1]

            if (
              lastMessage?.role === "assistant" &&
              lastMessage.text.trim() === confirmationText.trim()
            ) {
              return prev
            }

            return [
              ...prev,
              {
                id: createMessageId(),
                role: "assistant",
                label: "Lucy",
                text: confirmationText,
              },
            ]
          })

          speakWithRealtimeLucyVoice(confirmationText)

        } catch {
          // Ignore malformed realtime tool arguments.
        }
      }

      function handleRealtimeSaveVisibleFlightToolCall(item: any) {
        if (item?.name !== "prepare_save_visible_flight") return

        const rawArguments =
          typeof item.arguments === "string" ? item.arguments : ""

        if (!rawArguments) return

        try {
          const parsed = JSON.parse(rawArguments)

          const parsedPrice =
            typeof parsed.price === "number" ? parsed.price : Number(parsed.price)

          const action = normalizeLucyAction({
            type: "save_visible_flight",
            status: "needs_confirmation",
            origin: parsed.origin,
            destination: parsed.destination,
            departureDate: parsed.departureDate,
            airline: parsed.airline,
            airlineName: parsed.airlineName,
            flightNumber: parsed.flightNumber,
            price: Number.isFinite(parsedPrice) ? parsedPrice : null,
            currency: parsed.currency,
            flightLabel: parsed.flightLabel,
            confirmationPrompt: parsed.confirmationPrompt,
          })

          if (!action || action.type !== "save_visible_flight") return

          const duplicateKey = [
            action.type,
            action.origin,
            action.destination,
            action.departureDate ?? "",
            action.flightNumber ?? "",
          ].join(":")

          if (
            shouldIgnoreDuplicateVoiceToolCall(
              duplicateKey,
              lastVoiceToolCallRef
            )
          ) {
            return
          }

          setPendingLucyAction(action)
          pendingLucyActionRef.current = action
          activeAssistantVoiceMessageId = null
          suppressNextVoiceAssistantReplyRef.current = true

          try {
            realtimeDataChannelRef.current?.send(
              JSON.stringify({
                type: "response.cancel",
              })
            )
          } catch {
            // Ignore cancel errors.
          }

          const confirmationText =
            action.confirmationPrompt ||
            `Save ${action.flightLabel || action.flightNumber || "that flight"
            } to your Saved Flights?`

          setMessages((prev) => {
            const lastMessage = prev[prev.length - 1]

            if (
              lastMessage?.role === "assistant" &&
              lastMessage.text.trim() === confirmationText.trim()
            ) {
              return prev
            }

            return [
              ...prev,
              {
                id: createMessageId(),
                role: "assistant",
                label: "Lucy",
                text: confirmationText,
              },
            ]
          })

          speakWithRealtimeLucyVoice(confirmationText)

        } catch {
          // Ignore malformed realtime save-flight tool arguments.
        }
      }

      dataChannel.addEventListener("message", (event) => {
        try {
          const data = JSON.parse(event.data)

          if (data?.type === "response.output_item.done") {
            handleRealtimeWatchlistToolCall(data.item)
            handleRealtimeSaveVisibleFlightToolCall(data.item)
          }

          if (data?.type === "conversation.item.done") {
            handleRealtimeWatchlistToolCall(data.item)
            handleRealtimeSaveVisibleFlightToolCall(data.item)
          }

          if (
            data?.type === "conversation.item.input_audio_transcription.delta" &&
            typeof data.delta === "string"
          ) {
            if (!activeUserVoiceMessageId) {
              activeUserVoiceMessageId = createMessageId()

              setMessages((prev) => [
                ...prev,
                {
                  id: activeUserVoiceMessageId!,
                  role: "user",
                  label: "You",
                  text: "",
                },
              ])
            }

            setMessages((prev) =>
              prev.map((message) =>
                message.id === activeUserVoiceMessageId
                  ? {
                    ...message,
                    text: `${message.text}${data.delta}`,
                  }
                  : message
              )
            )
          }

          if (
            data?.type === "conversation.item.input_audio_transcription.completed" &&
            typeof data.transcript === "string" &&
            data.transcript.trim()
          ) {
            const completedTranscript = data.transcript.trim()
            suppressNextVoiceAssistantReplyRef.current = false

            const hasPendingAction = Boolean(pendingLucyActionRef.current)

            if (!hasPendingAction && !isClearlySkysirvVoiceIntent(completedTranscript)) {
              suppressNextVoiceAssistantReplyRef.current = true
              suppressNextRealtimeSpeechTextRef.current = false

              if (activeUserVoiceMessageId) {
                setMessages((prev) =>
                  prev.filter((message) => message.id !== activeUserVoiceMessageId)
                )
              }

              activeUserVoiceMessageId = null
              activeAssistantVoiceMessageId = null
              return
            }

            if (completedTranscript.length < 3) {
              const emptyUserMessageId = activeUserVoiceMessageId

              if (emptyUserMessageId) {
                setMessages((prev) =>
                  prev.filter((message) => message.id !== emptyUserMessageId)
                )
              }

              activeUserVoiceMessageId = null
              return
            }

            if (activeUserVoiceMessageId) {
              setMessages((prev) =>
                prev.map((message) =>
                  message.id === activeUserVoiceMessageId
                    ? {
                      ...message,
                      text: completedTranscript,
                    }
                    : message
                )
              )
            }

            const token = getAuthToken()

            const actionToConfirm = pendingLucyActionRef.current

            const recentlyConfirmedRoute = findRecentlyConfirmedVoiceRoute({
              message: completedTranscript,
              confirmedRoutes: confirmedVoiceWatchlistRoutesRef.current,
            })

            if (
              recentlyConfirmedRoute &&
              completedTranscript.toLowerCase().includes("watch")
            ) {
              suppressNextVoiceAssistantReplyRef.current = true
              activeAssistantVoiceMessageId = null

              setMessages((prev) => [
                ...prev,
                {
                  id: createMessageId(),
                  role: "assistant",
                  label: "Lucy",
                  text: `${recentlyConfirmedRoute.origin} → ${recentlyConfirmedRoute.destination} is on your watchlist.`,
                },
              ])

              activeUserVoiceMessageId = null
              return
            }

            if (
              actionToConfirm &&
              isNegativeRouteConfirmation(completedTranscript)
            ) {
              pendingLucyActionRef.current = null
              setPendingLucyAction(null)
              suppressNextVoiceAssistantReplyRef.current = true
              activeAssistantVoiceMessageId = null

              setMessages((prev) => [
                ...prev,
                {
                  id: createMessageId(),
                  role: "assistant",
                  label: "Lucy",
                  text: "No problem — I won’t save that action.",
                },
              ])

              activeUserVoiceMessageId = null
              return
            }

            if (
              token &&
              actionToConfirm &&
              isAffirmativeRouteConfirmation(completedTranscript)
            ) {
              pendingLucyActionRef.current = null
              setPendingLucyAction(null)
              suppressNextVoiceAssistantReplyRef.current = true
              activeAssistantVoiceMessageId = null

              try {
                realtimeDataChannelRef.current?.send(
                  JSON.stringify({
                    type: "response.cancel",
                  })
                )
              } catch {
                // Ignore cancel errors.
              }

              window.setTimeout(() => {
                handleConfirmPendingLucyAction(actionToConfirm, token)
              }, 0)

              activeUserVoiceMessageId = null
              return
            }

            const localVoiceSaveFlightAction = buildLocalVisibleFlightSaveAction({
              message: completedTranscript,
              messages,
              dashboardRoutes: latestDashboardRoutesRef.current,
            })

            if (localVoiceSaveFlightAction) {
              setPendingLucyAction(localVoiceSaveFlightAction)
              pendingLucyActionRef.current = localVoiceSaveFlightAction
              suppressNextVoiceAssistantReplyRef.current = true
              activeAssistantVoiceMessageId = null

              try {
                realtimeDataChannelRef.current?.send(
                  JSON.stringify({
                    type: "response.cancel",
                  })
                )
              } catch {
                // Ignore cancel errors.
              }

              setMessages((prev) => [
                ...prev,
                {
                  id: createMessageId(),
                  role: "assistant",
                  label: "Lucy",
                  text:
                    localVoiceSaveFlightAction.confirmationPrompt ||
                    "Would you like me to save this flight to your Saved Flights?",
                },
              ])

              activeUserVoiceMessageId = null
              return
            }

            activeUserVoiceMessageId = null
          }

          if (suppressNextVoiceAssistantReplyRef.current) {
            return
          }

          if (
            data?.type === "response.output_audio_transcript.delta" &&
            typeof data.delta === "string"
          ) {
            pauseRealtimeMicrophoneForLucy()

            if (suppressNextRealtimeSpeechTextRef.current) {
              return
            }

            if (localRealtimeSpeechMessageIdRef.current) {
              const localMessageId = localRealtimeSpeechMessageIdRef.current

              setMessages((prev) =>
                prev.map((message) =>
                  message.id === localMessageId
                    ? {
                      ...message,
                      text: `${message.text}${data.delta}`,
                    }
                    : message
                )
              )

              setVoiceStatus("speaking")
              return
            }

            if (!activeAssistantVoiceMessageId) {
              const existingEmptyAssistantMessage = messages
                .slice()
                .reverse()
                .find(
                  (message) =>
                    message.role === "assistant" &&
                    message.label === "Lucy" &&
                    !message.text.trim()
                )

              activeAssistantVoiceMessageId =
                existingEmptyAssistantMessage?.id || createMessageId()

              if (!existingEmptyAssistantMessage) {
                setMessages((prev) => [
                  ...prev,
                  {
                    id: activeAssistantVoiceMessageId!,
                    role: "assistant",
                    label: "Lucy",
                    text: "",
                  },
                ])
              }
            }

            setMessages((prev) =>
              prev.map((message) =>
                message.id === activeAssistantVoiceMessageId
                  ? {
                    ...message,
                    text: `${message.text}${data.delta}`,
                  }
                  : message
              )
            )

            setVoiceStatus("speaking")
          }

          if (data?.type === "response.output_audio_transcript.done") {
            resumeRealtimeMicrophoneAfterLucy()

            activeAssistantVoiceMessageId = null
            activeUserVoiceMessageId = null
            localRealtimeSpeechMessageIdRef.current = null

            if (suppressNextRealtimeSpeechTextRef.current) {
              suppressNextRealtimeSpeechTextRef.current = false
            }

            if (!pendingLucyActionRef.current) {
              suppressNextVoiceAssistantReplyRef.current = false
            }

            setVoiceStatus("listening")
          }

          if (data?.type === "response.done") {
            resumeRealtimeMicrophoneAfterLucy()

            activeAssistantVoiceMessageId = null
            localRealtimeSpeechMessageIdRef.current = null

            if (suppressNextRealtimeSpeechTextRef.current) {
              suppressNextRealtimeSpeechTextRef.current = false
            }

            if (!pendingLucyActionRef.current) {
              suppressNextVoiceAssistantReplyRef.current = false
            }

            if (voiceStatus !== "idle") {
              setVoiceStatus("listening")
            }
          }

          if (data?.type === "input_audio_buffer.speech_started") {
            suppressNextRealtimeSpeechTextRef.current = false

            suppressNextVoiceAssistantReplyRef.current = Boolean(
              pendingLucyActionRef.current
            )

            activeAssistantVoiceMessageId = null

            activeUserVoiceMessageId = createMessageId()

            setMessages((prev) => [
              ...prev,
              {
                id: activeUserVoiceMessageId!,
                role: "user",
                label: "You",
                text: "",
              },
            ])

            setVoiceStatus("listening")
          }

          if (
            data?.type === "response.audio.delta" ||
            data?.type === "response.output_audio.delta"
          ) {
            pauseRealtimeMicrophoneForLucy()
            setVoiceStatus("speaking")
          }
        } catch {
          // Realtime events are optional for this first voice pass.
        }
      })

      const offer = await peerConnection.createOffer()
      await peerConnection.setLocalDescription(offer)

      const sdpResponse = await fetch(
        "https://api.openai.com/v1/realtime/calls",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${clientSecret}`,
            "Content-Type": "application/sdp",
          },
          body: offer.sdp,
        }
      )

      if (!sdpResponse.ok) {
        throw new Error("Lucy voice connection could not be completed.")
      }

      const answerSdp = await sdpResponse.text()

      await peerConnection.setRemoteDescription({
        type: "answer",
        sdp: answerSdp,
      })

      setVoiceStatus("listening")
    } catch (error: any) {
      stopLucyVoiceSession()
      setVoiceStatus("error")

      await appendTypedAssistantReply(
        error?.message ||
        "Lucy voice could not be started. Please try again in a moment."
      )

      window.setTimeout(() => {
        setVoiceStatus("idle")
      }, 1800)
    }
  }

  async function handleSendFlightAttendantMessage(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault()

    const message = chatInput.trim()

    if (!message || chatLoading || assistantTyping) return

    const token = getAuthToken()

    const userMessage: FlightAttendantMessage = {
      id: createMessageId(),
      role: "user",
      label: "You",
      text: message,
    }

    setMessages((prev) => [...prev, userMessage])
    setChatInput("")
    setAuthRequired(false)

    if (!token) {
      setAuthRequired(true)

      setMessages((prev) => [
        ...prev,
        {
          id: createMessageId(),
          role: "assistant",
          label: "Lucy",
          text:
            "Please sign in again to use the live Flight Attendant. This keeps Skysirv intelligence secure and connected to your account.",
        },
      ])

      return
    }

    if (!API_BASE_URL) {
      setMessages((prev) => [
        ...prev,
        {
          id: createMessageId(),
          role: "assistant",
          label: "Lucy",
          text:
            "The Flight Attendant is not configured yet. Please try again once the API connection is available.",
        },
      ])

      return
    }

    if (pendingLucyAction && isNegativeRouteConfirmation(message)) {
      setPendingLucyAction(null)

      await appendTypedAssistantReply(
        "No problem — I won’t save that action."
      )

      return
    }

    if (pendingLucyAction && isAffirmativeRouteConfirmation(message)) {
      await handleConfirmPendingLucyAction(pendingLucyAction, token)
      return
    }

    const localVisibleFlightSaveAction = buildLocalVisibleFlightSaveAction({
      message,
      messages,
      dashboardRoutes,
    })

    if (localVisibleFlightSaveAction) {
      setPendingLucyAction(localVisibleFlightSaveAction)

      await appendTypedAssistantReply(
        localVisibleFlightSaveAction.confirmationPrompt ||
        "Would you like me to save this flight to your Saved Flights?"
      )

      return
    }

    setChatLoading(true)

    try {
      const response = await fetch(`${API_BASE_URL}/api/flight-attendant/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          message,
          tier,
          dashboardRoutes,
          messages: [...messages, userMessage].slice(-10).map((item) => ({
            role: item.role,
            content: item.text,
          })),
        }),
      })

      const data = (await response.json().catch(() => null)) as
        | FlightAttendantApiResponse
        | null

      if (!response.ok) {
        throw new Error(data?.error || "Unable to reach Skysirv Flight Attendant")
      }

      const assistantMessageId = createMessageId()
      const assistantReply =
        data?.reply || "I’m here, but I could not generate a response."

      const suggestedAction = normalizeLucyAction(data?.action)

      if (suggestedAction) {
        setPendingLucyAction(suggestedAction)
      }

      setChatLoading(false)

      setMessages((prev) => [
        ...prev,
        {
          id: assistantMessageId,
          role: "assistant",
          label: "Lucy",
          text: "",
        },
      ])

      await typeAssistantReply(assistantMessageId, assistantReply)
    } catch (error: any) {
      setMessages((prev) => [
        ...prev,
        {
          id: createMessageId(),
          role: "assistant",
          label: "Lucy",
          text:
            error?.message ||
            "Something went wrong while contacting the Flight Attendant. Please try again.",
        },
      ])
    } finally {
      setChatLoading(false)
    }
  }

  return (
    <>
      <div
        onClick={expanded ? () => setExpanded(false) : undefined}
        className={
          expanded
            ? "fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/35 px-4 backdrop-blur-sm"
            : placement === "inline"
              ? "w-full"
              : "fixed right-5 top-24 z-[80] hidden lg:block"
        }
      >
        {open ? (
          <div
            onClick={expanded ? (event) => event.stopPropagation() : undefined}
            className={cn(
              "overflow-hidden rounded-[1.75rem] border border-white/10 bg-[#050b18] text-white shadow-[0_24px_70px_rgba(2,6,23,0.28)]",
              expanded
                ? "flex h-[min(760px,calc(100vh-3rem))] w-full max-w-3xl flex-col shadow-2xl"
                : placement === "inline"
                  ? "w-full"
                  : "w-[390px]"
            )}
          >
            <div className="border-b border-white/10 bg-[#050b18] px-5 py-2">
              <div className="grid grid-cols-[1fr_auto_auto] items-center gap-2">
                <div>
                  <p className="text-medium font-semibold tracking-[-0.03em] text-white">
                    Lucy
                  </p>
                  <p className="mt-1 text-sm text-slate-400">
                    Skysirv Flight Attendant™
                  </p>
                </div>

                <div className="hidden -translate-x-2 items-center gap-2 rounded-full border border-emerald-300/20 bg-emerald-300/10 px-3 py-1.5 text-sm font-semibold text-emerald-200 sm:inline-flex">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-300 opacity-40" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-300" />
                  </span>
                  Online
                </div>

                <button
                  type="button"
                  onClick={() => setExpanded((current) => !current)}
                  aria-label={expanded ? "Close expanded Lucy chat" : "Expand Lucy chat"}
                  className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/5 text-slate-300 transition hover:border-cyan-300/40 hover:bg-cyan-300/10 hover:text-cyan-100"
                >
                  {expanded ? (
                    <span className="text-lg leading-none">×</span>
                  ) : (
                    <svg
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                      className="h-4 w-4"
                      fill="none"
                    >
                      <path
                        d="M8 4H4v4M4 4l6 6M16 20h4v-4M20 20l-6-6"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <div
              className={cn(
                "overflow-y-auto bg-[#071120] px-5 py-4 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-white/10 hover:[&::-webkit-scrollbar-thumb]:bg-cyan-300/20",
                expanded
                  ? "min-h-0 flex-1"
                  : placement === "inline"
                    ? "h-[230px]"
                    : "h-[360px]"
              )}
            >
              <div className="space-y-5 pb-2">
                {messages.map((message) => (
                  <AssistantBubble
                    key={message.id}
                    label={message.label}
                    text={message.text}
                    align={message.role === "user" ? "right" : "left"}
                  />
                ))}

                {chatLoading && <ThinkingDotsBubble />}

                <div ref={messagesEndRef} />
              </div>
            </div>

            {authRequired && (
              <div className="border-t border-white/10 bg-cyan-300/10 px-5 py-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-xs leading-5 text-slate-300">
                    Sign in again to keep Lucy connected to your account.
                  </p>

                  <button
                    type="button"
                    onClick={() => setAuthModalOpen(true)}
                    className="shrink-0 rounded-full border border-cyan-300/30 bg-cyan-300/10 px-3 py-1.5 text-xs font-semibold text-cyan-100 transition hover:bg-cyan-300/20"
                  >
                    Sign in
                  </button>
                </div>
              </div>
            )}

            <form
              onSubmit={handleSendFlightAttendantMessage}
              className="border-t border-white/10 bg-[#050b18] p-4"
            >
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(event) => setChatInput(event.target.value)}
                    placeholder={config.placeholder}
                    className="min-h-[46px] w-full rounded-full border border-white/10 bg-white/[0.06] px-4 pr-14 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-300/40 focus:ring-2 focus:ring-cyan-300/10"
                  />

                  <button
                    type="submit"
                    disabled={chatLoading || assistantTyping || !chatInput.trim()}
                    className="absolute right-1.5 top-1/2 inline-flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-cyan-300 text-sm font-semibold text-slate-950 shadow-sm transition hover:bg-cyan-200 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {chatLoading || assistantTyping ? (
                      "…"
                    ) : (
                      <svg
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                        className="block h-5 w-5 -translate-x-[1px] translate-y-[1px] -rotate-12"
                        fill="none"
                      >
                        <path
                          d="M21 3L10.5 13.5"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M21 3L14.5 21L10.5 13.5L3 9.5L21 3Z"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    )}
                  </button>
                </div>

                {tier !== "free" && (
                  <button
                    type="button"
                    onClick={startLucyVoiceSession}
                    disabled={chatLoading || assistantTyping}
                    className={cn(
                      "inline-flex min-h-[46px] shrink-0 items-center justify-center rounded-full border px-5 text-sm font-semibold shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] transition disabled:cursor-not-allowed disabled:opacity-70",
                      voiceStatus === "idle"
                        ? "border-white/10 bg-white/[0.06] text-cyan-200 hover:border-cyan-300/40 hover:bg-cyan-300/10 hover:text-cyan-100"
                        : "border-cyan-300/40 bg-cyan-300/10 text-cyan-100"
                    )}
                  >
                    <span className="mr-2 inline-flex h-5 items-center gap-0.5" aria-hidden="true">
                      <span className={cn("h-1 w-0.5 rounded-full bg-current", voiceStatus !== "idle" && "animate-pulse")} />
                      <span className={cn("h-3 w-0.5 rounded-full bg-current", voiceStatus !== "idle" && "animate-pulse")} />
                      <span className={cn("h-5 w-0.5 rounded-full bg-current", voiceStatus !== "idle" && "animate-pulse")} />
                      <span className={cn("h-3 w-0.5 rounded-full bg-current", voiceStatus !== "idle" && "animate-pulse")} />
                      <span className={cn("h-1 w-0.5 rounded-full bg-current", voiceStatus !== "idle" && "animate-pulse")} />
                    </span>

                    {voiceStatus === "idle"
                      ? "Chat"
                      : voiceStatus === "connecting"
                        ? "Connecting"
                        : voiceStatus === "listening"
                          ? "Listening"
                          : voiceStatus === "speaking"
                            ? "Speaking"
                            : "End"}
                  </button>
                )}
              </div>
            </form>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="group flex items-center gap-3 rounded-full border border-slate-200 bg-white px-4 py-3 text-slate-950 shadow-sm transition hover:-translate-y-0.5 hover:border-cyan-200 hover:bg-cyan-50"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-cyan-50 text-sm font-bold text-cyan-700 ring-1 ring-cyan-200">
              L
            </span>

            <span className="text-left">
              <span className="block text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                {config.badge}
              </span>
              <span className="block text-sm font-semibold text-slate-950">
                Ask Lucy
              </span>
            </span>
          </button>
        )}
      </div>

      <AuthModal
        open={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        maxWidthClassName="max-w-sm"
        disableBackdropClose={false}
      >
        <AuthPanel
          onSigninComplete={() => {
            setAuthModalOpen(false)
            setAuthRequired(false)
          }}
          onSignupComplete={() => {
            setAuthModalOpen(false)
          }}
        />
      </AuthModal>
    </>
  )
}

function AssistantBubble({
  label,
  text,
  align,
}: {
  label: string
  text: string
  align: "left" | "right"
}) {
  const cleanText = sanitizeLucyText(text)

  return (
    <div
      className={cn(
        "flex",
        align === "right" ? "justify-end" : "justify-start"
      )}
    >
      <div
        className={cn(
          "max-w-[86%] rounded-[1.4rem] border px-4 py-3 shadow-[0_8px_30px_rgba(0,0,0,0.22)] backdrop-blur-xl",
          align === "right"
            ? "border-cyan-300/20 bg-[linear-gradient(135deg,rgba(34,211,238,0.16),rgba(15,23,42,0.92))]"
            : "border-white/10 bg-[linear-gradient(135deg,rgba(255,255,255,0.06),rgba(15,23,42,0.88))]"
        )}
      >
        <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400">
          {label}
        </p>
        <p className="whitespace-pre-line text-sm leading-6 text-slate-100">
          {cleanText}
        </p>
      </div>
    </div>
  )
}

function ThinkingDotsBubble() {
  return (
    <div className="flex justify-start">
      <div className="max-w-[86%] rounded-[1.4rem] border border-white/10 bg-white/[0.06] px-4 py-3 shadow-[0_8px_30px_rgba(0,0,0,0.22)] backdrop-blur-xl">
        <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400">
          Lucy
        </p>

        <div className="flex items-center gap-1.5 py-1">
          <span className="h-2 w-2 animate-pulse rounded-full bg-cyan-300" />
          <span
            className="h-2 w-2 animate-pulse rounded-full bg-cyan-300"
            style={{ animationDelay: "120ms" }}
          />
          <span
            className="h-2 w-2 animate-pulse rounded-full bg-cyan-300"
            style={{ animationDelay: "240ms" }}
          />
        </div>
      </div>
    </div>
  )
}