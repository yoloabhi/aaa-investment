import { ResourceForm } from "@/components/admin/ResourceForm"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ChevronLeft } from "lucide-react"

export default function NewResourcePage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/admin/resources"><ChevronLeft className="h-5 w-5" /></Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">New Resource</h1>
          <p className="text-muted-foreground">Add a new gated PDF or lead magnet.</p>
        </div>
      </div>

      <ResourceForm />
    </div>
  )
}
