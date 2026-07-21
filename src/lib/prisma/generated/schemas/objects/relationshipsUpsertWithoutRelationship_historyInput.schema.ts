// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { relationshipsUpdateWithoutRelationship_historyInputObjectSchema } from './relationshipsUpdateWithoutRelationship_historyInput.schema';
import { relationshipsUncheckedUpdateWithoutRelationship_historyInputObjectSchema } from './relationshipsUncheckedUpdateWithoutRelationship_historyInput.schema';
import { relationshipsCreateWithoutRelationship_historyInputObjectSchema } from './relationshipsCreateWithoutRelationship_historyInput.schema';
import { relationshipsUncheckedCreateWithoutRelationship_historyInputObjectSchema } from './relationshipsUncheckedCreateWithoutRelationship_historyInput.schema';
import { relationshipsWhereInputObjectSchema } from './relationshipsWhereInput.schema'

export const relationshipsUpsertWithoutRelationship_historyInputObjectSchema: z.ZodType<Prisma.relationshipsUpsertWithoutRelationship_historyInput, Prisma.relationshipsUpsertWithoutRelationship_historyInput> = z.object({
  update: z.union([z.lazy(() => relationshipsUpdateWithoutRelationship_historyInputObjectSchema), z.lazy(() => relationshipsUncheckedUpdateWithoutRelationship_historyInputObjectSchema)]),
  create: z.union([z.lazy(() => relationshipsCreateWithoutRelationship_historyInputObjectSchema), z.lazy(() => relationshipsUncheckedCreateWithoutRelationship_historyInputObjectSchema)]),
  where: z.lazy(() => relationshipsWhereInputObjectSchema).optional()
}).strict();
export const relationshipsUpsertWithoutRelationship_historyInputObjectZodSchema = z.object({
  update: z.union([z.lazy(() => relationshipsUpdateWithoutRelationship_historyInputObjectSchema), z.lazy(() => relationshipsUncheckedUpdateWithoutRelationship_historyInputObjectSchema)]),
  create: z.union([z.lazy(() => relationshipsCreateWithoutRelationship_historyInputObjectSchema), z.lazy(() => relationshipsUncheckedCreateWithoutRelationship_historyInputObjectSchema)]),
  where: z.lazy(() => relationshipsWhereInputObjectSchema).optional()
}).strict();
