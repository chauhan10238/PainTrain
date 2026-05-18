'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog'
import { 
  Shield, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  ExternalLink,
  ScanFace,
  FileCheck,
  Clock
} from 'lucide-react'

interface StripeIdentityVerificationProps {
  clientId: string
  clientName: string
  verificationPoints: number
  stripeIdentityStatus?: string | null
  biometricVerifiedAt?: string | null
  onboardingStatus?: string | null
  riskScore?: number | null
}

export function StripeIdentityVerification({
  clientId,
  clientName,
  verificationPoints,
  stripeIdentityStatus,
  biometricVerifiedAt,
  onboardingStatus,
  riskScore,
}: StripeIdentityVerificationProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [verificationUrl, setVerificationUrl] = useState<string | null>(null)
  const [showDialog, setShowDialog] = useState(false)

  const canStartVerification = verificationPoints >= 100 && 
    (!stripeIdentityStatus || ['failed', 'canceled'].includes(stripeIdentityStatus))
  
  const isVerified = stripeIdentityStatus === 'verified'
  const isPending = stripeIdentityStatus === 'processing' || stripeIdentityStatus === 'requires_input'

  const handleStartVerification = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/stripe/identity/create-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ clientId }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create verification session')
      }

      if (data.url) {
        setVerificationUrl(data.url)
        setShowDialog(true)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  const handleOpenVerification = () => {
    if (verificationUrl) {
      window.open(verificationUrl, '_blank', 'noopener,noreferrer')
      setShowDialog(false)
      // Refresh page after a delay to check status
      setTimeout(() => router.refresh(), 5000)
    }
  }

  const getStatusBadge = () => {
    switch (stripeIdentityStatus) {
      case 'verified':
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">Verified</Badge>
      case 'processing':
        return <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">Processing</Badge>
      case 'requires_input':
        return <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">Action Required</Badge>
      case 'failed':
        return <Badge variant="destructive">Failed</Badge>
      case 'canceled':
        return <Badge variant="secondary">Canceled</Badge>
      default:
        return <Badge variant="outline">Not Started</Badge>
    }
  }

  const getOnboardingBadge = () => {
    switch (onboardingStatus) {
      case 'completed':
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">Onboarding Complete</Badge>
      case 'identity_verified':
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">Identity Verified</Badge>
      case 'identity_pending':
        return <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">Identity Pending</Badge>
      case 'documents_uploaded':
        return <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">Ready for Biometric</Badge>
      case 'failed':
        return <Badge variant="destructive">Failed</Badge>
      default:
        return <Badge variant="outline">Pending Documents</Badge>
    }
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ScanFace className="h-5 w-5 text-primary" />
              <CardTitle className="text-lg">Biometric Verification</CardTitle>
            </div>
            {getStatusBadge()}
          </div>
          <CardDescription>
            Stripe Identity verification for enhanced security and AML compliance
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Status Overview */}
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-lg border p-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <FileCheck className="h-4 w-4" />
                Document Points
              </div>
              <div className="mt-1 text-2xl font-bold">{verificationPoints}/100</div>
            </div>
            <div className="rounded-lg border p-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Shield className="h-4 w-4" />
                Risk Score
              </div>
              <div className="mt-1 text-2xl font-bold">{riskScore ?? 0}/100</div>
            </div>
            <div className="rounded-lg border p-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                Onboarding
              </div>
              <div className="mt-1">{getOnboardingBadge()}</div>
            </div>
          </div>

          {/* Verification Status */}
          {isVerified && biometricVerifiedAt && (
            <div className="flex items-center gap-3 rounded-lg bg-green-50 p-4 dark:bg-green-950">
              <CheckCircle2 className="h-6 w-6 text-green-600 dark:text-green-400" />
              <div>
                <p className="font-medium text-green-800 dark:text-green-200">
                  Biometric Verification Complete
                </p>
                <p className="text-sm text-green-700 dark:text-green-300">
                  Verified on {new Date(biometricVerifiedAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          )}

          {isPending && (
            <div className="flex items-center gap-3 rounded-lg bg-blue-50 p-4 dark:bg-blue-950">
              <Loader2 className="h-6 w-6 animate-spin text-blue-600 dark:text-blue-400" />
              <div>
                <p className="font-medium text-blue-800 dark:text-blue-200">
                  Verification In Progress
                </p>
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  {stripeIdentityStatus === 'requires_input' 
                    ? 'Additional information may be required from the client'
                    : 'The verification is being processed by Stripe'}
                </p>
              </div>
            </div>
          )}

          {verificationPoints < 100 && (
            <div className="flex items-center gap-3 rounded-lg bg-yellow-50 p-4 dark:bg-yellow-950">
              <AlertCircle className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
              <div>
                <p className="font-medium text-yellow-800 dark:text-yellow-200">
                  Complete Document Verification First
                </p>
                <p className="text-sm text-yellow-700 dark:text-yellow-300">
                  Client needs {100 - verificationPoints} more points to unlock biometric verification
                </p>
              </div>
            </div>
          )}

          {error && (
            <div className="flex items-center gap-3 rounded-lg bg-red-50 p-4 dark:bg-red-950">
              <AlertCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
              <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
            </div>
          )}

          {/* Action Button */}
          {canStartVerification && (
            <Button 
              onClick={handleStartVerification} 
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating Session...
                </>
              ) : (
                <>
                  <ScanFace className="mr-2 h-4 w-4" />
                  Start Biometric Verification
                </>
              )}
            </Button>
          )}

          {stripeIdentityStatus === 'failed' && (
            <Button 
              onClick={handleStartVerification} 
              disabled={isLoading}
              variant="outline"
              className="w-full"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating Session...
                </>
              ) : (
                <>
                  <ScanFace className="mr-2 h-4 w-4" />
                  Retry Biometric Verification
                </>
              )}
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Verification Link Dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ScanFace className="h-5 w-5 text-primary" />
              Biometric Verification Ready
            </DialogTitle>
            <DialogDescription>
              A verification session has been created for {clientName}. 
              Click below to open the Stripe Identity verification flow.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div className="rounded-lg bg-muted p-4 text-sm">
              <p className="font-medium">What happens next:</p>
              <ul className="mt-2 list-inside list-disc space-y-1 text-muted-foreground">
                <li>Client takes a selfie for biometric matching</li>
                <li>ID document is verified for authenticity</li>
                <li>Results are automatically updated in the CRM</li>
                <li>Risk score and AML status will be recalculated</li>
              </ul>
            </div>
            <Button onClick={handleOpenVerification} className="w-full">
              <ExternalLink className="mr-2 h-4 w-4" />
              Open Verification Flow
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
