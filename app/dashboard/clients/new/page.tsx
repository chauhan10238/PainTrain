import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { NewClientForm } from '@/components/clients/new-client-form'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function NewClientPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      {/* Back button */}
      <Button variant="ghost" asChild className="gap-2">
        <Link href="/dashboard/clients">
          <ArrowLeft className="h-4 w-4" />
          Back to Clients
        </Link>
      </Button>

      <Card>
        <CardHeader>
          <CardTitle>Add New Client</CardTitle>
          <CardDescription>
            Enter client details to begin the AML onboarding process
          </CardDescription>
        </CardHeader>
        <CardContent>
          <NewClientForm />
        </CardContent>
      </Card>
    </div>
  )
}
