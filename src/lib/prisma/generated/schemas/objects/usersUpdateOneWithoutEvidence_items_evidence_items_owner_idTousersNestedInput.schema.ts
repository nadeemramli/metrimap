// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { usersCreateWithoutEvidence_items_evidence_items_owner_idTousersInputObjectSchema } from './usersCreateWithoutEvidence_items_evidence_items_owner_idTousersInput.schema';
import { usersUncheckedCreateWithoutEvidence_items_evidence_items_owner_idTousersInputObjectSchema } from './usersUncheckedCreateWithoutEvidence_items_evidence_items_owner_idTousersInput.schema';
import { usersCreateOrConnectWithoutEvidence_items_evidence_items_owner_idTousersInputObjectSchema } from './usersCreateOrConnectWithoutEvidence_items_evidence_items_owner_idTousersInput.schema';
import { usersUpsertWithoutEvidence_items_evidence_items_owner_idTousersInputObjectSchema } from './usersUpsertWithoutEvidence_items_evidence_items_owner_idTousersInput.schema';
import { usersWhereInputObjectSchema } from './usersWhereInput.schema';
import { usersWhereUniqueInputObjectSchema } from './usersWhereUniqueInput.schema';
import { usersUpdateToOneWithWhereWithoutEvidence_items_evidence_items_owner_idTousersInputObjectSchema } from './usersUpdateToOneWithWhereWithoutEvidence_items_evidence_items_owner_idTousersInput.schema';
import { usersUpdateWithoutEvidence_items_evidence_items_owner_idTousersInputObjectSchema } from './usersUpdateWithoutEvidence_items_evidence_items_owner_idTousersInput.schema';
import { usersUncheckedUpdateWithoutEvidence_items_evidence_items_owner_idTousersInputObjectSchema } from './usersUncheckedUpdateWithoutEvidence_items_evidence_items_owner_idTousersInput.schema'

export const usersUpdateOneWithoutEvidence_items_evidence_items_owner_idTousersNestedInputObjectSchema: z.ZodType<Prisma.usersUpdateOneWithoutEvidence_items_evidence_items_owner_idTousersNestedInput, Prisma.usersUpdateOneWithoutEvidence_items_evidence_items_owner_idTousersNestedInput> = z.object({
  create: z.union([z.lazy(() => usersCreateWithoutEvidence_items_evidence_items_owner_idTousersInputObjectSchema), z.lazy(() => usersUncheckedCreateWithoutEvidence_items_evidence_items_owner_idTousersInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => usersCreateOrConnectWithoutEvidence_items_evidence_items_owner_idTousersInputObjectSchema).optional(),
  upsert: z.lazy(() => usersUpsertWithoutEvidence_items_evidence_items_owner_idTousersInputObjectSchema).optional(),
  disconnect: z.union([z.boolean(), z.lazy(() => usersWhereInputObjectSchema)]).optional(),
  delete: z.union([z.boolean(), z.lazy(() => usersWhereInputObjectSchema)]).optional(),
  connect: z.lazy(() => usersWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => usersUpdateToOneWithWhereWithoutEvidence_items_evidence_items_owner_idTousersInputObjectSchema), z.lazy(() => usersUpdateWithoutEvidence_items_evidence_items_owner_idTousersInputObjectSchema), z.lazy(() => usersUncheckedUpdateWithoutEvidence_items_evidence_items_owner_idTousersInputObjectSchema)]).optional()
}).strict();
export const usersUpdateOneWithoutEvidence_items_evidence_items_owner_idTousersNestedInputObjectZodSchema = z.object({
  create: z.union([z.lazy(() => usersCreateWithoutEvidence_items_evidence_items_owner_idTousersInputObjectSchema), z.lazy(() => usersUncheckedCreateWithoutEvidence_items_evidence_items_owner_idTousersInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => usersCreateOrConnectWithoutEvidence_items_evidence_items_owner_idTousersInputObjectSchema).optional(),
  upsert: z.lazy(() => usersUpsertWithoutEvidence_items_evidence_items_owner_idTousersInputObjectSchema).optional(),
  disconnect: z.union([z.boolean(), z.lazy(() => usersWhereInputObjectSchema)]).optional(),
  delete: z.union([z.boolean(), z.lazy(() => usersWhereInputObjectSchema)]).optional(),
  connect: z.lazy(() => usersWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => usersUpdateToOneWithWhereWithoutEvidence_items_evidence_items_owner_idTousersInputObjectSchema), z.lazy(() => usersUpdateWithoutEvidence_items_evidence_items_owner_idTousersInputObjectSchema), z.lazy(() => usersUncheckedUpdateWithoutEvidence_items_evidence_items_owner_idTousersInputObjectSchema)]).optional()
}).strict();
