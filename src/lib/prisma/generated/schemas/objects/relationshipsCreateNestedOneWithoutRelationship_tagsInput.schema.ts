// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { relationshipsCreateWithoutRelationship_tagsInputObjectSchema } from './relationshipsCreateWithoutRelationship_tagsInput.schema';
import { relationshipsUncheckedCreateWithoutRelationship_tagsInputObjectSchema } from './relationshipsUncheckedCreateWithoutRelationship_tagsInput.schema';
import { relationshipsCreateOrConnectWithoutRelationship_tagsInputObjectSchema } from './relationshipsCreateOrConnectWithoutRelationship_tagsInput.schema';
import { relationshipsWhereUniqueInputObjectSchema } from './relationshipsWhereUniqueInput.schema'

export const relationshipsCreateNestedOneWithoutRelationship_tagsInputObjectSchema: z.ZodType<Prisma.relationshipsCreateNestedOneWithoutRelationship_tagsInput, Prisma.relationshipsCreateNestedOneWithoutRelationship_tagsInput> = z.object({
  create: z.union([z.lazy(() => relationshipsCreateWithoutRelationship_tagsInputObjectSchema), z.lazy(() => relationshipsUncheckedCreateWithoutRelationship_tagsInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => relationshipsCreateOrConnectWithoutRelationship_tagsInputObjectSchema).optional(),
  connect: z.lazy(() => relationshipsWhereUniqueInputObjectSchema).optional()
}).strict();
export const relationshipsCreateNestedOneWithoutRelationship_tagsInputObjectZodSchema = z.object({
  create: z.union([z.lazy(() => relationshipsCreateWithoutRelationship_tagsInputObjectSchema), z.lazy(() => relationshipsUncheckedCreateWithoutRelationship_tagsInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => relationshipsCreateOrConnectWithoutRelationship_tagsInputObjectSchema).optional(),
  connect: z.lazy(() => relationshipsWhereUniqueInputObjectSchema).optional()
}).strict();
