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
  FileText, 
  Search, 
  Filter,
  Download,
  Eye,
  HardDrive,
  Calendar,
  Sparkles,
  FileImage,
  File,
} from 'lucide-react'
import { formatDistanceToNow, format } from 'date-fns'

const mimeTypeIcons: Record<string, typeof FileText> = {
  'application/pdf': FileText,
  'image/jpeg': FileImage,
  'image/png': FileImage,
  'image/webp': FileImage,
}

function formatFileSize(bytes: number | null): string {
  if (!bytes) return '-'
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
}

export default async function DocumentsPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string; search?: string }>
}) {
  const params = await searchParams
  const supabase = await createClient()

  // Build query with filters
  let query = supabase
    .from('documents')
    .select(`
      *,
      clients (
        id,
        first_name,
        last_name,
        entity_name,
        client_type
      )
    `)
    .order('created_at', { ascending: false })

  if (params.type) {
    query = query.eq('document_type', params.type)
  }

  if (params.search) {
    query = query.ilike('name', `%${params.search}%`)
  }

  const { data: documents } = await query

  // Get stats
  const { count: totalCount } = await supabase
    .from('documents')
    .select('*', { count: 'exact', head: true })

  // Calculate total storage (sum of file sizes)
  const { data: storageData } = await supabase
    .from('documents')
    .select('file_size')
  
  const totalStorage = storageData?.reduce((sum, doc) => sum + (doc.file_size || 0), 0) || 0

  // Get client name from document
  const getClientName = (document: typeof documents extends (infer T)[] ? T : never) => {
    const client = document.clients as { 
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
        <h1 className="text-2xl font-bold tracking-tight">Documents</h1>
        <p className="text-muted-foreground">
          All compliance documents securely stored with 7-year retention
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="rounded-lg bg-secondary p-3">
                <FileText className="h-5 w-5 text-muted-foreground" />
              </div>
              <div>
                <div className="text-2xl font-bold">{totalCount || 0}</div>
                <p className="text-sm text-muted-foreground">Total Documents</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="rounded-lg bg-blue-100 p-3">
                <HardDrive className="h-5 w-5 text-blue-700" />
              </div>
              <div>
                <div className="text-2xl font-bold">{formatFileSize(totalStorage)}</div>
                <p className="text-sm text-muted-foreground">Storage Used</p>
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
                  {documents?.filter(d => d.ai_processed_at).length || 0}
                </div>
                <p className="text-sm text-muted-foreground">AI Processed</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="rounded-lg bg-green-100 p-3">
                <Calendar className="h-5 w-5 text-green-700" />
              </div>
              <div>
                <div className="text-2xl font-bold">7 Years</div>
                <p className="text-sm text-muted-foreground">Retention Period</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            <form className="relative flex-1" action="/dashboard/documents" method="GET">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                name="search"
                type="search"
                placeholder="Search documents..."
                defaultValue={params.search}
                className="pl-9"
              />
            </form>
            <div className="flex items-center gap-2">
              <Select defaultValue={params.type || 'all'}>
                <SelectTrigger className="w-[180px]">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Document Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="id_document">ID Document</SelectItem>
                  <SelectItem value="contract">Contract</SelectItem>
                  <SelectItem value="financial">Financial</SelectItem>
                  <SelectItem value="correspondence">Correspondence</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Documents Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Documents</CardTitle>
          <CardDescription>
            {documents?.length || 0} documents stored
          </CardDescription>
        </CardHeader>
        <CardContent>
          {documents && documents.length > 0 ? (
            <div className="rounded-lg border border-border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Document</TableHead>
                    <TableHead>Client</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Size</TableHead>
                    <TableHead>AI Processed</TableHead>
                    <TableHead>Retention Expires</TableHead>
                    <TableHead>Uploaded</TableHead>
                    <TableHead className="w-[100px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {documents.map((doc) => {
                    const FileIcon = mimeTypeIcons[doc.mime_type || ''] || File
                    const client = doc.clients as { id?: string } | null

                    return (
                      <TableRow key={doc.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary">
                              <FileIcon className="h-5 w-5 text-muted-foreground" />
                            </div>
                            <div>
                              <p className="max-w-[200px] truncate font-medium">
                                {doc.name}
                              </p>
                              {doc.description && (
                                <p className="max-w-[200px] truncate text-sm text-muted-foreground">
                                  {doc.description}
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
                            {getClientName(doc)}
                          </Link>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary">
                            {doc.document_type.replace(/_/g, ' ')}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-mono text-sm text-muted-foreground">
                          {formatFileSize(doc.file_size)}
                        </TableCell>
                        <TableCell>
                          {doc.ai_processed_at ? (
                            <div className="flex items-center gap-1 text-purple-600">
                              <Sparkles className="h-4 w-4" />
                              <span className="text-sm">Yes</span>
                            </div>
                          ) : (
                            <span className="text-muted-foreground">-</span>
                          )}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {format(new Date(doc.retention_expires_at), 'dd MMM yyyy')}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {formatDistanceToNow(new Date(doc.created_at), { addSuffix: true })}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Button variant="ghost" size="icon" asChild>
                              <Link href={`/dashboard/clients/${client?.id}`}>
                                <Eye className="h-4 w-4" />
                              </Link>
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <FileText className="mb-4 h-12 w-12 text-muted-foreground/50" />
              <h3 className="mb-2 text-lg font-semibold">No documents found</h3>
              <p className="mb-4 text-sm text-muted-foreground">
                Documents will appear here when uploaded for clients
              </p>
              <Button asChild>
                <Link href="/dashboard/clients">View Clients</Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Retention Notice */}
      <Card className="border-accent/50 bg-accent/5">
        <CardContent className="pt-6">
          <div className="flex items-start gap-4">
            <div className="rounded-lg bg-accent/20 p-2">
              <Calendar className="h-5 w-5 text-accent" />
            </div>
            <div>
              <h4 className="font-medium">7-Year Compliance Retention</h4>
              <p className="mt-1 text-sm text-muted-foreground">
                All documents are securely stored for 7 years from the date of upload in compliance 
                with AML/CTF regulations. Documents are encrypted at rest and in transit. 
                Retention expiry dates are automatically calculated based on upload date.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
