import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(
  request: Request,
  { params }: { params: Promise<{ token: string }> }
) {
  const { token } = await params
  const supabase = await createClient()

  // Find client by token
  const { data: client, error: findError } = await supabase
    .from('clients')
    .select('id, verification_points')
    .eq('onboarding_token', token)
    .single()

  if (findError || !client) {
    return NextResponse.json({ error: 'Invalid token' }, { status: 404 })
  }

  // Check if client has enough points
  if (client.verification_points < 100) {
    return NextResponse.json(
      { error: 'Please upload enough documents to reach 100 points first' },
      { status: 400 }
    )
  }

  // Create Stripe Identity verification session
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || ''}/api/stripe/identity/create-session`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        clientId: client.id,
        returnUrl: `${process.env.NEXT_PUBLIC_APP_URL || ''}/client/${token}`,
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error || 'Failed to create verification session')
    }

    return NextResponse.json({ url: data.url })
  } catch (error) {
    console.error('Error creating verification session:', error)
    return NextResponse.json(
      { error: 'Failed to start verification. Please try again.' },
      { status: 500 }
    )
  }
}
