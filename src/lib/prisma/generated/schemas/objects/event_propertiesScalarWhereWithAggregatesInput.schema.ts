// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { UuidWithAggregatesFilterObjectSchema } from './UuidWithAggregatesFilter.schema';
import { StringWithAggregatesFilterObjectSchema } from './StringWithAggregatesFilter.schema';
import { BoolWithAggregatesFilterObjectSchema } from './BoolWithAggregatesFilter.schema';
import { JsonNullableWithAggregatesFilterObjectSchema } from './JsonNullableWithAggregatesFilter.schema';
import { StringNullableWithAggregatesFilterObjectSchema } from './StringNullableWithAggregatesFilter.schema';
import { DateTimeWithAggregatesFilterObjectSchema } from './DateTimeWithAggregatesFilter.schema'

export const event_propertiesScalarWhereWithAggregatesInputObjectSchema: z.ZodType<Prisma.event_propertiesScalarWhereWithAggregatesInput, Prisma.event_propertiesScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([z.lazy(() => event_propertiesScalarWhereWithAggregatesInputObjectSchema), z.lazy(() => event_propertiesScalarWhereWithAggregatesInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => event_propertiesScalarWhereWithAggregatesInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => event_propertiesScalarWhereWithAggregatesInputObjectSchema), z.lazy(() => event_propertiesScalarWhereWithAggregatesInputObjectSchema).array()]).optional(),
  event_id: z.union([z.lazy(() => UuidWithAggregatesFilterObjectSchema), z.string()]).optional(),
  name: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  key: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  data_type: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  required: z.union([z.lazy(() => BoolWithAggregatesFilterObjectSchema), z.boolean()]).optional(),
  allowed_values: z.lazy(() => JsonNullableWithAggregatesFilterObjectSchema).optional(),
  example_value: z.union([z.lazy(() => StringNullableWithAggregatesFilterObjectSchema), z.string()]).optional().nullable(),
  description: z.union([z.lazy(() => StringNullableWithAggregatesFilterObjectSchema), z.string()]).optional().nullable(),
  created_at: z.union([z.lazy(() => DateTimeWithAggregatesFilterObjectSchema), z.union([z.date(), z.string().datetime()])]).optional()
}).strict();
export const event_propertiesScalarWhereWithAggregatesInputObjectZodSchema = z.object({
  AND: z.union([z.lazy(() => event_propertiesScalarWhereWithAggregatesInputObjectSchema), z.lazy(() => event_propertiesScalarWhereWithAggregatesInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => event_propertiesScalarWhereWithAggregatesInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => event_propertiesScalarWhereWithAggregatesInputObjectSchema), z.lazy(() => event_propertiesScalarWhereWithAggregatesInputObjectSchema).array()]).optional(),
  event_id: z.union([z.lazy(() => UuidWithAggregatesFilterObjectSchema), z.string()]).optional(),
  name: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  key: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  data_type: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  required: z.union([z.lazy(() => BoolWithAggregatesFilterObjectSchema), z.boolean()]).optional(),
  allowed_values: z.lazy(() => JsonNullableWithAggregatesFilterObjectSchema).optional(),
  example_value: z.union([z.lazy(() => StringNullableWithAggregatesFilterObjectSchema), z.string()]).optional().nullable(),
  description: z.union([z.lazy(() => StringNullableWithAggregatesFilterObjectSchema), z.string()]).optional().nullable(),
  created_at: z.union([z.lazy(() => DateTimeWithAggregatesFilterObjectSchema), z.union([z.date(), z.string().datetime()])]).optional()
}).strict();
