import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

export const project_collaboratorsMaxOrderByAggregateInputObjectSchema: z.ZodType<Prisma.project_collaboratorsMaxOrderByAggregateInput, Prisma.project_collaboratorsMaxOrderByAggregateInput> = z.object({
  id: SortOrderSchema.optional(),
  project_id: SortOrderSchema.optional(),
  user_id: SortOrderSchema.optional(),
  role: SortOrderSchema.optional(),
  invited_at: SortOrderSchema.optional(),
  joined_at: SortOrderSchema.optional()
}).strict();
export const project_collaboratorsMaxOrderByAggregateInputObjectZodSchema = z.object({
  id: SortOrderSchema.optional(),
  project_id: SortOrderSchema.optional(),
  user_id: SortOrderSchema.optional(),
  role: SortOrderSchema.optional(),
  invited_at: SortOrderSchema.optional(),
  joined_at: SortOrderSchema.optional()
}).strict();
