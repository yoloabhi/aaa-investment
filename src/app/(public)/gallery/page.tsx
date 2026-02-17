import { FadeIn } from "@/components/animations/FadeIn"
import { getGalleryItems } from "@/lib/data"
import { GalleryGrid } from "@/components/gallery/GalleryGrid"

export const dynamic = 'force-dynamic'

export const metadata = {
  title: "Gallery | AAA Investment & Insurance",
}

export default async function GalleryPage() {
  const items = await getGalleryItems()

  return (
    <div className="pt-32 pb-24 bg-background">
      <div className="container text-center mb-24">
        <FadeIn>
          <div className="inline-flex items-center space-x-3 bg-secondary/50 border border-border px-6 py-2 rounded-full mb-8 backdrop-blur-md">
            <span className="relative flex h-2 w-2">
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-500">
              Visual Archives
            </span>
          </div>
          <h1 className="text-6xl md:text-[8rem] font-black tracking-tighter mb-8 uppercase italic leading-none">Milestones</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto text-xl font-medium leading-relaxed">
            Thirty years of excellence, documented. A collection of awards, events, and the community we&apos;ve built since 1993.
          </p>
        </FadeIn>
      </div>

      <div className="container">
        <GalleryGrid items={items} />
      </div>
    </div>
  )
}
