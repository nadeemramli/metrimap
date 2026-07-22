// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { groupsWhereInputObjectSchema } from './groupsWhereInput.schema'

export const GroupsListRelationFilterObjectSchema: z.ZodType<Prisma.GroupsListRelationFilter, Prisma.GroupsListRelationFilter> = z.object({
  every: z.lazy(() => groupsWhereInputObjectSchema).optional(),
  some: z.lazy(() => groupsWhereInputObjectSchema).optional(),
  none: z.lazy(() => groupsWhereInputObjectSchema).optional()
}).strict();
export const GroupsListRelationFilterObjectZodSchema = z.object({
  every: z.lazy(() => groupsWhereInputObjectSchema).optional(),
  some: z.lazy(() => groupsWhereInputObjectSchema).optional(),
  none: z.lazy(() => groupsWhereInputObjectSchema).optional()
}).strict();
