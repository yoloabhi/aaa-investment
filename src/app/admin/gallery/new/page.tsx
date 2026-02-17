import { GalleryForm } from "@/components/admin/GalleryForm"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ChevronLeft } from "lucide-react"

export default function NewGalleryItemPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/admin/gallery"><ChevronLeft className="h-5 w-5" /></Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Add Gallery Item</h1>
          <p className="text-muted-foreground">Upload a new photo to the public gallery.</p>
        </div>
      </div>

      <GalleryForm />
    </div>
  )
}
