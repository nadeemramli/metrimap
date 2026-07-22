// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';


export const api_keysWhereUniqueInputObjectSchema: z.ZodType<Prisma.api_keysWhereUniqueInput, Prisma.api_keysWhereUniqueInput> = z.object({
  id: z.string(),
  key_hash: z.string()
}).strict();
export const api_keysWhereUniqueInputObjectZodSchema = z.object({
  id: z.string(),
  key_hash: z.string()
}).strict();
