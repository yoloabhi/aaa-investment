import db from "@/lib/db"
import { notFound } from "next/navigation"
import { GalleryForm } from "@/components/admin/GalleryForm"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ChevronLeft } from "lucide-react"

export default async function EditGalleryItemPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const item = await db.galleryItem.findUnique({
    where: { id }
  })

  if (!item) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/admin/gallery"><ChevronLeft className="h-5 w-5" /></Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Edit Gallery Item</h1>
          <p className="text-muted-foreground">Modify the details of {item.title}.</p>
        </div>
      </div>

      <GalleryForm initialData={item} />
    </div>
  )
}
