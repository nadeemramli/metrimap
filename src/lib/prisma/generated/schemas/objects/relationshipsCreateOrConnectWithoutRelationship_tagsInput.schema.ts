// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { relationshipsWhereUniqueInputObjectSchema } from './relationshipsWhereUniqueInput.schema';
import { relationshipsCreateWithoutRelationship_tagsInputObjectSchema } from './relationshipsCreateWithoutRelationship_tagsInput.schema';
import { relationshipsUncheckedCreateWithoutRelationship_tagsInputObjectSchema } from './relationshipsUncheckedCreateWithoutRelationship_tagsInput.schema'

export const relationshipsCreateOrConnectWithoutRelationship_tagsInputObjectSchema: z.ZodType<Prisma.relationshipsCreateOrConnectWithoutRelationship_tagsInput, Prisma.relationshipsCreateOrConnectWithoutRelationship_tagsInput> = z.object({
  where: z.lazy(() => relationshipsWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => relationshipsCreateWithoutRelationship_tagsInputObjectSchema), z.lazy(() => relationshipsUncheckedCreateWithoutRelationship_tagsInputObjectSchema)])
}).strict();
export const relationshipsCreateOrConnectWithoutRelationship_tagsInputObjectZodSchema = z.object({
  where: z.lazy(() => relationshipsWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => relationshipsCreateWithoutRelationship_tagsInputObjectSchema), z.lazy(() => relationshipsUncheckedCreateWithoutRelationship_tagsInputObjectSchema)])
}).strict();
