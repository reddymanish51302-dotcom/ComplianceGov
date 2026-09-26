"use client"

import { useState } from "react"
import { Menu, Landmark, Lock } from "lucide-react"

import {
  DashboardSidebar,
  MobileSidebarContent,
  NAV_ITEMS,
  type DashboardTab,
} from "@/components/compliance/dashboard-sidebar"
import { NewApplicationForm } from "@/components/compliance/new-application-form"
import { ApprovalsPanel } from "@/components/compliance/approvals-panel"
import { IncentivesPanel } from "@/components/compliance/incentives-panel"
import { AdminPanel } from "@/components/compliance/admin-panel" // <-- IMPORTED NEW PANEL
import { buttonVariants } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet"

export default function Page() {
  // We added "admin" as an allowed tab state behind the scenes
  const [activeTab, setActiveTab] = useState<DashboardTab | "admin">("new-application")
  const [mobileNavOpen, setMobileNavOpen] = useState(false)

  // Fallback so the app doesn't crash if the Admin tab isn't in the standard sidebar list
  const activeItem = NAV_ITEMS.find((item) => item.id === activeTab) || {
    id: "admin",
    label: "Admin / SI Dashboard",
    description: "Secure area for System Inspectors to review and approve applications."
  }

  // THE HACKATHON SECURITY TRICK: Simple password prompt to unlock the view
  const handleAdminLogin = () => {
    const password = window.prompt("Enter System Inspector Password (Hint: type admin123):")
    if (password === "admin123") {
      setActiveTab("admin")
    } else if (password !== null) {
      alert("Unauthorized: Incorrect Password!")
    }
  }

  return (
    <div className="flex h-screen w-full bg-background">
      {/* We use 'as any' here briefly to tell TypeScript not to worry about the hidden admin tab */}
      <DashboardSidebar activeTab={activeTab as DashboardTab} onTabChange={setActiveTab as any} />

      <div className="flex min-w-0 flex-1 flex-col">
        {/* Top bar: Updated to include the Login Button on the far right */}
        <header className="flex h-14 shrink-0 items-center justify-between border-b border-border bg-background px-4 sm:px-6 md:h-16 md:px-10">
          
          {/* Left side of the header */}
          <div className="flex items-center gap-3">
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

            <div className="flex items-center gap-2 md:hidden">
              <div className="flex size-7 items-center justify-center rounded-md bg-primary text-primary-foreground">
                <Landmark className="size-4" />
              </div>
              <span className="text-sm font-semibold text-foreground">ComplianceGov</span>
            </div>

            <div className="hidden flex-col md:flex">
              <h1 className="text-base font-semibold leading-tight text-foreground">{activeItem.label}</h1>
              <p className="text-xs leading-tight text-muted-foreground">{activeItem.description}</p>
            </div>
          </div>

          {/* Right side of the header: SECURE SI LOGIN BUTTON */}
          <button 
            onClick={handleAdminLogin}
            className="flex items-center gap-2 rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200"
          >
            <Lock className="size-4" />
            SI Login
          </button>
        </header>

        <main className="flex-1 overflow-y-auto">
          <div className="px-4 py-6 sm:px-6 sm:py-8 md:px-10 md:py-10">
            {activeTab === "new-application" && <NewApplicationForm />}
            {activeTab === "approvals" && <ApprovalsPanel />}
            {activeTab === "incentives" && <IncentivesPanel />}
            {/* The hidden Admin Panel that only shows when unlocked */}
            {activeTab === "admin" && <AdminPanel />}
          </div>
        </main>
      </div>
    </div>
  )
}
