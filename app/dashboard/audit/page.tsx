import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
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
import { 
  History, 
  Search, 
  Filter,
  User,
  FileText,
  Shield,
  Plus,
  Check,
  Edit,
  Trash2,
  Eye,
  Download,
} from 'lucide-react'
import { formatDistanceToNow, format } from 'date-fns'

const actionIcons: Record<string, typeof User> = {
  client_created: Plus,
  client_updated: Edit,
  client_deleted: Trash2,
  client_verified: Check,
  id_verification_added: Shield,
  document_uploaded: FileText,
  note_added: FileText,
  login: User,
  logout: User,
}

const actionColors: Record<string, string> = {
  client_created: 'bg-green-100 text-green-800',
  client_updated: 'bg-blue-100 text-blue-800',
  client_deleted: 'bg-red-100 text-red-800',
  client_verified: 'bg-emerald-100 text-emerald-800',
  id_verification_added: 'bg-purple-100 text-purple-800',
  document_uploaded: 'bg-indigo-100 text-indigo-800',
  note_added: 'bg-gray-100 text-gray-800',
  login: 'bg-cyan-100 text-cyan-800',
  logout: 'bg-amber-100 text-amber-800',
}

export default async function AuditLogPage({
  searchParams,
}: {
  searchParams: Promise<{ action?: string; entity?: string; search?: string; page?: string }>
}) {
  const params = await searchParams
  const supabase = await createClient()
  const page = parseInt(params.page || '1')
  const pageSize = 25

  let query = supabase
    .from('audit_logs')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range((page - 1) * pageSize, page * pageSize - 1)

  if (params.action) {
    query = query.eq('action', params.action)
  }

  if (params.entity) {
    query = query.eq('entity_type', params.entity)
  }

  const { data: logs, count } = await query

  const totalPages = Math.ceil((count || 0) / pageSize)

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Audit Log</h1>
        <p className="text-muted-foreground">
          Complete compliance trail of all system actions
        </p>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-base">Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            <form className="relative flex-1" action="/dashboard/audit" method="GET">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                name="search"
                type="search"
                placeholder="Search by email or details..."
                defaultValue={params.search}
                className="pl-9"
              />
            </form>
            <div className="flex items-center gap-2">
              <Select defaultValue={params.action || 'all'}>
                <SelectTrigger className="w-[180px]">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Action" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Actions</SelectItem>
                  <SelectItem value="client_created">Client Created</SelectItem>
                  <SelectItem value="client_updated">Client Updated</SelectItem>
                  <SelectItem value="client_verified">Client Verified</SelectItem>
                  <SelectItem value="id_verification_added">ID Verification</SelectItem>
                  <SelectItem value="document_uploaded">Document Upload</SelectItem>
                  <SelectItem value="note_added">Note Added</SelectItem>
                </SelectContent>
              </Select>
              <Select defaultValue={params.entity || 'all'}>
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder="Entity" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Entities</SelectItem>
                  <SelectItem value="client">Client</SelectItem>
                  <SelectItem value="id_verification">ID Verification</SelectItem>
                  <SelectItem value="document">Document</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{count || 0}</div>
            <p className="text-sm text-muted-foreground">Total Actions</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">
              {logs?.filter(l => l.action === 'client_created').length || 0}
            </div>
            <p className="text-sm text-muted-foreground">Clients Created (this page)</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">
              {logs?.filter(l => l.action === 'id_verification_added').length || 0}
            </div>
            <p className="text-sm text-muted-foreground">ID Verifications (this page)</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">
              {logs?.filter(l => l.action === 'client_verified').length || 0}
            </div>
            <p className="text-sm text-muted-foreground">Clients Verified (this page)</p>
          </CardContent>
        </Card>
      </div>

      {/* Audit Table */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Activity Log</CardTitle>
            <CardDescription>
              Showing {logs?.length || 0} of {count || 0} entries
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          {logs && logs.length > 0 ? (
            <div className="rounded-lg border border-border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Timestamp</TableHead>
                    <TableHead>Action</TableHead>
                    <TableHead>Entity</TableHead>
                    <TableHead>Performed By</TableHead>
                    <TableHead>Details</TableHead>
                    <TableHead>IP Address</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {logs.map((log) => {
                    const ActionIcon = actionIcons[log.action] || History
                    const actionColor = actionColors[log.action] || 'bg-gray-100 text-gray-800'

                    return (
                      <TableRow key={log.id}>
                        <TableCell className="whitespace-nowrap">
                          <div>
                            <p className="font-medium">
                              {format(new Date(log.created_at), 'dd MMM yyyy')}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {format(new Date(log.created_at), 'HH:mm:ss')}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={actionColor}>
                            <ActionIcon className="mr-1 h-3 w-3" />
                            {log.action.replace(/_/g, ' ')}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <span className="capitalize">{log.entity_type}</span>
                          {log.entity_id && (
                            <p className="font-mono text-xs text-muted-foreground">
                              {log.entity_id.slice(0, 8)}...
                            </p>
                          )}
                        </TableCell>
                        <TableCell>
                          <span className="text-sm">{log.performed_by_email || 'System'}</span>
                        </TableCell>
                        <TableCell className="max-w-[200px]">
                          {log.details && Object.keys(log.details).length > 0 ? (
                            <code className="rounded bg-secondary px-2 py-1 text-xs">
                              {JSON.stringify(log.details).slice(0, 50)}
                              {JSON.stringify(log.details).length > 50 && '...'}
                            </code>
                          ) : (
                            <span className="text-muted-foreground">-</span>
                          )}
                        </TableCell>
                        <TableCell className="font-mono text-sm text-muted-foreground">
                          {log.ip_address || '-'}
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <History className="mb-4 h-12 w-12 text-muted-foreground/50" />
              <h3 className="mb-2 text-lg font-semibold">No audit logs found</h3>
              <p className="text-sm text-muted-foreground">
                Activity will appear here as you use the system
              </p>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-4 flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Page {page} of {totalPages}
              </p>
              <div className="flex gap-2">
                {page > 1 && (
                  <a
                    href={`/dashboard/audit?page=${page - 1}`}
                    className="rounded-md border border-border px-3 py-1 text-sm hover:bg-secondary"
                  >
                    Previous
                  </a>
                )}
                {page < totalPages && (
                  <a
                    href={`/dashboard/audit?page=${page + 1}`}
                    className="rounded-md border border-border px-3 py-1 text-sm hover:bg-secondary"
                  >
                    Next
                  </a>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Compliance Note */}
      <Card className="border-accent/50 bg-accent/5">
        <CardContent className="pt-6">
          <div className="flex items-start gap-4">
            <div className="rounded-lg bg-accent/20 p-2">
              <Shield className="h-5 w-5 text-accent" />
            </div>
            <div>
              <h4 className="font-medium">Compliance Retention</h4>
              <p className="mt-1 text-sm text-muted-foreground">
                All audit logs are retained for 7 years in compliance with AML/CTF regulations. 
                Logs are append-only and cannot be modified or deleted to ensure data integrity for regulatory reviews.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
