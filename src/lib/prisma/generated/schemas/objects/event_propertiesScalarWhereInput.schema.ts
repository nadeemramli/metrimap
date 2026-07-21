// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { UuidFilterObjectSchema } from './UuidFilter.schema';
import { StringFilterObjectSchema } from './StringFilter.schema';
import { BoolFilterObjectSchema } from './BoolFilter.schema';
import { JsonNullableFilterObjectSchema } from './JsonNullableFilter.schema';
import { StringNullableFilterObjectSchema } from './StringNullableFilter.schema';
import { DateTimeFilterObjectSchema } from './DateTimeFilter.schema'

export const event_propertiesScalarWhereInputObjectSchema: z.ZodType<Prisma.event_propertiesScalarWhereInput, Prisma.event_propertiesScalarWhereInput> = z.object({
  AND: z.union([z.lazy(() => event_propertiesScalarWhereInputObjectSchema), z.lazy(() => event_propertiesScalarWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => event_propertiesScalarWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => event_propertiesScalarWhereInputObjectSchema), z.lazy(() => event_propertiesScalarWhereInputObjectSchema).array()]).optional(),
  id: z.union([z.lazy(() => UuidFilterObjectSchema), z.string()]).optional(),
  event_id: z.union([z.lazy(() => UuidFilterObjectSchema), z.string()]).optional(),
  name: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  key: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  data_type: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  required: z.union([z.lazy(() => BoolFilterObjectSchema), z.boolean()]).optional(),
  allowed_values: z.lazy(() => JsonNullableFilterObjectSchema).optional(),
  example_value: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  description: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  created_at: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.union([z.date(), z.string().datetime()])]).optional()
}).strict();
export const event_propertiesScalarWhereInputObjectZodSchema = z.object({
  AND: z.union([z.lazy(() => event_propertiesScalarWhereInputObjectSchema), z.lazy(() => event_propertiesScalarWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => event_propertiesScalarWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => event_propertiesScalarWhereInputObjectSchema), z.lazy(() => event_propertiesScalarWhereInputObjectSchema).array()]).optional(),
  id: z.union([z.lazy(() => UuidFilterObjectSchema), z.string()]).optional(),
  event_id: z.union([z.lazy(() => UuidFilterObjectSchema), z.string()]).optional(),
  name: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  key: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  data_type: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  required: z.union([z.lazy(() => BoolFilterObjectSchema), z.boolean()]).optional(),
  allowed_values: z.lazy(() => JsonNullableFilterObjectSchema).optional(),
  example_value: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  description: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  created_at: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.union([z.date(), z.string().datetime()])]).optional()
}).strict();
