import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(
  request: Request,
  { params }: { params: Promise<{ token: string }> }
) {
  const { token } = await params
  const body = await request.json()
  const { firstName, lastName, email, phone } = body

  const supabase = await createClient()

  // Find client by token
  const { data: client, error: findError } = await supabase
    .from('clients')
    .select('id')
    .eq('onboarding_token', token)
    .single()

  if (findError || !client) {
    return NextResponse.json({ error: 'Invalid token' }, { status: 404 })
  }

  // Update client details
  const { error: updateError } = await supabase
    .from('clients')
    .update({
      first_name: firstName,
      last_name: lastName,
      email,
      phone,
      updated_at: new Date().toISOString(),
    })
    .eq('id', client.id)

  if (updateError) {
    return NextResponse.json({ error: 'Failed to update details' }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
