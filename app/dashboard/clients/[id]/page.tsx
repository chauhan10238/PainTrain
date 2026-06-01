import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import Link from 'next/link'
import { 
  ArrowLeft, 
  FileText, 
  Shield, 
  User, 
  Building2, 
  Mail, 
  Phone, 
  MapPin,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Plus,
  Send,
  Copy,
  ExternalLink,
} from 'lucide-react'
import { formatDistanceToNow, format } from 'date-fns'
import { VerificationProgress } from '@/components/clients/verification-progress'
import { ClientNotes } from '@/components/clients/client-notes'
import { IDVerificationList } from '@/components/clients/id-verification-list'
import { StripeIdentityVerification } from '@/components/verification/stripe-identity-verification'
import { ClientPortalLink } from '@/components/clients/client-portal-link'

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  in_progress: 'bg-blue-100 text-blue-800 border-blue-200',
  verified: 'bg-green-100 text-green-800 border-green-200',
  failed: 'bg-red-100 text-red-800 border-red-200',
  expired: 'bg-gray-100 text-gray-800 border-gray-200',
}

const riskColors: Record<string, string> = {
  low: 'bg-green-100 text-green-800 border-green-200',
  medium: 'bg-amber-100 text-amber-800 border-amber-200',
  high: 'bg-red-100 text-red-800 border-red-200',
}

export default async function ClientDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  const { data: client, error } = await supabase
    .from('clients')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !client) {
    notFound()
  }

  // Get verifications
  const { data: verifications } = await supabase
    .from('id_verifications')
    .select('*')
    .eq('client_id', id)
    .order('created_at', { ascending: false })

  // Get documents
  const { data: documents } = await supabase
    .from('documents')
    .select('*')
    .eq('client_id', id)
    .order('created_at', { ascending: false })

  // Get notes
  const { data: notes } = await supabase
    .from('client_notes')
    .select('*')
    .eq('client_id', id)
    .order('created_at', { ascending: false })

  const clientName = client.client_type === 'individual'
    ? `${client.first_name || ''} ${client.last_name || ''}`
    : client.entity_name || 'Unknown'

  const clientIcon = client.client_type === 'individual' ? User : Building2

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/dashboard/clients">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-secondary text-lg font-medium">
              {client.client_type === 'individual'
                ? `${client.first_name?.[0] || ''}${client.last_name?.[0] || ''}`
                : client.entity_name?.[0] || 'C'}
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">{clientName}</h1>
              <div className="mt-1 flex items-center gap-2">
                <Badge variant="outline" className={statusColors[client.verification_status]}>
                  {client.verification_status.replace('_', ' ')}
                </Badge>
                <Badge variant="outline" className={riskColors[client.risk_level]}>
                  {client.risk_level} risk
                </Badge>
                <span className="text-sm text-muted-foreground capitalize">
                  {client.client_type}
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href={`/dashboard/clients/${id}/upload`}>
              <Plus className="mr-2 h-4 w-4" />
              Add Document
            </Link>
          </Button>
          <Button asChild>
            <Link href={`/dashboard/clients/${id}/verify`}>
              <Shield className="mr-2 h-4 w-4" />
              Verify ID
            </Link>
          </Button>
        </div>
      </div>

      {/* Verification Progress */}
      <VerificationProgress 
        points={client.verification_points} 
        status={client.verification_status}
      />

      {/* Client Portal Link */}
      <ClientPortalLink 
        clientId={client.id}
        clientName={clientName}
        clientEmail={client.email}
        onboardingToken={client.onboarding_token}
        onboardingStatus={client.onboarding_status}
      />

      {/* Stripe Identity Verification - show when 100 points reached or biometric in progress */}
      {(client.verification_points >= 100 || client.stripe_identity_status) && (
        <StripeIdentityVerification
          clientId={client.id}
          clientName={clientName}
          verificationPoints={client.verification_points}
          stripeIdentityStatus={client.stripe_identity_status}
          biometricVerifiedAt={client.biometric_verified_at}
          onboardingStatus={client.onboarding_status}
          riskScore={client.risk_score}
        />
      )}

      {/* Tabs */}
      <Tabs defaultValue="details" className="space-y-6">
        <TabsList>
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="verification">
            ID Verification ({verifications?.length || 0})
          </TabsTrigger>
          <TabsTrigger value="documents">
            Documents ({documents?.length || 0})
          </TabsTrigger>
          <TabsTrigger value="notes">
            Notes ({notes?.length || 0})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="details" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Client Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <clientIcon className="h-5 w-5" />
                  Client Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {client.client_type === 'individual' ? (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">First Name</p>
                        <p className="font-medium">{client.first_name || '-'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Last Name</p>
                        <p className="font-medium">{client.last_name || '-'}</p>
                      </div>
                    </div>
                    {client.date_of_birth && (
                      <div>
                        <p className="text-sm text-muted-foreground">Date of Birth</p>
                        <p className="font-medium">{format(new Date(client.date_of_birth), 'dd MMM yyyy')}</p>
                      </div>
                    )}
                  </>
                ) : (
                  <>
                    <div>
                      <p className="text-sm text-muted-foreground">Entity Name</p>
                      <p className="font-medium">{client.entity_name || '-'}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">ACN</p>
                        <p className="font-medium">{client.acn || '-'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">ABN</p>
                        <p className="font-medium">{client.abn || '-'}</p>
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="h-5 w-5" />
                  Contact Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span>{client.email || 'No email provided'}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{client.phone || 'No phone provided'}</span>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="mt-0.5 h-4 w-4 text-muted-foreground" />
                  <span>
                    {client.address?.street ? (
                      <>
                        {client.address.street}<br />
                        {client.address.suburb} {client.address.state} {client.address.postcode}
                      </>
                    ) : (
                      'No address provided'
                    )}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* AML Assessment */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  AML Assessment
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Risk Level</span>
                  <Badge variant="outline" className={riskColors[client.risk_level]}>
                    {client.risk_level}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">PEP Status</span>
                  <Badge variant={client.pep_status ? 'destructive' : 'secondary'}>
                    {client.pep_status ? 'Yes' : 'No'}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Sanctions Checked</span>
                  {client.sanctions_checked ? (
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                  ) : (
                    <Clock className="h-4 w-4 text-amber-600" />
                  )}
                </div>
                <div>
                  <p className="mb-1 text-sm text-muted-foreground">Source of Funds</p>
                  <p className="text-sm">{client.source_of_funds || 'Not provided'}</p>
                </div>
                <div>
                  <p className="mb-1 text-sm text-muted-foreground">Purpose of Engagement</p>
                  <p className="text-sm">{client.purpose_of_engagement || 'Not provided'}</p>
                </div>
              </CardContent>
            </Card>

            {/* Compliance Status */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Compliance Status
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Verification Points</span>
                  <span className="font-mono font-medium">{client.verification_points}/100</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Status</span>
                  <Badge variant="outline" className={statusColors[client.verification_status]}>
                    {client.verification_status.replace('_', ' ')}
                  </Badge>
                </div>
                {client.verified_at && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Verified At</span>
                    <span className="text-sm">{format(new Date(client.verified_at), 'dd MMM yyyy')}</span>
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Retention Expires</span>
                  <span className="text-sm">{format(new Date(client.retention_expires_at), 'dd MMM yyyy')}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Created</span>
                  <span className="text-sm">{formatDistanceToNow(new Date(client.created_at), { addSuffix: true })}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="verification">
          <IDVerificationList 
            verifications={verifications || []} 
            clientId={id}
          />
        </TabsContent>

        <TabsContent value="documents">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Documents</CardTitle>
                <CardDescription>Compliance documents and files</CardDescription>
              </div>
              <Button asChild>
                <Link href={`/dashboard/clients/${id}/upload`}>
                  <Plus className="mr-2 h-4 w-4" />
                  Upload Document
                </Link>
              </Button>
            </CardHeader>
            <CardContent>
              {documents && documents.length > 0 ? (
                <div className="space-y-3">
                  {documents.map((doc) => (
                    <div key={doc.id} className="flex items-center justify-between rounded-lg border border-border p-4">
                      <div className="flex items-center gap-3">
                        <FileText className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="font-medium">{doc.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {doc.document_type} • {formatDistanceToNow(new Date(doc.created_at), { addSuffix: true })}
                          </p>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">View</Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <FileText className="mb-3 h-10 w-10 text-muted-foreground/50" />
                  <p className="font-medium">No documents yet</p>
                  <p className="text-sm text-muted-foreground">Upload documents for compliance records</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notes">
          <ClientNotes notes={notes || []} clientId={id} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
