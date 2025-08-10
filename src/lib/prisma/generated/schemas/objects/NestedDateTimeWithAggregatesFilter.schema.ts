import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { NestedIntFilterObjectSchema } from './NestedIntFilter.schema';
import { NestedDateTimeFilterObjectSchema } from './NestedDateTimeFilter.schema'

export const NestedDateTimeWithAggregatesFilterObjectSchema: z.ZodType<Prisma.NestedDateTimeWithAggregatesFilter, Prisma.NestedDateTimeWithAggregatesFilter> = z.object({
  equals: z.union([z.date(), z.iso.datetime()]).optional(),
  in: z.union([z.date().array(), z.iso.datetime().array()]).optional(),
  notIn: z.union([z.date().array(), z.iso.datetime().array()]).optional(),
  lt: z.union([z.date(), z.iso.datetime()]).optional(),
  lte: z.union([z.date(), z.iso.datetime()]).optional(),
  gt: z.union([z.date(), z.iso.datetime()]).optional(),
  gte: z.union([z.date(), z.iso.datetime()]).optional(),
  not: z.union([z.union([z.date(), z.iso.datetime()]), z.lazy(() => NestedDateTimeWithAggregatesFilterObjectSchema)]).optional(),
  _count: z.lazy(() => NestedIntFilterObjectSchema).optional(),
  _min: z.lazy(() => NestedDateTimeFilterObjectSchema).optional(),
  _max: z.lazy(() => NestedDateTimeFilterObjectSchema).optional()
}).strict();
export const NestedDateTimeWithAggregatesFilterObjectZodSchema = z.object({
  equals: z.union([z.date(), z.iso.datetime()]).optional(),
  in: z.union([z.date().array(), z.iso.datetime().array()]).optional(),
  notIn: z.union([z.date().array(), z.iso.datetime().array()]).optional(),
  lt: z.union([z.date(), z.iso.datetime()]).optional(),
  lte: z.union([z.date(), z.iso.datetime()]).optional(),
  gt: z.union([z.date(), z.iso.datetime()]).optional(),
  gte: z.union([z.date(), z.iso.datetime()]).optional(),
  not: z.union([z.union([z.date(), z.iso.datetime()]), z.lazy(() => NestedDateTimeWithAggregatesFilterObjectSchema)]).optional(),
  _count: z.lazy(() => NestedIntFilterObjectSchema).optional(),
  _min: z.lazy(() => NestedDateTimeFilterObjectSchema).optional(),
  _max: z.lazy(() => NestedDateTimeFilterObjectSchema).optional()
}).strict();
