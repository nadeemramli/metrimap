import { z } from 'zod';
import type { Prisma } from '@prisma/client';


export const NestedDateTimeNullableFilterObjectSchema: z.ZodType<Prisma.NestedDateTimeNullableFilter, Prisma.NestedDateTimeNullableFilter> = z.object({
  equals: z.union([z.date(), z.string().datetime()]).optional().nullable(),
  in: z.union([z.date().array(), z.string().datetime().array()]).optional().nullable(),
  notIn: z.union([z.date().array(), z.string().datetime().array()]).optional().nullable(),
  lt: z.union([z.date(), z.string().datetime()]).optional(),
  lte: z.union([z.date(), z.string().datetime()]).optional(),
  gt: z.union([z.date(), z.string().datetime()]).optional(),
  gte: z.union([z.date(), z.string().datetime()]).optional(),
  not: z.union([z.union([z.date(), z.string().datetime()]), z.lazy(() => NestedDateTimeNullableFilterObjectSchema)]).optional().nullable()
}).strict();
export const NestedDateTimeNullableFilterObjectZodSchema = z.object({
  equals: z.union([z.date(), z.string().datetime()]).optional().nullable(),
  in: z.union([z.date().array(), z.string().datetime().array()]).optional().nullable(),
  notIn: z.union([z.date().array(), z.string().datetime().array()]).optional().nullable(),
  lt: z.union([z.date(), z.string().datetime()]).optional(),
  lte: z.union([z.date(), z.string().datetime()]).optional(),
  gt: z.union([z.date(), z.string().datetime()]).optional(),
  gte: z.union([z.date(), z.string().datetime()]).optional(),
  not: z.union([z.union([z.date(), z.string().datetime()]), z.lazy(() => NestedDateTimeNullableFilterObjectSchema)]).optional().nullable()
}).strict();
