// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { NullableJsonNullValueInputSchema } from '../enums/NullableJsonNullValueInput.schema';
import { metric_cardsCreatecausal_factorsInputObjectSchema } from './metric_cardsCreatecausal_factorsInput.schema';
import { metric_cardsCreatedimensionsInputObjectSchema } from './metric_cardsCreatedimensionsInput.schema';
import { metric_cardsCreateassigneesInputObjectSchema } from './metric_cardsCreateassigneesInput.schema';
import { JsonNullValueInputSchema } from '../enums/JsonNullValueInput.schema';
import { alert_rulesCreateNestedManyWithoutMetric_cardsInputObjectSchema } from './alert_rulesCreateNestedManyWithoutMetric_cardsInput.schema';
import { evidence_itemsCreateNestedManyWithoutMetric_cardsInputObjectSchema } from './evidence_itemsCreateNestedManyWithoutMetric_cardsInput.schema';
import { metric_card_tagsCreateNestedManyWithoutMetric_cardsInputObjectSchema } from './metric_card_tagsCreateNestedManyWithoutMetric_cardsInput.schema';
import { usersCreateNestedOneWithoutMetric_cards_metric_cards_created_byTousersInputObjectSchema } from './usersCreateNestedOneWithoutMetric_cards_metric_cards_created_byTousersInput.schema';
import { usersCreateNestedOneWithoutMetric_cards_metric_cards_owner_idTousersInputObjectSchema } from './usersCreateNestedOneWithoutMetric_cards_metric_cards_owner_idTousersInput.schema';
import { projectsCreateNestedOneWithoutMetric_cardsInputObjectSchema } from './projectsCreateNestedOneWithoutMetric_cardsInput.schema';
import { tracked_metricsCreateNestedOneWithoutMetric_cardsInputObjectSchema } from './tracked_metricsCreateNestedOneWithoutMetric_cardsInput.schema';
import { node_access_grantsCreateNestedManyWithoutMetric_cardsInputObjectSchema } from './node_access_grantsCreateNestedManyWithoutMetric_cardsInput.schema';
import { relationshipsCreateNestedManyWithoutMetric_cards_relationships_source_idTometric_cardsInputObjectSchema } from './relationshipsCreateNestedManyWithoutMetric_cards_relationships_source_idTometric_cardsInput.schema';
import { relationshipsCreateNestedManyWithoutMetric_cards_relationships_target_idTometric_cardsInputObjectSchema } from './relationshipsCreateNestedManyWithoutMetric_cards_relationships_target_idTometric_cardsInput.schema';
import { strategy_impact_contractsCreateNestedOneWithoutMetric_cardsInputObjectSchema } from './strategy_impact_contractsCreateNestedOneWithoutMetric_cardsInput.schema'


const literalSchema = z.union([z.string(), z.number(), z.boolean()]);
const jsonSchema = z.lazy(() =>
  z.union([literalSchema, z.array(jsonSchema.nullable()), z.record(z.string(), jsonSchema.nullable())])
);

export const metric_cardsCreateWithoutStrategy_metric_linksInputObjectSchema: z.ZodType<Prisma.metric_cardsCreateWithoutStrategy_metric_linksInput, Prisma.metric_cardsCreateWithoutStrategy_metric_linksInput> = z.object({
  id: z.string().optional(),
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
  assignees: z.union([z.lazy(() => metric_cardsCreateassigneesInputObjectSchema), z.string().array()]).optional(),
  created_at: z.union([z.date(), z.string().datetime()]).optional().nullable(),
  updated_at: z.union([z.date(), z.string().datetime()]).optional().nullable(),
  updated_by: z.string().optional().nullable(),
  status: z.string().optional().nullable(),
  workflow: z.union([JsonNullValueInputSchema, jsonSchema]).optional(),
  z_index: z.number().int().optional().nullable(),
  alert_rules: z.lazy(() => alert_rulesCreateNestedManyWithoutMetric_cardsInputObjectSchema).optional(),
  evidence_items: z.lazy(() => evidence_itemsCreateNestedManyWithoutMetric_cardsInputObjectSchema).optional(),
  metric_card_tags: z.lazy(() => metric_card_tagsCreateNestedManyWithoutMetric_cardsInputObjectSchema).optional(),
  users_metric_cards_created_byTousers: z.lazy(() => usersCreateNestedOneWithoutMetric_cards_metric_cards_created_byTousersInputObjectSchema),
  users_metric_cards_owner_idTousers: z.lazy(() => usersCreateNestedOneWithoutMetric_cards_metric_cards_owner_idTousersInputObjectSchema).optional(),
  projects: z.lazy(() => projectsCreateNestedOneWithoutMetric_cardsInputObjectSchema).optional(),
  tracked_metrics: z.lazy(() => tracked_metricsCreateNestedOneWithoutMetric_cardsInputObjectSchema).optional(),
  node_access_grants: z.lazy(() => node_access_grantsCreateNestedManyWithoutMetric_cardsInputObjectSchema).optional(),
  relationships_relationships_source_idTometric_cards: z.lazy(() => relationshipsCreateNestedManyWithoutMetric_cards_relationships_source_idTometric_cardsInputObjectSchema).optional(),
  relationships_relationships_target_idTometric_cards: z.lazy(() => relationshipsCreateNestedManyWithoutMetric_cards_relationships_target_idTometric_cardsInputObjectSchema).optional(),
  strategy_impact_contracts: z.lazy(() => strategy_impact_contractsCreateNestedOneWithoutMetric_cardsInputObjectSchema).optional()
}).strict();
export const metric_cardsCreateWithoutStrategy_metric_linksInputObjectZodSchema = z.object({
  id: z.string().optional(),
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
  assignees: z.union([z.lazy(() => metric_cardsCreateassigneesInputObjectSchema), z.string().array()]).optional(),
  created_at: z.union([z.date(), z.string().datetime()]).optional().nullable(),
  updated_at: z.union([z.date(), z.string().datetime()]).optional().nullable(),
  updated_by: z.string().optional().nullable(),
  status: z.string().optional().nullable(),
  workflow: z.union([JsonNullValueInputSchema, jsonSchema]).optional(),
  z_index: z.number().int().optional().nullable(),
  alert_rules: z.lazy(() => alert_rulesCreateNestedManyWithoutMetric_cardsInputObjectSchema).optional(),
  evidence_items: z.lazy(() => evidence_itemsCreateNestedManyWithoutMetric_cardsInputObjectSchema).optional(),
  metric_card_tags: z.lazy(() => metric_card_tagsCreateNestedManyWithoutMetric_cardsInputObjectSchema).optional(),
  users_metric_cards_created_byTousers: z.lazy(() => usersCreateNestedOneWithoutMetric_cards_metric_cards_created_byTousersInputObjectSchema),
  users_metric_cards_owner_idTousers: z.lazy(() => usersCreateNestedOneWithoutMetric_cards_metric_cards_owner_idTousersInputObjectSchema).optional(),
  projects: z.lazy(() => projectsCreateNestedOneWithoutMetric_cardsInputObjectSchema).optional(),
  tracked_metrics: z.lazy(() => tracked_metricsCreateNestedOneWithoutMetric_cardsInputObjectSchema).optional(),
  node_access_grants: z.lazy(() => node_access_grantsCreateNestedManyWithoutMetric_cardsInputObjectSchema).optional(),
  relationships_relationships_source_idTometric_cards: z.lazy(() => relationshipsCreateNestedManyWithoutMetric_cards_relationships_source_idTometric_cardsInputObjectSchema).optional(),
  relationships_relationships_target_idTometric_cards: z.lazy(() => relationshipsCreateNestedManyWithoutMetric_cards_relationships_target_idTometric_cardsInputObjectSchema).optional(),
  strategy_impact_contracts: z.lazy(() => strategy_impact_contractsCreateNestedOneWithoutMetric_cardsInputObjectSchema).optional()
}).strict();
