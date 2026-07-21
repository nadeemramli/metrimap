// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { StringFieldUpdateOperationsInputObjectSchema } from './StringFieldUpdateOperationsInput.schema';
import { DateTimeFieldUpdateOperationsInputObjectSchema } from './DateTimeFieldUpdateOperationsInput.schema';
import { source_connectionsUpdateOneRequiredWithoutSource_connection_secretsNestedInputObjectSchema } from './source_connectionsUpdateOneRequiredWithoutSource_connection_secretsNestedInput.schema'

export const source_connection_secretsUpdateInputObjectSchema: z.ZodType<Prisma.source_connection_secretsUpdateInput, Prisma.source_connection_secretsUpdateInput> = z.object({
  password: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  updated_at: z.union([z.union([z.date(), z.string().datetime()]), z.lazy(() => DateTimeFieldUpdateOperationsInputObjectSchema)]).optional(),
  source_connections: z.lazy(() => source_connectionsUpdateOneRequiredWithoutSource_connection_secretsNestedInputObjectSchema).optional()
}).strict();
export const source_connection_secretsUpdateInputObjectZodSchema = z.object({
  password: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  updated_at: z.union([z.union([z.date(), z.string().datetime()]), z.lazy(() => DateTimeFieldUpdateOperationsInputObjectSchema)]).optional(),
  source_connections: z.lazy(() => source_connectionsUpdateOneRequiredWithoutSource_connection_secretsNestedInputObjectSchema).optional()
}).strict();
