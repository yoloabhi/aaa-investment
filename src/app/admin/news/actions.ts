'use server'

import db from "@/lib/db"
import { revalidatePath } from "next/cache"

export async function deletePost(id: string) {
  try {
    await db.post.delete({
      where: { id },
    })
    revalidatePath("/admin/news")
    revalidatePath("/news")
    return { success: true }
  } catch (error) {
    console.error("Failed to delete post:", error)
    return { success: false, error: "Internal Server Error" }
  }
}
