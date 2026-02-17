'use client'

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Loader2, Save, ImageIcon } from "lucide-react"
import { createGalleryItem, updateGalleryItem } from "@/app/admin/gallery/actions"
import { CloudinaryUpload } from "./CloudinaryUpload"
import { useRouter } from "next/navigation"
import Image from "next/image"

const galleryItemSchema = z.object({
  title: z.string().min(1, "Title is required"),
  alt: z.string().optional(),
  category: z.string().min(1, "Category is required"),
  eventMonth: z.string().optional().nullable(),
  eventYear: z.string().optional().nullable(),
  featured: z.boolean().default(false),
  order: z.number().int().default(0),
  published: z.boolean().default(true),
  url: z.string().min(1, "Image is required"),
  cloudinaryPublicId: z.string().min(1, "Public ID is required"),
})

type GalleryValues = z.infer<typeof galleryItemSchema>

interface GalleryFormProps {
  initialData?: {
    id: string
    title: string
    alt?: string | null
    category: string
    eventMonth?: string | null
    eventYear?: string | null
    featured?: boolean
    order?: number
    published?: boolean
    url: string
    cloudinaryPublicId: string
  }
}

export function GalleryForm({ initialData }: GalleryFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const form = useForm<any>({
    resolver: zodResolver(galleryItemSchema),
    defaultValues: initialData ? {
      ...initialData,
      alt: initialData.alt || "",
      eventMonth: initialData.eventMonth || "",
      eventYear: initialData.eventYear || "",
    } : {
      title: "",
      alt: "",
      category: "Events",
      eventMonth: "",
      eventYear: "",
      featured: false,
      order: 0,
      published: true,
      url: "",
      cloudinaryPublicId: "",
    },
  })

  const url = form.watch("url")

  const onSubmit = async (data: GalleryValues) => {
    setIsSubmitting(true)
    setError(null)
    
    const result = initialData 
      ? await updateGalleryItem(initialData.id, data)
      : await createGalleryItem(data)
    
    setIsSubmitting(false)

    if (result.success) {
      router.push("/admin/gallery")
    } else {
      setError(result.error || "Something went wrong")
    }
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Image Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Title</label>
                <Input {...form.register("title")} placeholder="e.g. Excellence Award 2025" />
                {form.formState.errors.title && <p className="text-red-500 text-xs">{form.formState.errors.title.message as string}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Alt Text (Accessibility)</label>
                <Input {...form.register("alt")} placeholder="Describe the image content" />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Category</label>
                <select 
                  {...form.register("category")}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  <option value="Events">Events</option>
                  <option value="Awards">Awards</option>
                  <option value="Office">Office</option>
                  <option value="Team">Team</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Event Month</label>
                  <select 
                    {...form.register("eventMonth")}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  >
                    <option value="">N/A</option>
                    {["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"].map(m => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Event Year</label>
                  <Input {...form.register("eventYear")} placeholder="e.g. 2025" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Configuration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Display Order</label>
                  <Input 
                    type="number" 
                    {...form.register("order", { valueAsNumber: true })} 
                  />
                </div>
                <div className="flex flex-col space-y-4 justify-center">
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="featured" {...form.register("featured")} />
                    <label htmlFor="featured" className="text-sm font-medium">Featured Item</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="published" {...form.register("published")} />
                    <label htmlFor="published" className="text-sm font-medium">Published / Live</label>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Photo</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-center">
              <div className="relative aspect-video rounded-lg overflow-hidden bg-slate-100 border-2 border-dashed border-slate-300 flex items-center justify-center">
                {url ? (
                  <Image src={url} alt="Preview" fill className="object-cover" />
                ) : (
                  <div className="flex flex-col items-center text-slate-400">
                    <ImageIcon className="h-12 w-12 mb-2" />
                    <p className="text-xs">No image uploaded</p>
                  </div>
                )}
              </div>
              
              <CloudinaryUpload 
                onUpload={(uploadedUrl, publicId) => {
                  form.setValue("url", uploadedUrl);
                  form.setValue("cloudinaryPublicId", publicId);
                }} 
                folder="aaa-gallery"
              />
              {form.formState.errors.url && <p className="text-red-500 text-xs">{form.formState.errors.url.message as string}</p>}
            </CardContent>
          </Card>

          {error && (
            <div className="p-4 bg-red-50 border border-red-200 text-red-800 rounded-lg text-sm">
              {error}
            </div>
          )}

          <Button type="submit" className="w-full h-12" disabled={isSubmitting}>
            {isSubmitting ? (
              <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</>
            ) : (
              <><Save className="mr-2 h-4 w-4" /> {initialData ? "Update Item" : "Add Item"}</>
            )}
          </Button>
        </div>
      </div>
    </form>
  )
}
