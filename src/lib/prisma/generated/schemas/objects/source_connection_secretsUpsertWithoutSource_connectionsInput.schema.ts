// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { source_connection_secretsUpdateWithoutSource_connectionsInputObjectSchema } from './source_connection_secretsUpdateWithoutSource_connectionsInput.schema';
import { source_connection_secretsUncheckedUpdateWithoutSource_connectionsInputObjectSchema } from './source_connection_secretsUncheckedUpdateWithoutSource_connectionsInput.schema';
import { source_connection_secretsCreateWithoutSource_connectionsInputObjectSchema } from './source_connection_secretsCreateWithoutSource_connectionsInput.schema';
import { source_connection_secretsUncheckedCreateWithoutSource_connectionsInputObjectSchema } from './source_connection_secretsUncheckedCreateWithoutSource_connectionsInput.schema';
import { source_connection_secretsWhereInputObjectSchema } from './source_connection_secretsWhereInput.schema'

export const source_connection_secretsUpsertWithoutSource_connectionsInputObjectSchema: z.ZodType<Prisma.source_connection_secretsUpsertWithoutSource_connectionsInput, Prisma.source_connection_secretsUpsertWithoutSource_connectionsInput> = z.object({
  update: z.union([z.lazy(() => source_connection_secretsUpdateWithoutSource_connectionsInputObjectSchema), z.lazy(() => source_connection_secretsUncheckedUpdateWithoutSource_connectionsInputObjectSchema)]),
  create: z.union([z.lazy(() => source_connection_secretsCreateWithoutSource_connectionsInputObjectSchema), z.lazy(() => source_connection_secretsUncheckedCreateWithoutSource_connectionsInputObjectSchema)]),
  where: z.lazy(() => source_connection_secretsWhereInputObjectSchema).optional()
}).strict();
export const source_connection_secretsUpsertWithoutSource_connectionsInputObjectZodSchema = z.object({
  update: z.union([z.lazy(() => source_connection_secretsUpdateWithoutSource_connectionsInputObjectSchema), z.lazy(() => source_connection_secretsUncheckedUpdateWithoutSource_connectionsInputObjectSchema)]),
  create: z.union([z.lazy(() => source_connection_secretsCreateWithoutSource_connectionsInputObjectSchema), z.lazy(() => source_connection_secretsUncheckedCreateWithoutSource_connectionsInputObjectSchema)]),
  where: z.lazy(() => source_connection_secretsWhereInputObjectSchema).optional()
}).strict();
