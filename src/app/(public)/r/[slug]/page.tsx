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
    <div className="min-h-screen bg-slate-50">
      <div className="container px-4 py-16 lg:py-24">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <div className="inline-block bg-blue-100 text-blue-700 px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest mb-6">
              Free Financial Resource
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-8 leading-tight">
              {resource.title}
            </h1>
            <p className="text-xl text-muted-foreground mb-12">
              {resource.description}
            </p>

            <div className="space-y-6">
              {[
                "Expert strategies verified by consultants",
                "Concise and actionable advice",
                "Up-to-date with 2026 tax laws",
                "100% Free - no hidden costs"
              ].map((text) => (
                <div key={text} className="flex items-center space-x-3">
                  <CheckCircle2 className="h-6 w-6 text-green-500" />
                  <span className="font-medium">{text}</span>
                </div>
              ))}
            </div>

            {resource.coverUrl && (
              <div className="mt-12 relative w-64 aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl border-4 border-white rotate-3 hover:rotate-0 transition-transform duration-500">
                <Image src={resource.coverUrl} alt={resource.title} fill className="object-cover" />
              </div>
            )}
          </div>

          <div className="bg-white p-8 md:p-12 rounded-3xl shadow-2xl border">
            <h2 className="text-2xl font-bold mb-2">Instant Access</h2>
            <p className="text-muted-foreground mb-8">Enter your details to receive the download link.</p>
            <ResourceLeadForm resourceSlug={resource.slug} />
          </div>
        </div>
      </div>
    </div>
  )
}
