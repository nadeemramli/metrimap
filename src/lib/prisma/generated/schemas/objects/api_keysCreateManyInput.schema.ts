// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';


export const api_keysCreateManyInputObjectSchema: z.ZodType<Prisma.api_keysCreateManyInput, Prisma.api_keysCreateManyInput> = z.object({
  id: z.string().optional(),
  workspace_id: z.string().optional().nullable(),
  created_by: z.string().optional(),
  name: z.string(),
  key_prefix: z.string(),
  key_hash: z.string(),
  created_at: z.union([z.date(), z.string().datetime()]).optional(),
  last_used_at: z.union([z.date(), z.string().datetime()]).optional().nullable()
}).strict();
export const api_keysCreateManyInputObjectZodSchema = z.object({
  id: z.string().optional(),
  workspace_id: z.string().optional().nullable(),
  created_by: z.string().optional(),
  name: z.string(),
  key_prefix: z.string(),
  key_hash: z.string(),
  created_at: z.union([z.date(), z.string().datetime()]).optional(),
  last_used_at: z.union([z.date(), z.string().datetime()]).optional().nullable()
}).strict();
