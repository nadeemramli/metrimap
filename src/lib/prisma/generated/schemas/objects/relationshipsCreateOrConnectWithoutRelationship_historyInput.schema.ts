// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { relationshipsWhereUniqueInputObjectSchema } from './relationshipsWhereUniqueInput.schema';
import { relationshipsCreateWithoutRelationship_historyInputObjectSchema } from './relationshipsCreateWithoutRelationship_historyInput.schema';
import { relationshipsUncheckedCreateWithoutRelationship_historyInputObjectSchema } from './relationshipsUncheckedCreateWithoutRelationship_historyInput.schema'

export const relationshipsCreateOrConnectWithoutRelationship_historyInputObjectSchema: z.ZodType<Prisma.relationshipsCreateOrConnectWithoutRelationship_historyInput, Prisma.relationshipsCreateOrConnectWithoutRelationship_historyInput> = z.object({
  where: z.lazy(() => relationshipsWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => relationshipsCreateWithoutRelationship_historyInputObjectSchema), z.lazy(() => relationshipsUncheckedCreateWithoutRelationship_historyInputObjectSchema)])
}).strict();
export const relationshipsCreateOrConnectWithoutRelationship_historyInputObjectZodSchema = z.object({
  where: z.lazy(() => relationshipsWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => relationshipsCreateWithoutRelationship_historyInputObjectSchema), z.lazy(() => relationshipsUncheckedCreateWithoutRelationship_historyInputObjectSchema)])
}).strict();
