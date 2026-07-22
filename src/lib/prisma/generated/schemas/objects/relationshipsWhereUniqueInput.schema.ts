// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { relationshipsSource_idTarget_idCompoundUniqueInputObjectSchema } from './relationshipsSource_idTarget_idCompoundUniqueInput.schema'

export const relationshipsWhereUniqueInputObjectSchema: z.ZodType<Prisma.relationshipsWhereUniqueInput, Prisma.relationshipsWhereUniqueInput> = z.object({
  id: z.string(),
  source_id_target_id: z.lazy(() => relationshipsSource_idTarget_idCompoundUniqueInputObjectSchema)
}).strict();
export const relationshipsWhereUniqueInputObjectZodSchema = z.object({
  id: z.string(),
  source_id_target_id: z.lazy(() => relationshipsSource_idTarget_idCompoundUniqueInputObjectSchema)
}).strict();
