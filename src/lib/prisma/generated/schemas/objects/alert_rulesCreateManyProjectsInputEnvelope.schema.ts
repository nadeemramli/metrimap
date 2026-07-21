// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { alert_rulesCreateManyProjectsInputObjectSchema } from './alert_rulesCreateManyProjectsInput.schema'

export const alert_rulesCreateManyProjectsInputEnvelopeObjectSchema: z.ZodType<Prisma.alert_rulesCreateManyProjectsInputEnvelope, Prisma.alert_rulesCreateManyProjectsInputEnvelope> = z.object({
  data: z.union([z.lazy(() => alert_rulesCreateManyProjectsInputObjectSchema), z.lazy(() => alert_rulesCreateManyProjectsInputObjectSchema).array()]),
  skipDuplicates: z.boolean().optional()
}).strict();
export const alert_rulesCreateManyProjectsInputEnvelopeObjectZodSchema = z.object({
  data: z.union([z.lazy(() => alert_rulesCreateManyProjectsInputObjectSchema), z.lazy(() => alert_rulesCreateManyProjectsInputObjectSchema).array()]),
  skipDuplicates: z.boolean().optional()
}).strict();
