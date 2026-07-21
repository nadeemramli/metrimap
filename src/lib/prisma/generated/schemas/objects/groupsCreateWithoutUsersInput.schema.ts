// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { groupsCreatenode_idsInputObjectSchema } from './groupsCreatenode_idsInput.schema';
import { projectsCreateNestedOneWithoutGroupsInputObjectSchema } from './projectsCreateNestedOneWithoutGroupsInput.schema'

export const groupsCreateWithoutUsersInputObjectSchema: z.ZodType<Prisma.groupsCreateWithoutUsersInput, Prisma.groupsCreateWithoutUsersInput> = z.object({
  id: z.string().optional(),
  name: z.string(),
  description: z.string().optional().nullable(),
  color: z.string().optional().nullable(),
  position_x: z.number().optional(),
  position_y: z.number().optional(),
  width: z.number().optional(),
  height: z.number().optional(),
  node_ids: z.union([z.lazy(() => groupsCreatenode_idsInputObjectSchema), z.string().array()]).optional(),
  created_at: z.union([z.date(), z.string().datetime()]).optional().nullable(),
  updated_at: z.union([z.date(), z.string().datetime()]).optional().nullable(),
  projects: z.lazy(() => projectsCreateNestedOneWithoutGroupsInputObjectSchema).optional()
}).strict();
export const groupsCreateWithoutUsersInputObjectZodSchema = z.object({
  id: z.string().optional(),
  name: z.string(),
  description: z.string().optional().nullable(),
  color: z.string().optional().nullable(),
  position_x: z.number().optional(),
  position_y: z.number().optional(),
  width: z.number().optional(),
  height: z.number().optional(),
  node_ids: z.union([z.lazy(() => groupsCreatenode_idsInputObjectSchema), z.string().array()]).optional(),
  created_at: z.union([z.date(), z.string().datetime()]).optional().nullable(),
  updated_at: z.union([z.date(), z.string().datetime()]).optional().nullable(),
  projects: z.lazy(() => projectsCreateNestedOneWithoutGroupsInputObjectSchema).optional()
}).strict();
