// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { projectsUncheckedCreateNestedManyWithoutSpacesInputObjectSchema } from './projectsUncheckedCreateNestedManyWithoutSpacesInput.schema'

export const spacesUncheckedCreateInputObjectSchema: z.ZodType<Prisma.spacesUncheckedCreateInput, Prisma.spacesUncheckedCreateInput> = z.object({
  id: z.string().optional(),
  created_by: z.string().optional(),
  name: z.string(),
  color: z.string().optional().nullable(),
  sort_order: z.number().int().optional(),
  created_at: z.union([z.date(), z.string().datetime()]).optional(),
  updated_at: z.union([z.date(), z.string().datetime()]).optional(),
  workspace_id: z.string().optional().nullable(),
  projects: z.lazy(() => projectsUncheckedCreateNestedManyWithoutSpacesInputObjectSchema).optional()
}).strict();
export const spacesUncheckedCreateInputObjectZodSchema = z.object({
  id: z.string().optional(),
  created_by: z.string().optional(),
  name: z.string(),
  color: z.string().optional().nullable(),
  sort_order: z.number().int().optional(),
  created_at: z.union([z.date(), z.string().datetime()]).optional(),
  updated_at: z.union([z.date(), z.string().datetime()]).optional(),
  workspace_id: z.string().optional().nullable(),
  projects: z.lazy(() => projectsUncheckedCreateNestedManyWithoutSpacesInputObjectSchema).optional()
}).strict();
