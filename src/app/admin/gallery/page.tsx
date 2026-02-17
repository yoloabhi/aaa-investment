import db from "@/lib/db"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Plus, Edit, Trash, ImageIcon } from "lucide-react"
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
import { deleteGalleryItem } from "./actions"

export default async function AdminGalleryPage() {
  const items = await db.galleryItem.findMany({
    orderBy: [{ featured: 'desc' }, { order: 'asc' }],
  })

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Gallery</h1>
          <p className="text-muted-foreground">Manage awards, events, and office photos.</p>
        </div>
        <Button asChild>
          <Link href="/admin/gallery/new"><Plus className="mr-2 h-4 w-4" /> Add Item</Link>
        </Button>
      </div>

      <div className="bg-white border rounded-xl overflow-hidden shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[120px]">Preview</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item) => (
              <TableRow key={item.id}>
                <TableCell>
                  <div className="relative h-16 w-24 rounded-md overflow-hidden bg-slate-100 border">
                    <Image 
                      src={item.url} 
                      alt={item.title} 
                      fill 
                      className="object-cover"
                    />
                  </div>
                </TableCell>
                <TableCell>
                  <div className="font-medium">{item.title}</div>
                  {item.featured && (
                    <span className="text-[10px] bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded font-bold uppercase">Featured</span>
                  )}
                </TableCell>
                <TableCell className="text-sm">{item.category}</TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${
                    item.published ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {item.published ? 'Live' : 'Hidden'}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end space-x-2">
                    <Button variant="ghost" size="icon" asChild>
                      <Link href={`/admin/gallery/edit/${item.id}`}><Edit className="h-4 w-4" /></Link>
                    </Button>
                    <DeleteButton id={item.id} onDelete={deleteGalleryItem} />
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {items.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-10 text-muted-foreground">
                  No gallery items added yet.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
