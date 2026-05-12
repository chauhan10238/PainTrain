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
import { Upload, FileText, Sparkles, Check, Loader2, AlertTriangle, PenLine } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
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
  const [entryMode, setEntryMode] = useState<'ai' | 'manual'>('manual')
  const [manualData, setManualData] = useState({
    documentNumber: '',
    issuingAuthority: '',
    issueDate: '',
    expiryDate: '',
    fullName: '',
    dateOfBirth: '',
  })
  const [blobPath, setBlobPath] = useState<string | null>(null)

  const selectedDoc = documentTypes.find(d => d.type === selectedType)

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (!selectedFile) return

    // Validate file type - images for AI, images + PDF for manual
    const imageTypes = ['image/jpeg', 'image/png', 'image/webp']
    const allTypes = [...imageTypes, 'application/pdf']
    
    if (entryMode === 'ai' && !imageTypes.includes(selectedFile.type)) {
      setError('AI extraction only supports image files (JPG, PNG, WebP). Switch to Manual Entry for PDF files.')
      return
    }
    
    if (entryMode === 'manual' && !allTypes.includes(selectedFile.type)) {
      setError('Please upload an image (JPG, PNG, WebP) or PDF file.')
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

  const handleUploadOnly = async () => {
    if (!file || !selectedType) return

    setIsUploading(true)
    setError(null)

    try {
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

      const { blobPath: uploadedPath } = await uploadResponse.json()
      setBlobPath(uploadedPath)
      setShowReviewDialog(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setIsUploading(false)
    }
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

      const { blobPath: uploadedPath } = await uploadResponse.json()
      setBlobPath(uploadedPath)

      setIsUploading(false)
      setIsExtracting(true)

      // AI extraction
      const extractResponse = await fetch('/api/documents/extract', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          blobPath: uploadedPath,
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
    if (!selectedDoc) return

    // Use extracted data for AI mode, manual data for manual mode
    const dataToSubmit = entryMode === 'ai' ? extractedData : {
      ...manualData,
      confidence: 1.0, // Manual entry is 100% accurate as entered by staff
      isValidDocument: true,
    }

    if (!dataToSubmit) return

    try {
      const response = await fetch('/api/verifications/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientId,
          category,
          documentType: selectedType,
          points: selectedDoc.points,
          extractedData: dataToSubmit,
          blobPath,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to create verification')
      }

      setShowReviewDialog(false)
      setFile(null)
      setSelectedType('')
      setExtractedData(null)
      setBlobPath(null)
      setManualData({
        documentNumber: '',
        issuingAuthority: '',
        issueDate: '',
        expiryDate: '',
        fullName: '',
        dateOfBirth: '',
      })
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

      {/* Entry mode selection */}
      {selectedType && (
        <Tabs value={entryMode} onValueChange={(v) => setEntryMode(v as 'ai' | 'manual')} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="manual" className="gap-2">
              <PenLine className="h-4 w-4" />
              Manual Entry
            </TabsTrigger>
            <TabsTrigger value="ai" className="gap-2">
              <Sparkles className="h-4 w-4" />
              AI Extraction
            </TabsTrigger>
          </TabsList>

          {/* Manual Entry Mode */}
          <TabsContent value="manual" className="space-y-4 pt-4">
            <div className="rounded-lg border bg-muted/50 p-3 text-sm text-muted-foreground">
              Upload the document image and manually enter the details below. Staff will review and verify.
            </div>

            {/* File upload for manual mode */}
            <div
              className="cursor-pointer rounded-lg border-2 border-dashed border-border p-6 text-center transition-colors hover:border-primary/50"
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".jpg,.jpeg,.png,.webp,.pdf,image/jpeg,image/png,image/webp,application/pdf"
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
                  <p className="font-medium">Click to upload document</p>
                  <p className="text-sm text-muted-foreground">
                    JPG, PNG, WebP, or PDF (max 10MB)
                  </p>
                </>
              )}
            </div>

            {/* Manual entry fields */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name *</Label>
                <Input
                  id="fullName"
                  value={manualData.fullName}
                  onChange={(e) => setManualData({ ...manualData, fullName: e.target.value })}
                  placeholder="As shown on document"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="documentNumber">Document Number *</Label>
                <Input
                  id="documentNumber"
                  value={manualData.documentNumber}
                  onChange={(e) => setManualData({ ...manualData, documentNumber: e.target.value })}
                  placeholder="e.g., PA1234567"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="issuingAuthority">Issuing Authority</Label>
                <Input
                  id="issuingAuthority"
                  value={manualData.issuingAuthority}
                  onChange={(e) => setManualData({ ...manualData, issuingAuthority: e.target.value })}
                  placeholder="e.g., Australian Passport Office"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dateOfBirth">Date of Birth</Label>
                <Input
                  id="dateOfBirth"
                  type="date"
                  value={manualData.dateOfBirth}
                  onChange={(e) => setManualData({ ...manualData, dateOfBirth: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="issueDate">Issue Date</Label>
                <Input
                  id="issueDate"
                  type="date"
                  value={manualData.issueDate}
                  onChange={(e) => setManualData({ ...manualData, issueDate: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="expiryDate">Expiry Date</Label>
                <Input
                  id="expiryDate"
                  type="date"
                  value={manualData.expiryDate}
                  onChange={(e) => setManualData({ ...manualData, expiryDate: e.target.value })}
                />
              </div>
            </div>

            {error && (
              <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
                {error}
              </div>
            )}

            <Button
              onClick={handleUploadOnly}
              disabled={isUploading || !file || !manualData.fullName || !manualData.documentNumber}
              className="w-full"
            >
              {isUploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Check className="mr-2 h-4 w-4" />
                  Upload & Add Verification
                </>
              )}
            </Button>
          </TabsContent>

          {/* AI Extraction Mode */}
          <TabsContent value="ai" className="space-y-4 pt-4">
            <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-3 text-sm text-yellow-800 dark:border-yellow-800 dark:bg-yellow-950 dark:text-yellow-200">
              <AlertTriangle className="mr-2 inline h-4 w-4" />
              AI extraction requires a valid Google Gemini API key. Use Manual Entry if AI is not available.
            </div>

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
                    JPG, PNG, or WebP image only (max 10MB)
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
          </TabsContent>
        </Tabs>
      )}

      {/* Review Dialog */}
      <Dialog open={showReviewDialog} onOpenChange={setShowReviewDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {entryMode === 'ai' ? (
                <Sparkles className="h-5 w-5 text-primary" />
              ) : (
                <PenLine className="h-5 w-5 text-primary" />
              )}
              {entryMode === 'ai' ? 'AI Extraction Results' : 'Review Document Details'}
            </DialogTitle>
            <DialogDescription>
              {entryMode === 'ai' 
                ? 'Review the extracted information and confirm verification'
                : 'Confirm the manually entered document details'}
            </DialogDescription>
          </DialogHeader>

          {(extractedData || entryMode === 'manual') && (
            <div className="space-y-4">
              {/* Only show confidence for AI mode */}
              {entryMode === 'ai' && extractedData && (
                <>
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
                </>
              )}

              {/* Manual mode indicator */}
              {entryMode === 'manual' && (
                <div className="flex items-center justify-between rounded-lg bg-blue-50 p-3 dark:bg-blue-950">
                  <span className="text-sm text-muted-foreground">Entry Method</span>
                  <Badge variant="secondary">Manual Entry</Badge>
                </div>
              )}

              {/* Display data - use extracted for AI mode, manual for manual mode */}
              {(() => {
                const displayData = entryMode === 'ai' ? extractedData : manualData
                if (!displayData) return null
                return (
                  <div className="grid gap-3">
                    {displayData.fullName && (
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Full Name</span>
                        <span className="font-medium">{displayData.fullName}</span>
                      </div>
                    )}
                    {displayData.documentNumber && (
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Document Number</span>
                        <span className="font-mono font-medium">{displayData.documentNumber}</span>
                      </div>
                    )}
                    {displayData.issuingAuthority && (
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Issuing Authority</span>
                        <span className="font-medium">{displayData.issuingAuthority}</span>
                      </div>
                    )}
                    {displayData.issueDate && (
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Issue Date</span>
                        <span className="font-medium">{displayData.issueDate}</span>
                      </div>
                    )}
                    {displayData.expiryDate && (
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Expiry Date</span>
                        <span className="font-medium">{displayData.expiryDate}</span>
                      </div>
                    )}
                    {displayData.dateOfBirth && (
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Date of Birth</span>
                        <span className="font-medium">{displayData.dateOfBirth}</span>
                      </div>
                    )}
                  </div>
                )
              })()}

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
