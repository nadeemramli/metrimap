// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';


export const spacesUncheckedCreateWithoutProjectsInputObjectSchema: z.ZodType<Prisma.spacesUncheckedCreateWithoutProjectsInput, Prisma.spacesUncheckedCreateWithoutProjectsInput> = z.object({
  id: z.string().optional(),
  created_by: z.string().optional(),
  name: z.string(),
  color: z.string().optional().nullable(),
  sort_order: z.number().int().optional(),
  created_at: z.union([z.date(), z.string().datetime()]).optional(),
  updated_at: z.union([z.date(), z.string().datetime()]).optional(),
  workspace_id: z.string().optional().nullable()
}).strict();
export const spacesUncheckedCreateWithoutProjectsInputObjectZodSchema = z.object({
  id: z.string().optional(),
  created_by: z.string().optional(),
  name: z.string(),
  color: z.string().optional().nullable(),
  sort_order: z.number().int().optional(),
  created_at: z.union([z.date(), z.string().datetime()]).optional(),
  updated_at: z.union([z.date(), z.string().datetime()]).optional(),
  workspace_id: z.string().optional().nullable()
}).strict();
