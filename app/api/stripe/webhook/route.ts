import { headers } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { stripe, calculateRiskScore, mapStripeStatusToInternal } from '@/lib/stripe'
import { createClient } from '@supabase/supabase-js'

// Use service role for webhook processing (no user context)
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: NextRequest) {
  const body = await request.text()
  const headersList = await headers()
  const signature = headersList.get('stripe-signature')

  if (!signature) {
    return NextResponse.json({ error: 'Missing signature' }, { status: 400 })
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err) {
    console.error('[v0] Webhook signature verification failed:', err)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  // Handle Identity verification events
  if (event.type.startsWith('identity.verification_session')) {
    const session = event.data.object as Stripe.Identity.VerificationSession
    const clientId = session.metadata?.client_id

    if (!clientId) {
      console.error('[v0] No client_id in session metadata')
      return NextResponse.json({ error: 'Missing client_id' }, { status: 400 })
    }

    await handleIdentityEvent(event.type, session, clientId)
  }

  return NextResponse.json({ received: true })
}

async function handleIdentityEvent(
  eventType: string,
  session: Stripe.Identity.VerificationSession,
  clientId: string
) {
  console.log(`[v0] Processing ${eventType} for client ${clientId}`)

  // Get current client data
  const { data: client, error: clientError } = await supabaseAdmin
    .from('clients')
    .select('id, full_name, verification_points, organization_id')
    .eq('id', clientId)
    .single()

  if (clientError || !client) {
    console.error('[v0] Client not found:', clientId)
    return
  }

  const internalStatus = mapStripeStatusToInternal(session.status)
  const riskScore = calculateRiskScore(session, client.verification_points || 0)

  // Determine onboarding status
  let onboardingStatus: string
  switch (session.status) {
    case 'verified':
      onboardingStatus = 'completed'
      break
    case 'requires_input':
      onboardingStatus = 'identity_pending'
      break
    case 'canceled':
    default:
      if (session.last_error) {
        onboardingStatus = 'failed'
      } else {
        onboardingStatus = 'identity_pending'
      }
  }

  // Update client record
  const updateData: Record<string, unknown> = {
    stripe_identity_status: internalStatus,
    risk_score: riskScore,
    onboarding_status: onboardingStatus,
    updated_at: new Date().toISOString(),
  }

  // Set biometric verified timestamp if verified
  if (session.status === 'verified') {
    updateData.biometric_verified_at = new Date().toISOString()
    
    // Also update aml_status to verified if everything passed
    if (riskScore >= 70) {
      updateData.aml_status = 'verified'
    }
  }

  const { error: updateError } = await supabaseAdmin
    .from('clients')
    .update(updateData)
    .eq('id', clientId)

  if (updateError) {
    console.error('[v0] Failed to update client:', updateError)
    return
  }

  // Create detailed audit log
  await supabaseAdmin.from('audit_logs').insert({
    organization_id: client.organization_id,
    action: `stripe_identity_${session.status}`,
    entity_type: 'client',
    entity_id: clientId,
    details: {
      event_type: eventType,
      session_id: session.id,
      session_status: session.status,
      internal_status: internalStatus,
      risk_score: riskScore,
      onboarding_status: onboardingStatus,
      client_name: client.full_name,
      last_error: session.last_error ? {
        code: session.last_error.code,
        reason: session.last_error.reason,
      } : null,
      verified_outputs: session.status === 'verified' ? {
        // Only log non-sensitive verification data
        document_type: session.verified_outputs?.id_number_type,
        has_address: !!session.verified_outputs?.address,
        has_dob: !!session.verified_outputs?.dob,
      } : null,
    },
  })

  console.log(`[v0] Updated client ${clientId}: status=${internalStatus}, risk=${riskScore}, onboarding=${onboardingStatus}`)
}
