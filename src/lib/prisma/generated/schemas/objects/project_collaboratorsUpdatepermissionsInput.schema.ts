import { z } from 'zod';
import type { Prisma } from '@prisma/client';


export const project_collaboratorsUpdatepermissionsInputObjectSchema: z.ZodType<Prisma.project_collaboratorsUpdatepermissionsInput, Prisma.project_collaboratorsUpdatepermissionsInput> = z.object({
  set: z.string().array().optional(),
  push: z.union([z.string(), z.string().array()]).optional()
}).strict();
export const project_collaboratorsUpdatepermissionsInputObjectZodSchema = z.object({
  set: z.string().array().optional(),
  push: z.union([z.string(), z.string().array()]).optional()
}).strict();
