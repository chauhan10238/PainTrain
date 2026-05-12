import { generateText } from 'ai'
import { google } from '@ai-sdk/google'
import { get } from '@vercel/blob'
import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { blobPath, documentType, category } = await request.json()

    if (!blobPath || !documentType) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Get the blob for AI processing
    const result = await get(blobPath, { access: 'private' })
    
    if (!result) {
      return NextResponse.json({ error: 'Document not found' }, { status: 404 })
    }

    // Read the full stream content
    const reader = result.stream.getReader()
    const chunks: Uint8Array[] = []
    
    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      if (value) chunks.push(value)
    }
    
    // Combine all chunks into a single buffer
    const totalLength = chunks.reduce((acc, chunk) => acc + chunk.length, 0)
    const fullBuffer = new Uint8Array(totalLength)
    let offset = 0
    for (const chunk of chunks) {
      fullBuffer.set(chunk, offset)
      offset += chunk.length
    }
    
    const base64 = Buffer.from(fullBuffer).toString('base64')
    const mimeType = result.blob.contentType || 'image/jpeg'
    
    // Check if it's a PDF
    const isPdf = mimeType === 'application/pdf' || blobPath.toLowerCase().endsWith('.pdf')
    
    // PDFs need to be converted - for now, reject PDFs and ask for images
    if (isPdf) {
      return NextResponse.json({
        isValidDocument: false,
        rejectionReason: 'PDF files are not supported for AI verification. Please upload an image file (JPG, PNG) of your document instead.',
        confidence: 0,
      })
    }

    // Use AI to extract document data
    const prompt = getExtractionPrompt(documentType, category)

    // Use Google Gemini for vision (free tier available)
    // Pass base64 directly as a Buffer for better compatibility
    const { text } = await generateText({
      model: google('gemini-2.0-flash-exp'),
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'image',
              image: Buffer.from(fullBuffer),
              mimeType: mimeType as 'image/jpeg' | 'image/png' | 'image/webp' | 'image/gif',
            },
            {
              type: 'text',
              text: prompt,
            },
          ],
        },
      ],
    })

    // Parse the AI response
    const extractedData = parseAIResponse(text)

    return NextResponse.json(extractedData)
  } catch (error) {
    console.error('[v0] Extraction error:', error)
    console.error('[v0] Error details:', error instanceof Error ? error.message : 'Unknown error')
    
    // Provide more specific error messages
    let rejectionReason = 'Failed to process document. Please ensure you upload a clear image of the correct document type.'
    
    if (error instanceof Error) {
      if (error.message.includes('API key not valid') || error.message.includes('API_KEY_INVALID')) {
        rejectionReason = 'Google Gemini API key is invalid. Please check your GOOGLE_GENERATIVE_AI_API_KEY in environment variables. Get a valid key at: https://aistudio.google.com/apikey'
      } else if (error.message.includes('credit card') || error.message.includes('customer_verification')) {
        rejectionReason = 'AI document verification requires billing setup. Please add a credit card to your Vercel account at vercel.com/account/billing to enable AI features.'
      } else if (error.message.includes('rate limit')) {
        rejectionReason = 'AI service is temporarily busy. Please try again in a moment.'
      } else if (error.message.includes('too large')) {
        rejectionReason = 'Document file is too large. Please upload a smaller file (under 10MB).'
      } else if (error.message.includes('unsupported') || error.message.includes('schema')) {
        rejectionReason = 'File format not supported. Please upload a JPG or PNG image file.'
      }
    }
    
    return NextResponse.json({
      isValidDocument: false,
      rejectionReason,
      confidence: 0,
    })
  }
}

function getExtractionPrompt(documentType: string, category: string): string {
  const docTypeName = documentType.replace(/_/g, ' ')
  
  const basePrompt = `You are an expert AML compliance document validator. You MUST verify that the uploaded image is actually a ${docTypeName}.

STEP 1 - DOCUMENT TYPE VALIDATION:
First, determine what type of document this image shows. Is it:
- A valid identity document (passport, driver's license, birth certificate, etc.)?
- Or something else entirely (random document, classroom file, screenshot, photo, etc.)?

If this is NOT a valid identity document, OR if it does NOT match the expected document type "${docTypeName}", return:
{
  "isValidDocument": false,
  "detectedDocumentType": "describe what the image actually shows",
  "expectedDocumentType": "${docTypeName}",
  "rejectionReason": "This does not appear to be a ${docTypeName}. The image shows [describe what it actually is].",
  "confidence": 0.0
}

STEP 2 - DATA EXTRACTION (only if document type matches):
If and ONLY if this IS a valid ${docTypeName}, extract the following:
{
  "isValidDocument": true,
  "detectedDocumentType": "${docTypeName}",
  "expectedDocumentType": "${docTypeName}",
  "documentNumber": "the document/passport/license number",
  "issuingAuthority": "the issuing authority or country",
  "issueDate": "YYYY-MM-DD format or null",
  "expiryDate": "YYYY-MM-DD format or null", 
  "fullName": "the person's full name",
  "dateOfBirth": "YYYY-MM-DD format or null",
  "address": "full address if present or null",
  "confidence": 0.0-1.0 confidence score based on image quality and data clarity
}

Return ONLY the JSON object, no other text. Be STRICT about document type validation - do not accept anything other than a genuine ${docTypeName}.`

  return basePrompt
}

function parseAIResponse(text: string): Record<string, unknown> {
  try {
    // Try to parse JSON from the response
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0])
      return {
        ...parsed,
        confidence: parsed.confidence || 0.85,
      }
    }
  } catch {
    // If parsing fails, return empty data with low confidence
  }

  return {
    documentNumber: null,
    issuingAuthority: null,
    issueDate: null,
    expiryDate: null,
    fullName: null,
    dateOfBirth: null,
    address: null,
    confidence: 0.5,
  }
}
