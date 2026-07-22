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
import { alert_rulesUpdateManyWithoutMetric_cardsNestedInputObjectSchema } from './alert_rulesUpdateManyWithoutMetric_cardsNestedInput.schema';
import { evidence_itemsUpdateManyWithoutMetric_cardsNestedInputObjectSchema } from './evidence_itemsUpdateManyWithoutMetric_cardsNestedInput.schema';
import { metric_card_tagsUpdateManyWithoutMetric_cardsNestedInputObjectSchema } from './metric_card_tagsUpdateManyWithoutMetric_cardsNestedInput.schema';
import { usersUpdateOneWithoutMetric_cards_metric_cards_owner_idTousersNestedInputObjectSchema } from './usersUpdateOneWithoutMetric_cards_metric_cards_owner_idTousersNestedInput.schema';
import { projectsUpdateOneWithoutMetric_cardsNestedInputObjectSchema } from './projectsUpdateOneWithoutMetric_cardsNestedInput.schema';
import { tracked_metricsUpdateOneWithoutMetric_cardsNestedInputObjectSchema } from './tracked_metricsUpdateOneWithoutMetric_cardsNestedInput.schema';
import { node_access_grantsUpdateManyWithoutMetric_cardsNestedInputObjectSchema } from './node_access_grantsUpdateManyWithoutMetric_cardsNestedInput.schema';
import { relationshipsUpdateManyWithoutMetric_cards_relationships_source_idTometric_cardsNestedInputObjectSchema } from './relationshipsUpdateManyWithoutMetric_cards_relationships_source_idTometric_cardsNestedInput.schema';
import { relationshipsUpdateManyWithoutMetric_cards_relationships_target_idTometric_cardsNestedInputObjectSchema } from './relationshipsUpdateManyWithoutMetric_cards_relationships_target_idTometric_cardsNestedInput.schema';
import { strategy_impact_contractsUpdateOneWithoutMetric_cardsNestedInputObjectSchema } from './strategy_impact_contractsUpdateOneWithoutMetric_cardsNestedInput.schema';
import { strategy_metric_linksUpdateManyWithoutMetric_cardsNestedInputObjectSchema } from './strategy_metric_linksUpdateManyWithoutMetric_cardsNestedInput.schema'


const literalSchema = z.union([z.string(), z.number(), z.boolean()]);
const jsonSchema = z.lazy(() =>
  z.union([literalSchema, z.array(jsonSchema.nullable()), z.record(z.string(), jsonSchema.nullable())])
);

export const metric_cardsUpdateWithoutUsers_metric_cards_created_byTousersInputObjectSchema: z.ZodType<Prisma.metric_cardsUpdateWithoutUsers_metric_cards_created_byTousersInput, Prisma.metric_cardsUpdateWithoutUsers_metric_cards_created_byTousersInput> = z.object({
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
  assignees: z.union([z.lazy(() => metric_cardsUpdateassigneesInputObjectSchema), z.string().array()]).optional(),
  created_at: z.union([z.union([z.date(), z.string().datetime()]), z.lazy(() => NullableDateTimeFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  updated_at: z.union([z.union([z.date(), z.string().datetime()]), z.lazy(() => NullableDateTimeFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  updated_by: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  status: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  workflow: z.union([JsonNullValueInputSchema, jsonSchema]).optional(),
  z_index: z.union([z.number().int(), z.lazy(() => NullableIntFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  alert_rules: z.lazy(() => alert_rulesUpdateManyWithoutMetric_cardsNestedInputObjectSchema).optional(),
  evidence_items: z.lazy(() => evidence_itemsUpdateManyWithoutMetric_cardsNestedInputObjectSchema).optional(),
  metric_card_tags: z.lazy(() => metric_card_tagsUpdateManyWithoutMetric_cardsNestedInputObjectSchema).optional(),
  users_metric_cards_owner_idTousers: z.lazy(() => usersUpdateOneWithoutMetric_cards_metric_cards_owner_idTousersNestedInputObjectSchema).optional(),
  projects: z.lazy(() => projectsUpdateOneWithoutMetric_cardsNestedInputObjectSchema).optional(),
  tracked_metrics: z.lazy(() => tracked_metricsUpdateOneWithoutMetric_cardsNestedInputObjectSchema).optional(),
  node_access_grants: z.lazy(() => node_access_grantsUpdateManyWithoutMetric_cardsNestedInputObjectSchema).optional(),
  relationships_relationships_source_idTometric_cards: z.lazy(() => relationshipsUpdateManyWithoutMetric_cards_relationships_source_idTometric_cardsNestedInputObjectSchema).optional(),
  relationships_relationships_target_idTometric_cards: z.lazy(() => relationshipsUpdateManyWithoutMetric_cards_relationships_target_idTometric_cardsNestedInputObjectSchema).optional(),
  strategy_impact_contracts: z.lazy(() => strategy_impact_contractsUpdateOneWithoutMetric_cardsNestedInputObjectSchema).optional(),
  strategy_metric_links: z.lazy(() => strategy_metric_linksUpdateManyWithoutMetric_cardsNestedInputObjectSchema).optional()
}).strict();
export const metric_cardsUpdateWithoutUsers_metric_cards_created_byTousersInputObjectZodSchema = z.object({
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
  assignees: z.union([z.lazy(() => metric_cardsUpdateassigneesInputObjectSchema), z.string().array()]).optional(),
  created_at: z.union([z.union([z.date(), z.string().datetime()]), z.lazy(() => NullableDateTimeFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  updated_at: z.union([z.union([z.date(), z.string().datetime()]), z.lazy(() => NullableDateTimeFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  updated_by: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  status: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  workflow: z.union([JsonNullValueInputSchema, jsonSchema]).optional(),
  z_index: z.union([z.number().int(), z.lazy(() => NullableIntFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  alert_rules: z.lazy(() => alert_rulesUpdateManyWithoutMetric_cardsNestedInputObjectSchema).optional(),
  evidence_items: z.lazy(() => evidence_itemsUpdateManyWithoutMetric_cardsNestedInputObjectSchema).optional(),
  metric_card_tags: z.lazy(() => metric_card_tagsUpdateManyWithoutMetric_cardsNestedInputObjectSchema).optional(),
  users_metric_cards_owner_idTousers: z.lazy(() => usersUpdateOneWithoutMetric_cards_metric_cards_owner_idTousersNestedInputObjectSchema).optional(),
  projects: z.lazy(() => projectsUpdateOneWithoutMetric_cardsNestedInputObjectSchema).optional(),
  tracked_metrics: z.lazy(() => tracked_metricsUpdateOneWithoutMetric_cardsNestedInputObjectSchema).optional(),
  node_access_grants: z.lazy(() => node_access_grantsUpdateManyWithoutMetric_cardsNestedInputObjectSchema).optional(),
  relationships_relationships_source_idTometric_cards: z.lazy(() => relationshipsUpdateManyWithoutMetric_cards_relationships_source_idTometric_cardsNestedInputObjectSchema).optional(),
  relationships_relationships_target_idTometric_cards: z.lazy(() => relationshipsUpdateManyWithoutMetric_cards_relationships_target_idTometric_cardsNestedInputObjectSchema).optional(),
  strategy_impact_contracts: z.lazy(() => strategy_impact_contractsUpdateOneWithoutMetric_cardsNestedInputObjectSchema).optional(),
  strategy_metric_links: z.lazy(() => strategy_metric_linksUpdateManyWithoutMetric_cardsNestedInputObjectSchema).optional()
}).strict();
