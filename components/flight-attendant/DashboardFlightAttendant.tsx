"use client"

import { FormEvent, useEffect, useRef, useState } from "react"
import AuthModal from "@/components/auth/AuthModal"
import AuthPanel from "@/components/auth/AuthPanel"
import { getAuthToken } from "@/utils/auth-storage"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

type DashboardLucyTier = "free" | "pro" | "business"

type DashboardFlightAttendantProps = {
  tier: DashboardLucyTier
  placement?: "inline" | "floating"
  defaultOpen?: boolean
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

type LucyAction =
  | LucyWatchlistAction
  | LucyPreferredAirportsAction
  | LucyPreferredRouteAction

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
    placeholder: "Ask Lucy about your route signals...",
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
    normalized.includes("don't add")
  )
}

function getLucyActionLabel(action: LucyAction) {
  if (action.type === "add_watchlist_route") {
    return `${action.origin} → ${action.destination} for ${action.departureDate}`
  }

  if (action.type === "save_preferred_airports") {
    return action.airportCodes.join(" and ")
  }

  return `${action.origin} → ${action.destination}`
}

export default function DashboardFlightAttendant({
  tier,
  placement = "floating",
  defaultOpen = false,
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
  const messagesEndRef = useRef<HTMLDivElement | null>(null)
  const realtimePeerConnectionRef = useRef<RTCPeerConnection | null>(null)
  const realtimeLocalStreamRef = useRef<MediaStream | null>(null)
  const realtimeAudioElementRef = useRef<HTMLAudioElement | null>(null)

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

      if (action.type === "add_watchlist_route") {
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
          }),
        })

        const data = await response.json().catch(() => null)

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

        successReply = `Done — I added ${getLucyActionLabel(
          action
        )} to your watchlist. Skysirv will start monitoring it from your dashboard.`
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

      await appendTypedAssistantReply(
        successReply || "Done — I saved that preference."
      )
    } catch (error: any) {
      await appendTypedAssistantReply(
        error?.message ||
        "I couldn’t save that action yet. Please try again in a moment."
      )
    } finally {
      setChatLoading(false)
    }
  }

  function stopLucyVoiceSession() {
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
            Authorization: `Bearer ${token}`,
          },
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

      dataChannel.addEventListener("open", () => {
        setVoiceStatus("listening")
      })

      let activeAssistantVoiceMessageId: string | null = null

      dataChannel.addEventListener("message", (event) => {
        try {
          const data = JSON.parse(event.data)

          if (
            data?.type === "conversation.item.input_audio_transcription.completed" &&
            typeof data.transcript === "string" &&
            data.transcript.trim()
          ) {
            setMessages((prev) => [
              ...prev,
              {
                id: createMessageId(),
                role: "user",
                label: "You",
                text: data.transcript.trim(),
              },
            ])
          }

          if (
            data?.type === "response.audio_transcript.delta" &&
            typeof data.delta === "string"
          ) {
            if (!activeAssistantVoiceMessageId) {
              activeAssistantVoiceMessageId = createMessageId()

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

          if (data?.type === "response.audio_transcript.done") {
            activeAssistantVoiceMessageId = null
            setVoiceStatus("listening")
          }

          if (data?.type === "input_audio_buffer.speech_started") {
            activeAssistantVoiceMessageId = null
            setVoiceStatus("listening")
          }

          if (data?.type === "response.audio.delta") {
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
              "overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white text-slate-950 shadow-sm",
              expanded
                ? "flex h-[min(760px,calc(100vh-3rem))] w-full max-w-3xl flex-col shadow-2xl"
                : placement === "inline"
                  ? "w-full"
                  : "w-[390px]"
            )}
          >
            <div className="border-b border-slate-200 bg-slate-50/80 px-5 py-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-cyan-700">
                    {config.badge}
                  </p>
                  <p className="mt-1 text-sm text-slate-600">
                    {config.title}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setExpanded((current) => !current)}
                  aria-label={expanded ? "Close expanded Lucy chat" : "Expand Lucy chat"}
                  className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 transition hover:border-cyan-200 hover:bg-cyan-50 hover:text-cyan-700"
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
                "overflow-y-auto px-5 py-4",
                expanded
                  ? "min-h-0 flex-1"
                  : placement === "inline"
                    ? "h-[230px]"
                    : "h-[360px]"
              )}
            >
              <div className="space-y-4">
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
              <div className="border-t border-slate-200 bg-cyan-50 px-5 py-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-xs leading-5 text-slate-600">
                    Sign in again to keep Lucy connected to your account.
                  </p>

                  <button
                    type="button"
                    onClick={() => setAuthModalOpen(true)}
                    className="shrink-0 rounded-full border border-cyan-200 bg-white px-3 py-1.5 text-xs font-semibold text-cyan-700 transition hover:bg-cyan-50"
                  >
                    Sign in
                  </button>
                </div>
              </div>
            )}

            <form
              onSubmit={handleSendFlightAttendantMessage}
              className="border-t border-slate-200 bg-slate-50/70 p-4"
            >
              <div className="flex gap-2">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(event) => setChatInput(event.target.value)}
                  placeholder={config.placeholder}
                  className="min-h-[44px] flex-1 rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-cyan-300 focus:ring-2 focus:ring-cyan-100"
                />

                {tier !== "free" && (
                  <button
                    type="button"
                    onClick={startLucyVoiceSession}
                    disabled={chatLoading || assistantTyping}
                    className={cn(
                      "inline-flex min-h-[44px] items-center justify-center rounded-xl border px-3 text-sm font-semibold shadow-sm transition disabled:cursor-not-allowed disabled:opacity-70",
                      voiceStatus === "idle"
                        ? "border-cyan-200 bg-white text-cyan-700 hover:bg-cyan-50"
                        : "border-cyan-300 bg-cyan-50 text-cyan-800"
                    )}
                  >
                    {voiceStatus === "idle"
                      ? "Voice"
                      : voiceStatus === "connecting"
                        ? "..."
                        : "End"}
                  </button>
                )}

                <button
                  type="submit"
                  disabled={chatLoading || assistantTyping || !chatInput.trim()}
                  className="inline-flex min-h-[44px] items-center justify-center rounded-xl bg-slate-900 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-100"
                >
                  {chatLoading ? "..." : assistantTyping ? "..." : "Send"}
                </button>
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
          "max-w-[86%] rounded-2xl border px-4 py-3",
          align === "right"
            ? "border-cyan-200 bg-cyan-50"
            : "border-slate-200 bg-slate-50"
        )}
      >
        <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500">
          {label}
        </p>
        <p className="whitespace-pre-line text-sm leading-6 text-slate-700">
          {cleanText}
        </p>
      </div>
    </div>
  )
}

function ThinkingDotsBubble() {
  return (
    <div className="flex justify-start">
      <div className="max-w-[86%] rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
        <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500">
          Lucy
        </p>

        <div className="flex items-center gap-1.5 py-1">
          <span className="h-2 w-2 animate-pulse rounded-full bg-slate-500" />
          <span
            className="h-2 w-2 animate-pulse rounded-full bg-slate-500"
            style={{ animationDelay: "120ms" }}
          />
          <span
            className="h-2 w-2 animate-pulse rounded-full bg-slate-500"
            style={{ animationDelay: "240ms" }}
          />
        </div>
      </div>
    </div>
  )
}