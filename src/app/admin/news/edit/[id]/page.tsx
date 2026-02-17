import db from "@/lib/db"
import { notFound } from "next/navigation"
import { NewsForm } from "@/components/admin/NewsForm"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ChevronLeft } from "lucide-react"

export default async function EditNewsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const post = await db.post.findUnique({
    where: { id }
  })

  if (!post) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/admin/news"><ChevronLeft className="h-5 w-5" /></Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Edit Post</h1>
          <p className="text-muted-foreground">Modify the content or settings of the post.</p>
        </div>
      </div>

      <NewsForm initialData={post} />
    </div>
  )
}
