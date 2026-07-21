// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { tagsCreateManyUsersInputObjectSchema } from './tagsCreateManyUsersInput.schema'

export const tagsCreateManyUsersInputEnvelopeObjectSchema: z.ZodType<Prisma.tagsCreateManyUsersInputEnvelope, Prisma.tagsCreateManyUsersInputEnvelope> = z.object({
  data: z.union([z.lazy(() => tagsCreateManyUsersInputObjectSchema), z.lazy(() => tagsCreateManyUsersInputObjectSchema).array()]),
  skipDuplicates: z.boolean().optional()
}).strict();
export const tagsCreateManyUsersInputEnvelopeObjectZodSchema = z.object({
  data: z.union([z.lazy(() => tagsCreateManyUsersInputObjectSchema), z.lazy(() => tagsCreateManyUsersInputObjectSchema).array()]),
  skipDuplicates: z.boolean().optional()
}).strict();
