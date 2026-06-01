import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Shield, Mail, CheckCircle2 } from 'lucide-react'

export default function SignUpSuccessPage() {
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
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-accent/20">
                <CheckCircle2 className="h-8 w-8 text-accent" />
              </div>
              <CardTitle className="text-xl">Check your email</CardTitle>
              <CardDescription>
                We&apos;ve sent you a confirmation link
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <div className="mb-6 flex flex-col items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-secondary">
                  <Mail className="h-6 w-6 text-muted-foreground" />
                </div>
                <p className="text-sm text-muted-foreground">
                  Click the link in your email to verify your account and complete your organization setup.
                </p>
              </div>
              <div className="flex flex-col gap-3">
                <Button variant="outline" asChild>
                  <Link href="/auth/login">Back to sign in</Link>
                </Button>
              </div>
              <p className="mt-4 text-xs text-muted-foreground">
                Didn&apos;t receive the email? Check your spam folder or contact support.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
