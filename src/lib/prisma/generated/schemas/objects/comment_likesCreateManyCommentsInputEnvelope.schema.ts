// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { comment_likesCreateManyCommentsInputObjectSchema } from './comment_likesCreateManyCommentsInput.schema'

export const comment_likesCreateManyCommentsInputEnvelopeObjectSchema: z.ZodType<Prisma.comment_likesCreateManyCommentsInputEnvelope, Prisma.comment_likesCreateManyCommentsInputEnvelope> = z.object({
  data: z.union([z.lazy(() => comment_likesCreateManyCommentsInputObjectSchema), z.lazy(() => comment_likesCreateManyCommentsInputObjectSchema).array()]),
  skipDuplicates: z.boolean().optional()
}).strict();
export const comment_likesCreateManyCommentsInputEnvelopeObjectZodSchema = z.object({
  data: z.union([z.lazy(() => comment_likesCreateManyCommentsInputObjectSchema), z.lazy(() => comment_likesCreateManyCommentsInputObjectSchema).array()]),
  skipDuplicates: z.boolean().optional()
}).strict();
