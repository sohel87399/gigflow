import { z } from 'zod';

const leadStatusEnum = z.enum(['New', 'Contacted', 'Qualified', 'Lost']);
const leadSourceEnum = z.enum(['Website', 'Instagram', 'Referral']);

/**
 * Zod validation schema for POST /api/leads (create lead)
 */
export const createLeadSchema = z.object({
  body: z.object({
    name: z
      .string({ required_error: 'Lead name is required' })
      .min(2, 'Name must be at least 2 characters')
      .max(100, 'Name cannot exceed 100 characters')
      .trim(),
    email: z
      .string({ required_error: 'Lead email is required' })
      .email('Please provide a valid email address')
      .toLowerCase()
      .trim(),
    status: leadStatusEnum.optional().default('New'),
    source: leadSourceEnum,
  }),
});

/**
 * Zod validation schema for PUT /api/leads/:id (update lead)
 */
export const updateLeadSchema = z.object({
  body: z.object({
    name: z
      .string()
      .min(2, 'Name must be at least 2 characters')
      .max(100, 'Name cannot exceed 100 characters')
      .trim()
      .optional(),
    email: z
      .string()
      .email('Please provide a valid email address')
      .toLowerCase()
      .trim()
      .optional(),
    status: leadStatusEnum.optional(),
    source: leadSourceEnum.optional(),
  }),
  params: z.object({
    id: z.string().min(1, 'Lead ID is required'),
  }),
});

/**
 * Zod validation schema for GET /api/leads (list with filters)
 */
export const listLeadsSchema = z.object({
  query: z.object({
    page: z.string().optional(),
    limit: z.string().optional(),
    status: leadStatusEnum.optional(),
    source: leadSourceEnum.optional(),
    search: z.string().optional(),
    sort: z.enum(['latest', 'oldest']).optional(),
  }),
});

export type CreateLeadInput = z.infer<typeof createLeadSchema>['body'];
export type UpdateLeadInput = z.infer<typeof updateLeadSchema>['body'];
export type ListLeadsQuery = z.infer<typeof listLeadsSchema>['query'];
