// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

export const tag_audiencesMaxOrderByAggregateInputObjectSchema: z.ZodType<Prisma.tag_audiencesMaxOrderByAggregateInput, Prisma.tag_audiencesMaxOrderByAggregateInput> = z.object({
  tag_id: SortOrderSchema.optional(),
  group_id: SortOrderSchema.optional()
}).strict();
export const tag_audiencesMaxOrderByAggregateInputObjectZodSchema = z.object({
  tag_id: SortOrderSchema.optional(),
  group_id: SortOrderSchema.optional()
}).strict();
