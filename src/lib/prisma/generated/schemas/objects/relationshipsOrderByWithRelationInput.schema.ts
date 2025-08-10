import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { SortOrderInputObjectSchema } from './SortOrderInput.schema'

export const relationshipsOrderByWithRelationInputObjectSchema: z.ZodType<Prisma.relationshipsOrderByWithRelationInput, Prisma.relationshipsOrderByWithRelationInput> = z.object({
  id: SortOrderSchema.optional(),
  project_id: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  source_id: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  target_id: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  type: SortOrderSchema.optional(),
  confidence: SortOrderSchema.optional(),
  weight: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  created_at: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  updated_at: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  created_by: SortOrderSchema.optional()
}).strict();
export const relationshipsOrderByWithRelationInputObjectZodSchema = z.object({
  id: SortOrderSchema.optional(),
  project_id: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  source_id: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  target_id: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  type: SortOrderSchema.optional(),
  confidence: SortOrderSchema.optional(),
  weight: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  created_at: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  updated_at: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  created_by: SortOrderSchema.optional()
}).strict();
