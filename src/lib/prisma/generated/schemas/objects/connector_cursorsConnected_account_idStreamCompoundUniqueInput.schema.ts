// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';


export const connector_cursorsConnected_account_idStreamCompoundUniqueInputObjectSchema: z.ZodType<Prisma.connector_cursorsConnected_account_idStreamCompoundUniqueInput, Prisma.connector_cursorsConnected_account_idStreamCompoundUniqueInput> = z.object({
  connected_account_id: z.string(),
  stream: z.string()
}).strict();
export const connector_cursorsConnected_account_idStreamCompoundUniqueInputObjectZodSchema = z.object({
  connected_account_id: z.string(),
  stream: z.string()
}).strict();
