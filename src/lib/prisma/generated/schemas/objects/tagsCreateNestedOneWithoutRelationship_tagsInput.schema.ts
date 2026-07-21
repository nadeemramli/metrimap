// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { tagsCreateWithoutRelationship_tagsInputObjectSchema } from './tagsCreateWithoutRelationship_tagsInput.schema';
import { tagsUncheckedCreateWithoutRelationship_tagsInputObjectSchema } from './tagsUncheckedCreateWithoutRelationship_tagsInput.schema';
import { tagsCreateOrConnectWithoutRelationship_tagsInputObjectSchema } from './tagsCreateOrConnectWithoutRelationship_tagsInput.schema';
import { tagsWhereUniqueInputObjectSchema } from './tagsWhereUniqueInput.schema'

export const tagsCreateNestedOneWithoutRelationship_tagsInputObjectSchema: z.ZodType<Prisma.tagsCreateNestedOneWithoutRelationship_tagsInput, Prisma.tagsCreateNestedOneWithoutRelationship_tagsInput> = z.object({
  create: z.union([z.lazy(() => tagsCreateWithoutRelationship_tagsInputObjectSchema), z.lazy(() => tagsUncheckedCreateWithoutRelationship_tagsInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => tagsCreateOrConnectWithoutRelationship_tagsInputObjectSchema).optional(),
  connect: z.lazy(() => tagsWhereUniqueInputObjectSchema).optional()
}).strict();
export const tagsCreateNestedOneWithoutRelationship_tagsInputObjectZodSchema = z.object({
  create: z.union([z.lazy(() => tagsCreateWithoutRelationship_tagsInputObjectSchema), z.lazy(() => tagsUncheckedCreateWithoutRelationship_tagsInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => tagsCreateOrConnectWithoutRelationship_tagsInputObjectSchema).optional(),
  connect: z.lazy(() => tagsWhereUniqueInputObjectSchema).optional()
}).strict();
