// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';


export const connected_account_secretsWhereUniqueInputObjectSchema: z.ZodType<Prisma.connected_account_secretsWhereUniqueInput, Prisma.connected_account_secretsWhereUniqueInput> = z.object({
  account_id: z.string()
}).strict();
export const connected_account_secretsWhereUniqueInputObjectZodSchema = z.object({
  account_id: z.string()
}).strict();
