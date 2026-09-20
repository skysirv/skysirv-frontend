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
        title: "Free Flight Attendant",
        welcome:
            "Hi, I’m Lucy, your Skysirv Flight Attendant. I can help explain Skysirv basics, watchlists, fare signals, and how to get started with smarter flight monitoring.",
        placeholder: "Ask Lucy...",
    },
    pro: {
        badge: "Standard",
        title: "Pro Flight Attendant",
        welcome:
            "Hi, I’m Lucy, your Skysirv Flight Attendant. I can help explain your routes, fare timing, Skyscore, watchlist signals, and booking confidence.",
        placeholder: "Ask Lucy...",
    },
    business: {
        badge: "Advanced",
        title: "Business Flight Attendant",
        welcome:
            "Hi, I’m Lucy, your advanced Skysirv Flight Attendant. I can help analyze route behavior, fare intelligence, saved flights, timing signals, and premium booking decisions.",
        placeholder: "Ask Lucy...",
    },
}