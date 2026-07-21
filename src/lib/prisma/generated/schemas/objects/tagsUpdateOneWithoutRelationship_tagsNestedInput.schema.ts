// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { tagsCreateWithoutRelationship_tagsInputObjectSchema } from './tagsCreateWithoutRelationship_tagsInput.schema';
import { tagsUncheckedCreateWithoutRelationship_tagsInputObjectSchema } from './tagsUncheckedCreateWithoutRelationship_tagsInput.schema';
import { tagsCreateOrConnectWithoutRelationship_tagsInputObjectSchema } from './tagsCreateOrConnectWithoutRelationship_tagsInput.schema';
import { tagsUpsertWithoutRelationship_tagsInputObjectSchema } from './tagsUpsertWithoutRelationship_tagsInput.schema';
import { tagsWhereInputObjectSchema } from './tagsWhereInput.schema';
import { tagsWhereUniqueInputObjectSchema } from './tagsWhereUniqueInput.schema';
import { tagsUpdateToOneWithWhereWithoutRelationship_tagsInputObjectSchema } from './tagsUpdateToOneWithWhereWithoutRelationship_tagsInput.schema';
import { tagsUpdateWithoutRelationship_tagsInputObjectSchema } from './tagsUpdateWithoutRelationship_tagsInput.schema';
import { tagsUncheckedUpdateWithoutRelationship_tagsInputObjectSchema } from './tagsUncheckedUpdateWithoutRelationship_tagsInput.schema'

export const tagsUpdateOneWithoutRelationship_tagsNestedInputObjectSchema: z.ZodType<Prisma.tagsUpdateOneWithoutRelationship_tagsNestedInput, Prisma.tagsUpdateOneWithoutRelationship_tagsNestedInput> = z.object({
  create: z.union([z.lazy(() => tagsCreateWithoutRelationship_tagsInputObjectSchema), z.lazy(() => tagsUncheckedCreateWithoutRelationship_tagsInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => tagsCreateOrConnectWithoutRelationship_tagsInputObjectSchema).optional(),
  upsert: z.lazy(() => tagsUpsertWithoutRelationship_tagsInputObjectSchema).optional(),
  disconnect: z.union([z.boolean(), z.lazy(() => tagsWhereInputObjectSchema)]).optional(),
  delete: z.union([z.boolean(), z.lazy(() => tagsWhereInputObjectSchema)]).optional(),
  connect: z.lazy(() => tagsWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => tagsUpdateToOneWithWhereWithoutRelationship_tagsInputObjectSchema), z.lazy(() => tagsUpdateWithoutRelationship_tagsInputObjectSchema), z.lazy(() => tagsUncheckedUpdateWithoutRelationship_tagsInputObjectSchema)]).optional()
}).strict();
export const tagsUpdateOneWithoutRelationship_tagsNestedInputObjectZodSchema = z.object({
  create: z.union([z.lazy(() => tagsCreateWithoutRelationship_tagsInputObjectSchema), z.lazy(() => tagsUncheckedCreateWithoutRelationship_tagsInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => tagsCreateOrConnectWithoutRelationship_tagsInputObjectSchema).optional(),
  upsert: z.lazy(() => tagsUpsertWithoutRelationship_tagsInputObjectSchema).optional(),
  disconnect: z.union([z.boolean(), z.lazy(() => tagsWhereInputObjectSchema)]).optional(),
  delete: z.union([z.boolean(), z.lazy(() => tagsWhereInputObjectSchema)]).optional(),
  connect: z.lazy(() => tagsWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => tagsUpdateToOneWithWhereWithoutRelationship_tagsInputObjectSchema), z.lazy(() => tagsUpdateWithoutRelationship_tagsInputObjectSchema), z.lazy(() => tagsUncheckedUpdateWithoutRelationship_tagsInputObjectSchema)]).optional()
}).strict();
