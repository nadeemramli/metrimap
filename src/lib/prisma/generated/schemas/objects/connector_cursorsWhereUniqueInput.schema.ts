// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { connector_cursorsConnected_account_idStreamCompoundUniqueInputObjectSchema } from './connector_cursorsConnected_account_idStreamCompoundUniqueInput.schema'

export const connector_cursorsWhereUniqueInputObjectSchema: z.ZodType<Prisma.connector_cursorsWhereUniqueInput, Prisma.connector_cursorsWhereUniqueInput> = z.object({
  connected_account_id_stream: z.lazy(() => connector_cursorsConnected_account_idStreamCompoundUniqueInputObjectSchema)
}).strict();
export const connector_cursorsWhereUniqueInputObjectZodSchema = z.object({
  connected_account_id_stream: z.lazy(() => connector_cursorsConnected_account_idStreamCompoundUniqueInputObjectSchema)
}).strict();
