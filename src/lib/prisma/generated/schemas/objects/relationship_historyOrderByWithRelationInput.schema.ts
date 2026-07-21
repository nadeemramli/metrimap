// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { SortOrderInputObjectSchema } from './SortOrderInput.schema';
import { projectsOrderByWithRelationInputObjectSchema } from './projectsOrderByWithRelationInput.schema';
import { relationshipsOrderByWithRelationInputObjectSchema } from './relationshipsOrderByWithRelationInput.schema'

export const relationship_historyOrderByWithRelationInputObjectSchema: z.ZodType<Prisma.relationship_historyOrderByWithRelationInput, Prisma.relationship_historyOrderByWithRelationInput> = z.object({
  id: SortOrderSchema.optional(),
  relationship_id: SortOrderSchema.optional(),
  project_id: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  type: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  confidence: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  weight: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  changed_by: SortOrderSchema.optional(),
  created_at: SortOrderSchema.optional(),
  projects: z.lazy(() => projectsOrderByWithRelationInputObjectSchema).optional(),
  relationships: z.lazy(() => relationshipsOrderByWithRelationInputObjectSchema).optional()
}).strict();
export const relationship_historyOrderByWithRelationInputObjectZodSchema = z.object({
  id: SortOrderSchema.optional(),
  relationship_id: SortOrderSchema.optional(),
  project_id: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  type: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  confidence: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  weight: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  changed_by: SortOrderSchema.optional(),
  created_at: SortOrderSchema.optional(),
  projects: z.lazy(() => projectsOrderByWithRelationInputObjectSchema).optional(),
  relationships: z.lazy(() => relationshipsOrderByWithRelationInputObjectSchema).optional()
}).strict();
