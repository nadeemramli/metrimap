// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { source_connection_secretsCreateWithoutSource_connectionsInputObjectSchema } from './source_connection_secretsCreateWithoutSource_connectionsInput.schema';
import { source_connection_secretsUncheckedCreateWithoutSource_connectionsInputObjectSchema } from './source_connection_secretsUncheckedCreateWithoutSource_connectionsInput.schema';
import { source_connection_secretsCreateOrConnectWithoutSource_connectionsInputObjectSchema } from './source_connection_secretsCreateOrConnectWithoutSource_connectionsInput.schema';
import { source_connection_secretsUpsertWithoutSource_connectionsInputObjectSchema } from './source_connection_secretsUpsertWithoutSource_connectionsInput.schema';
import { source_connection_secretsWhereInputObjectSchema } from './source_connection_secretsWhereInput.schema';
import { source_connection_secretsWhereUniqueInputObjectSchema } from './source_connection_secretsWhereUniqueInput.schema';
import { source_connection_secretsUpdateToOneWithWhereWithoutSource_connectionsInputObjectSchema } from './source_connection_secretsUpdateToOneWithWhereWithoutSource_connectionsInput.schema';
import { source_connection_secretsUpdateWithoutSource_connectionsInputObjectSchema } from './source_connection_secretsUpdateWithoutSource_connectionsInput.schema';
import { source_connection_secretsUncheckedUpdateWithoutSource_connectionsInputObjectSchema } from './source_connection_secretsUncheckedUpdateWithoutSource_connectionsInput.schema'

export const source_connection_secretsUncheckedUpdateOneWithoutSource_connectionsNestedInputObjectSchema: z.ZodType<Prisma.source_connection_secretsUncheckedUpdateOneWithoutSource_connectionsNestedInput, Prisma.source_connection_secretsUncheckedUpdateOneWithoutSource_connectionsNestedInput> = z.object({
  create: z.union([z.lazy(() => source_connection_secretsCreateWithoutSource_connectionsInputObjectSchema), z.lazy(() => source_connection_secretsUncheckedCreateWithoutSource_connectionsInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => source_connection_secretsCreateOrConnectWithoutSource_connectionsInputObjectSchema).optional(),
  upsert: z.lazy(() => source_connection_secretsUpsertWithoutSource_connectionsInputObjectSchema).optional(),
  disconnect: z.union([z.boolean(), z.lazy(() => source_connection_secretsWhereInputObjectSchema)]).optional(),
  delete: z.union([z.boolean(), z.lazy(() => source_connection_secretsWhereInputObjectSchema)]).optional(),
  connect: z.lazy(() => source_connection_secretsWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => source_connection_secretsUpdateToOneWithWhereWithoutSource_connectionsInputObjectSchema), z.lazy(() => source_connection_secretsUpdateWithoutSource_connectionsInputObjectSchema), z.lazy(() => source_connection_secretsUncheckedUpdateWithoutSource_connectionsInputObjectSchema)]).optional()
}).strict();
export const source_connection_secretsUncheckedUpdateOneWithoutSource_connectionsNestedInputObjectZodSchema = z.object({
  create: z.union([z.lazy(() => source_connection_secretsCreateWithoutSource_connectionsInputObjectSchema), z.lazy(() => source_connection_secretsUncheckedCreateWithoutSource_connectionsInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => source_connection_secretsCreateOrConnectWithoutSource_connectionsInputObjectSchema).optional(),
  upsert: z.lazy(() => source_connection_secretsUpsertWithoutSource_connectionsInputObjectSchema).optional(),
  disconnect: z.union([z.boolean(), z.lazy(() => source_connection_secretsWhereInputObjectSchema)]).optional(),
  delete: z.union([z.boolean(), z.lazy(() => source_connection_secretsWhereInputObjectSchema)]).optional(),
  connect: z.lazy(() => source_connection_secretsWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => source_connection_secretsUpdateToOneWithWhereWithoutSource_connectionsInputObjectSchema), z.lazy(() => source_connection_secretsUpdateWithoutSource_connectionsInputObjectSchema), z.lazy(() => source_connection_secretsUncheckedUpdateWithoutSource_connectionsInputObjectSchema)]).optional()
}).strict();
