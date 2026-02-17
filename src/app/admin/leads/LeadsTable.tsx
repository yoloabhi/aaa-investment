'use client'

import { useState, useMemo } from "react"
import { formatDate } from "@/lib/utils"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Download, Calendar, Filter, X } from "lucide-react"

interface Lead {
  id: string
  name: string
  email: string
  phone: string | null
  source: string
  interestedIn: string | null
  message: string | null
  createdAt: Date
  resource?: { title: string } | null
}

export function LeadsTable({ initialLeads }: { initialLeads: any[] }) {
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [interestFilter, setInterestFilter] = useState("All")

  const filteredLeads = useMemo(() => {
    return initialLeads.filter(lead => {
      const leadDate = new Date(lead.createdAt).getTime()
      const start = startDate ? new Date(startDate).setHours(0,0,0,0) : null
      const end = endDate ? new Date(endDate).setHours(23,59,59,999) : null

      const dateMatch = (!start || leadDate >= start) && (!end || leadDate <= end)
      const interestMatch = interestFilter === "All" || lead.interestedIn === interestFilter
      
      return dateMatch && interestMatch
    })
  }, [initialLeads, startDate, endDate, interestFilter])

  const downloadCSV = () => {
    const headers = ["Date", "Name", "Email", "Phone", "Source", "Interest", "Message/Resource"]
    const rows = filteredLeads.map(lead => [
      formatDate(lead.createdAt),
      lead.name,
      lead.email,
      lead.phone || "N/A",
      lead.source,
      lead.interestedIn || "N/A",
      lead.source === 'contact_form' ? lead.message : lead.resource?.title
    ])

    const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n")
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.setAttribute("href", url)
    link.setAttribute("download", `aaa-leads-${new Date().toISOString().split('T')[0]}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const resetFilters = () => {
    setStartDate("")
    setEndDate("")
    setInterestFilter("All")
  }

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 border rounded-2xl shadow-sm flex flex-wrap items-end gap-4">
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center">
            <Calendar className="h-3 w-3 mr-1" /> Start Date
          </label>
          <Input 
            type="date" 
            value={startDate} 
            onChange={(e) => setStartDate(e.target.value)}
            className="h-10 w-44 rounded-xl border-slate-200"
          />
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center">
            <Calendar className="h-3 w-3 mr-1" /> End Date
          </label>
          <Input 
            type="date" 
            value={endDate} 
            onChange={(e) => setEndDate(e.target.value)}
            className="h-10 w-44 rounded-xl border-slate-200"
          />
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center">
            <Filter className="h-3 w-3 mr-1" /> Interest
          </label>
          <select 
            value={interestFilter}
            onChange={(e) => setInterestFilter(e.target.value)}
            className="flex h-10 w-44 rounded-xl border border-slate-200 bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            <option value="All">All Interests</option>
            <option value="Investment">Investment</option>
            <option value="Insurance">Insurance</option>
            <option value="Both">Both</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          {(startDate || endDate || interestFilter !== "All") && (
            <Button variant="ghost" size="icon" onClick={resetFilters} className="h-10 w-10 rounded-xl">
              <X className="h-4 w-4" />
            </Button>
          )}
          <Button 
            onClick={downloadCSV}
            className="h-10 px-6 rounded-xl bg-slate-900 text-white hover:bg-slate-800"
          >
            <Download className="h-4 w-4 mr-2" /> Export CSV
          </Button>
        </div>
      </div>

      <div className="bg-white border rounded-2xl overflow-hidden shadow-sm">
        <Table>
          <TableHeader className="bg-slate-50/50">
            <TableRow>
              <TableHead className="font-black text-[10px] uppercase tracking-widest">Date</TableHead>
              <TableHead className="font-black text-[10px] uppercase tracking-widest">Name</TableHead>
              <TableHead className="font-black text-[10px] uppercase tracking-widest">Contact</TableHead>
              <TableHead className="font-black text-[10px] uppercase tracking-widest">Source/Interest</TableHead>
              <TableHead className="font-black text-[10px] uppercase tracking-widest">Details</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredLeads.map((lead) => (
              <TableRow key={lead.id} className="hover:bg-slate-50/50 transition-colors">
                <TableCell className="text-xs font-medium text-slate-500">{formatDate(lead.createdAt)}</TableCell>
                <TableCell className="font-bold text-slate-900">{lead.name}</TableCell>
                <TableCell>
                  <div className="text-sm font-medium">{lead.email}</div>
                  <div className="text-[10px] text-slate-400 font-bold">{lead.phone}</div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col gap-1">
                    <span className={`inline-flex items-center w-fit px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-tighter ${
                      lead.source === 'contact_form' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'
                    }`}>
                      {lead.source === 'contact_form' ? 'Form' : 'Download'}
                    </span>
                    {lead.interestedIn && (
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        {lead.interestedIn}
                      </span>
                    )}
                  </div>
                </TableCell>
                <TableCell className="max-w-xs text-sm text-slate-600">
                  {lead.source === 'contact_form' ? (
                    <p className="line-clamp-2 italic">"{lead.message}"</p>
                  ) : (
                    <span className="text-slate-400 font-medium">
                      Asset: {lead.resource?.title}
                    </span>
                  )}
                </TableCell>
              </TableRow>
            ))}
            {filteredLeads.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-20 text-slate-400 italic">
                  No matching leads found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      
      <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 text-center">
        Total Results: {filteredLeads.length}
      </div>
    </div>
  )
}
