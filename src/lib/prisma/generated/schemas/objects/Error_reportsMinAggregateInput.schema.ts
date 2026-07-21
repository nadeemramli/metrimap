// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';


export const Error_reportsMinAggregateInputObjectSchema: z.ZodType<Prisma.Error_reportsMinAggregateInputType, Prisma.Error_reportsMinAggregateInputType> = z.object({
  id: z.literal(true).optional(),
  clerk_user_id: z.literal(true).optional(),
  reporter_user_id: z.literal(true).optional(),
  reporter_email: z.literal(true).optional(),
  message: z.literal(true).optional(),
  error_stack: z.literal(true).optional(),
  component_stack: z.literal(true).optional(),
  note: z.literal(true).optional(),
  url: z.literal(true).optional(),
  user_agent: z.literal(true).optional(),
  client_time: z.literal(true).optional(),
  created_at: z.literal(true).optional(),
  fingerprint: z.literal(true).optional()
}).strict();
export const Error_reportsMinAggregateInputObjectZodSchema = z.object({
  id: z.literal(true).optional(),
  clerk_user_id: z.literal(true).optional(),
  reporter_user_id: z.literal(true).optional(),
  reporter_email: z.literal(true).optional(),
  message: z.literal(true).optional(),
  error_stack: z.literal(true).optional(),
  component_stack: z.literal(true).optional(),
  note: z.literal(true).optional(),
  url: z.literal(true).optional(),
  user_agent: z.literal(true).optional(),
  client_time: z.literal(true).optional(),
  created_at: z.literal(true).optional(),
  fingerprint: z.literal(true).optional()
}).strict();
