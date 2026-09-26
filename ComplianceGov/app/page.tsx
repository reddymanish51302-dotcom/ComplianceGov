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
  // Authentication State
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userRole, setUserRole] = useState<"entrepreneur" | "si" | null>(null)
  const [loginEmail, setLoginEmail] = useState("")
  const [loginPassword, setLoginPassword] = useState("")

  // Navigation State
  const [activeTab, setActiveTab] = useState<DashboardTab | "admin">("new-application")
  const [mobileNavOpen, setMobileNavOpen] = useState(false)

  // Fallback for active item details
  const activeItem = NAV_ITEMS.find((item) => item.id === activeTab) || {
    id: "admin",
    label: "Admin / SI Dashboard",
    description: "Secure area for System Inspectors to review and approve applications."
  }

  // --- HACKATHON LOGIN LOGIC ---
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    
    // The "Secret Agent" trick: If the password is admin123, log them in as the SI.
    if (loginPassword === "admin123") {
      setUserRole("si")
      setActiveTab("admin")
      setIsLoggedIn(true)
    } 
    // Otherwise, treat them as a normal Entrepreneur
    else if (loginEmail && loginPassword) {
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

  // 1. IF NOT LOGGED IN: Show the beautiful Login Screen
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
            <CardFooter className="pt-2 pb-6">
              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-md h-11">
                Secure Sign In <ArrowRight className="ml-2 size-4" />
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    )
  }

  // 2. IF LOGGED IN: Show the Main Application Dashboard
  return (
    <div className="flex h-screen w-full bg-background">
      {/* Hide the Sidebar if they are logged in as the Inspector */}
      {userRole === "entrepreneur" && (
        <DashboardSidebar activeTab={activeTab as DashboardTab} onTabChange={setActiveTab as any} />
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        {/* Top Header */}
        <header className="flex h-14 shrink-0 items-center justify-between border-b border-border bg-background px-4 sm:px-6 md:h-16 md:px-10 shadow-sm z-10">
          
          <div className="flex items-center gap-3">
            {userRole === "entrepreneur" && (
              <Sheet open={mobileNavOpen} onOpenChange={setMobileNavOpen}>
                <SheetTrigger
                  className={buttonVariants({ variant: "outline", size: "icon", className: "md:hidden" })}
                  aria-label="Open navigation menu"
                >
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

            {userRole === "entrepreneur" && (
              <div className="hidden flex-col md:flex ml-4 border-l pl-4">
                <h1 className="text-sm font-semibold leading-tight text-slate-900">{activeItem.label}</h1>
                <p className="text-xs leading-tight text-slate-500">{activeItem.description}</p>
              </div>
            )}
          </div>

          {/* User Profile & Logout Button (Replaces the old SI Login) */}
          <div className="flex items-center gap-4">
            <div className="hidden text-sm font-medium text-slate-700 md:flex flex-col items-end">
              <span>{userRole === "si" ? "Inspector Portal" : loginEmail}</span>
              <span className="text-xs text-slate-400 capitalize">{userRole} Account</span>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleLogout}
              className="flex items-center gap-2 border-slate-200 hover:bg-slate-100 text-slate-700"
            >
              <LogOut className="size-4" />
              <span className="hidden sm:inline">Sign Out</span>
            </Button>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto bg-slate-50/50">
          <div className="px-4 py-6 sm:px-6 sm:py-8 md:px-10 md:py-10 h-full">
            {activeTab === "new-application" && <NewApplicationForm />}
            {activeTab === "approvals" && <ApprovalsPanel />}
            {activeTab === "incentives" && <IncentivesPanel />}
            {activeTab === "admin" && <AdminPanel />}
          </div>
        </main>
      </div>
    </div>
  )
}
