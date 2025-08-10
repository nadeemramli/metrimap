import { z } from 'zod';
import type { Prisma } from '@prisma/client';


export const groupsCreatenode_idsInputObjectSchema: z.ZodType<Prisma.groupsCreatenode_idsInput, Prisma.groupsCreatenode_idsInput> = z.object({
  set: z.string().array()
}).strict();
export const groupsCreatenode_idsInputObjectZodSchema = z.object({
  set: z.string().array()
}).strict();
