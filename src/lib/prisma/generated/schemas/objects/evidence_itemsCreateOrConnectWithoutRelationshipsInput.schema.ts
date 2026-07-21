// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { evidence_itemsWhereUniqueInputObjectSchema } from './evidence_itemsWhereUniqueInput.schema';
import { evidence_itemsCreateWithoutRelationshipsInputObjectSchema } from './evidence_itemsCreateWithoutRelationshipsInput.schema';
import { evidence_itemsUncheckedCreateWithoutRelationshipsInputObjectSchema } from './evidence_itemsUncheckedCreateWithoutRelationshipsInput.schema'

export const evidence_itemsCreateOrConnectWithoutRelationshipsInputObjectSchema: z.ZodType<Prisma.evidence_itemsCreateOrConnectWithoutRelationshipsInput, Prisma.evidence_itemsCreateOrConnectWithoutRelationshipsInput> = z.object({
  where: z.lazy(() => evidence_itemsWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => evidence_itemsCreateWithoutRelationshipsInputObjectSchema), z.lazy(() => evidence_itemsUncheckedCreateWithoutRelationshipsInputObjectSchema)])
}).strict();
export const evidence_itemsCreateOrConnectWithoutRelationshipsInputObjectZodSchema = z.object({
  where: z.lazy(() => evidence_itemsWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => evidence_itemsCreateWithoutRelationshipsInputObjectSchema), z.lazy(() => evidence_itemsUncheckedCreateWithoutRelationshipsInputObjectSchema)])
}).strict();
