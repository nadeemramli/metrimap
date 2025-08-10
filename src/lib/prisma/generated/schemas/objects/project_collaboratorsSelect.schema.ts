import { z } from 'zod';
import type { Prisma } from '@prisma/client';


export const project_collaboratorsSelectObjectSchema: z.ZodType<Prisma.project_collaboratorsSelect, Prisma.project_collaboratorsSelect> = z.object({
  id: z.boolean().optional(),
  project_id: z.boolean().optional(),
  user_id: z.boolean().optional(),
  role: z.boolean().optional(),
  permissions: z.boolean().optional(),
  invited_at: z.boolean().optional(),
  joined_at: z.boolean().optional()
}).strict();
export const project_collaboratorsSelectObjectZodSchema = z.object({
  id: z.boolean().optional(),
  project_id: z.boolean().optional(),
  user_id: z.boolean().optional(),
  role: z.boolean().optional(),
  permissions: z.boolean().optional(),
  invited_at: z.boolean().optional(),
  joined_at: z.boolean().optional()
}).strict();
