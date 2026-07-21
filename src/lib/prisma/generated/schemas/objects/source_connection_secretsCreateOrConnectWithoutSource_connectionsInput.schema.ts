// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { source_connection_secretsWhereUniqueInputObjectSchema } from './source_connection_secretsWhereUniqueInput.schema';
import { source_connection_secretsCreateWithoutSource_connectionsInputObjectSchema } from './source_connection_secretsCreateWithoutSource_connectionsInput.schema';
import { source_connection_secretsUncheckedCreateWithoutSource_connectionsInputObjectSchema } from './source_connection_secretsUncheckedCreateWithoutSource_connectionsInput.schema'

export const source_connection_secretsCreateOrConnectWithoutSource_connectionsInputObjectSchema: z.ZodType<Prisma.source_connection_secretsCreateOrConnectWithoutSource_connectionsInput, Prisma.source_connection_secretsCreateOrConnectWithoutSource_connectionsInput> = z.object({
  where: z.lazy(() => source_connection_secretsWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => source_connection_secretsCreateWithoutSource_connectionsInputObjectSchema), z.lazy(() => source_connection_secretsUncheckedCreateWithoutSource_connectionsInputObjectSchema)])
}).strict();
export const source_connection_secretsCreateOrConnectWithoutSource_connectionsInputObjectZodSchema = z.object({
  where: z.lazy(() => source_connection_secretsWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => source_connection_secretsCreateWithoutSource_connectionsInputObjectSchema), z.lazy(() => source_connection_secretsUncheckedCreateWithoutSource_connectionsInputObjectSchema)])
}).strict();
