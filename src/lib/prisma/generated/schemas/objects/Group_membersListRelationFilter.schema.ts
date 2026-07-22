// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { group_membersWhereInputObjectSchema } from './group_membersWhereInput.schema'

export const Group_membersListRelationFilterObjectSchema: z.ZodType<Prisma.Group_membersListRelationFilter, Prisma.Group_membersListRelationFilter> = z.object({
  every: z.lazy(() => group_membersWhereInputObjectSchema).optional(),
  some: z.lazy(() => group_membersWhereInputObjectSchema).optional(),
  none: z.lazy(() => group_membersWhereInputObjectSchema).optional()
}).strict();
export const Group_membersListRelationFilterObjectZodSchema = z.object({
  every: z.lazy(() => group_membersWhereInputObjectSchema).optional(),
  some: z.lazy(() => group_membersWhereInputObjectSchema).optional(),
  none: z.lazy(() => group_membersWhereInputObjectSchema).optional()
}).strict();
