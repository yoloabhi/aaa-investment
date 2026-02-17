import { FadeIn } from "@/components/animations/FadeIn"
import { BlurFade } from "@/components/animations/BlurFade"
import { getTeamMembers } from "@/lib/data"
import Image from "next/image"

export const dynamic = 'force-dynamic'

export const metadata = {
  title: "About Us | AAA Investment & Insurance",
}

export default async function AboutPage() {
  const teamMembers = await getTeamMembers()

  return (
    <div className="flex flex-col pt-32 pb-24 bg-background">
      <section className="container mb-32">
        <div className="max-w-4xl mx-auto text-center">
          <FadeIn>
            <h1 className="text-3xl sm:text-5xl md:text-7xl font-black tracking-tighter mb-10 leading-none">
              THIRTY YEARS OF <br />
              <span className="text-primary italic">UNWAVERING TRUST.</span>
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed font-medium">
              Founded in 1993, AAA Investment & Insurance has evolved from a local consultancy into a premier financial engineering firm. We serve over 5,000 families with a commitment to mathematical precision and absolute transparency.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Grid Section */}
      <section className="container mb-40">
        <div className="grid md:grid-cols-2 gap-8">
          <BlurFade className="bg-secondary/50 border border-border rounded-[3rem] p-12 flex flex-col justify-center">
            <h2 className="text-3xl font-black mb-6 uppercase tracking-tight">Our Philosophy</h2>
            <p className="text-muted-foreground leading-relaxed text-lg">
              We treat capital with the respect it deserves. Our approach combines traditional values of safety with modern quantitative analysis, ensuring your legacy is protected and your growth is optimized.
            </p>
          </BlurFade>
          <BlurFade delay={0.2} className="relative aspect-[4/3] rounded-[3rem] overflow-hidden border border-border">
            <Image 
              src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1000" 
              alt="Architecture" 
              fill 
              className="object-cover grayscale hover:grayscale-0 transition-all duration-1000"
            />
          </BlurFade>
        </div>
      </section>

      {/* Team */}
      <section className="container">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-4">
          <h2 className="text-4xl font-black uppercase">The Principals</h2>
          <p className="text-muted-foreground font-bold tracking-widest uppercase text-sm">Expertise at scale</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {teamMembers.map((member: any, i: number) => (
            <BlurFade key={member.id} delay={0.1 * i}>
              <div className="group relative">
                <div className="relative aspect-[3/4] rounded-3xl overflow-hidden mb-8 border border-border bg-secondary/30">
                  <Image 
                    src={member.photoUrl} 
                    alt={member.name} 
                    fill 
                    className="object-cover transition-transform duration-700 group-hover:scale-110 grayscale group-hover:grayscale-0"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-8 flex flex-col justify-end">
                    <p className="text-white text-sm leading-relaxed">{member.bio}</p>
                  </div>
                </div>
                <h3 className="text-2xl font-black mb-1">{member.name}</h3>
                <p className="text-primary text-xs font-black uppercase tracking-[0.2em]">{member.roleTitle}</p>
              </div>
            </BlurFade>
          ))}
        </div>
      </section>
    </div>
  )
}
