'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Loader2, Download } from 'lucide-react'

const formSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Valid phone number required"),
  city: z.string().min(2, "City is required"),
  interestedIn: z.string().optional(),
  consent: z.boolean().refine(val => val === true, "You must consent to proceed"),
})

type FormValues = z.infer<typeof formSchema>

export function ResourceLeadForm({ resourceSlug }: { resourceSlug: string }) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [downloadToken, setDownloadToken] = useState<string | null>(null)
  const [error, setError] = useState('')

  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { consent: true }
  })

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true)
    setError('')
    try {
      const response = await fetch(`/api/resource/${resourceSlug}/lead`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      const result = await response.json()
      if (!response.ok) throw new Error(result.error || 'Failed to submit')

      setDownloadToken(result.token)
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (downloadToken) {
    return (
      <div className="bg-blue-50 p-8 rounded-2xl text-center border border-blue-100 animate-in fade-in zoom-in duration-300">
        <h3 className="text-2xl font-bold text-blue-900 mb-4">Ready to Download!</h3>
        <p className="text-blue-700 mb-8">Click the button below to get your free guide. The link will expire in 10 minutes.</p>
        <Button size="lg" className="w-full" asChild>
          <a href={`/api/resource/${resourceSlug}/download?token=${downloadToken}`} target="_blank" rel="noopener noreferrer">
            <Download className="mr-2 h-5 w-5" /> Download PDF Now
          </a>
        </Button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="space-y-2">
        <label className="text-sm font-semibold">Full Name</label>
        <Input {...register('name')} placeholder="Enter your name" />
        {errors.name && <p className="text-red-500 text-xs">{errors.name.message}</p>}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-semibold">Email Address</label>
        <Input {...register('email')} type="email" placeholder="email@example.com" />
        {errors.email && <p className="text-red-500 text-xs">{errors.email.message}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-semibold">Phone</label>
          <Input {...register('phone')} placeholder="+91..." />
          {errors.phone && <p className="text-red-500 text-xs">{errors.phone.message}</p>}
        </div>
        <div className="space-y-2">
          <label className="text-sm font-semibold">City</label>
          <Input {...register('city')} placeholder="Faridabad" />
          {errors.city && <p className="text-red-500 text-xs">{errors.city.message}</p>}
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-semibold">I am interested in</label>
        <select 
          {...register('interestedIn')}
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          <option value="Both">Investment & Insurance</option>
          <option value="Investment">Investment only</option>
          <option value="Insurance">Insurance only</option>
        </select>
      </div>

      <div className="flex items-start space-x-2 pt-2">
        <input type="checkbox" id="consent" {...register('consent')} className="mt-1" />
        <label htmlFor="consent" className="text-xs text-muted-foreground leading-snug">
          I agree to receive communications from AAA Investment & Insurance. We respect your privacy.
        </label>
      </div>
      {errors.consent && <p className="text-red-500 text-xs">{errors.consent.message}</p>}

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <Button type="submit" className="w-full h-12 text-lg font-bold" disabled={isSubmitting}>
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Preparing Guide...
          </>
        ) : (
          'Send Me The Guide'
        )}
      </Button>
    </form>
  )
}
