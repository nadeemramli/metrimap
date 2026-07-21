// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { source_connection_secretsCreateWithoutSource_connectionsInputObjectSchema } from './source_connection_secretsCreateWithoutSource_connectionsInput.schema';
import { source_connection_secretsUncheckedCreateWithoutSource_connectionsInputObjectSchema } from './source_connection_secretsUncheckedCreateWithoutSource_connectionsInput.schema';
import { source_connection_secretsCreateOrConnectWithoutSource_connectionsInputObjectSchema } from './source_connection_secretsCreateOrConnectWithoutSource_connectionsInput.schema';
import { source_connection_secretsWhereUniqueInputObjectSchema } from './source_connection_secretsWhereUniqueInput.schema'

export const source_connection_secretsCreateNestedOneWithoutSource_connectionsInputObjectSchema: z.ZodType<Prisma.source_connection_secretsCreateNestedOneWithoutSource_connectionsInput, Prisma.source_connection_secretsCreateNestedOneWithoutSource_connectionsInput> = z.object({
  create: z.union([z.lazy(() => source_connection_secretsCreateWithoutSource_connectionsInputObjectSchema), z.lazy(() => source_connection_secretsUncheckedCreateWithoutSource_connectionsInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => source_connection_secretsCreateOrConnectWithoutSource_connectionsInputObjectSchema).optional(),
  connect: z.lazy(() => source_connection_secretsWhereUniqueInputObjectSchema).optional()
}).strict();
export const source_connection_secretsCreateNestedOneWithoutSource_connectionsInputObjectZodSchema = z.object({
  create: z.union([z.lazy(() => source_connection_secretsCreateWithoutSource_connectionsInputObjectSchema), z.lazy(() => source_connection_secretsUncheckedCreateWithoutSource_connectionsInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => source_connection_secretsCreateOrConnectWithoutSource_connectionsInputObjectSchema).optional(),
  connect: z.lazy(() => source_connection_secretsWhereUniqueInputObjectSchema).optional()
}).strict();
