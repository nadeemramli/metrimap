// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { connected_accountsCreateNestedOneWithoutConnector_cursorsInputObjectSchema } from './connected_accountsCreateNestedOneWithoutConnector_cursorsInput.schema'

export const connector_cursorsCreateInputObjectSchema: z.ZodType<Prisma.connector_cursorsCreateInput, Prisma.connector_cursorsCreateInput> = z.object({
  connector_id: z.string(),
  stream: z.string(),
  cursor: z.string(),
  workspace_id: z.string().optional().nullable(),
  created_by: z.string().optional().nullable(),
  updated_at: z.union([z.date(), z.string().datetime()]).optional(),
  connected_accounts: z.lazy(() => connected_accountsCreateNestedOneWithoutConnector_cursorsInputObjectSchema)
}).strict();
export const connector_cursorsCreateInputObjectZodSchema = z.object({
  connector_id: z.string(),
  stream: z.string(),
  cursor: z.string(),
  workspace_id: z.string().optional().nullable(),
  created_by: z.string().optional().nullable(),
  updated_at: z.union([z.date(), z.string().datetime()]).optional(),
  connected_accounts: z.lazy(() => connected_accountsCreateNestedOneWithoutConnector_cursorsInputObjectSchema)
}).strict();
