// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { projectsCreateNestedManyWithoutSpacesInputObjectSchema } from './projectsCreateNestedManyWithoutSpacesInput.schema'

export const spacesCreateInputObjectSchema: z.ZodType<Prisma.spacesCreateInput, Prisma.spacesCreateInput> = z.object({
  id: z.string().optional(),
  created_by: z.string().optional(),
  name: z.string(),
  color: z.string().optional().nullable(),
  sort_order: z.number().int().optional(),
  created_at: z.union([z.date(), z.string().datetime()]).optional(),
  updated_at: z.union([z.date(), z.string().datetime()]).optional(),
  workspace_id: z.string().optional().nullable(),
  projects: z.lazy(() => projectsCreateNestedManyWithoutSpacesInputObjectSchema).optional()
}).strict();
export const spacesCreateInputObjectZodSchema = z.object({
  id: z.string().optional(),
  created_by: z.string().optional(),
  name: z.string(),
  color: z.string().optional().nullable(),
  sort_order: z.number().int().optional(),
  created_at: z.union([z.date(), z.string().datetime()]).optional(),
  updated_at: z.union([z.date(), z.string().datetime()]).optional(),
  workspace_id: z.string().optional().nullable(),
  projects: z.lazy(() => projectsCreateNestedManyWithoutSpacesInputObjectSchema).optional()
}).strict();
