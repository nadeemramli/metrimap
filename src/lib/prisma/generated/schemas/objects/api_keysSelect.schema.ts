// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';


export const api_keysSelectObjectSchema: z.ZodType<Prisma.api_keysSelect, Prisma.api_keysSelect> = z.object({
  id: z.boolean().optional(),
  workspace_id: z.boolean().optional(),
  created_by: z.boolean().optional(),
  name: z.boolean().optional(),
  key_prefix: z.boolean().optional(),
  key_hash: z.boolean().optional(),
  created_at: z.boolean().optional(),
  last_used_at: z.boolean().optional()
}).strict();
export const api_keysSelectObjectZodSchema = z.object({
  id: z.boolean().optional(),
  workspace_id: z.boolean().optional(),
  created_by: z.boolean().optional(),
  name: z.boolean().optional(),
  key_prefix: z.boolean().optional(),
  key_hash: z.boolean().optional(),
  created_at: z.boolean().optional(),
  last_used_at: z.boolean().optional()
}).strict();
