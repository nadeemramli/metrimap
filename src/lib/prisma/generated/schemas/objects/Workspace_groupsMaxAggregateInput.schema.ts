// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';


export const Workspace_groupsMaxAggregateInputObjectSchema: z.ZodType<Prisma.Workspace_groupsMaxAggregateInputType, Prisma.Workspace_groupsMaxAggregateInputType> = z.object({
  id: z.literal(true).optional(),
  workspace_id: z.literal(true).optional(),
  name: z.literal(true).optional(),
  description: z.literal(true).optional(),
  color: z.literal(true).optional(),
  created_by: z.literal(true).optional(),
  created_at: z.literal(true).optional(),
  updated_at: z.literal(true).optional()
}).strict();
export const Workspace_groupsMaxAggregateInputObjectZodSchema = z.object({
  id: z.literal(true).optional(),
  workspace_id: z.literal(true).optional(),
  name: z.literal(true).optional(),
  description: z.literal(true).optional(),
  color: z.literal(true).optional(),
  created_by: z.literal(true).optional(),
  created_at: z.literal(true).optional(),
  updated_at: z.literal(true).optional()
}).strict();
