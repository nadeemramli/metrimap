import { z } from 'zod';
import type { Prisma } from '@prisma/client';


export const metric_cardsSelectObjectSchema: z.ZodType<Prisma.metric_cardsSelect, Prisma.metric_cardsSelect> = z.object({
  id: z.boolean().optional(),
  project_id: z.boolean().optional(),
  title: z.boolean().optional(),
  description: z.boolean().optional(),
  category: z.boolean().optional(),
  sub_category: z.boolean().optional(),
  position_x: z.boolean().optional(),
  position_y: z.boolean().optional(),
  data: z.boolean().optional(),
  source_type: z.boolean().optional(),
  formula: z.boolean().optional(),
  causal_factors: z.boolean().optional(),
  dimensions: z.boolean().optional(),
  owner_id: z.boolean().optional(),
  assignees: z.boolean().optional(),
  created_at: z.boolean().optional(),
  updated_at: z.boolean().optional(),
  created_by: z.boolean().optional()
}).strict();
export const metric_cardsSelectObjectZodSchema = z.object({
  id: z.boolean().optional(),
  project_id: z.boolean().optional(),
  title: z.boolean().optional(),
  description: z.boolean().optional(),
  category: z.boolean().optional(),
  sub_category: z.boolean().optional(),
  position_x: z.boolean().optional(),
  position_y: z.boolean().optional(),
  data: z.boolean().optional(),
  source_type: z.boolean().optional(),
  formula: z.boolean().optional(),
  causal_factors: z.boolean().optional(),
  dimensions: z.boolean().optional(),
  owner_id: z.boolean().optional(),
  assignees: z.boolean().optional(),
  created_at: z.boolean().optional(),
  updated_at: z.boolean().optional(),
  created_by: z.boolean().optional()
}).strict();
