import HomepageLabHero from "@/components/home/lab/HomepageLabHero"
import HomepageLabLucyPathways from "@/components/home/lab/HomepageLabLucyPathways"
import HomepageLabMarketFlow from "@/components/home/lab/HomepageLabMarketFlow"
import HomepageLabLucyMemory from "@/components/home/lab/HomepageLabLucyMemory"
import HomepageLabTravelerMoments from "@/components/home/lab/HomepageLabTravelerMoments"
import HomepageLabSkysirvLive from "@/components/home/lab/HomepageLabSkysirvLive"
import HomepageLabUserStories from "@/components/home/lab/HomepageLabUserStories"
import HomepageLabFAQ from "@/components/home/lab/HomepageLabFAQ"
import HomepageLabFinalCTA from "@/components/home/lab/HomepageLabFinalCTA"

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