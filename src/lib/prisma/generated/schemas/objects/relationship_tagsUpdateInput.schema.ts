// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { NullableDateTimeFieldUpdateOperationsInputObjectSchema } from './NullableDateTimeFieldUpdateOperationsInput.schema';
import { relationshipsUpdateOneWithoutRelationship_tagsNestedInputObjectSchema } from './relationshipsUpdateOneWithoutRelationship_tagsNestedInput.schema';
import { tagsUpdateOneWithoutRelationship_tagsNestedInputObjectSchema } from './tagsUpdateOneWithoutRelationship_tagsNestedInput.schema'

export const relationship_tagsUpdateInputObjectSchema: z.ZodType<Prisma.relationship_tagsUpdateInput, Prisma.relationship_tagsUpdateInput> = z.object({
  created_at: z.union([z.union([z.date(), z.string().datetime()]), z.lazy(() => NullableDateTimeFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  relationships: z.lazy(() => relationshipsUpdateOneWithoutRelationship_tagsNestedInputObjectSchema).optional(),
  tags: z.lazy(() => tagsUpdateOneWithoutRelationship_tagsNestedInputObjectSchema).optional()
}).strict();
export const relationship_tagsUpdateInputObjectZodSchema = z.object({
  created_at: z.union([z.union([z.date(), z.string().datetime()]), z.lazy(() => NullableDateTimeFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  relationships: z.lazy(() => relationshipsUpdateOneWithoutRelationship_tagsNestedInputObjectSchema).optional(),
  tags: z.lazy(() => tagsUpdateOneWithoutRelationship_tagsNestedInputObjectSchema).optional()
}).strict();
