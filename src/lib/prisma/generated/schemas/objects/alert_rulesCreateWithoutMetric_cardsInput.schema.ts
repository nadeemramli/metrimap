// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { JsonNullValueInputSchema } from '../enums/JsonNullValueInput.schema';
import { projectsCreateNestedOneWithoutAlert_rulesInputObjectSchema } from './projectsCreateNestedOneWithoutAlert_rulesInput.schema'


const literalSchema = z.union([z.string(), z.number(), z.boolean()]);
const jsonSchema = z.lazy(() =>
  z.union([literalSchema, z.array(jsonSchema.nullable()), z.record(z.string(), jsonSchema.nullable())])
);

export const alert_rulesCreateWithoutMetric_cardsInputObjectSchema: z.ZodType<Prisma.alert_rulesCreateWithoutMetric_cardsInput, Prisma.alert_rulesCreateWithoutMetric_cardsInput> = z.object({
  id: z.string().optional(),
  name: z.string().optional().nullable(),
  rule_type: z.string(),
  config: z.union([JsonNullValueInputSchema, jsonSchema]).optional(),
  enabled: z.boolean().optional(),
  created_by: z.string().optional(),
  last_triggered_at: z.union([z.date(), z.string().datetime()]).optional().nullable(),
  last_triggered_value: z.number().optional().nullable(),
  created_at: z.union([z.date(), z.string().datetime()]).optional(),
  updated_at: z.union([z.date(), z.string().datetime()]).optional(),
  projects: z.lazy(() => projectsCreateNestedOneWithoutAlert_rulesInputObjectSchema)
}).strict();
export const alert_rulesCreateWithoutMetric_cardsInputObjectZodSchema = z.object({
  id: z.string().optional(),
  name: z.string().optional().nullable(),
  rule_type: z.string(),
  config: z.union([JsonNullValueInputSchema, jsonSchema]).optional(),
  enabled: z.boolean().optional(),
  created_by: z.string().optional(),
  last_triggered_at: z.union([z.date(), z.string().datetime()]).optional().nullable(),
  last_triggered_value: z.number().optional().nullable(),
  created_at: z.union([z.date(), z.string().datetime()]).optional(),
  updated_at: z.union([z.date(), z.string().datetime()]).optional(),
  projects: z.lazy(() => projectsCreateNestedOneWithoutAlert_rulesInputObjectSchema)
}).strict();
