"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { NewApplicationForm } from "@/components/compliance/new-application-form"
import { AdminPanel } from "@/components/compliance/admin-panel"
import { ApprovalsPanel } from "@/components/compliance/approvals-panel"
import { AuthorityPanel } from "@/components/compliance/authority-panel"
import { Building2, ShieldCheck, UserCircle, Briefcase } from "lucide-react"

export default function ComplianceDashboard() {
  const [userRole, setUserRole] = useState<"entrepreneur" | "admin" | "authority" | null>(null)
  const [userEmail, setUserEmail] = useState("")
  const [activeTab, setActiveTab] = useState<"new" | "status">("status")

  if (!userRole) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
        <div className="flex flex-col gap-4 w-full max-w-md bg-white p-8 rounded-xl shadow-lg border border-slate-100">
          <div className="text-center mb-6">
            <Building2 className="size-12 text-blue-600 mx-auto mb-2" />
            <h1 className="text-2xl font-bold text-slate-900">GovCompliance Portal</h1>
            <p className="text-slate-500 text-sm">Select your login role</p>
          </div>
          
          <Button onClick={() => { setUserRole("entrepreneur"); setUserEmail("manish@demo.com"); }} className="w-full bg-blue-600 hover:bg-blue-700 h-12 text-lg">
            <UserCircle className="mr-2 size-5" /> Login as Entrepreneur
          </Button>
          
          <Button onClick={() => { setUserRole("admin"); setUserEmail("inspector@demo.com"); }} variant="outline" className="w-full border-blue-200 text-blue-700 hover:bg-blue-50 h-12 text-lg">
            <ShieldCheck className="mr-2 size-5" /> Login as Scrutiny Inspector
          </Button>

          {/* NEW: HIGHER AUTHORITY LOGIN */}
          <Button onClick={() => { setUserRole("authority"); setUserEmail("director@demo.com"); }} variant="outline" className="w-full border-purple-200 text-purple-700 hover:bg-purple-50 h-12 text-lg">
            <Briefcase className="mr-2 size-5" /> Login as Higher Authority
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Building2 className="size-6 text-blue-600" />
            <span className="font-bold text-lg text-slate-900">GovCompliance</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-slate-600">{userEmail}</span>
            <Button variant="ghost" size="sm" onClick={() => setUserRole(null)} className="text-slate-500 hover:text-slate-900">Logout</Button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-4 py-8">
        {userRole === "admin" && <AdminPanel />}
        {userRole === "authority" && <AuthorityPanel />}
        {userRole === "entrepreneur" && (
          <div className="flex flex-col gap-6">
            <div className="flex gap-2 p-1 bg-slate-200 rounded-lg w-fit mx-auto">
              <Button variant={activeTab === "status" ? "default" : "ghost"} onClick={() => setActiveTab("status")} className="rounded-md">My Applications</Button>
              <Button variant={activeTab === "new" ? "default" : "ghost"} onClick={() => setActiveTab("new")} className="rounded-md">File New Application</Button>
            </div>
            {activeTab === "new" ? <NewApplicationForm userEmail={userEmail} /> : <ApprovalsPanel userEmail={userEmail} />}
          </div>
        )}
      </main>
    </div>
  )
}
