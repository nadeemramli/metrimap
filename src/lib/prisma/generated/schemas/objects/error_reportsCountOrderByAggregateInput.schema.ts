// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

export const error_reportsCountOrderByAggregateInputObjectSchema: z.ZodType<Prisma.error_reportsCountOrderByAggregateInput, Prisma.error_reportsCountOrderByAggregateInput> = z.object({
  id: SortOrderSchema.optional(),
  clerk_user_id: SortOrderSchema.optional(),
  reporter_user_id: SortOrderSchema.optional(),
  reporter_email: SortOrderSchema.optional(),
  message: SortOrderSchema.optional(),
  error_stack: SortOrderSchema.optional(),
  component_stack: SortOrderSchema.optional(),
  note: SortOrderSchema.optional(),
  url: SortOrderSchema.optional(),
  user_agent: SortOrderSchema.optional(),
  client_time: SortOrderSchema.optional(),
  created_at: SortOrderSchema.optional(),
  fingerprint: SortOrderSchema.optional()
}).strict();
export const error_reportsCountOrderByAggregateInputObjectZodSchema = z.object({
  id: SortOrderSchema.optional(),
  clerk_user_id: SortOrderSchema.optional(),
  reporter_user_id: SortOrderSchema.optional(),
  reporter_email: SortOrderSchema.optional(),
  message: SortOrderSchema.optional(),
  error_stack: SortOrderSchema.optional(),
  component_stack: SortOrderSchema.optional(),
  note: SortOrderSchema.optional(),
  url: SortOrderSchema.optional(),
  user_agent: SortOrderSchema.optional(),
  client_time: SortOrderSchema.optional(),
  created_at: SortOrderSchema.optional(),
  fingerprint: SortOrderSchema.optional()
}).strict();
