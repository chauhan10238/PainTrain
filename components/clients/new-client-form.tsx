'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Checkbox } from '@/components/ui/checkbox'
import { ClientType, RiskLevel } from '@/lib/types'

export function NewClientForm() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [clientType, setClientType] = useState<ClientType>('individual')

  // Form state
  const [formData, setFormData] = useState({
    // Individual
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    // Entity
    entityName: '',
    acn: '',
    abn: '',
    // Contact
    email: '',
    phone: '',
    street: '',
    suburb: '',
    state: '',
    postcode: '',
    // AML
    sourceOfFunds: '',
    purposeOfEngagement: '',
    pepStatus: false,
    riskLevel: 'low' as RiskLevel,
  })

  const handleChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    const supabase = createClient()

    // Get current user and their staff record
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      setError('You must be logged in')
      setIsLoading(false)
      return
    }

    const { data: staff, error: staffError } = await supabase
      .from('staff')
      .select('organization_id')
      .eq('id', user.id)
      .single()

    console.log('[v0] User ID:', user.id)
    console.log('[v0] Staff query result:', staff)
    console.log('[v0] Staff query error:', staffError)

    if (!staff) {
      setError(`Staff record not found: ${staffError?.message || 'Unknown error'}`)
      setIsLoading(false)
      return
    }

    try {
      const clientData = {
        organization_id: staff.organization_id,
        client_type: clientType,
        first_name: clientType === 'individual' ? formData.firstName : null,
        last_name: clientType === 'individual' ? formData.lastName : null,
        date_of_birth: clientType === 'individual' && formData.dateOfBirth ? formData.dateOfBirth : null,
        entity_name: clientType !== 'individual' ? formData.entityName : null,
        acn: clientType !== 'individual' ? formData.acn : null,
        abn: formData.abn || null,
        email: formData.email || null,
        phone: formData.phone || null,
        address: {
          street: formData.street,
          suburb: formData.suburb,
          state: formData.state,
          postcode: formData.postcode,
          country: 'Australia',
        },
        source_of_funds: formData.sourceOfFunds || null,
        purpose_of_engagement: formData.purposeOfEngagement || null,
        pep_status: formData.pepStatus,
        risk_level: formData.riskLevel,
        verification_status: 'pending',
        created_by: user.id,
        assigned_to: user.id,
      }

      const { data: newClient, error: insertError } = await supabase
        .from('clients')
        .insert(clientData)
        .select()
        .single()

      if (insertError) throw insertError

      // Log the action
      await supabase.from('audit_logs').insert({
        organization_id: staff.organization_id,
        action: 'client_created',
        entity_type: 'client',
        entity_id: newClient.id,
        details: { client_type: clientType },
        performed_by: user.id,
        performed_by_email: user.email,
      })

      router.push(`/dashboard/clients/${newClient.id}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create client')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Client Type */}
      <div className="space-y-2">
        <Label>Client Type</Label>
        <Tabs value={clientType} onValueChange={(v) => setClientType(v as ClientType)}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="individual">Individual</TabsTrigger>
            <TabsTrigger value="company">Company</TabsTrigger>
            <TabsTrigger value="trust">Trust</TabsTrigger>
            <TabsTrigger value="partnership">Partnership</TabsTrigger>
          </TabsList>

          <TabsContent value="individual" className="mt-4 space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name *</Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) => handleChange('firstName', e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name *</Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) => handleChange('lastName', e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="dateOfBirth">Date of Birth</Label>
              <Input
                id="dateOfBirth"
                type="date"
                value={formData.dateOfBirth}
                onChange={(e) => handleChange('dateOfBirth', e.target.value)}
              />
            </div>
          </TabsContent>

          <TabsContent value="company" className="mt-4 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="entityName">Company Name *</Label>
              <Input
                id="entityName"
                value={formData.entityName}
                onChange={(e) => handleChange('entityName', e.target.value)}
                required={clientType === 'company'}
              />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="acn">ACN</Label>
                <Input
                  id="acn"
                  value={formData.acn}
                  onChange={(e) => handleChange('acn', e.target.value)}
                  placeholder="123 456 789"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="abn">ABN</Label>
                <Input
                  id="abn"
                  value={formData.abn}
                  onChange={(e) => handleChange('abn', e.target.value)}
                  placeholder="12 345 678 901"
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="trust" className="mt-4 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="entityName">Trust Name *</Label>
              <Input
                id="entityName"
                value={formData.entityName}
                onChange={(e) => handleChange('entityName', e.target.value)}
                required={clientType === 'trust'}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="abn">ABN (if registered)</Label>
              <Input
                id="abn"
                value={formData.abn}
                onChange={(e) => handleChange('abn', e.target.value)}
              />
            </div>
          </TabsContent>

          <TabsContent value="partnership" className="mt-4 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="entityName">Partnership Name *</Label>
              <Input
                id="entityName"
                value={formData.entityName}
                onChange={(e) => handleChange('entityName', e.target.value)}
                required={clientType === 'partnership'}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="abn">ABN</Label>
              <Input
                id="abn"
                value={formData.abn}
                onChange={(e) => handleChange('abn', e.target.value)}
              />
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Contact Details */}
      <div className="space-y-4 border-t border-border pt-6">
        <h3 className="font-medium">Contact Details</h3>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="street">Street Address</Label>
          <Input
            id="street"
            value={formData.street}
            onChange={(e) => handleChange('street', e.target.value)}
          />
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          <div className="space-y-2">
            <Label htmlFor="suburb">Suburb</Label>
            <Input
              id="suburb"
              value={formData.suburb}
              onChange={(e) => handleChange('suburb', e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="state">State</Label>
            <Select value={formData.state} onValueChange={(v) => handleChange('state', v)}>
              <SelectTrigger>
                <SelectValue placeholder="Select state" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="NSW">NSW</SelectItem>
                <SelectItem value="VIC">VIC</SelectItem>
                <SelectItem value="QLD">QLD</SelectItem>
                <SelectItem value="WA">WA</SelectItem>
                <SelectItem value="SA">SA</SelectItem>
                <SelectItem value="TAS">TAS</SelectItem>
                <SelectItem value="ACT">ACT</SelectItem>
                <SelectItem value="NT">NT</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="postcode">Postcode</Label>
            <Input
              id="postcode"
              value={formData.postcode}
              onChange={(e) => handleChange('postcode', e.target.value)}
              maxLength={4}
            />
          </div>
        </div>
      </div>

      {/* AML Assessment */}
      <div className="space-y-4 border-t border-border pt-6">
        <h3 className="font-medium">AML Assessment</h3>
        <div className="space-y-2">
          <Label htmlFor="sourceOfFunds">Source of Funds</Label>
          <Textarea
            id="sourceOfFunds"
            value={formData.sourceOfFunds}
            onChange={(e) => handleChange('sourceOfFunds', e.target.value)}
            placeholder="Describe the client's source of funds..."
            rows={3}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="purposeOfEngagement">Purpose of Engagement</Label>
          <Textarea
            id="purposeOfEngagement"
            value={formData.purposeOfEngagement}
            onChange={(e) => handleChange('purposeOfEngagement', e.target.value)}
            placeholder="Describe why the client is engaging your services..."
            rows={3}
          />
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label>Risk Level</Label>
            <Select
              value={formData.riskLevel}
              onValueChange={(v) => handleChange('riskLevel', v)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low Risk</SelectItem>
                <SelectItem value="medium">Medium Risk</SelectItem>
                <SelectItem value="high">High Risk</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-end space-x-2 pb-2">
            <Checkbox
              id="pepStatus"
              checked={formData.pepStatus}
              onCheckedChange={(checked) => handleChange('pepStatus', !!checked)}
            />
            <Label htmlFor="pepStatus" className="cursor-pointer">
              Politically Exposed Person (PEP)
            </Label>
          </div>
        </div>
      </div>

      {error && (
        <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
          {error}
        </div>
      )}

      <div className="flex gap-4">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Creating...' : 'Create Client'}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>
      </div>
    </form>
  )
}
