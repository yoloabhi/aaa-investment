import db from "@/lib/db"
import { notFound } from "next/navigation"
import { ResourceForm } from "@/components/admin/ResourceForm"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ChevronLeft } from "lucide-react"

export default async function EditResourcePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const resource = await db.resource.findUnique({
    where: { id }
  })

  if (!resource) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/admin/resources"><ChevronLeft className="h-5 w-5" /></Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Edit Resource</h1>
          <p className="text-muted-foreground">Modify the details of {resource.title}.</p>
        </div>
      </div>

      <ResourceForm initialData={resource} />
    </div>
  )
}
