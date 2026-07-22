// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { changelogCreateManyProjectsInputObjectSchema } from './changelogCreateManyProjectsInput.schema'

export const changelogCreateManyProjectsInputEnvelopeObjectSchema: z.ZodType<Prisma.changelogCreateManyProjectsInputEnvelope, Prisma.changelogCreateManyProjectsInputEnvelope> = z.object({
  data: z.union([z.lazy(() => changelogCreateManyProjectsInputObjectSchema), z.lazy(() => changelogCreateManyProjectsInputObjectSchema).array()]),
  skipDuplicates: z.boolean().optional()
}).strict();
export const changelogCreateManyProjectsInputEnvelopeObjectZodSchema = z.object({
  data: z.union([z.lazy(() => changelogCreateManyProjectsInputObjectSchema), z.lazy(() => changelogCreateManyProjectsInputObjectSchema).array()]),
  skipDuplicates: z.boolean().optional()
}).strict();
