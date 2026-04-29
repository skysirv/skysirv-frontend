"use client"

import OpportunityBanner from "@/components/dashboard/opportunity-banner"
import MarketSignals from "@/components/dashboard/market-signals"
import OpportunitySkeleton from "@/components/dashboard/opportunity-skeleton"
import MarketSignalsSkeleton from "@/components/dashboard/market-signals-skeleton"

type BusinessGlobalIntelligenceProps = {
  loading: boolean
}

export default function BusinessGlobalIntelligence({
  loading,
}: BusinessGlobalIntelligenceProps) {
  return (
    <div className="mb-12 grid gap-8 lg:grid-cols-2">
      {loading ? <OpportunitySkeleton /> : <OpportunityBanner />}
      {loading ? <MarketSignalsSkeleton /> : <MarketSignals />}
    </div>
  )
}