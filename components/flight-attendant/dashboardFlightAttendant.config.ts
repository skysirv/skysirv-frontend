import { type DashboardLucyTier } from "./dashboardFlightAttendant.types"

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

export const LUCY_CHAT_THREADS_STORAGE_KEY =
  "skysirv:lucy-dashboard-chat-threads"

export const LUCY_ACTIVE_CHAT_THREAD_STORAGE_KEY =
  "skysirv:lucy-dashboard-active-chat-thread"

export const tierConfig: Record<
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
    title: "Lucy",
    welcome:
      "Hi, I’m Lucy, your Skysirv AI Travel Companion. I can help with trip planning, destinations, flights, hotels, travel strategy, and Skysirv basics.",
    placeholder: "Ask Lucy...",
  },
  pro: {
    badge: "Standard",
    title: "Lucy",
    welcome:
      "Hi, I’m Lucy, your Skysirv AI Travel Companion. I can help plan trips, understand your travel preferences, compare options, monitor routes, and make smarter travel decisions.",
    placeholder: "Ask Lucy...",
  },
  business: {
    badge: "Advanced",
    title: "Lucy",
    welcome:
      "Hi, I’m Lucy, your Skysirv AI Travel Companion. I can help plan and organize travel, use your saved preferences, analyze Skysirv intelligence, and support more complex travel decisions.",
    placeholder: "Ask Lucy...",
  },
}