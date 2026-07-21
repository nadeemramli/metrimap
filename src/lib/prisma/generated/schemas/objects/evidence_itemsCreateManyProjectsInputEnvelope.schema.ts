// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { evidence_itemsCreateManyProjectsInputObjectSchema } from './evidence_itemsCreateManyProjectsInput.schema'

export const evidence_itemsCreateManyProjectsInputEnvelopeObjectSchema: z.ZodType<Prisma.evidence_itemsCreateManyProjectsInputEnvelope, Prisma.evidence_itemsCreateManyProjectsInputEnvelope> = z.object({
  data: z.union([z.lazy(() => evidence_itemsCreateManyProjectsInputObjectSchema), z.lazy(() => evidence_itemsCreateManyProjectsInputObjectSchema).array()]),
  skipDuplicates: z.boolean().optional()
}).strict();
export const evidence_itemsCreateManyProjectsInputEnvelopeObjectZodSchema = z.object({
  data: z.union([z.lazy(() => evidence_itemsCreateManyProjectsInputObjectSchema), z.lazy(() => evidence_itemsCreateManyProjectsInputObjectSchema).array()]),
  skipDuplicates: z.boolean().optional()
}).strict();
