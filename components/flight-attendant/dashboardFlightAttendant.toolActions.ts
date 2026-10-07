import {
  normalizeLucyAction,
  type LucyAction,
} from "./dashboardFlightAttendant.actions"

export type LucyToolCallInput = {
  name?: string
  arguments?: string
  call_id?: string
}

export type PreparedLucyToolAction = {
  action: LucyAction
  duplicateKey: string
  confirmationText: string
}

function parseToolArguments(item: LucyToolCallInput) {
  const rawArguments =
    typeof item.arguments === "string"
      ? item.arguments
      : ""

  if (!rawArguments) return null

  try {
    return JSON.parse(rawArguments) as Record<string, unknown>
  } catch {
    return null
  }
}

function buildWatchlistToolAction(
  item: LucyToolCallInput
): PreparedLucyToolAction | null {
  if (item.name !== "prepare_watchlist_route") return null

  const parsed = parseToolArguments(item)

  if (!parsed) return null

  const action = normalizeLucyAction({
    type: "add_watchlist_route",
    status: "needs_confirmation",
    origin: parsed.origin,
    destination: parsed.destination,
    departureDate: parsed.departureDate,
    routeLabel: parsed.routeLabel,
    confirmationPrompt: parsed.confirmationPrompt,
  })

  if (!action || action.type !== "add_watchlist_route") {
    return null
  }

  return {
    action,
    duplicateKey: [
      action.type,
      action.origin,
      action.destination,
      action.departureDate,
    ].join(":"),
    confirmationText:
      action.confirmationPrompt ||
      `Add ${action.origin} → ${action.destination} for ${action.departureDate} to your watchlist?`,
  }
}

function buildSaveVisibleFlightToolAction(
  item: LucyToolCallInput
): PreparedLucyToolAction | null {
  if (item.name !== "prepare_save_visible_flight") return null

  const parsed = parseToolArguments(item)

  if (!parsed) return null

  const parsedPrice =
    typeof parsed.price === "number"
      ? parsed.price
      : Number(parsed.price)

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

  if (!action || action.type !== "save_visible_flight") {
    return null
  }

  return {
    action,
    duplicateKey: [
      action.type,
      action.origin,
      action.destination,
      action.departureDate ?? "",
      action.flightNumber ?? "",
    ].join(":"),
    confirmationText:
      action.confirmationPrompt ||
      `Save ${action.flightLabel ||
      action.flightNumber ||
      "that flight"
      } to your Saved Flights?`,
  }
}

function buildSaveLucyMemoryToolAction(
  item: LucyToolCallInput
): PreparedLucyToolAction | null {
  if (item.name !== "prepare_save_lucy_memory") return null

  const parsed = parseToolArguments(item)

  if (!parsed) return null

  const action = normalizeLucyAction({
    type: "save_lucy_memory",
    status: "needs_confirmation",
    subject: parsed.subject,
    memoryType: parsed.memoryType,
    memoryKey: parsed.memoryKey,
    memoryText: parsed.memoryText,
    memoryValueJson: parsed.memoryValueJson ?? null,
    confirmationPrompt: parsed.confirmationPrompt,
  })

  if (!action || action.type !== "save_lucy_memory") {
    return null
  }

  return {
    action,
    duplicateKey: [
      action.type,
      action.subject?.subjectType ?? "self",
      action.subject?.subjectKey ?? "self",
      action.memoryType,
      action.memoryKey,
    ].join(":"),
    confirmationText:
      action.confirmationPrompt ||
      "Would you like me to remember that for future Skysirv sessions?",
  }
}

function buildSaveFirstNameToolAction(
  item: LucyToolCallInput
): PreparedLucyToolAction | null {
  if (item.name !== "prepare_save_first_name") return null

  const parsed = parseToolArguments(item)

  if (!parsed) return null

  const action = normalizeLucyAction({
    type: "save_first_name",
    status: "needs_confirmation",
    firstName: parsed.firstName,
    confirmationPrompt: parsed.confirmationPrompt,
  })

  if (!action || action.type !== "save_first_name") {
    return null
  }

  return {
    action,
    duplicateKey: [
      action.type,
      action.firstName,
    ].join(":"),
    confirmationText:
      action.confirmationPrompt ||
      `Would you like me to remember your name as ${action.firstName}?`,
  }
}

function buildPreferredAirportsToolAction(
  item: LucyToolCallInput
): PreparedLucyToolAction | null {
  if (item.name !== "prepare_save_preferred_airports") return null

  const parsed = parseToolArguments(item)

  if (!parsed) return null

  const action = normalizeLucyAction({
    type: "save_preferred_airports",
    status: "needs_confirmation",
    airportCodes: parsed.airportCodes,
    confirmationPrompt: parsed.confirmationPrompt,
  })

  if (!action || action.type !== "save_preferred_airports") {
    return null
  }

  return {
    action,
    duplicateKey: [
      action.type,
      ...action.airportCodes,
    ].join(":"),
    confirmationText:
      action.confirmationPrompt ||
      `Would you like me to save ${action.airportCodes.join(
        " and "
      )} as preferred airports?`,
  }
}

function buildPreferredRouteToolAction(
  item: LucyToolCallInput
): PreparedLucyToolAction | null {
  if (item.name !== "prepare_save_preferred_route") return null

  const parsed = parseToolArguments(item)

  if (!parsed) return null

  const action = normalizeLucyAction({
    type: "save_preferred_route",
    status: "needs_confirmation",
    origin: parsed.origin,
    destination: parsed.destination,
    routeLabel: parsed.routeLabel,
    confirmationPrompt: parsed.confirmationPrompt,
  })

  if (!action || action.type !== "save_preferred_route") {
    return null
  }

  return {
    action,
    duplicateKey: [
      action.type,
      action.origin,
      action.destination,
    ].join(":"),
    confirmationText:
      action.confirmationPrompt ||
      `Would you like me to save ${action.origin} → ${action.destination} as a preferred route?`,
  }
}

type LucyToolActionBuilder = (
  item: LucyToolCallInput
) => PreparedLucyToolAction | null

const lucyToolActionRegistry: Record<string, LucyToolActionBuilder> = {
  prepare_watchlist_route: buildWatchlistToolAction,
  prepare_save_first_name: buildSaveFirstNameToolAction,
  prepare_save_preferred_airports: buildPreferredAirportsToolAction,
  prepare_save_preferred_route: buildPreferredRouteToolAction,
  prepare_save_visible_flight: buildSaveVisibleFlightToolAction,
  prepare_save_lucy_memory: buildSaveLucyMemoryToolAction,
}

export function buildLucyActionFromToolCall(
  item: LucyToolCallInput
): PreparedLucyToolAction | null {
  if (!item.name) return null

  const builder = lucyToolActionRegistry[item.name]

  if (!builder) return null

  return builder(item)
}