import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Clock, CheckCircle2, AlertCircle } from "lucide-react"

const APPLICATIONS = [
  {
    company: "Meridian Manufacturing Co.",
    industry: "Manufacturing",
    investment: "$5M – $25M",
    status: "approved",
    submitted: "Sep 12, 2026",
  },
  {
    company: "Northgate BioSciences",
    industry: "Healthcare & Life Sciences",
    investment: "$25M – $100M",
    status: "in-review",
    submitted: "Sep 18, 2026",
  },
  {
    company: "Solara Grid Energy",
    industry: "Energy & Utilities",
    investment: "Over $100M",
    status: "in-review",
    submitted: "Sep 20, 2026",
  },
  {
    company: "Ferrum Logistics Group",
    industry: "Logistics & Transportation",
    investment: "$1M – $5M",
    status: "action-required",
    submitted: "Sep 22, 2026",
  },
  {
    company: "Vantage Fintech Holdings",
    industry: "Financial Services",
    investment: "$5M – $25M",
    status: "approved",
    submitted: "Sep 08, 2026",
  },
]

const STATUS_CONFIG = {
  approved: { label: "Approved", icon: CheckCircle2, variant: "default" as const },
  "in-review": { label: "In Review", icon: Clock, variant: "secondary" as const },
  "action-required": { label: "Action Required", icon: AlertCircle, variant: "destructive" as const },
}

export function ApprovalsPanel() {
  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-6">
      <div className="flex flex-col gap-1.5">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">Approvals</h1>
        <p className="text-sm text-muted-foreground">
          Review the status of submitted applications currently in the compliance pipeline.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Approved</CardDescription>
            <CardTitle className="text-3xl">2</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>In Review</CardDescription>
            <CardTitle className="text-3xl">2</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Action Required</CardDescription>
            <CardTitle className="text-3xl">1</CardTitle>
          </CardHeader>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Application Queue</CardTitle>
          <CardDescription>Sorted by most recent submission date.</CardDescription>
        </CardHeader>
        <Separator />
        <CardContent className="p-0">
          <ul className="divide-y divide-border">
            {APPLICATIONS.map((app) => {
              const status = STATUS_CONFIG[app.status as keyof typeof STATUS_CONFIG]
              const StatusIcon = status.icon
              return (
                <li key={app.company} className="flex items-center justify-between gap-4 px-6 py-4">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-sm font-medium text-foreground">{app.company}</span>
                    <span className="text-xs text-muted-foreground">
                      {app.industry} · {app.investment} · Submitted {app.submitted}
                    </span>
                  </div>
                  <Badge variant={status.variant} className="gap-1">
                    <StatusIcon className="size-3.5" data-icon="inline-start" />
                    {status.label}
                  </Badge>
                </li>
              )
            })}
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
