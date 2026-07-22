// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';


export const source_connection_secretsUncheckedCreateInputObjectSchema: z.ZodType<Prisma.source_connection_secretsUncheckedCreateInput, Prisma.source_connection_secretsUncheckedCreateInput> = z.object({
  connection_id: z.string(),
  password: z.string(),
  updated_at: z.union([z.date(), z.string().datetime()]).optional()
}).strict();
export const source_connection_secretsUncheckedCreateInputObjectZodSchema = z.object({
  connection_id: z.string(),
  password: z.string(),
  updated_at: z.union([z.date(), z.string().datetime()]).optional()
}).strict();
