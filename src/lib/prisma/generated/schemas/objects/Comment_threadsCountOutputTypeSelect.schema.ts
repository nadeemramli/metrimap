// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';


export const Comment_threadsCountOutputTypeSelectObjectSchema: z.ZodType<Prisma.Comment_threadsCountOutputTypeSelect, Prisma.Comment_threadsCountOutputTypeSelect> = z.object({
  comments: z.boolean().optional()
}).strict();
export const Comment_threadsCountOutputTypeSelectObjectZodSchema = z.object({
  comments: z.boolean().optional()
}).strict();
