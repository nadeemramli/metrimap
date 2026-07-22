// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';


export const SpacesCountOutputTypeSelectObjectSchema: z.ZodType<Prisma.SpacesCountOutputTypeSelect, Prisma.SpacesCountOutputTypeSelect> = z.object({
  projects: z.boolean().optional()
}).strict();
export const SpacesCountOutputTypeSelectObjectZodSchema = z.object({
  projects: z.boolean().optional()
}).strict();
