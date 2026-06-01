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

  try {
    const formData = await request.formData()
    const files = formData.getAll('files') as File[]

    if (!files || files.length === 0) {
      return NextResponse.json({ error: 'No files provided' }, { status: 400 })
    }

    // Upload files to Supabase Storage
    const uploadedFiles = []
    for (const file of files) {
      const fileExt = file.name.split('.').pop()
      const fileName = `${client.id}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`

      const { error: uploadError } = await supabase.storage
        .from('client-documents')
        .upload(fileName, file)

      if (uploadError) {
        console.error('Upload error:', uploadError)
        continue
      }

      uploadedFiles.push(fileName)
    }

    if (uploadedFiles.length === 0) {
      return NextResponse.json({ error: 'Failed to upload files' }, { status: 500 })
    }

    // For demo purposes, add points based on number of documents
    // In production, you would verify document types and assign appropriate points
    const newPoints = Math.min(client.verification_points + (uploadedFiles.length * 35), 140)

    await supabase
      .from('clients')
      .update({
        verification_points: newPoints,
        onboarding_status: newPoints >= 100 ? 'documents_uploaded' : 'pending_documents',
        updated_at: new Date().toISOString(),
      })
      .eq('id', client.id)

    return NextResponse.json({ 
      success: true, 
      filesUploaded: uploadedFiles.length,
      newPoints 
    })
  } catch (error) {
    console.error('Error uploading documents:', error)
    return NextResponse.json(
      { error: 'Failed to upload documents. Please try again.' },
      { status: 500 }
    )
  }
}
