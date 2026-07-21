// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { project_collaboratorsCreateManyUsersInputObjectSchema } from './project_collaboratorsCreateManyUsersInput.schema'

export const project_collaboratorsCreateManyUsersInputEnvelopeObjectSchema: z.ZodType<Prisma.project_collaboratorsCreateManyUsersInputEnvelope, Prisma.project_collaboratorsCreateManyUsersInputEnvelope> = z.object({
  data: z.union([z.lazy(() => project_collaboratorsCreateManyUsersInputObjectSchema), z.lazy(() => project_collaboratorsCreateManyUsersInputObjectSchema).array()]),
  skipDuplicates: z.boolean().optional()
}).strict();
export const project_collaboratorsCreateManyUsersInputEnvelopeObjectZodSchema = z.object({
  data: z.union([z.lazy(() => project_collaboratorsCreateManyUsersInputObjectSchema), z.lazy(() => project_collaboratorsCreateManyUsersInputObjectSchema).array()]),
  skipDuplicates: z.boolean().optional()
}).strict();
