'use client'

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, Save, User } from "lucide-react"
import { createTeamMember, updateTeamMember } from "@/app/admin/team/actions"
import { CloudinaryUpload } from "./CloudinaryUpload"
import { useRouter } from "next/navigation"
import Image from "next/image"

const teamMemberSchema = z.object({
  name: z.string().min(1, "Name is required"),
  roleTitle: z.string().min(1, "Role is required"),
  bio: z.string().optional(),
  photoUrl: z.string().min(1, "Photo is required"),
  order: z.number().int().default(0),
  published: z.boolean().default(true),
})

type TeamMemberValues = z.infer<typeof teamMemberSchema>

interface TeamMemberFormProps {
  initialData?: {
    id: string
    name: string
    roleTitle: string
    bio?: string | null
    photoUrl: string
    order?: number
    published?: boolean
  }
}

export function TeamMemberForm({ initialData }: TeamMemberFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const form = useForm<any>({
    resolver: zodResolver(teamMemberSchema),
    defaultValues: initialData ? {
      ...initialData,
      bio: initialData.bio || "",
    } : {
      name: "",
      roleTitle: "",
      bio: "",
      photoUrl: "",
      order: 0,
      published: true,
    },
  })

  const photoUrl = form.watch("photoUrl")

  const onSubmit = async (data: TeamMemberValues) => {
    setIsSubmitting(true)
    setError(null)
    
    const result = initialData 
      ? await updateTeamMember(initialData.id, data)
      : await createTeamMember(data)
    
    setIsSubmitting(false)

    if (result.success) {
      router.push("/admin/team")
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
              <CardTitle>Member Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Full Name</label>
                <Input {...form.register("name")} placeholder="e.g. Ashok Kumar" />
                {form.formState.errors.name && <p className="text-red-500 text-xs">{form.formState.errors.name.message as string}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Role Title</label>
                <Input {...form.register("roleTitle")} placeholder="e.g. Managing Director" />
                {form.formState.errors.roleTitle && <p className="text-red-500 text-xs">{form.formState.errors.roleTitle.message as string}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Biography</label>
                <Textarea 
                  {...form.register("bio")} 
                  placeholder="Tell us about their expertise..."
                  className="min-h-[150px]"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Settings</CardTitle>
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
                <div className="flex items-end pb-2 space-x-2">
                  <input 
                    type="checkbox" 
                    id="published" 
                    {...form.register("published")} 
                    className="h-4 w-4 rounded border-gray-300"
                  />
                  <label htmlFor="published" className="text-sm font-medium">Published / Live</label>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Profile Photo</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-center">
              <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-slate-100 border-2 border-dashed border-slate-300 flex items-center justify-center">
                {photoUrl ? (
                  <Image src={photoUrl} alt="Preview" fill className="object-cover" />
                ) : (
                  <div className="flex flex-col items-center text-slate-400">
                    <User className="h-20 w-20 mb-2" />
                    <p className="text-xs">No photo uploaded</p>
                  </div>
                )}
              </div>
              
              <CloudinaryUpload 
                onUpload={(url) => form.setValue("photoUrl", url)} 
                folder="aaa-team"
              />
              {form.formState.errors.photoUrl && <p className="text-red-500 text-xs">{form.formState.errors.photoUrl.message as string}</p>}
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
              <><Save className="mr-2 h-4 w-4" /> {initialData ? "Update Member" : "Create Member"}</>
            )}
          </Button>
        </div>
      </div>
    </form>
  )
}
