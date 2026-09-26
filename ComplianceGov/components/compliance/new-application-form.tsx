"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle2, UploadCloud } from "lucide-react"

// HARDCODED SUPABASE CREDENTIALS
const SUPABASE_URL = "https://leolsqraajajphguipzx.supabase.co"
const SUPABASE_ANON_KEY = "sb_publishable_DN_9JJ38bQZxkrfrTKqNcQ_rEEPjE4J"

export function NewApplicationForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  
  // Form State
  const [companyName, setCompanyName] = useState("")
  const [industry, setIndustry] = useState("")
  const [investment, setInvestment] = useState("")
  const [file, setFile] = useState<File | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      let documentUrl = null

      // 1. UPLOAD FILE TO STORAGE
      if (file) {
        // Generate a 100% URL-safe filename (e.g., 1709848_doc.png)
        const fileExt = file.name.split('.').pop()
        const safeFileName = `${Date.now()}_doc.${fileExt}`
        
        const uploadResponse = await fetch(`${SUPABASE_URL}/storage/v1/object/documents/${safeFileName}`, {
          method: "POST",
          headers: {
            apikey: SUPABASE_ANON_KEY,
            Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
            // Fallback to octet-stream if the browser fails to detect the file type
            "Content-Type": file.type || "application/octet-stream",
          },
          body: file,
        })

        if (!uploadResponse.ok) {
          // This will print the EXACT error from Supabase in your console
          const errorText = await uploadResponse.text()
          console.error("Supabase Upload Error:", errorText)
          throw new Error("Failed to upload document")
        }

        documentUrl = `${SUPABASE_URL}/storage/v1/object/public/documents/${safeFileName}`
      }

      // 2. SAVE DATA TO DATABASE
      const response = await fetch(`${SUPABASE_URL}/rest/v1/application`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: SUPABASE_ANON_KEY,
          Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
          Prefer: "return=minimal"
        },
        body: JSON.stringify({
          company_name: companyName,
          industry_type: industry,
          investment_size: investment,
          document_url: documentUrl, // Save the real file link!
          status: "Pending"
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to save application data")
      }

      setIsSubmitted(true)
    } catch (error) {
      console.error("Submission error:", error)
      alert("Something went wrong during submission. Check the console.")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSubmitted) {
    return (
      <Card className="mx-auto max-w-2xl text-center">
        <CardContent className="flex flex-col items-center gap-4 pt-10 pb-10">
          <CheckCircle2 className="size-16 text-green-500" />
          <div className="space-y-2">
            <h2 className="text-2xl font-bold tracking-tight text-slate-900">Application Submitted!</h2>
            <p className="text-muted-foreground">
              Your application and documents have been sent to the scrutiny inspector.
            </p>
          </div>
          <Button 
            className="mt-4"
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
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          New Application Filing
        </h1>
        <p className="text-sm text-muted-foreground">
          Submit a new compliance filing and upload your primary business documents.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <div className="space-y-2">
          <Label htmlFor="companyName">Company Name</Label>
          <Input
            id="companyName"
            placeholder="Enter the full legal name"
            required
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="industry">Industry Type</Label>
          <Select required onValueChange={setIndustry} value={industry}>
            <SelectTrigger>
              <SelectValue placeholder="Select primary sector" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="manufacturing">Manufacturing</SelectItem>
              <SelectItem value="technology">IT / Technology</SelectItem>
              <SelectItem value="energy">Energy & Power</SelectItem>
              <SelectItem value="retail">Retail & Commerce</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="investment">Investment Size</Label>
          <Select required onValueChange={setInvestment} value={investment}>
            <SelectTrigger>
              <SelectValue placeholder="Select capital investment" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="under-5m">Under 5 Million INR</SelectItem>
              <SelectItem value="5m-25m">5M to 25 Million INR</SelectItem>
              <SelectItem value="25m-100m">25M to 100 Million INR</SelectItem>
              <SelectItem value="over-100m">Over 100 Million INR</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="document">Supporting Document (PDF/Image)</Label>
          <div className="flex items-center gap-3">
            <Input
              id="document"
              type="file"
              required
              className="cursor-pointer"
              onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)}
            />
            {file && <UploadCloud className="size-5 text-blue-600" />}
          </div>
          <p className="text-xs text-muted-foreground">
            Please upload your primary incorporation certificate or NOC.
          </p>
        </div>

        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting ? "Uploading & Submitting..." : "Submit Application"}
        </Button>
      </form>
    </div>
  )
}
