import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { evidence_itemsSelectObjectSchema } from './evidence_itemsSelect.schema'

export const evidence_itemsArgsObjectSchema = z.object({
  select: z.lazy(() => evidence_itemsSelectObjectSchema).optional()
}).strict();
export const evidence_itemsArgsObjectZodSchema = z.object({
  select: z.lazy(() => evidence_itemsSelectObjectSchema).optional()
}).strict();
