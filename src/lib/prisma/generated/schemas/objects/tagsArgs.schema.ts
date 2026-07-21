// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { tagsSelectObjectSchema } from './tagsSelect.schema';
import { tagsIncludeObjectSchema } from './tagsInclude.schema'

export const tagsArgsObjectSchema = z.object({
  select: z.lazy(() => tagsSelectObjectSchema).optional(),
  include: z.lazy(() => tagsIncludeObjectSchema).optional()
}).strict();
export const tagsArgsObjectZodSchema = z.object({
  select: z.lazy(() => tagsSelectObjectSchema).optional(),
  include: z.lazy(() => tagsIncludeObjectSchema).optional()
}).strict();
