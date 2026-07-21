// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';


export const relationshipsSource_idTarget_idCompoundUniqueInputObjectSchema: z.ZodType<Prisma.relationshipsSource_idTarget_idCompoundUniqueInput, Prisma.relationshipsSource_idTarget_idCompoundUniqueInput> = z.object({
  source_id: z.string(),
  target_id: z.string()
}).strict();
export const relationshipsSource_idTarget_idCompoundUniqueInputObjectZodSchema = z.object({
  source_id: z.string(),
  target_id: z.string()
}).strict();
