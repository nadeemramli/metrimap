// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { evidence_itemsCreateManyUsers_evidence_items_created_byTousersInputObjectSchema } from './evidence_itemsCreateManyUsers_evidence_items_created_byTousersInput.schema'

export const evidence_itemsCreateManyUsers_evidence_items_created_byTousersInputEnvelopeObjectSchema: z.ZodType<Prisma.evidence_itemsCreateManyUsers_evidence_items_created_byTousersInputEnvelope, Prisma.evidence_itemsCreateManyUsers_evidence_items_created_byTousersInputEnvelope> = z.object({
  data: z.union([z.lazy(() => evidence_itemsCreateManyUsers_evidence_items_created_byTousersInputObjectSchema), z.lazy(() => evidence_itemsCreateManyUsers_evidence_items_created_byTousersInputObjectSchema).array()]),
  skipDuplicates: z.boolean().optional()
}).strict();
export const evidence_itemsCreateManyUsers_evidence_items_created_byTousersInputEnvelopeObjectZodSchema = z.object({
  data: z.union([z.lazy(() => evidence_itemsCreateManyUsers_evidence_items_created_byTousersInputObjectSchema), z.lazy(() => evidence_itemsCreateManyUsers_evidence_items_created_byTousersInputObjectSchema).array()]),
  skipDuplicates: z.boolean().optional()
}).strict();
