// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';


export const Metric_cardsCountOutputTypeSelectObjectSchema: z.ZodType<Prisma.Metric_cardsCountOutputTypeSelect, Prisma.Metric_cardsCountOutputTypeSelect> = z.object({
  alert_rules: z.boolean().optional(),
  evidence_items: z.boolean().optional(),
  metric_card_tags: z.boolean().optional(),
  node_access_grants: z.boolean().optional(),
  relationships_relationships_source_idTometric_cards: z.boolean().optional(),
  relationships_relationships_target_idTometric_cards: z.boolean().optional(),
  strategy_metric_links: z.boolean().optional()
}).strict();
export const Metric_cardsCountOutputTypeSelectObjectZodSchema = z.object({
  alert_rules: z.boolean().optional(),
  evidence_items: z.boolean().optional(),
  metric_card_tags: z.boolean().optional(),
  node_access_grants: z.boolean().optional(),
  relationships_relationships_source_idTometric_cards: z.boolean().optional(),
  relationships_relationships_target_idTometric_cards: z.boolean().optional(),
  strategy_metric_links: z.boolean().optional()
}).strict();
