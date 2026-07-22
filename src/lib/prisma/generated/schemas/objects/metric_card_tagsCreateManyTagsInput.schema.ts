// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';


export const metric_card_tagsCreateManyTagsInputObjectSchema: z.ZodType<Prisma.metric_card_tagsCreateManyTagsInput, Prisma.metric_card_tagsCreateManyTagsInput> = z.object({
  id: z.string().optional(),
  metric_card_id: z.string().optional().nullable(),
  created_at: z.union([z.date(), z.string().datetime()]).optional().nullable()
}).strict();
export const metric_card_tagsCreateManyTagsInputObjectZodSchema = z.object({
  id: z.string().optional(),
  metric_card_id: z.string().optional().nullable(),
  created_at: z.union([z.date(), z.string().datetime()]).optional().nullable()
}).strict();
