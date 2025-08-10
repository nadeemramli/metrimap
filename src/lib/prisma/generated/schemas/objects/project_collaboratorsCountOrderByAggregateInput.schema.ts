import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

export const project_collaboratorsCountOrderByAggregateInputObjectSchema: z.ZodType<Prisma.project_collaboratorsCountOrderByAggregateInput, Prisma.project_collaboratorsCountOrderByAggregateInput> = z.object({
  id: SortOrderSchema.optional(),
  project_id: SortOrderSchema.optional(),
  user_id: SortOrderSchema.optional(),
  role: SortOrderSchema.optional(),
  permissions: SortOrderSchema.optional(),
  invited_at: SortOrderSchema.optional(),
  joined_at: SortOrderSchema.optional()
}).strict();
export const project_collaboratorsCountOrderByAggregateInputObjectZodSchema = z.object({
  id: SortOrderSchema.optional(),
  project_id: SortOrderSchema.optional(),
  user_id: SortOrderSchema.optional(),
  role: SortOrderSchema.optional(),
  permissions: SortOrderSchema.optional(),
  invited_at: SortOrderSchema.optional(),
  joined_at: SortOrderSchema.optional()
}).strict();
