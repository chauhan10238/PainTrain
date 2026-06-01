'use client'

import { IDVerification, ID_DOCUMENT_TYPES } from '@/lib/types'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { 
  FileCheck, 
  Plus, 
  CheckCircle2, 
  Clock, 
  XCircle,
  Sparkles,
  Eye,
} from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

interface IDVerificationListProps {
  verifications: IDVerification[]
  clientId: string
}

const statusConfig = {
  pending: { 
    icon: Clock, 
    label: 'Pending', 
    color: 'bg-yellow-100 text-yellow-800 border-yellow-200' 
  },
  ai_processed: { 
    icon: Sparkles, 
    label: 'AI Processed', 
    color: 'bg-purple-100 text-purple-800 border-purple-200' 
  },
  verified: { 
    icon: CheckCircle2, 
    label: 'Verified', 
    color: 'bg-green-100 text-green-800 border-green-200' 
  },
  rejected: { 
    icon: XCircle, 
    label: 'Rejected', 
    color: 'bg-red-100 text-red-800 border-red-200' 
  },
}

const categoryColors = {
  primary: 'bg-green-50 border-green-200',
  secondary: 'bg-blue-50 border-blue-200',
  commencement: 'bg-amber-50 border-amber-200',
}

export function IDVerificationList({ verifications, clientId }: IDVerificationListProps) {
  // Get document type name from ID_DOCUMENT_TYPES
  const getDocumentName = (type: string, category: string) => {
    const categoryDocs = ID_DOCUMENT_TYPES[category as keyof typeof ID_DOCUMENT_TYPES]
    const doc = categoryDocs?.find(d => d.type === type)
    return doc?.name || type.replace(/_/g, ' ')
  }

  if (verifications.length === 0) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>ID Verification</CardTitle>
            <CardDescription>5-point identity verification documents</CardDescription>
          </div>
          <Button asChild>
            <Link href={`/dashboard/clients/${clientId}/verify`}>
              <Plus className="mr-2 h-4 w-4" />
              Add ID Document
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <FileCheck className="mb-4 h-12 w-12 text-muted-foreground/50" />
            <h3 className="mb-2 text-lg font-semibold">No verification documents</h3>
            <p className="mb-4 max-w-sm text-sm text-muted-foreground">
              Upload identity documents to complete the 5-point verification process. 
              You need at least 100 points to verify a client.
            </p>
            <Button asChild>
              <Link href={`/dashboard/clients/${clientId}/verify`}>
                <Plus className="mr-2 h-4 w-4" />
                Start Verification
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Group by category
  const grouped = verifications.reduce((acc, v) => {
    if (!acc[v.category]) acc[v.category] = []
    acc[v.category].push(v)
    return acc
  }, {} as Record<string, IDVerification[]>)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">ID Verification Documents</h2>
          <p className="text-sm text-muted-foreground">
            {verifications.length} document{verifications.length !== 1 ? 's' : ''} uploaded
          </p>
        </div>
        <Button asChild>
          <Link href={`/dashboard/clients/${clientId}/verify`}>
            <Plus className="mr-2 h-4 w-4" />
            Add Document
          </Link>
        </Button>
      </div>

      {/* Grouped cards */}
      <div className="grid gap-4">
        {['primary', 'secondary', 'commencement'].map((category) => {
          const docs = grouped[category] || []
          if (docs.length === 0) return null

          return (
            <Card key={category} className={`border ${categoryColors[category as keyof typeof categoryColors]}`}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base capitalize">{category} Documents</CardTitle>
                  <Badge variant="outline">
                    {docs.reduce((sum, d) => sum + d.points, 0)} points
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {docs.map((verification) => {
                  const status = statusConfig[verification.status]
                  const StatusIcon = status.icon

                  return (
                    <div
                      key={verification.id}
                      className="flex items-center justify-between rounded-lg border border-border bg-background p-4"
                    >
                      <div className="flex items-center gap-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary">
                          <FileCheck className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <div>
                          <p className="font-medium">
                            {getDocumentName(verification.document_type, verification.category)}
                          </p>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <span>{verification.points} points</span>
                            {verification.document_number && (
                              <>
                                <span>•</span>
                                <span>{verification.document_number}</span>
                              </>
                            )}
                            <span>•</span>
                            <span>{formatDistanceToNow(new Date(verification.created_at), { addSuffix: true })}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {verification.ai_confidence_score && (
                          <Badge variant="secondary" className="gap-1">
                            <Sparkles className="h-3 w-3" />
                            {Math.round(verification.ai_confidence_score * 100)}% AI
                          </Badge>
                        )}
                        <Badge variant="outline" className={status.color}>
                          <StatusIcon className="mr-1 h-3 w-3" />
                          {status.label}
                        </Badge>
                        <Button variant="ghost" size="icon">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )
                })}
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
