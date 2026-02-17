import db from "@/lib/db"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Plus, Edit, User } from "lucide-react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import Image from "next/image"
import { DeleteButton } from "@/components/admin/DeleteButton"
import { deleteTeamMember } from "./actions"

export default async function AdminTeamPage() {
  const members = await db.teamMember.findMany({
    orderBy: { order: 'asc' },
  })

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Team Management</h1>
          <p className="text-muted-foreground">Manage the principals and experts shown on the About page.</p>
        </div>
        <Button asChild>
          <Link href="/admin/team/new"><Plus className="mr-2 h-4 w-4" /> Add Member</Link>
        </Button>
      </div>

      <div className="bg-white border rounded-xl overflow-hidden shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">Photo</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {members.map((member) => (
              <TableRow key={member.id}>
                <TableCell>
                  <div className="relative h-10 w-10 rounded-full overflow-hidden bg-slate-100 border">
                    {member.photoUrl ? (
                      <Image 
                        src={member.photoUrl} 
                        alt={member.name} 
                        fill 
                        className="object-cover"
                      />
                    ) : (
                      <User className="h-6 w-6 m-2 text-slate-400" />
                    )}
                  </div>
                </TableCell>
                <TableCell className="font-medium">{member.name}</TableCell>
                <TableCell className="text-sm">{member.roleTitle}</TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${
                    member.published ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {member.published ? 'Live' : 'Hidden'}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end space-x-2">
                    <Button variant="ghost" size="icon" asChild>
                      <Link href={`/admin/team/edit/${member.id}`}><Edit className="h-4 w-4" /></Link>
                    </Button>
                    <DeleteButton id={member.id} onDelete={deleteTeamMember} />
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {members.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-10 text-muted-foreground">
                  No team members added yet.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
