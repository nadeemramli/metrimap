// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { TagsCountOutputTypeSelectObjectSchema } from './TagsCountOutputTypeSelect.schema'

export const TagsCountOutputTypeArgsObjectSchema = z.object({
  select: z.lazy(() => TagsCountOutputTypeSelectObjectSchema).optional()
}).strict();
export const TagsCountOutputTypeArgsObjectZodSchema = z.object({
  select: z.lazy(() => TagsCountOutputTypeSelectObjectSchema).optional()
}).strict();
