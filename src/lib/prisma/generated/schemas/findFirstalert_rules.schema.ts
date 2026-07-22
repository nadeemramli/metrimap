// @ts-nocheck
import type { Prisma } from '@prisma/client';
import { z } from 'zod';
import { alert_rulesIncludeObjectSchema } from './objects/alert_rulesInclude.schema.js';
import { alert_rulesOrderByWithRelationInputObjectSchema } from './objects/alert_rulesOrderByWithRelationInput.schema';
import { alert_rulesWhereInputObjectSchema } from './objects/alert_rulesWhereInput.schema';
import { alert_rulesWhereUniqueInputObjectSchema } from './objects/alert_rulesWhereUniqueInput.schema';
import { alert_rulesScalarFieldEnumSchema } from './enums/alert_rulesScalarFieldEnum.schema';
import { metric_cardsArgsObjectSchema } from './objects/metric_cardsArgs.schema';
import { projectsArgsObjectSchema } from './objects/projectsArgs.schema'

// Select schema needs to be in file to prevent circular imports
//------------------------------------------------------

export const alert_rulesFindFirstSelectSchema: z.ZodType<Prisma.alert_rulesSelect, Prisma.alert_rulesSelect> = z.object({
    id: z.boolean().optional(),
    project_id: z.boolean().optional(),
    card_id: z.boolean().optional(),
    name: z.boolean().optional(),
    rule_type: z.boolean().optional(),
    config: z.boolean().optional(),
    enabled: z.boolean().optional(),
    created_by: z.boolean().optional(),
    last_triggered_at: z.boolean().optional(),
    last_triggered_value: z.boolean().optional(),
    created_at: z.boolean().optional(),
    updated_at: z.boolean().optional(),
    metric_cards: z.boolean().optional(),
    projects: z.boolean().optional()
  }).strict();

export const alert_rulesFindFirstSelectZodSchema = z.object({
    id: z.boolean().optional(),
    project_id: z.boolean().optional(),
    card_id: z.boolean().optional(),
    name: z.boolean().optional(),
    rule_type: z.boolean().optional(),
    config: z.boolean().optional(),
    enabled: z.boolean().optional(),
    created_by: z.boolean().optional(),
    last_triggered_at: z.boolean().optional(),
    last_triggered_value: z.boolean().optional(),
    created_at: z.boolean().optional(),
    updated_at: z.boolean().optional(),
    metric_cards: z.boolean().optional(),
    projects: z.boolean().optional()
  }).strict();

export const alert_rulesFindFirstSchema: z.ZodType<Prisma.alert_rulesFindFirstArgs, Prisma.alert_rulesFindFirstArgs> = z.object({ select: alert_rulesFindFirstSelectSchema.optional(), include: z.lazy(() => alert_rulesIncludeObjectSchema.optional()), orderBy: z.union([alert_rulesOrderByWithRelationInputObjectSchema, alert_rulesOrderByWithRelationInputObjectSchema.array()]).optional(), where: alert_rulesWhereInputObjectSchema.optional(), cursor: alert_rulesWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([alert_rulesScalarFieldEnumSchema, alert_rulesScalarFieldEnumSchema.array()]).optional() }).strict();

export const alert_rulesFindFirstZodSchema = z.object({ select: alert_rulesFindFirstSelectSchema.optional(), include: z.lazy(() => alert_rulesIncludeObjectSchema.optional()), orderBy: z.union([alert_rulesOrderByWithRelationInputObjectSchema, alert_rulesOrderByWithRelationInputObjectSchema.array()]).optional(), where: alert_rulesWhereInputObjectSchema.optional(), cursor: alert_rulesWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([alert_rulesScalarFieldEnumSchema, alert_rulesScalarFieldEnumSchema.array()]).optional() }).strict();