// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';


export const source_connection_secretsWhereUniqueInputObjectSchema: z.ZodType<Prisma.source_connection_secretsWhereUniqueInput, Prisma.source_connection_secretsWhereUniqueInput> = z.object({
  connection_id: z.string()
}).strict();
export const source_connection_secretsWhereUniqueInputObjectZodSchema = z.object({
  connection_id: z.string()
}).strict();
