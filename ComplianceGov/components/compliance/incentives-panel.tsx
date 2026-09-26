"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { IndianRupee, Zap, Briefcase, Factory } from "lucide-react"

export function IncentivesPanel() {
  const schemes = [
    {
      title: "Manufacturing PLI Scheme",
      industry: "Manufacturing",
      benefit: "4% to 6% incentive on incremental sales",
      icon: <Factory className="size-5 text-blue-600" />,
      status: "Active",
    },
    {
      title: "IT/Tech Startup Tax Holiday",
      industry: "Technology",
      benefit: "100% tax exemption for 3 consecutive years",
      icon: <Zap className="size-5 text-yellow-600" />,
      status: "Active",
    },
    {
      title: "Green Energy Subsidy",
      industry: "Energy",
      benefit: "Up to 30% capital subsidy for solar installations",
      icon: <IndianRupee className="size-5 text-green-600" />,
      status: "Active",
    },
    {
      title: "MSME Employment Generation",
      industry: "All Sectors",
      benefit: "PF reimbursement for new hires",
      icon: <Briefcase className="size-5 text-purple-600" />,
      status: "Closing Soon",
    }
  ]

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-6 p-6">
      <div className="flex flex-col gap-1.5">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Government Incentives & Schemes
        </h1>
        <p className="text-sm text-muted-foreground">
          Discover available financial subsidies and tax benefits based on your industry.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {schemes.map((scheme, index) => (
          <Card key={index} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {scheme.icon}
                  <CardTitle className="text-lg">{scheme.title}</CardTitle>
                </div>
              </div>
              <CardDescription className="pt-2">
                Target Sector: <span className="font-medium text-slate-700">{scheme.industry}</span>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border bg-slate-50 p-3">
                <p className="text-sm font-medium text-slate-900">{scheme.benefit}</p>
              </div>
              <div className="mt-4 flex justify-between items-center">
                <Badge variant={scheme.status === "Active" ? "default" : "destructive"}>
                  {scheme.status}
                </Badge>
                <button className="text-sm font-medium text-blue-600 hover:underline">
                  Check Eligibility &rarr;
                </button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
