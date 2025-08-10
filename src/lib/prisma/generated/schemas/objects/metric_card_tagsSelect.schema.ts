import { z } from 'zod';
import type { Prisma } from '@prisma/client';


export const metric_card_tagsSelectObjectSchema: z.ZodType<Prisma.metric_card_tagsSelect, Prisma.metric_card_tagsSelect> = z.object({
  id: z.boolean().optional(),
  metric_card_id: z.boolean().optional(),
  tag_id: z.boolean().optional(),
  created_at: z.boolean().optional()
}).strict();
export const metric_card_tagsSelectObjectZodSchema = z.object({
  id: z.boolean().optional(),
  metric_card_id: z.boolean().optional(),
  tag_id: z.boolean().optional(),
  created_at: z.boolean().optional()
}).strict();
