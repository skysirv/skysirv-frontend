const trustedAirlines = [
  { code: "AA", name: "American Airlines" },
  { code: "DL", name: "Delta Air Lines" },
  { code: "UA", name: "United Airlines" },
  { code: "BA", name: "British Airways" },
  { code: "LH", name: "Lufthansa" },
  { code: "AF", name: "Air France" },
  { code: "EK", name: "Emirates" },
  { code: "QR", name: "Qatar Airways" },
]

function getDuffelAirlineLogoUrl(code: string): string {
  return `https://assets.duffel.com/img/airlines/for-light-background/full-color-logo/${code}.svg`
}

export default function FlightTrustStrip() {
  return (
    <div className="px-1 pb-1 pt-3">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="shrink-0 text-sm font-bold text-slate-900">
          Trusted airlines. Smarter Skysirv search.
        </p>

        <div className="flex min-w-0 flex-nowrap items-center justify-start gap-6 overflow-x-auto pb-1 sm:justify-end sm:pb-0">
          {trustedAirlines.map((airline) => (
            <img
              key={airline.code}
              src={getDuffelAirlineLogoUrl(airline.code)}
              alt={airline.name}
              title={airline.name}
              className="h-6 w-auto max-w-[92px] shrink-0 object-contain"
              onError={(event) => {
                event.currentTarget.style.display = "none"
              }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}