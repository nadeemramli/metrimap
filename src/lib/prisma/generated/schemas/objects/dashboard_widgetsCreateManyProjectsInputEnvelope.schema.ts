// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { dashboard_widgetsCreateManyProjectsInputObjectSchema } from './dashboard_widgetsCreateManyProjectsInput.schema'

export const dashboard_widgetsCreateManyProjectsInputEnvelopeObjectSchema: z.ZodType<Prisma.dashboard_widgetsCreateManyProjectsInputEnvelope, Prisma.dashboard_widgetsCreateManyProjectsInputEnvelope> = z.object({
  data: z.union([z.lazy(() => dashboard_widgetsCreateManyProjectsInputObjectSchema), z.lazy(() => dashboard_widgetsCreateManyProjectsInputObjectSchema).array()]),
  skipDuplicates: z.boolean().optional()
}).strict();
export const dashboard_widgetsCreateManyProjectsInputEnvelopeObjectZodSchema = z.object({
  data: z.union([z.lazy(() => dashboard_widgetsCreateManyProjectsInputObjectSchema), z.lazy(() => dashboard_widgetsCreateManyProjectsInputObjectSchema).array()]),
  skipDuplicates: z.boolean().optional()
}).strict();
