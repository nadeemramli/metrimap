// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';


export const connector_cursorsCreateManyInputObjectSchema: z.ZodType<Prisma.connector_cursorsCreateManyInput, Prisma.connector_cursorsCreateManyInput> = z.object({
  connected_account_id: z.string(),
  connector_id: z.string(),
  stream: z.string(),
  cursor: z.string(),
  workspace_id: z.string().optional().nullable(),
  created_by: z.string().optional().nullable(),
  updated_at: z.union([z.date(), z.string().datetime()]).optional()
}).strict();
export const connector_cursorsCreateManyInputObjectZodSchema = z.object({
  connected_account_id: z.string(),
  connector_id: z.string(),
  stream: z.string(),
  cursor: z.string(),
  workspace_id: z.string().optional().nullable(),
  created_by: z.string().optional().nullable(),
  updated_at: z.union([z.date(), z.string().datetime()]).optional()
}).strict();
