// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { NullableStringFieldUpdateOperationsInputObjectSchema } from './NullableStringFieldUpdateOperationsInput.schema';
import { NullableFloatFieldUpdateOperationsInputObjectSchema } from './NullableFloatFieldUpdateOperationsInput.schema';
import { StringFieldUpdateOperationsInputObjectSchema } from './StringFieldUpdateOperationsInput.schema';
import { DateTimeFieldUpdateOperationsInputObjectSchema } from './DateTimeFieldUpdateOperationsInput.schema';
import { projectsUpdateOneWithoutRelationship_historyNestedInputObjectSchema } from './projectsUpdateOneWithoutRelationship_historyNestedInput.schema';
import { relationshipsUpdateOneRequiredWithoutRelationship_historyNestedInputObjectSchema } from './relationshipsUpdateOneRequiredWithoutRelationship_historyNestedInput.schema'

export const relationship_historyUpdateInputObjectSchema: z.ZodType<Prisma.relationship_historyUpdateInput, Prisma.relationship_historyUpdateInput> = z.object({
  type: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  confidence: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  weight: z.union([z.number(), z.lazy(() => NullableFloatFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  changed_by: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  created_at: z.union([z.union([z.date(), z.string().datetime()]), z.lazy(() => DateTimeFieldUpdateOperationsInputObjectSchema)]).optional(),
  projects: z.lazy(() => projectsUpdateOneWithoutRelationship_historyNestedInputObjectSchema).optional(),
  relationships: z.lazy(() => relationshipsUpdateOneRequiredWithoutRelationship_historyNestedInputObjectSchema).optional()
}).strict();
export const relationship_historyUpdateInputObjectZodSchema = z.object({
  type: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  confidence: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  weight: z.union([z.number(), z.lazy(() => NullableFloatFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  changed_by: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  created_at: z.union([z.union([z.date(), z.string().datetime()]), z.lazy(() => DateTimeFieldUpdateOperationsInputObjectSchema)]).optional(),
  projects: z.lazy(() => projectsUpdateOneWithoutRelationship_historyNestedInputObjectSchema).optional(),
  relationships: z.lazy(() => relationshipsUpdateOneRequiredWithoutRelationship_historyNestedInputObjectSchema).optional()
}).strict();
