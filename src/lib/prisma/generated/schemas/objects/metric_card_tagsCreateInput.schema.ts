import { z } from 'zod';
import type { Prisma } from '@prisma/client';


export const metric_card_tagsCreateInputObjectSchema: z.ZodType<Prisma.metric_card_tagsCreateInput, Prisma.metric_card_tagsCreateInput> = z.object({
  metric_card_id: z.string().optional().nullable(),
  tag_id: z.string().optional().nullable(),
  created_at: z.union([z.date(), z.iso.datetime()]).optional().nullable()
}).strict();
export const metric_card_tagsCreateInputObjectZodSchema = z.object({
  metric_card_id: z.string().optional().nullable(),
  tag_id: z.string().optional().nullable(),
  created_at: z.union([z.date(), z.iso.datetime()]).optional().nullable()
}).strict();
