// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';


export const group_membersCreateManyWorkspace_groupsInputObjectSchema: z.ZodType<Prisma.group_membersCreateManyWorkspace_groupsInput, Prisma.group_membersCreateManyWorkspace_groupsInput> = z.object({
  user_id: z.string(),
  added_by: z.string().optional(),
  added_at: z.union([z.date(), z.string().datetime()]).optional()
}).strict();
export const group_membersCreateManyWorkspace_groupsInputObjectZodSchema = z.object({
  user_id: z.string(),
  added_by: z.string().optional(),
  added_at: z.union([z.date(), z.string().datetime()]).optional()
}).strict();
