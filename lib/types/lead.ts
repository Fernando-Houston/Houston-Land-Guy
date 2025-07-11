export interface LeadInterests {
  neighborhoods: string[]
  projectTypes: string[]
  budgetRange?: BudgetRange
  timeline?: string
}

export interface BudgetRange {
  min: number
  max: number
}

export type LeadSource = 
  | 'roi_calculator'
  | 'market_report'
  | 'newsletter'
  | 'direct_contact'
  | 'consultation_form'
  | 'property_search'
  | 'tool_usage'

export type LeadStatus = 
  | 'new'
  | 'qualified'
  | 'contacted'
  | 'in_negotiation'
  | 'converted'
  | 'lost'

export type ActivityType =
  | 'page_view'
  | 'tool_used'
  | 'form_submitted'
  | 'email_opened'
  | 'email_clicked'
  | 'consultation_scheduled'
  | 'phone_call'
  | 'property_viewed'

export interface CreateLeadInput {
  email: string
  phone?: string
  name?: string
  company?: string
  source: LeadSource
  interests?: LeadInterests
}

export interface UpdateLeadInput {
  phone?: string
  name?: string
  company?: string
  status?: LeadStatus
  score?: number
  interests?: LeadInterests
}