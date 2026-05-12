import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get staff info
    const { data: staff } = await supabase
      .from('staff')
      .select('organization_id')
      .eq('id', user.id)
      .single()

    if (!staff) {
      return NextResponse.json({ error: 'Staff not found' }, { status: 404 })
    }

    const { clientId, category, documentType, points, extractedData } = await request.json()

    if (!clientId || !category || !documentType || !points) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Create verification record
    const { data: verification, error: verificationError } = await supabase
      .from('id_verifications')
      .insert({
        client_id: clientId,
        organization_id: staff.organization_id,
        document_type: documentType,
        category,
        points,
        document_number: extractedData?.documentNumber || null,
        issuing_authority: extractedData?.issuingAuthority || null,
        issue_date: extractedData?.issueDate || null,
        expiry_date: extractedData?.expiryDate || null,
        ai_extracted_data: extractedData || {},
        ai_confidence_score: extractedData?.confidence || null,
        ai_extraction_date: new Date().toISOString(),
        status: 'verified', // AI-assisted with staff confirmation
        verified_by: user.id,
        verified_at: new Date().toISOString(),
        created_by: user.id,
      })
      .select()
      .single()

    if (verificationError) {
      throw verificationError
    }

    // Update client verification points and status
    const { data: client } = await supabase
      .from('clients')
      .select('verification_points')
      .eq('id', clientId)
      .single()

    const newPoints = (client?.verification_points || 0) + points
    const newStatus = newPoints >= 100 ? 'verified' : 'in_progress'

    const { error: updateError } = await supabase
      .from('clients')
      .update({
        verification_points: newPoints,
        verification_status: newStatus,
        verified_at: newStatus === 'verified' ? new Date().toISOString() : null,
        verified_by: newStatus === 'verified' ? user.id : null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', clientId)

    if (updateError) {
      throw updateError
    }

    // Log audit trail
    await supabase.from('audit_logs').insert({
      organization_id: staff.organization_id,
      action: 'id_verification_added',
      entity_type: 'id_verification',
      entity_id: verification.id,
      details: {
        client_id: clientId,
        document_type: documentType,
        category,
        points,
        ai_confidence: extractedData?.confidence,
      },
      performed_by: user.id,
      performed_by_email: user.email,
    })

    // If client is now verified, log that too
    if (newStatus === 'verified' && (client?.verification_points || 0) < 100) {
      await supabase.from('audit_logs').insert({
        organization_id: staff.organization_id,
        action: 'client_verified',
        entity_type: 'client',
        entity_id: clientId,
        details: {
          total_points: newPoints,
        },
        performed_by: user.id,
        performed_by_email: user.email,
      })
    }

    return NextResponse.json({ 
      success: true, 
      verification,
      clientStatus: newStatus,
      totalPoints: newPoints,
    })
  } catch (error) {
    console.error('Verification create error:', error)
    return NextResponse.json({ error: 'Failed to create verification' }, { status: 500 })
  }
}
