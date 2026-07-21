// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { metric_cardsCreateWithoutStrategy_metric_linksInputObjectSchema } from './metric_cardsCreateWithoutStrategy_metric_linksInput.schema';
import { metric_cardsUncheckedCreateWithoutStrategy_metric_linksInputObjectSchema } from './metric_cardsUncheckedCreateWithoutStrategy_metric_linksInput.schema';
import { metric_cardsCreateOrConnectWithoutStrategy_metric_linksInputObjectSchema } from './metric_cardsCreateOrConnectWithoutStrategy_metric_linksInput.schema';
import { metric_cardsUpsertWithoutStrategy_metric_linksInputObjectSchema } from './metric_cardsUpsertWithoutStrategy_metric_linksInput.schema';
import { metric_cardsWhereInputObjectSchema } from './metric_cardsWhereInput.schema';
import { metric_cardsWhereUniqueInputObjectSchema } from './metric_cardsWhereUniqueInput.schema';
import { metric_cardsUpdateToOneWithWhereWithoutStrategy_metric_linksInputObjectSchema } from './metric_cardsUpdateToOneWithWhereWithoutStrategy_metric_linksInput.schema';
import { metric_cardsUpdateWithoutStrategy_metric_linksInputObjectSchema } from './metric_cardsUpdateWithoutStrategy_metric_linksInput.schema';
import { metric_cardsUncheckedUpdateWithoutStrategy_metric_linksInputObjectSchema } from './metric_cardsUncheckedUpdateWithoutStrategy_metric_linksInput.schema'

export const metric_cardsUpdateOneWithoutStrategy_metric_linksNestedInputObjectSchema: z.ZodType<Prisma.metric_cardsUpdateOneWithoutStrategy_metric_linksNestedInput, Prisma.metric_cardsUpdateOneWithoutStrategy_metric_linksNestedInput> = z.object({
  create: z.union([z.lazy(() => metric_cardsCreateWithoutStrategy_metric_linksInputObjectSchema), z.lazy(() => metric_cardsUncheckedCreateWithoutStrategy_metric_linksInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => metric_cardsCreateOrConnectWithoutStrategy_metric_linksInputObjectSchema).optional(),
  upsert: z.lazy(() => metric_cardsUpsertWithoutStrategy_metric_linksInputObjectSchema).optional(),
  disconnect: z.union([z.boolean(), z.lazy(() => metric_cardsWhereInputObjectSchema)]).optional(),
  delete: z.union([z.boolean(), z.lazy(() => metric_cardsWhereInputObjectSchema)]).optional(),
  connect: z.lazy(() => metric_cardsWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => metric_cardsUpdateToOneWithWhereWithoutStrategy_metric_linksInputObjectSchema), z.lazy(() => metric_cardsUpdateWithoutStrategy_metric_linksInputObjectSchema), z.lazy(() => metric_cardsUncheckedUpdateWithoutStrategy_metric_linksInputObjectSchema)]).optional()
}).strict();
export const metric_cardsUpdateOneWithoutStrategy_metric_linksNestedInputObjectZodSchema = z.object({
  create: z.union([z.lazy(() => metric_cardsCreateWithoutStrategy_metric_linksInputObjectSchema), z.lazy(() => metric_cardsUncheckedCreateWithoutStrategy_metric_linksInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => metric_cardsCreateOrConnectWithoutStrategy_metric_linksInputObjectSchema).optional(),
  upsert: z.lazy(() => metric_cardsUpsertWithoutStrategy_metric_linksInputObjectSchema).optional(),
  disconnect: z.union([z.boolean(), z.lazy(() => metric_cardsWhereInputObjectSchema)]).optional(),
  delete: z.union([z.boolean(), z.lazy(() => metric_cardsWhereInputObjectSchema)]).optional(),
  connect: z.lazy(() => metric_cardsWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => metric_cardsUpdateToOneWithWhereWithoutStrategy_metric_linksInputObjectSchema), z.lazy(() => metric_cardsUpdateWithoutStrategy_metric_linksInputObjectSchema), z.lazy(() => metric_cardsUncheckedUpdateWithoutStrategy_metric_linksInputObjectSchema)]).optional()
}).strict();
