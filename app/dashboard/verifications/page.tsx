import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
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
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="rounded-lg bg-secondary p-3">
                <FileCheck className="h-5 w-5 text-muted-foreground" />
              </div>
              <div>
                <div className="text-2xl font-bold">{totalCount || 0}</div>
                <p className="text-sm text-muted-foreground">Total Verifications</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="rounded-lg bg-yellow-100 p-3">
                <Clock className="h-5 w-5 text-yellow-700" />
              </div>
              <div>
                <div className="text-2xl font-bold">{pendingCount || 0}</div>
                <p className="text-sm text-muted-foreground">Pending Review</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="rounded-lg bg-green-100 p-3">
                <CheckCircle2 className="h-5 w-5 text-green-700" />
              </div>
              <div>
                <div className="text-2xl font-bold">{verifiedCount || 0}</div>
                <p className="text-sm text-muted-foreground">Verified</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="rounded-lg bg-purple-100 p-3">
                <Sparkles className="h-5 w-5 text-purple-700" />
              </div>
              <div>
                <div className="text-2xl font-bold">
                  {verifications?.filter(v => v.ai_confidence_score && v.ai_confidence_score > 0.8).length || 0}
                </div>
                <p className="text-sm text-muted-foreground">High AI Confidence</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            <form className="relative flex-1" action="/dashboard/verifications" method="GET">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                name="search"
                type="search"
                placeholder="Search by document number..."
                defaultValue={params.search}
                className="pl-9"
              />
            </form>
            <div className="flex items-center gap-2">
              <Select defaultValue={params.status || 'all'}>
                <SelectTrigger className="w-[150px]">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="ai_processed">AI Processed</SelectItem>
                  <SelectItem value="verified">Verified</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
              <Select defaultValue={params.category || 'all'}>
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="primary">Primary (70 pts)</SelectItem>
                  <SelectItem value="secondary">Secondary (40 pts)</SelectItem>
                  <SelectItem value="commencement">Commencement</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Verifications Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Verifications</CardTitle>
          <CardDescription>
            {verifications?.length || 0} verification documents
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
