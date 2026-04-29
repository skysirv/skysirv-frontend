"use client"

import OpportunityBanner from "@/components/dashboard/opportunity-banner"
import MarketSignals from "@/components/dashboard/market-signals"
import OpportunitySkeleton from "@/components/dashboard/opportunity-skeleton"
import MarketSignalsSkeleton from "@/components/dashboard/market-signals-skeleton"

type ProGlobalIntelligenceProps = {
  loading: boolean
}

export default function ProGlobalIntelligence({
  loading,
}: ProGlobalIntelligenceProps) {
  return (
    <div className="mb-12 grid gap-8 lg:grid-cols-2">
      {loading ? (
        <>
          <OpportunitySkeleton />
          <MarketSignalsSkeleton />
        </>
      ) : (
        <>
          <OpportunityBanner />
          <MarketSignals />
        </>
      )}
    </div>
  )
}