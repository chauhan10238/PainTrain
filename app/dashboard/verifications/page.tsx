import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import Link from 'next/link'
import { 
  ClipboardCheck, 
  Search, 
  Filter,
  CheckCircle2,
  Clock,
  XCircle,
  Sparkles,
  Eye,
  FileCheck,
  AlertTriangle,
  PlayCircle,
  RefreshCw,
  User,
  Building2,
  Shield,
  ArrowRight,
} from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { ID_DOCUMENT_TYPES } from '@/lib/types'

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
  primary: 'bg-green-100 text-green-800 border-green-200',
  secondary: 'bg-blue-100 text-blue-800 border-blue-200',
  commencement: 'bg-amber-100 text-amber-800 border-amber-200',
}

export default async function VerificationsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; category?: string; search?: string }>
}) {
  const params = await searchParams
  const supabase = await createClient()

  // Build query with filters
  let query = supabase
    .from('id_verifications')
    .select(`
      *,
      clients (
        id,
        first_name,
        last_name,
        entity_name,
        client_type,
        email
      )
    `)
    .order('created_at', { ascending: false })

  if (params.status) {
    query = query.eq('status', params.status)
  }

  if (params.category) {
    query = query.eq('category', params.category)
  }

  const { data: verifications } = await query

  // Get ALL clients with their verification status
  const { data: allClients } = await supabase
    .from('clients')
    .select('*')
    .order('created_at', { ascending: false })

  // Categorize clients by verification status
  const pendingClients = allClients?.filter(c => c.verification_status === 'pending') || []
  const inProgressClients = allClients?.filter(c => c.verification_status === 'in_progress') || []
  const verifiedClients = allClients?.filter(c => c.verification_status === 'verified') || []
  const failedClients = allClients?.filter(c => c.verification_status === 'failed' || c.verification_status === 'expired') || []

  // Get stats
  const { count: totalCount } = await supabase
    .from('id_verifications')
    .select('*', { count: 'exact', head: true })

  const { count: pendingCount } = await supabase
    .from('id_verifications')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'pending')

  const { count: verifiedCount } = await supabase
    .from('id_verifications')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'verified')

  // Get document type name
  const getDocumentName = (type: string, category: string) => {
    const categoryDocs = ID_DOCUMENT_TYPES[category as keyof typeof ID_DOCUMENT_TYPES]
    const doc = categoryDocs?.find(d => d.type === type)
    return doc?.name || type.replace(/_/g, ' ')
  }

  // Get client name from verification
  const getClientName = (verification: typeof verifications extends (infer T)[] ? T : never) => {
    const client = verification.clients as { 
      first_name?: string
      last_name?: string
      entity_name?: string
      client_type?: string 
    } | null
    if (!client) return 'Unknown'
    if (client.client_type === 'individual') {
      return `${client.first_name || ''} ${client.last_name || ''}`.trim() || 'Unknown'
    }
    return client.entity_name || 'Unknown'
  }

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">ID Verifications</h1>
        <p className="text-muted-foreground">
          Manage and review 5-point identity verification documents
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className={pendingClients.length > 0 ? 'border-yellow-200 bg-yellow-50/50 dark:border-yellow-800 dark:bg-yellow-950/20' : ''}>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="rounded-lg bg-yellow-100 p-3 dark:bg-yellow-900">
                <Clock className="h-5 w-5 text-yellow-700 dark:text-yellow-400" />
              </div>
              <div>
                <div className="text-2xl font-bold">{pendingClients.length}</div>
                <p className="text-sm text-muted-foreground">Need Verification</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className={inProgressClients.length > 0 ? 'border-blue-200 bg-blue-50/50 dark:border-blue-800 dark:bg-blue-950/20' : ''}>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="rounded-lg bg-blue-100 p-3 dark:bg-blue-900">
                <RefreshCw className="h-5 w-5 text-blue-700 dark:text-blue-400" />
              </div>
              <div>
                <div className="text-2xl font-bold">{inProgressClients.length}</div>
                <p className="text-sm text-muted-foreground">In Progress</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="rounded-lg bg-green-100 p-3 dark:bg-green-900">
                <CheckCircle2 className="h-5 w-5 text-green-700 dark:text-green-400" />
              </div>
              <div>
                <div className="text-2xl font-bold">{verifiedClients.length}</div>
                <p className="text-sm text-muted-foreground">Fully Verified</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="rounded-lg bg-red-100 p-3 dark:bg-red-900">
                <AlertTriangle className="h-5 w-5 text-red-700 dark:text-red-400" />
              </div>
              <div>
                <div className="text-2xl font-bold">{failedClients.length}</div>
                <p className="text-sm text-muted-foreground">Failed/Expired</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Client Verification Tabs */}
      <Tabs defaultValue="pending" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="pending" className="gap-2">
            <Clock className="h-4 w-4" />
            Need Verification ({pendingClients.length})
          </TabsTrigger>
          <TabsTrigger value="in_progress" className="gap-2">
            <RefreshCw className="h-4 w-4" />
            In Progress ({inProgressClients.length})
          </TabsTrigger>
          <TabsTrigger value="verified" className="gap-2">
            <CheckCircle2 className="h-4 w-4" />
            Verified ({verifiedClients.length})
          </TabsTrigger>
          <TabsTrigger value="failed" className="gap-2">
            <AlertTriangle className="h-4 w-4" />
            Failed ({failedClients.length})
          </TabsTrigger>
        </TabsList>

        {/* Pending - Need to Start Verification */}
        <TabsContent value="pending">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-yellow-600" />
                Clients Awaiting Verification
              </CardTitle>
              <CardDescription>
                These clients need 5-point ID verification to be started
              </CardDescription>
            </CardHeader>
            <CardContent>
              {pendingClients.length > 0 ? (
                <div className="space-y-3">
                  {pendingClients.map((client) => {
                    const clientName = client.client_type === 'individual'
                      ? `${client.first_name || ''} ${client.last_name || ''}`
                      : client.entity_name || 'Unknown'
                    const ClientIcon = client.client_type === 'individual' ? User : Building2

                    return (
                      <div key={client.id} className="flex items-center justify-between rounded-lg border border-yellow-200 bg-yellow-50/50 p-4 dark:border-yellow-800 dark:bg-yellow-950/20">
                        <div className="flex items-center gap-4">
                          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-yellow-100 dark:bg-yellow-900">
                            <ClientIcon className="h-6 w-6 text-yellow-700 dark:text-yellow-400" />
                          </div>
                          <div>
                            <p className="font-medium">{clientName}</p>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <span className="capitalize">{client.client_type}</span>
                              <span>•</span>
                              <span>{client.email || 'No email'}</span>
                              <span>•</span>
                              <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-200">
                                {client.verification_points}/100 points
                              </Badge>
                            </div>
                          </div>
                        </div>
                        <Button asChild>
                          <Link href={`/dashboard/clients/${client.id}/verify`}>
                            <PlayCircle className="mr-2 h-4 w-4" />
                            Start Verification
                          </Link>
                        </Button>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <CheckCircle2 className="mb-4 h-12 w-12 text-green-500" />
                  <h3 className="mb-2 text-lg font-semibold">All caught up!</h3>
                  <p className="text-sm text-muted-foreground">
                    No clients are waiting for verification to start
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* In Progress - Need to Continue/Complete Verification */}
        <TabsContent value="in_progress">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <RefreshCw className="h-5 w-5 text-blue-600" />
                Verification In Progress
              </CardTitle>
              <CardDescription>
                These clients have started verification but need more documents to reach 100 points
              </CardDescription>
            </CardHeader>
            <CardContent>
              {inProgressClients.length > 0 ? (
                <div className="space-y-3">
                  {inProgressClients.map((client) => {
                    const clientName = client.client_type === 'individual'
                      ? `${client.first_name || ''} ${client.last_name || ''}`
                      : client.entity_name || 'Unknown'
                    const ClientIcon = client.client_type === 'individual' ? User : Building2
                    const progressPercent = Math.min(100, client.verification_points)

                    return (
                      <div key={client.id} className="flex items-center justify-between rounded-lg border border-blue-200 bg-blue-50/50 p-4 dark:border-blue-800 dark:bg-blue-950/20">
                        <div className="flex items-center gap-4">
                          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900">
                            <ClientIcon className="h-6 w-6 text-blue-700 dark:text-blue-400" />
                          </div>
                          <div className="flex-1">
                            <p className="font-medium">{clientName}</p>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <span className="capitalize">{client.client_type}</span>
                              <span>•</span>
                              <span>{client.email || 'No email'}</span>
                            </div>
                            <div className="mt-2 flex items-center gap-3">
                              <div className="h-2 w-32 rounded-full bg-blue-200 dark:bg-blue-800">
                                <div 
                                  className="h-2 rounded-full bg-blue-600" 
                                  style={{ width: `${progressPercent}%` }}
                                />
                              </div>
                              <span className="text-sm font-medium text-blue-700 dark:text-blue-400">
                                {client.verification_points}/100 points
                              </span>
                            </div>
                          </div>
                        </div>
                        <Button asChild>
                          <Link href={`/dashboard/clients/${client.id}/verify`}>
                            <ArrowRight className="mr-2 h-4 w-4" />
                            Continue Verification
                          </Link>
                        </Button>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <ClipboardCheck className="mb-4 h-12 w-12 text-muted-foreground/50" />
                  <h3 className="mb-2 text-lg font-semibold">No verifications in progress</h3>
                  <p className="text-sm text-muted-foreground">
                    All started verifications have been completed
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Verified - Completed */}
        <TabsContent value="verified">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
                Fully Verified Clients
              </CardTitle>
              <CardDescription>
                These clients have completed 5-point ID verification (100+ points)
              </CardDescription>
            </CardHeader>
            <CardContent>
              {verifiedClients.length > 0 ? (
                <div className="space-y-3">
                  {verifiedClients.map((client) => {
                    const clientName = client.client_type === 'individual'
                      ? `${client.first_name || ''} ${client.last_name || ''}`
                      : client.entity_name || 'Unknown'
                    const ClientIcon = client.client_type === 'individual' ? User : Building2

                    return (
                      <div key={client.id} className="flex items-center justify-between rounded-lg border border-green-200 bg-green-50/50 p-4 dark:border-green-800 dark:bg-green-950/20">
                        <div className="flex items-center gap-4">
                          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-100 dark:bg-green-900">
                            <CheckCircle2 className="h-6 w-6 text-green-700 dark:text-green-400" />
                          </div>
                          <div>
                            <p className="font-medium">{clientName}</p>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <span className="capitalize">{client.client_type}</span>
                              <span>•</span>
                              <span>{client.email || 'No email'}</span>
                              <span>•</span>
                              <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
                                <CheckCircle2 className="mr-1 h-3 w-3" />
                                {client.verification_points} points verified
                              </Badge>
                            </div>
                            {client.verified_at && (
                              <p className="mt-1 text-xs text-muted-foreground">
                                Verified {formatDistanceToNow(new Date(client.verified_at), { addSuffix: true })}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" asChild>
                            <Link href={`/dashboard/clients/${client.id}`}>
                              <Eye className="mr-2 h-4 w-4" />
                              View Details
                            </Link>
                          </Button>
                          <Button variant="secondary" asChild>
                            <Link href={`/dashboard/clients/${client.id}/verify`}>
                              <RefreshCw className="mr-2 h-4 w-4" />
                              Update
                            </Link>
                          </Button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <Shield className="mb-4 h-12 w-12 text-muted-foreground/50" />
                  <h3 className="mb-2 text-lg font-semibold">No verified clients yet</h3>
                  <p className="text-sm text-muted-foreground">
                    Complete the 5-point verification process for your clients
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Failed/Expired */}
        <TabsContent value="failed">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-red-600" />
                Failed or Expired Verifications
              </CardTitle>
              <CardDescription>
                These clients need attention - verification failed or has expired
              </CardDescription>
            </CardHeader>
            <CardContent>
              {failedClients.length > 0 ? (
                <div className="space-y-3">
                  {failedClients.map((client) => {
                    const clientName = client.client_type === 'individual'
                      ? `${client.first_name || ''} ${client.last_name || ''}`
                      : client.entity_name || 'Unknown'
                    const ClientIcon = client.client_type === 'individual' ? User : Building2

                    return (
                      <div key={client.id} className="flex items-center justify-between rounded-lg border border-red-200 bg-red-50/50 p-4 dark:border-red-800 dark:bg-red-950/20">
                        <div className="flex items-center gap-4">
                          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-red-100 dark:bg-red-900">
                            <AlertTriangle className="h-6 w-6 text-red-700 dark:text-red-400" />
                          </div>
                          <div>
                            <p className="font-medium">{clientName}</p>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <span className="capitalize">{client.client_type}</span>
                              <span>•</span>
                              <span>{client.email || 'No email'}</span>
                              <span>•</span>
                              <Badge variant="destructive">
                                {client.verification_status === 'expired' ? 'Expired' : 'Failed'}
                              </Badge>
                            </div>
                          </div>
                        </div>
                        <Button variant="destructive" asChild>
                          <Link href={`/dashboard/clients/${client.id}/verify`}>
                            <RefreshCw className="mr-2 h-4 w-4" />
                            Restart Verification
                          </Link>
                        </Button>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <CheckCircle2 className="mb-4 h-12 w-12 text-green-500" />
                  <h3 className="mb-2 text-lg font-semibold">No failed verifications</h3>
                  <p className="text-sm text-muted-foreground">
                    All verifications are in good standing
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Document Verifications Table */}
      <Card>
        <CardHeader>
          <CardTitle>Uploaded ID Documents</CardTitle>
          <CardDescription>
            All {verifications?.length || 0} identity documents submitted for verification
          </CardDescription>
        </CardHeader>
        <CardContent>
          {verifications && verifications.length > 0 ? (
            <div className="rounded-lg border border-border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Document</TableHead>
                    <TableHead>Client</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Points</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>AI Confidence</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {verifications.map((verification) => {
                    const status = statusConfig[verification.status as keyof typeof statusConfig]
                    const StatusIcon = status?.icon || Clock
                    const client = verification.clients as { id?: string } | null

                    return (
                      <TableRow key={verification.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary">
                              <FileCheck className="h-5 w-5 text-muted-foreground" />
                            </div>
                            <div>
                              <p className="font-medium">
                                {getDocumentName(verification.document_type, verification.category)}
                              </p>
                              {verification.document_number && (
                                <p className="font-mono text-sm text-muted-foreground">
                                  {verification.document_number}
                                </p>
                              )}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Link 
                            href={`/dashboard/clients/${client?.id}`}
                            className="hover:underline"
                          >
                            {getClientName(verification)}
                          </Link>
                        </TableCell>
                        <TableCell>
                          <Badge 
                            variant="outline" 
                            className={categoryColors[verification.category as keyof typeof categoryColors]}
                          >
                            {verification.category}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <span className="font-mono font-medium">{verification.points}</span>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={status?.color}>
                            <StatusIcon className="mr-1 h-3 w-3" />
                            {status?.label}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {verification.ai_confidence_score ? (
                            <div className="flex items-center gap-2">
                              <Sparkles className="h-4 w-4 text-purple-600" />
                              <span className="font-mono">
                                {Math.round(verification.ai_confidence_score * 100)}%
                              </span>
                            </div>
                          ) : (
                            <span className="text-muted-foreground">-</span>
                          )}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {formatDistanceToNow(new Date(verification.created_at), { addSuffix: true })}
                        </TableCell>
                        <TableCell>
                          <Button variant="ghost" size="icon" asChild>
                            <Link href={`/dashboard/clients/${client?.id}`}>
                              <Eye className="h-4 w-4" />
                            </Link>
                          </Button>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <ClipboardCheck className="mb-4 h-12 w-12 text-muted-foreground/50" />
              <h3 className="mb-2 text-lg font-semibold">No verifications found</h3>
              <p className="mb-4 text-sm text-muted-foreground">
                Start verifying clients to see their documents here
              </p>
              <Button asChild>
                <Link href="/dashboard/clients">View Clients</Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
