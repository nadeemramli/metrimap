import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

export const changelogCountOrderByAggregateInputObjectSchema: z.ZodType<Prisma.changelogCountOrderByAggregateInput, Prisma.changelogCountOrderByAggregateInput> = z.object({
  id: SortOrderSchema.optional(),
  project_id: SortOrderSchema.optional(),
  user_id: SortOrderSchema.optional(),
  action: SortOrderSchema.optional(),
  target: SortOrderSchema.optional(),
  target_id: SortOrderSchema.optional(),
  target_name: SortOrderSchema.optional(),
  description: SortOrderSchema.optional(),
  metadata: SortOrderSchema.optional(),
  timestamp: SortOrderSchema.optional()
}).strict();
export const changelogCountOrderByAggregateInputObjectZodSchema = z.object({
  id: SortOrderSchema.optional(),
  project_id: SortOrderSchema.optional(),
  user_id: SortOrderSchema.optional(),
  action: SortOrderSchema.optional(),
  target: SortOrderSchema.optional(),
  target_id: SortOrderSchema.optional(),
  target_name: SortOrderSchema.optional(),
  description: SortOrderSchema.optional(),
  metadata: SortOrderSchema.optional(),
  timestamp: SortOrderSchema.optional()
}).strict();
