// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { UuidFilterObjectSchema } from './UuidFilter.schema';
import { UuidNullableFilterObjectSchema } from './UuidNullableFilter.schema';
import { StringFilterObjectSchema } from './StringFilter.schema';
import { DateTimeFilterObjectSchema } from './DateTimeFilter.schema';
import { StringNullableFilterObjectSchema } from './StringNullableFilter.schema';
import { DateTimeNullableFilterObjectSchema } from './DateTimeNullableFilter.schema';
import { JsonNullableFilterObjectSchema } from './JsonNullableFilter.schema';
import { BoolFilterObjectSchema } from './BoolFilter.schema'

export const evidence_itemsScalarWhereInputObjectSchema: z.ZodType<Prisma.evidence_itemsScalarWhereInput, Prisma.evidence_itemsScalarWhereInput> = z.object({
  AND: z.union([z.lazy(() => evidence_itemsScalarWhereInputObjectSchema), z.lazy(() => evidence_itemsScalarWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => evidence_itemsScalarWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => evidence_itemsScalarWhereInputObjectSchema), z.lazy(() => evidence_itemsScalarWhereInputObjectSchema).array()]).optional(),
  id: z.union([z.lazy(() => UuidFilterObjectSchema), z.string()]).optional(),
  relationship_id: z.union([z.lazy(() => UuidNullableFilterObjectSchema), z.string()]).optional().nullable(),
  title: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  type: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  date: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.union([z.date(), z.string().datetime()])]).optional(),
  owner_id: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  link: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  hypothesis: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  summary: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  impact_on_confidence: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  created_at: z.union([z.lazy(() => DateTimeNullableFilterObjectSchema), z.union([z.date(), z.string().datetime()])]).optional().nullable(),
  updated_at: z.union([z.lazy(() => DateTimeNullableFilterObjectSchema), z.union([z.date(), z.string().datetime()])]).optional().nullable(),
  created_by: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  card_id: z.union([z.lazy(() => UuidNullableFilterObjectSchema), z.string()]).optional().nullable(),
  project_id: z.union([z.lazy(() => UuidNullableFilterObjectSchema), z.string()]).optional().nullable(),
  content: z.lazy(() => JsonNullableFilterObjectSchema).optional(),
  is_public: z.union([z.lazy(() => BoolFilterObjectSchema), z.boolean()]).optional()
}).strict();
export const evidence_itemsScalarWhereInputObjectZodSchema = z.object({
  AND: z.union([z.lazy(() => evidence_itemsScalarWhereInputObjectSchema), z.lazy(() => evidence_itemsScalarWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => evidence_itemsScalarWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => evidence_itemsScalarWhereInputObjectSchema), z.lazy(() => evidence_itemsScalarWhereInputObjectSchema).array()]).optional(),
  id: z.union([z.lazy(() => UuidFilterObjectSchema), z.string()]).optional(),
  relationship_id: z.union([z.lazy(() => UuidNullableFilterObjectSchema), z.string()]).optional().nullable(),
  title: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  type: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  date: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.union([z.date(), z.string().datetime()])]).optional(),
  owner_id: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  link: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  hypothesis: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  summary: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  impact_on_confidence: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  created_at: z.union([z.lazy(() => DateTimeNullableFilterObjectSchema), z.union([z.date(), z.string().datetime()])]).optional().nullable(),
  updated_at: z.union([z.lazy(() => DateTimeNullableFilterObjectSchema), z.union([z.date(), z.string().datetime()])]).optional().nullable(),
  created_by: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  card_id: z.union([z.lazy(() => UuidNullableFilterObjectSchema), z.string()]).optional().nullable(),
  project_id: z.union([z.lazy(() => UuidNullableFilterObjectSchema), z.string()]).optional().nullable(),
  content: z.lazy(() => JsonNullableFilterObjectSchema).optional(),
  is_public: z.union([z.lazy(() => BoolFilterObjectSchema), z.boolean()]).optional()
}).strict();
