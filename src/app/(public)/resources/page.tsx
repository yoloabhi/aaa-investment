import { FadeIn } from "@/components/animations/FadeIn"
import { BlurFade } from "@/components/animations/BlurFade"
import { getResources } from "@/lib/data"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ArrowUpRight } from "lucide-react"

export const dynamic = 'force-dynamic'

export const metadata = {
  title: "Resources | AAA Investment & Insurance",
}

export default async function ResourcesPage() {
  const resources = await getResources()

  return (
    <div className="pt-32 pb-24 bg-background">
      <div className="container text-center mb-32">
        <FadeIn>
          <div className="inline-block bg-primary/10 border border-primary/20 px-6 py-2 rounded-full text-primary text-xs font-black uppercase tracking-widest mb-8 backdrop-blur-sm">
            Knowledge Base
          </div>
          <h1 className="text-3xl sm:text-5xl md:text-8xl font-black tracking-tighter mb-8 leading-[0.8]">
            FREE <span className="italic">STRATEGY</span> <br /> DOCUMENTS
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg md:text-xl font-medium">
            Proprietary research and tactical guides for navigating high-stakes investment and insurance landscapes.
          </p>
        </FadeIn>
      </div>

      <div className="container grid gap-16 md:grid-cols-2">
        {resources.map((resource: any, i: number) => (
          <BlurFade key={resource.id} delay={0.1 * i}>
            <div className="group relative flex flex-col bg-secondary/30 border border-border rounded-[3rem] p-10 hover:border-primary/40 transition-all duration-500">
              <div className="flex flex-col md:flex-row gap-10">
                {resource.coverUrl && (
                  <div className="relative w-full md:w-1/3 aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl border border-border">
                    <Image 
                      src={resource.coverUrl} 
                      alt={resource.title} 
                      fill 
                      className="object-cover grayscale group-hover:grayscale-0 transition-all duration-700" 
                    />
                  </div>
                )}
                <div className="flex-1 flex flex-col">
                  <h2 className="text-3xl font-black mb-6 leading-tight uppercase tracking-tighter">{resource.title}</h2>
                  <p className="text-muted-foreground text-sm mb-8 leading-relaxed flex-1">
                    {resource.description}
                  </p>
                  <Button asChild className="w-full h-14 rounded-2xl bg-primary text-primary-foreground hover:bg-primary/90 font-black text-lg group border-none">
                    <Link href={`/r/${resource.slug}`}>
                      Get Access 
                      <ArrowUpRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </BlurFade>
        ))}
      </div>
    </div>
  )
}
