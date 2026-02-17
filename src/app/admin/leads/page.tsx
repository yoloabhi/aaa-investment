import db from "@/lib/db"
import { LeadsTable } from "./LeadsTable"

export default async function AdminLeadsPage() {
  const leads = await db.lead.findMany({
    orderBy: { createdAt: 'desc' },
    include: { resource: true }
  })

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black tracking-tighter uppercase italic mb-2">Lead Intelligence</h1>
        <p className="text-slate-500 font-medium text-sm tracking-tight">
          Comprehensive data capture from contact forms and resource downloads.
        </p>
      </div>

      <LeadsTable initialLeads={leads} />
    </div>
  )
}
