// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';


export const Tag_audiencesMinAggregateInputObjectSchema: z.ZodType<Prisma.Tag_audiencesMinAggregateInputType, Prisma.Tag_audiencesMinAggregateInputType> = z.object({
  tag_id: z.literal(true).optional(),
  group_id: z.literal(true).optional()
}).strict();
export const Tag_audiencesMinAggregateInputObjectZodSchema = z.object({
  tag_id: z.literal(true).optional(),
  group_id: z.literal(true).optional()
}).strict();
