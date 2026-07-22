// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { spacesSelectObjectSchema } from './spacesSelect.schema';
import { spacesIncludeObjectSchema } from './spacesInclude.schema'

export const spacesArgsObjectSchema = z.object({
  select: z.lazy(() => spacesSelectObjectSchema).optional(),
  include: z.lazy(() => spacesIncludeObjectSchema).optional()
}).strict();
export const spacesArgsObjectZodSchema = z.object({
  select: z.lazy(() => spacesSelectObjectSchema).optional(),
  include: z.lazy(() => spacesIncludeObjectSchema).optional()
}).strict();
