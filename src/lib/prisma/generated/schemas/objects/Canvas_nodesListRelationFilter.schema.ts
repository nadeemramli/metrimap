// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { canvas_nodesWhereInputObjectSchema } from './canvas_nodesWhereInput.schema'

export const Canvas_nodesListRelationFilterObjectSchema: z.ZodType<Prisma.Canvas_nodesListRelationFilter, Prisma.Canvas_nodesListRelationFilter> = z.object({
  every: z.lazy(() => canvas_nodesWhereInputObjectSchema).optional(),
  some: z.lazy(() => canvas_nodesWhereInputObjectSchema).optional(),
  none: z.lazy(() => canvas_nodesWhereInputObjectSchema).optional()
}).strict();
export const Canvas_nodesListRelationFilterObjectZodSchema = z.object({
  every: z.lazy(() => canvas_nodesWhereInputObjectSchema).optional(),
  some: z.lazy(() => canvas_nodesWhereInputObjectSchema).optional(),
  none: z.lazy(() => canvas_nodesWhereInputObjectSchema).optional()
}).strict();
