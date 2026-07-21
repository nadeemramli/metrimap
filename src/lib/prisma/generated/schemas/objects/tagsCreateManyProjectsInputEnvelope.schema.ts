// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { tagsCreateManyProjectsInputObjectSchema } from './tagsCreateManyProjectsInput.schema'

export const tagsCreateManyProjectsInputEnvelopeObjectSchema: z.ZodType<Prisma.tagsCreateManyProjectsInputEnvelope, Prisma.tagsCreateManyProjectsInputEnvelope> = z.object({
  data: z.union([z.lazy(() => tagsCreateManyProjectsInputObjectSchema), z.lazy(() => tagsCreateManyProjectsInputObjectSchema).array()]),
  skipDuplicates: z.boolean().optional()
}).strict();
export const tagsCreateManyProjectsInputEnvelopeObjectZodSchema = z.object({
  data: z.union([z.lazy(() => tagsCreateManyProjectsInputObjectSchema), z.lazy(() => tagsCreateManyProjectsInputObjectSchema).array()]),
  skipDuplicates: z.boolean().optional()
}).strict();
