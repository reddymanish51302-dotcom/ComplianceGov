"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Building, CheckCircle, XCircle, FileText, ExternalLink } from "lucide-react"

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
        headers: {
          apikey: SUPABASE_ANON_KEY,
          Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        },
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

  const handleUpdateStatus = async (id: number, newStatus: string) => {
    let rejectionReason = null
    let fixSolution = null

    // Ask for Reason AND Solution
    if (newStatus === "Rejected") {
      rejectionReason = window.prompt("1. REASON: Why is this application being rejected?")
      if (rejectionReason === null) return // User cancelled
      
      fixSolution = window.prompt("2. SOLUTION: What should the entrepreneur do to fix this?")
    }

    try {
      const updateData: any = { status: newStatus }
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

      if (response.ok) {
        fetchApplications() // Refresh the UI
      }
    } catch (error) {
      console.error("Update error:", error)
    }
  }

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 p-6">
      <div className="flex flex-col gap-1.5">
        <h1 className="text-2xl font-bold text-slate-900">Scrutiny Inspector Dashboard</h1>
        <p className="text-sm text-slate-500">Review pending applications and verify documents.</p>
      </div>

      {loading ? (
        <div className="h-32 w-full animate-pulse rounded-xl bg-slate-100" />
      ) : (
        <div className="grid gap-4">
          {applications.map((app) => (
            <Card key={app.id} className="border shadow-sm">
              <CardContent className="p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-3">
                    <Building className="size-5 text-slate-400" />
                    <h3 className="text-lg font-semibold">{app.company_name}</h3>
                    <Badge variant="outline" className="capitalize">{app.industry_type}</Badge>
                    <Badge className={
                      app.status === "Approved" ? "bg-green-500" :
                      app.status === "Rejected" ? "bg-red-500" : "bg-yellow-500"
                    }>
                      {app.status || "Pending"}
                    </Badge>
                  </div>
                  
                  <div className="text-sm text-slate-600 pl-8">
                    <p>Investment: <span className="font-medium">{app.investment_size}</span></p>
                    
                    {/* Shows the exact file name now */}
                    {app.document_url ? (
                      <a 
                        href={app.document_url} 
                        target="_blank" 
                        rel="noreferrer"
                        className="mt-2 inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 hover:underline font-medium"
                      >
                        <FileText className="size-4" />
                        {app.document_name || "View Attached Document"} <ExternalLink className="size-3" />
                      </a>
                    ) : (
                      <p className="mt-2 text-red-500 text-xs italic">No document attached.</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <Button 
                    variant="outline" 
                    className="w-full sm:w-auto border-red-200 text-red-600 hover:bg-red-50"
                    onClick={() => handleUpdateStatus(app.id, "Rejected")}
                    disabled={app.status === "Approved" || app.status === "Rejected"}
                  >
                    <XCircle className="mr-2 size-4" /> Reject
                  </Button>
                  <Button 
                    className="w-full sm:w-auto bg-green-600 hover:bg-green-700"
                    onClick={() => handleUpdateStatus(app.id, "Approved")}
                    disabled={app.status === "Approved" || app.status === "Rejected"}
                  >
                    <CheckCircle className="mr-2 size-4" /> Approve
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
