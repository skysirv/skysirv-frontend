import {
  getLucyActionLabel,
  type LucyAction,
} from "./dashboardFlightAttendant.actions"

export type LucyConfirmedWatchlistRoute = {
  origin: string
  destination: string
  departureDate: string
  routeLabel?: string
}

type ExecuteLucyActionParams = {
  action: LucyAction
  token: string
  apiBaseUrl: string
  sourceConversationId?: string | null
}

export type LucyActionExecutionResult = {
  reply: string
  confirmedWatchlistRoute?: LucyConfirmedWatchlistRoute
}

export async function executeLucyAction({
  action,
  token,
  apiBaseUrl,
  sourceConversationId = null,
}: ExecuteLucyActionParams): Promise<LucyActionExecutionResult> {
  if (action.type === "save_first_name") {
    const response = await fetch(
      `${apiBaseUrl}/api/user-preferences/profile-name`,
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

    return {
      reply: `Done — I’ll remember your name as ${action.firstName} for future Skysirv sessions.`,
    }
  }

  if (action.type === "save_lucy_memory") {
    const response = await fetch(
      `${apiBaseUrl}/api/flight-attendant/memories`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          subject: action.subject,
          memoryType: action.memoryType,
          memoryKey: action.memoryKey,
          memoryText: action.memoryText,
          memoryValueJson: action.memoryValueJson ?? null,
          sourceConversationId,
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

    const confirmationPrompt =
      typeof action.confirmationPrompt === "string"
        ? action.confirmationPrompt.trim()
        : ""

    const acknowledgement =
      confirmationPrompt &&
        !confirmationPrompt.endsWith("?")
        ? confirmationPrompt
        : "Got it. I’ll keep that in mind for future travel planning."

    return {
      reply: acknowledgement,
    }
  }

  if (action.type === "add_watchlist_route") {
    const response = await fetch(
      `${apiBaseUrl}/watchlist`,
      {
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
      }
    )

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

    return {
      reply: "Done — it’s on your watchlist.",
      confirmedWatchlistRoute: {
        origin: action.origin,
        destination: action.destination,
        departureDate: action.departureDate,
        routeLabel: action.routeLabel,
      },
    }
  }

  if (action.type === "save_visible_flight") {
    const response = await fetch(
      `${apiBaseUrl}/saved-flights`,
      {
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
      }
    )

    const data = await response.json().catch(() => null)

    if (!response.ok) {
      if (response.status === 409) {
        return {
          reply: "That flight is already in your Saved Flights.",
        }
      }

      throw new Error(
        data?.error ||
        "I couldn’t save that flight yet. Please try again in a moment."
      )
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

    return {
      reply: `Done — I saved ${action.flightLabel ||
        action.flightNumber ||
        "that flight"
        } to your Saved Flights.`,
    }
  }

  if (action.type === "save_preferred_airports") {
    const response = await fetch(
      `${apiBaseUrl}/api/user-preferences/preferred-airports`,
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

    return {
      reply: `Done — I saved ${getLucyActionLabel(
        action
      )} as preferred airports.`,
    }
  }

  if (action.type === "save_preferred_route") {
    const response = await fetch(
      `${apiBaseUrl}/api/user-preferences/preferred-routes`,
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

    return {
      reply: `Done — I saved ${getLucyActionLabel(
        action
      )} as a preferred route.`,
    }
  }

  throw new Error(
    "Lucy does not support that action yet."
  )
}