// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

export const tag_audiencesMinOrderByAggregateInputObjectSchema: z.ZodType<Prisma.tag_audiencesMinOrderByAggregateInput, Prisma.tag_audiencesMinOrderByAggregateInput> = z.object({
  tag_id: SortOrderSchema.optional(),
  group_id: SortOrderSchema.optional()
}).strict();
export const tag_audiencesMinOrderByAggregateInputObjectZodSchema = z.object({
  tag_id: SortOrderSchema.optional(),
  group_id: SortOrderSchema.optional()
}).strict();
