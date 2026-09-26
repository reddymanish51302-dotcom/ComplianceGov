"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { FileText, CheckCircle, XCircle } from "lucide-react"

const SUPABASE_URL = "https://leolsqraajajphguipzx.supabase.co"
const SUPABASE_ANON_KEY = "sb_publishable_DN_9JJ38bQZxkrfrTKqNcQ_rEEPjE4J"

export function AuthorityPanel() {
  const [applications, setApplications] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  
  // Track both feedback (reason) and solution independently for each application
  const [feedbackState, setFeedbackState] = useState<Record<number, string>>({})
  const [solutionState, setSolutionState] = useState<Record<number, string>>({})

  const fetchApplications = async () => {
    try {
      const response = await fetch(`${SUPABASE_URL}/rest/v1/application?status=eq.Pending&select=*`, {
        headers: {
          apikey: SUPABASE_ANON_KEY,
          Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        },
      })
      const data = await response.json()
      
      const forwarded = data.filter((app: any) => app.stage === "Forwarded to State Department Head")
      setApplications(forwarded)
    } catch (error) {
      console.error("Error fetching:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchApplications()
  }, [])

  const handleFinalDecision = async (id: number, decision: "Approved" | "Rejected") => {
    const feedback = feedbackState[id] || ""
    const solution = solutionState[id] || ""

    // Validate that BOTH fields are filled out if rejecting
    if (decision === "Rejected" && (!feedback.trim() || !solution.trim())) {
      alert("You must provide BOTH a rejection reason and a proposed solution before rejecting.")
      return
    }

    try {
      await fetch(`${SUPABASE_URL}/rest/v1/application?id=eq.${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          apikey: SUPABASE_ANON_KEY,
          Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({
          status: decision,
          stage: "Decision Finalized",
          feedback: decision === "Rejected" ? feedback : "Application fully verified and approved by Department Head.",
          solution: decision === "Rejected" ? solution : "N/A"
        }),
      })
      
      fetchApplications()
    } catch (error) {
      console.error("Update error:", error)
      alert("Failed to update final decision.")
    }
  }

  if (loading) return <div className="text-center py-10">Loading Authority Dashboard...</div>

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-purple-900">Higher Authority Dashboard</h1>
        <p className="text-sm text-slate-500">Make final Approve/Reject decisions on files forwarded by the Scrutiny Inspector.</p>
      </div>

      {applications.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border border-slate-200">
          <CheckCircle className="mx-auto size-12 text-purple-300 mb-3" />
          <p className="text-slate-500 font-medium">No files pending your final decision.</p>
          <p className="text-sm text-slate-400 mt-1">Waiting for Scrutiny Inspectors to forward applications.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {applications.map((app) => (
            <Card key={app.id} className="border-purple-200 shadow-sm">
              <CardHeader className="bg-purple-50/50 pb-4 border-b border-purple-100">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xl text-purple-900">{app.company_name}</CardTitle>
                    <p className="text-sm text-slate-500 mt-1">Applicant: <span className="font-semibold text-slate-700">{app.user_email}</span></p>
                  </div>
                  <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">Pending Final Sign-Off</Badge>
                </div>
              </CardHeader>
              
              <CardContent className="pt-4 flex flex-col gap-5">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm bg-white">
                  <div><span className="text-slate-500 block mb-1 text-xs uppercase font-bold">Sector</span><span className="font-medium capitalize">{app.industry_type}</span></div>
                  <div><span className="text-slate-500 block mb-1 text-xs uppercase font-bold">Investment</span><span className="font-medium capitalize">{app.investment_size}</span></div>
                  <div><span className="text-slate-500 block mb-1 text-xs uppercase font-bold">SLA Deadline</span><span className="font-medium text-red-600">{app.deadline}</span></div>
                  <div>
                    <span className="text-slate-500 block mb-1 text-xs uppercase font-bold">Document</span>
                    {app.document_url ? (
                      <a href={app.document_url} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-blue-600 hover:text-blue-800 font-medium hover:underline">
                        <FileText className="size-4" /> View File
                      </a>
                    ) : (
                      <span className="text-slate-400">No file attached</span>
                    )}
                  </div>
                </div>

                <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 mt-2">
                  <h4 className="text-sm font-bold text-slate-800 mb-3">Final Decision Action</h4>
                  <div className="space-y-4">
                    
                    <div className="space-y-1.5">
                      <Label className="text-xs text-slate-500">Rejection Reason (Required ONLY if Rejecting):</Label>
                      <Input 
                        placeholder="e.g., 'Fire NOC date is expired' or 'Incomplete financial data'" 
                        value={feedbackState[app.id] || ""}
                        onChange={(e) => setFeedbackState({ ...feedbackState, [app.id]: e.target.value })}
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-xs text-slate-500">Proposed Solution (Required ONLY if Rejecting):</Label>
                      <Input 
                        placeholder="e.g., 'Upload the renewed Fire NOC for 2026' or 'Attach Q3 Balance Sheet'" 
                        value={solutionState[app.id] || ""}
                        onChange={(e) => setSolutionState({ ...solutionState, [app.id]: e.target.value })}
                      />
                    </div>

                    <div className="flex gap-3 pt-2">
                      <Button onClick={() => handleFinalDecision(app.id, "Approved")} className="bg-green-600 hover:bg-green-700 text-white flex-1 h-11">
                        <CheckCircle className="mr-2 size-5" /> Final Approve
                      </Button>
                      <Button onClick={() => handleFinalDecision(app.id, "Rejected")} variant="destructive" className="flex-1 h-11">
                        <XCircle className="mr-2 size-5" /> Final Reject
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
