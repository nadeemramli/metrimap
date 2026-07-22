// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { JsonNullValueInputSchema } from '../enums/JsonNullValueInput.schema'


const literalSchema = z.union([z.string(), z.number(), z.boolean()]);
const jsonSchema = z.lazy(() =>
  z.union([literalSchema, z.array(jsonSchema.nullable()), z.record(z.string(), jsonSchema.nullable())])
);

export const alert_rulesCreateManyInputObjectSchema: z.ZodType<Prisma.alert_rulesCreateManyInput, Prisma.alert_rulesCreateManyInput> = z.object({
  id: z.string().optional(),
  project_id: z.string(),
  card_id: z.string(),
  name: z.string().optional().nullable(),
  rule_type: z.string(),
  config: z.union([JsonNullValueInputSchema, jsonSchema]).optional(),
  enabled: z.boolean().optional(),
  created_by: z.string().optional(),
  last_triggered_at: z.union([z.date(), z.string().datetime()]).optional().nullable(),
  last_triggered_value: z.number().optional().nullable(),
  created_at: z.union([z.date(), z.string().datetime()]).optional(),
  updated_at: z.union([z.date(), z.string().datetime()]).optional()
}).strict();
export const alert_rulesCreateManyInputObjectZodSchema = z.object({
  id: z.string().optional(),
  project_id: z.string(),
  card_id: z.string(),
  name: z.string().optional().nullable(),
  rule_type: z.string(),
  config: z.union([JsonNullValueInputSchema, jsonSchema]).optional(),
  enabled: z.boolean().optional(),
  created_by: z.string().optional(),
  last_triggered_at: z.union([z.date(), z.string().datetime()]).optional().nullable(),
  last_triggered_value: z.number().optional().nullable(),
  created_at: z.union([z.date(), z.string().datetime()]).optional(),
  updated_at: z.union([z.date(), z.string().datetime()]).optional()
}).strict();
