// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { relationshipsCreateWithoutEvidence_itemsInputObjectSchema } from './relationshipsCreateWithoutEvidence_itemsInput.schema';
import { relationshipsUncheckedCreateWithoutEvidence_itemsInputObjectSchema } from './relationshipsUncheckedCreateWithoutEvidence_itemsInput.schema';
import { relationshipsCreateOrConnectWithoutEvidence_itemsInputObjectSchema } from './relationshipsCreateOrConnectWithoutEvidence_itemsInput.schema';
import { relationshipsUpsertWithoutEvidence_itemsInputObjectSchema } from './relationshipsUpsertWithoutEvidence_itemsInput.schema';
import { relationshipsWhereInputObjectSchema } from './relationshipsWhereInput.schema';
import { relationshipsWhereUniqueInputObjectSchema } from './relationshipsWhereUniqueInput.schema';
import { relationshipsUpdateToOneWithWhereWithoutEvidence_itemsInputObjectSchema } from './relationshipsUpdateToOneWithWhereWithoutEvidence_itemsInput.schema';
import { relationshipsUpdateWithoutEvidence_itemsInputObjectSchema } from './relationshipsUpdateWithoutEvidence_itemsInput.schema';
import { relationshipsUncheckedUpdateWithoutEvidence_itemsInputObjectSchema } from './relationshipsUncheckedUpdateWithoutEvidence_itemsInput.schema'

export const relationshipsUpdateOneWithoutEvidence_itemsNestedInputObjectSchema: z.ZodType<Prisma.relationshipsUpdateOneWithoutEvidence_itemsNestedInput, Prisma.relationshipsUpdateOneWithoutEvidence_itemsNestedInput> = z.object({
  create: z.union([z.lazy(() => relationshipsCreateWithoutEvidence_itemsInputObjectSchema), z.lazy(() => relationshipsUncheckedCreateWithoutEvidence_itemsInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => relationshipsCreateOrConnectWithoutEvidence_itemsInputObjectSchema).optional(),
  upsert: z.lazy(() => relationshipsUpsertWithoutEvidence_itemsInputObjectSchema).optional(),
  disconnect: z.union([z.boolean(), z.lazy(() => relationshipsWhereInputObjectSchema)]).optional(),
  delete: z.union([z.boolean(), z.lazy(() => relationshipsWhereInputObjectSchema)]).optional(),
  connect: z.lazy(() => relationshipsWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => relationshipsUpdateToOneWithWhereWithoutEvidence_itemsInputObjectSchema), z.lazy(() => relationshipsUpdateWithoutEvidence_itemsInputObjectSchema), z.lazy(() => relationshipsUncheckedUpdateWithoutEvidence_itemsInputObjectSchema)]).optional()
}).strict();
export const relationshipsUpdateOneWithoutEvidence_itemsNestedInputObjectZodSchema = z.object({
  create: z.union([z.lazy(() => relationshipsCreateWithoutEvidence_itemsInputObjectSchema), z.lazy(() => relationshipsUncheckedCreateWithoutEvidence_itemsInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => relationshipsCreateOrConnectWithoutEvidence_itemsInputObjectSchema).optional(),
  upsert: z.lazy(() => relationshipsUpsertWithoutEvidence_itemsInputObjectSchema).optional(),
  disconnect: z.union([z.boolean(), z.lazy(() => relationshipsWhereInputObjectSchema)]).optional(),
  delete: z.union([z.boolean(), z.lazy(() => relationshipsWhereInputObjectSchema)]).optional(),
  connect: z.lazy(() => relationshipsWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => relationshipsUpdateToOneWithWhereWithoutEvidence_itemsInputObjectSchema), z.lazy(() => relationshipsUpdateWithoutEvidence_itemsInputObjectSchema), z.lazy(() => relationshipsUncheckedUpdateWithoutEvidence_itemsInputObjectSchema)]).optional()
}).strict();
