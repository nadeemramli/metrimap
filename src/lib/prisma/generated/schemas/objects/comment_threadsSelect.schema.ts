import { z } from 'zod';
import type { Prisma } from '@prisma/client';


export const comment_threadsSelectObjectSchema: z.ZodType<Prisma.comment_threadsSelect, Prisma.comment_threadsSelect> = z.object({
  id: z.boolean().optional(),
  project_id: z.boolean().optional(),
  source: z.boolean().optional(),
  context: z.boolean().optional(),
  is_resolved: z.boolean().optional(),
  created_by: z.boolean().optional(),
  created_at: z.boolean().optional(),
  updated_at: z.boolean().optional()
}).strict();
export const comment_threadsSelectObjectZodSchema = z.object({
  id: z.boolean().optional(),
  project_id: z.boolean().optional(),
  source: z.boolean().optional(),
  context: z.boolean().optional(),
  is_resolved: z.boolean().optional(),
  created_by: z.boolean().optional(),
  created_at: z.boolean().optional(),
  updated_at: z.boolean().optional()
}).strict();
