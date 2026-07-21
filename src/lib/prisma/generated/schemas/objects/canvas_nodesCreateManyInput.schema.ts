// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { NullableJsonNullValueInputSchema } from '../enums/NullableJsonNullValueInput.schema'


const literalSchema = z.union([z.string(), z.number(), z.boolean()]);
const jsonSchema = z.lazy(() =>
  z.union([literalSchema, z.array(jsonSchema.nullable()), z.record(z.string(), jsonSchema.nullable())])
);

export const canvas_nodesCreateManyInputObjectSchema: z.ZodType<Prisma.canvas_nodesCreateManyInput, Prisma.canvas_nodesCreateManyInput> = z.object({
  id: z.string().optional(),
  project_id: z.string(),
  node_type: z.string(),
  title: z.string().optional().nullable(),
  position_x: z.number().optional(),
  position_y: z.number().optional(),
  data: z.union([NullableJsonNullValueInputSchema, jsonSchema]).optional(),
  created_at: z.union([z.date(), z.string().datetime()]).optional(),
  updated_at: z.union([z.date(), z.string().datetime()]).optional(),
  created_by: z.string(),
  updated_by: z.string().optional().nullable(),
  z_index: z.number().int().optional().nullable()
}).strict();
export const canvas_nodesCreateManyInputObjectZodSchema = z.object({
  id: z.string().optional(),
  project_id: z.string(),
  node_type: z.string(),
  title: z.string().optional().nullable(),
  position_x: z.number().optional(),
  position_y: z.number().optional(),
  data: z.union([NullableJsonNullValueInputSchema, jsonSchema]).optional(),
  created_at: z.union([z.date(), z.string().datetime()]).optional(),
  updated_at: z.union([z.date(), z.string().datetime()]).optional(),
  created_by: z.string(),
  updated_by: z.string().optional().nullable(),
  z_index: z.number().int().optional().nullable()
}).strict();
