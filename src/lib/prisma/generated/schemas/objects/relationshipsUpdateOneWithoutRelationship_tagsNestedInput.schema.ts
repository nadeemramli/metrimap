// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { relationshipsCreateWithoutRelationship_tagsInputObjectSchema } from './relationshipsCreateWithoutRelationship_tagsInput.schema';
import { relationshipsUncheckedCreateWithoutRelationship_tagsInputObjectSchema } from './relationshipsUncheckedCreateWithoutRelationship_tagsInput.schema';
import { relationshipsCreateOrConnectWithoutRelationship_tagsInputObjectSchema } from './relationshipsCreateOrConnectWithoutRelationship_tagsInput.schema';
import { relationshipsUpsertWithoutRelationship_tagsInputObjectSchema } from './relationshipsUpsertWithoutRelationship_tagsInput.schema';
import { relationshipsWhereInputObjectSchema } from './relationshipsWhereInput.schema';
import { relationshipsWhereUniqueInputObjectSchema } from './relationshipsWhereUniqueInput.schema';
import { relationshipsUpdateToOneWithWhereWithoutRelationship_tagsInputObjectSchema } from './relationshipsUpdateToOneWithWhereWithoutRelationship_tagsInput.schema';
import { relationshipsUpdateWithoutRelationship_tagsInputObjectSchema } from './relationshipsUpdateWithoutRelationship_tagsInput.schema';
import { relationshipsUncheckedUpdateWithoutRelationship_tagsInputObjectSchema } from './relationshipsUncheckedUpdateWithoutRelationship_tagsInput.schema'

export const relationshipsUpdateOneWithoutRelationship_tagsNestedInputObjectSchema: z.ZodType<Prisma.relationshipsUpdateOneWithoutRelationship_tagsNestedInput, Prisma.relationshipsUpdateOneWithoutRelationship_tagsNestedInput> = z.object({
  create: z.union([z.lazy(() => relationshipsCreateWithoutRelationship_tagsInputObjectSchema), z.lazy(() => relationshipsUncheckedCreateWithoutRelationship_tagsInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => relationshipsCreateOrConnectWithoutRelationship_tagsInputObjectSchema).optional(),
  upsert: z.lazy(() => relationshipsUpsertWithoutRelationship_tagsInputObjectSchema).optional(),
  disconnect: z.union([z.boolean(), z.lazy(() => relationshipsWhereInputObjectSchema)]).optional(),
  delete: z.union([z.boolean(), z.lazy(() => relationshipsWhereInputObjectSchema)]).optional(),
  connect: z.lazy(() => relationshipsWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => relationshipsUpdateToOneWithWhereWithoutRelationship_tagsInputObjectSchema), z.lazy(() => relationshipsUpdateWithoutRelationship_tagsInputObjectSchema), z.lazy(() => relationshipsUncheckedUpdateWithoutRelationship_tagsInputObjectSchema)]).optional()
}).strict();
export const relationshipsUpdateOneWithoutRelationship_tagsNestedInputObjectZodSchema = z.object({
  create: z.union([z.lazy(() => relationshipsCreateWithoutRelationship_tagsInputObjectSchema), z.lazy(() => relationshipsUncheckedCreateWithoutRelationship_tagsInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => relationshipsCreateOrConnectWithoutRelationship_tagsInputObjectSchema).optional(),
  upsert: z.lazy(() => relationshipsUpsertWithoutRelationship_tagsInputObjectSchema).optional(),
  disconnect: z.union([z.boolean(), z.lazy(() => relationshipsWhereInputObjectSchema)]).optional(),
  delete: z.union([z.boolean(), z.lazy(() => relationshipsWhereInputObjectSchema)]).optional(),
  connect: z.lazy(() => relationshipsWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => relationshipsUpdateToOneWithWhereWithoutRelationship_tagsInputObjectSchema), z.lazy(() => relationshipsUpdateWithoutRelationship_tagsInputObjectSchema), z.lazy(() => relationshipsUncheckedUpdateWithoutRelationship_tagsInputObjectSchema)]).optional()
}).strict();
