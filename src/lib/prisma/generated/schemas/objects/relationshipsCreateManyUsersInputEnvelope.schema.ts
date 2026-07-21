// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { relationshipsCreateManyUsersInputObjectSchema } from './relationshipsCreateManyUsersInput.schema'

export const relationshipsCreateManyUsersInputEnvelopeObjectSchema: z.ZodType<Prisma.relationshipsCreateManyUsersInputEnvelope, Prisma.relationshipsCreateManyUsersInputEnvelope> = z.object({
  data: z.union([z.lazy(() => relationshipsCreateManyUsersInputObjectSchema), z.lazy(() => relationshipsCreateManyUsersInputObjectSchema).array()]),
  skipDuplicates: z.boolean().optional()
}).strict();
export const relationshipsCreateManyUsersInputEnvelopeObjectZodSchema = z.object({
  data: z.union([z.lazy(() => relationshipsCreateManyUsersInputObjectSchema), z.lazy(() => relationshipsCreateManyUsersInputObjectSchema).array()]),
  skipDuplicates: z.boolean().optional()
}).strict();
