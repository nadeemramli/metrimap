// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { tag_audiencesCreateManyTagsInputObjectSchema } from './tag_audiencesCreateManyTagsInput.schema'

export const tag_audiencesCreateManyTagsInputEnvelopeObjectSchema: z.ZodType<Prisma.tag_audiencesCreateManyTagsInputEnvelope, Prisma.tag_audiencesCreateManyTagsInputEnvelope> = z.object({
  data: z.union([z.lazy(() => tag_audiencesCreateManyTagsInputObjectSchema), z.lazy(() => tag_audiencesCreateManyTagsInputObjectSchema).array()]),
  skipDuplicates: z.boolean().optional()
}).strict();
export const tag_audiencesCreateManyTagsInputEnvelopeObjectZodSchema = z.object({
  data: z.union([z.lazy(() => tag_audiencesCreateManyTagsInputObjectSchema), z.lazy(() => tag_audiencesCreateManyTagsInputObjectSchema).array()]),
  skipDuplicates: z.boolean().optional()
}).strict();
