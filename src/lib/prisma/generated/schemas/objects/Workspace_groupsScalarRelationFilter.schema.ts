// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { workspace_groupsWhereInputObjectSchema } from './workspace_groupsWhereInput.schema'

export const Workspace_groupsScalarRelationFilterObjectSchema: z.ZodType<Prisma.Workspace_groupsScalarRelationFilter, Prisma.Workspace_groupsScalarRelationFilter> = z.object({
  is: z.lazy(() => workspace_groupsWhereInputObjectSchema).optional(),
  isNot: z.lazy(() => workspace_groupsWhereInputObjectSchema).optional()
}).strict();
export const Workspace_groupsScalarRelationFilterObjectZodSchema = z.object({
  is: z.lazy(() => workspace_groupsWhereInputObjectSchema).optional(),
  isNot: z.lazy(() => workspace_groupsWhereInputObjectSchema).optional()
}).strict();
