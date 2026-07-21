// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';


export const error_reportsSelectObjectSchema: z.ZodType<Prisma.error_reportsSelect, Prisma.error_reportsSelect> = z.object({
  id: z.boolean().optional(),
  clerk_user_id: z.boolean().optional(),
  reporter_user_id: z.boolean().optional(),
  reporter_email: z.boolean().optional(),
  message: z.boolean().optional(),
  error_stack: z.boolean().optional(),
  component_stack: z.boolean().optional(),
  note: z.boolean().optional(),
  url: z.boolean().optional(),
  user_agent: z.boolean().optional(),
  client_time: z.boolean().optional(),
  created_at: z.boolean().optional(),
  fingerprint: z.boolean().optional()
}).strict();
export const error_reportsSelectObjectZodSchema = z.object({
  id: z.boolean().optional(),
  clerk_user_id: z.boolean().optional(),
  reporter_user_id: z.boolean().optional(),
  reporter_email: z.boolean().optional(),
  message: z.boolean().optional(),
  error_stack: z.boolean().optional(),
  component_stack: z.boolean().optional(),
  note: z.boolean().optional(),
  url: z.boolean().optional(),
  user_agent: z.boolean().optional(),
  client_time: z.boolean().optional(),
  created_at: z.boolean().optional(),
  fingerprint: z.boolean().optional()
}).strict();
