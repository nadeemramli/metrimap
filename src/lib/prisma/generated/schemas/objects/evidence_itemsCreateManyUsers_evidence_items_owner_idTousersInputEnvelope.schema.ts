// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { evidence_itemsCreateManyUsers_evidence_items_owner_idTousersInputObjectSchema } from './evidence_itemsCreateManyUsers_evidence_items_owner_idTousersInput.schema'

export const evidence_itemsCreateManyUsers_evidence_items_owner_idTousersInputEnvelopeObjectSchema: z.ZodType<Prisma.evidence_itemsCreateManyUsers_evidence_items_owner_idTousersInputEnvelope, Prisma.evidence_itemsCreateManyUsers_evidence_items_owner_idTousersInputEnvelope> = z.object({
  data: z.union([z.lazy(() => evidence_itemsCreateManyUsers_evidence_items_owner_idTousersInputObjectSchema), z.lazy(() => evidence_itemsCreateManyUsers_evidence_items_owner_idTousersInputObjectSchema).array()]),
  skipDuplicates: z.boolean().optional()
}).strict();
export const evidence_itemsCreateManyUsers_evidence_items_owner_idTousersInputEnvelopeObjectZodSchema = z.object({
  data: z.union([z.lazy(() => evidence_itemsCreateManyUsers_evidence_items_owner_idTousersInputObjectSchema), z.lazy(() => evidence_itemsCreateManyUsers_evidence_items_owner_idTousersInputObjectSchema).array()]),
  skipDuplicates: z.boolean().optional()
}).strict();
