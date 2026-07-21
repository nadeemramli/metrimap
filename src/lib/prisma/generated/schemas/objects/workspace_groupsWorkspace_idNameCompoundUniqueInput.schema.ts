// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';


export const workspace_groupsWorkspace_idNameCompoundUniqueInputObjectSchema: z.ZodType<Prisma.workspace_groupsWorkspace_idNameCompoundUniqueInput, Prisma.workspace_groupsWorkspace_idNameCompoundUniqueInput> = z.object({
  workspace_id: z.string(),
  name: z.string()
}).strict();
export const workspace_groupsWorkspace_idNameCompoundUniqueInputObjectZodSchema = z.object({
  workspace_id: z.string(),
  name: z.string()
}).strict();
