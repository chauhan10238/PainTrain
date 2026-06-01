'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { 
  Loader2, 
  Upload, 
  CheckCircle2, 
  FileText, 
  ScanFace,
  AlertCircle,
  ExternalLink
} from 'lucide-react'

interface ClientPortalFormProps {
  clientId: string
  token: string
  clientType: string
  firstName?: string
  lastName?: string
  email?: string
  phone?: string
  entityName?: string
  verificationPoints: number
  stripeIdentityStatus?: string | null
}

export function ClientPortalForm({
  clientId,
  token,
  clientType,
  firstName,
  lastName,
  email,
  phone,
  entityName,
  verificationPoints,
  stripeIdentityStatus,
}: ClientPortalFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [step, setStep] = useState<'details' | 'documents' | 'verification'>(
    verificationPoints >= 100 ? 'verification' : 'documents'
  )

  const [formData, setFormData] = useState({
    firstName: firstName || '',
    lastName: lastName || '',
    email: email || '',
    phone: phone || '',
  })

  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])

  const handleDetailsSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/client-portal/${token}/update-details`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to update details')
      }

      setStep('documents')
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    setIsUploading(true)
    setError(null)

    const formData = new FormData()
    for (let i = 0; i < files.length; i++) {
      formData.append('files', files[i])
    }

    try {
      const response = await fetch(`/api/client-portal/${token}/upload-documents`, {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to upload documents')
      }

      setUploadedFiles(prev => [...prev, ...Array.from(files)])
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setIsUploading(false)
    }
  }

  const handleStartVerification = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/client-portal/${token}/start-verification`, {
        method: 'POST',
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to start verification')
      }

      if (data.url) {
        window.location.href = data.url
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  const hasEnoughPoints = verificationPoints >= 100

  return (
    <div className="space-y-6">
      {error && (
        <div className="flex items-center gap-3 rounded-lg bg-red-50 p-4 dark:bg-red-950">
          <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
          <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
        </div>
      )}

      {/* Step 1: Personal Details */}
      <Card className={step !== 'details' && firstName ? 'border-[#10B981]/30' : ''}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-[#10B981]" />
              <CardTitle className="text-lg">Personal Details</CardTitle>
            </div>
            {firstName && <Badge className="bg-[#10B981]">Complete</Badge>}
          </div>
          <CardDescription>
            Please confirm your personal information
          </CardDescription>
        </CardHeader>
        {(step === 'details' || !firstName) && (
          <CardContent>
            <form onSubmit={handleDetailsSubmit} className="space-y-4">
              {clientType === 'individual' ? (
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      value={formData.firstName}
                      onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      value={formData.lastName}
                      onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                      required
                    />
                  </div>
                </div>
              ) : (
                <div>
                  <Label htmlFor="entityName">Entity Name</Label>
                  <Input
                    id="entityName"
                    value={entityName || ''}
                    disabled
                  />
                </div>
              )}
              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  required
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                />
              </div>
              <Button type="submit" disabled={isLoading} className="w-full bg-[#10B981] hover:bg-[#059669]">
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  'Continue to Documents'
                )}
              </Button>
            </form>
          </CardContent>
        )}
      </Card>

      {/* Step 2: Document Upload */}
      <Card className={hasEnoughPoints ? 'border-[#10B981]/30' : ''}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Upload className="h-5 w-5 text-[#10B981]" />
              <CardTitle className="text-lg">Upload Documents</CardTitle>
            </div>
            {hasEnoughPoints ? (
              <Badge className="bg-[#10B981]">{verificationPoints} Points</Badge>
            ) : (
              <Badge variant="outline">{verificationPoints}/100 Points</Badge>
            )}
          </div>
          <CardDescription>
            Upload your identification documents (passport, drivers license, etc.)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="rounded-lg border-2 border-dashed border-muted-foreground/25 p-8 text-center">
              <Upload className="mx-auto h-10 w-10 text-muted-foreground" />
              <p className="mt-2 text-sm text-muted-foreground">
                Drag and drop files here, or click to select
              </p>
              <input
                type="file"
                accept="image/*,.pdf"
                multiple
                onChange={handleFileUpload}
                className="hidden"
                id="file-upload"
                disabled={isUploading}
              />
              <Button
                type="button"
                variant="outline"
                className="mt-4"
                onClick={() => document.getElementById('file-upload')?.click()}
                disabled={isUploading}
              >
                {isUploading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  'Select Files'
                )}
              </Button>
            </div>

            {uploadedFiles.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm font-medium">Uploaded Files:</p>
                {uploadedFiles.map((file, i) => (
                  <div key={i} className="flex items-center gap-2 rounded-lg bg-muted p-2">
                    <CheckCircle2 className="h-4 w-4 text-[#10B981]" />
                    <span className="text-sm">{file.name}</span>
                  </div>
                ))}
              </div>
            )}

            <div className="rounded-lg bg-muted/50 p-4">
              <p className="text-sm font-medium">Accepted Documents:</p>
              <ul className="mt-2 grid gap-1 text-sm text-muted-foreground sm:grid-cols-2">
                <li>• Australian Passport (70 pts)</li>
                <li>• Drivers License (70 pts)</li>
                <li>• Foreign Passport (70 pts)</li>
                <li>• Medicare Card (25 pts)</li>
                <li>• Birth Certificate (70 pts)</li>
                <li>• Utility Bill (25 pts)</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Step 3: Identity Verification */}
      <Card className={stripeIdentityStatus === 'verified' ? 'border-[#10B981]/30' : ''}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ScanFace className="h-5 w-5 text-[#10B981]" />
              <CardTitle className="text-lg">Identity Verification</CardTitle>
            </div>
            {stripeIdentityStatus === 'verified' ? (
              <Badge className="bg-[#10B981]">Verified</Badge>
            ) : stripeIdentityStatus === 'processing' ? (
              <Badge variant="secondary">Processing</Badge>
            ) : (
              <Badge variant="outline">Pending</Badge>
            )}
          </div>
          <CardDescription>
            Complete biometric verification to finalise your onboarding
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!hasEnoughPoints ? (
            <div className="flex items-center gap-3 rounded-lg bg-yellow-50 p-4 dark:bg-yellow-950">
              <AlertCircle className="h-5 w-5 text-yellow-600" />
              <p className="text-sm text-yellow-700 dark:text-yellow-300">
                Please upload enough documents to reach 100 points before proceeding with identity verification.
              </p>
            </div>
          ) : stripeIdentityStatus === 'verified' ? (
            <div className="flex items-center gap-3 rounded-lg bg-[#10B981]/10 p-4">
              <CheckCircle2 className="h-5 w-5 text-[#10B981]" />
              <p className="text-sm text-[#10B981]">
                Your identity has been successfully verified!
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Click the button below to start the secure identity verification process. 
                You will need to take a selfie and verify your ID document.
              </p>
              <Button 
                onClick={handleStartVerification}
                disabled={isLoading}
                className="w-full bg-[#10B981] hover:bg-[#059669]"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Starting Verification...
                  </>
                ) : (
                  <>
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Start Identity Verification
                  </>
                )}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
