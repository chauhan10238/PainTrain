import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { randomBytes } from 'crypto'

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const supabase = await createClient()

  // Generate a unique token
  const token = randomBytes(32).toString('hex')

  // Update client with the token
  const { error } = await supabase
    .from('clients')
    .update({
      onboarding_token: token,
      onboarding_status: 'pending_documents',
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)

  if (error) {
    return NextResponse.json({ error: 'Failed to generate link' }, { status: 500 })
  }

  return NextResponse.json({ token })
}
