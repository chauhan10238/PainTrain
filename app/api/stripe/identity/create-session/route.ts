import { createClient } from '@/lib/supabase/server'
import { 
  createIdentityVerificationSession, 
  mapStripeStatusToInternal 
} from '@/lib/stripe'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    // Get authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { clientId } = await request.json()

    if (!clientId) {
      return NextResponse.json({ error: 'Client ID is required' }, { status: 400 })
    }

    // Get client details
    const { data: client, error: clientError } = await supabase
      .from('clients')
      .select('id, full_name, email, verification_points, stripe_identity_session_id, stripe_identity_status')
      .eq('id', clientId)
      .single()

    if (clientError || !client) {
      return NextResponse.json({ error: 'Client not found' }, { status: 404 })
    }

    // Check if client already has an active session
    if (client.stripe_identity_session_id && 
        client.stripe_identity_status && 
        !['failed', 'canceled'].includes(client.stripe_identity_status)) {
      return NextResponse.json({ 
        error: 'Client already has an active verification session',
        sessionId: client.stripe_identity_session_id,
        status: client.stripe_identity_status
      }, { status: 400 })
    }

    // Check if client has reached 100 points
    if ((client.verification_points || 0) < 100) {
      return NextResponse.json({ 
        error: 'Client must complete 100-point ID verification first',
        currentPoints: client.verification_points || 0
      }, { status: 400 })
    }

    // Create Stripe Identity verification session
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || request.nextUrl.origin
    const returnUrl = `${baseUrl}/dashboard/clients/${clientId}?identity_verification=complete`

    const session = await createIdentityVerificationSession({
      clientId,
      clientEmail: client.email || undefined,
      clientName: client.full_name || undefined,
      returnUrl,
    })

    // Update client with session ID
    const { error: updateError } = await supabase
      .from('clients')
      .update({
        stripe_identity_session_id: session.id,
        stripe_identity_status: mapStripeStatusToInternal(session.status),
        onboarding_status: 'identity_pending',
        updated_at: new Date().toISOString(),
      })
      .eq('id', clientId)

    if (updateError) {
      console.error('[v0] Failed to update client:', updateError)
      return NextResponse.json({ error: 'Failed to update client' }, { status: 500 })
    }

    // Create audit log entry
    await supabase.from('audit_logs').insert({
      user_id: user.id,
      action: 'stripe_identity_initiated',
      entity_type: 'client',
      entity_id: clientId,
      details: {
        session_id: session.id,
        client_name: client.full_name,
        verification_points: client.verification_points,
      },
    })

    return NextResponse.json({
      sessionId: session.id,
      clientSecret: session.client_secret,
      url: session.url,
    })
  } catch (error) {
    console.error('[v0] Stripe Identity session creation error:', error)
    return NextResponse.json(
      { error: 'Failed to create verification session' },
      { status: 500 }
    )
  }
}
