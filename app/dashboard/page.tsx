'use client'

import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { 
  Users, 
  AlertTriangle, 
  CheckCircle2, 
  Clock,
  Plus,
  ArrowRight,
  FileText,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import {
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

interface DashboardStats {
  totalClients: number
  pendingVerifications: number
  verifiedClients: number
  highRiskClients: number
}

interface Client {
  id: string
  client_type: string
  first_name?: string
  last_name?: string
  entity_name?: string
  verification_status: string
  created_at: string
}

interface AuditLog {
  id: string
  action: string
  entity_type: string
  created_at: string
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    totalClients: 0,
    pendingVerifications: 0,
    verifiedClients: 0,
    highRiskClients: 0,
  })
  const [recentClients, setRecentClients] = useState<Client[]>([])
  const [recentActivity, setRecentActivity] = useState<AuditLog[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      const supabase = createClient()
      
      // Get stats
      const [totalRes, pendingRes, verifiedRes, highRiskRes, clientsRes, activityRes] = await Promise.all([
        supabase.from('clients').select('*', { count: 'exact', head: true }),
        supabase.from('clients').select('*', { count: 'exact', head: true }).in('verification_status', ['pending', 'in_progress']),
        supabase.from('clients').select('*', { count: 'exact', head: true }).eq('verification_status', 'verified'),
        supabase.from('clients').select('*', { count: 'exact', head: true }).eq('risk_level', 'high'),
        supabase.from('clients').select('*').order('created_at', { ascending: false }).limit(5),
        supabase.from('audit_logs').select('*').order('created_at', { ascending: false }).limit(5),
      ])

      setStats({
        totalClients: totalRes.count || 0,
        pendingVerifications: pendingRes.count || 0,
        verifiedClients: verifiedRes.count || 0,
        highRiskClients: highRiskRes.count || 0,
      })
      setRecentClients(clientsRes.data || [])
      setRecentActivity(activityRes.data || [])
      setLoading(false)
    }
    
    fetchData()
  }, [])

  // Chart data
  const complianceData = [
    { name: 'Compliant', value: stats.verifiedClients, color: '#10B981' },
    { name: 'Pending', value: stats.pendingVerifications, color: '#F59E0B' },
    { name: 'High Risk', value: stats.highRiskClients, color: '#EF4444' },
  ]

  const trendData = [
    { month: 'Jan', clients: 12 },
    { month: 'Feb', clients: 19 },
    { month: 'Mar', clients: 28 },
    { month: 'Apr', clients: 35 },
    { month: 'May', clients: 42 },
    { month: 'Jun', clients: stats.totalClients || 48 },
  ]

  const complianceRate = stats.totalClients > 0 
    ? Math.round((stats.verifiedClients / stats.totalClients) * 100) 
    : 0

  const statCards = [
    {
      name: 'Total Clients',
      value: stats.totalClients,
      change: '+12%',
      changeType: 'positive',
      icon: Users,
      href: '/dashboard/clients',
      color: 'text-blue-600 bg-blue-100',
    },
    {
      name: 'Pending Verification',
      value: stats.pendingVerifications,
      change: 'Requires attention',
      changeType: 'warning',
      icon: Clock,
      href: '/dashboard/verifications',
      color: 'text-amber-600 bg-amber-100',
    },
    {
      name: 'High Risk Clients',
      value: stats.highRiskClients,
      change: 'Needs review',
      changeType: 'negative',
      icon: AlertTriangle,
      href: '/dashboard/clients?risk=high',
      color: 'text-red-600 bg-red-100',
    },
    {
      name: 'Completed This Month',
      value: stats.verifiedClients,
      change: '+28% vs last month',
      changeType: 'positive',
      icon: CheckCircle2,
      href: '/dashboard/clients?status=verified',
      color: 'text-emerald-600 bg-emerald-100',
    },
  ]

  function formatTimeAgo(date: string) {
    const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000)
    if (seconds < 60) return 'Just now'
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`
    return `${Math.floor(seconds / 86400)}d ago`
  }

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    )
  }

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
        {statCards.map((stat) => (
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
              <div className="mt-1 flex items-center text-xs">
                {stat.changeType === 'positive' && (
                  <ArrowUpRight className="mr-1 h-3 w-3 text-emerald-500" />
                )}
                {stat.changeType === 'negative' && (
                  <ArrowDownRight className="mr-1 h-3 w-3 text-red-500" />
                )}
                <span className={
                  stat.changeType === 'positive' ? 'text-emerald-600' :
                  stat.changeType === 'negative' ? 'text-red-600' :
                  'text-amber-600'
                }>
                  {stat.change}
                </span>
              </div>
              <Link 
                href={stat.href}
                className="mt-2 inline-flex items-center text-xs text-muted-foreground hover:text-primary"
              >
                View all
                <ArrowRight className="ml-1 h-3 w-3" />
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Compliance Overview - Donut Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Compliance Overview</CardTitle>
            <CardDescription>Current client compliance status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-8">
              <div className="relative h-40 w-40">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={complianceData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={70}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {complianceData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-3xl font-bold">{complianceRate}%</span>
                  <span className="text-xs text-muted-foreground">Compliant</span>
                </div>
              </div>
              <div className="space-y-3">
                {complianceData.map((item) => (
                  <div key={item.name} className="flex items-center gap-3">
                    <div className="h-3 w-3 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-sm">{item.name}</span>
                    <span className="ml-auto font-medium">{item.value}</span>
                    <span className="text-sm text-muted-foreground">
                      {stats.totalClients > 0 ? Math.round((item.value / stats.totalClients) * 100) : 0}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Client Growth - Area Chart */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Client Growth</CardTitle>
              <CardDescription>New clients over time</CardDescription>
            </div>
            <div className="flex items-center gap-1 text-sm text-emerald-600">
              <TrendingUp className="h-4 w-4" />
              <span>+28%</span>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-40">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trendData}>
                  <defs>
                    <linearGradient id="colorClients" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Area 
                    type="monotone" 
                    dataKey="clients" 
                    stroke="#10B981" 
                    strokeWidth={2}
                    fill="url(#colorClients)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity Row */}
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
            {recentClients.length > 0 ? (
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
                      {formatTimeAgo(client.created_at)}
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
            {recentActivity.length > 0 ? (
              <div className="space-y-4">
                {recentActivity.map((log) => (
                  <div key={log.id} className="flex items-start gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-secondary">
                      {log.action.includes('verif') ? (
                        <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                      ) : log.action.includes('risk') ? (
                        <AlertTriangle className="h-4 w-4 text-amber-500" />
                      ) : (
                        <FileText className="h-4 w-4 text-muted-foreground" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm">
                        <span className="font-medium capitalize">{log.action.replace(/_/g, ' ')}</span>
                        {' '}on{' '}
                        <span className="text-muted-foreground">{log.entity_type}</span>
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatTimeAgo(log.created_at)}
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
