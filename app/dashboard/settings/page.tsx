'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import {
  Building2,
  User,
  Shield,
  Bell,
  Key,
  Users,
  Plus,
  Trash2,
  Save,
  Check,
  AlertTriangle,
} from 'lucide-react'

export default function SettingsPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [saved, setSaved] = useState(false)
  const [staff, setStaff] = useState<Array<{
    id: string
    email: string
    full_name: string
    role: string
    is_active: boolean
  }>>([])

  // Organization settings
  const [orgName, setOrgName] = useState('')
  const [orgType, setOrgType] = useState('')
  const [orgAbn, setOrgAbn] = useState('')

  // User settings
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')

  // Notification settings
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [verificationAlerts, setVerificationAlerts] = useState(true)
  const [expiryReminders, setExpiryReminders] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      setEmail(user.email || '')
      setFullName(user.user_metadata?.full_name || '')
      setOrgName(user.user_metadata?.organization_name || '')
      setOrgType(user.user_metadata?.organization_type || '')

      // Load staff data
      const { data: staffData } = await supabase
        .from('staff')
        .select('id, email, full_name, role, is_active')

      if (staffData) {
        setStaff(staffData)
      }
    }

    loadData()
  }, [])

  const handleSaveProfile = async () => {
    setIsLoading(true)
    const supabase = createClient()

    const { error } = await supabase.auth.updateUser({
      data: {
        full_name: fullName,
        organization_name: orgName,
        organization_type: orgType,
      }
    })

    if (!error) {
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    }

    setIsLoading(false)
  }

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account and organization settings
        </p>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList>
          <TabsTrigger value="profile">
            <User className="mr-2 h-4 w-4" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="organization">
            <Building2 className="mr-2 h-4 w-4" />
            Organization
          </TabsTrigger>
          <TabsTrigger value="team">
            <Users className="mr-2 h-4 w-4" />
            Team
          </TabsTrigger>
          <TabsTrigger value="notifications">
            <Bell className="mr-2 h-4 w-4" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="security">
            <Shield className="mr-2 h-4 w-4" />
            Security
          </TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Profile Settings</CardTitle>
              <CardDescription>
                Update your personal information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input
                    id="fullName"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    disabled
                    className="bg-secondary"
                  />
                  <p className="text-xs text-muted-foreground">
                    Contact support to change your email
                  </p>
                </div>
              </div>
              <Button onClick={handleSaveProfile} disabled={isLoading}>
                {saved ? (
                  <>
                    <Check className="mr-2 h-4 w-4" />
                    Saved
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    {isLoading ? 'Saving...' : 'Save Changes'}
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Organization Tab */}
        <TabsContent value="organization">
          <Card>
            <CardHeader>
              <CardTitle>Organization Settings</CardTitle>
              <CardDescription>
                Manage your organization details
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="orgName">Organization Name</Label>
                  <Input
                    id="orgName"
                    value={orgName}
                    onChange={(e) => setOrgName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="orgType">Organization Type</Label>
                  <Select value={orgType} onValueChange={setOrgType}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="accountant">Accounting Firm</SelectItem>
                      <SelectItem value="lawyer">Law Firm</SelectItem>
                      <SelectItem value="conveyancer">Conveyancing Practice</SelectItem>
                      <SelectItem value="real_estate">Real Estate Agency</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="orgAbn">ABN</Label>
                <Input
                  id="orgAbn"
                  value={orgAbn}
                  onChange={(e) => setOrgAbn(e.target.value)}
                  placeholder="12 345 678 901"
                />
              </div>
              <Button onClick={handleSaveProfile} disabled={isLoading}>
                <Save className="mr-2 h-4 w-4" />
                {isLoading ? 'Saving...' : 'Save Changes'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Team Tab */}
        <TabsContent value="team">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Team Members</CardTitle>
                <CardDescription>
                  Manage staff access and permissions
                </CardDescription>
              </div>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Invite Member
              </Button>
            </CardHeader>
            <CardContent>
              {staff.length > 0 ? (
                <div className="space-y-4">
                  {staff.map((member) => (
                    <div
                      key={member.id}
                      className="flex items-center justify-between rounded-lg border border-border p-4"
                    >
                      <div className="flex items-center gap-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-sm font-medium text-primary-foreground">
                          {member.full_name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-medium">{member.full_name}</p>
                          <p className="text-sm text-muted-foreground">{member.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <Badge variant={member.role === 'admin' ? 'default' : 'secondary'}>
                          {member.role}
                        </Badge>
                        <Badge variant={member.is_active ? 'outline' : 'secondary'}>
                          {member.is_active ? 'Active' : 'Inactive'}
                        </Badge>
                        <Button variant="ghost" size="icon">
                          <Trash2 className="h-4 w-4 text-muted-foreground" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <Users className="mb-3 h-10 w-10 text-muted-foreground/50" />
                  <p className="font-medium">No team members yet</p>
                  <p className="text-sm text-muted-foreground">
                    Invite team members to collaborate on compliance
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>
                Choose how you want to be notified
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Email Notifications</p>
                  <p className="text-sm text-muted-foreground">
                    Receive email updates about your account
                  </p>
                </div>
                <Switch
                  checked={emailNotifications}
                  onCheckedChange={setEmailNotifications}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Verification Alerts</p>
                  <p className="text-sm text-muted-foreground">
                    Get notified when client verifications are completed
                  </p>
                </div>
                <Switch
                  checked={verificationAlerts}
                  onCheckedChange={setVerificationAlerts}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Expiry Reminders</p>
                  <p className="text-sm text-muted-foreground">
                    Receive alerts when documents or verifications are expiring
                  </p>
                </div>
                <Switch
                  checked={expiryReminders}
                  onCheckedChange={setExpiryReminders}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Change Password</CardTitle>
                <CardDescription>
                  Update your password to keep your account secure
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <Input id="currentPassword" type="password" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input id="newPassword" type="password" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <Input id="confirmPassword" type="password" />
                </div>
                <Button>
                  <Key className="mr-2 h-4 w-4" />
                  Update Password
                </Button>
              </CardContent>
            </Card>

            <Card className="border-destructive/50">
              <CardHeader>
                <CardTitle className="text-destructive">Danger Zone</CardTitle>
                <CardDescription>
                  Irreversible actions that affect your account
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Delete Account</p>
                    <p className="text-sm text-muted-foreground">
                      Permanently delete your account and all associated data
                    </p>
                  </div>
                  <Button variant="destructive">
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete Account
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
