// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { relationship_tagsSelectObjectSchema } from './relationship_tagsSelect.schema';
import { relationship_tagsIncludeObjectSchema } from './relationship_tagsInclude.schema'

export const relationship_tagsArgsObjectSchema = z.object({
  select: z.lazy(() => relationship_tagsSelectObjectSchema).optional(),
  include: z.lazy(() => relationship_tagsIncludeObjectSchema).optional()
}).strict();
export const relationship_tagsArgsObjectZodSchema = z.object({
  select: z.lazy(() => relationship_tagsSelectObjectSchema).optional(),
  include: z.lazy(() => relationship_tagsIncludeObjectSchema).optional()
}).strict();
