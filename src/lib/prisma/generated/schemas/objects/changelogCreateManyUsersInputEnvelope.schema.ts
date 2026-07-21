// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { changelogCreateManyUsersInputObjectSchema } from './changelogCreateManyUsersInput.schema'

export const changelogCreateManyUsersInputEnvelopeObjectSchema: z.ZodType<Prisma.changelogCreateManyUsersInputEnvelope, Prisma.changelogCreateManyUsersInputEnvelope> = z.object({
  data: z.union([z.lazy(() => changelogCreateManyUsersInputObjectSchema), z.lazy(() => changelogCreateManyUsersInputObjectSchema).array()]),
  skipDuplicates: z.boolean().optional()
}).strict();
export const changelogCreateManyUsersInputEnvelopeObjectZodSchema = z.object({
  data: z.union([z.lazy(() => changelogCreateManyUsersInputObjectSchema), z.lazy(() => changelogCreateManyUsersInputObjectSchema).array()]),
  skipDuplicates: z.boolean().optional()
}).strict();
