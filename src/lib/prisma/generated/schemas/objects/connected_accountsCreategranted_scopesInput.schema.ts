// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';


export const connected_accountsCreategranted_scopesInputObjectSchema: z.ZodType<Prisma.connected_accountsCreategranted_scopesInput, Prisma.connected_accountsCreategranted_scopesInput> = z.object({
  set: z.string().array()
}).strict();
export const connected_accountsCreategranted_scopesInputObjectZodSchema = z.object({
  set: z.string().array()
}).strict();
