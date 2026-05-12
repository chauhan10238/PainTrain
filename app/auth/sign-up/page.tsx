'use client'

import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Shield, UserPlus } from 'lucide-react'

export default function SignUpPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [organizationName, setOrganizationName] = useState('')
  const [organizationType, setOrganizationType] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      setIsLoading(false)
      return
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters')
      setIsLoading(false)
      return
    }

    const supabase = createClient()

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo:
            process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL ??
            `${window.location.origin}/auth/callback`,
          data: {
            full_name: fullName,
            organization_name: organizationName,
            organization_type: organizationType,
          },
        },
      })
      if (error) throw error
      router.push('/auth/sign-up-success')
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : 'An error occurred')
    } finally {
      setIsLoading(false)
    }
  }

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
            <p className="text-sm text-muted-foreground">Compliance Management Platform</p>
          </div>

          <Card className="border-border/50 shadow-lg">
            <CardHeader className="text-center">
              <CardTitle className="text-xl">Create your account</CardTitle>
              <CardDescription>
                Start your 14-day free trial
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSignUp}>
                <div className="flex flex-col gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input
                      id="fullName"
                      type="text"
                      placeholder="John Smith"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="email">Work Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="name@company.com"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="organizationName">Organization Name</Label>
                    <Input
                      id="organizationName"
                      type="text"
                      placeholder="Smith & Associates"
                      required
                      value={organizationName}
                      onChange={(e) => setOrganizationName(e.target.value)}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="organizationType">Organization Type</Label>
                    <Select value={organizationType} onValueChange={setOrganizationType} required>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your industry" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="accountant">Accounting Firm</SelectItem>
                        <SelectItem value="lawyer">Law Firm</SelectItem>
                        <SelectItem value="conveyancer">Conveyancing Practice</SelectItem>
                        <SelectItem value="real_estate">Real Estate Agency</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Min. 8 characters"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                  </div>
                  {error && (
                    <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
                      {error}
                    </div>
                  )}
                  <Button type="submit" className="mt-2 h-11 w-full" disabled={isLoading}>
                    {isLoading ? (
                      <span className="flex items-center gap-2">
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                        Creating account...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <UserPlus className="h-4 w-4" />
                        Create account
                      </span>
                    )}
                  </Button>
                </div>
                <div className="mt-6 text-center text-sm text-muted-foreground">
                  Already have an account?{' '}
                  <Link
                    href="/auth/login"
                    className="font-medium text-primary hover:underline"
                  >
                    Sign in
                  </Link>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Terms notice */}
          <p className="text-center text-xs text-muted-foreground">
            By creating an account, you agree to our{' '}
            <Link href="/terms" className="underline hover:text-foreground">Terms of Service</Link>
            {' '}and{' '}
            <Link href="/privacy" className="underline hover:text-foreground">Privacy Policy</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
