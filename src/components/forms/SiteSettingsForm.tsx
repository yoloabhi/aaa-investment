'use client'

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, Save, CheckCircle2, AlertCircle } from "lucide-react"
import { updateSiteSettings } from "@/app/admin/settings/actions"

const settingsSchema = z.object({
  yearsExperience: z.string().min(1),
  clientsCount: z.string().min(1),
  aum: z.string().min(1),
  claimSettlement: z.string().min(1),
  awardsCount: z.string().min(1),
  showStats: z.boolean(),
})

type SettingsValues = z.infer<typeof settingsSchema>

interface SiteSettingsFormProps {
  initialData: SettingsValues
}

export function SiteSettingsForm({ initialData }: SiteSettingsFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  const form = useForm<SettingsValues>({
    resolver: zodResolver(settingsSchema),
    defaultValues: initialData,
  })

  const onSubmit = async (data: SettingsValues) => {
    setIsSubmitting(true)
    setMessage(null)
    const result = await updateSiteSettings(data)
    setIsSubmitting(false)

    if (result.success) {
      setMessage({ type: 'success', text: 'Settings updated successfully!' })
      setTimeout(() => setMessage(null), 5000)
    } else {
      setMessage({ type: 'error', text: result.error || 'Failed to update settings.' })
    }
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
      {message && (
        <div className={`p-4 rounded-lg border flex items-center space-x-3 ${
          message.type === 'success' ? 'bg-green-50 border-green-200 text-green-800' : 'bg-red-50 border-red-200 text-red-800'
        }`}>
          {message.type === 'success' ? <CheckCircle2 className="h-5 w-5" /> : <AlertCircle className="h-5 w-5" />}
          <p className="text-sm font-medium">{message.text}</p>
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Homepage Statistics</CardTitle>
          <CardDescription>
            These values are displayed in the stats section on the landing page.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none" htmlFor="yearsExperience">Years Experience</label>
              <Input 
                id="yearsExperience" 
                {...form.register("yearsExperience")} 
                placeholder="e.g. 30+"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none" htmlFor="clientsCount">Families Secured</label>
              <Input 
                id="clientsCount" 
                {...form.register("clientsCount")} 
                placeholder="e.g. 5000+"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none" htmlFor="aum">Cr AUM</label>
              <Input 
                id="aum" 
                {...form.register("aum")} 
                placeholder="e.g. 600+"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none" htmlFor="claimSettlement">Claim Settlement</label>
              <Input 
                id="claimSettlement" 
                {...form.register("claimSettlement")} 
                placeholder="e.g. 99.1%"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none" htmlFor="awardsCount">Awards Won</label>
              <Input 
                id="awardsCount" 
                {...form.register("awardsCount")} 
                placeholder="e.g. 200+"
              />
            </div>
          </div>

          <div className="flex items-center space-x-3 pt-4">
            <input 
              type="checkbox"
              id="showStats" 
              className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
              {...form.register("showStats")}
            />
            <label className="text-sm font-medium leading-none" htmlFor="showStats">Display stats section on homepage</label>
          </div>
        </CardContent>
        <CardFooter className="bg-slate-50/50 border-t px-6 py-4">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" /> Save Changes
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </form>
  )
}
