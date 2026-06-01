// Organization types
export type OrganizationType = 'accountant' | 'lawyer' | 'conveyancer' | 'real_estate'

export interface Organization {
  id: string
  name: string
  type: OrganizationType
  abn: string | null
  created_at: string
  settings: Record<string, unknown>
}

// Staff types
export type StaffRole = 'admin' | 'manager' | 'staff'

export interface Staff {
  id: string
  organization_id: string
  email: string
  full_name: string
  role: StaffRole
  is_active: boolean
  created_at: string
  last_login: string | null
}

// Client types
export type ClientType = 'individual' | 'company' | 'trust' | 'partnership'
export type RiskLevel = 'low' | 'medium' | 'high'
export type VerificationStatus = 'pending' | 'in_progress' | 'verified' | 'failed' | 'expired'

export interface ClientAddress {
  street?: string
  suburb?: string
  state?: string
  postcode?: string
  country?: string
}

export interface Client {
  id: string
  organization_id: string
  client_type: ClientType
  first_name: string | null
  last_name: string | null
  date_of_birth: string | null
  entity_name: string | null
  acn: string | null
  abn: string | null
  email: string | null
  phone: string | null
  address: ClientAddress
  risk_level: RiskLevel
  risk_factors: string[]
  verification_status: VerificationStatus
  verification_points: number
  verified_at: string | null
  verified_by: string | null
  source_of_funds: string | null
  purpose_of_engagement: string | null
  pep_status: boolean
  sanctions_checked: boolean
  created_at: string
  updated_at: string
  retention_expires_at: string
  created_by: string | null
  assigned_to: string | null
}

// ID Verification types
export type IDCategory = 'primary' | 'secondary' | 'commencement'
export type IDVerificationStatus = 'pending' | 'ai_processed' | 'verified' | 'rejected'

export interface IDVerification {
  id: string
  client_id: string
  organization_id: string
  document_type: string
  category: IDCategory
  points: number
  document_number: string | null
  issuing_authority: string | null
  issue_date: string | null
  expiry_date: string | null
  ai_extracted_data: Record<string, unknown>
  ai_confidence_score: number | null
  ai_extraction_date: string | null
  status: IDVerificationStatus
  verified_by: string | null
  verified_at: string | null
  rejection_reason: string | null
  blob_path: string | null
  created_at: string
  created_by: string | null
}

// Document types
export interface Document {
  id: string
  client_id: string
  organization_id: string
  name: string
  document_type: string
  description: string | null
  blob_path: string
  file_size: number | null
  mime_type: string | null
  ai_extracted_text: string | null
  ai_extracted_data: Record<string, unknown>
  ai_processed_at: string | null
  created_at: string
  retention_expires_at: string
  created_by: string | null
}

// Audit log types
export interface AuditLog {
  id: string
  organization_id: string
  action: string
  entity_type: string
  entity_id: string | null
  details: Record<string, unknown>
  old_values: Record<string, unknown> | null
  new_values: Record<string, unknown> | null
  performed_by: string | null
  performed_by_email: string | null
  ip_address: string | null
  user_agent: string | null
  created_at: string
}

// Client note types
export type NoteType = 'general' | 'risk' | 'verification' | 'compliance'

export interface ClientNote {
  id: string
  client_id: string
  organization_id: string
  content: string
  note_type: NoteType
  created_at: string
  created_by: string | null
}

// 5-Point ID Verification configuration
export const ID_DOCUMENT_TYPES = {
  primary: [
    { type: 'australian_passport', name: 'Australian Passport', points: 70 },
    { type: 'australian_citizenship', name: 'Australian Citizenship Certificate', points: 70 },
    { type: 'australian_birth_certificate', name: 'Australian Birth Certificate', points: 70 },
  ],
  secondary: [
    { type: 'drivers_licence', name: 'Australian Driver\'s Licence', points: 40 },
    { type: 'photo_id_card', name: 'Australian Photo ID Card', points: 40 },
    { type: 'foreign_passport', name: 'Foreign Passport', points: 40 },
    { type: 'immicard', name: 'ImmiCard', points: 40 },
  ],
  commencement: [
    { type: 'medicare_card', name: 'Medicare Card', points: 25 },
    { type: 'centrelink_card', name: 'Centrelink Card', points: 25 },
    { type: 'utility_bill', name: 'Utility Bill (less than 3 months)', points: 25 },
    { type: 'bank_statement', name: 'Bank Statement (less than 3 months)', points: 25 },
    { type: 'rates_notice', name: 'Rates Notice', points: 35 },
    { type: 'ato_notice', name: 'ATO Notice of Assessment', points: 35 },
  ],
} as const

export const REQUIRED_POINTS = 100

// Risk factor definitions
export const RISK_FACTORS = {
  pep: { label: 'Politically Exposed Person', weight: 'high' },
  high_risk_country: { label: 'High-risk Country Connection', weight: 'high' },
  complex_structure: { label: 'Complex Ownership Structure', weight: 'medium' },
  cash_intensive: { label: 'Cash-intensive Business', weight: 'medium' },
  unusual_activity: { label: 'Unusual Transaction Patterns', weight: 'high' },
  third_party: { label: 'Third-party Involvement', weight: 'medium' },
  new_client: { label: 'New Client Relationship', weight: 'low' },
} as const
