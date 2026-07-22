// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { event_propertiesWhereInputObjectSchema } from './event_propertiesWhereInput.schema'

export const Event_propertiesListRelationFilterObjectSchema: z.ZodType<Prisma.Event_propertiesListRelationFilter, Prisma.Event_propertiesListRelationFilter> = z.object({
  every: z.lazy(() => event_propertiesWhereInputObjectSchema).optional(),
  some: z.lazy(() => event_propertiesWhereInputObjectSchema).optional(),
  none: z.lazy(() => event_propertiesWhereInputObjectSchema).optional()
}).strict();
export const Event_propertiesListRelationFilterObjectZodSchema = z.object({
  every: z.lazy(() => event_propertiesWhereInputObjectSchema).optional(),
  some: z.lazy(() => event_propertiesWhereInputObjectSchema).optional(),
  none: z.lazy(() => event_propertiesWhereInputObjectSchema).optional()
}).strict();
