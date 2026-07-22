// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { event_definitionsCreateManyTracked_metricsInputObjectSchema } from './event_definitionsCreateManyTracked_metricsInput.schema'

export const event_definitionsCreateManyTracked_metricsInputEnvelopeObjectSchema: z.ZodType<Prisma.event_definitionsCreateManyTracked_metricsInputEnvelope, Prisma.event_definitionsCreateManyTracked_metricsInputEnvelope> = z.object({
  data: z.union([z.lazy(() => event_definitionsCreateManyTracked_metricsInputObjectSchema), z.lazy(() => event_definitionsCreateManyTracked_metricsInputObjectSchema).array()]),
  skipDuplicates: z.boolean().optional()
}).strict();
export const event_definitionsCreateManyTracked_metricsInputEnvelopeObjectZodSchema = z.object({
  data: z.union([z.lazy(() => event_definitionsCreateManyTracked_metricsInputObjectSchema), z.lazy(() => event_definitionsCreateManyTracked_metricsInputObjectSchema).array()]),
  skipDuplicates: z.boolean().optional()
}).strict();
