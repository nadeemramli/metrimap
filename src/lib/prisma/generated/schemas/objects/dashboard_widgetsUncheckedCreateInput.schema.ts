// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { JsonNullValueInputSchema } from '../enums/JsonNullValueInput.schema'


const literalSchema = z.union([z.string(), z.number(), z.boolean()]);
const jsonSchema = z.lazy(() =>
  z.union([literalSchema, z.array(jsonSchema.nullable()), z.record(z.string(), jsonSchema.nullable())])
);

export const dashboard_widgetsUncheckedCreateInputObjectSchema: z.ZodType<Prisma.dashboard_widgetsUncheckedCreateInput, Prisma.dashboard_widgetsUncheckedCreateInput> = z.object({
  id: z.string().optional(),
  project_id: z.string(),
  title: z.string().optional().nullable(),
  widget_type: z.string().optional(),
  config: z.union([JsonNullValueInputSchema, jsonSchema]).optional(),
  layout: z.union([JsonNullValueInputSchema, jsonSchema]).optional(),
  sort_index: z.number().int().optional(),
  created_by: z.string().optional(),
  created_at: z.union([z.date(), z.string().datetime()]).optional(),
  updated_at: z.union([z.date(), z.string().datetime()]).optional(),
  group_id: z.string().optional().nullable()
}).strict();
export const dashboard_widgetsUncheckedCreateInputObjectZodSchema = z.object({
  id: z.string().optional(),
  project_id: z.string(),
  title: z.string().optional().nullable(),
  widget_type: z.string().optional(),
  config: z.union([JsonNullValueInputSchema, jsonSchema]).optional(),
  layout: z.union([JsonNullValueInputSchema, jsonSchema]).optional(),
  sort_index: z.number().int().optional(),
  created_by: z.string().optional(),
  created_at: z.union([z.date(), z.string().datetime()]).optional(),
  updated_at: z.union([z.date(), z.string().datetime()]).optional(),
  group_id: z.string().optional().nullable()
}).strict();
