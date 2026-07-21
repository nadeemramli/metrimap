// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { SortOrderInputObjectSchema } from './SortOrderInput.schema';
import { source_connection_secretsOrderByWithRelationInputObjectSchema } from './source_connection_secretsOrderByWithRelationInput.schema'

export const source_connectionsOrderByWithRelationInputObjectSchema: z.ZodType<Prisma.source_connectionsOrderByWithRelationInput, Prisma.source_connectionsOrderByWithRelationInput> = z.object({
  id: SortOrderSchema.optional(),
  created_by: SortOrderSchema.optional(),
  name: SortOrderSchema.optional(),
  warehouse_type: SortOrderSchema.optional(),
  host: SortOrderSchema.optional(),
  port: SortOrderSchema.optional(),
  database: SortOrderSchema.optional(),
  username: SortOrderSchema.optional(),
  ssl: SortOrderSchema.optional(),
  created_at: SortOrderSchema.optional(),
  updated_at: SortOrderSchema.optional(),
  workspace_id: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  source_connection_secrets: z.lazy(() => source_connection_secretsOrderByWithRelationInputObjectSchema).optional()
}).strict();
export const source_connectionsOrderByWithRelationInputObjectZodSchema = z.object({
  id: SortOrderSchema.optional(),
  created_by: SortOrderSchema.optional(),
  name: SortOrderSchema.optional(),
  warehouse_type: SortOrderSchema.optional(),
  host: SortOrderSchema.optional(),
  port: SortOrderSchema.optional(),
  database: SortOrderSchema.optional(),
  username: SortOrderSchema.optional(),
  ssl: SortOrderSchema.optional(),
  created_at: SortOrderSchema.optional(),
  updated_at: SortOrderSchema.optional(),
  workspace_id: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  source_connection_secrets: z.lazy(() => source_connection_secretsOrderByWithRelationInputObjectSchema).optional()
}).strict();
