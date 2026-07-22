// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

export const tag_audiencesOrderByRelationAggregateInputObjectSchema: z.ZodType<Prisma.tag_audiencesOrderByRelationAggregateInput, Prisma.tag_audiencesOrderByRelationAggregateInput> = z.object({
  _count: SortOrderSchema.optional()
}).strict();
export const tag_audiencesOrderByRelationAggregateInputObjectZodSchema = z.object({
  _count: SortOrderSchema.optional()
}).strict();
