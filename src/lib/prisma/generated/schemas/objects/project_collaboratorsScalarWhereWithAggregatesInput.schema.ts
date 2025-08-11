import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { UuidNullableWithAggregatesFilterObjectSchema } from './UuidNullableWithAggregatesFilter.schema';
import { StringNullableWithAggregatesFilterObjectSchema } from './StringNullableWithAggregatesFilter.schema';
import { StringWithAggregatesFilterObjectSchema } from './StringWithAggregatesFilter.schema';
import { StringNullableListFilterObjectSchema } from './StringNullableListFilter.schema';
import { DateTimeNullableWithAggregatesFilterObjectSchema } from './DateTimeNullableWithAggregatesFilter.schema'

export const project_collaboratorsScalarWhereWithAggregatesInputObjectSchema: z.ZodType<Prisma.project_collaboratorsScalarWhereWithAggregatesInput, Prisma.project_collaboratorsScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([z.lazy(() => project_collaboratorsScalarWhereWithAggregatesInputObjectSchema), z.lazy(() => project_collaboratorsScalarWhereWithAggregatesInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => project_collaboratorsScalarWhereWithAggregatesInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => project_collaboratorsScalarWhereWithAggregatesInputObjectSchema), z.lazy(() => project_collaboratorsScalarWhereWithAggregatesInputObjectSchema).array()]).optional(),
  project_id: z.union([z.lazy(() => UuidNullableWithAggregatesFilterObjectSchema), z.string()]).optional().nullable(),
  user_id: z.union([z.lazy(() => StringNullableWithAggregatesFilterObjectSchema), z.string()]).optional().nullable(),
  role: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  permissions: z.lazy(() => StringNullableListFilterObjectSchema).optional(),
  invited_at: z.union([z.lazy(() => DateTimeNullableWithAggregatesFilterObjectSchema), z.union([z.date(), z.string().datetime()])]).optional().nullable(),
  joined_at: z.union([z.lazy(() => DateTimeNullableWithAggregatesFilterObjectSchema), z.union([z.date(), z.string().datetime()])]).optional().nullable()
}).strict();
export const project_collaboratorsScalarWhereWithAggregatesInputObjectZodSchema = z.object({
  AND: z.union([z.lazy(() => project_collaboratorsScalarWhereWithAggregatesInputObjectSchema), z.lazy(() => project_collaboratorsScalarWhereWithAggregatesInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => project_collaboratorsScalarWhereWithAggregatesInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => project_collaboratorsScalarWhereWithAggregatesInputObjectSchema), z.lazy(() => project_collaboratorsScalarWhereWithAggregatesInputObjectSchema).array()]).optional(),
  project_id: z.union([z.lazy(() => UuidNullableWithAggregatesFilterObjectSchema), z.string()]).optional().nullable(),
  user_id: z.union([z.lazy(() => StringNullableWithAggregatesFilterObjectSchema), z.string()]).optional().nullable(),
  role: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  permissions: z.lazy(() => StringNullableListFilterObjectSchema).optional(),
  invited_at: z.union([z.lazy(() => DateTimeNullableWithAggregatesFilterObjectSchema), z.union([z.date(), z.string().datetime()])]).optional().nullable(),
  joined_at: z.union([z.lazy(() => DateTimeNullableWithAggregatesFilterObjectSchema), z.union([z.date(), z.string().datetime()])]).optional().nullable()
}).strict();
