"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, CheckCircle, XCircle, Building, FileText, AlertTriangle } from "lucide-react"

const SUPABASE_URL = "https://leolsqraajajphguipzx.supabase.co"
const SUPABASE_ANON_KEY = "sb_publishable_DN_9JJ38bQZxkrfrTKqNcQ_rEEPjE4J"

export function ApprovalsPanel() {
  const [applications, setApplications] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
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
        console.error("Failed to fetch:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchApplications()
  }, [])

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-6 p-6">
      <div className="flex flex-col gap-1.5">
        <h1 className="text-2xl font-bold text-slate-900">My Applications</h1>
        <p className="text-sm text-slate-500">Track your submitted documents and approval status.</p>
      </div>

      {loading ? (
        <div className="h-32 w-full animate-pulse rounded-xl bg-slate-100" />
      ) : (
        <div className="grid gap-6">
          {applications.map((app, index) => {
            const status = app.status ? app.status.toLowerCase() : "pending"
            return (
              <Card key={index} className="border shadow-sm">
                <CardHeader className="pb-3 flex flex-row items-center justify-between bg-slate-50 rounded-t-xl border-b">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white rounded-md border">
                      <Building className="size-5 text-slate-600" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{app.company_name}</CardTitle>
                      <p className="text-xs text-slate-500 capitalize">{app.industry_type} Sector</p>
                    </div>
                  </div>
                  
                  {status === "approved" && (
                    <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-green-200 px-3 py-1 flex gap-1">
                      <CheckCircle className="size-3" /> Approved
                    </Badge>
                  )}
                  {status === "rejected" && (
                    <Badge className="bg-red-100 text-red-700 hover:bg-red-100 border-red-200 px-3 py-1 flex gap-1">
                      <XCircle className="size-3" /> Action Required
                    </Badge>
                  )}
                  {status === "pending" && (
                    <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100 border-yellow-200 px-3 py-1 flex gap-1">
                      <Clock className="size-3" /> Pending Review
                    </Badge>
                  )}
                </CardHeader>
                <CardContent className="pt-4 flex flex-col gap-4">
                  
                  {/* REJECTION REASON DISPLAY */}
                  {status === "rejected" && app.feedback && (
                    <div className="bg-red-50 border border-red-200 rounded-md p-3 flex items-start gap-3">
                      <AlertTriangle className="size-5 text-red-600 mt-0.5" />
                      <div>
                        <h4 className="text-sm font-semibold text-red-900">Application Rejected</h4>
                        <p className="text-sm text-red-700 mt-1">Reason: <span className="font-medium">{app.feedback}</span></p>
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* SUBMITTED DOCUMENTS */}
                    <div className="space-y-2">
                      <h4 className="text-sm font-semibold text-slate-900">Submitted Documents</h4>
                      {app.document_url ? (
                        <a 
                          href={app.document_url} 
                          target="_blank" 
                          rel="noreferrer"
                          className="flex items-center gap-2 text-sm text-blue-600 hover:underline bg-blue-50 p-2 rounded border border-blue-100 w-max"
                        >
                          <FileText className="size-4" /> View Main Document
                        </a>
                      ) : (
                        <p className="text-sm text-slate-500 italic">No files attached.</p>
                      )}
                    </div>

                    {/* PENDING / REQUIRED DOCUMENTS */}
                    <div className="space-y-2">
                      <h4 className="text-sm font-semibold text-slate-900">Pending / Required Files</h4>
                      <ul className="text-sm text-slate-600 list-disc pl-5 space-y-1">
                        {app.industry_type === "manufacturing" && (
                          <><li>Pollution Control Board NOC (Pending)</li><li>Fire Safety Certificate (Pending)</li></>
                        )}
                        {app.industry_type === "technology" && (
                          <li>Data Privacy Declaration (Pending)</li>
                        )}
                        {app.industry_type === "energy" && (
                          <><li>EIA Report (Pending)</li><li>Grid Connectivity Approval (Pending)</li></>
                        )}
                        {app.industry_type === "retail" && (
                          <><li>Trade License (Pending)</li><li>FSSAI License (Pending)</li></>
                        )}
                        {!app.industry_type && <li>No additional documents mapped.</li>}
                      </ul>
                    </div>
                  </div>

                </CardContent>
              </Card>
            )
          })}
          
          {applications.length === 0 && (
            <p className="text-slate-500 text-sm mt-4">You have not submitted any applications yet.</p>
          )}
        </div>
      )}
    </div>
  )
}
