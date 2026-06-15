import type { BookingOffer } from "@/lib/booking-api"

export type FlightCountPriceFilterOption = {
  label: string
  value: string
  count: number
  price: string
}

export type FlightAirportFilterGroup = {
  title: string
  options: FlightCountPriceFilterOption[]
}

function parseAmount(value: string): number {
  const amount = Number(value)
  return Number.isFinite(amount) ? amount : 0
}

function formatMoney(amount: number, currency: string): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: amount % 1 === 0 ? 0 : 2,
  }).format(amount)
}

function getAirlineName(offer: BookingOffer): string {
  return offer.summary.airlineName || offer.owner.name || "Unknown airline"
}

function getAirportDisplayName({
  code,
  name,
  cityName,
}: {
  code: string
  name?: string | null
  cityName?: string | null
}) {
  if (name) return `${code} - ${name}`
  if (cityName) return `${code} - ${cityName}`

  return code
}

export function getFlightAirlineFilterOptions(
  offers: BookingOffer[],
): FlightCountPriceFilterOption[] {
  const currency = offers[0]?.totalCurrency ?? "USD"
  const airlineMap = new Map<
    string,
    {
      count: number
      lowestAmount: number
    }
  >()

  for (const offer of offers) {
    const airlineName = getAirlineName(offer)
    const amount = parseAmount(offer.totalAmount)
    const current = airlineMap.get(airlineName)

    if (!current) {
      airlineMap.set(airlineName, {
        count: 1,
        lowestAmount: amount,
      })
      continue
    }

    airlineMap.set(airlineName, {
      count: current.count + 1,
      lowestAmount: Math.min(current.lowestAmount, amount),
    })
  }

  return Array.from(airlineMap.entries())
    .sort((a, b) => a[1].lowestAmount - b[1].lowestAmount)
    .map(([airlineName, value]) => ({
      label: airlineName,
      value: airlineName,
      count: value.count,
      price: formatMoney(value.lowestAmount, currency),
    }))
}

export function getFlightAirportFilterGroups(
  offers: BookingOffer[],
): FlightAirportFilterGroup[] {
  const currency = offers[0]?.totalCurrency ?? "USD"

  const departingMap = new Map<
    string,
    {
      label: string
      count: number
      lowestAmount: number
    }
  >()

  const travelingToMap = new Map<
    string,
    {
      label: string
      count: number
      lowestAmount: number
    }
  >()

  for (const offer of offers) {
    const amount = parseAmount(offer.totalAmount)
    const primarySlice = offer.slices[0]

    if (!primarySlice) continue

    if (primarySlice.origin.iataCode) {
      const code = primarySlice.origin.iataCode
      const current = departingMap.get(code)

      if (!current) {
        departingMap.set(code, {
          label: getAirportDisplayName({
            code,
            name: primarySlice.origin.name,
            cityName: primarySlice.origin.cityName,
          }),
          count: 1,
          lowestAmount: amount,
        })
      } else {
        departingMap.set(code, {
          ...current,
          count: current.count + 1,
          lowestAmount: Math.min(current.lowestAmount, amount),
        })
      }
    }

    if (primarySlice.destination.iataCode) {
      const code = primarySlice.destination.iataCode
      const current = travelingToMap.get(code)

      if (!current) {
        travelingToMap.set(code, {
          label: getAirportDisplayName({
            code,
            name: primarySlice.destination.name,
            cityName: primarySlice.destination.cityName,
          }),
          count: 1,
          lowestAmount: amount,
        })
      } else {
        travelingToMap.set(code, {
          ...current,
          count: current.count + 1,
          lowestAmount: Math.min(current.lowestAmount, amount),
        })
      }
    }
  }

  function buildOptions(
    airportMap: typeof departingMap,
  ): FlightCountPriceFilterOption[] {
    return Array.from(airportMap.entries())
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([code, value]) => ({
        label: value.label,
        value: code,
        count: value.count,
        price: formatMoney(value.lowestAmount, currency),
      }))
  }

  return [
    {
      title: "Departing From",
      options: buildOptions(departingMap).map((option) => ({
        ...option,
        value: `origin:${option.value}`,
      })),
    },
    {
      title: "Traveling To",
      options: buildOptions(travelingToMap).map((option) => ({
        ...option,
        value: `destination:${option.value}`,
      })),
    },
  ].filter((group) => group.options.length > 0)
}