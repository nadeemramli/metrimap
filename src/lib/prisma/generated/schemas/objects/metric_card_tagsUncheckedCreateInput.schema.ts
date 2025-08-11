import { z } from 'zod';
import type { Prisma } from '@prisma/client';


export const metric_card_tagsUncheckedCreateInputObjectSchema: z.ZodType<Prisma.metric_card_tagsUncheckedCreateInput, Prisma.metric_card_tagsUncheckedCreateInput> = z.object({
  metric_card_id: z.string().optional().nullable(),
  tag_id: z.string().optional().nullable(),
  created_at: z.union([z.date(), z.string().datetime()]).optional().nullable()
}).strict();
export const metric_card_tagsUncheckedCreateInputObjectZodSchema = z.object({
  metric_card_id: z.string().optional().nullable(),
  tag_id: z.string().optional().nullable(),
  created_at: z.union([z.date(), z.string().datetime()]).optional().nullable()
}).strict();
