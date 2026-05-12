import { put } from '@vercel/blob'
import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get('file') as File
    const clientId = formData.get('clientId') as string
    const category = formData.get('category') as string
    const documentType = formData.get('documentType') as string

    if (!file || !clientId || !category || !documentType) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Generate unique filename
    const timestamp = Date.now()
    const extension = file.name.split('.').pop()
    const filename = `${clientId}/${category}/${documentType}_${timestamp}.${extension}`

    // Upload to Vercel Blob (private)
    const blob = await put(filename, file, {
      access: 'private',
    })

    return NextResponse.json({ 
      blobPath: blob.pathname,
      url: blob.url,
    })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
  }
}
