// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { SortOrderInputObjectSchema } from './SortOrderInput.schema';
import { projectsOrderByWithRelationInputObjectSchema } from './projectsOrderByWithRelationInput.schema';
import { usersOrderByWithRelationInputObjectSchema } from './usersOrderByWithRelationInput.schema'

export const changelogOrderByWithRelationInputObjectSchema: z.ZodType<Prisma.changelogOrderByWithRelationInput, Prisma.changelogOrderByWithRelationInput> = z.object({
  id: SortOrderSchema.optional(),
  project_id: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  user_id: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  action: SortOrderSchema.optional(),
  target: SortOrderSchema.optional(),
  target_id: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  target_name: SortOrderSchema.optional(),
  description: SortOrderSchema.optional(),
  metadata: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  timestamp: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  projects: z.lazy(() => projectsOrderByWithRelationInputObjectSchema).optional(),
  users: z.lazy(() => usersOrderByWithRelationInputObjectSchema).optional()
}).strict();
export const changelogOrderByWithRelationInputObjectZodSchema = z.object({
  id: SortOrderSchema.optional(),
  project_id: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  user_id: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  action: SortOrderSchema.optional(),
  target: SortOrderSchema.optional(),
  target_id: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  target_name: SortOrderSchema.optional(),
  description: SortOrderSchema.optional(),
  metadata: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  timestamp: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  projects: z.lazy(() => projectsOrderByWithRelationInputObjectSchema).optional(),
  users: z.lazy(() => usersOrderByWithRelationInputObjectSchema).optional()
}).strict();
