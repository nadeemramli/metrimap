// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { relationshipsWhereInputObjectSchema } from './relationshipsWhereInput.schema';
import { relationshipsUpdateWithoutEvidence_itemsInputObjectSchema } from './relationshipsUpdateWithoutEvidence_itemsInput.schema';
import { relationshipsUncheckedUpdateWithoutEvidence_itemsInputObjectSchema } from './relationshipsUncheckedUpdateWithoutEvidence_itemsInput.schema'

export const relationshipsUpdateToOneWithWhereWithoutEvidence_itemsInputObjectSchema: z.ZodType<Prisma.relationshipsUpdateToOneWithWhereWithoutEvidence_itemsInput, Prisma.relationshipsUpdateToOneWithWhereWithoutEvidence_itemsInput> = z.object({
  where: z.lazy(() => relationshipsWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => relationshipsUpdateWithoutEvidence_itemsInputObjectSchema), z.lazy(() => relationshipsUncheckedUpdateWithoutEvidence_itemsInputObjectSchema)])
}).strict();
export const relationshipsUpdateToOneWithWhereWithoutEvidence_itemsInputObjectZodSchema = z.object({
  where: z.lazy(() => relationshipsWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => relationshipsUpdateWithoutEvidence_itemsInputObjectSchema), z.lazy(() => relationshipsUncheckedUpdateWithoutEvidence_itemsInputObjectSchema)])
}).strict();
