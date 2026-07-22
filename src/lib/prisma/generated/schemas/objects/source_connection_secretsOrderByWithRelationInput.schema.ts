// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { source_connectionsOrderByWithRelationInputObjectSchema } from './source_connectionsOrderByWithRelationInput.schema'

export const source_connection_secretsOrderByWithRelationInputObjectSchema: z.ZodType<Prisma.source_connection_secretsOrderByWithRelationInput, Prisma.source_connection_secretsOrderByWithRelationInput> = z.object({
  connection_id: SortOrderSchema.optional(),
  password: SortOrderSchema.optional(),
  updated_at: SortOrderSchema.optional(),
  source_connections: z.lazy(() => source_connectionsOrderByWithRelationInputObjectSchema).optional()
}).strict();
export const source_connection_secretsOrderByWithRelationInputObjectZodSchema = z.object({
  connection_id: SortOrderSchema.optional(),
  password: SortOrderSchema.optional(),
  updated_at: SortOrderSchema.optional(),
  source_connections: z.lazy(() => source_connectionsOrderByWithRelationInputObjectSchema).optional()
}).strict();
