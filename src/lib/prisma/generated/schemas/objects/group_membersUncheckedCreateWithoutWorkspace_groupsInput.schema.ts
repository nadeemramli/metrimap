// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';


export const group_membersUncheckedCreateWithoutWorkspace_groupsInputObjectSchema: z.ZodType<Prisma.group_membersUncheckedCreateWithoutWorkspace_groupsInput, Prisma.group_membersUncheckedCreateWithoutWorkspace_groupsInput> = z.object({
  user_id: z.string(),
  added_by: z.string().optional(),
  added_at: z.union([z.date(), z.string().datetime()]).optional()
}).strict();
export const group_membersUncheckedCreateWithoutWorkspace_groupsInputObjectZodSchema = z.object({
  user_id: z.string(),
  added_by: z.string().optional(),
  added_at: z.union([z.date(), z.string().datetime()]).optional()
}).strict();
