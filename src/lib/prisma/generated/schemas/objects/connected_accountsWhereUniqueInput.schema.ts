// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { connected_accountsWorkspace_idConnector_idSource_account_idCompoundUniqueInputObjectSchema } from './connected_accountsWorkspace_idConnector_idSource_account_idCompoundUniqueInput.schema'

export const connected_accountsWhereUniqueInputObjectSchema: z.ZodType<Prisma.connected_accountsWhereUniqueInput, Prisma.connected_accountsWhereUniqueInput> = z.object({
  id: z.string(),
  workspace_id_connector_id_source_account_id: z.lazy(() => connected_accountsWorkspace_idConnector_idSource_account_idCompoundUniqueInputObjectSchema)
}).strict();
export const connected_accountsWhereUniqueInputObjectZodSchema = z.object({
  id: z.string(),
  workspace_id_connector_id_source_account_id: z.lazy(() => connected_accountsWorkspace_idConnector_idSource_account_idCompoundUniqueInputObjectSchema)
}).strict();
