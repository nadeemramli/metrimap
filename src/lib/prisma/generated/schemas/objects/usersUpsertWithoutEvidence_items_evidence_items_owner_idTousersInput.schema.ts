// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { usersUpdateWithoutEvidence_items_evidence_items_owner_idTousersInputObjectSchema } from './usersUpdateWithoutEvidence_items_evidence_items_owner_idTousersInput.schema';
import { usersUncheckedUpdateWithoutEvidence_items_evidence_items_owner_idTousersInputObjectSchema } from './usersUncheckedUpdateWithoutEvidence_items_evidence_items_owner_idTousersInput.schema';
import { usersCreateWithoutEvidence_items_evidence_items_owner_idTousersInputObjectSchema } from './usersCreateWithoutEvidence_items_evidence_items_owner_idTousersInput.schema';
import { usersUncheckedCreateWithoutEvidence_items_evidence_items_owner_idTousersInputObjectSchema } from './usersUncheckedCreateWithoutEvidence_items_evidence_items_owner_idTousersInput.schema';
import { usersWhereInputObjectSchema } from './usersWhereInput.schema'

export const usersUpsertWithoutEvidence_items_evidence_items_owner_idTousersInputObjectSchema: z.ZodType<Prisma.usersUpsertWithoutEvidence_items_evidence_items_owner_idTousersInput, Prisma.usersUpsertWithoutEvidence_items_evidence_items_owner_idTousersInput> = z.object({
  update: z.union([z.lazy(() => usersUpdateWithoutEvidence_items_evidence_items_owner_idTousersInputObjectSchema), z.lazy(() => usersUncheckedUpdateWithoutEvidence_items_evidence_items_owner_idTousersInputObjectSchema)]),
  create: z.union([z.lazy(() => usersCreateWithoutEvidence_items_evidence_items_owner_idTousersInputObjectSchema), z.lazy(() => usersUncheckedCreateWithoutEvidence_items_evidence_items_owner_idTousersInputObjectSchema)]),
  where: z.lazy(() => usersWhereInputObjectSchema).optional()
}).strict();
export const usersUpsertWithoutEvidence_items_evidence_items_owner_idTousersInputObjectZodSchema = z.object({
  update: z.union([z.lazy(() => usersUpdateWithoutEvidence_items_evidence_items_owner_idTousersInputObjectSchema), z.lazy(() => usersUncheckedUpdateWithoutEvidence_items_evidence_items_owner_idTousersInputObjectSchema)]),
  create: z.union([z.lazy(() => usersCreateWithoutEvidence_items_evidence_items_owner_idTousersInputObjectSchema), z.lazy(() => usersUncheckedCreateWithoutEvidence_items_evidence_items_owner_idTousersInputObjectSchema)]),
  where: z.lazy(() => usersWhereInputObjectSchema).optional()
}).strict();
