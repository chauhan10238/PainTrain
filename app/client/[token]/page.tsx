import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Shield, CheckCircle2, Upload, ScanFace, FileText, ArrowRight, Lock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ClientPortalForm } from '@/components/client-portal/client-portal-form'

export default async function ClientPortalPage({
  params,
}: {
  params: Promise<{ token: string }>
}) {
  const { token } = await params
  const supabase = await createClient()

  // Find client by onboarding token
  const { data: client, error } = await supabase
    .from('clients')
    .select('*')
    .eq('onboarding_token', token)
    .single()

  if (error || !client) {
    notFound()
  }

  const clientName = client.client_type === 'individual'
    ? `${client.first_name || ''} ${client.last_name || ''}`
    : client.entity_name || 'Valued Client'

  const isCompleted = client.onboarding_status === 'completed' || 
    client.onboarding_status === 'identity_verified'

  const hasDocuments = client.verification_points >= 100

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#10B981]/5 to-background">
      {/* Header */}
      <header className="border-b border-border bg-background/80 backdrop-blur-sm">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#10B981]">
              <Shield className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold">AML Comply</span>
          </Link>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Lock className="h-4 w-4" />
            Secure Portal
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-6 py-12">
        {/* Welcome Section */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight">
            Welcome, {clientName}
          </h1>
          <p className="mt-2 text-muted-foreground">
            Complete your AML verification to get started
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mb-12">
          <div className="flex items-center justify-center gap-4">
            <div className={`flex flex-col items-center ${client.verification_points > 0 ? 'text-[#10B981]' : 'text-muted-foreground'}`}>
              <div className={`flex h-12 w-12 items-center justify-center rounded-full border-2 ${client.verification_points > 0 ? 'border-[#10B981] bg-[#10B981]/10' : 'border-muted'}`}>
                <FileText className="h-5 w-5" />
              </div>
              <span className="mt-2 text-sm font-medium">Personal Details</span>
            </div>
            <div className={`h-0.5 w-16 ${hasDocuments ? 'bg-[#10B981]' : 'bg-muted'}`} />
            <div className={`flex flex-col items-center ${hasDocuments ? 'text-[#10B981]' : 'text-muted-foreground'}`}>
              <div className={`flex h-12 w-12 items-center justify-center rounded-full border-2 ${hasDocuments ? 'border-[#10B981] bg-[#10B981]/10' : 'border-muted'}`}>
                <Upload className="h-5 w-5" />
              </div>
              <span className="mt-2 text-sm font-medium">Upload Documents</span>
            </div>
            <div className={`h-0.5 w-16 ${client.stripe_identity_status === 'verified' ? 'bg-[#10B981]' : 'bg-muted'}`} />
            <div className={`flex flex-col items-center ${client.stripe_identity_status === 'verified' ? 'text-[#10B981]' : 'text-muted-foreground'}`}>
              <div className={`flex h-12 w-12 items-center justify-center rounded-full border-2 ${client.stripe_identity_status === 'verified' ? 'border-[#10B981] bg-[#10B981]/10' : 'border-muted'}`}>
                <ScanFace className="h-5 w-5" />
              </div>
              <span className="mt-2 text-sm font-medium">Identity Verification</span>
            </div>
            <div className={`h-0.5 w-16 ${isCompleted ? 'bg-[#10B981]' : 'bg-muted'}`} />
            <div className={`flex flex-col items-center ${isCompleted ? 'text-[#10B981]' : 'text-muted-foreground'}`}>
              <div className={`flex h-12 w-12 items-center justify-center rounded-full border-2 ${isCompleted ? 'border-[#10B981] bg-[#10B981]/10' : 'border-muted'}`}>
                <CheckCircle2 className="h-5 w-5" />
              </div>
              <span className="mt-2 text-sm font-medium">Complete</span>
            </div>
          </div>
        </div>

        {/* Main Content */}
        {isCompleted ? (
          <Card className="border-[#10B981]/30 bg-[#10B981]/5">
            <CardContent className="flex flex-col items-center py-12 text-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#10B981]">
                <CheckCircle2 className="h-10 w-10 text-white" />
              </div>
              <h2 className="mt-6 text-2xl font-bold">Verification Complete!</h2>
              <p className="mt-2 max-w-md text-muted-foreground">
                Thank you for completing your AML verification. Your information has been 
                securely submitted and verified. You may close this page.
              </p>
              <Badge className="mt-4 bg-[#10B981] text-white">
                Verified on {new Date(client.biometric_verified_at || client.updated_at).toLocaleDateString()}
              </Badge>
            </CardContent>
          </Card>
        ) : (
          <ClientPortalForm 
            clientId={client.id}
            token={token}
            clientType={client.client_type}
            firstName={client.first_name}
            lastName={client.last_name}
            email={client.email}
            phone={client.phone}
            entityName={client.entity_name}
            verificationPoints={client.verification_points}
            stripeIdentityStatus={client.stripe_identity_status}
          />
        )}

        {/* Security Info */}
        <div className="mt-12 rounded-xl border border-border bg-muted/30 p-6">
          <div className="flex items-start gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#10B981]/10">
              <Shield className="h-5 w-5 text-[#10B981]" />
            </div>
            <div>
              <h3 className="font-semibold">Your Data is Secure</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                All information is encrypted and stored securely in compliance with Australian 
                AML/CTF regulations. Your documents are only accessible to authorised personnel 
                and will be retained for the required 7-year period.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-8 text-center text-sm text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} AML Comply. All rights reserved.</p>
        <p className="mt-1">
          <Link href="/privacy" className="hover:text-foreground">Privacy Policy</Link>
          {' '}&middot;{' '}
          <Link href="/terms" className="hover:text-foreground">Terms of Service</Link>
        </p>
      </footer>
    </div>
  )
}
