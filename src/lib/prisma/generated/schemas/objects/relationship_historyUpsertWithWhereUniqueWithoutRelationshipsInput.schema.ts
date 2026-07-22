// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { relationship_historyWhereUniqueInputObjectSchema } from './relationship_historyWhereUniqueInput.schema';
import { relationship_historyUpdateWithoutRelationshipsInputObjectSchema } from './relationship_historyUpdateWithoutRelationshipsInput.schema';
import { relationship_historyUncheckedUpdateWithoutRelationshipsInputObjectSchema } from './relationship_historyUncheckedUpdateWithoutRelationshipsInput.schema';
import { relationship_historyCreateWithoutRelationshipsInputObjectSchema } from './relationship_historyCreateWithoutRelationshipsInput.schema';
import { relationship_historyUncheckedCreateWithoutRelationshipsInputObjectSchema } from './relationship_historyUncheckedCreateWithoutRelationshipsInput.schema'

export const relationship_historyUpsertWithWhereUniqueWithoutRelationshipsInputObjectSchema: z.ZodType<Prisma.relationship_historyUpsertWithWhereUniqueWithoutRelationshipsInput, Prisma.relationship_historyUpsertWithWhereUniqueWithoutRelationshipsInput> = z.object({
  where: z.lazy(() => relationship_historyWhereUniqueInputObjectSchema),
  update: z.union([z.lazy(() => relationship_historyUpdateWithoutRelationshipsInputObjectSchema), z.lazy(() => relationship_historyUncheckedUpdateWithoutRelationshipsInputObjectSchema)]),
  create: z.union([z.lazy(() => relationship_historyCreateWithoutRelationshipsInputObjectSchema), z.lazy(() => relationship_historyUncheckedCreateWithoutRelationshipsInputObjectSchema)])
}).strict();
export const relationship_historyUpsertWithWhereUniqueWithoutRelationshipsInputObjectZodSchema = z.object({
  where: z.lazy(() => relationship_historyWhereUniqueInputObjectSchema),
  update: z.union([z.lazy(() => relationship_historyUpdateWithoutRelationshipsInputObjectSchema), z.lazy(() => relationship_historyUncheckedUpdateWithoutRelationshipsInputObjectSchema)]),
  create: z.union([z.lazy(() => relationship_historyCreateWithoutRelationshipsInputObjectSchema), z.lazy(() => relationship_historyUncheckedCreateWithoutRelationshipsInputObjectSchema)])
}).strict();
