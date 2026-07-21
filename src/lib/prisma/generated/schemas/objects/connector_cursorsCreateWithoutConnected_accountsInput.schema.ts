// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';


export const connector_cursorsCreateWithoutConnected_accountsInputObjectSchema: z.ZodType<Prisma.connector_cursorsCreateWithoutConnected_accountsInput, Prisma.connector_cursorsCreateWithoutConnected_accountsInput> = z.object({
  connector_id: z.string(),
  stream: z.string(),
  cursor: z.string(),
  workspace_id: z.string().optional().nullable(),
  created_by: z.string().optional().nullable(),
  updated_at: z.union([z.date(), z.string().datetime()]).optional()
}).strict();
export const connector_cursorsCreateWithoutConnected_accountsInputObjectZodSchema = z.object({
  connector_id: z.string(),
  stream: z.string(),
  cursor: z.string(),
  workspace_id: z.string().optional().nullable(),
  created_by: z.string().optional().nullable(),
  updated_at: z.union([z.date(), z.string().datetime()]).optional()
}).strict();
