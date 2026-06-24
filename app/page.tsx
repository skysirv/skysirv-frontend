import HomepageLabHero from "@/components/home/lab/HomepageLabHero"
import HomepageLabLucyPathways from "@/components/home/lab/HomepageLabLucyPathways"
import HomepageLabMarketFlow from "@/components/home/lab/HomepageLabMarketFlow"
import HomepageLabLucyMemory from "@/components/home/lab/HomepageLabLucyMemory"
import HomepageLabTravelerMoments from "@/components/home/lab/HomepageLabTravelerMoments"
import HomepageLabSkysirvLive from "@/components/home/lab/HomepageLabSkysirvLive"
import HomepageLabUserStories from "@/components/home/lab/HomepageLabUserStories"
import HomepageLabFAQ from "@/components/home/lab/HomepageLabFAQ"
import HomepageLabFinalCTA from "@/components/home/lab/HomepageLabFinalCTA"

function BetaPill() {
  return (
    <span className="inline-flex items-center rounded-full border border-orange-200 bg-orange-50 px-2 py-0.5 text-[10px] font-black uppercase tracking-[0.14em] text-orange-500">
      Beta
    </span>
  )
}

export default function HomepageLabPage() {
  return (
    <main className="min-h-screen bg-white">
      <div className="-mt-[156px]">
        <HomepageLabHero />
      </div>

      <HomepageLabLucyPathways />
      <HomepageLabMarketFlow />
      <HomepageLabLucyMemory />
      <HomepageLabTravelerMoments />
      <HomepageLabSkysirvLive />
      <HomepageLabUserStories />
      <HomepageLabFAQ />
      <HomepageLabFinalCTA />
    </main>
  )
}