import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { NullableStringFieldUpdateOperationsInputObjectSchema } from './NullableStringFieldUpdateOperationsInput.schema';
import { StringFieldUpdateOperationsInputObjectSchema } from './StringFieldUpdateOperationsInput.schema';
import { FloatFieldUpdateOperationsInputObjectSchema } from './FloatFieldUpdateOperationsInput.schema';
import { NullableJsonNullValueInputSchema } from '../enums/NullableJsonNullValueInput.schema';
import { metric_cardsUpdatecausal_factorsInputObjectSchema } from './metric_cardsUpdatecausal_factorsInput.schema';
import { metric_cardsUpdatedimensionsInputObjectSchema } from './metric_cardsUpdatedimensionsInput.schema';
import { metric_cardsUpdateassigneesInputObjectSchema } from './metric_cardsUpdateassigneesInput.schema';
import { NullableDateTimeFieldUpdateOperationsInputObjectSchema } from './NullableDateTimeFieldUpdateOperationsInput.schema'


const literalSchema = z.union([z.string(), z.number(), z.boolean()]);
const jsonSchema = z.lazy(() =>
  z.union([literalSchema, z.array(jsonSchema.nullable()), z.record(z.string(), jsonSchema.nullable())])
);

export const metric_cardsUncheckedUpdateInputObjectSchema: z.ZodType<Prisma.metric_cardsUncheckedUpdateInput, Prisma.metric_cardsUncheckedUpdateInput> = z.object({
  project_id: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  title: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  description: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  category: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  sub_category: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  position_x: z.union([z.number(), z.lazy(() => FloatFieldUpdateOperationsInputObjectSchema)]).optional(),
  position_y: z.union([z.number(), z.lazy(() => FloatFieldUpdateOperationsInputObjectSchema)]).optional(),
  data: z.union([NullableJsonNullValueInputSchema, jsonSchema]).optional(),
  source_type: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  formula: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  causal_factors: z.union([z.lazy(() => metric_cardsUpdatecausal_factorsInputObjectSchema), z.string().array()]).optional(),
  dimensions: z.union([z.lazy(() => metric_cardsUpdatedimensionsInputObjectSchema), z.string().array()]).optional(),
  owner_id: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  assignees: z.union([z.lazy(() => metric_cardsUpdateassigneesInputObjectSchema), z.string().array()]).optional(),
  created_at: z.union([z.union([z.date(), z.iso.datetime()]), z.lazy(() => NullableDateTimeFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  updated_at: z.union([z.union([z.date(), z.iso.datetime()]), z.lazy(() => NullableDateTimeFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  created_by: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional()
}).strict();
export const metric_cardsUncheckedUpdateInputObjectZodSchema = z.object({
  project_id: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  title: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  description: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  category: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  sub_category: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  position_x: z.union([z.number(), z.lazy(() => FloatFieldUpdateOperationsInputObjectSchema)]).optional(),
  position_y: z.union([z.number(), z.lazy(() => FloatFieldUpdateOperationsInputObjectSchema)]).optional(),
  data: z.union([NullableJsonNullValueInputSchema, jsonSchema]).optional(),
  source_type: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  formula: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  causal_factors: z.union([z.lazy(() => metric_cardsUpdatecausal_factorsInputObjectSchema), z.string().array()]).optional(),
  dimensions: z.union([z.lazy(() => metric_cardsUpdatedimensionsInputObjectSchema), z.string().array()]).optional(),
  owner_id: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  assignees: z.union([z.lazy(() => metric_cardsUpdateassigneesInputObjectSchema), z.string().array()]).optional(),
  created_at: z.union([z.union([z.date(), z.iso.datetime()]), z.lazy(() => NullableDateTimeFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  updated_at: z.union([z.union([z.date(), z.iso.datetime()]), z.lazy(() => NullableDateTimeFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  created_by: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional()
}).strict();
