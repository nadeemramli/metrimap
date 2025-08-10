import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { NestedIntNullableFilterObjectSchema } from './NestedIntNullableFilter.schema';
import { NestedDateTimeNullableFilterObjectSchema } from './NestedDateTimeNullableFilter.schema'

export const NestedDateTimeNullableWithAggregatesFilterObjectSchema: z.ZodType<Prisma.NestedDateTimeNullableWithAggregatesFilter, Prisma.NestedDateTimeNullableWithAggregatesFilter> = z.object({
  equals: z.union([z.date(), z.iso.datetime()]).optional().nullable(),
  in: z.union([z.date().array(), z.iso.datetime().array()]).optional().nullable(),
  notIn: z.union([z.date().array(), z.iso.datetime().array()]).optional().nullable(),
  lt: z.union([z.date(), z.iso.datetime()]).optional(),
  lte: z.union([z.date(), z.iso.datetime()]).optional(),
  gt: z.union([z.date(), z.iso.datetime()]).optional(),
  gte: z.union([z.date(), z.iso.datetime()]).optional(),
  not: z.union([z.union([z.date(), z.iso.datetime()]), z.lazy(() => NestedDateTimeNullableWithAggregatesFilterObjectSchema)]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterObjectSchema).optional(),
  _min: z.lazy(() => NestedDateTimeNullableFilterObjectSchema).optional(),
  _max: z.lazy(() => NestedDateTimeNullableFilterObjectSchema).optional()
}).strict();
export const NestedDateTimeNullableWithAggregatesFilterObjectZodSchema = z.object({
  equals: z.union([z.date(), z.iso.datetime()]).optional().nullable(),
  in: z.union([z.date().array(), z.iso.datetime().array()]).optional().nullable(),
  notIn: z.union([z.date().array(), z.iso.datetime().array()]).optional().nullable(),
  lt: z.union([z.date(), z.iso.datetime()]).optional(),
  lte: z.union([z.date(), z.iso.datetime()]).optional(),
  gt: z.union([z.date(), z.iso.datetime()]).optional(),
  gte: z.union([z.date(), z.iso.datetime()]).optional(),
  not: z.union([z.union([z.date(), z.iso.datetime()]), z.lazy(() => NestedDateTimeNullableWithAggregatesFilterObjectSchema)]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterObjectSchema).optional(),
  _min: z.lazy(() => NestedDateTimeNullableFilterObjectSchema).optional(),
  _max: z.lazy(() => NestedDateTimeNullableFilterObjectSchema).optional()
}).strict();
