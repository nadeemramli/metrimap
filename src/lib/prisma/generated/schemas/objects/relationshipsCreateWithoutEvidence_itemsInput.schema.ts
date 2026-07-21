// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { NullableJsonNullValueInputSchema } from '../enums/NullableJsonNullValueInput.schema';
import { relationship_historyCreateNestedManyWithoutRelationshipsInputObjectSchema } from './relationship_historyCreateNestedManyWithoutRelationshipsInput.schema';
import { relationship_tagsCreateNestedManyWithoutRelationshipsInputObjectSchema } from './relationship_tagsCreateNestedManyWithoutRelationshipsInput.schema';
import { usersCreateNestedOneWithoutRelationshipsInputObjectSchema } from './usersCreateNestedOneWithoutRelationshipsInput.schema';
import { projectsCreateNestedOneWithoutRelationshipsInputObjectSchema } from './projectsCreateNestedOneWithoutRelationshipsInput.schema';
import { metric_cardsCreateNestedOneWithoutRelationships_relationships_source_idTometric_cardsInputObjectSchema } from './metric_cardsCreateNestedOneWithoutRelationships_relationships_source_idTometric_cardsInput.schema';
import { metric_cardsCreateNestedOneWithoutRelationships_relationships_target_idTometric_cardsInputObjectSchema } from './metric_cardsCreateNestedOneWithoutRelationships_relationships_target_idTometric_cardsInput.schema'


const literalSchema = z.union([z.string(), z.number(), z.boolean()]);
const jsonSchema = z.lazy(() =>
  z.union([literalSchema, z.array(jsonSchema.nullable()), z.record(z.string(), jsonSchema.nullable())])
);

export const relationshipsCreateWithoutEvidence_itemsInputObjectSchema: z.ZodType<Prisma.relationshipsCreateWithoutEvidence_itemsInput, Prisma.relationshipsCreateWithoutEvidence_itemsInput> = z.object({
  id: z.string().optional(),
  type: z.string(),
  confidence: z.string().optional(),
  weight: z.number().optional().nullable(),
  created_at: z.union([z.date(), z.string().datetime()]).optional().nullable(),
  updated_at: z.union([z.date(), z.string().datetime()]).optional().nullable(),
  causal_metadata: z.union([NullableJsonNullValueInputSchema, jsonSchema]).optional(),
  description: z.string().optional().nullable(),
  source_handle: z.string().optional().nullable(),
  target_handle: z.string().optional().nullable(),
  relationship_history: z.lazy(() => relationship_historyCreateNestedManyWithoutRelationshipsInputObjectSchema).optional(),
  relationship_tags: z.lazy(() => relationship_tagsCreateNestedManyWithoutRelationshipsInputObjectSchema).optional(),
  users: z.lazy(() => usersCreateNestedOneWithoutRelationshipsInputObjectSchema),
  projects: z.lazy(() => projectsCreateNestedOneWithoutRelationshipsInputObjectSchema).optional(),
  metric_cards_relationships_source_idTometric_cards: z.lazy(() => metric_cardsCreateNestedOneWithoutRelationships_relationships_source_idTometric_cardsInputObjectSchema).optional(),
  metric_cards_relationships_target_idTometric_cards: z.lazy(() => metric_cardsCreateNestedOneWithoutRelationships_relationships_target_idTometric_cardsInputObjectSchema).optional()
}).strict();
export const relationshipsCreateWithoutEvidence_itemsInputObjectZodSchema = z.object({
  id: z.string().optional(),
  type: z.string(),
  confidence: z.string().optional(),
  weight: z.number().optional().nullable(),
  created_at: z.union([z.date(), z.string().datetime()]).optional().nullable(),
  updated_at: z.union([z.date(), z.string().datetime()]).optional().nullable(),
  causal_metadata: z.union([NullableJsonNullValueInputSchema, jsonSchema]).optional(),
  description: z.string().optional().nullable(),
  source_handle: z.string().optional().nullable(),
  target_handle: z.string().optional().nullable(),
  relationship_history: z.lazy(() => relationship_historyCreateNestedManyWithoutRelationshipsInputObjectSchema).optional(),
  relationship_tags: z.lazy(() => relationship_tagsCreateNestedManyWithoutRelationshipsInputObjectSchema).optional(),
  users: z.lazy(() => usersCreateNestedOneWithoutRelationshipsInputObjectSchema),
  projects: z.lazy(() => projectsCreateNestedOneWithoutRelationshipsInputObjectSchema).optional(),
  metric_cards_relationships_source_idTometric_cards: z.lazy(() => metric_cardsCreateNestedOneWithoutRelationships_relationships_source_idTometric_cardsInputObjectSchema).optional(),
  metric_cards_relationships_target_idTometric_cards: z.lazy(() => metric_cardsCreateNestedOneWithoutRelationships_relationships_target_idTometric_cardsInputObjectSchema).optional()
}).strict();
