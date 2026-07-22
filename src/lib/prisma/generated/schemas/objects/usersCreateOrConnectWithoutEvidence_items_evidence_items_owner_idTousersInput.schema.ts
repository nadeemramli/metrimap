// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { usersWhereUniqueInputObjectSchema } from './usersWhereUniqueInput.schema';
import { usersCreateWithoutEvidence_items_evidence_items_owner_idTousersInputObjectSchema } from './usersCreateWithoutEvidence_items_evidence_items_owner_idTousersInput.schema';
import { usersUncheckedCreateWithoutEvidence_items_evidence_items_owner_idTousersInputObjectSchema } from './usersUncheckedCreateWithoutEvidence_items_evidence_items_owner_idTousersInput.schema'

export const usersCreateOrConnectWithoutEvidence_items_evidence_items_owner_idTousersInputObjectSchema: z.ZodType<Prisma.usersCreateOrConnectWithoutEvidence_items_evidence_items_owner_idTousersInput, Prisma.usersCreateOrConnectWithoutEvidence_items_evidence_items_owner_idTousersInput> = z.object({
  where: z.lazy(() => usersWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => usersCreateWithoutEvidence_items_evidence_items_owner_idTousersInputObjectSchema), z.lazy(() => usersUncheckedCreateWithoutEvidence_items_evidence_items_owner_idTousersInputObjectSchema)])
}).strict();
export const usersCreateOrConnectWithoutEvidence_items_evidence_items_owner_idTousersInputObjectZodSchema = z.object({
  where: z.lazy(() => usersWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => usersCreateWithoutEvidence_items_evidence_items_owner_idTousersInputObjectSchema), z.lazy(() => usersUncheckedCreateWithoutEvidence_items_evidence_items_owner_idTousersInputObjectSchema)])
}).strict();
