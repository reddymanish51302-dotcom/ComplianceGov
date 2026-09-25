"use client"

import { useState } from "react"
import { Building2, CheckCircle2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Field, FieldDescription, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

const INDUSTRY_OPTIONS = [
  { value: "manufacturing", label: "Manufacturing" },
  { value: "technology", label: "Technology & Software" },
  { value: "energy", label: "Energy & Utilities" },
  { value: "healthcare", label: "Healthcare & Life Sciences" },
  { value: "agriculture", label: "Agriculture" },
  { value: "financial-services", label: "Financial Services" },
  { value: "logistics", label: "Logistics & Transportation" },
  { value: "construction", label: "Construction & Infrastructure" },
]

const INVESTMENT_SIZE_OPTIONS = [
  { value: "under-1m", label: "Under $1M" },
  { value: "1m-5m", label "$1M – $5M" },
  { value: "5m-25m", label: "$5M – $25M" },
  { value: "25m-100m", label: "$25M – $100M" },
  { value: "over-100m", label: "Over $100M" },
]

export function NewApplicationForm() {
  const [companyName, setCompanyName] = useState("")
  const [industry, setIndustry] = useState("")
  const [investmentSize, setInvestmentSize] = useState("")
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  const isValid = companyName.trim().length > 0 && industry !== "" && investmentSize !== ""

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!isValid) return

    setLoading(true)

    try {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
      const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

      // 1. Check if Vercel actually has your environment variables loaded
      if (!supabaseUrl || !supabaseKey) {
        alert("CRITICAL ERROR: Supabase URL or Anon Key is missing in Vercel Environment Variables!")
        setLoading(false)
        return
      }

      // 2. Native Fetch API (Bypasses all package dependencies & Vercel build crashes)
      const response = await fetch(`${supabaseUrl}/rest/v1/application`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "apikey": supabaseKey,
          "Authorization": `Bearer ${supabaseKey}`,
          "Prefer": "return=minimal"
        },
        body: JSON.stringify({
          company_name: companyName,
          industry_type: industry,
          investment_size: investmentSize
        })
      })

      // 3. Handle result
      if (!response.ok) {
        const errorText = await response.text()
        alert("Database Error: " + errorText)
      } else {
        setSubmitted(true)
      }
    } catch (error: any) {
      alert("Network Error: " + error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-6">
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            New Application
          </h1>
          <Badge variant="secondary">Form 1-A</Badge>
        </div>
        <p className="text-sm text-muted-foreground">
          Submit company details to initiate a new regulatory compliance and incentive
          eligibility review.
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2.5">
            <div className="flex size-9 items-center justify-center rounded-md bg-primary/10 text-primary">
              <Building2 className="size-4.5" />
            </div>
            <div className="flex flex-col">
              <CardTitle>Company Information</CardTitle>
              <CardDescription>
                All fields are required to submit an application for review.
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <Separator />

        <form onSubmit={handleSubmit}>
          <CardContent className="pt-6">
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="company-name">Company Name</FieldLabel>
                <Input
                  id="company-name"
                  placeholder="e.g. Meridian Manufacturing Co."
                  value={companyName}
                  onChange={(event) => setCompanyName(event.target.value)}
                  autoComplete="organization"
                />
                <FieldDescription>
                  Enter the full legal name as registered with the state.
                </FieldDescription>
              </Field>

              <Field>
                <FieldLabel htmlFor="industry-type">Industry Type</FieldLabel>
                <Select value={industry} onValueChange={setIndustry} items={INDUSTRY_OPTIONS}>
                  <SelectTrigger id="industry-type" className="w-full">
                    <SelectValue placeholder="Select an industry" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {INDUSTRY_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                <FieldDescription>
                  Choose the primary sector this application applies to.
                </FieldDescription>
              </Field>

              <Field>
                <FieldLabel htmlFor="investment-size">Investment Size</FieldLabel>
                <Select
                  value={investmentSize}
                  onValueChange={setInvestmentSize}
                  items={INVESTMENT_SIZE_OPTIONS}
                >
                  <SelectTrigger id="investment-size" className="w-full">
                    <SelectValue placeholder="Select an investment range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {INVESTMENT_SIZE_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                <FieldDescription>
                  Estimated total capital investment associated with this project.
                </FieldDescription>
              </Field>
            </FieldGroup>
          </CardContent>

          <Separator />

          <CardFooter className="flex items-center justify-between gap-3 pt-6">
            {submitted ? (
              <span className="flex items-center gap-1.5 text-sm font-medium text-primary">
                <CheckCircle2 className="size-4" />
                Application submitted for review
              </span>
            ) : (
              <span className="text-xs text-muted-foreground">
                Your application will be routed to a compliance officer within 2 business
                days.
              </span>
            )}
            <div className="flex gap-2">
              <Button type="button" variant="outline" onClick={() => {
                setCompanyName("")
                setIndustry("")
                setInvestmentSize("")
                setSubmitted(false)
              }}>
                Reset
              </Button>
              <Button type="submit" disabled={!isValid || loading}>
                {loading ? "Submitting..." : "Submit Application"}
              </Button>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
