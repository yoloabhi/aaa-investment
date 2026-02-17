import db from "@/lib/db"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Inbox, FileText, Users, Layers, ExternalLink } from "lucide-react"
import Link from "next/link"
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"

export default async function AdminDashboard() {
  const [leadsCount, postsCount, teamCount, resourcesCount, recentLeads] = await Promise.all([
    db.lead.count(),
    db.post.count(),
    db.teamMember.count(),
    db.resource.count(),
    db.lead.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: { resource: true }
    })
  ])

  const stats = [
    { name: 'Total Leads', value: leadsCount, icon: Inbox, color: 'text-blue-600' },
    { name: 'News Posts', value: postsCount, icon: FileText, color: 'text-orange-600' },
    { name: 'Team Members', value: teamCount, icon: Users, color: 'text-green-600' },
    { name: 'Lead Magnets', value: resourcesCount, icon: Layers, color: 'text-purple-600' },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back to the AAA Investment management portal.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.name}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.name}</CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Leads</CardTitle>
            <Link href="/admin/leads" className="text-sm text-blue-600 hover:underline flex items-center">
              View all <ExternalLink className="ml-1 h-3 w-3" />
            </Link>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Source</TableHead>
                  <TableHead className="text-right">Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentLeads.map((lead) => (
                  <TableRow key={lead.id}>
                    <TableCell>
                      <div className="font-medium">{lead.name}</div>
                      <div className="text-xs text-muted-foreground">{lead.email}</div>
                    </TableCell>
                    <TableCell>
                      <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${
                        lead.source === 'contact_form' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'
                      }`}>
                        {lead.source === 'contact_form' ? 'Contact' : 'Download'}
                      </span>
                    </TableCell>
                    <TableCell className="text-right text-xs text-muted-foreground">
                      {new Date(lead.createdAt).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                ))}
                {recentLeads.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center py-4 text-muted-foreground">
                      No recent leads.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>System Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between text-sm">
              <span>Database (Neon)</span>
              <span className="text-green-600 font-medium">Connected</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span>Assets (Cloudinary)</span>
              <span className="text-green-600 font-medium">Active</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span>Emails (Resend)</span>
              <span className="text-green-600 font-medium">Configured</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
