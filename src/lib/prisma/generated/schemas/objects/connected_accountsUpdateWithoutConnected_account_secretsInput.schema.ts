// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { StringFieldUpdateOperationsInputObjectSchema } from './StringFieldUpdateOperationsInput.schema';
import { NullableStringFieldUpdateOperationsInputObjectSchema } from './NullableStringFieldUpdateOperationsInput.schema';
import { connected_accountsUpdategranted_scopesInputObjectSchema } from './connected_accountsUpdategranted_scopesInput.schema';
import { NullableDateTimeFieldUpdateOperationsInputObjectSchema } from './NullableDateTimeFieldUpdateOperationsInput.schema';
import { DateTimeFieldUpdateOperationsInputObjectSchema } from './DateTimeFieldUpdateOperationsInput.schema';
import { connector_cursorsUpdateManyWithoutConnected_accountsNestedInputObjectSchema } from './connector_cursorsUpdateManyWithoutConnected_accountsNestedInput.schema';
import { connector_runsUpdateManyWithoutConnected_accountsNestedInputObjectSchema } from './connector_runsUpdateManyWithoutConnected_accountsNestedInput.schema';
import { metric_bindingsUpdateManyWithoutConnected_accountsNestedInputObjectSchema } from './metric_bindingsUpdateManyWithoutConnected_accountsNestedInput.schema'

export const connected_accountsUpdateWithoutConnected_account_secretsInputObjectSchema: z.ZodType<Prisma.connected_accountsUpdateWithoutConnected_account_secretsInput, Prisma.connected_accountsUpdateWithoutConnected_account_secretsInput> = z.object({
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
  connector_cursors: z.lazy(() => connector_cursorsUpdateManyWithoutConnected_accountsNestedInputObjectSchema).optional(),
  connector_runs: z.lazy(() => connector_runsUpdateManyWithoutConnected_accountsNestedInputObjectSchema).optional(),
  metric_bindings: z.lazy(() => metric_bindingsUpdateManyWithoutConnected_accountsNestedInputObjectSchema).optional()
}).strict();
export const connected_accountsUpdateWithoutConnected_account_secretsInputObjectZodSchema = z.object({
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
  connector_cursors: z.lazy(() => connector_cursorsUpdateManyWithoutConnected_accountsNestedInputObjectSchema).optional(),
  connector_runs: z.lazy(() => connector_runsUpdateManyWithoutConnected_accountsNestedInputObjectSchema).optional(),
  metric_bindings: z.lazy(() => metric_bindingsUpdateManyWithoutConnected_accountsNestedInputObjectSchema).optional()
}).strict();
