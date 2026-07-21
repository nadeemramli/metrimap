// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { UuidFilterObjectSchema } from './UuidFilter.schema';
import { StringFilterObjectSchema } from './StringFilter.schema';
import { BoolFilterObjectSchema } from './BoolFilter.schema';
import { JsonNullableFilterObjectSchema } from './JsonNullableFilter.schema';
import { StringNullableFilterObjectSchema } from './StringNullableFilter.schema';
import { DateTimeFilterObjectSchema } from './DateTimeFilter.schema';
import { Event_definitionsScalarRelationFilterObjectSchema } from './Event_definitionsScalarRelationFilter.schema';
import { event_definitionsWhereInputObjectSchema } from './event_definitionsWhereInput.schema'

export const event_propertiesWhereInputObjectSchema: z.ZodType<Prisma.event_propertiesWhereInput, Prisma.event_propertiesWhereInput> = z.object({
  AND: z.union([z.lazy(() => event_propertiesWhereInputObjectSchema), z.lazy(() => event_propertiesWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => event_propertiesWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => event_propertiesWhereInputObjectSchema), z.lazy(() => event_propertiesWhereInputObjectSchema).array()]).optional(),
  event_id: z.union([z.lazy(() => UuidFilterObjectSchema), z.string()]).optional(),
  name: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  key: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  data_type: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  required: z.union([z.lazy(() => BoolFilterObjectSchema), z.boolean()]).optional(),
  allowed_values: z.lazy(() => JsonNullableFilterObjectSchema).optional(),
  example_value: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  description: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  created_at: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.union([z.date(), z.string().datetime()])]).optional(),
  event_definitions: z.union([z.lazy(() => Event_definitionsScalarRelationFilterObjectSchema), z.lazy(() => event_definitionsWhereInputObjectSchema)]).optional()
}).strict();
export const event_propertiesWhereInputObjectZodSchema = z.object({
  AND: z.union([z.lazy(() => event_propertiesWhereInputObjectSchema), z.lazy(() => event_propertiesWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => event_propertiesWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => event_propertiesWhereInputObjectSchema), z.lazy(() => event_propertiesWhereInputObjectSchema).array()]).optional(),
  event_id: z.union([z.lazy(() => UuidFilterObjectSchema), z.string()]).optional(),
  name: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  key: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  data_type: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  required: z.union([z.lazy(() => BoolFilterObjectSchema), z.boolean()]).optional(),
  allowed_values: z.lazy(() => JsonNullableFilterObjectSchema).optional(),
  example_value: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  description: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  created_at: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.union([z.date(), z.string().datetime()])]).optional(),
  event_definitions: z.union([z.lazy(() => Event_definitionsScalarRelationFilterObjectSchema), z.lazy(() => event_definitionsWhereInputObjectSchema)]).optional()
}).strict();
