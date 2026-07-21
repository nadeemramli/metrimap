// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { event_propertiesCreateManyEvent_definitionsInputObjectSchema } from './event_propertiesCreateManyEvent_definitionsInput.schema'

export const event_propertiesCreateManyEvent_definitionsInputEnvelopeObjectSchema: z.ZodType<Prisma.event_propertiesCreateManyEvent_definitionsInputEnvelope, Prisma.event_propertiesCreateManyEvent_definitionsInputEnvelope> = z.object({
  data: z.union([z.lazy(() => event_propertiesCreateManyEvent_definitionsInputObjectSchema), z.lazy(() => event_propertiesCreateManyEvent_definitionsInputObjectSchema).array()]),
  skipDuplicates: z.boolean().optional()
}).strict();
export const event_propertiesCreateManyEvent_definitionsInputEnvelopeObjectZodSchema = z.object({
  data: z.union([z.lazy(() => event_propertiesCreateManyEvent_definitionsInputObjectSchema), z.lazy(() => event_propertiesCreateManyEvent_definitionsInputObjectSchema).array()]),
  skipDuplicates: z.boolean().optional()
}).strict();
