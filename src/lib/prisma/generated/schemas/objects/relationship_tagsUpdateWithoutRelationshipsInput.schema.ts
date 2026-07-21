// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { NullableDateTimeFieldUpdateOperationsInputObjectSchema } from './NullableDateTimeFieldUpdateOperationsInput.schema';
import { tagsUpdateOneWithoutRelationship_tagsNestedInputObjectSchema } from './tagsUpdateOneWithoutRelationship_tagsNestedInput.schema'

export const relationship_tagsUpdateWithoutRelationshipsInputObjectSchema: z.ZodType<Prisma.relationship_tagsUpdateWithoutRelationshipsInput, Prisma.relationship_tagsUpdateWithoutRelationshipsInput> = z.object({
  created_at: z.union([z.union([z.date(), z.string().datetime()]), z.lazy(() => NullableDateTimeFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  tags: z.lazy(() => tagsUpdateOneWithoutRelationship_tagsNestedInputObjectSchema).optional()
}).strict();
export const relationship_tagsUpdateWithoutRelationshipsInputObjectZodSchema = z.object({
  created_at: z.union([z.union([z.date(), z.string().datetime()]), z.lazy(() => NullableDateTimeFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  tags: z.lazy(() => tagsUpdateOneWithoutRelationship_tagsNestedInputObjectSchema).optional()
}).strict();
