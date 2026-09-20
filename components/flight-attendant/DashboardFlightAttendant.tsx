"use client"

import { FormEvent, useEffect, useRef, useState } from "react"

import AuthModal from "@/components/auth/AuthModal"
import AuthPanel from "@/components/auth/AuthPanel"
import { getAuthToken } from "@/utils/auth-storage"

import {
  getLucyActionLabel,
  isAffirmativeRouteConfirmation,
  isNegativeRouteConfirmation,
  normalizeLucyAction,
  type LucyAction,
  type LucySaveVisibleFlightAction,
} from "./dashboardFlightAttendant.actions"

import {
  API_BASE_URL,
  LUCY_ACTIVE_CHAT_THREAD_STORAGE_KEY,
  LUCY_CHAT_THREADS_STORAGE_KEY,
  tierConfig,
} from "./dashboardFlightAttendant.config"

import {
  formatLucyReplyText,
  formatReadableFlightDate,
  formatVisibleFlightPrice,
  normalizeFlightSearchText,
  sanitizeLucyText,
} from "./dashboardFlightAttendant.formatters"

import {
  appendAssistantPlaceholder,
  appendUserMessage,
  updateAssistantMessageText,
} from "./dashboardFlightAttendant.messages"

import { typeAssistantMessage } from "./dashboardFlightAttendant.typing"

import {
  type DashboardFlightAttendantProps,
  type DashboardLucyTier,
  type DashboardRouteContext,
  type FlightAttendantMessage,
  type LucyChatThread,
} from "./dashboardFlightAttendant.types"

import {
  cn,
  createLucyThread,
  createMessageId,
} from "./dashboardFlightAttendant.utils"

import { buildLocalVisibleFlightSaveAction } from "./dashboardFlightAttendant.visibleFlights"

import {
  clearRealtimeMicrophoneResumeTimer as clearRealtimeMicrophoneResumeTimerHelper,
  pauseRealtimeMicrophone as pauseRealtimeMicrophoneHelper,
  resumeRealtimeMicrophone as resumeRealtimeMicrophoneHelper,
  scheduleRealtimeMicrophoneResume as scheduleRealtimeMicrophoneResumeHelper,
  setRealtimeMicrophoneEnabled as setRealtimeMicrophoneEnabledHelper,
} from "./dashboardFlightAttendant.voice"

import {
  handleRealtimeSaveVisibleFlightToolCall as handleRealtimeSaveVisibleFlightToolCallHelper,
  handleRealtimeWatchlistToolCall as handleRealtimeWatchlistToolCallHelper,
} from "./dashboardFlightAttendant.voiceTools"

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
    "saved flight",
    "saved flights",
    "save flight",
    "save that flight",
    "track",
    "tracking",

    "airport",
    "airports",
    "airline",
    "airlines",
    "alliance",
    "alliances",
    "star alliance",
    "oneworld",
    "one world",
    "skyteam",
    "sky team",
    "partner airline",
    "partner airlines",
    "airline partner",
    "airline partners",
    "codeshare",

    "miles",
    "points",
    "loyalty",
    "rewards",
    "program",
    "membership",
    "member",
    "frequent flyer",
    "frequent flier",
    "mileageplus",
    "aadvantage",
    "skymiles",
    "airline miles",
    "travel rewards",
    "earn miles",
    "redeem miles",
    "award travel",
    "award flight",
    "status",
    "elite status",
    "upgrade",
    "upgrades",

    "price",
    "prices",
    "booking",
    "book",
    "ticket",
    "tickets",

    "trip",
    "trips",
    "travel",
    "traveler",
    "traveling",
    "travelling",
    "vacation",
    "holiday",
    "destination",
    "destinations",
    "itinerary",
    "itineraries",

    "origin",
    "departure",
    "depart",
    "arrive",
    "arrival",
    "round trip",
    "round-trip",
    "one way",
    "one-way",
    "multi city",
    "multi-city",
    "open jaw",
    "stopover",
    "layover",
    "layovers",
    "connection",
    "connections",
    "nonstop",
    "non-stop",
    "direct flight",
    "direct flights",
    "connecting flight",
    "connecting flights",

    "terminal",
    "terminals",
    "gate",
    "gates",
    "lounge",
    "lounges",
    "baggage",
    "bags",
    "checked bag",
    "checked bags",
    "luggage",
    "carry-on",
    "carry on",
    "carryon",
    "carry-on bag",
    "packing",
    "passport",
    "visa",
    "customs",
    "immigration",
    "security",
    "tsa",
    "boarding",
    "boarding pass",

    "seat",
    "seats",
    "cabin",
    "economy",
    "premium economy",
    "business class",
    "first class",
    "extra legroom",
    "legroom",
    "red eye",
    "red-eye",
    "overnight flight",

    "hotel",
    "hotels",
    "rental car",
    "car rental",
    "family trip",
    "business trip",

    "remember",
    "memory",
    "preference",
    "preferences",
    "prefer",
    "preferred",
    "favorite airline",
    "favorite airlines",
    "home airport",
    "usual airport",
    "travel style",

    "alert",
    "alerts",

    "united",
    "lufthansa",
    "air canada",
    "swiss",
    "ana",
    "all nippon",
    "singapore airlines",
    "turkish airlines",
    "copa",

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
    "new york",
    "london",
    "paris",
    "tokyo",
    "rome",
    "madrid",
    "barcelona",
    "bolivia",
    "santa cruz de la sierra",
    "viru viru",
    "panama city",
    "panama",
    "cancun",
    "orlando",
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
  const realtimeMicTrackRef = useRef<MediaStreamTrack | null>(null)
  const realtimeAudioSenderRef = useRef<RTCRtpSender | null>(null)
  const realtimeAudioElementRef = useRef<HTMLAudioElement | null>(null)
  const realtimeDataChannelRef = useRef<RTCDataChannel | null>(null)
  const realtimeMicPausedForLucyRef = useRef(false)
  const realtimeMicResumeTimerRef = useRef<number | null>(null)
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
      if (realtimeMicResumeTimerRef.current !== null) {
        window.clearTimeout(realtimeMicResumeTimerRef.current)
        realtimeMicResumeTimerRef.current = null
      }

      realtimePeerConnectionRef.current?.close()
      realtimePeerConnectionRef.current = null

      realtimeLocalStreamRef.current?.getTracks().forEach((track) => {
        track.stop()
      })
      realtimeLocalStreamRef.current = null
      realtimeMicTrackRef.current = null
      realtimeAudioSenderRef.current = null

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

  async function typeAssistantReply(
    messageId: string,
    fullText: string
  ) {
    await typeAssistantMessage({
      messageId,
      fullText,
      setMessages,
      setAssistantTyping,
    })
  }

  async function appendTypedAssistantReply(fullText: string) {
    const assistantMessageId = createMessageId()

    setMessages((prev) =>
      appendAssistantPlaceholder(prev, assistantMessageId)
    )

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

      if (action.type === "save_lucy_memory") {
        const response = await fetch(
          `${API_BASE_URL}/api/flight-attendant/memories`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              memoryType: action.memoryType,
              memoryKey: action.memoryKey,
              memoryText: action.memoryText,
              memoryValueJson: action.memoryValueJson ?? null,
            }),
          }
        )

        const data = await response.json().catch(() => null)

        if (!response.ok) {
          throw new Error(
            data?.error ||
            "I couldn’t save that memory yet. Please try again in a moment."
          )
        }

        window.dispatchEvent(
          new CustomEvent("skysirv:lucy-memory-updated", {
            detail: data,
          })
        )

        successReply =
          "Done — I’ll remember that for future Skysirv sessions."
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

  async function setRealtimeMicrophoneEnabled(enabled: boolean) {
    await setRealtimeMicrophoneEnabledHelper({
      enabled,
      localStreamRef: realtimeLocalStreamRef,
      micTrackRef: realtimeMicTrackRef,
      audioSenderRef: realtimeAudioSenderRef,
    })
  }

  function clearRealtimeMicrophoneResumeTimer() {
    clearRealtimeMicrophoneResumeTimerHelper(
      realtimeMicResumeTimerRef
    )
  }

  function pauseRealtimeMicrophoneForLucy() {
    pauseRealtimeMicrophoneHelper({
      clearTimer: clearRealtimeMicrophoneResumeTimer,
      isPausedRef: realtimeMicPausedForLucyRef,
      disableMicrophone: () => {
        void setRealtimeMicrophoneEnabled(false)
      },
    })
  }

  function resumeRealtimeMicrophoneAfterLucy() {
    resumeRealtimeMicrophoneHelper({
      clearTimer: clearRealtimeMicrophoneResumeTimer,
      isPausedRef: realtimeMicPausedForLucyRef,
      enableMicrophone: () => {
        void setRealtimeMicrophoneEnabled(true)
      },
    })
  }

  function scheduleRealtimeMicrophoneResume(delayMs = 1400) {
    scheduleRealtimeMicrophoneResumeHelper({
      timerRef: realtimeMicResumeTimerRef,
      delayMs,
      resumeMicrophone: resumeRealtimeMicrophoneAfterLucy,
    })
  }

  function stopLucyVoiceSession() {
    clearRealtimeMicrophoneResumeTimer()

    realtimeMicPausedForLucyRef.current = false
    suppressNextVoiceAssistantReplyRef.current = false
    suppressNextRealtimeSpeechTextRef.current = false
    localRealtimeSpeechMessageIdRef.current = null
    lastVoiceToolCallRef.current = null

    void setRealtimeMicrophoneEnabled(true)

    realtimeDataChannelRef.current?.close()
    realtimeDataChannelRef.current = null
    realtimePeerConnectionRef.current?.close()
    realtimePeerConnectionRef.current = null

    realtimeLocalStreamRef.current?.getTracks().forEach((track) => {
      track.stop()
    })
    realtimeLocalStreamRef.current = null
    realtimeMicTrackRef.current = null
    realtimeAudioSenderRef.current = null

    if (realtimeAudioElementRef.current) {
      realtimeAudioElementRef.current.pause()
      realtimeAudioElementRef.current.srcObject = null
      realtimeAudioElementRef.current = null
    }

    setVoiceStatus("idle")
  }

  function speakWithRealtimeLucyVoice(text: string) {
    const dataChannel = realtimeDataChannelRef.current
    const cleanText = text.trim()

    if (!cleanText) return
    if (!dataChannel || dataChannel.readyState !== "open") return

    pauseRealtimeMicrophoneForLucy()
    setVoiceStatus("speaking")

    localRealtimeSpeechMessageIdRef.current = null
    suppressNextRealtimeSpeechTextRef.current = true

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
      suppressNextRealtimeSpeechTextRef.current = false
      resumeRealtimeMicrophoneAfterLucy()
      setVoiceStatus("listening")
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

      const micTrack = localStream.getAudioTracks()[0] ?? null
      realtimeMicTrackRef.current = micTrack

      if (micTrack) {
        realtimeAudioSenderRef.current = peerConnection.addTrack(
          micTrack,
          localStream
        )
      }

      const dataChannel = peerConnection.createDataChannel("oai-events")
      realtimeDataChannelRef.current = dataChannel

      dataChannel.addEventListener("open", () => {
        setVoiceStatus("listening")
      })

      let activeUserVoiceMessageId: string | null = null
      let activeAssistantVoiceMessageId: string | null = null

      function handleRealtimeSaveVisibleFlightToolCallLegacy(item: any) {
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

      function handleRealtimeSaveLucyMemoryToolCall(item: any) {
        if (item?.name !== "prepare_save_lucy_memory") return

        const rawArguments =
          typeof item.arguments === "string" ? item.arguments : ""

        if (!rawArguments) return

        try {
          const parsed = JSON.parse(rawArguments)

          const action = normalizeLucyAction({
            type: "save_lucy_memory",
            status: "needs_confirmation",
            memoryType: parsed.memoryType,
            memoryKey: parsed.memoryKey,
            memoryText: parsed.memoryText,
            memoryValueJson: parsed.memoryValueJson ?? null,
            confirmationPrompt: parsed.confirmationPrompt,
          })

          if (!action || action.type !== "save_lucy_memory") return

          const duplicateKey = [
            action.type,
            action.memoryType,
            action.memoryKey,
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
            "Would you like me to remember that for future Skysirv sessions?"

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
          // Ignore malformed realtime memory arguments.
        }
      }

      dataChannel.addEventListener("message", (event) => {
        try {
          const data = JSON.parse(event.data)

          if (
            data?.type === "response.output_audio_transcript.delta" ||
            data?.type === "response.output_audio_transcript.done" ||
            data?.type === "response.done"
          ) {
            console.log("Lucy realtime transcript event:", {
              type: data.type,
              delta: data.delta,
              transcript: data.transcript,
              output: data.output,
              activeAssistantVoiceMessageId,
              suppressNextVoiceAssistantReply: suppressNextVoiceAssistantReplyRef.current,
              suppressNextRealtimeSpeechText: suppressNextRealtimeSpeechTextRef.current,
            })
          }

          if (data?.type === "response.output_item.done") {
            handleRealtimeWatchlistToolCallHelper(data.item, {
              lastVoiceToolCallRef,
              pendingLucyActionRef,
              dataChannelRef: realtimeDataChannelRef,
              setPendingLucyAction,
              setMessages,
              speakConfirmation: speakWithRealtimeLucyVoice,
              suppressNextAssistantReplyRef: suppressNextVoiceAssistantReplyRef,
              clearActiveAssistantMessage: () => {
                activeAssistantVoiceMessageId = null
              },
            })
            handleRealtimeSaveVisibleFlightToolCallHelper(data.item, {
              lastVoiceToolCallRef,
              pendingLucyActionRef,
              dataChannelRef: realtimeDataChannelRef,
              setPendingLucyAction,
              setMessages,
              speakConfirmation: speakWithRealtimeLucyVoice,
              suppressNextAssistantReplyRef: suppressNextVoiceAssistantReplyRef,
              clearActiveAssistantMessage: () => {
                activeAssistantVoiceMessageId = null
              },
            })
            handleRealtimeSaveLucyMemoryToolCall(data.item)
          }

          if (data?.type === "conversation.item.done") {
            handleRealtimeWatchlistToolCallHelper(data.item, {
              lastVoiceToolCallRef,
              pendingLucyActionRef,
              dataChannelRef: realtimeDataChannelRef,
              setPendingLucyAction,
              setMessages,
              speakConfirmation: speakWithRealtimeLucyVoice,
              suppressNextAssistantReplyRef: suppressNextVoiceAssistantReplyRef,
              clearActiveAssistantMessage: () => {
                activeAssistantVoiceMessageId = null
              },
            })
            handleRealtimeSaveVisibleFlightToolCallHelper(data.item, {
              lastVoiceToolCallRef,
              pendingLucyActionRef,
              dataChannelRef: realtimeDataChannelRef,
              setPendingLucyAction,
              setMessages,
              speakConfirmation: speakWithRealtimeLucyVoice,
              suppressNextAssistantReplyRef: suppressNextVoiceAssistantReplyRef,
              clearActiveAssistantMessage: () => {
                activeAssistantVoiceMessageId = null
              },
            })
            handleRealtimeSaveLucyMemoryToolCall(data.item)
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

          const isLucyAudioDelta =
            data?.type === "response.audio.delta" ||
            data?.type === "response.output_audio.delta"

          const isLucyTranscriptDelta =
            data?.type === "response.output_audio_transcript.delta" &&
            typeof data.delta === "string"

          const isLucyAudioDone =
            data?.type === "response.output_audio_transcript.done" ||
            data?.type === "response.done"

          if (isLucyAudioDelta || isLucyTranscriptDelta) {
            pauseRealtimeMicrophoneForLucy()
            setVoiceStatus("speaking")
          }

          if (isLucyAudioDone) {
            scheduleRealtimeMicrophoneResume(1800)

            activeAssistantVoiceMessageId = null
            activeUserVoiceMessageId = null
            localRealtimeSpeechMessageIdRef.current = null

            if (suppressNextRealtimeSpeechTextRef.current) {
              suppressNextRealtimeSpeechTextRef.current = false
            }

            if (!pendingLucyActionRef.current) {
              suppressNextVoiceAssistantReplyRef.current = false
            }

            if (realtimePeerConnectionRef.current) {
              window.setTimeout(() => {
                if (realtimePeerConnectionRef.current) {
                  setVoiceStatus("listening")
                }
              }, 1800)
            }
          }

          if (suppressNextVoiceAssistantReplyRef.current) {
            return
          }

          if (
            data?.type === "response.output_audio_transcript.delta" &&
            typeof data.delta === "string"
          ) {
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

    setMessages((prev) => appendUserMessage(prev, userMessage))
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
                  ? "flex h-[360px] w-full flex-col"
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
  text,
  align,
}: {
  text: string
  align: "left" | "right"
}) {
  const cleanText = sanitizeLucyText(formatLucyReplyText(text))

  if (!cleanText) return null

  if (align === "left") {
    return (
      <div className="flex justify-start">
        <div className="max-w-[92%] px-1 py-1">
          <p className="whitespace-pre-line text-sm leading-6 text-slate-100">
            {cleanText}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex justify-end">
      <div className="max-w-[86%] rounded-[1.4rem] border border-white/10 bg-white/[0.08] px-4 py-3 shadow-[0_8px_30px_rgba(0,0,0,0.18)] backdrop-blur-xl">
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
      <div className="px-1 py-2">
        <div className="flex items-center gap-1.5">
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