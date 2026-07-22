// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { metric_cardsCreateWithoutStrategy_impact_contractsInputObjectSchema } from './metric_cardsCreateWithoutStrategy_impact_contractsInput.schema';
import { metric_cardsUncheckedCreateWithoutStrategy_impact_contractsInputObjectSchema } from './metric_cardsUncheckedCreateWithoutStrategy_impact_contractsInput.schema';
import { metric_cardsCreateOrConnectWithoutStrategy_impact_contractsInputObjectSchema } from './metric_cardsCreateOrConnectWithoutStrategy_impact_contractsInput.schema';
import { metric_cardsUpsertWithoutStrategy_impact_contractsInputObjectSchema } from './metric_cardsUpsertWithoutStrategy_impact_contractsInput.schema';
import { metric_cardsWhereUniqueInputObjectSchema } from './metric_cardsWhereUniqueInput.schema';
import { metric_cardsUpdateToOneWithWhereWithoutStrategy_impact_contractsInputObjectSchema } from './metric_cardsUpdateToOneWithWhereWithoutStrategy_impact_contractsInput.schema';
import { metric_cardsUpdateWithoutStrategy_impact_contractsInputObjectSchema } from './metric_cardsUpdateWithoutStrategy_impact_contractsInput.schema';
import { metric_cardsUncheckedUpdateWithoutStrategy_impact_contractsInputObjectSchema } from './metric_cardsUncheckedUpdateWithoutStrategy_impact_contractsInput.schema'

export const metric_cardsUpdateOneRequiredWithoutStrategy_impact_contractsNestedInputObjectSchema: z.ZodType<Prisma.metric_cardsUpdateOneRequiredWithoutStrategy_impact_contractsNestedInput, Prisma.metric_cardsUpdateOneRequiredWithoutStrategy_impact_contractsNestedInput> = z.object({
  create: z.union([z.lazy(() => metric_cardsCreateWithoutStrategy_impact_contractsInputObjectSchema), z.lazy(() => metric_cardsUncheckedCreateWithoutStrategy_impact_contractsInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => metric_cardsCreateOrConnectWithoutStrategy_impact_contractsInputObjectSchema).optional(),
  upsert: z.lazy(() => metric_cardsUpsertWithoutStrategy_impact_contractsInputObjectSchema).optional(),
  connect: z.lazy(() => metric_cardsWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => metric_cardsUpdateToOneWithWhereWithoutStrategy_impact_contractsInputObjectSchema), z.lazy(() => metric_cardsUpdateWithoutStrategy_impact_contractsInputObjectSchema), z.lazy(() => metric_cardsUncheckedUpdateWithoutStrategy_impact_contractsInputObjectSchema)]).optional()
}).strict();
export const metric_cardsUpdateOneRequiredWithoutStrategy_impact_contractsNestedInputObjectZodSchema = z.object({
  create: z.union([z.lazy(() => metric_cardsCreateWithoutStrategy_impact_contractsInputObjectSchema), z.lazy(() => metric_cardsUncheckedCreateWithoutStrategy_impact_contractsInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => metric_cardsCreateOrConnectWithoutStrategy_impact_contractsInputObjectSchema).optional(),
  upsert: z.lazy(() => metric_cardsUpsertWithoutStrategy_impact_contractsInputObjectSchema).optional(),
  connect: z.lazy(() => metric_cardsWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => metric_cardsUpdateToOneWithWhereWithoutStrategy_impact_contractsInputObjectSchema), z.lazy(() => metric_cardsUpdateWithoutStrategy_impact_contractsInputObjectSchema), z.lazy(() => metric_cardsUncheckedUpdateWithoutStrategy_impact_contractsInputObjectSchema)]).optional()
}).strict();
