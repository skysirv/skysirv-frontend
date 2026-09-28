type ConfirmedVoiceWatchlistRoute = {
  origin: string
  destination: string
  departureDate: string
  routeLabel?: string
  confirmedAt: number
}

export function findRecentlyConfirmedVoiceRoute({
  message,
  confirmedRoutes,
}: {
  message: string
  confirmedRoutes: ConfirmedVoiceWatchlistRoute[]
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

    const recentlyConfirmed =
      Date.now() - route.confirmedAt < 10 * 60 * 1000

    return routeMentioned && recentlyConfirmed
  })
}

export function findRecentlyConfirmedWatchlistRoute({
  transcript,
  confirmedRoutes,
}: {
  transcript: string
  confirmedRoutes: ConfirmedVoiceWatchlistRoute[]
}) {
  if (!transcript.toLowerCase().includes("watch")) {
    return undefined
  }

  return findRecentlyConfirmedVoiceRoute({
    message: transcript,
    confirmedRoutes,
  })
}

export function getRecentlyConfirmedWatchlistReply({
  origin,
  destination,
}: {
  origin: string
  destination: string
}) {
  return `${origin} → ${destination} is on your watchlist.`
}

export function getRecentlyConfirmedWatchlistResponse({
  transcript,
  confirmedRoutes,
}: {
  transcript: string
  confirmedRoutes: ConfirmedVoiceWatchlistRoute[]
}) {
  const route = findRecentlyConfirmedWatchlistRoute({
    transcript,
    confirmedRoutes,
  })

  if (!route) return null

  return {
    route,
    reply: getRecentlyConfirmedWatchlistReply({
      origin: route.origin,
      destination: route.destination,
    }),
  }
}