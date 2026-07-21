// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';


export const group_membersCreateManyInputObjectSchema: z.ZodType<Prisma.group_membersCreateManyInput, Prisma.group_membersCreateManyInput> = z.object({
  group_id: z.string(),
  user_id: z.string(),
  added_by: z.string().optional(),
  added_at: z.union([z.date(), z.string().datetime()]).optional()
}).strict();
export const group_membersCreateManyInputObjectZodSchema = z.object({
  group_id: z.string(),
  user_id: z.string(),
  added_by: z.string().optional(),
  added_at: z.union([z.date(), z.string().datetime()]).optional()
}).strict();
