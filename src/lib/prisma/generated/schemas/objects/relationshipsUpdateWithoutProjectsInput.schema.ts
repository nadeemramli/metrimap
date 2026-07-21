// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { StringFieldUpdateOperationsInputObjectSchema } from './StringFieldUpdateOperationsInput.schema';
import { NullableFloatFieldUpdateOperationsInputObjectSchema } from './NullableFloatFieldUpdateOperationsInput.schema';
import { NullableDateTimeFieldUpdateOperationsInputObjectSchema } from './NullableDateTimeFieldUpdateOperationsInput.schema';
import { NullableJsonNullValueInputSchema } from '../enums/NullableJsonNullValueInput.schema';
import { NullableStringFieldUpdateOperationsInputObjectSchema } from './NullableStringFieldUpdateOperationsInput.schema';
import { evidence_itemsUpdateManyWithoutRelationshipsNestedInputObjectSchema } from './evidence_itemsUpdateManyWithoutRelationshipsNestedInput.schema';
import { relationship_historyUpdateManyWithoutRelationshipsNestedInputObjectSchema } from './relationship_historyUpdateManyWithoutRelationshipsNestedInput.schema';
import { relationship_tagsUpdateManyWithoutRelationshipsNestedInputObjectSchema } from './relationship_tagsUpdateManyWithoutRelationshipsNestedInput.schema';
import { usersUpdateOneRequiredWithoutRelationshipsNestedInputObjectSchema } from './usersUpdateOneRequiredWithoutRelationshipsNestedInput.schema';
import { metric_cardsUpdateOneWithoutRelationships_relationships_source_idTometric_cardsNestedInputObjectSchema } from './metric_cardsUpdateOneWithoutRelationships_relationships_source_idTometric_cardsNestedInput.schema';
import { metric_cardsUpdateOneWithoutRelationships_relationships_target_idTometric_cardsNestedInputObjectSchema } from './metric_cardsUpdateOneWithoutRelationships_relationships_target_idTometric_cardsNestedInput.schema'


const literalSchema = z.union([z.string(), z.number(), z.boolean()]);
const jsonSchema = z.lazy(() =>
  z.union([literalSchema, z.array(jsonSchema.nullable()), z.record(z.string(), jsonSchema.nullable())])
);

export const relationshipsUpdateWithoutProjectsInputObjectSchema: z.ZodType<Prisma.relationshipsUpdateWithoutProjectsInput, Prisma.relationshipsUpdateWithoutProjectsInput> = z.object({
  type: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  confidence: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  weight: z.union([z.number(), z.lazy(() => NullableFloatFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  created_at: z.union([z.union([z.date(), z.string().datetime()]), z.lazy(() => NullableDateTimeFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  updated_at: z.union([z.union([z.date(), z.string().datetime()]), z.lazy(() => NullableDateTimeFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  causal_metadata: z.union([NullableJsonNullValueInputSchema, jsonSchema]).optional(),
  description: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  source_handle: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  target_handle: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  evidence_items: z.lazy(() => evidence_itemsUpdateManyWithoutRelationshipsNestedInputObjectSchema).optional(),
  relationship_history: z.lazy(() => relationship_historyUpdateManyWithoutRelationshipsNestedInputObjectSchema).optional(),
  relationship_tags: z.lazy(() => relationship_tagsUpdateManyWithoutRelationshipsNestedInputObjectSchema).optional(),
  users: z.lazy(() => usersUpdateOneRequiredWithoutRelationshipsNestedInputObjectSchema).optional(),
  metric_cards_relationships_source_idTometric_cards: z.lazy(() => metric_cardsUpdateOneWithoutRelationships_relationships_source_idTometric_cardsNestedInputObjectSchema).optional(),
  metric_cards_relationships_target_idTometric_cards: z.lazy(() => metric_cardsUpdateOneWithoutRelationships_relationships_target_idTometric_cardsNestedInputObjectSchema).optional()
}).strict();
export const relationshipsUpdateWithoutProjectsInputObjectZodSchema = z.object({
  type: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  confidence: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  weight: z.union([z.number(), z.lazy(() => NullableFloatFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  created_at: z.union([z.union([z.date(), z.string().datetime()]), z.lazy(() => NullableDateTimeFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  updated_at: z.union([z.union([z.date(), z.string().datetime()]), z.lazy(() => NullableDateTimeFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  causal_metadata: z.union([NullableJsonNullValueInputSchema, jsonSchema]).optional(),
  description: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  source_handle: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  target_handle: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  evidence_items: z.lazy(() => evidence_itemsUpdateManyWithoutRelationshipsNestedInputObjectSchema).optional(),
  relationship_history: z.lazy(() => relationship_historyUpdateManyWithoutRelationshipsNestedInputObjectSchema).optional(),
  relationship_tags: z.lazy(() => relationship_tagsUpdateManyWithoutRelationshipsNestedInputObjectSchema).optional(),
  users: z.lazy(() => usersUpdateOneRequiredWithoutRelationshipsNestedInputObjectSchema).optional(),
  metric_cards_relationships_source_idTometric_cards: z.lazy(() => metric_cardsUpdateOneWithoutRelationships_relationships_source_idTometric_cardsNestedInputObjectSchema).optional(),
  metric_cards_relationships_target_idTometric_cards: z.lazy(() => metric_cardsUpdateOneWithoutRelationships_relationships_target_idTometric_cardsNestedInputObjectSchema).optional()
}).strict();
