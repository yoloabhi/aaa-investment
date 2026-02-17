'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Loader2, Eye, PenBox } from 'lucide-react'
import { marked } from 'marked'
import DOMPurify from 'isomorphic-dompurify'

const formSchema = z.object({
  title: z.string().min(2),
  slug: z.string().min(2).regex(/^[a-z0-9-]+$/, "Slug must be lowercase with hyphens"),
  excerpt: z.string().optional(),
  coverUrl: z.string().optional(),
  markdownContent: z.string().min(10),
  published: z.boolean(),
})

type FormValues = z.infer<typeof formSchema>

interface NewsFormProps {
  initialData?: {
    id: string
    title: string
    slug: string
    excerpt?: string | null
    coverUrl?: string | null
    markdownContent: string
    published: boolean
  }
}

export function NewsForm({ initialData }: NewsFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isPreview, setIsPreview] = useState(false)

  const { register, handleSubmit, watch, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData ? {
      ...initialData,
      excerpt: initialData.excerpt || "",
      coverUrl: initialData.coverUrl || "",
    } : { 
      title: "",
      slug: "",
      excerpt: "",
      coverUrl: "",
      markdownContent: "",
      published: false 
    }
  })

  const markdown = watch('markdownContent') || ''

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true)
    try {
      const response = await fetch('/api/admin/news', {
        method: initialData ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(initialData ? { ...data, id: initialData.id } : data),
      })

      if (!response.ok) throw new Error('Failed to save')
      router.push('/admin/news')
      router.refresh()
    } catch (err) {
      alert('Error saving post')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold">Title</label>
            <Input {...register('title')} placeholder="Post title" />
            {errors.title && <p className="text-red-500 text-xs">{errors.title.message as string}</p>}
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-sm font-semibold">Content (Markdown)</label>
              <Button 
                type="button" 
                variant="outline" 
                size="sm" 
                onClick={() => setIsPreview(!isPreview)}
              >
                {isPreview ? <><PenBox className="mr-2 h-4 w-4" /> Edit</> : <><Eye className="mr-2 h-4 w-4" /> Preview</>}
              </Button>
            </div>
            
            {isPreview ? (
              <div 
                className="prose max-w-none p-6 bg-white border rounded-md min-h-[400px]"
                dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(marked.parse(markdown) as string) }}
              />
            ) : (
              <Textarea 
                {...register('markdownContent')} 
                className="min-h-[400px] font-mono"
                placeholder="# Your markdown here..." 
              />
            )}
            {errors.markdownContent && <p className="text-red-500 text-xs">{errors.markdownContent.message as string}</p>}
          </div>
        </div>

        <div className="space-y-6 bg-white p-6 rounded-xl border h-fit">
          <h3 className="font-bold border-b pb-4 mb-4">Settings</h3>
          
          <div className="space-y-2">
            <label className="text-sm font-semibold">Slug</label>
            <Input {...register('slug')} placeholder="post-url-slug" />
            {errors.slug && <p className="text-red-500 text-xs">{errors.slug.message as string}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold">Excerpt</label>
            <Textarea {...register('excerpt')} placeholder="Short summary..." />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold">Cover Image URL</label>
            <Input {...register('coverUrl')} placeholder="Cloudinary URL" />
          </div>

          <div className="flex items-center space-x-2 pt-4">
            <input type="checkbox" id="published" {...register('published')} />
            <label htmlFor="published" className="text-sm font-semibold">Publish immediately</label>
          </div>

          <hr />

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</> : 'Save Post'}
          </Button>
          
          <Button type="button" variant="ghost" className="w-full" onClick={() => router.back()}>
            Cancel
          </Button>
        </div>
      </div>
    </form>
  )
}
