// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { relationshipsCreateManyProjectsInputObjectSchema } from './relationshipsCreateManyProjectsInput.schema'

export const relationshipsCreateManyProjectsInputEnvelopeObjectSchema: z.ZodType<Prisma.relationshipsCreateManyProjectsInputEnvelope, Prisma.relationshipsCreateManyProjectsInputEnvelope> = z.object({
  data: z.union([z.lazy(() => relationshipsCreateManyProjectsInputObjectSchema), z.lazy(() => relationshipsCreateManyProjectsInputObjectSchema).array()]),
  skipDuplicates: z.boolean().optional()
}).strict();
export const relationshipsCreateManyProjectsInputEnvelopeObjectZodSchema = z.object({
  data: z.union([z.lazy(() => relationshipsCreateManyProjectsInputObjectSchema), z.lazy(() => relationshipsCreateManyProjectsInputObjectSchema).array()]),
  skipDuplicates: z.boolean().optional()
}).strict();
