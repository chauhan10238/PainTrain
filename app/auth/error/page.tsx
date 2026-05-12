import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Shield, AlertCircle } from 'lucide-react'

export default function AuthErrorPage() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center bg-gradient-to-br from-background via-background to-secondary/30 p-6 md:p-10">
      <div className="w-full max-w-md">
        <div className="flex flex-col gap-6">
          {/* Logo and Brand */}
          <div className="flex flex-col items-center gap-2">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <Shield className="h-8 w-8" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">AML Comply</h1>
          </div>

          <Card className="border-border/50 shadow-lg">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
                <AlertCircle className="h-8 w-8 text-destructive" />
              </div>
              <CardTitle className="text-xl">Authentication Error</CardTitle>
              <CardDescription>
                Something went wrong during authentication
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <p className="mb-6 text-sm text-muted-foreground">
                The authentication link may have expired or is invalid. Please try signing in again.
              </p>
              <div className="flex flex-col gap-3">
                <Button asChild>
                  <Link href="/auth/login">Back to sign in</Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/auth/sign-up">Create new account</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
