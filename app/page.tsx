import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Shield,
  FileCheck,
  Users,
  CheckCircle2,
  ArrowRight,
  Building2,
  Home,
  Fingerprint,
  BarChart3,
  Zap,
  Lock,
  Calculator,
  FileSpreadsheet,
  Bot,
  Play,
  ShieldCheck,
  Clock,
  AlertTriangle,
  FileText,
  Settings,
  Bell,
} from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="flex min-h-svh flex-col bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#10B981]">
              <Shield className="h-5 w-5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold leading-none">
                AML<span className="text-[#10B981]">Comply</span>
              </span>
              <span className="text-[10px] text-muted-foreground">Smart AML Compliance</span>
            </div>
          </Link>
          
          <nav className="hidden items-center gap-6 lg:flex">
            <Link href="#features" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
              Product
            </Link>
            <Link href="#industries" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
              Solutions
            </Link>
            <Link href="#pricing" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
              Pricing
            </Link>
            <Link href="#contact" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
              About Us
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <Button variant="ghost" asChild>
              <Link href="/auth/login">Log in</Link>
            </Button>
            <Button asChild className="bg-[#10B981] hover:bg-[#059669]">
              <Link href="/auth/sign-up">Get AML Ready</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-12 lg:py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            {/* Left Content */}
            <div>
              <div className="mb-6 inline-flex items-center rounded-full border border-[#10B981]/30 bg-[#10B981]/10 px-4 py-1.5 text-sm font-medium text-[#10B981]">
                AUSTRALIA&apos;S AI-POWERED AML COMPLIANCE PLATFORM
              </div>
              
              <h1 className="text-4xl font-bold tracking-tight md:text-5xl lg:text-[56px] lg:leading-[1.1]">
                AML Compliance<br />
                Without the<br />
                Admin Headache
              </h1>
              
              <p className="mt-6 text-lg text-muted-foreground">
                Onboard clients, verify identities, monitor risk and stay compliant 
                with AUSTRAC requirements – all in one smart platform.
              </p>

              {/* Trust Badges */}
              <div className="mt-8 flex flex-wrap items-center gap-6">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-5 w-5 text-[#10B981]" />
                  <span className="text-sm font-medium">AUSTRAC Compliant</span>
                </div>
                <div className="flex items-center gap-2">
                  <Lock className="h-5 w-5 text-[#10B981]" />
                  <span className="text-sm font-medium">Bank-Grade Security</span>
                </div>
                <div className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-[#10B981]" />
                  <span className="text-sm font-medium">AI-Powered Automation</span>
                </div>
              </div>

              {/* CTAs */}
              <div className="mt-8 flex flex-wrap gap-4">
                <Button asChild size="lg" className="bg-[#10B981] hover:bg-[#059669]">
                  <Link href="/auth/sign-up">
                    Get AML Ready
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button variant="outline" size="lg" asChild>
                  <Link href="#demo">
                    <Play className="mr-2 h-4 w-4" />
                    Watch Demo
                  </Link>
                </Button>
              </div>

              {/* Integration Logos */}
              <div className="mt-10">
                <p className="mb-4 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Trusted by professionals across Australia
                </p>
                <div className="flex flex-wrap items-center gap-6">
                  {/* MYOB Logo */}
                  <svg className="h-6 text-muted-foreground" viewBox="0 0 80 24" fill="currentColor">
                    <text x="0" y="18" className="text-lg font-bold">myob</text>
                  </svg>
                  {/* Xero Logo */}
                  <svg className="h-6 text-[#13B5EA]" viewBox="0 0 60 24" fill="currentColor">
                    <text x="0" y="18" className="text-lg font-bold">xero</text>
                  </svg>
                  {/* QuickBooks Logo */}
                  <svg className="h-6 text-[#2CA01C]" viewBox="0 0 120 24" fill="currentColor">
                    <text x="0" y="18" className="text-sm font-bold">quickbooks</text>
                  </svg>
                  {/* Stripe Logo */}
                  <svg className="h-6 text-[#635BFF]" viewBox="0 0 60 24" fill="currentColor">
                    <text x="0" y="18" className="text-lg font-bold">stripe</text>
                  </svg>
                </div>
              </div>
            </div>

            {/* Right - Dashboard Preview */}
            <div className="relative">
              <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-2xl">
                {/* Dashboard Header */}
                <div className="flex items-center justify-between border-b border-border bg-[#071A2D] px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#10B981]">
                      <Shield className="h-4 w-4 text-white" />
                    </div>
                    <span className="font-semibold text-white">AMLComply</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Bell className="h-4 w-4 text-white/60" />
                    <div className="h-8 w-8 rounded-full bg-[#10B981]" />
                  </div>
                </div>
                
                <div className="flex">
                  {/* Sidebar */}
                  <div className="hidden w-48 border-r border-border bg-[#071A2D] p-3 sm:block">
                    <nav className="space-y-1">
                      {[
                        { icon: BarChart3, label: 'Dashboard', active: true },
                        { icon: Users, label: 'Clients' },
                        { icon: Building2, label: 'Entities' },
                        { icon: FileCheck, label: 'Verifications' },
                        { icon: AlertTriangle, label: 'Risk & Monitoring' },
                        { icon: FileText, label: 'Documents' },
                        { icon: FileSpreadsheet, label: 'Reports' },
                        { icon: Settings, label: 'Settings' },
                      ].map((item) => (
                        <div
                          key={item.label}
                          className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm ${
                            item.active 
                              ? 'bg-[#10B981] text-white' 
                              : 'text-white/60 hover:bg-white/5'
                          }`}
                        >
                          <item.icon className="h-4 w-4" />
                          <span>{item.label}</span>
                        </div>
                      ))}
                    </nav>
                  </div>

                  {/* Main Content */}
                  <div className="flex-1 bg-muted/30 p-4">
                    <div className="mb-4">
                      <h2 className="text-lg font-semibold">Dashboard</h2>
                      <p className="text-sm text-muted-foreground">Welcome back, Sarah</p>
                    </div>

                    {/* Stats Cards */}
                    <div className="mb-4 grid grid-cols-2 gap-3 lg:grid-cols-4">
                      <div className="rounded-lg border border-border bg-card p-3">
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-muted-foreground">Total Clients</span>
                          <Users className="h-4 w-4 text-[#10B981]" />
                        </div>
                        <p className="mt-1 text-2xl font-bold">128</p>
                        <p className="text-xs text-[#10B981]">+12 this month</p>
                      </div>
                      <div className="rounded-lg border border-border bg-card p-3">
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-muted-foreground">Pending</span>
                          <Clock className="h-4 w-4 text-amber-500" />
                        </div>
                        <p className="mt-1 text-2xl font-bold">24</p>
                        <p className="text-xs text-amber-500">Requires attention</p>
                      </div>
                      <div className="rounded-lg border border-border bg-card p-3">
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-muted-foreground">High Risk</span>
                          <AlertTriangle className="h-4 w-4 text-red-500" />
                        </div>
                        <p className="mt-1 text-2xl font-bold">5</p>
                        <p className="text-xs text-muted-foreground">Needs review</p>
                      </div>
                      <div className="rounded-lg border border-border bg-card p-3">
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-muted-foreground">Completed</span>
                          <CheckCircle2 className="h-4 w-4 text-[#10B981]" />
                        </div>
                        <p className="mt-1 text-2xl font-bold">42</p>
                        <p className="text-xs text-[#10B981]">+28% vs last month</p>
                      </div>
                    </div>

                    {/* Compliance Overview & Activity */}
                    <div className="grid gap-3 lg:grid-cols-2">
                      {/* Donut Chart */}
                      <div className="rounded-lg border border-border bg-card p-4">
                        <h3 className="mb-3 text-sm font-medium">Compliance Overview</h3>
                        <div className="flex items-center gap-4">
                          <div className="relative h-24 w-24">
                            <svg className="h-24 w-24 -rotate-90" viewBox="0 0 36 36">
                              <circle cx="18" cy="18" r="16" fill="none" stroke="#e5e7eb" strokeWidth="3" />
                              <circle cx="18" cy="18" r="16" fill="none" stroke="#10B981" strokeWidth="3" strokeDasharray="94 100" />
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                              <span className="text-xl font-bold">94%</span>
                              <span className="text-[10px] text-muted-foreground">Compliant</span>
                            </div>
                          </div>
                          <div className="space-y-2 text-xs">
                            <div className="flex items-center gap-2">
                              <div className="h-2 w-2 rounded-full bg-[#10B981]" />
                              <span>Compliant</span>
                              <span className="font-medium">94%</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="h-2 w-2 rounded-full bg-amber-500" />
                              <span>Pending</span>
                              <span className="font-medium">4%</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="h-2 w-2 rounded-full bg-red-500" />
                              <span>High Risk</span>
                              <span className="font-medium">2%</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Recent Activity */}
                      <div className="rounded-lg border border-border bg-card p-4">
                        <div className="mb-3 flex items-center justify-between">
                          <h3 className="text-sm font-medium">Recent Activity</h3>
                          <span className="text-xs text-[#10B981]">View all</span>
                        </div>
                        <div className="space-y-3">
                          {[
                            { icon: CheckCircle2, text: 'Client verification completed', sub: 'John Smith Pty Ltd', time: '2m ago', color: 'text-[#10B981]' },
                            { icon: FileText, text: 'Document uploaded', sub: 'ACME Holdings', time: '15m ago', color: 'text-blue-500' },
                            { icon: AlertTriangle, text: 'Risk review required', sub: 'Bob & Co Partners', time: '1h ago', color: 'text-amber-500' },
                          ].map((item, i) => (
                            <div key={i} className="flex items-start gap-2">
                              <item.icon className={`mt-0.5 h-4 w-4 shrink-0 ${item.color}`} />
                              <div className="flex-1 text-xs">
                                <p className="font-medium">{item.text}</p>
                                <p className="text-muted-foreground">{item.sub}</p>
                              </div>
                              <span className="text-[10px] text-muted-foreground">{item.time}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Bar */}
      <section className="bg-[#071A2D] py-6">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid grid-cols-2 gap-6 md:grid-cols-5">
            {[
              { icon: Users, title: 'Client Onboarding', desc: 'Collect ID, verify identities and onboard clients seamlessly.' },
              { icon: Fingerprint, title: 'Identity Verification', desc: 'AI-powered verification with document & biometric checks.' },
              { icon: BarChart3, title: 'Risk Assessment', desc: 'Automated risk scoring and ongoing monitoring.' },
              { icon: FileSpreadsheet, title: 'AML Reporting', desc: 'Generate AUSTRAC compliant reports in minutes.' },
              { icon: Bot, title: 'AI Automation', desc: 'Save hours with AI-powered workflows and reminders.' },
            ].map((feature) => (
              <div key={feature.title} className="text-center">
                <feature.icon className="mx-auto mb-2 h-6 w-6 text-[#10B981]" />
                <h3 className="text-sm font-semibold text-[#10B981]">{feature.title}</h3>
                <p className="mt-1 text-xs text-white/60">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Built for Professionals */}
      <section id="industries" className="py-16">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-10">
            <h2 className="text-2xl font-bold">Built for Professionals</h2>
            <p className="text-muted-foreground">Solutions tailored for your industry</p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {[
              { icon: Calculator, title: 'Accountants', desc: 'Streamline client due diligence and stay audit-ready.', color: 'bg-[#10B981]' },
              { icon: FileSpreadsheet, title: 'Bookkeepers', desc: 'Automate AML checks and focus on what matters.', color: 'bg-[#10B981]' },
              { icon: Home, title: 'Real Estate', desc: 'Meet AML obligations for property transactions.', color: 'bg-[#10B981]' },
            ].map((industry) => (
              <div key={industry.title} className="rounded-xl border border-border bg-card p-6 transition-all hover:border-[#10B981] hover:shadow-lg">
                <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl ${industry.color}`}>
                  <industry.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold">{industry.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{industry.desc}</p>
                <Link href="#" className="mt-4 inline-flex items-center text-sm font-medium text-[#10B981]">
                  Learn more <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="bg-muted/30 py-16">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid items-start gap-12 lg:grid-cols-2">
            <div>
              <h2 className="text-2xl font-bold">Simple, Transparent Pricing</h2>
              <p className="mt-2 text-muted-foreground">
                No hidden fees. No per-client charges. Just simple pricing that scales with your business.
              </p>
              
              {/* Toggle */}
              <div className="mt-6 inline-flex items-center rounded-full border border-border bg-card p-1">
                <button className="rounded-full bg-[#10B981] px-4 py-1.5 text-sm font-medium text-white">
                  Monthly
                </button>
                <button className="px-4 py-1.5 text-sm font-medium text-muted-foreground">
                  Annually
                </button>
                <span className="ml-2 rounded-full bg-[#10B981]/10 px-2 py-0.5 text-xs font-medium text-[#10B981]">
                  Save 17%
                </span>
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              {/* Monthly Plan */}
              <div className="rounded-xl border border-border bg-card p-6">
                <h3 className="font-semibold">Unlimited Monthly</h3>
                <p className="text-sm text-muted-foreground">All features. Unlimited clients.</p>
                <div className="my-4">
                  <span className="text-4xl font-bold">$99</span>
                  <span className="text-muted-foreground">/month</span>
                </div>
                <ul className="mb-6 space-y-2">
                  {['Unlimited client onboarding', 'AI identity verification', 'Risk assessment & monitoring', 'AML reports & registers', 'Email & SMS reminders', 'Priority email support'].map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-[#10B981]" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Button className="w-full bg-[#10B981] hover:bg-[#059669]">
                  Start 14-Day Free Trial
                </Button>
              </div>

              {/* Annual Plan */}
              <div className="relative rounded-xl border-2 border-[#10B981] bg-card p-6">
                <div className="absolute -top-3 right-4 rounded-full bg-[#10B981] px-3 py-1 text-xs font-medium text-white">
                  BEST VALUE
                </div>
                <h3 className="font-semibold">Unlimited Annual</h3>
                <p className="text-sm text-muted-foreground">All features. Best value.</p>
                <div className="my-4">
                  <span className="text-4xl font-bold">$999</span>
                  <span className="text-muted-foreground">/year</span>
                </div>
                <ul className="mb-6 space-y-2">
                  {['Unlimited client onboarding', 'AI identity verification', 'Risk assessment & monitoring', 'AML reports & registers', 'Email & SMS reminders', 'Priority email support'].map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-[#10B981]" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Button className="w-full bg-[#10B981] hover:bg-[#059669]">
                  Start 14-Day Free Trial
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Bar */}
      <section className="border-t border-border bg-card py-6">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex flex-wrap items-center justify-center gap-8 text-sm">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-[#10B981]" />
              <span>Your data is protected with bank-grade security and 256-bit encryption.</span>
            </div>
            <div className="flex items-center gap-2 font-medium">
              <Lock className="h-4 w-4" />
              <span>ISO 27001 Certified</span>
            </div>
            <div className="flex items-center gap-2 font-medium">
              <Shield className="h-4 w-4" />
              <span>AES 256-Bit Encryption</span>
            </div>
            <div className="flex items-center gap-2 font-medium">
              <ShieldCheck className="h-4 w-4" />
              <span>AUSTRAC Compliant</span>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section id="contact" className="py-16">
        <div className="mx-auto max-w-7xl px-6">
          <div className="rounded-2xl bg-[#071A2D] p-8 text-center text-white lg:p-12">
            <h2 className="text-2xl font-bold lg:text-3xl">Ready to simplify your AML compliance?</h2>
            <p className="mx-auto mt-4 max-w-2xl text-white/70">
              Join hundreds of Australian professionals who trust AML Comply for their compliance needs.
            </p>
            <div className="mx-auto mt-8 flex max-w-md flex-col gap-3 sm:flex-row">
              <Input 
                type="email" 
                placeholder="Enter your email" 
                className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
              />
              <Button className="bg-[#10B981] hover:bg-[#059669]">
                Get Started Free
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card py-12">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-8 md:grid-cols-4">
            <div>
              <Link href="/" className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#10B981]">
                  <Shield className="h-4 w-4 text-white" />
                </div>
                <span className="font-bold">AML<span className="text-[#10B981]">Comply</span></span>
              </Link>
              <p className="mt-4 text-sm text-muted-foreground">
                Australia&apos;s leading AML compliance platform for professional services.
              </p>
            </div>
            <div>
              <h4 className="mb-4 font-semibold">Product</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="#" className="hover:text-foreground">Features</Link></li>
                <li><Link href="#" className="hover:text-foreground">Pricing</Link></li>
                <li><Link href="#" className="hover:text-foreground">Integrations</Link></li>
                <li><Link href="#" className="hover:text-foreground">Updates</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="mb-4 font-semibold">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="#" className="hover:text-foreground">About</Link></li>
                <li><Link href="#" className="hover:text-foreground">Blog</Link></li>
                <li><Link href="#" className="hover:text-foreground">Careers</Link></li>
                <li><Link href="#" className="hover:text-foreground">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="mb-4 font-semibold">Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="#" className="hover:text-foreground">Privacy Policy</Link></li>
                <li><Link href="#" className="hover:text-foreground">Terms of Service</Link></li>
                <li><Link href="#" className="hover:text-foreground">Security</Link></li>
              </ul>
            </div>
          </div>
          <div className="mt-8 border-t border-border pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; {new Date().getFullYear()} AML Comply. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
