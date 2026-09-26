"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, CheckCircle, XCircle, Building } from "lucide-react"

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
        <p className="text-sm text-slate-500">Track the live approval status of your compliance filings.</p>
      </div>

      {loading ? (
        <div className="h-32 w-full animate-pulse rounded-xl bg-slate-100" />
      ) : (
        <div className="grid gap-4">
          {applications.map((app, index) => {
            const status = app.status ? app.status.toLowerCase() : "pending"
            return (
              <Card key={index} className="border shadow-sm">
                <CardHeader className="pb-3 flex flex-row items-center justify-between bg-slate-50 rounded-t-xl">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white rounded-md border">
                      <Building className="size-5 text-slate-600" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{app.company_name}</CardTitle>
                      <p className="text-xs text-slate-500 capitalize">{app.industry_type}</p>
                    </div>
                  </div>
                  
                  {/* Dynamic Status Badge */}
                  {status === "approved" && (
                    <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border border-green-200 px-3 py-1 flex gap-1 items-center">
                      <CheckCircle className="size-3" /> Approved
                    </Badge>
                  )}
                  {status === "rejected" && (
                    <Badge className="bg-red-100 text-red-700 hover:bg-red-100 border border-red-200 px-3 py-1 flex gap-1 items-center">
                      <XCircle className="size-3" /> Rejected
                    </Badge>
                  )}
                  {status === "pending" && (
                    <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100 border border-yellow-200 px-3 py-1 flex gap-1 items-center">
                      <Clock className="size-3" /> Pending Review
                    </Badge>
                  )}
                </CardHeader>
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
