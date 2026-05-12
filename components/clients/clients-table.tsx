'use client'

import { Client } from '@/lib/types'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { MoreHorizontal, Eye, FileText, Trash2, Users, Plus } from 'lucide-react'
import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'

interface ClientsTableProps {
  clients: Client[]
}

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

export function ClientsTable({ clients }: ClientsTableProps) {
  if (clients.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border py-16">
        <Users className="mb-4 h-12 w-12 text-muted-foreground/50" />
        <h3 className="mb-2 text-lg font-semibold">No clients found</h3>
        <p className="mb-4 text-center text-sm text-muted-foreground">
          Get started by adding your first client
        </p>
        <Button asChild>
          <Link href="/dashboard/clients/new">
            <Plus className="mr-2 h-4 w-4" />
            Add Client
          </Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="rounded-lg border border-border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Client</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Risk</TableHead>
            <TableHead>Points</TableHead>
            <TableHead>Created</TableHead>
            <TableHead className="w-[50px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {clients.map((client) => (
            <TableRow key={client.id}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary text-sm font-medium">
                    {client.client_type === 'individual'
                      ? `${client.first_name?.[0] || ''}${client.last_name?.[0] || ''}`
                      : client.entity_name?.[0] || 'C'}
                  </div>
                  <div>
                    <Link
                      href={`/dashboard/clients/${client.id}`}
                      className="font-medium hover:underline"
                    >
                      {client.client_type === 'individual'
                        ? `${client.first_name || ''} ${client.last_name || ''}`
                        : client.entity_name || 'Unknown'}
                    </Link>
                    {client.email && (
                      <p className="text-sm text-muted-foreground">{client.email}</p>
                    )}
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <span className="capitalize">{client.client_type}</span>
              </TableCell>
              <TableCell>
                <Badge
                  variant="outline"
                  className={statusColors[client.verification_status] || ''}
                >
                  {client.verification_status.replace('_', ' ')}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge
                  variant="outline"
                  className={riskColors[client.risk_level] || ''}
                >
                  {client.risk_level}
                </Badge>
              </TableCell>
              <TableCell>
                <span className="font-mono text-sm">
                  {client.verification_points}/100
                </span>
              </TableCell>
              <TableCell className="text-muted-foreground">
                {formatDistanceToNow(new Date(client.created_at), { addSuffix: true })}
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                      <span className="sr-only">Actions</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                      <Link href={`/dashboard/clients/${client.id}`}>
                        <Eye className="mr-2 h-4 w-4" />
                        View Details
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href={`/dashboard/clients/${client.id}/documents`}>
                        <FileText className="mr-2 h-4 w-4" />
                        Documents
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-destructive focus:text-destructive">
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
