// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { groupsCreateManyUsersInputObjectSchema } from './groupsCreateManyUsersInput.schema'

export const groupsCreateManyUsersInputEnvelopeObjectSchema: z.ZodType<Prisma.groupsCreateManyUsersInputEnvelope, Prisma.groupsCreateManyUsersInputEnvelope> = z.object({
  data: z.union([z.lazy(() => groupsCreateManyUsersInputObjectSchema), z.lazy(() => groupsCreateManyUsersInputObjectSchema).array()]),
  skipDuplicates: z.boolean().optional()
}).strict();
export const groupsCreateManyUsersInputEnvelopeObjectZodSchema = z.object({
  data: z.union([z.lazy(() => groupsCreateManyUsersInputObjectSchema), z.lazy(() => groupsCreateManyUsersInputObjectSchema).array()]),
  skipDuplicates: z.boolean().optional()
}).strict();
