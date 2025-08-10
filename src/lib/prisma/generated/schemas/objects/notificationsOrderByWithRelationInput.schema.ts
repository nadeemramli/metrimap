import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { SortOrderInputObjectSchema } from './SortOrderInput.schema'

export const notificationsOrderByWithRelationInputObjectSchema: z.ZodType<Prisma.notificationsOrderByWithRelationInput, Prisma.notificationsOrderByWithRelationInput> = z.object({
  id: SortOrderSchema.optional(),
  user_id: SortOrderSchema.optional(),
  type: SortOrderSchema.optional(),
  title: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  description: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  read: SortOrderSchema.optional(),
  metadata: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  created_at: SortOrderSchema.optional()
}).strict();
export const notificationsOrderByWithRelationInputObjectZodSchema = z.object({
  id: SortOrderSchema.optional(),
  user_id: SortOrderSchema.optional(),
  type: SortOrderSchema.optional(),
  title: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  description: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  read: SortOrderSchema.optional(),
  metadata: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  created_at: SortOrderSchema.optional()
}).strict();
