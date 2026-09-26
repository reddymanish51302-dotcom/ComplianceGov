"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

// HARDCODED SUPABASE CREDENTIALS
const SUPABASE_URL = "https://leolsqraajajphguipzx.supabase.co"
const SUPABASE_ANON_KEY = "sb_publishable_DN_9JJ38bQZxkrfrTKqNcQ_rEEPjE4J"

export function AdminPanel() {
  const [applications, setApplications] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  // Fetch all applications
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

  useEffect(() => {
    fetchApplications()
  }, [])

  // Function to Update Status in Supabase
  const updateStatus = async (id: number, newStatus: string) => {
    try {
      const response = await fetch(`${SUPABASE_URL}/rest/v1/application?id=eq.${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          apikey: SUPABASE_ANON_KEY,
          Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
          Prefer: "return=representation"
        },
        body: JSON.stringify({ status: newStatus }),
      })
      
      if (response.ok) {
        // Refresh the list after updating
        fetchApplications()
        alert(`Application marked as ${newStatus}`)
      }
    } catch (error) {
      console.error("Error updating status:", error)
    }
  }

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-6 p-6">
      <div className="flex flex-col gap-1.5">
        <h1 className="text-2xl font-bold text-slate-900">SI / Admin Dashboard</h1>
        <p className="text-sm text-slate-500">Review and approve pending business compliance applications.</p>
      </div>

      {loading ? (
        <div className="h-32 w-full animate-pulse rounded-xl bg-slate-100" />
      ) : (
        <div className="grid gap-4">
          {applications.map((app, index) => {
            // Check status safely by converting it to lowercase
            const currentStatus = app.status ? app.status.toLowerCase() : "pending"
            
            return (
              <Card key={index} className="border-l-4 border-l-blue-600">
                <CardHeader className="pb-3 flex flex-row items-start justify-between">
                  <div>
                    <CardTitle className="text-xl">{app.company_name}</CardTitle>
                    <p className="text-sm text-slate-500 mt-1">
                      Industry: {app.industry_type} | Investment: {app.investment_size}
                    </p>
                  </div>
                  <Badge 
                    variant="outline" 
                    className={
                      currentStatus === "approved" ? "bg-green-100 text-green-700 uppercase" :
                      currentStatus === "rejected" ? "bg-red-100 text-red-700 uppercase" :
                      "bg-yellow-100 text-yellow-700 uppercase"
                    }
                  >
                    {app.status || "PENDING"}
                  </Badge>
                </CardHeader>
                
                {/* Now the buttons will show up safely! */}
                {currentStatus === "pending" && (
                  <CardContent className="flex gap-3 border-t pt-4 bg-slate-50">
                    <Button 
                      className="bg-green-600 hover:bg-green-700 text-white"
                      onClick={() => updateStatus(app.id, "Approved")}
                    >
                      Approve Application
                    </Button>
                    <Button 
                      variant="destructive"
                      onClick={() => updateStatus(app.id, "Rejected")}
                    >
                      Reject
                    </Button>
                  </CardContent>
                )}
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
