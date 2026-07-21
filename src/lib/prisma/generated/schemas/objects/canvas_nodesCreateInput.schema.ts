// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { NullableJsonNullValueInputSchema } from '../enums/NullableJsonNullValueInput.schema';
import { projectsCreateNestedOneWithoutCanvas_nodesInputObjectSchema } from './projectsCreateNestedOneWithoutCanvas_nodesInput.schema'


const literalSchema = z.union([z.string(), z.number(), z.boolean()]);
const jsonSchema = z.lazy(() =>
  z.union([literalSchema, z.array(jsonSchema.nullable()), z.record(z.string(), jsonSchema.nullable())])
);

export const canvas_nodesCreateInputObjectSchema: z.ZodType<Prisma.canvas_nodesCreateInput, Prisma.canvas_nodesCreateInput> = z.object({
  id: z.string().optional(),
  node_type: z.string(),
  title: z.string().optional().nullable(),
  position_x: z.number().optional(),
  position_y: z.number().optional(),
  data: z.union([NullableJsonNullValueInputSchema, jsonSchema]).optional(),
  created_at: z.union([z.date(), z.string().datetime()]).optional(),
  updated_at: z.union([z.date(), z.string().datetime()]).optional(),
  created_by: z.string(),
  updated_by: z.string().optional().nullable(),
  z_index: z.number().int().optional().nullable(),
  projects: z.lazy(() => projectsCreateNestedOneWithoutCanvas_nodesInputObjectSchema)
}).strict();
export const canvas_nodesCreateInputObjectZodSchema = z.object({
  id: z.string().optional(),
  node_type: z.string(),
  title: z.string().optional().nullable(),
  position_x: z.number().optional(),
  position_y: z.number().optional(),
  data: z.union([NullableJsonNullValueInputSchema, jsonSchema]).optional(),
  created_at: z.union([z.date(), z.string().datetime()]).optional(),
  updated_at: z.union([z.date(), z.string().datetime()]).optional(),
  created_by: z.string(),
  updated_by: z.string().optional().nullable(),
  z_index: z.number().int().optional().nullable(),
  projects: z.lazy(() => projectsCreateNestedOneWithoutCanvas_nodesInputObjectSchema)
}).strict();
