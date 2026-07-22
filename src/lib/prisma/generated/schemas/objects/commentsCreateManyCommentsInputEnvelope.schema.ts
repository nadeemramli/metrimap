// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { commentsCreateManyCommentsInputObjectSchema } from './commentsCreateManyCommentsInput.schema'

export const commentsCreateManyCommentsInputEnvelopeObjectSchema: z.ZodType<Prisma.commentsCreateManyCommentsInputEnvelope, Prisma.commentsCreateManyCommentsInputEnvelope> = z.object({
  data: z.union([z.lazy(() => commentsCreateManyCommentsInputObjectSchema), z.lazy(() => commentsCreateManyCommentsInputObjectSchema).array()]),
  skipDuplicates: z.boolean().optional()
}).strict();
export const commentsCreateManyCommentsInputEnvelopeObjectZodSchema = z.object({
  data: z.union([z.lazy(() => commentsCreateManyCommentsInputObjectSchema), z.lazy(() => commentsCreateManyCommentsInputObjectSchema).array()]),
  skipDuplicates: z.boolean().optional()
}).strict();
