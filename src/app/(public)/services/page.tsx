import { Button } from "@/components/ui/button"
import { FadeIn } from "@/components/animations/FadeIn"
import { BlurFade } from "@/components/animations/BlurFade"
import { TrendingUp, ShieldCheck, PieChart, Landmark, ArrowRight } from "lucide-react"
import { SpotlightCard } from "@/components/animations/SpotlightCard"
import Link from "next/link"

export const metadata = {
  title: "Protocols | AAA Investment & Insurance",
}

const services = [
  {
    id: "investments",
    title: "WEALTH ENGINEERING",
    icon: <TrendingUp className="h-12 w-12 text-blue-500" />,
    description: "Quantitative investment structures designed for consistent alpha generation and long-term capital preservation.",
    items: [
      { name: "Mutual Funds", detail: "Multi-layered selection process across equity and debt verticals." },
      { name: "Fixed Deposits", detail: "High-yield corporate and banking structures with maximum safety." },
      { name: "Post Office Savings", detail: "Sovereign-backed savings for low-risk portfolios." },
      { name: "Tax Optimization", detail: "Strategic tax planning to maximize your take-home returns." },
    ]
  },
  {
    id: "insurance",
    title: "RISK ARCHITECTURE",
    icon: <ShieldCheck className="h-12 w-12 text-purple-500" />,
    description: "Bulletproof protection for your life and assets using industry-leading underwriting and claim protocols.",
    items: [
      { name: "Health Protection", detail: "Global coverage with zero co-pay and priority hospitalization." },
      { name: "Life Security", detail: "High-sum assured term plans for total family protection." },
      { name: "Asset Insurance", detail: "Comprehensive motor and household cover with 24/7 support." },
      { name: "Priority Claims", detail: "Dedicated support team for end-to-end claim settlement." },
    ]
  }
]

export default function ServicesPage() {
  return (
    <div className="flex flex-col pt-32">
      <section className="container mb-32">
        <div className="max-w-4xl mx-auto text-center">
          <FadeIn>
            <h1 className="text-3xl sm:text-5xl md:text-8xl font-black tracking-tighter mb-8 leading-none">
              SYSTEM <br />
              <span className="text-primary italic">PROTOCOLS.</span>
            </h1>
            <p className="text-xl text-foreground/50 leading-relaxed max-w-2xl mx-auto font-medium">
              We translate market complexity into precise financial outcomes. Our services are categorized into two core pillars: Growth and Protection.
            </p>
          </FadeIn>
        </div>
      </section>

      <section className="container mb-40">
        <div className="space-y-40">
          {services.map((service, index) => (
            <div key={service.id} id={service.id} className="grid lg:grid-cols-2 gap-20 items-center">
              <FadeIn className={index % 2 === 1 ? 'lg:order-last' : ''}>
                <div className="mb-10 p-4 bg-secondary rounded-2xl w-fit border border-border">{service.icon}</div>
                <h2 className="text-4xl md:text-6xl font-black mb-8 tracking-tighter uppercase">{service.title}</h2>
                <p className="text-xl text-foreground/40 mb-12 leading-relaxed font-medium">{service.description}</p>
                <Button size="lg" className="rounded-full px-8 h-14 font-black bg-primary text-primary-foreground" asChild>
                  <Link href="/contact">DEPLOY STRATEGY <ArrowRight className="ml-2 h-5 w-5" /></Link>
                </Button>
              </FadeIn>

              <div className="grid sm:grid-cols-2 gap-6">
                {service.items.map((item, i) => (
                  <BlurFade key={item.name} delay={0.1 * i}>
                    <SpotlightCard className="p-8 h-full rounded-[2rem] bg-secondary/50 border-border">
                      <h3 className="text-xl font-black mb-3 uppercase tracking-tight">{item.name}</h3>
                      <p className="text-sm text-foreground/40 leading-relaxed font-medium">{item.detail}</p>
                    </SpotlightCard>
                  </BlurFade>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="py-32 bg-secondary/30 border-y border-border mb-24">
        <div className="container text-center">
          <h2 className="text-3xl md:text-5xl font-black mb-20 uppercase tracking-tighter">THE AAA EDGE</h2>
          <div className="grid md:grid-cols-3 gap-16">
            {[
              { icon: <Landmark className="h-12 w-12 text-primary mx-auto" />, title: "Zero-Bias Architecture", desc: "We operate with absolute independence, selecting from 100+ providers to find your optimal fit." },
              { icon: <PieChart className="h-12 w-12 text-primary mx-auto" />, title: "Quant Planning", desc: "Every recommendation is backed by decades of back-tested data and goal-focused modeling." },
              { icon: <ShieldCheck className="h-12 w-12 text-primary mx-auto" />, title: "Claim Execution", desc: "We don't just sell policies. We manage the entire lifecycle, ensuring 99.1% settlement success." }
            ].map((feature, i) => (
              <div key={i} className="space-y-6">
                {feature.icon}
                <h3 className="text-2xl font-black uppercase tracking-tight">{feature.title}</h3>
                <p className="text-foreground/40 leading-relaxed font-medium">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
