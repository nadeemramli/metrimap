// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';


export const source_connectionsCreateManyInputObjectSchema: z.ZodType<Prisma.source_connectionsCreateManyInput, Prisma.source_connectionsCreateManyInput> = z.object({
  id: z.string().optional(),
  created_by: z.string().optional(),
  name: z.string(),
  warehouse_type: z.string().optional(),
  host: z.string(),
  port: z.number().int().optional(),
  database: z.string(),
  username: z.string(),
  ssl: z.boolean().optional(),
  created_at: z.union([z.date(), z.string().datetime()]).optional(),
  updated_at: z.union([z.date(), z.string().datetime()]).optional(),
  workspace_id: z.string().optional().nullable()
}).strict();
export const source_connectionsCreateManyInputObjectZodSchema = z.object({
  id: z.string().optional(),
  created_by: z.string().optional(),
  name: z.string(),
  warehouse_type: z.string().optional(),
  host: z.string(),
  port: z.number().int().optional(),
  database: z.string(),
  username: z.string(),
  ssl: z.boolean().optional(),
  created_at: z.union([z.date(), z.string().datetime()]).optional(),
  updated_at: z.union([z.date(), z.string().datetime()]).optional(),
  workspace_id: z.string().optional().nullable()
}).strict();
