// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { source_connection_secretsCreateNestedOneWithoutSource_connectionsInputObjectSchema } from './source_connection_secretsCreateNestedOneWithoutSource_connectionsInput.schema'

export const source_connectionsCreateInputObjectSchema: z.ZodType<Prisma.source_connectionsCreateInput, Prisma.source_connectionsCreateInput> = z.object({
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
  source_connection_secrets: z.lazy(() => source_connection_secretsCreateNestedOneWithoutSource_connectionsInputObjectSchema).optional()
}).strict();
export const source_connectionsCreateInputObjectZodSchema = z.object({
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
  source_connection_secrets: z.lazy(() => source_connection_secretsCreateNestedOneWithoutSource_connectionsInputObjectSchema).optional()
}).strict();
