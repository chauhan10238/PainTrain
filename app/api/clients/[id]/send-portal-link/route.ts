import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const { email, portalUrl } = await request.json()

  if (!email || !portalUrl) {
    return NextResponse.json({ error: 'Email and portal URL required' }, { status: 400 })
  }

  const supabase = await createClient()

  // Get client details
  const { data: client, error: fetchError } = await supabase
    .from('clients')
    .select('first_name, last_name, entity_name, client_type')
    .eq('id', id)
    .single()

  if (fetchError || !client) {
    return NextResponse.json({ error: 'Client not found' }, { status: 404 })
  }

  const clientName = client.client_type === 'individual'
    ? `${client.first_name || ''} ${client.last_name || ''}`
    : client.entity_name || 'Valued Client'

  // In production, you would send an actual email here using a service like:
  // - SendGrid
  // - Resend
  // - AWS SES
  // - etc.
  
  // For now, we'll just log and update the status
  console.log(`[Email] Sending portal link to ${email}`)
  console.log(`[Email] Client: ${clientName}`)
  console.log(`[Email] Portal URL: ${portalUrl}`)

  // Update onboarding status
  const { error: updateError } = await supabase
    .from('clients')
    .update({
      onboarding_status: 'link_sent',
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)

  if (updateError) {
    return NextResponse.json({ error: 'Failed to update status' }, { status: 500 })
  }

  return NextResponse.json({ 
    success: true,
    message: `Portal link sent to ${email}` 
  })
}
