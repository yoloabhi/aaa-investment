'use client'

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Loader2, Save, FileText, Image as ImageIcon, Link as LinkIcon } from "lucide-react"
import { createResource, updateResource } from "@/app/admin/resources/actions"
import { CloudinaryUpload } from "./CloudinaryUpload"
import { useRouter } from "next/navigation"
import Image from "next/image"

const resourceSchema = z.object({
  title: z.string().min(1, "Title is required"),
  slug: z.string().min(1, "Slug is required").regex(/^[a-z0-9-]+$/, "Slug must be lowercase with hyphens"),
  description: z.string().optional(),
  coverUrl: z.string().optional(),
  pdfUrl: z.string().min(1, "PDF is required"),
  pdfCloudinaryPublicId: z.string().min(1, "PDF public ID is required"),
  published: z.boolean().default(false),
  campaignTag: z.string().optional(),
})

type ResourceValues = z.infer<typeof resourceSchema>

interface ResourceFormProps {
  initialData?: {
    id: string
    title: string
    slug: string
    description?: string | null
    coverUrl?: string | null
    pdfUrl: string
    pdfCloudinaryPublicId: string
    published?: boolean
    campaignTag?: string | null
  }
}

export function ResourceForm({ initialData }: ResourceFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const form = useForm<any>({
    resolver: zodResolver(resourceSchema),
    defaultValues: initialData ? {
      ...initialData,
      description: initialData.description || "",
      coverUrl: initialData.coverUrl || "",
      campaignTag: initialData.campaignTag || "",
    } : {
      title: "",
      slug: "",
      description: "",
      coverUrl: "",
      pdfUrl: "",
      pdfCloudinaryPublicId: "",
      published: false,
      campaignTag: "",
    },
  })

  const coverUrl = form.watch("coverUrl")
  const pdfUrl = form.watch("pdfUrl")

  const onSubmit = async (data: ResourceValues) => {
    setIsSubmitting(true)
    setError(null)
    
    const result = initialData 
      ? await updateResource(initialData.id, data)
      : await createResource(data)
    
    setIsSubmitting(false)

    if (result.success) {
      router.push("/admin/resources")
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
              <CardTitle>Resource Information</CardTitle>
              <CardDescription>Basic details about the lead magnet.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Title</label>
                <Input {...form.register("title")} placeholder="e.g. 2026 Tax Planning Guide" />
                {form.formState.errors.title && <p className="text-red-500 text-xs">{form.formState.errors.title.message as string}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Slug</label>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-muted-foreground">/r/</span>
                  <Input {...form.register("slug")} placeholder="tax-guide-2026" />
                </div>
                {form.formState.errors.slug && <p className="text-red-500 text-xs">{form.formState.errors.slug.message as string}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Description</label>
                <Textarea 
                  {...form.register("description")} 
                  placeholder="What will users learn from this guide?"
                  className="min-h-[100px]"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Campaign Tag (Optional)</label>
                <Input {...form.register("campaignTag")} placeholder="e.g. winter-2026" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Asset Management</CardTitle>
              <CardDescription>Upload the PDF and an optional cover image.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <label className="text-sm font-medium flex items-center">
                  <FileText className="mr-2 h-4 w-4" /> PDF Document
                </label>
                {pdfUrl ? (
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-center justify-between">
                    <span className="text-sm font-medium text-blue-800 truncate max-w-[300px]">{pdfUrl}</span>
                    <Button type="button" variant="outline" size="sm" onClick={() => {
                      form.setValue("pdfUrl", "");
                      form.setValue("pdfCloudinaryPublicId", "");
                    }}>Change</Button>
                  </div>
                ) : (
                  <CloudinaryUpload 
                    resourceType="raw"
                    onUpload={(url, publicId) => {
                      form.setValue("pdfUrl", url);
                      form.setValue("pdfCloudinaryPublicId", publicId);
                    }} 
                    folder="aaa-resources"
                  />
                )}
                {form.formState.errors.pdfUrl && <p className="text-red-500 text-xs">{form.formState.errors.pdfUrl.message as string}</p>}
              </div>

              <div className="space-y-4">
                <label className="text-sm font-medium flex items-center">
                  <ImageIcon className="mr-2 h-4 w-4" /> Cover Image
                </label>
                <div className="flex items-start gap-4">
                  <div className="relative h-32 w-24 rounded-lg overflow-hidden bg-slate-100 border flex-shrink-0">
                    {coverUrl ? (
                      <Image src={coverUrl} alt="Cover" fill className="object-cover" />
                    ) : (
                      <ImageIcon className="h-8 w-8 m-auto text-slate-300" />
                    )}
                  </div>
                  <div className="flex-1 space-y-2">
                    <CloudinaryUpload 
                      onUpload={(url) => form.setValue("coverUrl", url)} 
                      folder="aaa-covers"
                    />
                    <p className="text-[10px] text-muted-foreground">Recommended aspect ratio: 3:4</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Publishing</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <input 
                  type="checkbox" 
                  id="published" 
                  {...form.register("published")} 
                  className="h-4 w-4 rounded border-gray-300"
                />
                <label htmlFor="published" className="text-sm font-medium">Published / Live</label>
              </div>
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
              <><Save className="mr-2 h-4 w-4" /> {initialData ? "Update Resource" : "Create Resource"}</>
            )}
          </Button>
        </div>
      </div>
    </form>
  )
}
