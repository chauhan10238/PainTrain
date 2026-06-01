'use client'

import { useState } from 'react'
import { ClientNote } from '@/lib/types'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { MessageSquare, Plus, Send } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

interface ClientNotesProps {
  notes: ClientNote[]
  clientId: string
}

const noteTypeColors = {
  general: 'bg-gray-100 text-gray-800 border-gray-200',
  risk: 'bg-red-100 text-red-800 border-red-200',
  verification: 'bg-blue-100 text-blue-800 border-blue-200',
  compliance: 'bg-green-100 text-green-800 border-green-200',
}

export function ClientNotes({ notes, clientId }: ClientNotesProps) {
  const router = useRouter()
  const [isAdding, setIsAdding] = useState(false)
  const [content, setContent] = useState('')
  const [noteType, setNoteType] = useState<string>('general')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!content.trim()) return

    setIsLoading(true)
    const supabase = createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data: staff } = await supabase
      .from('staff')
      .select('organization_id')
      .eq('id', user.id)
      .single()

    if (!staff) return

    await supabase.from('client_notes').insert({
      client_id: clientId,
      organization_id: staff.organization_id,
      content: content.trim(),
      note_type: noteType,
      created_by: user.id,
    })

    // Log action
    await supabase.from('audit_logs').insert({
      organization_id: staff.organization_id,
      action: 'note_added',
      entity_type: 'client',
      entity_id: clientId,
      details: { note_type: noteType },
      performed_by: user.id,
      performed_by_email: user.email,
    })

    setContent('')
    setIsAdding(false)
    setIsLoading(false)
    router.refresh()
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Notes</CardTitle>
          <CardDescription>Compliance notes and observations</CardDescription>
        </div>
        {!isAdding && (
          <Button onClick={() => setIsAdding(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Note
          </Button>
        )}
      </CardHeader>
      <CardContent>
        {isAdding && (
          <form onSubmit={handleSubmit} className="mb-6 space-y-4 rounded-lg border border-border p-4">
            <div className="flex gap-4">
              <Select value={noteType} onValueChange={setNoteType}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="general">General</SelectItem>
                  <SelectItem value="risk">Risk</SelectItem>
                  <SelectItem value="verification">Verification</SelectItem>
                  <SelectItem value="compliance">Compliance</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Textarea
              placeholder="Add a note..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={3}
            />
            <div className="flex gap-2">
              <Button type="submit" disabled={isLoading || !content.trim()}>
                <Send className="mr-2 h-4 w-4" />
                {isLoading ? 'Saving...' : 'Save Note'}
              </Button>
              <Button type="button" variant="outline" onClick={() => setIsAdding(false)}>
                Cancel
              </Button>
            </div>
          </form>
        )}

        {notes.length > 0 ? (
          <div className="space-y-4">
            {notes.map((note) => (
              <div key={note.id} className="rounded-lg border border-border p-4">
                <div className="mb-2 flex items-center justify-between">
                  <Badge variant="outline" className={noteTypeColors[note.note_type as keyof typeof noteTypeColors]}>
                    {note.note_type}
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    {formatDistanceToNow(new Date(note.created_at), { addSuffix: true })}
                  </span>
                </div>
                <p className="whitespace-pre-wrap text-sm">{note.content}</p>
              </div>
            ))}
          </div>
        ) : (
          !isAdding && (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <MessageSquare className="mb-3 h-10 w-10 text-muted-foreground/50" />
              <p className="font-medium">No notes yet</p>
              <p className="text-sm text-muted-foreground">
                Add notes for compliance records and observations
              </p>
            </div>
          )
        )}
      </CardContent>
    </Card>
  )
}
