// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { source_connectionsUpdateWithoutSource_connection_secretsInputObjectSchema } from './source_connectionsUpdateWithoutSource_connection_secretsInput.schema';
import { source_connectionsUncheckedUpdateWithoutSource_connection_secretsInputObjectSchema } from './source_connectionsUncheckedUpdateWithoutSource_connection_secretsInput.schema';
import { source_connectionsCreateWithoutSource_connection_secretsInputObjectSchema } from './source_connectionsCreateWithoutSource_connection_secretsInput.schema';
import { source_connectionsUncheckedCreateWithoutSource_connection_secretsInputObjectSchema } from './source_connectionsUncheckedCreateWithoutSource_connection_secretsInput.schema';
import { source_connectionsWhereInputObjectSchema } from './source_connectionsWhereInput.schema'

export const source_connectionsUpsertWithoutSource_connection_secretsInputObjectSchema: z.ZodType<Prisma.source_connectionsUpsertWithoutSource_connection_secretsInput, Prisma.source_connectionsUpsertWithoutSource_connection_secretsInput> = z.object({
  update: z.union([z.lazy(() => source_connectionsUpdateWithoutSource_connection_secretsInputObjectSchema), z.lazy(() => source_connectionsUncheckedUpdateWithoutSource_connection_secretsInputObjectSchema)]),
  create: z.union([z.lazy(() => source_connectionsCreateWithoutSource_connection_secretsInputObjectSchema), z.lazy(() => source_connectionsUncheckedCreateWithoutSource_connection_secretsInputObjectSchema)]),
  where: z.lazy(() => source_connectionsWhereInputObjectSchema).optional()
}).strict();
export const source_connectionsUpsertWithoutSource_connection_secretsInputObjectZodSchema = z.object({
  update: z.union([z.lazy(() => source_connectionsUpdateWithoutSource_connection_secretsInputObjectSchema), z.lazy(() => source_connectionsUncheckedUpdateWithoutSource_connection_secretsInputObjectSchema)]),
  create: z.union([z.lazy(() => source_connectionsCreateWithoutSource_connection_secretsInputObjectSchema), z.lazy(() => source_connectionsUncheckedCreateWithoutSource_connection_secretsInputObjectSchema)]),
  where: z.lazy(() => source_connectionsWhereInputObjectSchema).optional()
}).strict();
