// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { comment_mentionsCreateManyCommentsInputObjectSchema } from './comment_mentionsCreateManyCommentsInput.schema'

export const comment_mentionsCreateManyCommentsInputEnvelopeObjectSchema: z.ZodType<Prisma.comment_mentionsCreateManyCommentsInputEnvelope, Prisma.comment_mentionsCreateManyCommentsInputEnvelope> = z.object({
  data: z.union([z.lazy(() => comment_mentionsCreateManyCommentsInputObjectSchema), z.lazy(() => comment_mentionsCreateManyCommentsInputObjectSchema).array()]),
  skipDuplicates: z.boolean().optional()
}).strict();
export const comment_mentionsCreateManyCommentsInputEnvelopeObjectZodSchema = z.object({
  data: z.union([z.lazy(() => comment_mentionsCreateManyCommentsInputObjectSchema), z.lazy(() => comment_mentionsCreateManyCommentsInputObjectSchema).array()]),
  skipDuplicates: z.boolean().optional()
}).strict();
