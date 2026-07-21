// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { evidence_itemsSelectObjectSchema } from './evidence_itemsSelect.schema';
import { evidence_itemsIncludeObjectSchema } from './evidence_itemsInclude.schema'

export const evidence_itemsArgsObjectSchema = z.object({
  select: z.lazy(() => evidence_itemsSelectObjectSchema).optional(),
  include: z.lazy(() => evidence_itemsIncludeObjectSchema).optional()
}).strict();
export const evidence_itemsArgsObjectZodSchema = z.object({
  select: z.lazy(() => evidence_itemsSelectObjectSchema).optional(),
  include: z.lazy(() => evidence_itemsIncludeObjectSchema).optional()
}).strict();
