// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';


export const error_reportsUncheckedCreateInputObjectSchema: z.ZodType<Prisma.error_reportsUncheckedCreateInput, Prisma.error_reportsUncheckedCreateInput> = z.object({
  id: z.string().optional(),
  clerk_user_id: z.string().optional().nullable(),
  reporter_user_id: z.string().optional().nullable(),
  reporter_email: z.string().optional().nullable(),
  message: z.string().optional().nullable(),
  error_stack: z.string().optional().nullable(),
  component_stack: z.string().optional().nullable(),
  note: z.string().optional().nullable(),
  url: z.string().optional().nullable(),
  user_agent: z.string().optional().nullable(),
  client_time: z.union([z.date(), z.string().datetime()]).optional().nullable(),
  created_at: z.union([z.date(), z.string().datetime()]).optional(),
  fingerprint: z.string().optional().nullable()
}).strict();
export const error_reportsUncheckedCreateInputObjectZodSchema = z.object({
  id: z.string().optional(),
  clerk_user_id: z.string().optional().nullable(),
  reporter_user_id: z.string().optional().nullable(),
  reporter_email: z.string().optional().nullable(),
  message: z.string().optional().nullable(),
  error_stack: z.string().optional().nullable(),
  component_stack: z.string().optional().nullable(),
  note: z.string().optional().nullable(),
  url: z.string().optional().nullable(),
  user_agent: z.string().optional().nullable(),
  client_time: z.union([z.date(), z.string().datetime()]).optional().nullable(),
  created_at: z.union([z.date(), z.string().datetime()]).optional(),
  fingerprint: z.string().optional().nullable()
}).strict();
