'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Upload, FileText, Sparkles, Check, Loader2, AlertTriangle } from 'lucide-react'
import { IDCategory } from '@/lib/types'

interface DocumentType {
  type: string
  name: string
  points: number
}

interface IDUploadFormProps {
  clientId: string
  category: IDCategory
  documentTypes: readonly DocumentType[]
}

interface ExtractedData {
  isValidDocument?: boolean
  detectedDocumentType?: string
  expectedDocumentType?: string
  rejectionReason?: string
  documentNumber?: string
  issuingAuthority?: string
  issueDate?: string
  expiryDate?: string
  fullName?: string
  dateOfBirth?: string
  address?: string
  confidence: number
}

export function IDUploadForm({ clientId, category, documentTypes }: IDUploadFormProps) {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [selectedType, setSelectedType] = useState<string>('')
  const [file, setFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [isExtracting, setIsExtracting] = useState(false)
  const [showReviewDialog, setShowReviewDialog] = useState(false)
  const [extractedData, setExtractedData] = useState<ExtractedData | null>(null)
  const [error, setError] = useState<string | null>(null)

  const selectedDoc = documentTypes.find(d => d.type === selectedType)

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (!selectedFile) return

    // Validate file type - only images supported for AI extraction
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp']
    if (!allowedTypes.includes(selectedFile.type)) {
      setError('Please upload an image file (JPG, PNG, or WebP). PDF files are not supported.')
      return
    }

    // Validate file size (max 10MB)
    if (selectedFile.size > 10 * 1024 * 1024) {
      setError('File size must be less than 10MB')
      return
    }

    setFile(selectedFile)
    setError(null)
  }

  const handleUploadAndExtract = async () => {
    if (!file || !selectedType) return

    setIsUploading(true)
    setError(null)

    try {
      // Upload to Vercel Blob
      const formData = new FormData()
      formData.append('file', file)
      formData.append('clientId', clientId)
      formData.append('category', category)
      formData.append('documentType', selectedType)

      const uploadResponse = await fetch('/api/documents/upload', {
        method: 'POST',
        body: formData,
      })

      if (!uploadResponse.ok) {
        throw new Error('Upload failed')
      }

      const { blobPath } = await uploadResponse.json()

      setIsUploading(false)
      setIsExtracting(true)

      // AI extraction
      const extractResponse = await fetch('/api/documents/extract', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          blobPath,
          documentType: selectedType,
          category,
        }),
      })

      if (!extractResponse.ok) {
        throw new Error('Extraction failed')
      }

      const extracted = await extractResponse.json()
      
      // Check if document was rejected by AI validation
      if (extracted.isValidDocument === false) {
        setError(extracted.rejectionReason || 'This document does not match the selected document type. Please upload the correct document.')
        setFile(null)
        if (fileInputRef.current) {
          fileInputRef.current.value = ''
        }
        return
      }
      
      // Also reject if confidence is too low
      if (extracted.confidence < 0.6) {
        setError(`Document verification confidence is too low (${Math.round(extracted.confidence * 100)}%). Please upload a clearer image of your ${selectedType.replace(/_/g, ' ')}.`)
        setFile(null)
        if (fileInputRef.current) {
          fileInputRef.current.value = ''
        }
        return
      }
      
      setExtractedData(extracted)
      setShowReviewDialog(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setIsUploading(false)
      setIsExtracting(false)
    }
  }

  const handleConfirmVerification = async () => {
    if (!extractedData || !selectedDoc) return

    try {
      const response = await fetch('/api/verifications/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientId,
          category,
          documentType: selectedType,
          points: selectedDoc.points,
          extractedData,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to create verification')
      }

      setShowReviewDialog(false)
      setFile(null)
      setSelectedType('')
      setExtractedData(null)
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save verification')
    }
  }

  return (
    <div className="space-y-4">
      {/* Document type selection */}
      <div className="space-y-2">
        <Label>Document Type</Label>
        <Select value={selectedType} onValueChange={setSelectedType}>
          <SelectTrigger>
            <SelectValue placeholder="Select document type" />
          </SelectTrigger>
          <SelectContent>
            {documentTypes.map((doc) => (
              <SelectItem key={doc.type} value={doc.type}>
                <div className="flex items-center justify-between gap-4">
                  <span>{doc.name}</span>
                  <Badge variant="secondary" className="ml-2">
                    {doc.points} pts
                  </Badge>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* File upload */}
      {selectedType && (
        <div className="space-y-4">
          <div
            className="cursor-pointer rounded-lg border-2 border-dashed border-border p-6 text-center transition-colors hover:border-primary/50"
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
              onChange={handleFileSelect}
              className="hidden"
            />
            {file ? (
              <div className="flex items-center justify-center gap-3">
                <FileText className="h-8 w-8 text-primary" />
                <div className="text-left">
                  <p className="font-medium">{file.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>
            ) : (
              <>
                <Upload className="mx-auto mb-2 h-8 w-8 text-muted-foreground" />
                <p className="font-medium">Click to upload or drag and drop</p>
                <p className="text-sm text-muted-foreground">
                  JPG, PNG, or WebP image (max 10MB)
                </p>
              </>
            )}
          </div>

          {error && (
            <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
              {error}
            </div>
          )}

          {file && (
            <Button
              onClick={handleUploadAndExtract}
              disabled={isUploading || isExtracting}
              className="w-full"
            >
              {isUploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Uploading...
                </>
              ) : isExtracting ? (
                <>
                  <Sparkles className="mr-2 h-4 w-4 animate-pulse" />
                  AI Extracting...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Upload & Extract with AI
                </>
              )}
            </Button>
          )}
        </div>
      )}

      {/* Review Dialog */}
      <Dialog open={showReviewDialog} onOpenChange={setShowReviewDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              AI Extraction Results
            </DialogTitle>
            <DialogDescription>
              Review the extracted information and confirm verification
            </DialogDescription>
          </DialogHeader>

          {extractedData && (
            <div className="space-y-4">
              <div className={`flex items-center justify-between rounded-lg p-3 ${
                extractedData.confidence >= 0.8 ? 'bg-green-50 dark:bg-green-950' : 
                extractedData.confidence >= 0.6 ? 'bg-yellow-50 dark:bg-yellow-950' : 
                'bg-red-50 dark:bg-red-950'
              }`}>
                <span className="text-sm text-muted-foreground">AI Confidence</span>
                <div className="flex items-center gap-2">
                  {extractedData.confidence < 0.8 && (
                    <AlertTriangle className={`h-4 w-4 ${
                      extractedData.confidence >= 0.6 ? 'text-yellow-600' : 'text-red-600'
                    }`} />
                  )}
                  <Badge variant={extractedData.confidence >= 0.8 ? 'default' : extractedData.confidence >= 0.6 ? 'secondary' : 'destructive'}>
                    {Math.round(extractedData.confidence * 100)}%
                  </Badge>
                </div>
              </div>
              
              {extractedData.confidence < 0.8 && extractedData.confidence >= 0.6 && (
                <div className="rounded-md border border-yellow-200 bg-yellow-50 p-3 text-sm text-yellow-800 dark:border-yellow-800 dark:bg-yellow-950 dark:text-yellow-200">
                  <AlertTriangle className="mr-2 inline h-4 w-4" />
                  Moderate confidence - please verify the extracted data carefully before confirming.
                </div>
              )}

              <div className="grid gap-3">
                {extractedData.fullName && (
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Full Name</span>
                    <span className="font-medium">{extractedData.fullName}</span>
                  </div>
                )}
                {extractedData.documentNumber && (
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Document Number</span>
                    <span className="font-mono font-medium">{extractedData.documentNumber}</span>
                  </div>
                )}
                {extractedData.issuingAuthority && (
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Issuing Authority</span>
                    <span className="font-medium">{extractedData.issuingAuthority}</span>
                  </div>
                )}
                {extractedData.issueDate && (
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Issue Date</span>
                    <span className="font-medium">{extractedData.issueDate}</span>
                  </div>
                )}
                {extractedData.expiryDate && (
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Expiry Date</span>
                    <span className="font-medium">{extractedData.expiryDate}</span>
                  </div>
                )}
                {extractedData.dateOfBirth && (
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Date of Birth</span>
                    <span className="font-medium">{extractedData.dateOfBirth}</span>
                  </div>
                )}
              </div>

              {selectedDoc && (
                <div className="rounded-lg border border-green-200 bg-green-50 p-3">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-green-800">Points to be awarded</span>
                    <Badge className="bg-green-600">{selectedDoc.points} points</Badge>
                  </div>
                </div>
              )}
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowReviewDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleConfirmVerification}>
              <Check className="mr-2 h-4 w-4" />
              Confirm Verification
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
