import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { ArrowLeft, Shield } from 'lucide-react'
import { IDUploadForm } from '@/components/verification/id-upload-form'
import { VerificationProgress } from '@/components/clients/verification-progress'
import { ID_DOCUMENT_TYPES } from '@/lib/types'

export default async function VerifyIDPage({
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

  const clientName = client.client_type === 'individual'
    ? `${client.first_name || ''} ${client.last_name || ''}`
    : client.entity_name || 'Unknown'

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href={`/dashboard/clients/${id}`}>
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">ID Verification</h1>
          <p className="text-muted-foreground">{clientName}</p>
        </div>
      </div>

      {/* Current Progress */}
      <VerificationProgress
        points={client.verification_points}
        status={client.verification_status}
      />

      {/* Document Categories */}
      <div className="grid gap-6">
        {/* Primary Documents */}
        <Card className="border-green-200 bg-green-50/50">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2 text-green-800">
                  <Shield className="h-5 w-5" />
                  Primary Documents (70 points)
                </CardTitle>
                <CardDescription className="text-green-700">
                  Government-issued photo identification with highest verification value
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <IDUploadForm 
              clientId={id}
              category="primary"
              documentTypes={ID_DOCUMENT_TYPES.primary}
            />
          </CardContent>
        </Card>

        {/* Secondary Documents */}
        <Card className="border-blue-200 bg-blue-50/50">
          <CardHeader>
            <div>
              <CardTitle className="flex items-center gap-2 text-blue-800">
                <Shield className="h-5 w-5" />
                Secondary Documents (40 points)
              </CardTitle>
              <CardDescription className="text-blue-700">
                Photo identification from government or recognized authorities
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <IDUploadForm 
              clientId={id}
              category="secondary"
              documentTypes={ID_DOCUMENT_TYPES.secondary}
            />
          </CardContent>
        </Card>

        {/* Commencement Documents */}
        <Card className="border-amber-200 bg-amber-50/50">
          <CardHeader>
            <div>
              <CardTitle className="flex items-center gap-2 text-amber-800">
                <Shield className="h-5 w-5" />
                Commencement Documents (25-35 points)
              </CardTitle>
              <CardDescription className="text-amber-700">
                Documents linking the client to their current address
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <IDUploadForm 
              clientId={id}
              category="commencement"
              documentTypes={ID_DOCUMENT_TYPES.commencement}
            />
          </CardContent>
        </Card>
      </div>

      {/* Info Box */}
      <Card>
        <CardContent className="pt-6">
          <div className="rounded-lg bg-secondary p-4">
            <h4 className="mb-2 font-medium">Australian 5-Point Verification</h4>
            <p className="text-sm text-muted-foreground">
              Under the AML/CTF Act, you must collect at least 100 points of identification. 
              AI-assisted extraction will automatically read document details which you can 
              verify before approving. All documents are securely stored for the 7-year 
              compliance retention period.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
