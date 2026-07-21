// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { usersCreateWithoutEvidence_items_evidence_items_owner_idTousersInputObjectSchema } from './usersCreateWithoutEvidence_items_evidence_items_owner_idTousersInput.schema';
import { usersUncheckedCreateWithoutEvidence_items_evidence_items_owner_idTousersInputObjectSchema } from './usersUncheckedCreateWithoutEvidence_items_evidence_items_owner_idTousersInput.schema';
import { usersCreateOrConnectWithoutEvidence_items_evidence_items_owner_idTousersInputObjectSchema } from './usersCreateOrConnectWithoutEvidence_items_evidence_items_owner_idTousersInput.schema';
import { usersWhereUniqueInputObjectSchema } from './usersWhereUniqueInput.schema'

export const usersCreateNestedOneWithoutEvidence_items_evidence_items_owner_idTousersInputObjectSchema: z.ZodType<Prisma.usersCreateNestedOneWithoutEvidence_items_evidence_items_owner_idTousersInput, Prisma.usersCreateNestedOneWithoutEvidence_items_evidence_items_owner_idTousersInput> = z.object({
  create: z.union([z.lazy(() => usersCreateWithoutEvidence_items_evidence_items_owner_idTousersInputObjectSchema), z.lazy(() => usersUncheckedCreateWithoutEvidence_items_evidence_items_owner_idTousersInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => usersCreateOrConnectWithoutEvidence_items_evidence_items_owner_idTousersInputObjectSchema).optional(),
  connect: z.lazy(() => usersWhereUniqueInputObjectSchema).optional()
}).strict();
export const usersCreateNestedOneWithoutEvidence_items_evidence_items_owner_idTousersInputObjectZodSchema = z.object({
  create: z.union([z.lazy(() => usersCreateWithoutEvidence_items_evidence_items_owner_idTousersInputObjectSchema), z.lazy(() => usersUncheckedCreateWithoutEvidence_items_evidence_items_owner_idTousersInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => usersCreateOrConnectWithoutEvidence_items_evidence_items_owner_idTousersInputObjectSchema).optional(),
  connect: z.lazy(() => usersWhereUniqueInputObjectSchema).optional()
}).strict();
