// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { UuidNullableFilterObjectSchema } from './UuidNullableFilter.schema';
import { StringFilterObjectSchema } from './StringFilter.schema';
import { FloatNullableFilterObjectSchema } from './FloatNullableFilter.schema';
import { DateTimeNullableFilterObjectSchema } from './DateTimeNullableFilter.schema';
import { JsonNullableFilterObjectSchema } from './JsonNullableFilter.schema';
import { StringNullableFilterObjectSchema } from './StringNullableFilter.schema';
import { Evidence_itemsListRelationFilterObjectSchema } from './Evidence_itemsListRelationFilter.schema';
import { Relationship_historyListRelationFilterObjectSchema } from './Relationship_historyListRelationFilter.schema';
import { Relationship_tagsListRelationFilterObjectSchema } from './Relationship_tagsListRelationFilter.schema';
import { UsersScalarRelationFilterObjectSchema } from './UsersScalarRelationFilter.schema';
import { usersWhereInputObjectSchema } from './usersWhereInput.schema';
import { ProjectsNullableScalarRelationFilterObjectSchema } from './ProjectsNullableScalarRelationFilter.schema';
import { projectsWhereInputObjectSchema } from './projectsWhereInput.schema';
import { Metric_cardsNullableScalarRelationFilterObjectSchema } from './Metric_cardsNullableScalarRelationFilter.schema';
import { metric_cardsWhereInputObjectSchema } from './metric_cardsWhereInput.schema'

export const relationshipsWhereInputObjectSchema: z.ZodType<Prisma.relationshipsWhereInput, Prisma.relationshipsWhereInput> = z.object({
  AND: z.union([z.lazy(() => relationshipsWhereInputObjectSchema), z.lazy(() => relationshipsWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => relationshipsWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => relationshipsWhereInputObjectSchema), z.lazy(() => relationshipsWhereInputObjectSchema).array()]).optional(),
  project_id: z.union([z.lazy(() => UuidNullableFilterObjectSchema), z.string()]).optional().nullable(),
  source_id: z.union([z.lazy(() => UuidNullableFilterObjectSchema), z.string()]).optional().nullable(),
  target_id: z.union([z.lazy(() => UuidNullableFilterObjectSchema), z.string()]).optional().nullable(),
  type: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  confidence: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  weight: z.union([z.lazy(() => FloatNullableFilterObjectSchema), z.number()]).optional().nullable(),
  created_at: z.union([z.lazy(() => DateTimeNullableFilterObjectSchema), z.union([z.date(), z.string().datetime()])]).optional().nullable(),
  updated_at: z.union([z.lazy(() => DateTimeNullableFilterObjectSchema), z.union([z.date(), z.string().datetime()])]).optional().nullable(),
  created_by: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  causal_metadata: z.lazy(() => JsonNullableFilterObjectSchema).optional(),
  description: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  source_handle: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  target_handle: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  evidence_items: z.lazy(() => Evidence_itemsListRelationFilterObjectSchema).optional(),
  relationship_history: z.lazy(() => Relationship_historyListRelationFilterObjectSchema).optional(),
  relationship_tags: z.lazy(() => Relationship_tagsListRelationFilterObjectSchema).optional(),
  users: z.union([z.lazy(() => UsersScalarRelationFilterObjectSchema), z.lazy(() => usersWhereInputObjectSchema)]).optional(),
  projects: z.union([z.lazy(() => ProjectsNullableScalarRelationFilterObjectSchema), z.lazy(() => projectsWhereInputObjectSchema)]).optional().nullable(),
  metric_cards_relationships_source_idTometric_cards: z.union([z.lazy(() => Metric_cardsNullableScalarRelationFilterObjectSchema), z.lazy(() => metric_cardsWhereInputObjectSchema)]).optional().nullable(),
  metric_cards_relationships_target_idTometric_cards: z.union([z.lazy(() => Metric_cardsNullableScalarRelationFilterObjectSchema), z.lazy(() => metric_cardsWhereInputObjectSchema)]).optional().nullable()
}).strict();
export const relationshipsWhereInputObjectZodSchema = z.object({
  AND: z.union([z.lazy(() => relationshipsWhereInputObjectSchema), z.lazy(() => relationshipsWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => relationshipsWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => relationshipsWhereInputObjectSchema), z.lazy(() => relationshipsWhereInputObjectSchema).array()]).optional(),
  project_id: z.union([z.lazy(() => UuidNullableFilterObjectSchema), z.string()]).optional().nullable(),
  source_id: z.union([z.lazy(() => UuidNullableFilterObjectSchema), z.string()]).optional().nullable(),
  target_id: z.union([z.lazy(() => UuidNullableFilterObjectSchema), z.string()]).optional().nullable(),
  type: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  confidence: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  weight: z.union([z.lazy(() => FloatNullableFilterObjectSchema), z.number()]).optional().nullable(),
  created_at: z.union([z.lazy(() => DateTimeNullableFilterObjectSchema), z.union([z.date(), z.string().datetime()])]).optional().nullable(),
  updated_at: z.union([z.lazy(() => DateTimeNullableFilterObjectSchema), z.union([z.date(), z.string().datetime()])]).optional().nullable(),
  created_by: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  causal_metadata: z.lazy(() => JsonNullableFilterObjectSchema).optional(),
  description: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  source_handle: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  target_handle: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  evidence_items: z.lazy(() => Evidence_itemsListRelationFilterObjectSchema).optional(),
  relationship_history: z.lazy(() => Relationship_historyListRelationFilterObjectSchema).optional(),
  relationship_tags: z.lazy(() => Relationship_tagsListRelationFilterObjectSchema).optional(),
  users: z.union([z.lazy(() => UsersScalarRelationFilterObjectSchema), z.lazy(() => usersWhereInputObjectSchema)]).optional(),
  projects: z.union([z.lazy(() => ProjectsNullableScalarRelationFilterObjectSchema), z.lazy(() => projectsWhereInputObjectSchema)]).optional().nullable(),
  metric_cards_relationships_source_idTometric_cards: z.union([z.lazy(() => Metric_cardsNullableScalarRelationFilterObjectSchema), z.lazy(() => metric_cardsWhereInputObjectSchema)]).optional().nullable(),
  metric_cards_relationships_target_idTometric_cards: z.union([z.lazy(() => Metric_cardsNullableScalarRelationFilterObjectSchema), z.lazy(() => metric_cardsWhereInputObjectSchema)]).optional().nullable()
}).strict();
