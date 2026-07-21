// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';


export const source_connection_secretsUncheckedCreateWithoutSource_connectionsInputObjectSchema: z.ZodType<Prisma.source_connection_secretsUncheckedCreateWithoutSource_connectionsInput, Prisma.source_connection_secretsUncheckedCreateWithoutSource_connectionsInput> = z.object({
  password: z.string(),
  updated_at: z.union([z.date(), z.string().datetime()]).optional()
}).strict();
export const source_connection_secretsUncheckedCreateWithoutSource_connectionsInputObjectZodSchema = z.object({
  password: z.string(),
  updated_at: z.union([z.date(), z.string().datetime()]).optional()
}).strict();
