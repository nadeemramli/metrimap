// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';


export const Tag_audiencesCountAggregateInputObjectSchema: z.ZodType<Prisma.Tag_audiencesCountAggregateInputType, Prisma.Tag_audiencesCountAggregateInputType> = z.object({
  tag_id: z.literal(true).optional(),
  group_id: z.literal(true).optional(),
  _all: z.literal(true).optional()
}).strict();
export const Tag_audiencesCountAggregateInputObjectZodSchema = z.object({
  tag_id: z.literal(true).optional(),
  group_id: z.literal(true).optional(),
  _all: z.literal(true).optional()
}).strict();
