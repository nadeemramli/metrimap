// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { source_connectionsCreateWithoutSource_connection_secretsInputObjectSchema } from './source_connectionsCreateWithoutSource_connection_secretsInput.schema';
import { source_connectionsUncheckedCreateWithoutSource_connection_secretsInputObjectSchema } from './source_connectionsUncheckedCreateWithoutSource_connection_secretsInput.schema';
import { source_connectionsCreateOrConnectWithoutSource_connection_secretsInputObjectSchema } from './source_connectionsCreateOrConnectWithoutSource_connection_secretsInput.schema';
import { source_connectionsUpsertWithoutSource_connection_secretsInputObjectSchema } from './source_connectionsUpsertWithoutSource_connection_secretsInput.schema';
import { source_connectionsWhereUniqueInputObjectSchema } from './source_connectionsWhereUniqueInput.schema';
import { source_connectionsUpdateToOneWithWhereWithoutSource_connection_secretsInputObjectSchema } from './source_connectionsUpdateToOneWithWhereWithoutSource_connection_secretsInput.schema';
import { source_connectionsUpdateWithoutSource_connection_secretsInputObjectSchema } from './source_connectionsUpdateWithoutSource_connection_secretsInput.schema';
import { source_connectionsUncheckedUpdateWithoutSource_connection_secretsInputObjectSchema } from './source_connectionsUncheckedUpdateWithoutSource_connection_secretsInput.schema'

export const source_connectionsUpdateOneRequiredWithoutSource_connection_secretsNestedInputObjectSchema: z.ZodType<Prisma.source_connectionsUpdateOneRequiredWithoutSource_connection_secretsNestedInput, Prisma.source_connectionsUpdateOneRequiredWithoutSource_connection_secretsNestedInput> = z.object({
  create: z.union([z.lazy(() => source_connectionsCreateWithoutSource_connection_secretsInputObjectSchema), z.lazy(() => source_connectionsUncheckedCreateWithoutSource_connection_secretsInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => source_connectionsCreateOrConnectWithoutSource_connection_secretsInputObjectSchema).optional(),
  upsert: z.lazy(() => source_connectionsUpsertWithoutSource_connection_secretsInputObjectSchema).optional(),
  connect: z.lazy(() => source_connectionsWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => source_connectionsUpdateToOneWithWhereWithoutSource_connection_secretsInputObjectSchema), z.lazy(() => source_connectionsUpdateWithoutSource_connection_secretsInputObjectSchema), z.lazy(() => source_connectionsUncheckedUpdateWithoutSource_connection_secretsInputObjectSchema)]).optional()
}).strict();
export const source_connectionsUpdateOneRequiredWithoutSource_connection_secretsNestedInputObjectZodSchema = z.object({
  create: z.union([z.lazy(() => source_connectionsCreateWithoutSource_connection_secretsInputObjectSchema), z.lazy(() => source_connectionsUncheckedCreateWithoutSource_connection_secretsInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => source_connectionsCreateOrConnectWithoutSource_connection_secretsInputObjectSchema).optional(),
  upsert: z.lazy(() => source_connectionsUpsertWithoutSource_connection_secretsInputObjectSchema).optional(),
  connect: z.lazy(() => source_connectionsWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => source_connectionsUpdateToOneWithWhereWithoutSource_connection_secretsInputObjectSchema), z.lazy(() => source_connectionsUpdateWithoutSource_connection_secretsInputObjectSchema), z.lazy(() => source_connectionsUncheckedUpdateWithoutSource_connection_secretsInputObjectSchema)]).optional()
}).strict();
