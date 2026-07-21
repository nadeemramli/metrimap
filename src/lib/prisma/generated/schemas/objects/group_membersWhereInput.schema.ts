// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { UuidFilterObjectSchema } from './UuidFilter.schema';
import { StringFilterObjectSchema } from './StringFilter.schema';
import { DateTimeFilterObjectSchema } from './DateTimeFilter.schema';
import { Workspace_groupsScalarRelationFilterObjectSchema } from './Workspace_groupsScalarRelationFilter.schema';
import { workspace_groupsWhereInputObjectSchema } from './workspace_groupsWhereInput.schema'

export const group_membersWhereInputObjectSchema: z.ZodType<Prisma.group_membersWhereInput, Prisma.group_membersWhereInput> = z.object({
  AND: z.union([z.lazy(() => group_membersWhereInputObjectSchema), z.lazy(() => group_membersWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => group_membersWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => group_membersWhereInputObjectSchema), z.lazy(() => group_membersWhereInputObjectSchema).array()]).optional(),
  group_id: z.union([z.lazy(() => UuidFilterObjectSchema), z.string()]).optional(),
  user_id: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  added_by: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  added_at: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.union([z.date(), z.string().datetime()])]).optional(),
  workspace_groups: z.union([z.lazy(() => Workspace_groupsScalarRelationFilterObjectSchema), z.lazy(() => workspace_groupsWhereInputObjectSchema)]).optional()
}).strict();
export const group_membersWhereInputObjectZodSchema = z.object({
  AND: z.union([z.lazy(() => group_membersWhereInputObjectSchema), z.lazy(() => group_membersWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => group_membersWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => group_membersWhereInputObjectSchema), z.lazy(() => group_membersWhereInputObjectSchema).array()]).optional(),
  group_id: z.union([z.lazy(() => UuidFilterObjectSchema), z.string()]).optional(),
  user_id: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  added_by: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  added_at: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.union([z.date(), z.string().datetime()])]).optional(),
  workspace_groups: z.union([z.lazy(() => Workspace_groupsScalarRelationFilterObjectSchema), z.lazy(() => workspace_groupsWhereInputObjectSchema)]).optional()
}).strict();
