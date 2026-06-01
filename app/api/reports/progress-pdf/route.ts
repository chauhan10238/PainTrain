import { NextResponse } from 'next/server'
import jsPDF from 'jspdf'

export async function GET() {
  const doc = new jsPDF()
  const pageWidth = doc.internal.pageSize.getWidth()
  
  // Colors
  const primaryColor: [number, number, number] = [37, 99, 235] // Blue
  const darkColor: [number, number, number] = [31, 41, 55]
  const grayColor: [number, number, number] = [107, 114, 128]
  const greenColor: [number, number, number] = [34, 197, 94]
  
  let yPos = 20

  // Header
  doc.setFillColor(...primaryColor)
  doc.rect(0, 0, pageWidth, 40, 'F')
  
  doc.setTextColor(255, 255, 255)
  doc.setFontSize(24)
  doc.setFont('helvetica', 'bold')
  doc.text('AML Comply', 20, 25)
  
  doc.setFontSize(12)
  doc.setFont('helvetica', 'normal')
  doc.text('Development Progress Report', 20, 35)
  
  doc.setFontSize(10)
  doc.text(new Date().toLocaleDateString('en-AU', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  }), pageWidth - 60, 35)

  yPos = 55

  // Executive Summary
  doc.setTextColor(...darkColor)
  doc.setFontSize(16)
  doc.setFont('helvetica', 'bold')
  doc.text('Executive Summary', 20, yPos)
  yPos += 10
  
  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(...grayColor)
  const summary = 'AML Comply is a comprehensive Anti-Money Laundering compliance platform designed for Australian law firms and professional services. The system provides automated 100-point ID verification, biometric authentication via Stripe Identity, risk scoring, and complete audit trail functionality.'
  const summaryLines = doc.splitTextToSize(summary, pageWidth - 40)
  doc.text(summaryLines, 20, yPos)
  yPos += summaryLines.length * 5 + 10

  // Features Completed Section
  doc.setTextColor(...darkColor)
  doc.setFontSize(16)
  doc.setFont('helvetica', 'bold')
  doc.text('Features Completed', 20, yPos)
  yPos += 10

  const features = [
    { module: 'Landing Page', status: 'Complete', description: 'Marketing page with features, pricing, industry focus' },
    { module: 'Authentication', status: 'Complete', description: 'Login, Registration, Email verification, Password reset' },
    { module: 'Database Schema', status: 'Complete', description: 'Supabase with RLS policies for multi-tenant security' },
    { module: 'Dashboard Layout', status: 'Complete', description: 'Sidebar navigation, responsive design' },
    { module: 'Client Management', status: 'Complete', description: 'Add/view/edit clients (individual & entity)' },
    { module: '100-Point ID Verification', status: 'Complete', description: 'Document upload with Manual Entry + AI extraction' },
    { module: 'Verification Workflow', status: 'Complete', description: 'Track pending/in-progress/verified/failed clients' },
    { module: 'Stripe Identity', status: 'Complete', description: 'Biometric verification and document authenticity' },
    { module: 'Risk Scoring', status: 'Complete', description: 'Automated risk assessment based on verification' },
    { module: 'Document Storage', status: 'Complete', description: 'Secure document storage with Vercel Blob' },
    { module: 'Audit Trail', status: 'Complete', description: 'Immutable logging of all compliance actions' },
    { module: 'Settings Page', status: 'Complete', description: 'Organization and user settings' },
  ]

  // Table header
  doc.setFillColor(249, 250, 251)
  doc.rect(20, yPos, pageWidth - 40, 8, 'F')
  doc.setFontSize(9)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(...darkColor)
  doc.text('Module', 25, yPos + 5.5)
  doc.text('Status', 85, yPos + 5.5)
  doc.text('Description', 115, yPos + 5.5)
  yPos += 10

  // Table rows
  doc.setFont('helvetica', 'normal')
  features.forEach((feature, index) => {
    if (yPos > 270) {
      doc.addPage()
      yPos = 20
    }
    
    if (index % 2 === 0) {
      doc.setFillColor(249, 250, 251)
      doc.rect(20, yPos - 4, pageWidth - 40, 8, 'F')
    }
    
    doc.setTextColor(...darkColor)
    doc.setFontSize(9)
    doc.text(feature.module, 25, yPos)
    
    doc.setTextColor(...greenColor)
    doc.text(feature.status, 85, yPos)
    
    doc.setTextColor(...grayColor)
    const descLines = doc.splitTextToSize(feature.description, 75)
    doc.text(descLines[0], 115, yPos)
    
    yPos += 8
  })

  yPos += 10

  // Architecture Highlights Section
  if (yPos > 220) {
    doc.addPage()
    yPos = 20
  }

  doc.setTextColor(...darkColor)
  doc.setFontSize(16)
  doc.setFont('helvetica', 'bold')
  doc.text('Architecture Highlights', 20, yPos)
  yPos += 12

  const architectureItems = [
    { title: 'Frontend Framework', value: 'Next.js 16 with App Router, TypeScript, Tailwind CSS' },
    { title: 'Database', value: 'Supabase PostgreSQL with Row-Level Security (RLS)' },
    { title: 'Authentication', value: 'Supabase Auth with email confirmation' },
    { title: 'File Storage', value: 'Vercel Blob for secure document storage' },
    { title: 'AI Integration', value: 'Groq AI for document data extraction (14K free requests/day)' },
    { title: 'Biometric Verification', value: 'Stripe Identity for selfie + document authenticity' },
    { title: 'Multi-tenancy', value: 'Organization-based data isolation via RLS policies' },
    { title: 'Compliance', value: 'Australian AML/CTF compliant 100-point ID system' },
  ]

  architectureItems.forEach((item) => {
    if (yPos > 270) {
      doc.addPage()
      yPos = 20
    }
    
    doc.setFontSize(10)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(...primaryColor)
    doc.text(item.title + ':', 25, yPos)
    
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(...darkColor)
    doc.text(item.value, 75, yPos)
    
    yPos += 8
  })

  yPos += 10

  // Security Features Section
  if (yPos > 230) {
    doc.addPage()
    yPos = 20
  }

  doc.setTextColor(...darkColor)
  doc.setFontSize(16)
  doc.setFont('helvetica', 'bold')
  doc.text('Security Features', 20, yPos)
  yPos += 10

  const securityFeatures = [
    'Row-Level Security (RLS) for multi-tenant data isolation',
    'Secure password hashing with bcrypt',
    'HTTP-only session cookies',
    'Email verification required for account activation',
    'Parameterized queries to prevent SQL injection',
    'Secure document storage with signed URLs',
    'Complete audit trail for compliance',
    'Stripe Identity for biometric fraud prevention',
  ]

  securityFeatures.forEach((feature) => {
    if (yPos > 270) {
      doc.addPage()
      yPos = 20
    }
    
    doc.setFillColor(...greenColor)
    doc.circle(25, yPos - 1.5, 1.5, 'F')
    
    doc.setFontSize(10)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(...darkColor)
    doc.text(feature, 32, yPos)
    
    yPos += 7
  })

  // Footer
  const pageCount = doc.getNumberOfPages()
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i)
    doc.setFontSize(8)
    doc.setTextColor(...grayColor)
    doc.text(
      `Page ${i} of ${pageCount} | AML Comply Progress Report | Confidential`,
      pageWidth / 2,
      doc.internal.pageSize.getHeight() - 10,
      { align: 'center' }
    )
  }

  // Generate PDF buffer
  const pdfBuffer = doc.output('arraybuffer')

  return new NextResponse(pdfBuffer, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename="AML-Comply-Progress-Report.pdf"',
    },
  })
}
