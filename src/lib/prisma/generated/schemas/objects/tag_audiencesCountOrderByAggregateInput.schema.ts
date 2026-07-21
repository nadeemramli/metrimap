// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

export const tag_audiencesCountOrderByAggregateInputObjectSchema: z.ZodType<Prisma.tag_audiencesCountOrderByAggregateInput, Prisma.tag_audiencesCountOrderByAggregateInput> = z.object({
  tag_id: SortOrderSchema.optional(),
  group_id: SortOrderSchema.optional()
}).strict();
export const tag_audiencesCountOrderByAggregateInputObjectZodSchema = z.object({
  tag_id: SortOrderSchema.optional(),
  group_id: SortOrderSchema.optional()
}).strict();
