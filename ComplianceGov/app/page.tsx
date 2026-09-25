"use client"

import { useState } from "react"
import { Menu, Landmark } from "lucide-react"

import {
  DashboardSidebar,
  MobileSidebarContent,
  NAV_ITEMS,
  type DashboardTab,
} from "@/components/compliance/dashboard-sidebar"
import { NewApplicationForm } from "@/components/compliance/new-application-form"
import { ApprovalsPanel } from "@/components/compliance/approvals-panel"
import { IncentivesPanel } from "@/components/compliance/incentives-panel"
import { buttonVariants } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet"

export default function Page() {
  const [activeTab, setActiveTab] = useState<DashboardTab>("new-application")
  const [mobileNavOpen, setMobileNavOpen] = useState(false)

  const activeItem = NAV_ITEMS.find((item) => item.id === activeTab)!

  return (
    <div className="flex h-screen w-full bg-background">
      <DashboardSidebar activeTab={activeTab} onTabChange={setActiveTab} />

      <div className="flex min-w-0 flex-1 flex-col">
        {/* Top bar: shows on all sizes, carries the mobile menu trigger */}
        <header className="flex h-14 shrink-0 items-center gap-3 border-b border-border bg-background px-4 sm:px-6 md:h-16 md:px-10">
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
                activeTab={activeTab}
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
        </header>

        <main className="flex-1 overflow-y-auto">
          <div className="px-4 py-6 sm:px-6 sm:py-8 md:px-10 md:py-10">
            {activeTab === "new-application" && <NewApplicationForm />}
            {activeTab === "approvals" && <ApprovalsPanel />}
            {activeTab === "incentives" && <IncentivesPanel />}
          </div>
        </main>
      </div>
    </div>
  )
}
