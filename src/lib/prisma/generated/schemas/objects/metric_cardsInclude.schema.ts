// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { Alert_rulesFindManySchema } from '../findManyalert_rules.schema';
import { Evidence_itemsFindManySchema } from '../findManyevidence_items.schema';
import { Metric_card_tagsFindManySchema } from '../findManymetric_card_tags.schema';
import { usersArgsObjectSchema } from './usersArgs.schema';
import { projectsArgsObjectSchema } from './projectsArgs.schema';
import { tracked_metricsArgsObjectSchema } from './tracked_metricsArgs.schema';
import { Node_access_grantsFindManySchema } from '../findManynode_access_grants.schema';
import { RelationshipsFindManySchema } from '../findManyrelationships.schema';
import { strategy_impact_contractsArgsObjectSchema } from './strategy_impact_contractsArgs.schema';
import { Strategy_metric_linksFindManySchema } from '../findManystrategy_metric_links.schema';
import { metric_cardsCountOutputTypeArgsObjectSchema } from './metric_cardsCountOutputTypeArgs.schema'

export const metric_cardsIncludeObjectSchema: z.ZodType<Prisma.metric_cardsInclude, Prisma.metric_cardsInclude> = z.object({
  alert_rules: z.union([z.boolean(), z.lazy(() => Alert_rulesFindManySchema)]).optional(),
  evidence_items: z.union([z.boolean(), z.lazy(() => Evidence_itemsFindManySchema)]).optional(),
  metric_card_tags: z.union([z.boolean(), z.lazy(() => Metric_card_tagsFindManySchema)]).optional(),
  users_metric_cards_created_byTousers: z.union([z.boolean(), z.lazy(() => usersArgsObjectSchema)]).optional(),
  users_metric_cards_owner_idTousers: z.union([z.boolean(), z.lazy(() => usersArgsObjectSchema)]).optional(),
  projects: z.union([z.boolean(), z.lazy(() => projectsArgsObjectSchema)]).optional(),
  tracked_metrics: z.union([z.boolean(), z.lazy(() => tracked_metricsArgsObjectSchema)]).optional(),
  node_access_grants: z.union([z.boolean(), z.lazy(() => Node_access_grantsFindManySchema)]).optional(),
  relationships_relationships_source_idTometric_cards: z.union([z.boolean(), z.lazy(() => RelationshipsFindManySchema)]).optional(),
  relationships_relationships_target_idTometric_cards: z.union([z.boolean(), z.lazy(() => RelationshipsFindManySchema)]).optional(),
  strategy_impact_contracts: z.union([z.boolean(), z.lazy(() => strategy_impact_contractsArgsObjectSchema)]).optional(),
  strategy_metric_links: z.union([z.boolean(), z.lazy(() => Strategy_metric_linksFindManySchema)]).optional(),
  _count: z.union([z.boolean(), z.lazy(() => metric_cardsCountOutputTypeArgsObjectSchema)]).optional()
}).strict();
export const metric_cardsIncludeObjectZodSchema = z.object({
  alert_rules: z.union([z.boolean(), z.lazy(() => Alert_rulesFindManySchema)]).optional(),
  evidence_items: z.union([z.boolean(), z.lazy(() => Evidence_itemsFindManySchema)]).optional(),
  metric_card_tags: z.union([z.boolean(), z.lazy(() => Metric_card_tagsFindManySchema)]).optional(),
  users_metric_cards_created_byTousers: z.union([z.boolean(), z.lazy(() => usersArgsObjectSchema)]).optional(),
  users_metric_cards_owner_idTousers: z.union([z.boolean(), z.lazy(() => usersArgsObjectSchema)]).optional(),
  projects: z.union([z.boolean(), z.lazy(() => projectsArgsObjectSchema)]).optional(),
  tracked_metrics: z.union([z.boolean(), z.lazy(() => tracked_metricsArgsObjectSchema)]).optional(),
  node_access_grants: z.union([z.boolean(), z.lazy(() => Node_access_grantsFindManySchema)]).optional(),
  relationships_relationships_source_idTometric_cards: z.union([z.boolean(), z.lazy(() => RelationshipsFindManySchema)]).optional(),
  relationships_relationships_target_idTometric_cards: z.union([z.boolean(), z.lazy(() => RelationshipsFindManySchema)]).optional(),
  strategy_impact_contracts: z.union([z.boolean(), z.lazy(() => strategy_impact_contractsArgsObjectSchema)]).optional(),
  strategy_metric_links: z.union([z.boolean(), z.lazy(() => Strategy_metric_linksFindManySchema)]).optional(),
  _count: z.union([z.boolean(), z.lazy(() => metric_cardsCountOutputTypeArgsObjectSchema)]).optional()
}).strict();
