// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { canvas_snapshotsSelectObjectSchema } from './canvas_snapshotsSelect.schema';
import { canvas_snapshotsIncludeObjectSchema } from './canvas_snapshotsInclude.schema'

export const canvas_snapshotsArgsObjectSchema = z.object({
  select: z.lazy(() => canvas_snapshotsSelectObjectSchema).optional(),
  include: z.lazy(() => canvas_snapshotsIncludeObjectSchema).optional()
}).strict();
export const canvas_snapshotsArgsObjectZodSchema = z.object({
  select: z.lazy(() => canvas_snapshotsSelectObjectSchema).optional(),
  include: z.lazy(() => canvas_snapshotsIncludeObjectSchema).optional()
}).strict();
