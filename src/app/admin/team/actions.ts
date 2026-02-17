'use server'

import db from "@/lib/db"
import { revalidatePath } from "next/cache"
import { z } from "zod"

const teamMemberSchema = z.object({
  name: z.string().min(1),
  roleTitle: z.string().min(1),
  bio: z.string().optional(),
  photoUrl: z.string().min(1),
  order: z.number().int().default(0),
  published: z.boolean().default(true),
})

export async function createTeamMember(data: z.infer<typeof teamMemberSchema>) {
  try {
    await db.teamMember.create({
      data,
    })
    revalidatePath("/admin/team")
    revalidatePath("/about")
    return { success: true }
  } catch (error) {
    console.error("Failed to create team member:", error)
    return { success: false, error: "Internal Server Error" }
  }
}

export async function updateTeamMember(id: string, data: z.infer<typeof teamMemberSchema>) {
  try {
    await db.teamMember.update({
      where: { id },
      data,
    })
    revalidatePath("/admin/team")
    revalidatePath("/about")
    return { success: true }
  } catch (error) {
    console.error("Failed to update team member:", error)
    return { success: false, error: "Internal Server Error" }
  }
}

export async function deleteTeamMember(id: string) {
  try {
    await db.teamMember.delete({
      where: { id },
    })
    revalidatePath("/admin/team")
    revalidatePath("/about")
    return { success: true }
  } catch (error) {
    console.error("Failed to delete team member:", error)
    return { success: false, error: "Internal Server Error" }
  }
}
