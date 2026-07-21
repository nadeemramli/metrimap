// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';


export const SpacesMaxAggregateInputObjectSchema: z.ZodType<Prisma.SpacesMaxAggregateInputType, Prisma.SpacesMaxAggregateInputType> = z.object({
  id: z.literal(true).optional(),
  created_by: z.literal(true).optional(),
  name: z.literal(true).optional(),
  color: z.literal(true).optional(),
  sort_order: z.literal(true).optional(),
  created_at: z.literal(true).optional(),
  updated_at: z.literal(true).optional(),
  workspace_id: z.literal(true).optional()
}).strict();
export const SpacesMaxAggregateInputObjectZodSchema = z.object({
  id: z.literal(true).optional(),
  created_by: z.literal(true).optional(),
  name: z.literal(true).optional(),
  color: z.literal(true).optional(),
  sort_order: z.literal(true).optional(),
  created_at: z.literal(true).optional(),
  updated_at: z.literal(true).optional(),
  workspace_id: z.literal(true).optional()
}).strict();
