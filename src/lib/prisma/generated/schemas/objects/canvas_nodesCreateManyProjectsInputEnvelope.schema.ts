// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { canvas_nodesCreateManyProjectsInputObjectSchema } from './canvas_nodesCreateManyProjectsInput.schema'

export const canvas_nodesCreateManyProjectsInputEnvelopeObjectSchema: z.ZodType<Prisma.canvas_nodesCreateManyProjectsInputEnvelope, Prisma.canvas_nodesCreateManyProjectsInputEnvelope> = z.object({
  data: z.union([z.lazy(() => canvas_nodesCreateManyProjectsInputObjectSchema), z.lazy(() => canvas_nodesCreateManyProjectsInputObjectSchema).array()]),
  skipDuplicates: z.boolean().optional()
}).strict();
export const canvas_nodesCreateManyProjectsInputEnvelopeObjectZodSchema = z.object({
  data: z.union([z.lazy(() => canvas_nodesCreateManyProjectsInputObjectSchema), z.lazy(() => canvas_nodesCreateManyProjectsInputObjectSchema).array()]),
  skipDuplicates: z.boolean().optional()
}).strict();
