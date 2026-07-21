// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { metric_cardsArgsObjectSchema } from './metric_cardsArgs.schema';
import { projectsArgsObjectSchema } from './projectsArgs.schema'

export const alert_rulesIncludeObjectSchema: z.ZodType<Prisma.alert_rulesInclude, Prisma.alert_rulesInclude> = z.object({
  metric_cards: z.union([z.boolean(), z.lazy(() => metric_cardsArgsObjectSchema)]).optional(),
  projects: z.union([z.boolean(), z.lazy(() => projectsArgsObjectSchema)]).optional()
}).strict();
export const alert_rulesIncludeObjectZodSchema = z.object({
  metric_cards: z.union([z.boolean(), z.lazy(() => metric_cardsArgsObjectSchema)]).optional(),
  projects: z.union([z.boolean(), z.lazy(() => projectsArgsObjectSchema)]).optional()
}).strict();
