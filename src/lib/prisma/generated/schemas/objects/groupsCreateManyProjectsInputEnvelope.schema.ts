// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { groupsCreateManyProjectsInputObjectSchema } from './groupsCreateManyProjectsInput.schema'

export const groupsCreateManyProjectsInputEnvelopeObjectSchema: z.ZodType<Prisma.groupsCreateManyProjectsInputEnvelope, Prisma.groupsCreateManyProjectsInputEnvelope> = z.object({
  data: z.union([z.lazy(() => groupsCreateManyProjectsInputObjectSchema), z.lazy(() => groupsCreateManyProjectsInputObjectSchema).array()]),
  skipDuplicates: z.boolean().optional()
}).strict();
export const groupsCreateManyProjectsInputEnvelopeObjectZodSchema = z.object({
  data: z.union([z.lazy(() => groupsCreateManyProjectsInputObjectSchema), z.lazy(() => groupsCreateManyProjectsInputObjectSchema).array()]),
  skipDuplicates: z.boolean().optional()
}).strict();
