import { createClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import Link from 'next/link'
import { Plus, Search, Filter } from 'lucide-react'
import { ClientsTable } from '@/components/clients/clients-table'

export default async function ClientsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; risk?: string; search?: string }>
}) {
  const params = await searchParams
  const supabase = await createClient()

  let query = supabase
    .from('clients')
    .select('*')
    .order('created_at', { ascending: false })

  if (params.status) {
    query = query.eq('verification_status', params.status)
  }

  if (params.risk) {
    query = query.eq('risk_level', params.risk)
  }

  if (params.search) {
    query = query.or(`first_name.ilike.%${params.search}%,last_name.ilike.%${params.search}%,entity_name.ilike.%${params.search}%,email.ilike.%${params.search}%`)
  }

  const { data: clients, error } = await query

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Clients</h1>
          <p className="text-muted-foreground">
            Manage client onboarding and verification
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/clients/new">
            <Plus className="mr-2 h-4 w-4" />
            Add Client
          </Link>
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center">
        <form className="relative flex-1" action="/dashboard/clients" method="GET">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            name="search"
            type="search"
            placeholder="Search clients..."
            defaultValue={params.search}
            className="max-w-sm pl-9"
          />
        </form>
        <div className="flex items-center gap-2">
          <Select defaultValue={params.status || 'all'}>
            <SelectTrigger className="w-[160px]">
              <Filter className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="in_progress">In Progress</SelectItem>
              <SelectItem value="verified">Verified</SelectItem>
              <SelectItem value="failed">Failed</SelectItem>
              <SelectItem value="expired">Expired</SelectItem>
            </SelectContent>
          </Select>
          <Select defaultValue={params.risk || 'all'}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Risk" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Risk</SelectItem>
              <SelectItem value="low">Low Risk</SelectItem>
              <SelectItem value="medium">Medium Risk</SelectItem>
              <SelectItem value="high">High Risk</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Table */}
      <ClientsTable clients={clients || []} />
    </div>
  )
}
