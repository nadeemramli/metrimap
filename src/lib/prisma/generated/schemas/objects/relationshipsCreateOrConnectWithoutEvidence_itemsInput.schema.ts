// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { relationshipsWhereUniqueInputObjectSchema } from './relationshipsWhereUniqueInput.schema';
import { relationshipsCreateWithoutEvidence_itemsInputObjectSchema } from './relationshipsCreateWithoutEvidence_itemsInput.schema';
import { relationshipsUncheckedCreateWithoutEvidence_itemsInputObjectSchema } from './relationshipsUncheckedCreateWithoutEvidence_itemsInput.schema'

export const relationshipsCreateOrConnectWithoutEvidence_itemsInputObjectSchema: z.ZodType<Prisma.relationshipsCreateOrConnectWithoutEvidence_itemsInput, Prisma.relationshipsCreateOrConnectWithoutEvidence_itemsInput> = z.object({
  where: z.lazy(() => relationshipsWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => relationshipsCreateWithoutEvidence_itemsInputObjectSchema), z.lazy(() => relationshipsUncheckedCreateWithoutEvidence_itemsInputObjectSchema)])
}).strict();
export const relationshipsCreateOrConnectWithoutEvidence_itemsInputObjectZodSchema = z.object({
  where: z.lazy(() => relationshipsWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => relationshipsCreateWithoutEvidence_itemsInputObjectSchema), z.lazy(() => relationshipsUncheckedCreateWithoutEvidence_itemsInputObjectSchema)])
}).strict();
