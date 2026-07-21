// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { project_collaboratorsCreateManyProjectsInputObjectSchema } from './project_collaboratorsCreateManyProjectsInput.schema'

export const project_collaboratorsCreateManyProjectsInputEnvelopeObjectSchema: z.ZodType<Prisma.project_collaboratorsCreateManyProjectsInputEnvelope, Prisma.project_collaboratorsCreateManyProjectsInputEnvelope> = z.object({
  data: z.union([z.lazy(() => project_collaboratorsCreateManyProjectsInputObjectSchema), z.lazy(() => project_collaboratorsCreateManyProjectsInputObjectSchema).array()]),
  skipDuplicates: z.boolean().optional()
}).strict();
export const project_collaboratorsCreateManyProjectsInputEnvelopeObjectZodSchema = z.object({
  data: z.union([z.lazy(() => project_collaboratorsCreateManyProjectsInputObjectSchema), z.lazy(() => project_collaboratorsCreateManyProjectsInputObjectSchema).array()]),
  skipDuplicates: z.boolean().optional()
}).strict();
