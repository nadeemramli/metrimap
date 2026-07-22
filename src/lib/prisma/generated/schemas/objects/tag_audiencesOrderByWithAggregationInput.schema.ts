// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { tag_audiencesCountOrderByAggregateInputObjectSchema } from './tag_audiencesCountOrderByAggregateInput.schema';
import { tag_audiencesMaxOrderByAggregateInputObjectSchema } from './tag_audiencesMaxOrderByAggregateInput.schema';
import { tag_audiencesMinOrderByAggregateInputObjectSchema } from './tag_audiencesMinOrderByAggregateInput.schema'

export const tag_audiencesOrderByWithAggregationInputObjectSchema: z.ZodType<Prisma.tag_audiencesOrderByWithAggregationInput, Prisma.tag_audiencesOrderByWithAggregationInput> = z.object({
  tag_id: SortOrderSchema.optional(),
  group_id: SortOrderSchema.optional(),
  _count: z.lazy(() => tag_audiencesCountOrderByAggregateInputObjectSchema).optional(),
  _max: z.lazy(() => tag_audiencesMaxOrderByAggregateInputObjectSchema).optional(),
  _min: z.lazy(() => tag_audiencesMinOrderByAggregateInputObjectSchema).optional()
}).strict();
export const tag_audiencesOrderByWithAggregationInputObjectZodSchema = z.object({
  tag_id: SortOrderSchema.optional(),
  group_id: SortOrderSchema.optional(),
  _count: z.lazy(() => tag_audiencesCountOrderByAggregateInputObjectSchema).optional(),
  _max: z.lazy(() => tag_audiencesMaxOrderByAggregateInputObjectSchema).optional(),
  _min: z.lazy(() => tag_audiencesMinOrderByAggregateInputObjectSchema).optional()
}).strict();
