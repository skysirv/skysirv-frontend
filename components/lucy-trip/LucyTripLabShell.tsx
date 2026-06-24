"use client"

import { useEffect, useRef, useState } from "react"

import LucyTripComposer from "@/components/lucy-trip/shared/LucyTripComposer"
import LucyTripGuideContent, {
  type LucyTripMessage,
  type LucyTripStructuredPlan,
} from "@/components/lucy-trip/shared/LucyTripGuideContent"
import LucyTripLeftRail from "@/components/lucy-trip/shared/LucyTripLeftRail"
import LucyTripMapButton from "@/components/lucy-trip/shared/LucyTripMapButton"
import LucyTripMapPanel from "@/components/lucy-trip/shared/LucyTripMapPanel"
import LucyTripTopBar from "@/components/lucy-trip/shared/LucyTripTopBar"
import { getAuthToken } from "@/utils/auth-storage"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

type LucyTripLaunchMode = "continue-topic" | "discovery"

type LucyTripLaunchPayload = {
  source?: string
  mode?: LucyTripLaunchMode
  initialIdea?: string
  createdAt?: string
}

type LucyTripChatResponse = {
  success?: boolean
  model?: string
  reply?: string
  plan?: LucyTripStructuredPlan | null
  code?: string
  error?: string
}

function createLucyTripMessageId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID()
  }

  return `lucy-trip-message-${Date.now()}-${Math.random()
    .toString(16)
    .slice(2)}`
}

function readLucyTripLaunchPayload(): LucyTripLaunchPayload {
  if (typeof window === "undefined") {
    return {
      mode: "discovery",
      initialIdea: "",
    }
  }

  const storedLaunch = window.sessionStorage.getItem("skysirv-lucy-trip-launch")

  if (storedLaunch) {
    try {
      const parsedLaunch = JSON.parse(storedLaunch) as LucyTripLaunchPayload

      return {
        source: parsedLaunch.source,
        mode:
          parsedLaunch.mode === "continue-topic" ||
            parsedLaunch.mode === "discovery"
            ? parsedLaunch.mode
            : "discovery",
        initialIdea: parsedLaunch.initialIdea || "",
        createdAt: parsedLaunch.createdAt,
      }
    } catch {
      return {
        mode: "discovery",
        initialIdea: "",
      }
    }
  }

  const legacyPrompt = window.sessionStorage.getItem(
    "skysirv-plan-smarter-lucy-prompt",
  )

  if (legacyPrompt?.trim()) {
    return {
      source: "plan-smarter",
      mode: "continue-topic",
      initialIdea: legacyPrompt.trim(),
    }
  }

  return {
    mode: "discovery",
    initialIdea: "",
  }
}

function toBackendMessages(messages: LucyTripMessage[]) {
  return messages
    .filter((message) => message.status !== "error")
    .map((message) => ({
      role: message.role,
      content: message.content,
    }))
}

export default function LucyTripLabShell() {
  const initialRequestStartedRef = useRef(false)

  const [mapPanelOpen, setMapPanelOpen] = useState(false)
  const [lucyPrompt, setLucyPrompt] = useState("")
  const [messages, setMessages] = useState<LucyTripMessage[]>([])
  const [tripPlan, setTripPlan] = useState<LucyTripStructuredPlan | null>(null)
  const [launchPayload, setLaunchPayload] = useState<LucyTripLaunchPayload>({
    mode: "discovery",
    initialIdea: "",
  })
  const [isLucyThinking, setIsLucyThinking] = useState(false)

  async function requestLucyTripReply({
    launchMode,
    initialIdea,
    nextMessages,
    appendAssistantReply = false,
  }: {
    launchMode: LucyTripLaunchMode
    initialIdea: string
    nextMessages: LucyTripMessage[]
    appendAssistantReply?: boolean
  }) {
    const token = getAuthToken()

    if (!API_BASE_URL) {
      setMessages((currentMessages) => [
        ...currentMessages,
        {
          id: createLucyTripMessageId(),
          role: "assistant",
          content:
            "I’m having trouble reaching Skysirv right now because the API connection is not configured.",
          status: "error",
        },
      ])
      return
    }

    if (!token) {
      setMessages((currentMessages) => [
        ...currentMessages,
        {
          id: createLucyTripMessageId(),
          role: "assistant",
          content:
            "Please sign in first so I can help shape and save this trip planning session.",
          status: "error",
        },
      ])
      return
    }

    setIsLucyThinking(true)

    try {
      const response = await fetch(`${API_BASE_URL}/api/lucy-trip/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          launchMode,
          initialIdea,
          messages: toBackendMessages(nextMessages),
        }),
      })

      const data = (await response.json()) as LucyTripChatResponse

      if (!response.ok || !data.reply) {
        throw new Error(data.error || data.code || "Lucy Trip request failed")
      }

      if (data.plan) {
        setTripPlan(data.plan)
      }

      if (appendAssistantReply || !data.plan) {
        const assistantMessage: LucyTripMessage = {
          id: createLucyTripMessageId(),
          role: "assistant",
          content: data.reply,
          status: "complete",
        }

        setMessages((currentMessages) => [
          ...currentMessages,
          assistantMessage,
        ])
      }
    } catch (error) {
      console.error("Lucy Trip chat failed:", error)

      setMessages((currentMessages) => [
        ...currentMessages,
        {
          id: createLucyTripMessageId(),
          role: "assistant",
          content:
            "I’m having trouble shaping this trip right now. Please try again in a moment.",
          status: "error",
        },
      ])
    } finally {
      setIsLucyThinking(false)
    }
  }

  useEffect(() => {
    if (initialRequestStartedRef.current) {
      return
    }

    initialRequestStartedRef.current = true

    const payload = readLucyTripLaunchPayload()
    const launchMode = payload.mode || "discovery"
    const initialIdea = payload.initialIdea?.trim() || ""

    setLaunchPayload({
      ...payload,
      mode: launchMode,
      initialIdea,
    })

    const startingMessages: LucyTripMessage[] =
      launchMode === "continue-topic" && initialIdea
        ? [
          {
            id: createLucyTripMessageId(),
            role: "user",
            content: initialIdea,
            status: "complete",
          },
        ]
        : []

    setMessages(startingMessages)
    setTripPlan(null)

    void requestLucyTripReply({
      launchMode,
      initialIdea,
      nextMessages: startingMessages,
      appendAssistantReply: false,
    })
  }, [])

  function handleLucyComposerSubmit() {
    const prompt = lucyPrompt.trim()

    if (!prompt || isLucyThinking) {
      return
    }

    const nextUserMessage: LucyTripMessage = {
      id: createLucyTripMessageId(),
      role: "user",
      content: prompt,
      status: "complete",
    }

    const nextMessages = [...messages, nextUserMessage]

    setMessages(nextMessages)
    setLucyPrompt("")

    void requestLucyTripReply({
      launchMode: launchPayload.mode || "discovery",
      initialIdea: launchPayload.initialIdea?.trim() || "",
      nextMessages,
      appendAssistantReply: true,
    })
  }

  return (
    <main className="h-screen overflow-hidden bg-white text-slate-950">
      <section className="relative h-screen overflow-hidden bg-white px-5 pb-10 pt-5 sm:px-8">
        <LucyTripTopBar />

        <LucyTripLeftRail />

        <LucyTripGuideContent
          messages={messages}
          tripPlan={tripPlan}
          isLucyThinking={isLucyThinking}
        />

        <LucyTripMapButton onClick={() => setMapPanelOpen(true)} />

        <LucyTripMapPanel
          open={mapPanelOpen}
          onClose={() => setMapPanelOpen(false)}
        />

        <LucyTripComposer
          value={lucyPrompt}
          onChange={setLucyPrompt}
          onSubmit={handleLucyComposerSubmit}
          placeholder="Tell Lucy what sounds good, what feels wrong, or what you want to explore next..."
        />
      </section>
    </main>
  )
}