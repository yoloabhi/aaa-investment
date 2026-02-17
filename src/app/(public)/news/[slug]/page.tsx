import db from "@/lib/db"
import { notFound } from "next/navigation"
import { formatDate } from "@/lib/utils"
import Image from "next/image"
import { marked } from "marked"
import DOMPurify from "isomorphic-dompurify"
import { Metadata } from "next"
import { ReadingProgress } from "@/components/animations/ReadingProgress"
import { BlurFade } from "@/components/animations/BlurFade"
import { FadeIn } from "@/components/animations/FadeIn"
import Link from "next/link"
import { ArrowLeft, Share2, Twitter, Linkedin, Facebook } from "lucide-react"

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = await db.post.findUnique({ where: { slug } })
  if (!post) return { title: 'Post Not Found' }
  return {
    title: `${post.title} | AAA Investment`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt || '',
      images: post.coverUrl ? [{ url: post.coverUrl }] : [],
    }
  }
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params
  const post = await db.post.findUnique({
    where: { slug }
  })

  if (!post || !post.published) {
    notFound()
  }

  const relatedPosts = await db.post.findMany({
    where: { 
      published: true,
      NOT: { id: post.id }
    },
    take: 3,
    orderBy: { createdAt: 'desc' }
  })

  const htmlContent = await marked.parse(post.markdownContent)
  const cleanHtml = DOMPurify.sanitize(htmlContent)

  return (
    <div className="bg-background min-h-screen">
      <ReadingProgress />
      
      {/* Article Header */}
      <header className="relative pt-40 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-secondary/30 -z-10" />
        <div className="container max-w-5xl">
          <FadeIn>
            <Link 
              href="/news" 
              className="inline-flex items-center text-xs font-black uppercase tracking-[0.3em] text-muted-foreground hover:text-primary transition-colors mb-12 group"
            >
              <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
              Back to Insights
            </Link>
            
            <div className="flex items-center space-x-3 text-[10px] font-black uppercase tracking-widest text-blue-500 mb-6">
              <span>Financial Intelligence</span>
              <div className="h-1 w-1 rounded-full bg-blue-500/50" />
              <span>{formatDate(post.createdAt)}</span>
            </div>
            
            <h1 className="text-4xl sm:text-6xl md:text-8xl font-black tracking-tighter mb-12 uppercase italic leading-[0.9]">
              {post.title}
            </h1>

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 border-t border-border pt-8">
              <div className="flex items-center space-x-4">
                <div className="h-12 w-12 rounded-full bg-primary flex items-center justify-center font-black text-primary-foreground">A</div>
                <div>
                  <div className="text-sm font-black uppercase tracking-widest">AAA Editorial</div>
                  <div className="text-xs text-muted-foreground font-medium italic">Quantitative Strategy Desk</div>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Share Protocol:</span>
                <div className="flex space-x-2">
                  {[Twitter, Linkedin, Facebook].map((Icon, i) => (
                    <button key={i} className="h-10 w-10 rounded-full border border-border flex items-center justify-center hover:bg-secondary transition-colors">
                      <Icon className="h-4 w-4" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </header>

      <div className="container max-w-5xl py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          <article className="lg:col-span-8">
            {post.coverUrl && (
              <BlurFade>
                <div className="relative aspect-[16/9] rounded-[3rem] overflow-hidden border border-border mb-16 shadow-2xl">
                  <Image 
                    src={post.coverUrl} 
                    alt={post.title} 
                    fill 
                    className="object-cover" 
                    priority
                  />
                </div>
              </BlurFade>
            )}

            <div 
              className="prose prose-slate dark:prose-invert lg:prose-xl max-w-none 
                prose-headings:font-black prose-headings:uppercase prose-headings:tracking-tighter
                prose-p:text-muted-foreground prose-p:leading-relaxed
                prose-a:text-blue-500 prose-a:no-underline hover:prose-a:underline
                prose-img:rounded-[2rem] prose-img:border prose-img:border-border
                prose-strong:text-foreground"
              dangerouslySetInnerHTML={{ __html: cleanHtml }}
            />
          </article>

          {/* Sidebar */}
          <aside className="lg:col-span-4 space-y-12">
            <div className="sticky top-32 space-y-12">
              <div className="p-8 rounded-[2rem] bg-secondary/30 border border-border">
                <h3 className="text-xs font-black uppercase tracking-[0.3em] text-blue-500 mb-6">Executive Summary</h3>
                <p className="text-sm text-muted-foreground leading-relaxed font-medium italic">
                  "{post.excerpt}"
                </p>
              </div>

              <div className="space-y-6">
                <h3 className="text-xs font-black uppercase tracking-[0.3em] text-foreground px-2">Related Intelligence</h3>
                <div className="space-y-4">
                  {relatedPosts.map(p => (
                    <Link key={p.id} href={`/news/${p.slug}`} className="block group">
                      <div className="p-4 rounded-2xl hover:bg-secondary/50 transition-colors border border-transparent hover:border-border">
                        <div className="text-[10px] font-black uppercase tracking-widest text-blue-500 mb-2">{formatDate(p.createdAt)}</div>
                        <h4 className="font-bold text-sm leading-tight uppercase group-hover:text-blue-500 transition-colors">{p.title}</h4>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}
