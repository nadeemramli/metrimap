// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { tagsWhereUniqueInputObjectSchema } from './tagsWhereUniqueInput.schema';
import { tagsCreateWithoutRelationship_tagsInputObjectSchema } from './tagsCreateWithoutRelationship_tagsInput.schema';
import { tagsUncheckedCreateWithoutRelationship_tagsInputObjectSchema } from './tagsUncheckedCreateWithoutRelationship_tagsInput.schema'

export const tagsCreateOrConnectWithoutRelationship_tagsInputObjectSchema: z.ZodType<Prisma.tagsCreateOrConnectWithoutRelationship_tagsInput, Prisma.tagsCreateOrConnectWithoutRelationship_tagsInput> = z.object({
  where: z.lazy(() => tagsWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => tagsCreateWithoutRelationship_tagsInputObjectSchema), z.lazy(() => tagsUncheckedCreateWithoutRelationship_tagsInputObjectSchema)])
}).strict();
export const tagsCreateOrConnectWithoutRelationship_tagsInputObjectZodSchema = z.object({
  where: z.lazy(() => tagsWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => tagsCreateWithoutRelationship_tagsInputObjectSchema), z.lazy(() => tagsUncheckedCreateWithoutRelationship_tagsInputObjectSchema)])
}).strict();
