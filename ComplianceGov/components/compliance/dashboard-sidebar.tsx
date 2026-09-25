"use client"

import { cn } from "@/lib/utils"
import { FileText, ShieldCheck, BadgePercent, Landmark } from "lucide-react"

export type DashboardTab = "new-application" | "approvals" | "incentives"

export const NAV_ITEMS: { id: DashboardTab; label: string; description: string; icon: typeof FileText }[] = [
  {
    id: "new-application",
    label: "New Application",
    description: "Submit a compliance filing",
    icon: FileText,
  },
  {
    id: "approvals",
    label: "Approvals",
    description: "Track review status",
    icon: ShieldCheck,
  },
  {
    id: "incentives",
    label: "Incentives",
    description: "View eligible programs",
    icon: BadgePercent,
  },
]

function SidebarBrand() {
  return (
    <div className="flex items-center gap-2.5 border-b border-sidebar-border px-5 py-5">
      <div className="flex size-9 items-center justify-center rounded-md bg-primary text-primary-foreground">
        <Landmark className="size-5" />
      </div>
      <div className="flex flex-col">
        <span className="text-sm font-semibold leading-tight text-sidebar-foreground">ComplianceGov</span>
        <span className="text-xs leading-tight text-muted-foreground">Regulatory Portal</span>
      </div>
    </div>
  )
}

function SidebarFooter() {
  return (
    <div className="border-t border-sidebar-border p-4">
      <div className="flex items-center gap-3 rounded-md bg-sidebar-accent px-3 py-2.5">
        <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
          AO
        </div>
        <div className="flex flex-col overflow-hidden">
          <span className="truncate text-xs font-medium text-sidebar-foreground">Alex Okafor</span>
          <span className="truncate text-xs text-muted-foreground">Compliance Officer</span>
        </div>
      </div>
    </div>
  )
}

export function SidebarNav({
  activeTab,
  onTabChange,
}: {
  activeTab: DashboardTab
  onTabChange: (tab: DashboardTab) => void
}) {
  return (
    <nav className="flex flex-1 flex-col gap-1 p-3" aria-label="Primary">
      {NAV_ITEMS.map((item) => {
        const Icon = item.icon
        const isActive = activeTab === item.id
        return (
          <button
            key={item.id}
            type="button"
            onClick={() => onTabChange(item.id)}
            aria-current={isActive ? "page" : undefined}
            className={cn(
              "flex items-start gap-3 rounded-md px-3 py-2.5 text-left transition-colors",
              isActive
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-sidebar-foreground hover:bg-sidebar-accent",
            )}
          >
            <Icon className="mt-0.5 size-4 shrink-0" />
            <span className="flex flex-col">
              <span className="text-sm font-medium leading-tight">{item.label}</span>
              <span
                className={cn(
                  "text-xs leading-tight",
                  isActive ? "text-primary-foreground/80" : "text-muted-foreground",
                )}
              >
                {item.description}
              </span>
            </span>
          </button>
        )
      })}
    </nav>
  )
}

/** Persistent sidebar shown on md+ viewports. */
export function DashboardSidebar({
  activeTab,
  onTabChange,
}: {
  activeTab: DashboardTab
  onTabChange: (tab: DashboardTab) => void
}) {
  return (
    <aside className="hidden h-full w-64 shrink-0 flex-col border-r border-sidebar-border bg-sidebar md:flex">
      <SidebarBrand />
      <SidebarNav activeTab={activeTab} onTabChange={onTabChange} />
      <SidebarFooter />
    </aside>
  )
}

/** Full sidebar content reused inside the mobile Sheet drawer. */
export function MobileSidebarContent({
  activeTab,
  onTabChange,
}: {
  activeTab: DashboardTab
  onTabChange: (tab: DashboardTab) => void
}) {
  return (
    <div className="flex h-full flex-col bg-sidebar">
      <SidebarBrand />
      <SidebarNav activeTab={activeTab} onTabChange={onTabChange} />
      <SidebarFooter />
    </div>
  )
}
