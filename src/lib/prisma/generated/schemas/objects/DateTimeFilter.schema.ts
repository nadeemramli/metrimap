import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { NestedDateTimeFilterObjectSchema } from './NestedDateTimeFilter.schema'

export const DateTimeFilterObjectSchema: z.ZodType<Prisma.DateTimeFilter, Prisma.DateTimeFilter> = z.object({
  equals: z.union([z.date(), z.iso.datetime()]).optional(),
  in: z.union([z.date().array(), z.iso.datetime().array()]).optional(),
  notIn: z.union([z.date().array(), z.iso.datetime().array()]).optional(),
  lt: z.union([z.date(), z.iso.datetime()]).optional(),
  lte: z.union([z.date(), z.iso.datetime()]).optional(),
  gt: z.union([z.date(), z.iso.datetime()]).optional(),
  gte: z.union([z.date(), z.iso.datetime()]).optional(),
  not: z.union([z.union([z.date(), z.iso.datetime()]), z.lazy(() => NestedDateTimeFilterObjectSchema)]).optional()
}).strict();
export const DateTimeFilterObjectZodSchema = z.object({
  equals: z.union([z.date(), z.iso.datetime()]).optional(),
  in: z.union([z.date().array(), z.iso.datetime().array()]).optional(),
  notIn: z.union([z.date().array(), z.iso.datetime().array()]).optional(),
  lt: z.union([z.date(), z.iso.datetime()]).optional(),
  lte: z.union([z.date(), z.iso.datetime()]).optional(),
  gt: z.union([z.date(), z.iso.datetime()]).optional(),
  gte: z.union([z.date(), z.iso.datetime()]).optional(),
  not: z.union([z.union([z.date(), z.iso.datetime()]), z.lazy(() => NestedDateTimeFilterObjectSchema)]).optional()
}).strict();
