// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { tracked_metricsCreateWithoutEvent_definitionsInputObjectSchema } from './tracked_metricsCreateWithoutEvent_definitionsInput.schema';
import { tracked_metricsUncheckedCreateWithoutEvent_definitionsInputObjectSchema } from './tracked_metricsUncheckedCreateWithoutEvent_definitionsInput.schema';
import { tracked_metricsCreateOrConnectWithoutEvent_definitionsInputObjectSchema } from './tracked_metricsCreateOrConnectWithoutEvent_definitionsInput.schema';
import { tracked_metricsUpsertWithoutEvent_definitionsInputObjectSchema } from './tracked_metricsUpsertWithoutEvent_definitionsInput.schema';
import { tracked_metricsWhereInputObjectSchema } from './tracked_metricsWhereInput.schema';
import { tracked_metricsWhereUniqueInputObjectSchema } from './tracked_metricsWhereUniqueInput.schema';
import { tracked_metricsUpdateToOneWithWhereWithoutEvent_definitionsInputObjectSchema } from './tracked_metricsUpdateToOneWithWhereWithoutEvent_definitionsInput.schema';
import { tracked_metricsUpdateWithoutEvent_definitionsInputObjectSchema } from './tracked_metricsUpdateWithoutEvent_definitionsInput.schema';
import { tracked_metricsUncheckedUpdateWithoutEvent_definitionsInputObjectSchema } from './tracked_metricsUncheckedUpdateWithoutEvent_definitionsInput.schema'

export const tracked_metricsUpdateOneWithoutEvent_definitionsNestedInputObjectSchema: z.ZodType<Prisma.tracked_metricsUpdateOneWithoutEvent_definitionsNestedInput, Prisma.tracked_metricsUpdateOneWithoutEvent_definitionsNestedInput> = z.object({
  create: z.union([z.lazy(() => tracked_metricsCreateWithoutEvent_definitionsInputObjectSchema), z.lazy(() => tracked_metricsUncheckedCreateWithoutEvent_definitionsInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => tracked_metricsCreateOrConnectWithoutEvent_definitionsInputObjectSchema).optional(),
  upsert: z.lazy(() => tracked_metricsUpsertWithoutEvent_definitionsInputObjectSchema).optional(),
  disconnect: z.union([z.boolean(), z.lazy(() => tracked_metricsWhereInputObjectSchema)]).optional(),
  delete: z.union([z.boolean(), z.lazy(() => tracked_metricsWhereInputObjectSchema)]).optional(),
  connect: z.lazy(() => tracked_metricsWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => tracked_metricsUpdateToOneWithWhereWithoutEvent_definitionsInputObjectSchema), z.lazy(() => tracked_metricsUpdateWithoutEvent_definitionsInputObjectSchema), z.lazy(() => tracked_metricsUncheckedUpdateWithoutEvent_definitionsInputObjectSchema)]).optional()
}).strict();
export const tracked_metricsUpdateOneWithoutEvent_definitionsNestedInputObjectZodSchema = z.object({
  create: z.union([z.lazy(() => tracked_metricsCreateWithoutEvent_definitionsInputObjectSchema), z.lazy(() => tracked_metricsUncheckedCreateWithoutEvent_definitionsInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => tracked_metricsCreateOrConnectWithoutEvent_definitionsInputObjectSchema).optional(),
  upsert: z.lazy(() => tracked_metricsUpsertWithoutEvent_definitionsInputObjectSchema).optional(),
  disconnect: z.union([z.boolean(), z.lazy(() => tracked_metricsWhereInputObjectSchema)]).optional(),
  delete: z.union([z.boolean(), z.lazy(() => tracked_metricsWhereInputObjectSchema)]).optional(),
  connect: z.lazy(() => tracked_metricsWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => tracked_metricsUpdateToOneWithWhereWithoutEvent_definitionsInputObjectSchema), z.lazy(() => tracked_metricsUpdateWithoutEvent_definitionsInputObjectSchema), z.lazy(() => tracked_metricsUncheckedUpdateWithoutEvent_definitionsInputObjectSchema)]).optional()
}).strict();
