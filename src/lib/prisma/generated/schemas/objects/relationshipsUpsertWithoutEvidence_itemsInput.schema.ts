// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { relationshipsUpdateWithoutEvidence_itemsInputObjectSchema } from './relationshipsUpdateWithoutEvidence_itemsInput.schema';
import { relationshipsUncheckedUpdateWithoutEvidence_itemsInputObjectSchema } from './relationshipsUncheckedUpdateWithoutEvidence_itemsInput.schema';
import { relationshipsCreateWithoutEvidence_itemsInputObjectSchema } from './relationshipsCreateWithoutEvidence_itemsInput.schema';
import { relationshipsUncheckedCreateWithoutEvidence_itemsInputObjectSchema } from './relationshipsUncheckedCreateWithoutEvidence_itemsInput.schema';
import { relationshipsWhereInputObjectSchema } from './relationshipsWhereInput.schema'

export const relationshipsUpsertWithoutEvidence_itemsInputObjectSchema: z.ZodType<Prisma.relationshipsUpsertWithoutEvidence_itemsInput, Prisma.relationshipsUpsertWithoutEvidence_itemsInput> = z.object({
  update: z.union([z.lazy(() => relationshipsUpdateWithoutEvidence_itemsInputObjectSchema), z.lazy(() => relationshipsUncheckedUpdateWithoutEvidence_itemsInputObjectSchema)]),
  create: z.union([z.lazy(() => relationshipsCreateWithoutEvidence_itemsInputObjectSchema), z.lazy(() => relationshipsUncheckedCreateWithoutEvidence_itemsInputObjectSchema)]),
  where: z.lazy(() => relationshipsWhereInputObjectSchema).optional()
}).strict();
export const relationshipsUpsertWithoutEvidence_itemsInputObjectZodSchema = z.object({
  update: z.union([z.lazy(() => relationshipsUpdateWithoutEvidence_itemsInputObjectSchema), z.lazy(() => relationshipsUncheckedUpdateWithoutEvidence_itemsInputObjectSchema)]),
  create: z.union([z.lazy(() => relationshipsCreateWithoutEvidence_itemsInputObjectSchema), z.lazy(() => relationshipsUncheckedCreateWithoutEvidence_itemsInputObjectSchema)]),
  where: z.lazy(() => relationshipsWhereInputObjectSchema).optional()
}).strict();
