// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { NullableJsonNullValueInputSchema } from '../enums/NullableJsonNullValueInput.schema';
import { metric_cardsCreatecausal_factorsInputObjectSchema } from './metric_cardsCreatecausal_factorsInput.schema';
import { metric_cardsCreatedimensionsInputObjectSchema } from './metric_cardsCreatedimensionsInput.schema';
import { metric_cardsCreateassigneesInputObjectSchema } from './metric_cardsCreateassigneesInput.schema';
import { JsonNullValueInputSchema } from '../enums/JsonNullValueInput.schema';
import { alert_rulesUncheckedCreateNestedManyWithoutMetric_cardsInputObjectSchema } from './alert_rulesUncheckedCreateNestedManyWithoutMetric_cardsInput.schema';
import { evidence_itemsUncheckedCreateNestedManyWithoutMetric_cardsInputObjectSchema } from './evidence_itemsUncheckedCreateNestedManyWithoutMetric_cardsInput.schema';
import { metric_card_tagsUncheckedCreateNestedManyWithoutMetric_cardsInputObjectSchema } from './metric_card_tagsUncheckedCreateNestedManyWithoutMetric_cardsInput.schema';
import { relationshipsUncheckedCreateNestedManyWithoutMetric_cards_relationships_source_idTometric_cardsInputObjectSchema } from './relationshipsUncheckedCreateNestedManyWithoutMetric_cards_relationships_source_idTometric_cardsInput.schema';
import { relationshipsUncheckedCreateNestedManyWithoutMetric_cards_relationships_target_idTometric_cardsInputObjectSchema } from './relationshipsUncheckedCreateNestedManyWithoutMetric_cards_relationships_target_idTometric_cardsInput.schema';
import { strategy_impact_contractsUncheckedCreateNestedOneWithoutMetric_cardsInputObjectSchema } from './strategy_impact_contractsUncheckedCreateNestedOneWithoutMetric_cardsInput.schema';
import { strategy_metric_linksUncheckedCreateNestedManyWithoutMetric_cardsInputObjectSchema } from './strategy_metric_linksUncheckedCreateNestedManyWithoutMetric_cardsInput.schema'


const literalSchema = z.union([z.string(), z.number(), z.boolean()]);
const jsonSchema = z.lazy(() =>
  z.union([literalSchema, z.array(jsonSchema.nullable()), z.record(z.string(), jsonSchema.nullable())])
);

export const metric_cardsUncheckedCreateWithoutNode_access_grantsInputObjectSchema: z.ZodType<Prisma.metric_cardsUncheckedCreateWithoutNode_access_grantsInput, Prisma.metric_cardsUncheckedCreateWithoutNode_access_grantsInput> = z.object({
  id: z.string().optional(),
  project_id: z.string().optional().nullable(),
  title: z.string(),
  description: z.string().optional().nullable(),
  category: z.string(),
  sub_category: z.string().optional().nullable(),
  position_x: z.number().optional(),
  position_y: z.number().optional(),
  data: z.union([NullableJsonNullValueInputSchema, jsonSchema]).optional(),
  source_type: z.string().optional().nullable(),
  formula: z.string().optional().nullable(),
  causal_factors: z.union([z.lazy(() => metric_cardsCreatecausal_factorsInputObjectSchema), z.string().array()]).optional(),
  dimensions: z.union([z.lazy(() => metric_cardsCreatedimensionsInputObjectSchema), z.string().array()]).optional(),
  owner_id: z.string().optional().nullable(),
  assignees: z.union([z.lazy(() => metric_cardsCreateassigneesInputObjectSchema), z.string().array()]).optional(),
  created_at: z.union([z.date(), z.string().datetime()]).optional().nullable(),
  updated_at: z.union([z.date(), z.string().datetime()]).optional().nullable(),
  created_by: z.string(),
  tracked_metric_id: z.string().optional().nullable(),
  updated_by: z.string().optional().nullable(),
  status: z.string().optional().nullable(),
  workflow: z.union([JsonNullValueInputSchema, jsonSchema]).optional(),
  z_index: z.number().int().optional().nullable(),
  alert_rules: z.lazy(() => alert_rulesUncheckedCreateNestedManyWithoutMetric_cardsInputObjectSchema).optional(),
  evidence_items: z.lazy(() => evidence_itemsUncheckedCreateNestedManyWithoutMetric_cardsInputObjectSchema).optional(),
  metric_card_tags: z.lazy(() => metric_card_tagsUncheckedCreateNestedManyWithoutMetric_cardsInputObjectSchema).optional(),
  relationships_relationships_source_idTometric_cards: z.lazy(() => relationshipsUncheckedCreateNestedManyWithoutMetric_cards_relationships_source_idTometric_cardsInputObjectSchema).optional(),
  relationships_relationships_target_idTometric_cards: z.lazy(() => relationshipsUncheckedCreateNestedManyWithoutMetric_cards_relationships_target_idTometric_cardsInputObjectSchema).optional(),
  strategy_impact_contracts: z.lazy(() => strategy_impact_contractsUncheckedCreateNestedOneWithoutMetric_cardsInputObjectSchema).optional(),
  strategy_metric_links: z.lazy(() => strategy_metric_linksUncheckedCreateNestedManyWithoutMetric_cardsInputObjectSchema).optional()
}).strict();
export const metric_cardsUncheckedCreateWithoutNode_access_grantsInputObjectZodSchema = z.object({
  id: z.string().optional(),
  project_id: z.string().optional().nullable(),
  title: z.string(),
  description: z.string().optional().nullable(),
  category: z.string(),
  sub_category: z.string().optional().nullable(),
  position_x: z.number().optional(),
  position_y: z.number().optional(),
  data: z.union([NullableJsonNullValueInputSchema, jsonSchema]).optional(),
  source_type: z.string().optional().nullable(),
  formula: z.string().optional().nullable(),
  causal_factors: z.union([z.lazy(() => metric_cardsCreatecausal_factorsInputObjectSchema), z.string().array()]).optional(),
  dimensions: z.union([z.lazy(() => metric_cardsCreatedimensionsInputObjectSchema), z.string().array()]).optional(),
  owner_id: z.string().optional().nullable(),
  assignees: z.union([z.lazy(() => metric_cardsCreateassigneesInputObjectSchema), z.string().array()]).optional(),
  created_at: z.union([z.date(), z.string().datetime()]).optional().nullable(),
  updated_at: z.union([z.date(), z.string().datetime()]).optional().nullable(),
  created_by: z.string(),
  tracked_metric_id: z.string().optional().nullable(),
  updated_by: z.string().optional().nullable(),
  status: z.string().optional().nullable(),
  workflow: z.union([JsonNullValueInputSchema, jsonSchema]).optional(),
  z_index: z.number().int().optional().nullable(),
  alert_rules: z.lazy(() => alert_rulesUncheckedCreateNestedManyWithoutMetric_cardsInputObjectSchema).optional(),
  evidence_items: z.lazy(() => evidence_itemsUncheckedCreateNestedManyWithoutMetric_cardsInputObjectSchema).optional(),
  metric_card_tags: z.lazy(() => metric_card_tagsUncheckedCreateNestedManyWithoutMetric_cardsInputObjectSchema).optional(),
  relationships_relationships_source_idTometric_cards: z.lazy(() => relationshipsUncheckedCreateNestedManyWithoutMetric_cards_relationships_source_idTometric_cardsInputObjectSchema).optional(),
  relationships_relationships_target_idTometric_cards: z.lazy(() => relationshipsUncheckedCreateNestedManyWithoutMetric_cards_relationships_target_idTometric_cardsInputObjectSchema).optional(),
  strategy_impact_contracts: z.lazy(() => strategy_impact_contractsUncheckedCreateNestedOneWithoutMetric_cardsInputObjectSchema).optional(),
  strategy_metric_links: z.lazy(() => strategy_metric_linksUncheckedCreateNestedManyWithoutMetric_cardsInputObjectSchema).optional()
}).strict();
