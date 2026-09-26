"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Building, CheckCircle, XCircle, FileText, ExternalLink, Send, Clock, User } from "lucide-react"

const SUPABASE_URL = "https://leolsqraajajphguipzx.supabase.co"
const SUPABASE_ANON_KEY = "sb_publishable_DN_9JJ38bQZxkrfrTKqNcQ_rEEPjE4J"

export function AdminPanel() {
  const [applications, setApplications] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchApplications()
  }, [])

  const fetchApplications = async () => {
    try {
      const response = await fetch(`${SUPABASE_URL}/rest/v1/application?select=*`, {
        headers: { apikey: SUPABASE_ANON_KEY, Authorization: `Bearer ${SUPABASE_ANON_KEY}` },
      })
      if (response.ok) {
        const data = await response.json()
        setApplications(data.reverse())
      }
    } catch (error) {
      console.error("Fetch error:", error)
    } finally {
      setLoading(false)
    }
  }

  const updateWorkflow = async (id: number, status: string, stage: string) => {
    let rejectionReason = null
    let fixSolution = null

    if (status === "Rejected") {
      rejectionReason = window.prompt("1. Why is this application being rejected?")
      if (rejectionReason === null) return
      fixSolution = window.prompt("2. What solution/action should the entrepreneur take?")
    }

    try {
      const updateData: any = { status, stage }
      if (rejectionReason) updateData.feedback = rejectionReason
      if (fixSolution) updateData.solution = fixSolution

      const response = await fetch(`${SUPABASE_URL}/rest/v1/application?id=eq.${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          apikey: SUPABASE_ANON_KEY,
          Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify(updateData),
      })

      if (response.ok) fetchApplications()
    } catch (error) {
      console.error("Update error:", error)
    }
  }

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 p-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Scrutiny Inspector Command Center</h1>
        <p className="text-sm text-slate-500">Review filings, inspect attached documents, and route to authorities.</p>
      </div>

      {loading ? (
        <div className="h-32 w-full animate-pulse rounded-xl bg-slate-100" />
      ) : (
        <div className="grid gap-4">
          {applications.map((app) => (
            <Card key={app.id} className="border shadow-sm">
              <CardContent className="p-6 flex flex-col gap-4">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b pb-3">
                  <div className="flex items-center gap-3">
                    <Building className="size-5 text-slate-400" />
                    <h3 className="text-lg font-semibold">{app.company_name}</h3>
                    <Badge variant="outline" className="capitalize">{app.industry_type}</Badge>
                    <Badge className={
                      app.status === "Approved" ? "bg-green-600" :
                      app.status === "Rejected" ? "bg-red-600" : "bg-amber-500"
                    }>
                      {app.status || "Pending"}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
                    <Clock className="size-3 text-amber-600" /> SLA Deadline: {app.deadline || "7 Days"}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-slate-600">
                  <div>
                    <p className="flex items-center gap-1.5 text-xs text-slate-500 mb-1">
                      <User className="size-3.5" /> Applicant Email:
                    </p>
                    <p className="font-semibold text-slate-900">{app.user_email || "N/A"}</p>
                    <p className="mt-2 text-xs text-slate-500">Capital Investment: <span className="font-medium text-slate-800">{app.investment_size}</span></p>
                  </div>

                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                    <p className="text-xs font-semibold text-slate-500 mb-1">Uploaded Document Verification:</p>
                    {app.document_url ? (
                      <a 
                        href={app.document_url} 
                        target="_blank" 
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 text-blue-600 font-medium hover:underline text-sm"
                      >
                        <FileText className="size-4 shrink-0" />
                        <span className="truncate max-w-[220px]">{app.document_name || "View Document"}</span>
                        <ExternalLink className="size-3" />
                      </a>
                    ) : (
                      <p className="text-xs text-red-500 italic">No document attached.</p>
                    )}
                    <p className="text-xs text-slate-400 mt-2">Current Stage: <span className="font-semibold text-slate-700">{app.stage || "Under SI Review"}</span></p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-end gap-2 pt-2 border-t">
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="border-red-200 text-red-600 hover:bg-red-50"
                    onClick={() => updateWorkflow(app.id, "Rejected", "Action Required")}
                  >
                    <XCircle className="mr-1.5 size-4" /> Reject & Request Fix
                  </Button>

                  <Button 
                    variant="outline"
                    size="sm"
                    className="border-blue-200 text-blue-700 hover:bg-blue-50"
                    onClick={() => updateWorkflow(app.id, "Pending", "Forwarded to State Department Head")}
                  >
                    <Send className="mr-1.5 size-4" /> Forward to Higher Authority
                  </Button>

                  <Button 
                    size="sm"
                    className="bg-green-600 hover:bg-green-700 text-white"
                    onClick={() => updateWorkflow(app.id, "Approved", "Final Approval Granted")}
                  >
                    <CheckCircle className="mr-1.5 size-4" /> Grant Final Approval
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
