// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';


export const connected_accountsWorkspace_idConnector_idSource_account_idCompoundUniqueInputObjectSchema: z.ZodType<Prisma.connected_accountsWorkspace_idConnector_idSource_account_idCompoundUniqueInput, Prisma.connected_accountsWorkspace_idConnector_idSource_account_idCompoundUniqueInput> = z.object({
  workspace_id: z.string(),
  connector_id: z.string(),
  source_account_id: z.string()
}).strict();
export const connected_accountsWorkspace_idConnector_idSource_account_idCompoundUniqueInputObjectZodSchema = z.object({
  workspace_id: z.string(),
  connector_id: z.string(),
  source_account_id: z.string()
}).strict();
