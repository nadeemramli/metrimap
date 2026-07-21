// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';


export const group_membersCreateWithoutWorkspace_groupsInputObjectSchema: z.ZodType<Prisma.group_membersCreateWithoutWorkspace_groupsInput, Prisma.group_membersCreateWithoutWorkspace_groupsInput> = z.object({
  user_id: z.string(),
  added_by: z.string().optional(),
  added_at: z.union([z.date(), z.string().datetime()]).optional()
}).strict();
export const group_membersCreateWithoutWorkspace_groupsInputObjectZodSchema = z.object({
  user_id: z.string(),
  added_by: z.string().optional(),
  added_at: z.union([z.date(), z.string().datetime()]).optional()
}).strict();
