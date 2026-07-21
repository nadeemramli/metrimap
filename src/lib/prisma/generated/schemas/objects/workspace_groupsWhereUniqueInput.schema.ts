// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { workspace_groupsWorkspace_idNameCompoundUniqueInputObjectSchema } from './workspace_groupsWorkspace_idNameCompoundUniqueInput.schema'

export const workspace_groupsWhereUniqueInputObjectSchema: z.ZodType<Prisma.workspace_groupsWhereUniqueInput, Prisma.workspace_groupsWhereUniqueInput> = z.object({
  id: z.string(),
  workspace_id_name: z.lazy(() => workspace_groupsWorkspace_idNameCompoundUniqueInputObjectSchema)
}).strict();
export const workspace_groupsWhereUniqueInputObjectZodSchema = z.object({
  id: z.string(),
  workspace_id_name: z.lazy(() => workspace_groupsWorkspace_idNameCompoundUniqueInputObjectSchema)
}).strict();
