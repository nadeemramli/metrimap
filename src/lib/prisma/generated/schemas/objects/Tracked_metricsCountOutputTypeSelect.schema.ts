// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';


export const Tracked_metricsCountOutputTypeSelectObjectSchema: z.ZodType<Prisma.Tracked_metricsCountOutputTypeSelect, Prisma.Tracked_metricsCountOutputTypeSelect> = z.object({
  event_definitions: z.boolean().optional(),
  metric_bindings: z.boolean().optional(),
  metric_cards: z.boolean().optional(),
  metric_values: z.boolean().optional(),
  strategy_metric_links: z.boolean().optional()
}).strict();
export const Tracked_metricsCountOutputTypeSelectObjectZodSchema = z.object({
  event_definitions: z.boolean().optional(),
  metric_bindings: z.boolean().optional(),
  metric_cards: z.boolean().optional(),
  metric_values: z.boolean().optional(),
  strategy_metric_links: z.boolean().optional()
}).strict();
