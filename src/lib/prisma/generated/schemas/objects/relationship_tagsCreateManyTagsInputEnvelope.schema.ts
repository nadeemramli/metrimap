// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { relationship_tagsCreateManyTagsInputObjectSchema } from './relationship_tagsCreateManyTagsInput.schema'

export const relationship_tagsCreateManyTagsInputEnvelopeObjectSchema: z.ZodType<Prisma.relationship_tagsCreateManyTagsInputEnvelope, Prisma.relationship_tagsCreateManyTagsInputEnvelope> = z.object({
  data: z.union([z.lazy(() => relationship_tagsCreateManyTagsInputObjectSchema), z.lazy(() => relationship_tagsCreateManyTagsInputObjectSchema).array()]),
  skipDuplicates: z.boolean().optional()
}).strict();
export const relationship_tagsCreateManyTagsInputEnvelopeObjectZodSchema = z.object({
  data: z.union([z.lazy(() => relationship_tagsCreateManyTagsInputObjectSchema), z.lazy(() => relationship_tagsCreateManyTagsInputObjectSchema).array()]),
  skipDuplicates: z.boolean().optional()
}).strict();
