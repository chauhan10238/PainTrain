import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
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
  Fingerprint,
  FileSearch,
  Bell,
  BarChart3,
  Zap,
  Lock,
  XCircle,
  AlertTriangle,
  Mail,
  CreditCard,
  Brain,
  Calculator,
  FileSpreadsheet,
  Send,
  UserCheck,
  ClipboardList,
  Bot,
  ShieldCheck,
  Database,
  UsersRound,
  LineChart,
} from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="flex min-h-svh flex-col bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#10B981] text-white">
              <Shield className="h-5 w-5" />
            </div>
            <span className="text-xl font-bold tracking-tight">
              AML<span className="text-[#10B981]">Comply</span>
            </span>
          </Link>
          
          <nav className="hidden items-center gap-1 lg:flex">
            <Link href="#onboarding" className="px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
              ONBOARDING
            </Link>
            <Link href="#verification" className="px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
              VERIFICATION
            </Link>
            <Link href="#compliance" className="px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
              COMPLIANCE
            </Link>
            <Link href="#pricing" className="px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
              PRICING
            </Link>
            <Link href="#contact" className="px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
              CONTACT
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <Button variant="ghost" asChild className="hidden sm:inline-flex">
              <Link href="/auth/login">LOGIN</Link>
            </Button>
            <Button asChild className="bg-[#10B981] hover:bg-[#059669]">
              <Link href="/auth/sign-up">REGISTER</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden pb-8 pt-16 md:pb-16 md:pt-24">
        <div className="mx-auto max-w-7xl px-6">
          {/* Hero Text */}
          <div className="text-center">
            <h1 className="text-4xl font-light tracking-tight text-foreground md:text-5xl lg:text-6xl">
              Your Complete{' '}
              <span className="font-bold text-[#10B981]">AML Compliance Suite</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
              <span className="font-semibold text-foreground">For Australian Service Providers.</span>{' '}
              Accountants, Bookkeepers, Advisors, Lawyers and more.
            </p>
          </div>

          {/* App Screenshot */}
          <div className="relative mx-auto mt-12 max-w-5xl">
            <div className="overflow-hidden rounded-xl border border-border bg-card shadow-2xl">
              <div className="flex h-8 items-center gap-2 border-b border-border bg-muted/50 px-4">
                <div className="h-3 w-3 rounded-full bg-red-500" />
                <div className="h-3 w-3 rounded-full bg-yellow-500" />
                <div className="h-3 w-3 rounded-full bg-green-500" />
                <span className="ml-4 text-xs text-muted-foreground">AML Comply Dashboard</span>
              </div>
              <div className="bg-gradient-to-br from-slate-50 to-slate-100 p-8 dark:from-slate-900 dark:to-slate-800">
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="rounded-lg border border-border bg-card p-4 shadow-sm">
                    <div className="text-sm text-muted-foreground">Total Clients</div>
                    <div className="mt-1 text-2xl font-bold">1,234</div>
                    <div className="mt-2 text-xs text-green-600">+12% this month</div>
                  </div>
                  <div className="rounded-lg border border-border bg-card p-4 shadow-sm">
                    <div className="text-sm text-muted-foreground">Pending Verifications</div>
                    <div className="mt-1 text-2xl font-bold text-amber-600">23</div>
                    <div className="mt-2 text-xs text-muted-foreground">Requires attention</div>
                  </div>
                  <div className="rounded-lg border border-border bg-card p-4 shadow-sm">
                    <div className="text-sm text-muted-foreground">Compliance Rate</div>
                    <div className="mt-1 text-2xl font-bold text-green-600">98.5%</div>
                    <div className="mt-2 text-xs text-muted-foreground">Last 30 days</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Feature Tabs */}
          <div className="mx-auto mt-12 flex max-w-3xl flex-wrap justify-center gap-4">
            <Link
              href="#onboarding"
              className="group flex flex-col items-center rounded-xl border border-border bg-card p-6 text-center transition-all hover:border-[#10B981] hover:shadow-lg"
            >
              <Users className="mb-3 h-8 w-8 text-[#10B981]" />
              <span className="font-semibold">Onboarding</span>
              <span className="mt-1 text-sm text-muted-foreground">
                Onboard new clients with ease,<br />including complex entities.
              </span>
            </Link>
            <Link
              href="#verification"
              className="group flex flex-col items-center rounded-xl border border-border bg-card p-6 text-center transition-all hover:border-[#10B981] hover:shadow-lg"
            >
              <FileCheck className="mb-3 h-8 w-8 text-[#10B981]" />
              <span className="font-semibold">ID Verification</span>
              <span className="mt-1 text-sm text-muted-foreground">
                100-point ID checks with<br />AI document extraction.
              </span>
            </Link>
            <Link
              href="#compliance"
              className="group flex flex-col items-center rounded-xl border border-border bg-card p-6 text-center transition-all hover:border-[#10B981] hover:shadow-lg"
            >
              <Shield className="mb-3 h-8 w-8 text-[#10B981]" />
              <span className="font-semibold">Compliance</span>
              <span className="mt-1 text-sm text-muted-foreground">
                Complete audit trail and<br />7-year document retention.
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* Urgency / Regulation Hook Section */}
      <section className="border-b border-border bg-gradient-to-b from-red-50 to-background py-16 dark:from-red-950/20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
            <h2 className="text-3xl font-bold md:text-4xl">
              New AML Requirements Are Coming.{' '}
              <span className="text-red-600">Is Your Business Ready?</span>
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
              For many firms, compliance means:
            </p>
          </div>
          
          <div className="mx-auto mt-10 grid max-w-4xl gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[
              { icon: FileSearch, text: 'Chasing clients for documents' },
              { icon: FileSpreadsheet, text: 'Manual spreadsheets' },
              { icon: Mail, text: 'Lost email attachments' },
              { icon: Clock, text: 'No central audit history' },
              { icon: BarChart3, text: 'Hours preparing reports' },
              { icon: AlertTriangle, text: 'Risk of non-compliance fines' },
            ].map((pain, i) => (
              <div key={i} className="flex items-center gap-3 rounded-lg border border-red-200 bg-white p-4 dark:border-red-800 dark:bg-red-950/20">
                <XCircle className="h-5 w-5 shrink-0 text-red-500" />
                <span className="text-sm font-medium">{pain.text}</span>
              </div>
            ))}
          </div>

          <div className="mt-10 text-center">
            <div className="mx-auto max-w-2xl rounded-xl border border-[#10B981]/30 bg-[#10B981]/5 p-6">
              <p className="text-lg font-semibold text-[#10B981]">
                We turn AML compliance into a simple automated workflow.
              </p>
              <p className="mt-2 text-muted-foreground">
                Stop wasting time on manual processes. Let AML Comply handle the heavy lifting.
              </p>
              <Button asChild className="mt-4 bg-[#10B981] hover:bg-[#059669]">
                <Link href="/auth/sign-up">
                  Start Free Trial
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3 — The Workflow (Visual) */}
      <section className="border-b border-border py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center">
            <h2 className="text-3xl font-bold md:text-4xl">
              From New Client → <span className="text-[#10B981]">AML Ready</span> in Minutes
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
              Our streamlined workflow takes clients from onboarding to compliance in 5 simple steps
            </p>
          </div>

          <div className="mt-16">
            <div className="flex flex-col items-center gap-4 md:flex-row md:justify-between">
              {[
                { step: 1, icon: Users, title: 'Create Client', desc: 'Individual | Company | Trust' },
                { step: 2, icon: Send, title: 'Send Secure Link', desc: 'Client completes details' },
                { step: 3, icon: UserCheck, title: 'Verify Identity', desc: 'Digital verification completed' },
                { step: 4, icon: Brain, title: 'AI Risk Review', desc: 'Risk profile generated' },
                { step: 5, icon: ShieldCheck, title: 'Audit Ready', desc: 'Reports & registers maintained' },
              ].map((item, i, arr) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="flex flex-col items-center text-center">
                    <div className="relative">
                      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#10B981] text-white shadow-lg">
                        <item.icon className="h-7 w-7" />
                      </div>
                      <div className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-foreground text-xs font-bold text-background">
                        {item.step}
                      </div>
                    </div>
                    <h3 className="mt-4 font-semibold">{item.title}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">{item.desc}</p>
                  </div>
                  {i < arr.length - 1 && (
                    <ArrowRight className="hidden h-6 w-6 shrink-0 text-muted-foreground md:block" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4 — Core Product Modules */}
      <section className="bg-muted/30 py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center">
            <h2 className="text-3xl font-bold md:text-4xl">
              One Platform. <span className="text-[#10B981]">Everything Connected.</span>
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
              Four powerful modules working together to simplify your AML compliance
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {/* Client Onboarding Hub */}
            <div className="rounded-2xl border border-border bg-card p-6 transition-all hover:border-[#10B981] hover:shadow-lg">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[#10B981]/10">
                <Users className="h-6 w-6 text-[#10B981]" />
              </div>
              <h3 className="text-lg font-semibold">Client Onboarding Hub</h3>
              <p className="mt-2 text-sm text-muted-foreground">Your digital front door.</p>
              <ul className="mt-4 space-y-2">
                {['Client profiles', 'Entity management', 'Secure invitations', 'Automated reminders', 'Document collection'].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Identity Verification */}
            <div className="rounded-2xl border border-border bg-card p-6 transition-all hover:border-[#10B981] hover:shadow-lg">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[#10B981]/10">
                <Fingerprint className="h-6 w-6 text-[#10B981]" />
              </div>
              <h3 className="text-lg font-semibold">Identity Verification</h3>
              <p className="mt-2 text-sm text-muted-foreground">Stop manually checking IDs.</p>
              <ul className="mt-4 space-y-2">
                {['Digital ID checks', 'Verification history', 'Evidence stored', 'Audit trail'].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* AML Compliance Centre */}
            <div className="rounded-2xl border border-border bg-card p-6 transition-all hover:border-[#10B981] hover:shadow-lg">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[#10B981]/10">
                <ClipboardList className="h-6 w-6 text-[#10B981]" />
              </div>
              <h3 className="text-lg font-semibold">AML Compliance Centre</h3>
              <p className="mt-2 text-sm text-muted-foreground">Your compliance workspace.</p>
              <ul className="mt-4 space-y-2">
                {['Customer Risk Register', 'Beneficial Ownership', 'PEP Screening', 'Sanctions Records', 'Training Register'].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* AI Compliance Assistant */}
            <div className="rounded-2xl border border-border bg-card p-6 transition-all hover:border-[#10B981] hover:shadow-lg">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[#10B981]/10">
                <Bot className="h-6 w-6 text-[#10B981]" />
              </div>
              <h3 className="text-lg font-semibold">AI Compliance Assistant</h3>
              <p className="mt-2 text-sm text-muted-foreground">Your virtual AML support.</p>
              <ul className="mt-4 space-y-2">
                {['Review client risk', 'Find missing info', 'Prepare summaries', 'Suggest next steps', 'Reduce admin time'].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 5 — Industry Selection */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center">
            <h2 className="text-3xl font-bold md:text-4xl">
              Built Around <span className="text-[#10B981]">Your Business</span>
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
              Purpose-built solutions for Australian professional services
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {/* Accountants */}
            <div className="rounded-2xl border border-border bg-card p-8 transition-all hover:border-[#10B981] hover:shadow-lg">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#10B981]">
                <Calculator className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-xl font-semibold">Accountants</h3>
              <p className="mt-2 text-muted-foreground">
                Manage AML compliance without slowing your practice.
              </p>
              <div className="mt-6 space-y-2 text-sm">
                <div className="rounded-lg bg-muted/50 px-3 py-2">Tax clients</div>
                <div className="rounded-lg bg-muted/50 px-3 py-2">Companies</div>
                <div className="rounded-lg bg-muted/50 px-3 py-2">Trusts</div>
                <div className="rounded-lg bg-muted/50 px-3 py-2">Business structures</div>
              </div>
            </div>

            {/* Bookkeepers */}
            <div className="rounded-2xl border border-border bg-card p-8 transition-all hover:border-[#10B981] hover:shadow-lg">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#10B981]">
                <FileSpreadsheet className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-xl font-semibold">Bookkeepers</h3>
              <p className="mt-2 text-muted-foreground">
                Simple compliance for growing client lists.
              </p>
              <div className="mt-6 space-y-2 text-sm">
                <div className="rounded-lg bg-muted/50 px-3 py-2">Client onboarding</div>
                <div className="rounded-lg bg-muted/50 px-3 py-2">Record keeping</div>
                <div className="rounded-lg bg-muted/50 px-3 py-2">Reviews</div>
              </div>
            </div>

            {/* Real Estate */}
            <div className="rounded-2xl border border-border bg-card p-8 transition-all hover:border-[#10B981] hover:shadow-lg">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#10B981]">
                <Home className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-xl font-semibold">Real Estate</h3>
              <p className="mt-2 text-muted-foreground">
                AML workflows for property professionals.
              </p>
              <div className="mt-6 space-y-2 text-sm">
                <div className="rounded-lg bg-muted/50 px-3 py-2">Vendor onboarding</div>
                <div className="rounded-lg bg-muted/50 px-3 py-2">Buyer checks</div>
                <div className="rounded-lg bg-muted/50 px-3 py-2">Transaction records</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 6 — The AI Differentiator */}
      <section className="bg-gradient-to-b from-[#071A2D] to-[#0F2942] py-20 text-white">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center">
            <h2 className="text-3xl font-bold md:text-4xl">
              Compliance Software That Works <span className="text-white/90">With You</span>
            </h2>
          </div>

          <div className="mt-16 grid gap-8 md:grid-cols-2">
            {/* Traditional */}
            <div className="rounded-2xl border border-white/20 bg-white/10 p-8 backdrop-blur">
              <h3 className="mb-6 text-lg font-semibold text-white/80">Traditional AML tools:</h3>
              <div className="flex items-center justify-center gap-4">
                <div className="rounded-lg bg-white/10 px-4 py-3 text-center">
                  <span className="text-sm">You fill forms</span>
                </div>
                <ArrowRight className="h-5 w-5 text-white/50" />
                <div className="rounded-lg bg-white/10 px-4 py-3 text-center">
                  <span className="text-sm">You track</span>
                </div>
                <ArrowRight className="h-5 w-5 text-white/50" />
                <div className="rounded-lg bg-white/10 px-4 py-3 text-center">
                  <span className="text-sm">You remember</span>
                </div>
              </div>
              <p className="mt-6 text-center text-sm text-white/60">
                Manual, time-consuming, error-prone
              </p>
            </div>

            {/* Our Platform */}
            <div className="rounded-2xl border border-white/30 bg-white p-8 text-foreground">
              <h3 className="mb-6 text-lg font-semibold text-[#10B981]">Our platform:</h3>
              <div className="flex items-center justify-center gap-4">
                <div className="rounded-lg bg-[#10B981]/10 px-4 py-3 text-center">
                  <span className="text-sm font-medium">Client submits</span>
                </div>
                <ArrowRight className="h-5 w-5 text-[#10B981]" />
                <div className="rounded-lg bg-[#10B981]/10 px-4 py-3 text-center">
                  <span className="text-sm font-medium">AI reviews</span>
                </div>
                <ArrowRight className="h-5 w-5 text-[#10B981]" />
                <div className="rounded-lg bg-[#10B981]/10 px-4 py-3 text-center">
                  <span className="text-sm font-medium">System alerts</span>
                </div>
                <ArrowRight className="h-5 w-5 text-[#10B981]" />
                <div className="rounded-lg bg-green-100 px-4 py-3 text-center">
                  <span className="text-sm font-medium text-green-700">Reports ready</span>
                </div>
              </div>
              <p className="mt-6 text-center text-sm text-muted-foreground">
                Automated, accurate, always compliant
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 7 — Trust Section */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center">
            <h2 className="text-3xl font-bold md:text-4xl">
              Built for <span className="text-[#10B981]">Australian Compliance</span> Requirements
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
              Designed from the ground up to meet AUSTRAC&apos;s AML/CTF requirements
            </p>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
            {[
              { icon: Lock, title: 'Secure Storage', desc: 'Bank-level encryption' },
              { icon: Database, title: 'Audit Trail', desc: 'Every action logged' },
              { icon: UsersRound, title: 'Team Access', desc: 'Role-based permissions' },
              { icon: LineChart, title: 'Compliance Dashboard', desc: 'Real-time insights' },
              { icon: Bot, title: 'AI Powered Reviews', desc: 'Smart risk detection' },
            ].map((item) => (
              <div key={item.title} className="flex flex-col items-center rounded-2xl border border-border bg-card p-6 text-center transition-all hover:border-[#10B981] hover:shadow-md">
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-[#10B981]/10">
                  <item.icon className="h-7 w-7 text-[#10B981]" />
                </div>
                <h3 className="font-semibold">{item.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Onboarding Section */}
      <section id="onboarding" className="bg-gradient-to-b from-[#071A2D] to-[#0F2942] py-16 text-white">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div className="order-2 lg:order-1">
              <div className="overflow-hidden rounded-2xl border border-white/20 bg-white/10 p-2 backdrop-blur">
                <div className="rounded-xl bg-white p-6 text-foreground">
                  <div className="mb-4 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#10B981]/10">
                      <Users className="h-5 w-5 text-[#10B981]" />
                    </div>
                    <div>
                      <div className="font-semibold">New Client Onboarding</div>
                      <div className="text-sm text-muted-foreground">Step 2 of 4</div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 rounded-lg border border-green-200 bg-green-50 p-3">
                      <CheckCircle2 className="h-5 w-5 text-green-600" />
                      <span className="text-sm">Personal Details</span>
                    </div>
                    <div className="flex items-center gap-3 rounded-lg border border-[#0066FF] bg-[#10B981]/5 p-3">
                      <div className="h-5 w-5 rounded-full border-2 border-[#0066FF]" />
                      <span className="text-sm font-medium">ID Verification</span>
                    </div>
                    <div className="flex items-center gap-3 rounded-lg border border-border p-3">
                      <div className="h-5 w-5 rounded-full border-2 border-muted" />
                      <span className="text-sm text-muted-foreground">Risk Assessment</span>
                    </div>
                    <div className="flex items-center gap-3 rounded-lg border border-border p-3">
                      <div className="h-5 w-5 rounded-full border-2 border-muted" />
                      <span className="text-sm text-muted-foreground">Complete</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <p className="text-lg font-medium text-white/80">
                Onboard new clients with ease. Let them set up their legal entities, 
                digitally verify their ID and provide relevant documents via their client portal.
              </p>
              <div className="mt-8 grid grid-cols-3 gap-4 sm:grid-cols-6">
                {[
                  { icon: Users, label: 'Add Person' },
                  { icon: Building2, label: 'Add Entity' },
                  { icon: FileCheck, label: 'Choose Doc set' },
                  { icon: Bell, label: 'Send Invite' },
                  { icon: Zap, label: 'Auto Reminders' },
                  { icon: CheckCircle2, label: 'Client Onboards' },
                ].map((step, i) => (
                  <div key={i} className="flex flex-col items-center gap-2 text-center">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20">
                      <step.icon className="h-5 w-5" />
                    </div>
                    <span className="text-xs">{step.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Integrations */}
      <section className="border-b border-border py-16">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold md:text-3xl">
              Integrates with platforms you already use
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
              Synchronise your contacts, automate document collection, and streamline payments. 
              AML Comply works seamlessly with your existing tech stack.
            </p>
          </div>
          
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {/* Accounting */}
            <div className="rounded-xl border border-border bg-card p-6">
              <div className="mb-4 flex items-center gap-2">
                <Calculator className="h-5 w-5 text-[#10B981]" />
                <span className="text-sm font-semibold text-muted-foreground">ACCOUNTING</span>
              </div>
              <div className="space-y-3">
                {['Xero', 'QuickBooks', 'MYOB', 'Sage'].map((name) => (
                  <div key={name} className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded bg-muted text-xs font-bold">
                      {name[0]}
                    </div>
                    <span className="text-sm font-medium">{name}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Payments & Identity */}
            <div className="rounded-xl border border-border bg-card p-6">
              <div className="mb-4 flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-[#10B981]" />
                <span className="text-sm font-semibold text-muted-foreground">PAYMENTS & IDENTITY</span>
              </div>
              <div className="space-y-3">
                {['Stripe', 'Stripe Identity'].map((name) => (
                  <div key={name} className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded bg-[#635BFF] text-xs font-bold text-white">
                      S
                    </div>
                    <span className="text-sm font-medium">{name}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* AI & Automation */}
            <div className="rounded-xl border border-border bg-card p-6">
              <div className="mb-4 flex items-center gap-2">
                <Brain className="h-5 w-5 text-[#10B981]" />
                <span className="text-sm font-semibold text-muted-foreground">AI & AUTOMATION</span>
              </div>
              <div className="space-y-3">
                {[
                  { name: 'Groq AI', color: 'bg-orange-500' },
                  { name: 'Document AI', color: 'bg-green-500' },
                ].map((item) => (
                  <div key={item.name} className="flex items-center gap-3">
                    <div className={`flex h-8 w-8 items-center justify-center rounded ${item.color} text-xs font-bold text-white`}>
                      {item.name[0]}
                    </div>
                    <span className="text-sm font-medium">{item.name}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Communication */}
            <div className="rounded-xl border border-border bg-card p-6">
              <div className="mb-4 flex items-center gap-2">
                <Mail className="h-5 w-5 text-[#10B981]" />
                <span className="text-sm font-semibold text-muted-foreground">COMMUNICATION</span>
              </div>
              <div className="space-y-3">
                {[
                  { name: 'Gmail', color: 'bg-red-500' },
                  { name: 'Outlook', color: 'bg-blue-600' },
                  { name: 'SendGrid', color: 'bg-blue-400' },
                ].map((item) => (
                  <div key={item.name} className="flex items-center gap-3">
                    <div className={`flex h-8 w-8 items-center justify-center rounded ${item.color} text-xs font-bold text-white`}>
                      {item.name[0]}
                    </div>
                    <span className="text-sm font-medium">{item.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-8 text-center">
            <p className="text-sm text-muted-foreground">
              More integrations coming soon. <Link href="#contact" className="text-[#10B981] hover:underline">Request an integration</Link>
            </p>
          </div>
        </div>
      </section>

      {/* Verification Section */}
      <section id="verification" className="py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <h2 className="text-3xl font-bold">A powerful verification system built in</h2>
              <p className="mt-4 text-muted-foreground">
                AML Comply&apos;s powerful verification system is designed to streamline your 
                compliance management. We support complex relationship structures such as 
                interlinking entities (company as trustee), client groups, and people being 
                part of multiple entities with a single user profile.
              </p>
              <ul className="mt-6 space-y-3">
                {[
                  '100-point ID verification system',
                  'AI-powered document extraction',
                  'Stripe Identity biometric verification',
                  'Automatic risk scoring',
                  'Real-time PEP & sanctions screening',
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 text-[#10B981]" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <Button asChild className="mt-8 bg-[#10B981] hover:bg-[#059669]">
                <Link href="/auth/sign-up">
                  READ MORE
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
            <div className="rounded-2xl border border-border bg-card p-6 shadow-lg">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="font-semibold">Client Verification</h3>
                <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
                  110 Points
                </span>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between rounded-lg border border-border p-3">
                  <div className="flex items-center gap-3">
                    <FileCheck className="h-5 w-5 text-green-600" />
                    <span className="text-sm">Australian Passport</span>
                  </div>
                  <span className="text-sm font-medium text-green-600">70 pts</span>
                </div>
                <div className="flex items-center justify-between rounded-lg border border-border p-3">
                  <div className="flex items-center gap-3">
                    <FileCheck className="h-5 w-5 text-green-600" />
                    <span className="text-sm">Driver License</span>
                  </div>
                  <span className="text-sm font-medium text-green-600">40 pts</span>
                </div>
                <div className="flex items-center justify-between rounded-lg border border-[#0066FF] bg-[#10B981]/5 p-3">
                  <div className="flex items-center gap-3">
                    <Fingerprint className="h-5 w-5 text-[#10B981]" />
                    <span className="text-sm font-medium">Biometric Verification</span>
                  </div>
                  <span className="rounded bg-[#10B981] px-2 py-0.5 text-xs text-white">Ready</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Compliance Section */}
      <section id="compliance" className="bg-muted/50 py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div className="order-2 lg:order-1">
              <div className="rounded-2xl border border-border bg-card p-6 shadow-lg">
                <h3 className="mb-4 font-semibold">Audit Trail</h3>
                <div className="space-y-3">
                  {[
                    { action: 'Client verified', user: 'John Smith', time: '2 mins ago', color: 'green' },
                    { action: 'Document uploaded', user: 'Sarah Jones', time: '15 mins ago', color: 'blue' },
                    { action: 'Risk assessment completed', user: 'System', time: '1 hour ago', color: 'amber' },
                    { action: 'New client created', user: 'John Smith', time: '2 hours ago', color: 'slate' },
                  ].map((log, i) => (
                    <div key={i} className="flex items-center gap-3 rounded-lg border border-border p-3">
                      <div className={`h-2 w-2 rounded-full bg-${log.color}-500`} />
                      <div className="flex-1">
                        <div className="text-sm font-medium">{log.action}</div>
                        <div className="text-xs text-muted-foreground">by {log.user}</div>
                      </div>
                      <span className="text-xs text-muted-foreground">{log.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <h2 className="text-3xl font-bold">Complete audit trail & compliance</h2>
              <p className="mt-4 text-muted-foreground">
                Harness the power of automation. Once you set up your core compliance 
                workflows, AML Comply handles the heavy lifting. Document expiry reminders, 
                risk reassessments, and compliance reports are generated automatically.
              </p>
              <ul className="mt-6 space-y-3">
                {[
                  'Immutable audit logs for every action',
                  '7-year document retention (AML/CTF compliant)',
                  'Automatic compliance report generation',
                  'Document expiry tracking & reminders',
                  'Risk-based reassessment scheduling',
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 text-[#10B981]" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <Button asChild className="mt-8 bg-[#10B981] hover:bg-[#059669]">
                <Link href="/auth/sign-up">
                  READ MORE
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Section */}
      <section className="bg-[#1a1a2e] py-20 text-white">
        <div className="mx-auto max-w-7xl px-6 text-center">
          <h2 className="text-3xl font-bold">Why choose AML Comply?</h2>
          <p className="mx-auto mt-4 max-w-3xl text-white/70">
            AML Comply is a purpose-built solution for Australian professional services firms. 
            We understand the unique compliance requirements of accountants, lawyers, conveyancers, 
            and real estate agents. Our platform has been designed from the ground up to meet 
            AUSTRAC&apos;s AML/CTF requirements.
          </p>
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {[
              { icon: Shield, title: 'AUSTRAC Compliant', desc: 'Built to meet Australian AML/CTF Act requirements' },
              { icon: Lock, title: 'Bank-Level Security', desc: 'Enterprise-grade encryption and data protection' },
              { icon: BarChart3, title: 'Real-Time Insights', desc: 'Dashboard analytics and compliance reporting' },
            ].map((feature) => (
              <div key={feature.title} className="rounded-xl border border-white/10 bg-white/5 p-6">
                <feature.icon className="mx-auto mb-4 h-10 w-10 text-[#10B981]" />
                <h3 className="font-semibold">{feature.title}</h3>
                <p className="mt-2 text-sm text-white/60">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="border-b border-border py-16">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-12 lg:grid-cols-2">
            <div>
              <h2 className="text-2xl font-bold">Join for free.</h2>
              <p className="mt-4 text-muted-foreground">
                The AML landscape is transforming at lightning speed. To help you stay ahead, 
                we&apos;ve created free, insight-packed resources that explore the emerging 
                compliance challenges and how AML Comply can support your success.
              </p>
              <p className="mt-4 font-medium">
                Get instant access by joining our mailing list today.
              </p>
              <form className="mt-6 space-y-4">
                <div>
                  <label className="text-sm font-medium">Name</label>
                  <Input placeholder="Your name" className="mt-1" />
                </div>
                <div>
                  <label className="text-sm font-medium">Your email</label>
                  <Input type="email" placeholder="email@example.com" className="mt-1" />
                </div>
                <Button className="bg-[#10B981] hover:bg-[#059669]">
                  Get PDFs
                </Button>
              </form>
            </div>
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="rounded-xl border border-border bg-card p-6">
                <h3 className="font-semibold">Upcoming Webinars</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Join one of our upcoming webinars for a live, hands-on tour of 
                  AML Comply - plus a chance to get all your questions answered in real time.
                </p>
                <Button variant="outline" className="mt-4" asChild>
                  <Link href="#webinars">
                    UPCOMING WEBINARS
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
              <div className="rounded-xl border border-border bg-card p-6">
                <h3 className="font-semibold">One on One Meeting</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Want tailored advice specific to you and a chance to share your 
                  thoughts? Book a 30-minute one-on-one session with us.
                </p>
                <Button variant="outline" className="mt-4" asChild>
                  <Link href="#contact">
                    BOOK TIME SLOT
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="bg-[#10B981] py-12">
        <div className="mx-auto max-w-7xl px-6 text-center">
          <h2 className="text-2xl font-bold text-white">
            AML Comply is free while in beta
          </h2>
          <p className="mt-2 text-white/80">
            It&apos;s easy to set up an account. See for yourself what it&apos;s all about, for free!
          </p>
          <Button variant="outline" size="lg" asChild className="mt-6 border-white bg-transparent text-white hover:bg-white hover:text-[#10B981]">
            <Link href="/auth/sign-up">CREATE ACCOUNT</Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card py-12">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-8 md:grid-cols-5">
            <div className="md:col-span-2">
              <Link href="/" className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#10B981] text-white">
                  <Shield className="h-4 w-4" />
                </div>
                <span className="font-bold">
                  AML<span className="text-[#10B981]">Comply</span>
                </span>
              </Link>
              <p className="mt-4 text-sm text-muted-foreground">
                Australian AML/CTF compliance made simple for professional services.
              </p>
              <div className="mt-4 flex gap-4">
                <Link href="#" className="text-muted-foreground hover:text-foreground">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/></svg>
                </Link>
                <Link href="#" className="text-muted-foreground hover:text-foreground">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
                </Link>
              </div>
            </div>
            <div>
              <h4 className="font-semibold">Product</h4>
              <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                <li><Link href="#onboarding" className="hover:text-foreground">Onboarding</Link></li>
                <li><Link href="#verification" className="hover:text-foreground">Verification</Link></li>
                <li><Link href="#compliance" className="hover:text-foreground">Compliance</Link></li>
                <li><Link href="#pricing" className="hover:text-foreground">Pricing</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold">Resources</h4>
              <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                <li><Link href="#" className="hover:text-foreground">Documentation</Link></li>
                <li><Link href="#" className="hover:text-foreground">Blog</Link></li>
                <li><Link href="#" className="hover:text-foreground">Webinars</Link></li>
                <li><Link href="#contact" className="hover:text-foreground">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold">Legal</h4>
              <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                <li><Link href="#" className="hover:text-foreground">Privacy Policy</Link></li>
                <li><Link href="#" className="hover:text-foreground">Terms of Service</Link></li>
                <li><Link href="#" className="hover:text-foreground">Security</Link></li>
                <li><Link href="#" className="hover:text-foreground">GDPR</Link></li>
              </ul>
            </div>
          </div>
          <div className="mt-12 border-t border-border pt-8 text-center text-sm text-muted-foreground">
            2026 AML Comply. All rights reserved. A division of PainTrain.
          </div>
        </div>
      </footer>
    </div>
  )
}
