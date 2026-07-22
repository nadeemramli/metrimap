// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';


export const TagsCountOutputTypeSelectObjectSchema: z.ZodType<Prisma.TagsCountOutputTypeSelect, Prisma.TagsCountOutputTypeSelect> = z.object({
  metric_card_tags: z.boolean().optional(),
  relationship_tags: z.boolean().optional(),
  tag_audiences: z.boolean().optional()
}).strict();
export const TagsCountOutputTypeSelectObjectZodSchema = z.object({
  metric_card_tags: z.boolean().optional(),
  relationship_tags: z.boolean().optional(),
  tag_audiences: z.boolean().optional()
}).strict();
