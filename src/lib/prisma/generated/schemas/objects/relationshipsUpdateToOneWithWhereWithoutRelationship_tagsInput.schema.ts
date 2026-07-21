// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { relationshipsWhereInputObjectSchema } from './relationshipsWhereInput.schema';
import { relationshipsUpdateWithoutRelationship_tagsInputObjectSchema } from './relationshipsUpdateWithoutRelationship_tagsInput.schema';
import { relationshipsUncheckedUpdateWithoutRelationship_tagsInputObjectSchema } from './relationshipsUncheckedUpdateWithoutRelationship_tagsInput.schema'

export const relationshipsUpdateToOneWithWhereWithoutRelationship_tagsInputObjectSchema: z.ZodType<Prisma.relationshipsUpdateToOneWithWhereWithoutRelationship_tagsInput, Prisma.relationshipsUpdateToOneWithWhereWithoutRelationship_tagsInput> = z.object({
  where: z.lazy(() => relationshipsWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => relationshipsUpdateWithoutRelationship_tagsInputObjectSchema), z.lazy(() => relationshipsUncheckedUpdateWithoutRelationship_tagsInputObjectSchema)])
}).strict();
export const relationshipsUpdateToOneWithWhereWithoutRelationship_tagsInputObjectZodSchema = z.object({
  where: z.lazy(() => relationshipsWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => relationshipsUpdateWithoutRelationship_tagsInputObjectSchema), z.lazy(() => relationshipsUncheckedUpdateWithoutRelationship_tagsInputObjectSchema)])
}).strict();
