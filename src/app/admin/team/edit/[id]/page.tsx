import db from "@/lib/db"
import { notFound } from "next/navigation"
import { TeamMemberForm } from "@/components/admin/TeamMemberForm"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ChevronLeft } from "lucide-react"

export default async function EditTeamMemberPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const member = await db.teamMember.findUnique({
    where: { id }
  })

  if (!member) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/admin/team"><ChevronLeft className="h-5 w-5" /></Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Edit Team Member</h1>
          <p className="text-muted-foreground">Modify the details of {member.name}.</p>
        </div>
      </div>

      <TeamMemberForm initialData={member} />
    </div>
  )
}
