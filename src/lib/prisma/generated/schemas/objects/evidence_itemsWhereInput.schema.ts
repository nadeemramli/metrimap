// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { UuidNullableFilterObjectSchema } from './UuidNullableFilter.schema';
import { StringFilterObjectSchema } from './StringFilter.schema';
import { DateTimeFilterObjectSchema } from './DateTimeFilter.schema';
import { StringNullableFilterObjectSchema } from './StringNullableFilter.schema';
import { DateTimeNullableFilterObjectSchema } from './DateTimeNullableFilter.schema';
import { JsonNullableFilterObjectSchema } from './JsonNullableFilter.schema';
import { BoolFilterObjectSchema } from './BoolFilter.schema';
import { Metric_cardsNullableScalarRelationFilterObjectSchema } from './Metric_cardsNullableScalarRelationFilter.schema';
import { metric_cardsWhereInputObjectSchema } from './metric_cardsWhereInput.schema';
import { UsersScalarRelationFilterObjectSchema } from './UsersScalarRelationFilter.schema';
import { usersWhereInputObjectSchema } from './usersWhereInput.schema';
import { UsersNullableScalarRelationFilterObjectSchema } from './UsersNullableScalarRelationFilter.schema';
import { ProjectsNullableScalarRelationFilterObjectSchema } from './ProjectsNullableScalarRelationFilter.schema';
import { projectsWhereInputObjectSchema } from './projectsWhereInput.schema';
import { RelationshipsNullableScalarRelationFilterObjectSchema } from './RelationshipsNullableScalarRelationFilter.schema';
import { relationshipsWhereInputObjectSchema } from './relationshipsWhereInput.schema'

export const evidence_itemsWhereInputObjectSchema: z.ZodType<Prisma.evidence_itemsWhereInput, Prisma.evidence_itemsWhereInput> = z.object({
  AND: z.union([z.lazy(() => evidence_itemsWhereInputObjectSchema), z.lazy(() => evidence_itemsWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => evidence_itemsWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => evidence_itemsWhereInputObjectSchema), z.lazy(() => evidence_itemsWhereInputObjectSchema).array()]).optional(),
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
  is_public: z.union([z.lazy(() => BoolFilterObjectSchema), z.boolean()]).optional(),
  metric_cards: z.union([z.lazy(() => Metric_cardsNullableScalarRelationFilterObjectSchema), z.lazy(() => metric_cardsWhereInputObjectSchema)]).optional().nullable(),
  users_evidence_items_created_byTousers: z.union([z.lazy(() => UsersScalarRelationFilterObjectSchema), z.lazy(() => usersWhereInputObjectSchema)]).optional(),
  users_evidence_items_owner_idTousers: z.union([z.lazy(() => UsersNullableScalarRelationFilterObjectSchema), z.lazy(() => usersWhereInputObjectSchema)]).optional().nullable(),
  projects: z.union([z.lazy(() => ProjectsNullableScalarRelationFilterObjectSchema), z.lazy(() => projectsWhereInputObjectSchema)]).optional().nullable(),
  relationships: z.union([z.lazy(() => RelationshipsNullableScalarRelationFilterObjectSchema), z.lazy(() => relationshipsWhereInputObjectSchema)]).optional().nullable()
}).strict();
export const evidence_itemsWhereInputObjectZodSchema = z.object({
  AND: z.union([z.lazy(() => evidence_itemsWhereInputObjectSchema), z.lazy(() => evidence_itemsWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => evidence_itemsWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => evidence_itemsWhereInputObjectSchema), z.lazy(() => evidence_itemsWhereInputObjectSchema).array()]).optional(),
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
  is_public: z.union([z.lazy(() => BoolFilterObjectSchema), z.boolean()]).optional(),
  metric_cards: z.union([z.lazy(() => Metric_cardsNullableScalarRelationFilterObjectSchema), z.lazy(() => metric_cardsWhereInputObjectSchema)]).optional().nullable(),
  users_evidence_items_created_byTousers: z.union([z.lazy(() => UsersScalarRelationFilterObjectSchema), z.lazy(() => usersWhereInputObjectSchema)]).optional(),
  users_evidence_items_owner_idTousers: z.union([z.lazy(() => UsersNullableScalarRelationFilterObjectSchema), z.lazy(() => usersWhereInputObjectSchema)]).optional().nullable(),
  projects: z.union([z.lazy(() => ProjectsNullableScalarRelationFilterObjectSchema), z.lazy(() => projectsWhereInputObjectSchema)]).optional().nullable(),
  relationships: z.union([z.lazy(() => RelationshipsNullableScalarRelationFilterObjectSchema), z.lazy(() => relationshipsWhereInputObjectSchema)]).optional().nullable()
}).strict();
