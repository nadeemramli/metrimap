// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { evidence_itemsWhereInputObjectSchema } from './evidence_itemsWhereInput.schema'

export const Evidence_itemsListRelationFilterObjectSchema: z.ZodType<Prisma.Evidence_itemsListRelationFilter, Prisma.Evidence_itemsListRelationFilter> = z.object({
  every: z.lazy(() => evidence_itemsWhereInputObjectSchema).optional(),
  some: z.lazy(() => evidence_itemsWhereInputObjectSchema).optional(),
  none: z.lazy(() => evidence_itemsWhereInputObjectSchema).optional()
}).strict();
export const Evidence_itemsListRelationFilterObjectZodSchema = z.object({
  every: z.lazy(() => evidence_itemsWhereInputObjectSchema).optional(),
  some: z.lazy(() => evidence_itemsWhereInputObjectSchema).optional(),
  none: z.lazy(() => evidence_itemsWhereInputObjectSchema).optional()
}).strict();
