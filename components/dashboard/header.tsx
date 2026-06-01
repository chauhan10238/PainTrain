'use client'

import { Bell, Search, Menu } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface DashboardHeaderProps {
  staffName: string
}

export function DashboardHeader({ staffName }: DashboardHeaderProps) {
  return (
    <header className="sticky top-0 z-40 flex h-16 items-center gap-4 border-b border-border bg-background/95 px-6 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      {/* Mobile menu button */}
      <Button variant="ghost" size="icon" className="lg:hidden">
        <Menu className="h-5 w-5" />
        <span className="sr-only">Toggle menu</span>
      </Button>

      {/* Search */}
      <div className="flex-1">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search clients, documents..."
            className="pl-9"
          />
        </div>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-accent" />
          <span className="sr-only">Notifications</span>
        </Button>
        <span className="hidden text-sm text-muted-foreground md:block">
          Welcome back, <span className="font-medium text-foreground">{staffName.split(' ')[0]}</span>
        </span>
      </div>
    </header>
  )
}
