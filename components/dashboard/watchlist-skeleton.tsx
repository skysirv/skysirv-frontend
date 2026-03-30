import Skeleton from "@/components/ui/skeleton"

export default function WatchlistSkeleton() {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-md">

      {/* Route Title */}

      <div className="mb-4">
        <Skeleton className="h-5 w-32" />
      </div>

      {/* Departure Date */}

      <div className="mb-6">
        <Skeleton className="h-4 w-40" />
      </div>

      {/* Price + Metrics */}

      <div className="space-y-3">

        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-28" />
        <Skeleton className="h-4 w-20" />

      </div>

      {/* Intelligence Section */}

      <div className="mt-6 border-t border-slate-200 pt-4 space-y-3">

        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-4 w-28" />

      </div>

    </div>
  )
}