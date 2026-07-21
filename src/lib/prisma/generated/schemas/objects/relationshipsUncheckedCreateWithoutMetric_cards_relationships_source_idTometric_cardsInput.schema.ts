// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { NullableJsonNullValueInputSchema } from '../enums/NullableJsonNullValueInput.schema';
import { evidence_itemsUncheckedCreateNestedManyWithoutRelationshipsInputObjectSchema } from './evidence_itemsUncheckedCreateNestedManyWithoutRelationshipsInput.schema';
import { relationship_historyUncheckedCreateNestedManyWithoutRelationshipsInputObjectSchema } from './relationship_historyUncheckedCreateNestedManyWithoutRelationshipsInput.schema';
import { relationship_tagsUncheckedCreateNestedManyWithoutRelationshipsInputObjectSchema } from './relationship_tagsUncheckedCreateNestedManyWithoutRelationshipsInput.schema'


const literalSchema = z.union([z.string(), z.number(), z.boolean()]);
const jsonSchema = z.lazy(() =>
  z.union([literalSchema, z.array(jsonSchema.nullable()), z.record(z.string(), jsonSchema.nullable())])
);

export const relationshipsUncheckedCreateWithoutMetric_cards_relationships_source_idTometric_cardsInputObjectSchema: z.ZodType<Prisma.relationshipsUncheckedCreateWithoutMetric_cards_relationships_source_idTometric_cardsInput, Prisma.relationshipsUncheckedCreateWithoutMetric_cards_relationships_source_idTometric_cardsInput> = z.object({
  id: z.string().optional(),
  project_id: z.string().optional().nullable(),
  target_id: z.string().optional().nullable(),
  type: z.string(),
  confidence: z.string().optional(),
  weight: z.number().optional().nullable(),
  created_at: z.union([z.date(), z.string().datetime()]).optional().nullable(),
  updated_at: z.union([z.date(), z.string().datetime()]).optional().nullable(),
  created_by: z.string(),
  causal_metadata: z.union([NullableJsonNullValueInputSchema, jsonSchema]).optional(),
  description: z.string().optional().nullable(),
  source_handle: z.string().optional().nullable(),
  target_handle: z.string().optional().nullable(),
  evidence_items: z.lazy(() => evidence_itemsUncheckedCreateNestedManyWithoutRelationshipsInputObjectSchema).optional(),
  relationship_history: z.lazy(() => relationship_historyUncheckedCreateNestedManyWithoutRelationshipsInputObjectSchema).optional(),
  relationship_tags: z.lazy(() => relationship_tagsUncheckedCreateNestedManyWithoutRelationshipsInputObjectSchema).optional()
}).strict();
export const relationshipsUncheckedCreateWithoutMetric_cards_relationships_source_idTometric_cardsInputObjectZodSchema = z.object({
  id: z.string().optional(),
  project_id: z.string().optional().nullable(),
  target_id: z.string().optional().nullable(),
  type: z.string(),
  confidence: z.string().optional(),
  weight: z.number().optional().nullable(),
  created_at: z.union([z.date(), z.string().datetime()]).optional().nullable(),
  updated_at: z.union([z.date(), z.string().datetime()]).optional().nullable(),
  created_by: z.string(),
  causal_metadata: z.union([NullableJsonNullValueInputSchema, jsonSchema]).optional(),
  description: z.string().optional().nullable(),
  source_handle: z.string().optional().nullable(),
  target_handle: z.string().optional().nullable(),
  evidence_items: z.lazy(() => evidence_itemsUncheckedCreateNestedManyWithoutRelationshipsInputObjectSchema).optional(),
  relationship_history: z.lazy(() => relationship_historyUncheckedCreateNestedManyWithoutRelationshipsInputObjectSchema).optional(),
  relationship_tags: z.lazy(() => relationship_tagsUncheckedCreateNestedManyWithoutRelationshipsInputObjectSchema).optional()
}).strict();
