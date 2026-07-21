// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';


export const CommentsCountOutputTypeSelectObjectSchema: z.ZodType<Prisma.CommentsCountOutputTypeSelect, Prisma.CommentsCountOutputTypeSelect> = z.object({
  comment_likes: z.boolean().optional(),
  comment_mentions: z.boolean().optional(),
  other_comments: z.boolean().optional()
}).strict();
export const CommentsCountOutputTypeSelectObjectZodSchema = z.object({
  comment_likes: z.boolean().optional(),
  comment_mentions: z.boolean().optional(),
  other_comments: z.boolean().optional()
}).strict();
