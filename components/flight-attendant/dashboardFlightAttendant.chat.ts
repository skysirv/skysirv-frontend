import type {
  DashboardLucyTier,
  DashboardRouteContext,
  FlightAttendantMessage,
} from "./dashboardFlightAttendant.types"

import {
  normalizeLucyAction,
  type LucyAction,
} from "./dashboardFlightAttendant.actions"

type LucyChatApiResponse = {
  success?: boolean
  model?: string
  reply?: string
  action?: LucyAction | null
  error?: string
}

type SendLucyChatMessageParams = {
  apiBaseUrl: string
  token: string
  message: string
  tier: DashboardLucyTier
  dashboardRoutes: DashboardRouteContext[]
  messages: FlightAttendantMessage[]
}

export type LucyChatResult = {
  reply: string
  action: LucyAction | null
}

export async function sendLucyChatMessage({
  apiBaseUrl,
  token,
  message,
  tier,
  dashboardRoutes,
  messages,
}: SendLucyChatMessageParams): Promise<LucyChatResult> {
  const response = await fetch(
    `${apiBaseUrl}/api/flight-attendant/chat`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        message,
        tier,
        dashboardRoutes,
        messages: messages.slice(-10).map((item) => ({
          role: item.role,
          content: item.text,
        })),
      }),
    }
  )

  const data = (await response.json().catch(() => null)) as
    | LucyChatApiResponse
    | null

  if (!response.ok) {
    throw new Error(
      data?.error || "Unable to reach Lucy."
    )
  }

  return {
    reply:
      data?.reply ||
      "I’m here, but I could not generate a response.",
    action: normalizeLucyAction(data?.action),
  }
}