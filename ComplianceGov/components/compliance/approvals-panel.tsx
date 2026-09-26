"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, CheckCircle, XCircle, Building, FileText, AlertTriangle, Lightbulb, ShieldCheck, ArrowRight } from "lucide-react"

const SUPABASE_URL = "https://leolsqraajajphguipzx.supabase.co"
const SUPABASE_ANON_KEY = "sb_publishable_DN_9JJ38bQZxkrfrTKqNcQ_rEEPjE4J"

export function ApprovalsPanel({ userEmail }: { userEmail?: string }) {
  const [applications, setApplications] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchMyApplications = async () => {
      try {
        // SECURITY FILTER: Only fetch records belonging to logged-in email
        const filter = userEmail ? `?user_email=eq.${encodeURIComponent(userEmail)}` : `?select=*`
        const response = await fetch(`${SUPABASE_URL}/rest/v1/application${filter}`, {
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
        console.error("Failed to fetch applications:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchMyApplications()
  }, [userEmail])

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-6 p-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold text-slate-900">My Compliance Tracker</h1>
        <p className="text-sm text-slate-500">
          Showing secured filings for: <span className="font-semibold text-blue-600">{userEmail || "All Users"}</span>
        </p>
      </div>

      {loading ? (
        <div className="h-32 w-full animate-pulse rounded-xl bg-slate-100" />
      ) : (
        <div className="grid gap-6">
          {applications.map((app, index) => {
            const status = app.status ? app.status.toLowerCase() : "pending"
            const stage = app.stage || "Under SI Review"

            return (
              <Card key={index} className="border shadow-sm overflow-hidden">
                <CardHeader className="pb-3 flex flex-row items-center justify-between bg-slate-50 border-b">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white rounded-md border shadow-sm">
                      <Building className="size-5 text-slate-600" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{app.company_name}</CardTitle>
                      <p className="text-xs text-slate-500 capitalize">{app.industry_type} Sector</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {status === "approved" && (
                      <Badge className="bg-green-100 text-green-700 border-green-200 flex gap-1">
                        <CheckCircle className="size-3" /> Approved
                      </Badge>
                    )}
                    {status === "rejected" && (
                      <Badge className="bg-red-100 text-red-700 border-red-200 flex gap-1">
                        <XCircle className="size-3" /> Action Required
                      </Badge>
                    )}
                    {status === "pending" && (
                      <Badge className="bg-amber-100 text-amber-700 border-amber-200 flex gap-1">
                        <Clock className="size-3" /> In Progress
                      </Badge>
                    )}
                  </div>
                </CardHeader>

                <CardContent className="pt-5 flex flex-col gap-5">
                  
                  {/* MULTI-STAGE TRACKING STEPPER */}
                  <div className="bg-slate-50 p-4 rounded-xl border">
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Live Department Tracking</p>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs">
                      <div className={`flex items-center gap-2 ${stage ? "text-blue-600 font-semibold" : "text-slate-400"}`}>
                        <div className="size-2 rounded-full bg-blue-600" /> 1. Filed
                      </div>
                      <ArrowRight className="size-3 text-slate-300 hidden sm:block" />
                      
                      <div className={`flex items-center gap-2 ${stage.includes("SI Review") || stage.includes("Forwarded") || status === "approved" ? "text-blue-600 font-semibold" : "text-slate-400"}`}>
                        <div className="size-2 rounded-full bg-blue-600" /> 2. SI Inspection
                      </div>
                      <ArrowRight className="size-3 text-slate-300 hidden sm:block" />
                      
                      <div className={`flex items-center gap-2 ${stage.includes("Forwarded") || status === "approved" ? "text-blue-600 font-semibold" : "text-slate-400"}`}>
                        <div className="size-2 rounded-full bg-blue-600" /> 3. Department Head Review
                      </div>
                      <ArrowRight className="size-3 text-slate-300 hidden sm:block" />
                      
                      <div className={`flex items-center gap-2 ${status === "approved" ? "text-green-600 font-bold" : "text-slate-400"}`}>
                        <div className={`size-2 rounded-full ${status === "approved" ? "bg-green-600" : "bg-slate-300"}`} /> 4. Decision
                      </div>
                    </div>
                    <div className="mt-3 pt-2 border-t text-xs text-slate-600 flex justify-between">
                      <span>Current Location: <strong className="text-slate-900">{stage}</strong></span>
                      <span className="text-amber-700 font-medium">Target Clearance SLA: {app.deadline || "7 Days"}</span>
                    </div>
                  </div>

                  {/* REASON & SOLUTION */}
                  {status === "rejected" && (app.feedback || app.solution) && (
                    <div className="flex flex-col gap-2">
                      {app.feedback && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-start gap-3">
                          <AlertTriangle className="size-5 text-red-600 shrink-0 mt-0.5" />
                          <div>
                            <h4 className="text-sm font-semibold text-red-900">Rejection Reason</h4>
                            <p className="text-sm text-red-700 mt-0.5">{app.feedback}</p>
                          </div>
                        </div>
                      )}
                      {app.solution && (
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex items-start gap-3">
                          <Lightbulb className="size-5 text-blue-600 shrink-0 mt-0.5" />
                          <div>
                            <h4 className="text-sm font-semibold text-blue-900">Action Required to Resolve</h4>
                            <p className="text-sm text-blue-800 mt-0.5">{app.solution}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t pt-3">
                    <div className="space-y-1.5">
                      <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Submitted File</h4>
                      {app.document_url ? (
                        <a 
                          href={app.document_url} 
                          target="_blank" 
                          rel="noreferrer"
                          className="inline-flex items-center gap-2 text-sm text-blue-600 hover:underline bg-blue-50 p-2 rounded border border-blue-100"
                        >
                          <FileText className="size-4 shrink-0" /> 
                          <span className="truncate max-w-[200px] font-medium">{app.document_name || "View Document"}</span>
                        </a>
                      ) : (
                        <p className="text-sm text-slate-400 italic">No document attached.</p>
                      )}
                    </div>

                    <div className="space-y-1.5">
                      <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Pending Sector Approvals</h4>
                      <ul className="text-xs text-slate-600 list-disc pl-4 space-y-1">
                        {app.industry_type === "manufacturing" && (
                          <><li>Pollution Control Clearance</li><li>Fire NOC</li></>
                        )}
                        {app.industry_type === "technology" && (
                          <li>Data Security Declaration</li>
                        )}
                        {app.industry_type === "energy" && (
                          <><li>EIA Report</li><li>Grid Approval</li></>
                        )}
                        {app.industry_type === "retail" && (
                          <><li>Municipal Trade License</li><li>FSSAI License</li></>
                        )}
                      </ul>
                    </div>
                  </div>

                </CardContent>
              </Card>
            )
          })}

          {applications.length === 0 && (
            <div className="p-8 text-center bg-slate-50 rounded-xl border border-dashed">
              <ShieldCheck className="mx-auto size-10 text-slate-400 mb-2" />
              <p className="text-slate-600 font-medium text-sm">No filings found for this account.</p>
              <p className="text-xs text-slate-400 mt-1">Submit a new application from the sidebar to start tracking.</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
