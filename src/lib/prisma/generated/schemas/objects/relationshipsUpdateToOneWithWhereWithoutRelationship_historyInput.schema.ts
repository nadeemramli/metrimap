// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { relationshipsWhereInputObjectSchema } from './relationshipsWhereInput.schema';
import { relationshipsUpdateWithoutRelationship_historyInputObjectSchema } from './relationshipsUpdateWithoutRelationship_historyInput.schema';
import { relationshipsUncheckedUpdateWithoutRelationship_historyInputObjectSchema } from './relationshipsUncheckedUpdateWithoutRelationship_historyInput.schema'

export const relationshipsUpdateToOneWithWhereWithoutRelationship_historyInputObjectSchema: z.ZodType<Prisma.relationshipsUpdateToOneWithWhereWithoutRelationship_historyInput, Prisma.relationshipsUpdateToOneWithWhereWithoutRelationship_historyInput> = z.object({
  where: z.lazy(() => relationshipsWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => relationshipsUpdateWithoutRelationship_historyInputObjectSchema), z.lazy(() => relationshipsUncheckedUpdateWithoutRelationship_historyInputObjectSchema)])
}).strict();
export const relationshipsUpdateToOneWithWhereWithoutRelationship_historyInputObjectZodSchema = z.object({
  where: z.lazy(() => relationshipsWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => relationshipsUpdateWithoutRelationship_historyInputObjectSchema), z.lazy(() => relationshipsUncheckedUpdateWithoutRelationship_historyInputObjectSchema)])
}).strict();
