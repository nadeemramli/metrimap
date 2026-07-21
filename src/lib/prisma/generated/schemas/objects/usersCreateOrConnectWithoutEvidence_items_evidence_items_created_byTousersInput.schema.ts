// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { usersWhereUniqueInputObjectSchema } from './usersWhereUniqueInput.schema';
import { usersCreateWithoutEvidence_items_evidence_items_created_byTousersInputObjectSchema } from './usersCreateWithoutEvidence_items_evidence_items_created_byTousersInput.schema';
import { usersUncheckedCreateWithoutEvidence_items_evidence_items_created_byTousersInputObjectSchema } from './usersUncheckedCreateWithoutEvidence_items_evidence_items_created_byTousersInput.schema'

export const usersCreateOrConnectWithoutEvidence_items_evidence_items_created_byTousersInputObjectSchema: z.ZodType<Prisma.usersCreateOrConnectWithoutEvidence_items_evidence_items_created_byTousersInput, Prisma.usersCreateOrConnectWithoutEvidence_items_evidence_items_created_byTousersInput> = z.object({
  where: z.lazy(() => usersWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => usersCreateWithoutEvidence_items_evidence_items_created_byTousersInputObjectSchema), z.lazy(() => usersUncheckedCreateWithoutEvidence_items_evidence_items_created_byTousersInputObjectSchema)])
}).strict();
export const usersCreateOrConnectWithoutEvidence_items_evidence_items_created_byTousersInputObjectZodSchema = z.object({
  where: z.lazy(() => usersWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => usersCreateWithoutEvidence_items_evidence_items_created_byTousersInputObjectSchema), z.lazy(() => usersUncheckedCreateWithoutEvidence_items_evidence_items_created_byTousersInputObjectSchema)])
}).strict();
