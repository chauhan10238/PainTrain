import 'server-only'
import Stripe from 'stripe'

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is not set')
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2025-04-30.basil',
  typescript: true,
})

// Stripe Identity verification types
export type IdentityVerificationStatus = 
  | 'pending'
  | 'processing' 
  | 'verified'
  | 'requires_input'
  | 'failed'
  | 'canceled'

export interface CreateIdentitySessionParams {
  clientId: string
  clientEmail?: string
  clientName?: string
  returnUrl: string
}

// Create a Stripe Identity verification session
export async function createIdentityVerificationSession({
  clientId,
  clientEmail,
  clientName,
  returnUrl,
}: CreateIdentitySessionParams): Promise<Stripe.Identity.VerificationSession> {
  const session = await stripe.identity.verificationSessions.create({
    type: 'document',
    options: {
      document: {
        require_matching_selfie: true, // Biometric verification
        allowed_types: ['passport', 'driving_license', 'id_card'],
      },
    },
    metadata: {
      client_id: clientId,
      client_email: clientEmail || '',
      client_name: clientName || '',
    },
    return_url: returnUrl,
  })

  return session
}

// Retrieve a verification session
export async function getIdentityVerificationSession(
  sessionId: string
): Promise<Stripe.Identity.VerificationSession> {
  return stripe.identity.verificationSessions.retrieve(sessionId, {
    expand: ['verified_outputs'],
  })
}

// Cancel a verification session
export async function cancelIdentityVerificationSession(
  sessionId: string
): Promise<Stripe.Identity.VerificationSession> {
  return stripe.identity.verificationSessions.cancel(sessionId)
}

// Calculate risk score based on verification results
export function calculateRiskScore(
  verificationSession: Stripe.Identity.VerificationSession,
  documentPoints: number
): number {
  let score = 0
  
  // Base score from document verification (0-40 points)
  if (documentPoints >= 100) {
    score += 40
  } else if (documentPoints >= 70) {
    score += 30
  } else if (documentPoints >= 50) {
    score += 20
  } else {
    score += 10
  }
  
  // Stripe Identity verification (0-40 points)
  if (verificationSession.status === 'verified') {
    score += 40
    
    // Bonus for matching selfie verification
    const lastError = verificationSession.last_error
    if (!lastError) {
      score += 10 // No errors during verification
    }
  } else if (verificationSession.status === 'processing') {
    score += 20
  } else if (verificationSession.status === 'requires_input') {
    score += 10
  }
  // failed/canceled = 0 additional points
  
  // Data quality bonus (0-10 points)
  if (verificationSession.verified_outputs) {
    const outputs = verificationSession.verified_outputs as {
      first_name?: string
      last_name?: string
      dob?: { year: number; month: number; day: number }
      address?: object
    }
    
    if (outputs.first_name && outputs.last_name) score += 3
    if (outputs.dob) score += 4
    if (outputs.address) score += 3
  }
  
  // Cap at 100
  return Math.min(score, 100)
}

// Map Stripe status to our internal status
export function mapStripeStatusToInternal(
  stripeStatus: string
): IdentityVerificationStatus {
  switch (stripeStatus) {
    case 'verified':
      return 'verified'
    case 'requires_input':
      return 'requires_input'
    case 'processing':
      return 'processing'
    case 'canceled':
      return 'canceled'
    default:
      return 'pending'
  }
}
