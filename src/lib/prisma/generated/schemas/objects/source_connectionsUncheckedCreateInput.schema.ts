// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { source_connection_secretsUncheckedCreateNestedOneWithoutSource_connectionsInputObjectSchema } from './source_connection_secretsUncheckedCreateNestedOneWithoutSource_connectionsInput.schema'

export const source_connectionsUncheckedCreateInputObjectSchema: z.ZodType<Prisma.source_connectionsUncheckedCreateInput, Prisma.source_connectionsUncheckedCreateInput> = z.object({
  id: z.string().optional(),
  created_by: z.string().optional(),
  name: z.string(),
  warehouse_type: z.string().optional(),
  host: z.string(),
  port: z.number().int().optional(),
  database: z.string(),
  username: z.string(),
  ssl: z.boolean().optional(),
  created_at: z.union([z.date(), z.string().datetime()]).optional(),
  updated_at: z.union([z.date(), z.string().datetime()]).optional(),
  workspace_id: z.string().optional().nullable(),
  source_connection_secrets: z.lazy(() => source_connection_secretsUncheckedCreateNestedOneWithoutSource_connectionsInputObjectSchema).optional()
}).strict();
export const source_connectionsUncheckedCreateInputObjectZodSchema = z.object({
  id: z.string().optional(),
  created_by: z.string().optional(),
  name: z.string(),
  warehouse_type: z.string().optional(),
  host: z.string(),
  port: z.number().int().optional(),
  database: z.string(),
  username: z.string(),
  ssl: z.boolean().optional(),
  created_at: z.union([z.date(), z.string().datetime()]).optional(),
  updated_at: z.union([z.date(), z.string().datetime()]).optional(),
  workspace_id: z.string().optional().nullable(),
  source_connection_secrets: z.lazy(() => source_connection_secretsUncheckedCreateNestedOneWithoutSource_connectionsInputObjectSchema).optional()
}).strict();
