import { useEffect, useRef, useState, type ReactNode } from "react"

export type FlightFilterOption = {
  label: string
  meta?: string
  value?: string
}

export type SortFilterOption = {
  label: string
  value: string
}

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

const defaultTakeoffOptions: FlightFilterOption[] = [
  { label: "Early Morning", meta: "12 AM – 6 AM", value: "early-morning" },
  { label: "Morning", meta: "6 AM – 12 PM", value: "morning" },
  { label: "Afternoon", meta: "12 PM – 6 PM", value: "afternoon" },
  { label: "Evening", meta: "6 PM – 12 AM", value: "evening" },
]

const defaultLandingOptions: FlightFilterOption[] = [
  { label: "Early Morning", meta: "12 AM – 6 AM", value: "early-morning" },
  { label: "Morning", meta: "6 AM – 12 PM", value: "morning" },
  { label: "Afternoon", meta: "12 PM – 6 PM", value: "afternoon" },
  { label: "Evening", meta: "6 PM – 12 AM", value: "evening" },
]

export function ChevronDownLarge() {
  return (
    <svg
      viewBox="0 0 20 20"
      aria-hidden="true"
      className="h-5 w-5 text-slate-700"
      fill="none"
    >
      <path
        d="M5 7.5 10 12.5 15 7.5"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function RecommendedDropdownButton({
  label = "Recommended",
  onClick,
  options = [],
  selectedValue,
  onSelect,
}: {
  label?: string
  onClick?: () => void
  options?: SortFilterOption[]
  selectedValue?: string
  onSelect?: (value: string) => void
}) {
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement | null>(null)

  const selectedOption = options.find((option) => option.value === selectedValue)
  const displayLabel = selectedOption?.label ?? label
  const hasOptions = options.length > 0

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (!containerRef.current) return

      if (!containerRef.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => {
          if (hasOptions) {
            setOpen((current) => !current)
            return
          }

          onClick?.()
        }}
        className="flex min-h-[38px] w-full items-center justify-between rounded-xl border border-slate-300 bg-white px-4 text-sm font-light text-blue-700 shadow-sm transition"
      >
        {displayLabel}
        <ChevronDownLarge />
      </button>

      {open && hasOptions ? (
        <div className="absolute left-0 right-0 top-full z-40 mt-2 overflow-hidden rounded-xl border border-slate-200 bg-white p-2 shadow-[0_18px_45px_rgba(15,23,42,0.12)]">
          {options.map((option) => {
            const active = option.value === selectedValue

            return (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  onSelect?.(option.value)
                  setOpen(false)
                }}
                className={`flex min-h-[40px] w-full items-center justify-between rounded-lg px-3 text-left text-sm font-semibold transition ${active
                  ? "bg-blue-50 text-blue-700"
                  : "text-slate-700 hover:bg-slate-50 hover:text-slate-800"
                  }`}
              >
                {option.label}

                {active ? (
                  <span className="text-xs font-bold text-blue-700">
                    Selected
                  </span>
                ) : null}
              </button>
            )
          })}
        </div>
      ) : null}
    </div>
  )
}

export function FilterMiniSection({
  title,
  reset = false,
  onReset,
  children,
}: {
  title: string
  reset?: boolean
  onReset?: () => void
  children: ReactNode
}) {
  return (
    <div>
      <div className="mb-3 flex items-center justify-between border-b border-slate-300 pb-2">
        <p className="text-base font-black text-slate-800">{title}</p>

        {reset && (
          <button
            type="button"
            onClick={onReset}
            className="text-sm font-bold text-blue-700 transition hover:text-blue-800"
          >
            Reset
          </button>
        )}
      </div>

      <div className="space-y-2">{children}</div>
    </div>
  )
}

export function FilterCheckboxRow({
  label,
  meta,
  checked = false,
  onChange,
}: {
  label: string
  meta?: string
  checked?: boolean
  onChange?: (checked: boolean) => void
}) {
  return (
    <label className="flex min-h-[32px] cursor-pointer items-center gap-3 text-sm font-medium text-slate-700">
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange?.(event.target.checked)}
        className="h-4 w-4 rounded border-slate-400 text-blue-700 focus:ring-blue-200"
      />

      <span className="min-w-0 flex-1 truncate">{label}</span>

      {meta ? (
        <span className="shrink-0 text-sm font-bold text-slate-800">
          {meta}
        </span>
      ) : null}
    </label>
  )
}

export function FilterPillRow({
  label,
  meta,
  active = false,
  onClick,
}: {
  label: string
  meta?: string
  active?: boolean
  onClick?: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex min-h-[40px] w-full items-center justify-between rounded-full border px-3 text-left text-sm font-medium shadow-sm transition hover:border-blue-100 hover:bg-blue-50 hover:text-blue-700 ${active
        ? "border-blue-200 bg-blue-50 text-blue-700"
        : "border-slate-300 bg-white text-blue-700"
        }`}
    >
      <span className="truncate">{label}</span>

      {meta ? (
        <span className="shrink-0 pl-2 text-sm font-bold text-blue-700">
          {meta}
        </span>
      ) : null}
    </button>
  )
}

export function SelectAllNoneControls({
  onSelectNone,
  onSelectAll,
}: {
  onSelectNone?: () => void
  onSelectAll?: () => void
}) {
  return (
    <div className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-500">
      <button
        type="button"
        onClick={onSelectNone}
        className="text-blue-700 hover:text-blue-800"
      >
        Select None
      </button>
      <span>|</span>
      <button
        type="button"
        onClick={onSelectAll}
        className="text-blue-700 hover:text-blue-800"
      >
        Select All
      </button>
    </div>
  )
}

export function FlightsFilterPanel({
  sortLabel = "Recommended",
  onCycleSort,
  sortOptions = [],
  selectedSortValue,
  onSelectSort,
  stopsOptions,
  selectedStops = [],
  onToggleStop,
  onResetStops,
  airlineOptions,
  selectedTakeoffBands = [],
  onToggleTakeoffBand,
  onResetTakeoff,
  selectedLandingBands = [],
  onToggleLandingBand,
  onResetLanding,
  airlineCountOptions = [],
  selectedAirlines = [],
  onToggleAirline,
  onSelectAllAirlines,
  onSelectNoAirlines,
  airportGroups = [],
  selectedAirportCodes = [],
  onToggleAirportCode,
  onResetAirports,
  takeoffOptions = defaultTakeoffOptions,
  landingOptions = defaultLandingOptions,
}: {
  sortLabel?: string
  onCycleSort?: () => void
  sortOptions?: SortFilterOption[]
  selectedSortValue?: string
  onSelectSort?: (value: string) => void
  stopsOptions: FlightFilterOption[]
  selectedStops?: string[]
  onToggleStop?: (value: string) => void
  onResetStops?: () => void
  airlineOptions: FlightFilterOption[]
  selectedTakeoffBands?: string[]
  onToggleTakeoffBand?: (value: string) => void
  onResetTakeoff?: () => void
  selectedLandingBands?: string[]
  onToggleLandingBand?: (value: string) => void
  onResetLanding?: () => void
  airlineCountOptions?: FlightCountPriceFilterOption[]
  selectedAirlines?: string[]
  onToggleAirline?: (value: string) => void
  onSelectAllAirlines?: () => void
  onSelectNoAirlines?: () => void
  airportGroups?: FlightAirportFilterGroup[]
  selectedAirportCodes?: string[]
  onToggleAirportCode?: (value: string) => void
  onResetAirports?: () => void
  takeoffOptions?: FlightFilterOption[]
  landingOptions?: FlightFilterOption[]
}) {
  return (
    <aside className="h-fit rounded-[1.35rem] border border-slate-200 bg-white p-5 shadow-[0_14px_38px_rgba(15,23,42,0.07)]">
      <div className="space-y-6">
        <FilterMiniSection title="Sort By">
          <RecommendedDropdownButton
            label={sortLabel}
            onClick={onCycleSort}
            options={sortOptions}
            selectedValue={selectedSortValue}
            onSelect={onSelectSort}
          />
        </FilterMiniSection>

        <FilterMiniSection title="Inclusions" reset>
          <IconFilterCheckbox
            label="Carry-on bag"
            iconSrc="/images/stock/filter-icons/carry-on.png"
          />

          <IconFilterCheckbox
            label="Seat selection"
            iconSrc="/images/stock/filter-icons/seat-selection.png"
          />

          <IconFilterCheckbox
            label="Changes"
            iconSrc="/images/stock/filter-icons/changes.png"
          />
        </FilterMiniSection>

        <FilterMiniSection title="Stops" reset onReset={onResetStops}>
          {stopsOptions.length ? (
            stopsOptions.map((option) => {
              const value = option.value ?? option.label

              return (
                <FilterCheckboxRow
                  key={value}
                  label={option.label}
                  meta={option.meta}
                  checked={selectedStops.includes(value)}
                  onChange={() => onToggleStop?.(value)}
                />
              )
            })
          ) : (
            <EmptyFilterMessage>
              Search results will populate stop filters.
            </EmptyFilterMessage>
          )}
        </FilterMiniSection>

        <FilterMiniSection title="Airlines">
          <SelectAllNoneControls
            onSelectNone={onSelectNoAirlines}
            onSelectAll={onSelectAllAirlines}
          />

          {airlineCountOptions.length ? (
            airlineCountOptions.map((option) => (
              <CountPriceFilterRow
                key={option.value}
                label={option.label}
                count={option.count}
                price={option.price}
                checked={selectedAirlines.includes(option.value)}
                onChange={() => onToggleAirline?.(option.value)}
              />
            ))
          ) : airlineOptions.length ? (
            airlineOptions.map((option) => (
              <FilterCheckboxRow
                key={option.value ?? option.label}
                label={option.label}
                meta={option.meta}
              />
            ))
          ) : (
            <EmptyFilterMessage>
              Search results will populate airline filters.
            </EmptyFilterMessage>
          )}
        </FilterMiniSection>

        <FilterMiniSection title="Takeoff" reset onReset={onResetTakeoff}>
          {takeoffOptions.map((option) => {
            const value = option.value ?? option.label

            return (
              <FilterCheckboxRow
                key={value}
                label={option.label}
                meta={option.meta}
                checked={selectedTakeoffBands.includes(value)}
                onChange={() => onToggleTakeoffBand?.(value)}
              />
            )
          })}
        </FilterMiniSection>

        <FilterMiniSection title="Landing" reset onReset={onResetLanding}>
          {landingOptions.map((option) => {
            const value = option.value ?? option.label

            return (
              <FilterCheckboxRow
                key={value}
                label={option.label}
                meta={option.meta}
                checked={selectedLandingBands.includes(value)}
                onChange={() => onToggleLandingBand?.(value)}
              />
            )
          })}
        </FilterMiniSection>

        <FilterMiniSection title="Airports" reset onReset={onResetAirports}>
          <SelectAllNoneControls
            onSelectNone={onResetAirports}
            onSelectAll={() => {
              const allAirportValues = airportGroups.flatMap((group) =>
                group.options.map((option) => option.value),
              )

              for (const airportValue of allAirportValues) {
                if (!selectedAirportCodes.includes(airportValue)) {
                  onToggleAirportCode?.(airportValue)
                }
              }
            }}
          />

          {airportGroups.length ? (
            <div className="space-y-4">
              {airportGroups.map((group) => (
                <div key={group.title} className="space-y-2">
                  <p className="text-sm font-semibold text-slate-800">
                    {group.title}
                  </p>

                  {group.options.map((option) => (
                    <CountPriceFilterRow
                      key={`${group.title}-${option.value}`}
                      label={option.label}
                      count={option.count}
                      price={option.price}
                      showCount={false}
                      checked={selectedAirportCodes.includes(option.value)}
                      onChange={() => onToggleAirportCode?.(option.value)}
                    />
                  ))}
                </div>
              ))}
            </div>
          ) : (
            <EmptyFilterMessage>
              Airport filters will appear when alternate or connection airports
              are available.
            </EmptyFilterMessage>
          )}
        </FilterMiniSection>
      </div>
    </aside>
  )
}

function IconFilterCheckbox({
  label,
  iconSrc,
}: {
  label: string
  iconSrc: string
}) {
  return (
    <label className="flex min-h-[34px] cursor-pointer items-center gap-3 text-sm font-medium text-slate-700">
      <input
        type="checkbox"
        className="h-4 w-4 rounded border-slate-400 text-blue-700 focus:ring-blue-200"
      />

      <span className="flex h-5 w-5 shrink-0 items-center justify-center">
        <img
          src={iconSrc}
          alt=""
          className="h-5 w-5 object-contain"
          loading="lazy"
        />
      </span>

      <span>{label}</span>
    </label>
  )
}

function CountPriceFilterRow({
  label,
  count,
  price,
  showCount = true,
  checked = false,
  onChange,
}: {
  label: string
  count: number
  price: string
  showCount?: boolean
  checked?: boolean
  onChange?: () => void
}) {
  return (
    <label className="flex min-h-[34px] cursor-pointer items-center gap-3 text-xs font-medium text-slate-700">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="h-4 w-4 rounded border-slate-400 text-blue-700 focus:ring-blue-200"
      />

      <span className="min-w-0 flex-1 truncate">
        {label}
        {showCount ? (
          <span className="text-slate-500"> ({count})</span>
        ) : null}
      </span>

      <span className="shrink-0 text-sm font-black text-slate-800">
        {price}
      </span>
    </label>
  )
}

function EmptyFilterMessage({ children }: { children: ReactNode }) {
  return (
    <p className="rounded-2xl bg-slate-50 px-3 py-3 text-xs font-semibold leading-5 text-slate-500">
      {children}
    </p>
  )
}