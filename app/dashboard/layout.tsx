import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { DashboardSidebar } from '@/components/dashboard/sidebar'
import { DashboardHeader } from '@/components/dashboard/header'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  // Get staff info
  const { data: staff } = await supabase
    .from('staff')
    .select('*, organizations(*)')
    .eq('id', user.id)
    .single()

  // If no staff record exists, this is a new user who needs organization setup
  // For now, show a placeholder - in production you'd redirect to onboarding
  const organizationName = staff?.organizations?.name || user.user_metadata?.organization_name || 'Your Organization'
  const staffName = staff?.full_name || user.user_metadata?.full_name || user.email?.split('@')[0] || 'User'
  const staffRole = staff?.role || 'admin'

  return (
    <div className="flex min-h-svh bg-background">
      <DashboardSidebar 
        organizationName={organizationName}
        staffName={staffName}
        staffRole={staffRole}
        userEmail={user.email || ''}
      />
      <div className="flex flex-1 flex-col lg:pl-72">
        <DashboardHeader staffName={staffName} />
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
