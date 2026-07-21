// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';


export const group_membersUncheckedCreateInputObjectSchema: z.ZodType<Prisma.group_membersUncheckedCreateInput, Prisma.group_membersUncheckedCreateInput> = z.object({
  group_id: z.string(),
  user_id: z.string(),
  added_by: z.string().optional(),
  added_at: z.union([z.date(), z.string().datetime()]).optional()
}).strict();
export const group_membersUncheckedCreateInputObjectZodSchema = z.object({
  group_id: z.string(),
  user_id: z.string(),
  added_by: z.string().optional(),
  added_at: z.union([z.date(), z.string().datetime()]).optional()
}).strict();
