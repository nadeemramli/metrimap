import { z } from 'zod';
import type { Prisma } from '@prisma/client';


export const project_collaboratorsCreatepermissionsInputObjectSchema: z.ZodType<Prisma.project_collaboratorsCreatepermissionsInput, Prisma.project_collaboratorsCreatepermissionsInput> = z.object({
  set: z.string().array()
}).strict();
export const project_collaboratorsCreatepermissionsInputObjectZodSchema = z.object({
  set: z.string().array()
}).strict();
