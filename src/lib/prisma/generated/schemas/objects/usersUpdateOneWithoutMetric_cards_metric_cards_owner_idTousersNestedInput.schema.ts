// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { usersCreateWithoutMetric_cards_metric_cards_owner_idTousersInputObjectSchema } from './usersCreateWithoutMetric_cards_metric_cards_owner_idTousersInput.schema';
import { usersUncheckedCreateWithoutMetric_cards_metric_cards_owner_idTousersInputObjectSchema } from './usersUncheckedCreateWithoutMetric_cards_metric_cards_owner_idTousersInput.schema';
import { usersCreateOrConnectWithoutMetric_cards_metric_cards_owner_idTousersInputObjectSchema } from './usersCreateOrConnectWithoutMetric_cards_metric_cards_owner_idTousersInput.schema';
import { usersUpsertWithoutMetric_cards_metric_cards_owner_idTousersInputObjectSchema } from './usersUpsertWithoutMetric_cards_metric_cards_owner_idTousersInput.schema';
import { usersWhereInputObjectSchema } from './usersWhereInput.schema';
import { usersWhereUniqueInputObjectSchema } from './usersWhereUniqueInput.schema';
import { usersUpdateToOneWithWhereWithoutMetric_cards_metric_cards_owner_idTousersInputObjectSchema } from './usersUpdateToOneWithWhereWithoutMetric_cards_metric_cards_owner_idTousersInput.schema';
import { usersUpdateWithoutMetric_cards_metric_cards_owner_idTousersInputObjectSchema } from './usersUpdateWithoutMetric_cards_metric_cards_owner_idTousersInput.schema';
import { usersUncheckedUpdateWithoutMetric_cards_metric_cards_owner_idTousersInputObjectSchema } from './usersUncheckedUpdateWithoutMetric_cards_metric_cards_owner_idTousersInput.schema'

export const usersUpdateOneWithoutMetric_cards_metric_cards_owner_idTousersNestedInputObjectSchema: z.ZodType<Prisma.usersUpdateOneWithoutMetric_cards_metric_cards_owner_idTousersNestedInput, Prisma.usersUpdateOneWithoutMetric_cards_metric_cards_owner_idTousersNestedInput> = z.object({
  create: z.union([z.lazy(() => usersCreateWithoutMetric_cards_metric_cards_owner_idTousersInputObjectSchema), z.lazy(() => usersUncheckedCreateWithoutMetric_cards_metric_cards_owner_idTousersInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => usersCreateOrConnectWithoutMetric_cards_metric_cards_owner_idTousersInputObjectSchema).optional(),
  upsert: z.lazy(() => usersUpsertWithoutMetric_cards_metric_cards_owner_idTousersInputObjectSchema).optional(),
  disconnect: z.union([z.boolean(), z.lazy(() => usersWhereInputObjectSchema)]).optional(),
  delete: z.union([z.boolean(), z.lazy(() => usersWhereInputObjectSchema)]).optional(),
  connect: z.lazy(() => usersWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => usersUpdateToOneWithWhereWithoutMetric_cards_metric_cards_owner_idTousersInputObjectSchema), z.lazy(() => usersUpdateWithoutMetric_cards_metric_cards_owner_idTousersInputObjectSchema), z.lazy(() => usersUncheckedUpdateWithoutMetric_cards_metric_cards_owner_idTousersInputObjectSchema)]).optional()
}).strict();
export const usersUpdateOneWithoutMetric_cards_metric_cards_owner_idTousersNestedInputObjectZodSchema = z.object({
  create: z.union([z.lazy(() => usersCreateWithoutMetric_cards_metric_cards_owner_idTousersInputObjectSchema), z.lazy(() => usersUncheckedCreateWithoutMetric_cards_metric_cards_owner_idTousersInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => usersCreateOrConnectWithoutMetric_cards_metric_cards_owner_idTousersInputObjectSchema).optional(),
  upsert: z.lazy(() => usersUpsertWithoutMetric_cards_metric_cards_owner_idTousersInputObjectSchema).optional(),
  disconnect: z.union([z.boolean(), z.lazy(() => usersWhereInputObjectSchema)]).optional(),
  delete: z.union([z.boolean(), z.lazy(() => usersWhereInputObjectSchema)]).optional(),
  connect: z.lazy(() => usersWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => usersUpdateToOneWithWhereWithoutMetric_cards_metric_cards_owner_idTousersInputObjectSchema), z.lazy(() => usersUpdateWithoutMetric_cards_metric_cards_owner_idTousersInputObjectSchema), z.lazy(() => usersUncheckedUpdateWithoutMetric_cards_metric_cards_owner_idTousersInputObjectSchema)]).optional()
}).strict();
