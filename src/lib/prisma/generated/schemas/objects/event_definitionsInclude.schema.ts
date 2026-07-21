// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { tracked_metricsArgsObjectSchema } from './tracked_metricsArgs.schema';
import { Event_propertiesFindManySchema } from '../findManyevent_properties.schema';
import { event_definitionsCountOutputTypeArgsObjectSchema } from './event_definitionsCountOutputTypeArgs.schema'

export const event_definitionsIncludeObjectSchema: z.ZodType<Prisma.event_definitionsInclude, Prisma.event_definitionsInclude> = z.object({
  tracked_metrics: z.union([z.boolean(), z.lazy(() => tracked_metricsArgsObjectSchema)]).optional(),
  event_properties: z.union([z.boolean(), z.lazy(() => Event_propertiesFindManySchema)]).optional(),
  _count: z.union([z.boolean(), z.lazy(() => event_definitionsCountOutputTypeArgsObjectSchema)]).optional()
}).strict();
export const event_definitionsIncludeObjectZodSchema = z.object({
  tracked_metrics: z.union([z.boolean(), z.lazy(() => tracked_metricsArgsObjectSchema)]).optional(),
  event_properties: z.union([z.boolean(), z.lazy(() => Event_propertiesFindManySchema)]).optional(),
  _count: z.union([z.boolean(), z.lazy(() => event_definitionsCountOutputTypeArgsObjectSchema)]).optional()
}).strict();
