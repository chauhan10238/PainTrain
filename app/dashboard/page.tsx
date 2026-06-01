import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { 
  Users, 
  ClipboardCheck, 
  AlertTriangle, 
  CheckCircle2, 
  Clock,
  Plus,
  ArrowRight,
  FileText,
} from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

export default async function DashboardPage() {
  const supabase = await createClient()
  
  // Get stats
  const { count: totalClients } = await supabase
    .from('clients')
    .select('*', { count: 'exact', head: true })

  const { count: pendingVerifications } = await supabase
    .from('clients')
    .select('*', { count: 'exact', head: true })
    .in('verification_status', ['pending', 'in_progress'])

  const { count: verifiedClients } = await supabase
    .from('clients')
    .select('*', { count: 'exact', head: true })
    .eq('verification_status', 'verified')

  const { count: highRiskClients } = await supabase
    .from('clients')
    .select('*', { count: 'exact', head: true })
    .eq('risk_level', 'high')

  // Get recent clients
  const { data: recentClients } = await supabase
    .from('clients')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(5)

  // Get recent audit logs
  const { data: recentActivity } = await supabase
    .from('audit_logs')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(5)

  const stats = [
    {
      name: 'Total Clients',
      value: totalClients || 0,
      icon: Users,
      href: '/dashboard/clients',
      color: 'text-blue-600 bg-blue-100',
    },
    {
      name: 'Pending Verification',
      value: pendingVerifications || 0,
      icon: Clock,
      href: '/dashboard/verifications',
      color: 'text-amber-600 bg-amber-100',
    },
    {
      name: 'Verified',
      value: verifiedClients || 0,
      icon: CheckCircle2,
      href: '/dashboard/clients?status=verified',
      color: 'text-emerald-600 bg-emerald-100',
    },
    {
      name: 'High Risk',
      value: highRiskClients || 0,
      icon: AlertTriangle,
      href: '/dashboard/clients?risk=high',
      color: 'text-red-600 bg-red-100',
    },
  ]

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Overview of your AML compliance status
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/clients/new">
            <Plus className="mr-2 h-4 w-4" />
            Add Client
          </Link>
        </Button>
      </div>

      {/* Stats grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.name} className="relative overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.name}
              </CardTitle>
              <div className={`rounded-lg p-2 ${stat.color}`}>
                <stat.icon className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stat.value}</div>
              <Link 
                href={stat.href}
                className="mt-1 inline-flex items-center text-xs text-muted-foreground hover:text-primary"
              >
                View all
                <ArrowRight className="ml-1 h-3 w-3" />
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Clients */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recent Clients</CardTitle>
              <CardDescription>Latest client onboardings</CardDescription>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/dashboard/clients">View all</Link>
            </Button>
          </CardHeader>
          <CardContent>
            {recentClients && recentClients.length > 0 ? (
              <div className="space-y-4">
                {recentClients.map((client) => (
                  <div key={client.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary text-sm font-medium">
                        {client.client_type === 'individual' 
                          ? `${client.first_name?.[0] || ''}${client.last_name?.[0] || ''}`
                          : client.entity_name?.[0] || 'C'}
                      </div>
                      <div>
                        <p className="font-medium">
                          {client.client_type === 'individual'
                            ? `${client.first_name || ''} ${client.last_name || ''}`
                            : client.entity_name || 'Unknown'}
                        </p>
                        <p className="text-sm text-muted-foreground capitalize">
                          {client.client_type} • {client.verification_status}
                        </p>
                      </div>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {formatDistanceToNow(new Date(client.created_at), { addSuffix: true })}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <Users className="mb-3 h-10 w-10 text-muted-foreground/50" />
                <p className="font-medium">No clients yet</p>
                <p className="text-sm text-muted-foreground">
                  Add your first client to get started
                </p>
                <Button className="mt-4" asChild>
                  <Link href="/dashboard/clients/new">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Client
                  </Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Latest compliance actions</CardDescription>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/dashboard/audit">View all</Link>
            </Button>
          </CardHeader>
          <CardContent>
            {recentActivity && recentActivity.length > 0 ? (
              <div className="space-y-4">
                {recentActivity.map((log) => (
                  <div key={log.id} className="flex items-start gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-secondary">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm">
                        <span className="font-medium capitalize">{log.action.replace(/_/g, ' ')}</span>
                        {' '}on{' '}
                        <span className="text-muted-foreground">{log.entity_type}</span>
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(log.created_at), { addSuffix: true })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <FileText className="mb-3 h-10 w-10 text-muted-foreground/50" />
                <p className="font-medium">No activity yet</p>
                <p className="text-sm text-muted-foreground">
                  Actions will appear here as you use the system
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
