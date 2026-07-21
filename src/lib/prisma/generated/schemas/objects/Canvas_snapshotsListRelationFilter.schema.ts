// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { canvas_snapshotsWhereInputObjectSchema } from './canvas_snapshotsWhereInput.schema'

export const Canvas_snapshotsListRelationFilterObjectSchema: z.ZodType<Prisma.Canvas_snapshotsListRelationFilter, Prisma.Canvas_snapshotsListRelationFilter> = z.object({
  every: z.lazy(() => canvas_snapshotsWhereInputObjectSchema).optional(),
  some: z.lazy(() => canvas_snapshotsWhereInputObjectSchema).optional(),
  none: z.lazy(() => canvas_snapshotsWhereInputObjectSchema).optional()
}).strict();
export const Canvas_snapshotsListRelationFilterObjectZodSchema = z.object({
  every: z.lazy(() => canvas_snapshotsWhereInputObjectSchema).optional(),
  some: z.lazy(() => canvas_snapshotsWhereInputObjectSchema).optional(),
  none: z.lazy(() => canvas_snapshotsWhereInputObjectSchema).optional()
}).strict();
