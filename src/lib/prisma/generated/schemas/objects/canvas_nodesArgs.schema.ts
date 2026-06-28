// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { canvas_nodesSelectObjectSchema } from './canvas_nodesSelect.schema'

export const canvas_nodesArgsObjectSchema = z.object({
  select: z.lazy(() => canvas_nodesSelectObjectSchema).optional()
}).strict();
export const canvas_nodesArgsObjectZodSchema = z.object({
  select: z.lazy(() => canvas_nodesSelectObjectSchema).optional()
}).strict();
