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
  conversationId?: string
  error?: string
}

type LucyConversationApiRow = {
  id: string
  title: string
  pinned: boolean
  planned_trip: boolean
  status: string
  created_at: string
  updated_at: string
}

type LucyConversationMessageApiRow = {
  id: string
  conversation_id: string
  role: "user" | "assistant"
  content: string
  source: string
  created_at: string
}

type LucyConversationListApiResponse = {
  success?: boolean
  conversations?: LucyConversationApiRow[]
  error?: string
}

type LucyConversationDetailApiResponse = {
  success?: boolean
  conversation?: LucyConversationApiRow
  messages?: LucyConversationMessageApiRow[]
  error?: string
}

type SendLucyChatMessageParams = {
  apiBaseUrl: string
  token: string
  message: string
  tier: DashboardLucyTier
  dashboardRoutes: DashboardRouteContext[]
  messages: FlightAttendantMessage[]
  conversationId?: string | null
}

export type LoadedLucyConversation = {
  conversationId: string
  title: string
  messages: FlightAttendantMessage[]
}

export type LucyConversationSummary = {
  id: string
  title: string
  pinned: boolean
  plannedTrip: boolean
  status: string
  createdAt: string
  updatedAt: string
}

export type LucyChatResult = {
  reply: string
  action: LucyAction | null
  conversationId: string | null
}

export async function sendLucyChatMessage({
  apiBaseUrl,
  token,
  message,
  tier,
  dashboardRoutes,
  messages,
  conversationId,
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
        conversationId: conversationId || undefined,
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
    conversationId:
      typeof data?.conversationId === "string"
        ? data.conversationId
        : null,
  }
}

export async function loadLatestLucyConversation({
  apiBaseUrl,
  token,
}: {
  apiBaseUrl: string
  token: string
}): Promise<LoadedLucyConversation | null> {
  const listResponse = await fetch(
    `${apiBaseUrl}/api/lucy/conversations?limit=1`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  )

  const listData =
    (await listResponse.json().catch(() => null)) as
    | LucyConversationListApiResponse
    | null

  if (!listResponse.ok) {
    throw new Error(
      listData?.error ||
      "Unable to load Lucy conversations."
    )
  }

  const latestConversation =
    listData?.conversations?.[0]

  if (!latestConversation) {
    return null
  }

  const detailResponse = await fetch(
    `${apiBaseUrl}/api/lucy/conversations/${latestConversation.id}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  )

  const detailData =
    (await detailResponse.json().catch(() => null)) as
    | LucyConversationDetailApiResponse
    | null

  if (!detailResponse.ok) {
    throw new Error(
      detailData?.error ||
      "Unable to load Lucy conversation."
    )
  }

  const messages: FlightAttendantMessage[] =
    Array.isArray(detailData?.messages)
      ? detailData.messages.map((item) => ({
        id: item.id,
        role: item.role,
        label:
          item.role === "assistant"
            ? "Lucy"
            : "You",
        text: item.content,
      }))
      : []

  return {
    conversationId: latestConversation.id,
    title: latestConversation.title,
    messages,
  }
}

export async function persistLucyConversationMessage({
  apiBaseUrl,
  token,
  conversationId,
  role,
  content,
  source,
  clientMessageId,
}: {
  apiBaseUrl: string
  token: string
  conversationId: string
  role: "user" | "assistant"
  content: string
  source: string
  clientMessageId?: string | null
}) {
  const cleanContent = content.trim()

  if (!cleanContent) {
    return
  }

  const response = await fetch(
    `${apiBaseUrl}/api/lucy/conversations/${conversationId}/messages`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        role,
        content: cleanContent,
        source,
        clientMessageId:
          clientMessageId || undefined,
      }),
    }
  )

  if (!response.ok) {
    const data = (await response
      .json()
      .catch(() => null)) as
      | { error?: string }
      | null

    throw new Error(
      data?.error ||
      "Unable to save Lucy conversation message."
    )
  }
}

export async function getRecentLucyConversations({
  apiBaseUrl,
  token,
  limit = 20,
}: {
  apiBaseUrl: string
  token: string
  limit?: number
}): Promise<LucyConversationSummary[]> {
  const response = await fetch(
    `${apiBaseUrl}/api/lucy/conversations?limit=${limit}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  )

  const data = (await response.json().catch(() => null)) as
    | LucyConversationListApiResponse
    | null

  if (!response.ok) {
    throw new Error(
      data?.error ||
      "Unable to load Lucy conversations."
    )
  }

  return Array.isArray(data?.conversations)
    ? data.conversations.map((conversation) => ({
      id: conversation.id,
      title: conversation.title,
      pinned: conversation.pinned,
      plannedTrip: conversation.planned_trip,
      status: conversation.status,
      createdAt: conversation.created_at,
      updatedAt: conversation.updated_at,
    }))
    : []
}

export async function loadLucyConversation({
  apiBaseUrl,
  token,
  conversationId,
}: {
  apiBaseUrl: string
  token: string
  conversationId: string
}): Promise<LoadedLucyConversation> {
  const response = await fetch(
    `${apiBaseUrl}/api/lucy/conversations/${conversationId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  )

  const data = (await response.json().catch(() => null)) as
    | LucyConversationDetailApiResponse
    | null

  if (
    !response.ok ||
    !data?.conversation
  ) {
    throw new Error(
      data?.error ||
      "Unable to load Lucy conversation."
    )
  }

  const messages: FlightAttendantMessage[] =
    Array.isArray(data.messages)
      ? data.messages.map((item) => ({
        id: item.id,
        role: item.role,
        label:
          item.role === "assistant"
            ? "Lucy"
            : "You",
        text: item.content,
      }))
      : []

  return {
    conversationId: data.conversation.id,
    title: data.conversation.title,
    messages,
  }
}

export async function createLucyConversation({
  apiBaseUrl,
  token,
  title,
}: {
  apiBaseUrl: string
  token: string
  title?: string
}): Promise<LucyConversationSummary> {
  const response = await fetch(
    `${apiBaseUrl}/api/lucy/conversations`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        title: title || undefined,
      }),
    }
  )

  const data = (await response.json().catch(() => null)) as
    | {
      success?: boolean
      conversation?: LucyConversationApiRow
      error?: string
    }
    | null

  if (
    !response.ok ||
    !data?.conversation
  ) {
    throw new Error(
      data?.error ||
      "Unable to create Lucy conversation."
    )
  }

  return {
    id: data.conversation.id,
    title: data.conversation.title,
    pinned: data.conversation.pinned,
    plannedTrip: data.conversation.planned_trip,
    status: data.conversation.status,
    createdAt: data.conversation.created_at,
    updatedAt: data.conversation.updated_at,
  }
}

export async function updateLucyConversation({
  apiBaseUrl,
  token,
  conversationId,
  title,
  pinned,
  plannedTrip,
}: {
  apiBaseUrl: string
  token: string
  conversationId: string
  title?: string
  pinned?: boolean
  plannedTrip?: boolean
}): Promise<LucyConversationSummary> {
  const response = await fetch(
    `${apiBaseUrl}/api/lucy/conversations/${conversationId}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        title,
        pinned,
        plannedTrip,
      }),
    }
  )

  const data = (await response.json().catch(() => null)) as
    | {
      success?: boolean
      conversation?: LucyConversationApiRow
      error?: string
    }
    | null

  if (
    !response.ok ||
    !data?.conversation
  ) {
    throw new Error(
      data?.error ||
      "Unable to update Lucy conversation."
    )
  }

  return {
    id: data.conversation.id,
    title: data.conversation.title,
    pinned: data.conversation.pinned,
    plannedTrip: data.conversation.planned_trip,
    status: data.conversation.status,
    createdAt: data.conversation.created_at,
    updatedAt: data.conversation.updated_at,
  }
}

export async function deleteLucyConversation({
  apiBaseUrl,
  token,
  conversationId,
}: {
  apiBaseUrl: string
  token: string
  conversationId: string
}) {
  const response = await fetch(
    `${apiBaseUrl}/api/lucy/conversations/${conversationId}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  )

  const data = (await response.json().catch(() => null)) as
    | {
      success?: boolean
      conversation?: LucyConversationApiRow
      error?: string
    }
    | null

  if (!response.ok) {
    throw new Error(
      data?.error ||
      "Unable to delete Lucy conversation."
    )
  }

  return data?.conversation ?? null
}