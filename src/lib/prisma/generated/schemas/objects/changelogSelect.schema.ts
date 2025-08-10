import { z } from 'zod';
import type { Prisma } from '@prisma/client';


export const changelogSelectObjectSchema: z.ZodType<Prisma.changelogSelect, Prisma.changelogSelect> = z.object({
  id: z.boolean().optional(),
  project_id: z.boolean().optional(),
  user_id: z.boolean().optional(),
  action: z.boolean().optional(),
  target: z.boolean().optional(),
  target_id: z.boolean().optional(),
  target_name: z.boolean().optional(),
  description: z.boolean().optional(),
  metadata: z.boolean().optional(),
  timestamp: z.boolean().optional()
}).strict();
export const changelogSelectObjectZodSchema = z.object({
  id: z.boolean().optional(),
  project_id: z.boolean().optional(),
  user_id: z.boolean().optional(),
  action: z.boolean().optional(),
  target: z.boolean().optional(),
  target_id: z.boolean().optional(),
  target_name: z.boolean().optional(),
  description: z.boolean().optional(),
  metadata: z.boolean().optional(),
  timestamp: z.boolean().optional()
}).strict();
