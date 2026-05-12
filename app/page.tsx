import Link from 'next/link'
import { Button } from '@/components/ui/button'
import {
  Shield,
  FileCheck,
  Users,
  Clock,
  CheckCircle2,
  ArrowRight,
  Building2,
  Scale,
  Home,
  Briefcase,
} from 'lucide-react'

const features = [
  {
    icon: FileCheck,
    title: '5-Point ID Verification',
    description: 'Australian AML/CTF compliant identity verification with AI-assisted document extraction and validation.',
  },
  {
    icon: Users,
    title: 'Secure Client Onboarding',
    description: 'Streamlined digital onboarding workflow with risk assessment and PEP/sanctions screening.',
  },
  {
    icon: Clock,
    title: '7-Year Retention',
    description: 'Automatic compliance retention with secure document storage and expiry tracking.',
  },
  {
    icon: Shield,
    title: 'Complete Audit Trail',
    description: 'Immutable audit logs of all actions for regulatory reporting and compliance reviews.',
  },
]

const industries = [
  { icon: Briefcase, name: 'Accountants', description: 'CPA and tax practices' },
  { icon: Scale, name: 'Lawyers', description: 'Law firms and legal practices' },
  { icon: Home, name: 'Conveyancers', description: 'Property settlement specialists' },
  { icon: Building2, name: 'Real Estate', description: 'Agencies and property managers' },
]

export default function LandingPage() {
  return (
    <div className="flex min-h-svh flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Shield className="h-5 w-5" />
            </div>
            <span className="text-lg font-semibold">AML Comply</span>
          </div>
          <nav className="hidden items-center gap-6 md:flex">
            <Link href="#features" className="text-sm text-muted-foreground hover:text-foreground">Features</Link>
            <Link href="#industries" className="text-sm text-muted-foreground hover:text-foreground">Industries</Link>
            <Link href="#pricing" className="text-sm text-muted-foreground hover:text-foreground">Pricing</Link>
          </nav>
          <div className="flex items-center gap-3">
            <Button variant="ghost" asChild>
              <Link href="/auth/login">Sign in</Link>
            </Button>
            <Button asChild>
              <Link href="/auth/sign-up">Start free trial</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-background to-secondary/20 py-20 md:py-32">
        <div className="mx-auto max-w-7xl px-6 text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-secondary/50 px-4 py-1.5 text-sm">
            <span className="flex h-2 w-2 rounded-full bg-accent" />
            Australian AML/CTF Compliant
          </div>
          <h1 className="mx-auto max-w-4xl text-balance text-4xl font-bold tracking-tight md:text-6xl">
            AML Compliance Made Simple for{' '}
            <span className="text-accent">Professional Services</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-pretty text-lg text-muted-foreground md:text-xl">
            Secure client onboarding, AI-powered ID verification, and 7-year compliance retention. 
            Built for accountants, lawyers, conveyancers, and real estate agencies.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button size="lg" asChild className="h-12 px-8">
              <Link href="/auth/sign-up">
                Start 14-day free trial
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="h-12 px-8">
              <Link href="#features">See how it works</Link>
            </Button>
          </div>
          <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
            <span className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-accent" />
              No credit card required
            </span>
            <span className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-accent" />
              Set up in minutes
            </span>
            <span className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-accent" />
              Cancel anytime
            </span>
          </div>
        </div>
      </section>

      {/* Industries */}
      <section id="industries" className="border-y border-border bg-card py-16">
        <div className="mx-auto max-w-7xl px-6">
          <p className="mb-8 text-center text-sm font-medium uppercase tracking-wider text-muted-foreground">
            Trusted by regulated professionals
          </p>
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {industries.map((industry) => (
              <div key={industry.name} className="flex flex-col items-center gap-3 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-secondary">
                  <industry.icon className="h-6 w-6 text-muted-foreground" />
                </div>
                <div>
                  <p className="font-medium">{industry.name}</p>
                  <p className="text-sm text-muted-foreground">{industry.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 md:py-32">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center">
            <h2 className="text-3xl font-bold md:text-4xl">Everything you need for AML compliance</h2>
            <p className="mt-4 text-lg text-muted-foreground">
              A complete compliance management system designed for Australian professional services
            </p>
          </div>
          <div className="mt-16 grid gap-8 md:grid-cols-2">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="group rounded-xl border border-border bg-card p-8 transition-colors hover:border-accent/50"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10 text-accent transition-colors group-hover:bg-accent group-hover:text-accent-foreground">
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-semibold">{feature.title}</h3>
                <p className="mt-2 text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-border bg-primary py-20 text-primary-foreground">
        <div className="mx-auto max-w-7xl px-6 text-center">
          <h2 className="text-3xl font-bold md:text-4xl">Ready to simplify your AML compliance?</h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-primary-foreground/80">
            Join hundreds of Australian professional services firms using AML Comply to manage their compliance obligations.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button size="lg" variant="secondary" asChild className="h-12 px-8">
              <Link href="/auth/sign-up">
                Start free trial
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="h-12 border-primary-foreground/20 px-8 text-primary-foreground hover:bg-primary-foreground/10">
              <Link href="/contact">Contact sales</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card py-12">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Shield className="h-4 w-4" />
              </div>
              <span className="font-semibold">AML Comply</span>
            </div>
            <nav className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
              <Link href="/privacy" className="hover:text-foreground">Privacy</Link>
              <Link href="/terms" className="hover:text-foreground">Terms</Link>
              <Link href="/security" className="hover:text-foreground">Security</Link>
              <Link href="/contact" className="hover:text-foreground">Contact</Link>
            </nav>
            <p className="text-sm text-muted-foreground">
              2026 AML Comply. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
