// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { relationshipsUpdateWithoutRelationship_tagsInputObjectSchema } from './relationshipsUpdateWithoutRelationship_tagsInput.schema';
import { relationshipsUncheckedUpdateWithoutRelationship_tagsInputObjectSchema } from './relationshipsUncheckedUpdateWithoutRelationship_tagsInput.schema';
import { relationshipsCreateWithoutRelationship_tagsInputObjectSchema } from './relationshipsCreateWithoutRelationship_tagsInput.schema';
import { relationshipsUncheckedCreateWithoutRelationship_tagsInputObjectSchema } from './relationshipsUncheckedCreateWithoutRelationship_tagsInput.schema';
import { relationshipsWhereInputObjectSchema } from './relationshipsWhereInput.schema'

export const relationshipsUpsertWithoutRelationship_tagsInputObjectSchema: z.ZodType<Prisma.relationshipsUpsertWithoutRelationship_tagsInput, Prisma.relationshipsUpsertWithoutRelationship_tagsInput> = z.object({
  update: z.union([z.lazy(() => relationshipsUpdateWithoutRelationship_tagsInputObjectSchema), z.lazy(() => relationshipsUncheckedUpdateWithoutRelationship_tagsInputObjectSchema)]),
  create: z.union([z.lazy(() => relationshipsCreateWithoutRelationship_tagsInputObjectSchema), z.lazy(() => relationshipsUncheckedCreateWithoutRelationship_tagsInputObjectSchema)]),
  where: z.lazy(() => relationshipsWhereInputObjectSchema).optional()
}).strict();
export const relationshipsUpsertWithoutRelationship_tagsInputObjectZodSchema = z.object({
  update: z.union([z.lazy(() => relationshipsUpdateWithoutRelationship_tagsInputObjectSchema), z.lazy(() => relationshipsUncheckedUpdateWithoutRelationship_tagsInputObjectSchema)]),
  create: z.union([z.lazy(() => relationshipsCreateWithoutRelationship_tagsInputObjectSchema), z.lazy(() => relationshipsUncheckedCreateWithoutRelationship_tagsInputObjectSchema)]),
  where: z.lazy(() => relationshipsWhereInputObjectSchema).optional()
}).strict();
