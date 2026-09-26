"use client"

import { useState } from "react"
import { Menu, Landmark, Lock, Mail, ArrowRight, LogOut } from "lucide-react"

import {
  DashboardSidebar,
  MobileSidebarContent,
  NAV_ITEMS,
  type DashboardTab,
} from "@/components/compliance/dashboard-sidebar"
import { NewApplicationForm } from "@/components/compliance/new-application-form"
import { ApprovalsPanel } from "@/components/compliance/approvals-panel"
import { IncentivesPanel } from "@/components/compliance/incentives-panel"
import { AdminPanel } from "@/components/compliance/admin-panel"
import { buttonVariants, Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function Page() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userRole, setUserRole] = useState<"entrepreneur" | "si" | null>(null)
  const [loginEmail, setLoginEmail] = useState("")
  const [loginPassword, setLoginPassword] = useState("")

  const [activeTab, setActiveTab] = useState<DashboardTab | "admin">("new-application")
  const [mobileNavOpen, setMobileNavOpen] = useState(false)

  const activeItem = NAV_ITEMS.find((item) => item.id === activeTab) || {
    id: "admin",
    label: "Admin / SI Dashboard",
    description: "Secure area for System Inspectors to review and route applications."
  }

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (loginPassword === "admin123") {
      setUserRole("si")
      setActiveTab("admin")
      setIsLoggedIn(true)
    } else if (loginEmail && loginPassword) {
      setUserRole("entrepreneur")
      setActiveTab("new-application")
      setIsLoggedIn(true)
    }
  }

  const handleLogout = () => {
    setIsLoggedIn(false)
    setUserRole(null)
    setLoginEmail("")
    setLoginPassword("")
  }

  if (!isLoggedIn) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
        <Card className="w-full max-w-md shadow-lg border-t-4 border-t-blue-600">
          <CardHeader className="space-y-1 text-center pb-6">
            <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-full bg-blue-100 shadow-sm">
              <Landmark className="size-7 text-blue-600" />
            </div>
            <CardTitle className="text-2xl font-bold text-slate-900">ComplianceGov Portal</CardTitle>
            <CardDescription className="text-slate-500">
              Sign in to file and manage your business compliance.
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleLogin}>
            <CardContent className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 size-4 text-slate-400" />
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="founder@company.com" 
                    className="pl-9"
                    required
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 size-4 text-slate-400" />
                  <Input 
                    id="password" 
                    type="password"
                    placeholder="••••••••"
                    className="pl-9"
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex-col pt-2 pb-6">
              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-md h-11">
                Secure Sign In <ArrowRight className="ml-2 size-4" />
              </Button>
              
              <div className="mt-6 w-full rounded-md bg-slate-100 p-4 text-sm text-slate-700 border border-slate-200">
                <p className="font-bold text-slate-900 mb-2 flex items-center gap-2">
                  <span>🧑‍⚖️</span> Hackathon Demo Logins
                </p>
                <div className="space-y-2 text-xs">
                  <p>Entrepreneur A: <code className="bg-white px-1 py-0.5 rounded border">user1@startup.com</code> / Any Pass</p>
                  <p>Entrepreneur B: <code className="bg-white px-1 py-0.5 rounded border">user2@tech.com</code> / Any Pass</p>
                  <p>Govt Inspector: <code className="bg-white px-1 py-0.5 rounded border">admin@gov.in</code> / Pass: <code className="font-bold text-red-600">admin123</code></p>
                </div>
              </div>
            </CardFooter>
          </form>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex h-screen w-full bg-background">
      {userRole === "entrepreneur" && (
        <DashboardSidebar activeTab={activeTab as DashboardTab} onTabChange={setActiveTab as any} />
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-14 shrink-0 items-center justify-between border-b border-border bg-background px-4 sm:px-6 md:h-16 md:px-10 shadow-sm z-10">
          <div className="flex items-center gap-3">
            {userRole === "entrepreneur" && (
              <Sheet open={mobileNavOpen} onOpenChange={setMobileNavOpen}>
                <SheetTrigger className={buttonVariants({ variant: "outline", size: "icon", className: "md:hidden" })}>
                  <Menu />
                </SheetTrigger>
                <SheetContent side="left" className="w-72 p-0">
                  <SheetTitle className="sr-only">Navigation</SheetTitle>
                  <MobileSidebarContent
                    activeTab={activeTab as DashboardTab}
                    onTabChange={(tab) => {
                      setActiveTab(tab)
                      setMobileNavOpen(false)
                    }}
                  />
                </SheetContent>
              </Sheet>
            )}

            <div className="flex items-center gap-2">
              <div className="flex size-8 items-center justify-center rounded-md bg-blue-600 text-white">
                <Landmark className="size-4" />
              </div>
              <span className="text-lg font-bold text-slate-900 hidden sm:inline-block">ComplianceGov</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden text-sm font-medium text-slate-700 md:flex flex-col items-end">
              <span>{userRole === "si" ? "Inspector Portal" : loginEmail}</span>
              <span className="text-xs text-slate-400 capitalize">{userRole} Account</span>
            </div>
            <Button variant="outline" size="sm" onClick={handleLogout} className="flex items-center gap-2">
              <LogOut className="size-4" /> Sign Out
            </Button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto bg-slate-50/50">
          <div className="px-4 py-6 sm:px-6 sm:py-8 md:px-10 md:py-10 h-full">
            {activeTab === "new-application" && <NewApplicationForm userEmail={loginEmail} />}
            {activeTab === "approvals" && <ApprovalsPanel userEmail={loginEmail} />}
            {activeTab === "incentives" && <IncentivesPanel />}
            {activeTab === "admin" && <AdminPanel />}
          </div>
        </main>
      </div>
    </div>
  )
}
