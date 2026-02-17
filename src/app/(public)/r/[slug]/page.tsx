import db from "@/lib/db"
import { notFound } from "next/navigation"
import Image from "next/image"
import { ResourceLeadForm } from "@/components/forms/ResourceLeadForm"
import { CheckCircle2 } from "lucide-react"

export default async function ResourceLandingPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const resource = await db.resource.findUnique({
    where: { slug }
  })

  if (!resource || !resource.published) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-background pt-32 pb-24">
      <div className="container px-4">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <div className="inline-block bg-primary/10 text-primary px-4 py-1 rounded-full text-xs font-black uppercase tracking-widest mb-6 border border-primary/20 backdrop-blur-sm">
              Free Financial Resource
            </div>
            <h1 className="text-4xl md:text-6xl font-black tracking-tighter mb-8 leading-none uppercase italic">
              {resource.title}
            </h1>
            <p className="text-xl text-muted-foreground mb-12 font-medium">
              {resource.description}
            </p>

            <div className="space-y-6 mb-12">
              {[
                "Expert strategies verified by consultants",
                "Concise and actionable advice",
                "Up-to-date with 2026 tax laws",
                "100% Free - no hidden costs"
              ].map((text) => (
                <div key={text} className="flex items-center space-x-3">
                  <div className="h-6 w-6 rounded-full bg-green-500/10 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                  </div>
                  <span className="font-bold text-sm uppercase tracking-tight text-foreground/70">{text}</span>
                </div>
              ))}
            </div>

            {resource.coverUrl && (
              <div className="relative w-64 aspect-[3/4] rounded-[2rem] overflow-hidden shadow-2xl border border-border rotate-3 hover:rotate-0 transition-transform duration-500 group">
                <Image src={resource.coverUrl} alt={resource.title} fill className="object-cover transition-transform duration-700 group-hover:scale-110" />
              </div>
            )}
          </div>

          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-[3rem] blur opacity-20 group-hover:opacity-30 transition duration-1000"></div>
            <div className="relative bg-secondary/30 backdrop-blur-xl p-8 md:p-12 rounded-[3rem] border border-border shadow-2xl">
              <h2 className="text-2xl font-black uppercase tracking-tighter mb-2 italic">Instant Access</h2>
              <p className="text-muted-foreground mb-10 text-sm font-medium">Enter your details to receive the encrypted download link.</p>
              <ResourceLeadForm resourceSlug={resource.slug} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
