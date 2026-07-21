// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';


export const Tag_audiencesMaxAggregateInputObjectSchema: z.ZodType<Prisma.Tag_audiencesMaxAggregateInputType, Prisma.Tag_audiencesMaxAggregateInputType> = z.object({
  tag_id: z.literal(true).optional(),
  group_id: z.literal(true).optional()
}).strict();
export const Tag_audiencesMaxAggregateInputObjectZodSchema = z.object({
  tag_id: z.literal(true).optional(),
  group_id: z.literal(true).optional()
}).strict();
