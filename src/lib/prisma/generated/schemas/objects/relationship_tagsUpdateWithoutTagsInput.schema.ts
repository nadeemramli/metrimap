// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { NullableDateTimeFieldUpdateOperationsInputObjectSchema } from './NullableDateTimeFieldUpdateOperationsInput.schema';
import { relationshipsUpdateOneWithoutRelationship_tagsNestedInputObjectSchema } from './relationshipsUpdateOneWithoutRelationship_tagsNestedInput.schema'

export const relationship_tagsUpdateWithoutTagsInputObjectSchema: z.ZodType<Prisma.relationship_tagsUpdateWithoutTagsInput, Prisma.relationship_tagsUpdateWithoutTagsInput> = z.object({
  created_at: z.union([z.union([z.date(), z.string().datetime()]), z.lazy(() => NullableDateTimeFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  relationships: z.lazy(() => relationshipsUpdateOneWithoutRelationship_tagsNestedInputObjectSchema).optional()
}).strict();
export const relationship_tagsUpdateWithoutTagsInputObjectZodSchema = z.object({
  created_at: z.union([z.union([z.date(), z.string().datetime()]), z.lazy(() => NullableDateTimeFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  relationships: z.lazy(() => relationshipsUpdateOneWithoutRelationship_tagsNestedInputObjectSchema).optional()
}).strict();
