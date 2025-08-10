import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

export const projectsCountOrderByAggregateInputObjectSchema: z.ZodType<Prisma.projectsCountOrderByAggregateInput, Prisma.projectsCountOrderByAggregateInput> = z.object({
  id: SortOrderSchema.optional(),
  name: SortOrderSchema.optional(),
  description: SortOrderSchema.optional(),
  tags: SortOrderSchema.optional(),
  settings: SortOrderSchema.optional(),
  created_at: SortOrderSchema.optional(),
  updated_at: SortOrderSchema.optional(),
  last_modified_by: SortOrderSchema.optional(),
  created_by: SortOrderSchema.optional(),
  is_public: SortOrderSchema.optional()
}).strict();
export const projectsCountOrderByAggregateInputObjectZodSchema = z.object({
  id: SortOrderSchema.optional(),
  name: SortOrderSchema.optional(),
  description: SortOrderSchema.optional(),
  tags: SortOrderSchema.optional(),
  settings: SortOrderSchema.optional(),
  created_at: SortOrderSchema.optional(),
  updated_at: SortOrderSchema.optional(),
  last_modified_by: SortOrderSchema.optional(),
  created_by: SortOrderSchema.optional(),
  is_public: SortOrderSchema.optional()
}).strict();
