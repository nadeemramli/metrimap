import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

export const changelogMaxOrderByAggregateInputObjectSchema: z.ZodType<Prisma.changelogMaxOrderByAggregateInput, Prisma.changelogMaxOrderByAggregateInput> = z.object({
  id: SortOrderSchema.optional(),
  project_id: SortOrderSchema.optional(),
  user_id: SortOrderSchema.optional(),
  action: SortOrderSchema.optional(),
  target: SortOrderSchema.optional(),
  target_id: SortOrderSchema.optional(),
  target_name: SortOrderSchema.optional(),
  description: SortOrderSchema.optional(),
  timestamp: SortOrderSchema.optional()
}).strict();
export const changelogMaxOrderByAggregateInputObjectZodSchema = z.object({
  id: SortOrderSchema.optional(),
  project_id: SortOrderSchema.optional(),
  user_id: SortOrderSchema.optional(),
  action: SortOrderSchema.optional(),
  target: SortOrderSchema.optional(),
  target_id: SortOrderSchema.optional(),
  target_name: SortOrderSchema.optional(),
  description: SortOrderSchema.optional(),
  timestamp: SortOrderSchema.optional()
}).strict();
