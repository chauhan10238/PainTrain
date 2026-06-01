'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle,
  DialogTrigger 
} from '@/components/ui/dialog'
import { 
  Send, 
  Copy, 
  ExternalLink, 
  CheckCircle2, 
  Loader2,
  Link as LinkIcon,
  Mail
} from 'lucide-react'

interface ClientPortalLinkProps {
  clientId: string
  clientName: string
  clientEmail?: string | null
  onboardingToken?: string | null
  onboardingStatus?: string | null
}

export function ClientPortalLink({
  clientId,
  clientName,
  clientEmail,
  onboardingToken,
  onboardingStatus,
}: ClientPortalLinkProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [isSending, setIsSending] = useState(false)
  const [copied, setCopied] = useState(false)
  const [showDialog, setShowDialog] = useState(false)
  const [token, setToken] = useState(onboardingToken)
  const [error, setError] = useState<string | null>(null)

  const portalUrl = token 
    ? `${typeof window !== 'undefined' ? window.location.origin : ''}/client/${token}`
    : null

  const handleGenerateLink = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/clients/${clientId}/generate-portal-link`, {
        method: 'POST',
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate link')
      }

      setToken(data.token)
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCopyLink = async () => {
    if (!portalUrl) return
    
    try {
      await navigator.clipboard.writeText(portalUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const handleSendEmail = async () => {
    if (!clientEmail || !portalUrl) return
    
    setIsSending(true)
    setError(null)

    try {
      const response = await fetch(`/api/clients/${clientId}/send-portal-link`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: clientEmail, portalUrl }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send email')
      }

      setShowDialog(false)
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setIsSending(false)
    }
  }

  const getStatusBadge = () => {
    switch (onboardingStatus) {
      case 'completed':
        return <Badge className="bg-green-100 text-green-800">Completed</Badge>
      case 'identity_verified':
        return <Badge className="bg-green-100 text-green-800">Identity Verified</Badge>
      case 'identity_pending':
        return <Badge className="bg-blue-100 text-blue-800">Identity Pending</Badge>
      case 'documents_uploaded':
        return <Badge className="bg-yellow-100 text-yellow-800">Documents Uploaded</Badge>
      case 'link_sent':
        return <Badge className="bg-blue-100 text-blue-800">Link Sent</Badge>
      default:
        return <Badge variant="outline">Not Started</Badge>
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <LinkIcon className="h-5 w-5 text-[#10B981]" />
            <CardTitle className="text-lg">Client Portal Link</CardTitle>
          </div>
          {getStatusBadge()}
        </div>
        <CardDescription>
          Send a secure link to {clientName} to complete their AML verification
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {!token ? (
          <Button 
            onClick={handleGenerateLink} 
            disabled={isLoading}
            className="w-full bg-[#10B981] hover:bg-[#059669]"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating Link...
              </>
            ) : (
              <>
                <LinkIcon className="mr-2 h-4 w-4" />
                Generate Client Portal Link
              </>
            )}
          </Button>
        ) : (
          <div className="space-y-4">
            {/* Link Display */}
            <div className="flex items-center gap-2">
              <Input 
                value={portalUrl || ''} 
                readOnly 
                className="font-mono text-sm"
              />
              <Button 
                variant="outline" 
                size="icon"
                onClick={handleCopyLink}
              >
                {copied ? (
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
              <Button 
                variant="outline" 
                size="icon"
                onClick={() => window.open(portalUrl!, '_blank')}
              >
                <ExternalLink className="h-4 w-4" />
              </Button>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <Dialog open={showDialog} onOpenChange={setShowDialog}>
                <DialogTrigger asChild>
                  <Button 
                    className="flex-1 bg-[#10B981] hover:bg-[#059669]"
                    disabled={!clientEmail}
                  >
                    <Send className="mr-2 h-4 w-4" />
                    Send to Client
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                      <Mail className="h-5 w-5 text-[#10B981]" />
                      Send Portal Link
                    </DialogTitle>
                    <DialogDescription>
                      Send the secure verification link to {clientName}
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 pt-4">
                    <div>
                      <p className="mb-2 text-sm font-medium">Recipient Email</p>
                      <Input value={clientEmail || ''} readOnly />
                    </div>
                    <div className="rounded-lg bg-muted p-4 text-sm">
                      <p className="font-medium">Email will include:</p>
                      <ul className="mt-2 list-inside list-disc space-y-1 text-muted-foreground">
                        <li>Secure portal link for document upload</li>
                        <li>Instructions for completing verification</li>
                        <li>Your firm&apos;s contact information</li>
                      </ul>
                    </div>
                    {error && (
                      <p className="text-sm text-red-600">{error}</p>
                    )}
                    <Button 
                      onClick={handleSendEmail}
                      disabled={isSending}
                      className="w-full bg-[#10B981] hover:bg-[#059669]"
                    >
                      {isSending ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send className="mr-2 h-4 w-4" />
                          Send Email
                        </>
                      )}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
              
              <Button 
                variant="outline"
                onClick={handleCopyLink}
              >
                {copied ? (
                  <>
                    <CheckCircle2 className="mr-2 h-4 w-4 text-green-600" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="mr-2 h-4 w-4" />
                    Copy Link
                  </>
                )}
              </Button>
            </div>

            {!clientEmail && (
              <p className="text-sm text-muted-foreground">
                Add an email address to send the link directly to the client.
              </p>
            )}
          </div>
        )}

        {error && !token && (
          <p className="text-sm text-red-600">{error}</p>
        )}
      </CardContent>
    </Card>
  )
}
