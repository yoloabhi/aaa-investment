'use server'

import db from "@/lib/db"
import { revalidatePath } from "next/cache"
import { z } from "zod"

const galleryItemSchema = z.object({
  title: z.string().min(1),
  alt: z.string().optional(),
  category: z.string().min(1),
  eventMonth: z.string().optional().nullable(),
  eventYear: z.string().optional().nullable(),
  featured: z.boolean().default(false),
  order: z.number().int().default(0),
  published: z.boolean().default(true),
  url: z.string().min(1),
  cloudinaryPublicId: z.string().min(1),
})

export async function createGalleryItem(data: z.infer<typeof galleryItemSchema>) {
  try {
    await db.galleryItem.create({
      data,
    })
    revalidatePath("/admin/gallery")
    revalidatePath("/gallery")
    return { success: true }
  } catch (error) {
    console.error("Failed to create gallery item:", error)
    return { success: false, error: "Internal Server Error" }
  }
}

export async function updateGalleryItem(id: string, data: z.infer<typeof galleryItemSchema>) {
  try {
    await db.galleryItem.update({
      where: { id },
      data,
    })
    revalidatePath("/admin/gallery")
    revalidatePath("/gallery")
    return { success: true }
  } catch (error) {
    console.error("Failed to update gallery item:", error)
    return { success: false, error: "Internal Server Error" }
  }
}

export async function deleteGalleryItem(id: string) {
  try {
    await db.galleryItem.delete({
      where: { id },
    })
    revalidatePath("/admin/gallery")
    revalidatePath("/gallery")
    return { success: true }
  } catch (error) {
    console.error("Failed to delete gallery item:", error)
    return { success: false, error: "Internal Server Error" }
  }
}
