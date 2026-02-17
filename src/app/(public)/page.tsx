import { Button } from "@/components/ui/button"
import { FadeIn } from "@/components/animations/FadeIn"
import { BlurFade } from "@/components/animations/BlurFade"
import { SpotlightCard } from "@/components/animations/SpotlightCard"
import { AnimatedNumber } from "@/components/animations/AnimatedNumber"
import { DecryptedText } from "@/components/animations/DecryptedText"
import Link from "next/link"
import { ShieldCheck, TrendingUp, Users, ArrowRight, Zap, Globe } from "lucide-react"
import { getSiteSettings } from "@/lib/data"
import { Magnetic } from "@/components/animations/Magnetic"
import { HeroBackground } from "@/components/animations/HeroBackground"
import { StaggerText } from "@/components/animations/StaggerText"
import { TiltCard } from "@/components/animations/TiltCard"

import { InteractiveGrid } from "@/components/animations/InteractiveGrid"

export default async function Home() {
  const settings = await getSiteSettings()
  
  const parseValue = (val: string) => parseFloat(val.replace(/[^0-9.]/g, '')) || 0
  const getSuffix = (val: string) => val.replace(/[0-9.]/g, '')

  return (
    <div className="flex flex-col bg-background">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20 group">
        <HeroBackground />
        <InteractiveGrid warp={true} opacity={0.2} />

        <div className="container relative z-10 text-center">
          <FadeIn>
            <div className="inline-flex items-center space-x-3 bg-secondary/50 border border-border px-6 py-2 rounded-full mb-10 backdrop-blur-md hover:border-primary/50 transition-colors cursor-default">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
              </span>
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-500">
                Engineering Financial Legacies Since 1993
              </span>
            </div>
          </FadeIn>
          
          <div className="mb-8">
            <div className="flex flex-col items-center">
              <FadeIn delay={0.2}>
                <span className="block italic opacity-40 text-2xl sm:text-4xl md:text-6xl mb-2 tracking-normal font-medium">Precision.</span>
              </FadeIn>
              <h1 className="text-4xl sm:text-6xl md:text-[9rem] font-black tracking-tighter leading-none text-center">
                <StaggerText 
                  text="WEALTH ARCHITECTS" 
                  className="text-foreground"
                />
              </h1>
            </div>
          </div>
          
          <FadeIn delay={0.4}>
            <p className="mx-auto max-w-2xl text-lg md:text-2xl text-muted-foreground mb-14 font-medium leading-relaxed tracking-tight">
              We leverage thirty years of quantitative expertise to build 
              <span className="text-foreground italic"> unbreakable </span> 
              financial structures for families who demand absolute certainty.
            </p>
          </FadeIn>
          
          <FadeIn delay={0.6} className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Magnetic>
              <Button size="lg" className="h-16 px-12 rounded-full bg-blue-600 text-white hover:bg-blue-500 font-black text-xl transition-all hover:scale-105 hover:shadow-[0_0_40px_rgba(37,99,235,0.4)] active:scale-95 group border-none" asChild>
                <Link href="/contact">
                  Initialize Consultation
                  <ArrowRight className="ml-3 h-6 w-6 transition-transform group-hover:translate-x-2" />
                </Link>
              </Button>
            </Magnetic>
            <Magnetic>
              <Button size="lg" variant="outline" className="h-16 px-10 rounded-full border-border hover:bg-secondary font-bold text-lg" asChild>
                <Link href="/resources">Get Access</Link>
              </Button>
            </Magnetic>
          </FadeIn>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center space-y-4 opacity-30">
          <div className="w-[1px] h-20 bg-gradient-to-b from-foreground to-transparent" />
        </div>
      </section>

      {/* Stats Section */}
      {settings.showStats && (
        <section className="py-32 relative bg-secondary/30 border-y border-border overflow-hidden">
          <div className="container relative z-10">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-16">
              {[
                { label: "Years Experience", value: parseValue(settings.yearsExperience), suffix: getSuffix(settings.yearsExperience), sub: "Since 1993" },
                { label: "Families Secured", value: parseValue(settings.clientsCount), suffix: getSuffix(settings.clientsCount), sub: "Global Reach" },
                { label: "Cr AUM", value: parseValue(settings.aum), suffix: getSuffix(settings.aum), sub: "Verified Assets" },
                { label: "Claim Success", value: parseValue(settings.claimSettlement), suffix: getSuffix(settings.claimSettlement), sub: "Settlement Ratio" },
              ].map((stat, i) => (
                <BlurFade key={i} delay={0.1 * i}>
                  <div className="flex flex-col items-center text-center">
                    <div className="text-5xl md:text-7xl font-black mb-2 tabular-nums">
                      <AnimatedNumber value={stat.value} />{stat.suffix}
                    </div>
                    <div className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-500 mb-1">{stat.label}</div>
                    <div className="text-[10px] text-muted-foreground uppercase tracking-widest">{stat.sub}</div>
                  </div>
                </BlurFade>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Feature Grid */}
      <section className="py-40 relative">
        <InteractiveGrid warp={false} opacity={0.1} />
        
        <div className="container relative z-10">
          <div className="max-w-4xl mb-32 mx-auto text-center">
            <FadeIn>
              <h2 className="text-3xl sm:text-5xl md:text-8xl font-black tracking-tighter mb-8 uppercase italic leading-none">
                The <span className="text-blue-500">Methodology.</span>
              </h2>
              <p className="text-muted-foreground text-lg sm:text-xl md:text-3xl font-medium leading-tight">
                A multi-layered approach to wealth and protection, engineered for resilience in volatile markets.
              </p>
            </FadeIn>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <SpotlightCard className="h-full" showAurora={true} auroraColor="rgba(37, 99, 235, 0.2)">
                <TrendingUp className="h-12 w-12 text-blue-500 mb-8" />
                <h3 className="text-4xl font-black mb-6 uppercase">Quantum Growth</h3>
                <p className="text-muted-foreground text-xl leading-relaxed mb-10">
                  Our investment engine utilizes historical data and predictive modeling to select high-alpha Mutual Funds and tax-efficient structures that beat inflation systematically.
                </p>
                <div className="flex flex-wrap gap-4">
                  {["Mutual Funds", "Fixed Deposits", "Tax Engineering"].map(tag => (
                    <span key={tag} className="px-4 py-2 bg-secondary rounded-full text-xs font-bold border border-border">{tag}</span>
                  ))}
                </div>
              </SpotlightCard>
            </div>

            <SpotlightCard spotlightColor="rgba(168, 85, 247, 0.15)" className="h-full" showAurora={true} auroraColor="rgba(168, 85, 247, 0.15)">
              <ShieldCheck className="h-12 w-12 text-purple-500 mb-8" />
              <h3 className="text-4xl font-black mb-6 uppercase">Iron Shield</h3>
              <p className="text-muted-foreground text-lg leading-relaxed mb-10">
                Total asset protection through optimized Health, Life, and Motor insurance architectures.
              </p>
              <Button variant="link" className="text-purple-400 p-0 h-auto font-black italic text-lg hover:text-purple-600" asChild>
                <Link href="/services#insurance">Protocol Details &rarr;</Link>
              </Button>
            </SpotlightCard>

            <SpotlightCard spotlightColor="rgba(34, 197, 94, 0.15)" className="h-full" showAurora={true} auroraColor="rgba(34, 197, 94, 0.15)">
              <Users className="h-12 w-12 text-green-500 mb-8" />
              <h3 className="text-4xl font-black mb-6 uppercase">Legacy Desk</h3>
              <p className="text-muted-foreground text-lg leading-relaxed">
                Direct access to senior partners for complex estate planning and multi-generational wealth transfer.
              </p>
            </SpotlightCard>

            <div className="md:col-span-2">
              <SpotlightCard className="h-full" spotlightColor="rgba(234, 179, 8, 0.15)" showAurora={true} auroraColor="rgba(234, 179, 8, 0.15)">
                <Globe className="h-12 w-12 text-yellow-500 mb-8" />
                <h3 className="text-4xl font-black mb-6 uppercase">Scale Intelligence</h3>
                <p className="text-muted-foreground text-xl leading-relaxed mb-10">
                  We leverage our extensive network across 5,000+ families to provide insights that solo investors simply cannot access.
                </p>
                <div className="h-px bg-border w-full mb-8" />
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground">Verified Strategy 2026</span>
                  <div className="flex -space-x-4">
                    {[1,2,3,4].map(i => (
                      <div key={i} className="h-10 w-10 rounded-full border-2 border-background bg-secondary" />
                    ))}
                  </div>
                </div>
              </SpotlightCard>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-40 relative px-6">
        <div className="container relative z-10 max-w-6xl mx-auto">
          <TiltCard>
            <div className="bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-900 rounded-[3rem] md:rounded-[4rem] p-12 md:p-32 text-center relative overflow-hidden shadow-2xl group">
              {/* Dynamic Aurora Overlay - pointer-events-none is crucial */}
              <div className="absolute inset-0 opacity-40 group-hover:opacity-60 transition-opacity duration-1000 pointer-events-none">
                <div className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] animate-[spin_30s_linear_infinite] bg-[conic-gradient(from_0deg,transparent,rgba(255,255,255,0.1),transparent,rgba(37,99,235,0.2),transparent,rgba(168,85,247,0.2),transparent)]" />
              </div>
              
              <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-30 mix-blend-overlay pointer-events-none" />
              
              {/* Content wrapped in a z-index container to stay above aurora */}
              <div className="relative z-20">
                <FadeIn>
                  <h2 className="text-3xl sm:text-4xl md:text-8xl font-black tracking-tighter text-white mb-10 leading-none uppercase italic">
                    SECURE YOUR <br /> LEGACY TODAY.
                  </h2>
                  <p className="text-blue-50 text-base sm:text-lg md:text-2xl mb-14 max-w-2xl mx-auto font-medium">
                    The best time to engineer your future was thirty years ago. The second best time is now.
                  </p>
                  <div className="flex justify-center">
                    <Button size="lg" className="h-16 md:h-20 px-10 md:px-16 rounded-full bg-white text-blue-600 hover:bg-blue-50 font-black text-xl md:text-2xl transition-all hover:scale-110 shadow-2xl border-none cursor-pointer relative z-30" asChild>
                      <Link href="/contact">Get Started</Link>
                    </Button>
                  </div>
                </FadeIn>
              </div>
            </div>
          </TiltCard>
        </div>
      </section>
    </div>
  )
}
