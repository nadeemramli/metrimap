// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { StringFieldUpdateOperationsInputObjectSchema } from './StringFieldUpdateOperationsInput.schema';
import { DateTimeFieldUpdateOperationsInputObjectSchema } from './DateTimeFieldUpdateOperationsInput.schema';
import { NullableStringFieldUpdateOperationsInputObjectSchema } from './NullableStringFieldUpdateOperationsInput.schema';
import { NullableDateTimeFieldUpdateOperationsInputObjectSchema } from './NullableDateTimeFieldUpdateOperationsInput.schema';
import { NullableJsonNullValueInputSchema } from '../enums/NullableJsonNullValueInput.schema';
import { BoolFieldUpdateOperationsInputObjectSchema } from './BoolFieldUpdateOperationsInput.schema';
import { metric_cardsUpdateOneWithoutEvidence_itemsNestedInputObjectSchema } from './metric_cardsUpdateOneWithoutEvidence_itemsNestedInput.schema';
import { usersUpdateOneRequiredWithoutEvidence_items_evidence_items_created_byTousersNestedInputObjectSchema } from './usersUpdateOneRequiredWithoutEvidence_items_evidence_items_created_byTousersNestedInput.schema';
import { usersUpdateOneWithoutEvidence_items_evidence_items_owner_idTousersNestedInputObjectSchema } from './usersUpdateOneWithoutEvidence_items_evidence_items_owner_idTousersNestedInput.schema';
import { projectsUpdateOneWithoutEvidence_itemsNestedInputObjectSchema } from './projectsUpdateOneWithoutEvidence_itemsNestedInput.schema';
import { relationshipsUpdateOneWithoutEvidence_itemsNestedInputObjectSchema } from './relationshipsUpdateOneWithoutEvidence_itemsNestedInput.schema'


const literalSchema = z.union([z.string(), z.number(), z.boolean()]);
const jsonSchema = z.lazy(() =>
  z.union([literalSchema, z.array(jsonSchema.nullable()), z.record(z.string(), jsonSchema.nullable())])
);

export const evidence_itemsUpdateInputObjectSchema: z.ZodType<Prisma.evidence_itemsUpdateInput, Prisma.evidence_itemsUpdateInput> = z.object({
  title: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  type: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  date: z.union([z.union([z.date(), z.string().datetime()]), z.lazy(() => DateTimeFieldUpdateOperationsInputObjectSchema)]).optional(),
  link: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  hypothesis: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  summary: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  impact_on_confidence: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  created_at: z.union([z.union([z.date(), z.string().datetime()]), z.lazy(() => NullableDateTimeFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  updated_at: z.union([z.union([z.date(), z.string().datetime()]), z.lazy(() => NullableDateTimeFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  content: z.union([NullableJsonNullValueInputSchema, jsonSchema]).optional(),
  is_public: z.union([z.boolean(), z.lazy(() => BoolFieldUpdateOperationsInputObjectSchema)]).optional(),
  metric_cards: z.lazy(() => metric_cardsUpdateOneWithoutEvidence_itemsNestedInputObjectSchema).optional(),
  users_evidence_items_created_byTousers: z.lazy(() => usersUpdateOneRequiredWithoutEvidence_items_evidence_items_created_byTousersNestedInputObjectSchema).optional(),
  users_evidence_items_owner_idTousers: z.lazy(() => usersUpdateOneWithoutEvidence_items_evidence_items_owner_idTousersNestedInputObjectSchema).optional(),
  projects: z.lazy(() => projectsUpdateOneWithoutEvidence_itemsNestedInputObjectSchema).optional(),
  relationships: z.lazy(() => relationshipsUpdateOneWithoutEvidence_itemsNestedInputObjectSchema).optional()
}).strict();
export const evidence_itemsUpdateInputObjectZodSchema = z.object({
  title: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  type: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  date: z.union([z.union([z.date(), z.string().datetime()]), z.lazy(() => DateTimeFieldUpdateOperationsInputObjectSchema)]).optional(),
  link: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  hypothesis: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  summary: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  impact_on_confidence: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  created_at: z.union([z.union([z.date(), z.string().datetime()]), z.lazy(() => NullableDateTimeFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  updated_at: z.union([z.union([z.date(), z.string().datetime()]), z.lazy(() => NullableDateTimeFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  content: z.union([NullableJsonNullValueInputSchema, jsonSchema]).optional(),
  is_public: z.union([z.boolean(), z.lazy(() => BoolFieldUpdateOperationsInputObjectSchema)]).optional(),
  metric_cards: z.lazy(() => metric_cardsUpdateOneWithoutEvidence_itemsNestedInputObjectSchema).optional(),
  users_evidence_items_created_byTousers: z.lazy(() => usersUpdateOneRequiredWithoutEvidence_items_evidence_items_created_byTousersNestedInputObjectSchema).optional(),
  users_evidence_items_owner_idTousers: z.lazy(() => usersUpdateOneWithoutEvidence_items_evidence_items_owner_idTousersNestedInputObjectSchema).optional(),
  projects: z.lazy(() => projectsUpdateOneWithoutEvidence_itemsNestedInputObjectSchema).optional(),
  relationships: z.lazy(() => relationshipsUpdateOneWithoutEvidence_itemsNestedInputObjectSchema).optional()
}).strict();
