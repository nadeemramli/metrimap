// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { relationshipsCreateWithoutEvidence_itemsInputObjectSchema } from './relationshipsCreateWithoutEvidence_itemsInput.schema';
import { relationshipsUncheckedCreateWithoutEvidence_itemsInputObjectSchema } from './relationshipsUncheckedCreateWithoutEvidence_itemsInput.schema';
import { relationshipsCreateOrConnectWithoutEvidence_itemsInputObjectSchema } from './relationshipsCreateOrConnectWithoutEvidence_itemsInput.schema';
import { relationshipsWhereUniqueInputObjectSchema } from './relationshipsWhereUniqueInput.schema'

export const relationshipsCreateNestedOneWithoutEvidence_itemsInputObjectSchema: z.ZodType<Prisma.relationshipsCreateNestedOneWithoutEvidence_itemsInput, Prisma.relationshipsCreateNestedOneWithoutEvidence_itemsInput> = z.object({
  create: z.union([z.lazy(() => relationshipsCreateWithoutEvidence_itemsInputObjectSchema), z.lazy(() => relationshipsUncheckedCreateWithoutEvidence_itemsInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => relationshipsCreateOrConnectWithoutEvidence_itemsInputObjectSchema).optional(),
  connect: z.lazy(() => relationshipsWhereUniqueInputObjectSchema).optional()
}).strict();
export const relationshipsCreateNestedOneWithoutEvidence_itemsInputObjectZodSchema = z.object({
  create: z.union([z.lazy(() => relationshipsCreateWithoutEvidence_itemsInputObjectSchema), z.lazy(() => relationshipsUncheckedCreateWithoutEvidence_itemsInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => relationshipsCreateOrConnectWithoutEvidence_itemsInputObjectSchema).optional(),
  connect: z.lazy(() => relationshipsWhereUniqueInputObjectSchema).optional()
}).strict();
