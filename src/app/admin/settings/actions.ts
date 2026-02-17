'use server'

import db from "@/lib/db"
import { revalidatePath } from "next/cache"
import { z } from "zod"

const settingsSchema = z.object({
  yearsExperience: z.string().min(1),
  clientsCount: z.string().min(1),
  aum: z.string().min(1),
  claimSettlement: z.string().min(1),
  awardsCount: z.string().min(1),
  showStats: z.boolean(),
})

export async function updateSiteSettings(data: z.infer<typeof settingsSchema>) {
  try {
    const existing = await db.siteSettings.findFirst()

    if (existing) {
      await db.siteSettings.update({
        where: { id: existing.id },
        data,
      })
    } else {
      await db.siteSettings.create({
        data,
      })
    }

    revalidatePath("/")
    revalidatePath("/admin/settings")
    return { success: true }
  } catch (error) {
    console.error("Failed to update settings:", error)
    return { success: false, error: "Internal Server Error" }
  }
}
