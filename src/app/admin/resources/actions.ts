'use server'

import db from "@/lib/db"
import { revalidatePath } from "next/cache"
import { z } from "zod"

const resourceSchema = z.object({
  title: z.string().min(1),
  slug: z.string().min(1).regex(/^[a-z0-9-]+$/),
  description: z.string().optional(),
  coverUrl: z.string().optional(),
  pdfUrl: z.string().min(1),
  pdfCloudinaryPublicId: z.string().min(1),
  published: z.boolean().default(false),
  campaignTag: z.string().optional(),
})

export async function createResource(data: z.infer<typeof resourceSchema>) {
  try {
    await db.resource.create({
      data,
    })
    revalidatePath("/admin/resources")
    revalidatePath("/resources")
    return { success: true }
  } catch (error) {
    console.error("Failed to create resource:", error)
    return { success: false, error: "Internal Server Error" }
  }
}

export async function updateResource(id: string, data: z.infer<typeof resourceSchema>) {
  try {
    await db.resource.update({
      where: { id },
      data,
    })
    revalidatePath("/admin/resources")
    revalidatePath("/resources")
    revalidatePath(`/r/${data.slug}`)
    return { success: true }
  } catch (error) {
    console.error("Failed to update resource:", error)
    return { success: false, error: "Internal Server Error" }
  }
}

export async function deleteResource(id: string) {
  try {
    await db.resource.delete({
      where: { id },
    })
    revalidatePath("/admin/resources")
    revalidatePath("/resources")
    return { success: true }
  } catch (error) {
    console.error("Failed to delete resource:", error)
    return { success: false, error: "Internal Server Error" }
  }
}
