import { z } from 'zod';
import type { Prisma } from '@prisma/client';


export const projectsSelectObjectSchema: z.ZodType<Prisma.projectsSelect, Prisma.projectsSelect> = z.object({
  id: z.boolean().optional(),
  name: z.boolean().optional(),
  description: z.boolean().optional(),
  tags: z.boolean().optional(),
  settings: z.boolean().optional(),
  created_at: z.boolean().optional(),
  updated_at: z.boolean().optional(),
  last_modified_by: z.boolean().optional(),
  created_by: z.boolean().optional(),
  is_public: z.boolean().optional()
}).strict();
export const projectsSelectObjectZodSchema = z.object({
  id: z.boolean().optional(),
  name: z.boolean().optional(),
  description: z.boolean().optional(),
  tags: z.boolean().optional(),
  settings: z.boolean().optional(),
  created_at: z.boolean().optional(),
  updated_at: z.boolean().optional(),
  last_modified_by: z.boolean().optional(),
  created_by: z.boolean().optional(),
  is_public: z.boolean().optional()
}).strict();
