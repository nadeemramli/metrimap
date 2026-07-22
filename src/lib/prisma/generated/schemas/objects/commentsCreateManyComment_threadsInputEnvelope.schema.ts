// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { commentsCreateManyComment_threadsInputObjectSchema } from './commentsCreateManyComment_threadsInput.schema'

export const commentsCreateManyComment_threadsInputEnvelopeObjectSchema: z.ZodType<Prisma.commentsCreateManyComment_threadsInputEnvelope, Prisma.commentsCreateManyComment_threadsInputEnvelope> = z.object({
  data: z.union([z.lazy(() => commentsCreateManyComment_threadsInputObjectSchema), z.lazy(() => commentsCreateManyComment_threadsInputObjectSchema).array()]),
  skipDuplicates: z.boolean().optional()
}).strict();
export const commentsCreateManyComment_threadsInputEnvelopeObjectZodSchema = z.object({
  data: z.union([z.lazy(() => commentsCreateManyComment_threadsInputObjectSchema), z.lazy(() => commentsCreateManyComment_threadsInputObjectSchema).array()]),
  skipDuplicates: z.boolean().optional()
}).strict();
