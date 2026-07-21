// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { canvas_snapshotsCreateManyProjectsInputObjectSchema } from './canvas_snapshotsCreateManyProjectsInput.schema'

export const canvas_snapshotsCreateManyProjectsInputEnvelopeObjectSchema: z.ZodType<Prisma.canvas_snapshotsCreateManyProjectsInputEnvelope, Prisma.canvas_snapshotsCreateManyProjectsInputEnvelope> = z.object({
  data: z.union([z.lazy(() => canvas_snapshotsCreateManyProjectsInputObjectSchema), z.lazy(() => canvas_snapshotsCreateManyProjectsInputObjectSchema).array()]),
  skipDuplicates: z.boolean().optional()
}).strict();
export const canvas_snapshotsCreateManyProjectsInputEnvelopeObjectZodSchema = z.object({
  data: z.union([z.lazy(() => canvas_snapshotsCreateManyProjectsInputObjectSchema), z.lazy(() => canvas_snapshotsCreateManyProjectsInputObjectSchema).array()]),
  skipDuplicates: z.boolean().optional()
}).strict();
