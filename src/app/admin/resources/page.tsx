import db from "@/lib/db"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Plus, Edit, FileDown, Trash2 } from "lucide-react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { DeleteButton } from "@/components/admin/DeleteButton"
import { deleteResource } from "./actions"

export default async function AdminResourcesPage() {
  const resources = await db.resource.findMany({
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Lead Magnets</h1>
          <p className="text-muted-foreground">Manage PDFs and gated content downloads.</p>
        </div>
        <Button asChild>
          <Link href="/admin/resources/new"><Plus className="mr-2 h-4 w-4" /> New Resource</Link>
        </Button>
      </div>

      <div className="bg-white border rounded-xl overflow-hidden shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {resources.map((res) => (
              <TableRow key={res.id}>
                <TableCell className="font-medium">{res.title}</TableCell>
                <TableCell className="text-xs text-muted-foreground">/r/{res.slug}</TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${
                    res.published ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {res.published ? 'Live' : 'Hidden'}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button variant="ghost" size="icon" asChild>
                      <Link href={`/admin/resources/edit/${res.id}`}><Edit className="h-4 w-4" /></Link>
                    </Button>
                    <Button variant="ghost" size="icon" asChild>
                      <a href={res.pdfUrl} target="_blank" rel="noreferrer"><FileDown className="h-4 w-4" /></a>
                    </Button>
                    <DeleteButton id={res.id} onDelete={deleteResource} />
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {resources.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-10 text-muted-foreground">
                  No resources created yet.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
