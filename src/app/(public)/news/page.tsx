import { FadeIn } from "@/components/animations/FadeIn"
import { BlurFade } from "@/components/animations/BlurFade"
import { getPosts } from "@/lib/data"
import Link from "next/link"
import Image from "next/image"
import { formatDate } from "@/lib/utils"

export const dynamic = 'force-dynamic'

export const metadata = {
  title: "Insights | AAA Investment & Insurance",
}

export default async function NewsPage() {
  const posts = await getPosts()

  return (
    <div className="pt-32 pb-24 bg-background">
      <div className="container mb-24">
        <FadeIn>
          <div className="flex flex-col md:flex-row justify-between items-end gap-8 border-b border-border pb-16">
            <h1 className="text-3xl sm:text-5xl md:text-8xl font-black tracking-tighter uppercase leading-none">
              Financial <br />
              <span className="text-primary">Intelligence.</span>
            </h1>
            <p className="max-w-md text-muted-foreground text-base sm:text-lg font-medium">
              Deep dives into market dynamics, risk architecture, and the future of wealth management.
            </p>
          </div>
        </FadeIn>
      </div>

      <div className="container grid gap-12 md:grid-cols-2 lg:grid-cols-3">
        {posts.map((post: any, i: number) => (
          <BlurFade key={post.id} delay={0.1 * i}>
            <Link href={`/news/${post.slug}`} className="group block">
              <article className="space-y-6">
                <div className="relative aspect-[16/10] rounded-[2rem] overflow-hidden bg-secondary/30 border border-border">
                  {post.coverUrl ? (
                    <Image 
                      src={post.coverUrl} 
                      alt={post.title} 
                      fill 
                      className="object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105" 
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground/20 font-black text-4xl italic">AAA</div>
                  )}
                </div>
                <div className="px-2">
                  <div className="flex items-center space-x-3 text-[10px] font-black uppercase tracking-widest text-primary mb-4">
                    <span>{formatDate(post.createdAt)}</span>
                    <div className="h-1 w-1 rounded-full bg-border" />
                    <span>8 Min Read</span>
                  </div>
                  <h2 className="text-2xl font-black mb-4 group-hover:text-primary transition-colors leading-tight uppercase tracking-tighter">
                    {post.title}
                  </h2>
                  <p className="text-muted-foreground text-sm line-clamp-3 leading-relaxed">
                    {post.excerpt}
                  </p>
                </div>
              </article>
            </Link>
          </BlurFade>
        ))}
      </div>
    </div>
  )
}
