import { z } from 'zod'

export const createLeadSchema = z.object({
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  name: z.string().optional(),
  company: z.string().optional(),
  source: z.enum([
    'ROI_CALCULATOR',
    'MARKET_REPORT',
    'NEWSLETTER',
    'DIRECT_CONTACT',
    'HERO_FORM',
    'CONSULTATION_FORM',
  ]),
  neighborhoods: z.array(z.string()).optional(),
  projectTypes: z.array(z.enum([
    'SINGLE_FAMILY',
    'MULTI_FAMILY',
    'TOWNHOME',
    'CONDO',
    'MIXED_USE',
    'COMMERCIAL',
  ])).optional(),
  budgetMin: z.number().positive().optional(),
  budgetMax: z.number().positive().optional(),
  timeline: z.string().optional(),
  message: z.string().optional(),
  utmSource: z.string().optional(),
  utmMedium: z.string().optional(),
  utmCampaign: z.string().optional(),
  referrer: z.string().optional(),
})

export const updateLeadSchema = createLeadSchema.partial().extend({
  status: z.enum(['NEW', 'QUALIFIED', 'CONTACTED', 'CONVERTED']).optional(),
  score: z.number().int().min(0).max(100).optional(),
})

export type CreateLeadInput = z.infer<typeof createLeadSchema>
export type UpdateLeadInput = z.infer<typeof updateLeadSchema>