// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { StringFieldUpdateOperationsInputObjectSchema } from './StringFieldUpdateOperationsInput.schema';
import { NullableStringFieldUpdateOperationsInputObjectSchema } from './NullableStringFieldUpdateOperationsInput.schema';
import { connected_accountsUpdategranted_scopesInputObjectSchema } from './connected_accountsUpdategranted_scopesInput.schema';
import { NullableDateTimeFieldUpdateOperationsInputObjectSchema } from './NullableDateTimeFieldUpdateOperationsInput.schema';
import { DateTimeFieldUpdateOperationsInputObjectSchema } from './DateTimeFieldUpdateOperationsInput.schema';
import { connected_account_secretsUncheckedUpdateOneWithoutConnected_accountsNestedInputObjectSchema } from './connected_account_secretsUncheckedUpdateOneWithoutConnected_accountsNestedInput.schema';
import { connector_cursorsUncheckedUpdateManyWithoutConnected_accountsNestedInputObjectSchema } from './connector_cursorsUncheckedUpdateManyWithoutConnected_accountsNestedInput.schema';
import { connector_runsUncheckedUpdateManyWithoutConnected_accountsNestedInputObjectSchema } from './connector_runsUncheckedUpdateManyWithoutConnected_accountsNestedInput.schema';
import { metric_bindingsUncheckedUpdateManyWithoutConnected_accountsNestedInputObjectSchema } from './metric_bindingsUncheckedUpdateManyWithoutConnected_accountsNestedInput.schema'

export const connected_accountsUncheckedUpdateInputObjectSchema: z.ZodType<Prisma.connected_accountsUncheckedUpdateInput, Prisma.connected_accountsUncheckedUpdateInput> = z.object({
  created_by: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  workspace_id: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  connector_id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  auth_type: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  source_account_id: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  source_account_label: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  granted_scopes: z.union([z.lazy(() => connected_accountsUpdategranted_scopesInputObjectSchema), z.string().array()]).optional(),
  status: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  status_detail: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  last_synced_at: z.union([z.union([z.date(), z.string().datetime()]), z.lazy(() => NullableDateTimeFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  last_query_at: z.union([z.union([z.date(), z.string().datetime()]), z.lazy(() => NullableDateTimeFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  revoked_at: z.union([z.union([z.date(), z.string().datetime()]), z.lazy(() => NullableDateTimeFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  created_at: z.union([z.union([z.date(), z.string().datetime()]), z.lazy(() => DateTimeFieldUpdateOperationsInputObjectSchema)]).optional(),
  updated_at: z.union([z.union([z.date(), z.string().datetime()]), z.lazy(() => DateTimeFieldUpdateOperationsInputObjectSchema)]).optional(),
  connected_account_secrets: z.lazy(() => connected_account_secretsUncheckedUpdateOneWithoutConnected_accountsNestedInputObjectSchema).optional(),
  connector_cursors: z.lazy(() => connector_cursorsUncheckedUpdateManyWithoutConnected_accountsNestedInputObjectSchema).optional(),
  connector_runs: z.lazy(() => connector_runsUncheckedUpdateManyWithoutConnected_accountsNestedInputObjectSchema).optional(),
  metric_bindings: z.lazy(() => metric_bindingsUncheckedUpdateManyWithoutConnected_accountsNestedInputObjectSchema).optional()
}).strict();
export const connected_accountsUncheckedUpdateInputObjectZodSchema = z.object({
  created_by: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  workspace_id: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  connector_id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  auth_type: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  source_account_id: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  source_account_label: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  granted_scopes: z.union([z.lazy(() => connected_accountsUpdategranted_scopesInputObjectSchema), z.string().array()]).optional(),
  status: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  status_detail: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  last_synced_at: z.union([z.union([z.date(), z.string().datetime()]), z.lazy(() => NullableDateTimeFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  last_query_at: z.union([z.union([z.date(), z.string().datetime()]), z.lazy(() => NullableDateTimeFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  revoked_at: z.union([z.union([z.date(), z.string().datetime()]), z.lazy(() => NullableDateTimeFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  created_at: z.union([z.union([z.date(), z.string().datetime()]), z.lazy(() => DateTimeFieldUpdateOperationsInputObjectSchema)]).optional(),
  updated_at: z.union([z.union([z.date(), z.string().datetime()]), z.lazy(() => DateTimeFieldUpdateOperationsInputObjectSchema)]).optional(),
  connected_account_secrets: z.lazy(() => connected_account_secretsUncheckedUpdateOneWithoutConnected_accountsNestedInputObjectSchema).optional(),
  connector_cursors: z.lazy(() => connector_cursorsUncheckedUpdateManyWithoutConnected_accountsNestedInputObjectSchema).optional(),
  connector_runs: z.lazy(() => connector_runsUncheckedUpdateManyWithoutConnected_accountsNestedInputObjectSchema).optional(),
  metric_bindings: z.lazy(() => metric_bindingsUncheckedUpdateManyWithoutConnected_accountsNestedInputObjectSchema).optional()
}).strict();
