// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { metric_cardsCreateWithoutAlert_rulesInputObjectSchema } from './metric_cardsCreateWithoutAlert_rulesInput.schema';
import { metric_cardsUncheckedCreateWithoutAlert_rulesInputObjectSchema } from './metric_cardsUncheckedCreateWithoutAlert_rulesInput.schema';
import { metric_cardsCreateOrConnectWithoutAlert_rulesInputObjectSchema } from './metric_cardsCreateOrConnectWithoutAlert_rulesInput.schema';
import { metric_cardsUpsertWithoutAlert_rulesInputObjectSchema } from './metric_cardsUpsertWithoutAlert_rulesInput.schema';
import { metric_cardsWhereUniqueInputObjectSchema } from './metric_cardsWhereUniqueInput.schema';
import { metric_cardsUpdateToOneWithWhereWithoutAlert_rulesInputObjectSchema } from './metric_cardsUpdateToOneWithWhereWithoutAlert_rulesInput.schema';
import { metric_cardsUpdateWithoutAlert_rulesInputObjectSchema } from './metric_cardsUpdateWithoutAlert_rulesInput.schema';
import { metric_cardsUncheckedUpdateWithoutAlert_rulesInputObjectSchema } from './metric_cardsUncheckedUpdateWithoutAlert_rulesInput.schema'

export const metric_cardsUpdateOneRequiredWithoutAlert_rulesNestedInputObjectSchema: z.ZodType<Prisma.metric_cardsUpdateOneRequiredWithoutAlert_rulesNestedInput, Prisma.metric_cardsUpdateOneRequiredWithoutAlert_rulesNestedInput> = z.object({
  create: z.union([z.lazy(() => metric_cardsCreateWithoutAlert_rulesInputObjectSchema), z.lazy(() => metric_cardsUncheckedCreateWithoutAlert_rulesInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => metric_cardsCreateOrConnectWithoutAlert_rulesInputObjectSchema).optional(),
  upsert: z.lazy(() => metric_cardsUpsertWithoutAlert_rulesInputObjectSchema).optional(),
  connect: z.lazy(() => metric_cardsWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => metric_cardsUpdateToOneWithWhereWithoutAlert_rulesInputObjectSchema), z.lazy(() => metric_cardsUpdateWithoutAlert_rulesInputObjectSchema), z.lazy(() => metric_cardsUncheckedUpdateWithoutAlert_rulesInputObjectSchema)]).optional()
}).strict();
export const metric_cardsUpdateOneRequiredWithoutAlert_rulesNestedInputObjectZodSchema = z.object({
  create: z.union([z.lazy(() => metric_cardsCreateWithoutAlert_rulesInputObjectSchema), z.lazy(() => metric_cardsUncheckedCreateWithoutAlert_rulesInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => metric_cardsCreateOrConnectWithoutAlert_rulesInputObjectSchema).optional(),
  upsert: z.lazy(() => metric_cardsUpsertWithoutAlert_rulesInputObjectSchema).optional(),
  connect: z.lazy(() => metric_cardsWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => metric_cardsUpdateToOneWithWhereWithoutAlert_rulesInputObjectSchema), z.lazy(() => metric_cardsUpdateWithoutAlert_rulesInputObjectSchema), z.lazy(() => metric_cardsUncheckedUpdateWithoutAlert_rulesInputObjectSchema)]).optional()
}).strict();
