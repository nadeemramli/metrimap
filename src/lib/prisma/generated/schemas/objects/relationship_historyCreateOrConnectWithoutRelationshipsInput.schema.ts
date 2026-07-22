// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { relationship_historyWhereUniqueInputObjectSchema } from './relationship_historyWhereUniqueInput.schema';
import { relationship_historyCreateWithoutRelationshipsInputObjectSchema } from './relationship_historyCreateWithoutRelationshipsInput.schema';
import { relationship_historyUncheckedCreateWithoutRelationshipsInputObjectSchema } from './relationship_historyUncheckedCreateWithoutRelationshipsInput.schema'

export const relationship_historyCreateOrConnectWithoutRelationshipsInputObjectSchema: z.ZodType<Prisma.relationship_historyCreateOrConnectWithoutRelationshipsInput, Prisma.relationship_historyCreateOrConnectWithoutRelationshipsInput> = z.object({
  where: z.lazy(() => relationship_historyWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => relationship_historyCreateWithoutRelationshipsInputObjectSchema), z.lazy(() => relationship_historyUncheckedCreateWithoutRelationshipsInputObjectSchema)])
}).strict();
export const relationship_historyCreateOrConnectWithoutRelationshipsInputObjectZodSchema = z.object({
  where: z.lazy(() => relationship_historyWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => relationship_historyCreateWithoutRelationshipsInputObjectSchema), z.lazy(() => relationship_historyUncheckedCreateWithoutRelationshipsInputObjectSchema)])
}).strict();
