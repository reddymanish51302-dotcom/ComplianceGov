"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle2, UploadCloud, FileText } from "lucide-react"

const SUPABASE_URL = "https://leolsqraajajphguipzx.supabase.co"
const SUPABASE_ANON_KEY = "sb_publishable_DN_9JJ38bQZxkrfrTKqNcQ_rEEPjE4J"

export function NewApplicationForm({ userEmail }: { userEmail?: string }) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  
  const [companyName, setCompanyName] = useState("")
  const [industry, setIndustry] = useState("")
  const [investment, setInvestment] = useState("")
  const [file, setFile] = useState<File | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      let documentUrl = null

      if (file) {
        const fileExt = file.name.split('.').pop()
        const safeFileName = `${Date.now()}_doc.${fileExt}`
        
        const uploadResponse = await fetch(`${SUPABASE_URL}/storage/v1/object/documents/${safeFileName}`, {
          method: "POST",
          headers: {
            apikey: SUPABASE_ANON_KEY,
            Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
            "Content-Type": file.type || "application/octet-stream",
          },
          body: file,
        })

        if (!uploadResponse.ok) {
          throw new Error("Failed to upload document")
        }

        documentUrl = `${SUPABASE_URL}/storage/v1/object/public/documents/${safeFileName}`
      }

      // Calculate 7-Day SLA Target Date
      const targetDate = new Date()
      targetDate.setDate(targetDate.getDate() + 7)
      const formattedDeadline = targetDate.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })

      const response = await fetch(`${SUPABASE_URL}/rest/v1/application`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: SUPABASE_ANON_KEY,
          Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
          Prefer: "return=minimal"
        },
        body: JSON.stringify({
          user_email: userEmail || "anonymous@user.com",
          company_name: companyName,
          industry_type: industry,
          investment_size: investment,
          document_url: documentUrl, 
          document_name: file ? file.name : "Document.pdf",
          status: "Pending",
          stage: "Under SI Review",
          deadline: formattedDeadline
        }),
      })

      if (!response.ok) throw new Error("Failed to save application")
      setIsSubmitted(true)
    } catch (error) {
      console.error("Submission error:", error)
      alert("Submission error. Ensure Supabase columns match.")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSubmitted) {
    return (
      <Card className="mx-auto max-w-2xl text-center shadow-md">
        <CardContent className="flex flex-col items-center gap-4 pt-10 pb-10">
          <CheckCircle2 className="size-16 text-green-500" />
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-slate-900">Application Filed Successfully!</h2>
            <p className="text-sm text-slate-600">
              Submitted for <span className="font-semibold text-slate-900">{userEmail}</span>. Assigned to Scrutiny Inspector.
            </p>
          </div>
          <Button 
            className="mt-4 bg-blue-600 hover:bg-blue-700 text-white"
            onClick={() => {
              setIsSubmitted(false)
              setCompanyName("")
              setIndustry("")
              setInvestment("")
              setFile(null)
            }}
          >
            Submit Another Application
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-6 p-6">
      <div className="flex flex-col gap-1.5">
        <h1 className="text-2xl font-bold text-slate-900">New Application Filing</h1>
        <p className="text-sm text-slate-500">
          Filing application as: <span className="font-semibold text-blue-600">{userEmail || "Guest"}</span>
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <div className="space-y-2">
          <Label htmlFor="companyName">Company Name</Label>
          <Input id="companyName" placeholder="Enter full legal company name" required value={companyName} onChange={(e) => setCompanyName(e.target.value)} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="industry">Industry Sector</Label>
          <Select required onValueChange={setIndustry} value={industry}>
            <SelectTrigger><SelectValue placeholder="Select primary sector" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="manufacturing">Manufacturing</SelectItem>
              <SelectItem value="technology">IT / Technology</SelectItem>
              <SelectItem value="energy">Energy & Power</SelectItem>
              <SelectItem value="retail">Retail & Commerce</SelectItem>
            </SelectContent>
          </Select>

          {/* FIXED: DYNAMIC DOCUMENT REQUIREMENTS DISPLAY */}
          {industry && (
            <div className="mt-3 rounded-md border border-blue-200 bg-blue-50 p-4">
              <h4 className="text-sm font-semibold text-blue-900 mb-2">
                Required Documents for {industry.charAt(0).toUpperCase() + industry.slice(1)} Sector:
              </h4>
              <ul className="list-disc pl-5 text-sm text-blue-800 space-y-1">
                {industry === "manufacturing" && (
                  <>
                    <li>State Pollution Control Board Clearance (NOC)</li>
                    <li>Factory Inspectorate License</li>
                    <li>Fire Safety Certificate</li>
                  </>
                )}
                {industry === "technology" && (
                  <>
                    <li>Shops and Establishments Registration</li>
                    <li>Data Privacy & Security Compliance Declaration</li>
                  </>
                )}
                {industry === "energy" && (
                  <>
                    <li>Environmental Impact Assessment (EIA) Report</li>
                    <li>Ministry of Power Grid Connectivity Approval</li>
                  </>
                )}
                {industry === "retail" && (
                  <>
                    <li>Trade License from Local Municipality</li>
                    <li>FSSAI License (If selling food/beverages)</li>
                    <li>GST Registration Certificate</li>
                  </>
                )}
              </ul>
            </div>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="investment">Investment Capital</Label>
          <Select required onValueChange={setInvestment} value={investment}>
            <SelectTrigger><SelectValue placeholder="Select capital investment" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="under-5m">Under 5 Million INR</SelectItem>
              <SelectItem value="5m-25m">5M to 25 Million INR</SelectItem>
              <SelectItem value="25m-100m">25M to 100 Million INR</SelectItem>
              <SelectItem value="over-100m">Over 100 Million INR</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="document">Upload Certificate / NOC</Label>
          <div className="flex items-center gap-3">
            <Input id="document" type="file" required className="cursor-pointer" onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)} />
            {file && <UploadCloud className="size-5 text-blue-600 shrink-0" />}
          </div>
          
          {/* FIXED: SHOW THE SELECTED FILE NAME TO THE USER */}
          {file && (
            <div className="mt-2 flex items-center gap-2 rounded-md bg-blue-50/80 p-2.5 text-sm text-blue-700 border border-blue-200">
              <FileText className="size-4 shrink-0" />
              <span className="font-medium truncate">Selected: {file.name}</span>
            </div>
          )}
        </div>

        <Button type="submit" disabled={isSubmitting} className="w-full bg-blue-600 hover:bg-blue-700 text-white shadow-sm">
          {isSubmitting ? "Uploading & Submitting..." : "Submit Application"}
        </Button>
      </form>
    </div>
  )
}
