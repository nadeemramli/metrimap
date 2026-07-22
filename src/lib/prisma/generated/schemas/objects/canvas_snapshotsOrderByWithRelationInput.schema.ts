// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { SortOrderInputObjectSchema } from './SortOrderInput.schema';
import { projectsOrderByWithRelationInputObjectSchema } from './projectsOrderByWithRelationInput.schema'

export const canvas_snapshotsOrderByWithRelationInputObjectSchema: z.ZodType<Prisma.canvas_snapshotsOrderByWithRelationInput, Prisma.canvas_snapshotsOrderByWithRelationInput> = z.object({
  id: SortOrderSchema.optional(),
  canvas_id: SortOrderSchema.optional(),
  version: SortOrderSchema.optional(),
  title: SortOrderSchema.optional(),
  description: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  nodes: SortOrderSchema.optional(),
  edges: SortOrderSchema.optional(),
  groups: SortOrderSchema.optional(),
  metadata: SortOrderSchema.optional(),
  created_by: SortOrderSchema.optional(),
  created_at: SortOrderSchema.optional(),
  updated_at: SortOrderSchema.optional(),
  projects: z.lazy(() => projectsOrderByWithRelationInputObjectSchema).optional()
}).strict();
export const canvas_snapshotsOrderByWithRelationInputObjectZodSchema = z.object({
  id: SortOrderSchema.optional(),
  canvas_id: SortOrderSchema.optional(),
  version: SortOrderSchema.optional(),
  title: SortOrderSchema.optional(),
  description: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  nodes: SortOrderSchema.optional(),
  edges: SortOrderSchema.optional(),
  groups: SortOrderSchema.optional(),
  metadata: SortOrderSchema.optional(),
  created_by: SortOrderSchema.optional(),
  created_at: SortOrderSchema.optional(),
  updated_at: SortOrderSchema.optional(),
  projects: z.lazy(() => projectsOrderByWithRelationInputObjectSchema).optional()
}).strict();
