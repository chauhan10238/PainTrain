'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  Shield,
  LayoutDashboard,
  Users,
  FileText,
  ClipboardCheck,
  History,
  Settings,
  LogOut,
  ChevronDown,
  Building2,
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Clients', href: '/dashboard/clients', icon: Users },
  { name: 'Verifications', href: '/dashboard/verifications', icon: ClipboardCheck },
  { name: 'Documents', href: '/dashboard/documents', icon: FileText },
  { name: 'Audit Log', href: '/dashboard/audit', icon: History },
  { name: 'Settings', href: '/dashboard/settings', icon: Settings },
]

interface DashboardSidebarProps {
  organizationName: string
  staffName: string
  staffRole: string
  userEmail: string
}

export function DashboardSidebar({ organizationName, staffName, staffRole, userEmail }: DashboardSidebarProps) {
  const pathname = usePathname()
  const router = useRouter()

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/auth/login')
  }

  return (
    <aside className="fixed inset-y-0 left-0 z-50 hidden w-72 flex-col border-r border-sidebar-border bg-sidebar lg:flex">
      {/* Logo */}
      <div className="flex h-16 items-center gap-3 border-b border-sidebar-border px-6">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
          <Shield className="h-5 w-5" />
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-semibold text-sidebar-foreground">AML Comply</span>
          <span className="text-xs text-sidebar-foreground/60">Compliance CRM</span>
        </div>
      </div>

      {/* Organization */}
      <div className="border-b border-sidebar-border px-4 py-3">
        <div className="flex items-center gap-3 rounded-lg bg-sidebar-accent px-3 py-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-sidebar-primary/20">
            <Building2 className="h-4 w-4 text-sidebar-primary" />
          </div>
          <div className="flex-1 truncate">
            <p className="truncate text-sm font-medium text-sidebar-foreground">{organizationName}</p>
            <p className="text-xs capitalize text-sidebar-foreground/60">{staffRole}</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 p-4">
        {navigation.map((item) => {
          const isActive = pathname === item.href || 
            (item.href !== '/dashboard' && pathname.startsWith(item.href))
          
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                  : 'text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground'
              )}
            >
              <item.icon className="h-5 w-5 shrink-0" />
              {item.name}
            </Link>
          )
        })}
      </nav>

      {/* User menu */}
      <div className="border-t border-sidebar-border p-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="h-auto w-full justify-start gap-3 px-3 py-2 text-sidebar-foreground hover:bg-sidebar-accent"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-sidebar-primary text-sm font-medium text-sidebar-primary-foreground">
                {staffName.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 text-left">
                <p className="truncate text-sm font-medium">{staffName}</p>
                <p className="truncate text-xs text-sidebar-foreground/60">{userEmail}</p>
              </div>
              <ChevronDown className="h-4 w-4 text-sidebar-foreground/60" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuItem asChild>
              <Link href="/dashboard/settings">
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleSignOut} className="text-destructive focus:text-destructive">
              <LogOut className="mr-2 h-4 w-4" />
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </aside>
  )
}
