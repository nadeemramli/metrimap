// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { Event_definitionsFindManySchema } from '../findManyevent_definitions.schema';
import { Metric_bindingsFindManySchema } from '../findManymetric_bindings.schema';
import { Metric_cardsFindManySchema } from '../findManymetric_cards.schema';
import { Metric_valuesFindManySchema } from '../findManymetric_values.schema';
import { Strategy_metric_linksFindManySchema } from '../findManystrategy_metric_links.schema';
import { tracked_metricsCountOutputTypeArgsObjectSchema } from './tracked_metricsCountOutputTypeArgs.schema'

export const tracked_metricsSelectObjectSchema: z.ZodType<Prisma.tracked_metricsSelect, Prisma.tracked_metricsSelect> = z.object({
  id: z.boolean().optional(),
  created_by: z.boolean().optional(),
  name: z.boolean().optional(),
  unit: z.boolean().optional(),
  formula: z.boolean().optional(),
  owner_label: z.boolean().optional(),
  state: z.boolean().optional(),
  origin_card_id: z.boolean().optional(),
  origin_project_id: z.boolean().optional(),
  source_kind: z.boolean().optional(),
  created_at: z.boolean().optional(),
  updated_at: z.boolean().optional(),
  workspace_id: z.boolean().optional(),
  event_definitions: z.union([z.boolean(), z.lazy(() => Event_definitionsFindManySchema)]).optional(),
  metric_bindings: z.union([z.boolean(), z.lazy(() => Metric_bindingsFindManySchema)]).optional(),
  metric_cards: z.union([z.boolean(), z.lazy(() => Metric_cardsFindManySchema)]).optional(),
  metric_values: z.union([z.boolean(), z.lazy(() => Metric_valuesFindManySchema)]).optional(),
  strategy_metric_links: z.union([z.boolean(), z.lazy(() => Strategy_metric_linksFindManySchema)]).optional(),
  _count: z.union([z.boolean(), z.lazy(() => tracked_metricsCountOutputTypeArgsObjectSchema)]).optional()
}).strict();
export const tracked_metricsSelectObjectZodSchema = z.object({
  id: z.boolean().optional(),
  created_by: z.boolean().optional(),
  name: z.boolean().optional(),
  unit: z.boolean().optional(),
  formula: z.boolean().optional(),
  owner_label: z.boolean().optional(),
  state: z.boolean().optional(),
  origin_card_id: z.boolean().optional(),
  origin_project_id: z.boolean().optional(),
  source_kind: z.boolean().optional(),
  created_at: z.boolean().optional(),
  updated_at: z.boolean().optional(),
  workspace_id: z.boolean().optional(),
  event_definitions: z.union([z.boolean(), z.lazy(() => Event_definitionsFindManySchema)]).optional(),
  metric_bindings: z.union([z.boolean(), z.lazy(() => Metric_bindingsFindManySchema)]).optional(),
  metric_cards: z.union([z.boolean(), z.lazy(() => Metric_cardsFindManySchema)]).optional(),
  metric_values: z.union([z.boolean(), z.lazy(() => Metric_valuesFindManySchema)]).optional(),
  strategy_metric_links: z.union([z.boolean(), z.lazy(() => Strategy_metric_linksFindManySchema)]).optional(),
  _count: z.union([z.boolean(), z.lazy(() => tracked_metricsCountOutputTypeArgsObjectSchema)]).optional()
}).strict();
