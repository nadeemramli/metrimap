// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';


export const connected_accountsUpdategranted_scopesInputObjectSchema: z.ZodType<Prisma.connected_accountsUpdategranted_scopesInput, Prisma.connected_accountsUpdategranted_scopesInput> = z.object({
  set: z.string().array().optional(),
  push: z.union([z.string(), z.string().array()]).optional()
}).strict();
export const connected_accountsUpdategranted_scopesInputObjectZodSchema = z.object({
  set: z.string().array().optional(),
  push: z.union([z.string(), z.string().array()]).optional()
}).strict();
