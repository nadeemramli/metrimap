// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { SortOrderInputObjectSchema } from './SortOrderInput.schema'

export const api_keysOrderByWithRelationInputObjectSchema: z.ZodType<Prisma.api_keysOrderByWithRelationInput, Prisma.api_keysOrderByWithRelationInput> = z.object({
  id: SortOrderSchema.optional(),
  workspace_id: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  created_by: SortOrderSchema.optional(),
  name: SortOrderSchema.optional(),
  key_prefix: SortOrderSchema.optional(),
  key_hash: SortOrderSchema.optional(),
  created_at: SortOrderSchema.optional(),
  last_used_at: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional()
}).strict();
export const api_keysOrderByWithRelationInputObjectZodSchema = z.object({
  id: SortOrderSchema.optional(),
  workspace_id: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  created_by: SortOrderSchema.optional(),
  name: SortOrderSchema.optional(),
  key_prefix: SortOrderSchema.optional(),
  key_hash: SortOrderSchema.optional(),
  created_at: SortOrderSchema.optional(),
  last_used_at: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional()
}).strict();
