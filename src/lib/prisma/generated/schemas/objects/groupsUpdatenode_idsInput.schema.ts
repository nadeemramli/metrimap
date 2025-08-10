import { z } from 'zod';
import type { Prisma } from '@prisma/client';


export const groupsUpdatenode_idsInputObjectSchema: z.ZodType<Prisma.groupsUpdatenode_idsInput, Prisma.groupsUpdatenode_idsInput> = z.object({
  set: z.string().array().optional(),
  push: z.union([z.string(), z.string().array()]).optional()
}).strict();
export const groupsUpdatenode_idsInputObjectZodSchema = z.object({
  set: z.string().array().optional(),
  push: z.union([z.string(), z.string().array()]).optional()
}).strict();
