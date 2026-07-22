// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { StringFieldUpdateOperationsInputObjectSchema } from './StringFieldUpdateOperationsInput.schema';
import { NullableStringFieldUpdateOperationsInputObjectSchema } from './NullableStringFieldUpdateOperationsInput.schema';
import { FloatFieldUpdateOperationsInputObjectSchema } from './FloatFieldUpdateOperationsInput.schema';
import { NullableJsonNullValueInputSchema } from '../enums/NullableJsonNullValueInput.schema';
import { metric_cardsUpdatecausal_factorsInputObjectSchema } from './metric_cardsUpdatecausal_factorsInput.schema';
import { metric_cardsUpdatedimensionsInputObjectSchema } from './metric_cardsUpdatedimensionsInput.schema';
import { metric_cardsUpdateassigneesInputObjectSchema } from './metric_cardsUpdateassigneesInput.schema';
import { NullableDateTimeFieldUpdateOperationsInputObjectSchema } from './NullableDateTimeFieldUpdateOperationsInput.schema';
import { JsonNullValueInputSchema } from '../enums/JsonNullValueInput.schema';
import { NullableIntFieldUpdateOperationsInputObjectSchema } from './NullableIntFieldUpdateOperationsInput.schema';
import { alert_rulesUncheckedUpdateManyWithoutMetric_cardsNestedInputObjectSchema } from './alert_rulesUncheckedUpdateManyWithoutMetric_cardsNestedInput.schema';
import { evidence_itemsUncheckedUpdateManyWithoutMetric_cardsNestedInputObjectSchema } from './evidence_itemsUncheckedUpdateManyWithoutMetric_cardsNestedInput.schema';
import { metric_card_tagsUncheckedUpdateManyWithoutMetric_cardsNestedInputObjectSchema } from './metric_card_tagsUncheckedUpdateManyWithoutMetric_cardsNestedInput.schema';
import { node_access_grantsUncheckedUpdateManyWithoutMetric_cardsNestedInputObjectSchema } from './node_access_grantsUncheckedUpdateManyWithoutMetric_cardsNestedInput.schema';
import { relationshipsUncheckedUpdateManyWithoutMetric_cards_relationships_source_idTometric_cardsNestedInputObjectSchema } from './relationshipsUncheckedUpdateManyWithoutMetric_cards_relationships_source_idTometric_cardsNestedInput.schema';
import { relationshipsUncheckedUpdateManyWithoutMetric_cards_relationships_target_idTometric_cardsNestedInputObjectSchema } from './relationshipsUncheckedUpdateManyWithoutMetric_cards_relationships_target_idTometric_cardsNestedInput.schema';
import { strategy_metric_linksUncheckedUpdateManyWithoutMetric_cardsNestedInputObjectSchema } from './strategy_metric_linksUncheckedUpdateManyWithoutMetric_cardsNestedInput.schema'


const literalSchema = z.union([z.string(), z.number(), z.boolean()]);
const jsonSchema = z.lazy(() =>
  z.union([literalSchema, z.array(jsonSchema.nullable()), z.record(z.string(), jsonSchema.nullable())])
);

export const metric_cardsUncheckedUpdateWithoutStrategy_impact_contractsInputObjectSchema: z.ZodType<Prisma.metric_cardsUncheckedUpdateWithoutStrategy_impact_contractsInput, Prisma.metric_cardsUncheckedUpdateWithoutStrategy_impact_contractsInput> = z.object({
  id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  project_id: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  title: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  description: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  category: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  sub_category: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  position_x: z.union([z.number(), z.lazy(() => FloatFieldUpdateOperationsInputObjectSchema)]).optional(),
  position_y: z.union([z.number(), z.lazy(() => FloatFieldUpdateOperationsInputObjectSchema)]).optional(),
  data: z.union([NullableJsonNullValueInputSchema, jsonSchema]).optional(),
  source_type: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  formula: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  causal_factors: z.union([z.lazy(() => metric_cardsUpdatecausal_factorsInputObjectSchema), z.string().array()]).optional(),
  dimensions: z.union([z.lazy(() => metric_cardsUpdatedimensionsInputObjectSchema), z.string().array()]).optional(),
  owner_id: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  assignees: z.union([z.lazy(() => metric_cardsUpdateassigneesInputObjectSchema), z.string().array()]).optional(),
  created_at: z.union([z.union([z.date(), z.string().datetime()]), z.lazy(() => NullableDateTimeFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  updated_at: z.union([z.union([z.date(), z.string().datetime()]), z.lazy(() => NullableDateTimeFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  created_by: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  tracked_metric_id: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  updated_by: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  status: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  workflow: z.union([JsonNullValueInputSchema, jsonSchema]).optional(),
  z_index: z.union([z.number().int(), z.lazy(() => NullableIntFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  alert_rules: z.lazy(() => alert_rulesUncheckedUpdateManyWithoutMetric_cardsNestedInputObjectSchema).optional(),
  evidence_items: z.lazy(() => evidence_itemsUncheckedUpdateManyWithoutMetric_cardsNestedInputObjectSchema).optional(),
  metric_card_tags: z.lazy(() => metric_card_tagsUncheckedUpdateManyWithoutMetric_cardsNestedInputObjectSchema).optional(),
  node_access_grants: z.lazy(() => node_access_grantsUncheckedUpdateManyWithoutMetric_cardsNestedInputObjectSchema).optional(),
  relationships_relationships_source_idTometric_cards: z.lazy(() => relationshipsUncheckedUpdateManyWithoutMetric_cards_relationships_source_idTometric_cardsNestedInputObjectSchema).optional(),
  relationships_relationships_target_idTometric_cards: z.lazy(() => relationshipsUncheckedUpdateManyWithoutMetric_cards_relationships_target_idTometric_cardsNestedInputObjectSchema).optional(),
  strategy_metric_links: z.lazy(() => strategy_metric_linksUncheckedUpdateManyWithoutMetric_cardsNestedInputObjectSchema).optional()
}).strict();
export const metric_cardsUncheckedUpdateWithoutStrategy_impact_contractsInputObjectZodSchema = z.object({
  id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  project_id: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  title: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  description: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  category: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  sub_category: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  position_x: z.union([z.number(), z.lazy(() => FloatFieldUpdateOperationsInputObjectSchema)]).optional(),
  position_y: z.union([z.number(), z.lazy(() => FloatFieldUpdateOperationsInputObjectSchema)]).optional(),
  data: z.union([NullableJsonNullValueInputSchema, jsonSchema]).optional(),
  source_type: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  formula: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  causal_factors: z.union([z.lazy(() => metric_cardsUpdatecausal_factorsInputObjectSchema), z.string().array()]).optional(),
  dimensions: z.union([z.lazy(() => metric_cardsUpdatedimensionsInputObjectSchema), z.string().array()]).optional(),
  owner_id: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  assignees: z.union([z.lazy(() => metric_cardsUpdateassigneesInputObjectSchema), z.string().array()]).optional(),
  created_at: z.union([z.union([z.date(), z.string().datetime()]), z.lazy(() => NullableDateTimeFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  updated_at: z.union([z.union([z.date(), z.string().datetime()]), z.lazy(() => NullableDateTimeFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  created_by: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  tracked_metric_id: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  updated_by: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  status: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  workflow: z.union([JsonNullValueInputSchema, jsonSchema]).optional(),
  z_index: z.union([z.number().int(), z.lazy(() => NullableIntFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  alert_rules: z.lazy(() => alert_rulesUncheckedUpdateManyWithoutMetric_cardsNestedInputObjectSchema).optional(),
  evidence_items: z.lazy(() => evidence_itemsUncheckedUpdateManyWithoutMetric_cardsNestedInputObjectSchema).optional(),
  metric_card_tags: z.lazy(() => metric_card_tagsUncheckedUpdateManyWithoutMetric_cardsNestedInputObjectSchema).optional(),
  node_access_grants: z.lazy(() => node_access_grantsUncheckedUpdateManyWithoutMetric_cardsNestedInputObjectSchema).optional(),
  relationships_relationships_source_idTometric_cards: z.lazy(() => relationshipsUncheckedUpdateManyWithoutMetric_cards_relationships_source_idTometric_cardsNestedInputObjectSchema).optional(),
  relationships_relationships_target_idTometric_cards: z.lazy(() => relationshipsUncheckedUpdateManyWithoutMetric_cards_relationships_target_idTometric_cardsNestedInputObjectSchema).optional(),
  strategy_metric_links: z.lazy(() => strategy_metric_linksUncheckedUpdateManyWithoutMetric_cardsNestedInputObjectSchema).optional()
}).strict();
