// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { comment_threadsCreateManyProjectsInputObjectSchema } from './comment_threadsCreateManyProjectsInput.schema'

export const comment_threadsCreateManyProjectsInputEnvelopeObjectSchema: z.ZodType<Prisma.comment_threadsCreateManyProjectsInputEnvelope, Prisma.comment_threadsCreateManyProjectsInputEnvelope> = z.object({
  data: z.union([z.lazy(() => comment_threadsCreateManyProjectsInputObjectSchema), z.lazy(() => comment_threadsCreateManyProjectsInputObjectSchema).array()]),
  skipDuplicates: z.boolean().optional()
}).strict();
export const comment_threadsCreateManyProjectsInputEnvelopeObjectZodSchema = z.object({
  data: z.union([z.lazy(() => comment_threadsCreateManyProjectsInputObjectSchema), z.lazy(() => comment_threadsCreateManyProjectsInputObjectSchema).array()]),
  skipDuplicates: z.boolean().optional()
}).strict();
