export type LucyWatchlistAction = {
  type: "add_watchlist_route"
  status: "needs_confirmation"
  origin: string
  destination: string
  departureDate: string
  routeLabel?: string
  confirmationPrompt?: string
}

export type LucyPreferredAirportsAction = {
  type: "save_preferred_airports"
  status: "needs_confirmation"
  airportCodes: string[]
  airportLabels?: string[]
  confirmationPrompt?: string
}

export type LucyPreferredRouteAction = {
  type: "save_preferred_route"
  status: "needs_confirmation"
  origin: string
  destination: string
  routeLabel?: string
  confirmationPrompt?: string
}

export type LucySaveFirstNameAction = {
  type: "save_first_name"
  status: "needs_confirmation"
  firstName: string
  confirmationPrompt?: string
}

export type LucySaveVisibleFlightAction = {
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

export type LucyMemorySubject = {
  subjectType: "self" | "person" | "group"
  subjectKey: string
  displayName: string
  relationshipLabel?: string | null
  aliases?: string[]
}

export type LucySaveMemoryAction = {
  type: "save_lucy_memory"
  status: "needs_confirmation"
  subject?: LucyMemorySubject
  memoryType: string
  memoryKey: string
  memoryText: string
  memoryValueJson?: unknown | null
  confirmationPrompt?: string
}

export type LucyAction =
  | LucyWatchlistAction
  | LucyPreferredAirportsAction
  | LucyPreferredRouteAction
  | LucySaveFirstNameAction
  | LucySaveVisibleFlightAction
  | LucySaveMemoryAction

function normalizeLucyMemorySubject(
  value: unknown
): LucyMemorySubject | null {
  if (!value || typeof value !== "object") {
    return null
  }

  const input = value as {
    subjectType?: unknown
    subjectKey?: unknown
    displayName?: unknown
    relationshipLabel?: unknown
    aliases?: unknown
  }

  const subjectType =
    typeof input.subjectType === "string"
      ? input.subjectType.trim().toLowerCase()
      : ""

  if (
    subjectType !== "self" &&
    subjectType !== "person" &&
    subjectType !== "group"
  ) {
    return null
  }

  if (subjectType === "self") {
    return {
      subjectType: "self",
      subjectKey: "self",
      displayName:
        typeof input.displayName === "string" &&
          input.displayName.trim()
          ? input.displayName
            .trim()
            .replace(/\s+/g, " ")
            .slice(0, 120)
          : "Traveler",
      relationshipLabel: "self",
      aliases: ["self", "me"],
    }
  }

  const displayName =
    typeof input.displayName === "string"
      ? input.displayName
        .trim()
        .replace(/\s+/g, " ")
        .slice(0, 120)
      : ""

  if (!displayName) return null

  const rawSubjectKey =
    typeof input.subjectKey === "string" &&
      input.subjectKey.trim()
      ? input.subjectKey
      : displayName

  const subjectKey = rawSubjectKey
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "")
    .slice(0, 120)

  if (!subjectKey) return null

  const relationshipLabel =
    typeof input.relationshipLabel === "string" &&
      input.relationshipLabel.trim()
      ? input.relationshipLabel
        .trim()
        .toLowerCase()
        .replace(/\s+/g, "_")
        .slice(0, 80)
      : null

  const aliases = Array.isArray(input.aliases)
    ? Array.from(
      new Set(
        input.aliases
          .filter(
            (alias): alias is string =>
              typeof alias === "string"
          )
          .map((alias) =>
            alias
              .trim()
              .replace(/\s+/g, " ")
              .slice(0, 120)
          )
          .filter(Boolean)
      )
    )
    : []

  if (
    !aliases.some(
      (alias) =>
        alias.toLowerCase() ===
        displayName.toLowerCase()
    )
  ) {
    aliases.unshift(displayName)
  }

  return {
    subjectType,
    subjectKey,
    displayName,
    relationshipLabel,
    aliases,
  }
}

export function normalizeLucyAction(value: unknown): LucyAction | null {
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

  if (input.type === "save_lucy_memory") {
    const subjectWasProvided =
      input.subject !== undefined &&
      input.subject !== null

    const subject = subjectWasProvided
      ? normalizeLucyMemorySubject(input.subject)
      : undefined

    if (subjectWasProvided && !subject) {
      return null
    }

    const memoryType =
      typeof input.memoryType === "string" && input.memoryType.trim()
        ? input.memoryType.trim().toLowerCase().replace(/\s+/g, "_").slice(0, 80)
        : "general_travel_note"

    const memoryKey =
      typeof input.memoryKey === "string" && input.memoryKey.trim()
        ? input.memoryKey
          .trim()
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "_")
          .replace(/^_+|_+$/g, "")
          .slice(0, 120)
        : ""

    const memoryText =
      typeof input.memoryText === "string" && input.memoryText.trim()
        ? input.memoryText.trim().replace(/\s+/g, " ").slice(0, 500)
        : ""

    if (!memoryKey || !memoryText) return null

    return {
      type: "save_lucy_memory",
      status: "needs_confirmation",
      ...(subject ? { subject } : {}),
      memoryType,
      memoryKey,
      memoryText,
      memoryValueJson: input.memoryValueJson ?? null,
      confirmationPrompt:
        typeof input.confirmationPrompt === "string" &&
          input.confirmationPrompt.trim()
          ? input.confirmationPrompt.trim()
          : "Would you like me to remember that for future Skysirv sessions?",
    }
  }

  return null
}

export function isAffirmativeLucyActionConfirmation(message: string) {
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

export function isNegativeLucyActionConfirmation(message: string) {
  const normalized = message.trim().toLowerCase()

  return (
    /^(no|nope|cancel|not now)\b/.test(normalized) ||
    normalized.includes("do not add") ||
    normalized.includes("don't add") ||
    normalized.includes("do not save") ||
    normalized.includes("don't save")
  )
}

export function getLucyActionLabel(action: LucyAction) {
  if (action.type === "save_first_name") {
    return action.firstName
  }

  if (action.type === "save_lucy_memory") {
    return action.memoryText
  }

  if (action.type === "add_watchlist_route") {
    return `${action.origin} → ${action.destination} for ${action.departureDate}`
  }

  if (action.type === "save_preferred_airports") {
    return action.airportCodes.join(" and ")
  }

  return `${action.origin} → ${action.destination}`
}