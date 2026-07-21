// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { source_connection_secretsArgsObjectSchema } from './source_connection_secretsArgs.schema'

export const source_connectionsSelectObjectSchema: z.ZodType<Prisma.source_connectionsSelect, Prisma.source_connectionsSelect> = z.object({
  id: z.boolean().optional(),
  created_by: z.boolean().optional(),
  name: z.boolean().optional(),
  warehouse_type: z.boolean().optional(),
  host: z.boolean().optional(),
  port: z.boolean().optional(),
  database: z.boolean().optional(),
  username: z.boolean().optional(),
  ssl: z.boolean().optional(),
  created_at: z.boolean().optional(),
  updated_at: z.boolean().optional(),
  workspace_id: z.boolean().optional(),
  source_connection_secrets: z.union([z.boolean(), z.lazy(() => source_connection_secretsArgsObjectSchema)]).optional()
}).strict();
export const source_connectionsSelectObjectZodSchema = z.object({
  id: z.boolean().optional(),
  created_by: z.boolean().optional(),
  name: z.boolean().optional(),
  warehouse_type: z.boolean().optional(),
  host: z.boolean().optional(),
  port: z.boolean().optional(),
  database: z.boolean().optional(),
  username: z.boolean().optional(),
  ssl: z.boolean().optional(),
  created_at: z.boolean().optional(),
  updated_at: z.boolean().optional(),
  workspace_id: z.boolean().optional(),
  source_connection_secrets: z.union([z.boolean(), z.lazy(() => source_connection_secretsArgsObjectSchema)]).optional()
}).strict();
