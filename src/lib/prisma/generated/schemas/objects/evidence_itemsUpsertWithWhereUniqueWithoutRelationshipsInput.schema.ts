// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { evidence_itemsWhereUniqueInputObjectSchema } from './evidence_itemsWhereUniqueInput.schema';
import { evidence_itemsUpdateWithoutRelationshipsInputObjectSchema } from './evidence_itemsUpdateWithoutRelationshipsInput.schema';
import { evidence_itemsUncheckedUpdateWithoutRelationshipsInputObjectSchema } from './evidence_itemsUncheckedUpdateWithoutRelationshipsInput.schema';
import { evidence_itemsCreateWithoutRelationshipsInputObjectSchema } from './evidence_itemsCreateWithoutRelationshipsInput.schema';
import { evidence_itemsUncheckedCreateWithoutRelationshipsInputObjectSchema } from './evidence_itemsUncheckedCreateWithoutRelationshipsInput.schema'

export const evidence_itemsUpsertWithWhereUniqueWithoutRelationshipsInputObjectSchema: z.ZodType<Prisma.evidence_itemsUpsertWithWhereUniqueWithoutRelationshipsInput, Prisma.evidence_itemsUpsertWithWhereUniqueWithoutRelationshipsInput> = z.object({
  where: z.lazy(() => evidence_itemsWhereUniqueInputObjectSchema),
  update: z.union([z.lazy(() => evidence_itemsUpdateWithoutRelationshipsInputObjectSchema), z.lazy(() => evidence_itemsUncheckedUpdateWithoutRelationshipsInputObjectSchema)]),
  create: z.union([z.lazy(() => evidence_itemsCreateWithoutRelationshipsInputObjectSchema), z.lazy(() => evidence_itemsUncheckedCreateWithoutRelationshipsInputObjectSchema)])
}).strict();
export const evidence_itemsUpsertWithWhereUniqueWithoutRelationshipsInputObjectZodSchema = z.object({
  where: z.lazy(() => evidence_itemsWhereUniqueInputObjectSchema),
  update: z.union([z.lazy(() => evidence_itemsUpdateWithoutRelationshipsInputObjectSchema), z.lazy(() => evidence_itemsUncheckedUpdateWithoutRelationshipsInputObjectSchema)]),
  create: z.union([z.lazy(() => evidence_itemsCreateWithoutRelationshipsInputObjectSchema), z.lazy(() => evidence_itemsUncheckedCreateWithoutRelationshipsInputObjectSchema)])
}).strict();
