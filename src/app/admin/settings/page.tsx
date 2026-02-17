import { getSiteSettings } from "@/lib/data"
import { SiteSettingsForm } from "@/components/forms/SiteSettingsForm"

export default async function AdminSettingsPage() {
  const settings = await getSiteSettings()

  // Convert prisma model to form values (ensure strings)
  const initialData = {
    yearsExperience: String(settings.yearsExperience),
    clientsCount: String(settings.clientsCount),
    aum: String(settings.aum),
    claimSettlement: String(settings.claimSettlement),
    awardsCount: String(settings.awardsCount),
    showStats: !!settings.showStats,
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Settings</h1>
        <p className="text-muted-foreground">Global configuration for the website.</p>
      </div>

      <SiteSettingsForm initialData={initialData} />
    </div>
  )
}
