import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { tagsSelectObjectSchema } from './tagsSelect.schema'

export const tagsArgsObjectSchema = z.object({
  select: z.lazy(() => tagsSelectObjectSchema).optional()
}).strict();
export const tagsArgsObjectZodSchema = z.object({
  select: z.lazy(() => tagsSelectObjectSchema).optional()
}).strict();
