// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { relationship_historyCreateManyProjectsInputObjectSchema } from './relationship_historyCreateManyProjectsInput.schema'

export const relationship_historyCreateManyProjectsInputEnvelopeObjectSchema: z.ZodType<Prisma.relationship_historyCreateManyProjectsInputEnvelope, Prisma.relationship_historyCreateManyProjectsInputEnvelope> = z.object({
  data: z.union([z.lazy(() => relationship_historyCreateManyProjectsInputObjectSchema), z.lazy(() => relationship_historyCreateManyProjectsInputObjectSchema).array()]),
  skipDuplicates: z.boolean().optional()
}).strict();
export const relationship_historyCreateManyProjectsInputEnvelopeObjectZodSchema = z.object({
  data: z.union([z.lazy(() => relationship_historyCreateManyProjectsInputObjectSchema), z.lazy(() => relationship_historyCreateManyProjectsInputObjectSchema).array()]),
  skipDuplicates: z.boolean().optional()
}).strict();
