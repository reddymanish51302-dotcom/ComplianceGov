import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowUpRight, Percent, TrendingUp, Leaf } from "lucide-react"

const PROGRAMS = [
  {
    name: "Advanced Manufacturing Tax Credit",
    icon: TrendingUp,
    summary:
      "Up to 15% credit on qualified capital expenditures for manufacturing facility upgrades and equipment.",
    eligibility: "Manufacturing · Investment $5M+",
    tag: "High Demand",
  },
  {
    name: "Clean Energy Development Grant",
    icon: Leaf,
    summary:
      "Matching grant funding for renewable energy infrastructure projects, up to $10M per applicant.",
    eligibility: "Energy & Utilities · Investment $25M+",
    tag: "New",
  },
  {
    name: "Small Business Growth Rebate",
    icon: Percent,
    summary:
      "Rebate covering up to 8% of qualifying expansion costs for companies investing under $5M.",
    eligibility: "All Industries · Investment under $5M",
    tag: "Popular",
  },
]

export function IncentivesPanel() {
  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-6">
      <div className="flex flex-col gap-1.5">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">Incentives</h1>
        <p className="text-sm text-muted-foreground">
          Explore government incentive programs your organization may be eligible for based on
          industry and investment size.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {PROGRAMS.map((program) => {
          const Icon = program.icon
          return (
            <Card key={program.name} className="flex flex-col">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex size-9 items-center justify-center rounded-md bg-primary/10 text-primary">
                    <Icon className="size-4.5" />
                  </div>
                  <Badge variant="secondary">{program.tag}</Badge>
                </div>
                <CardTitle className="pt-2 text-base">{program.name}</CardTitle>
                <CardDescription>{program.summary}</CardDescription>
              </CardHeader>
              <CardContent className="mt-auto pt-0">
                <p className="text-xs font-medium text-muted-foreground">
                  {program.eligibility}
                </p>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">
                  View Requirements
                  <ArrowUpRight data-icon="inline-end" />
                </Button>
              </CardFooter>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
