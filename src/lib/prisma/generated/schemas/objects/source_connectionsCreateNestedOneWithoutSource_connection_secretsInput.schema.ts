// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { source_connectionsCreateWithoutSource_connection_secretsInputObjectSchema } from './source_connectionsCreateWithoutSource_connection_secretsInput.schema';
import { source_connectionsUncheckedCreateWithoutSource_connection_secretsInputObjectSchema } from './source_connectionsUncheckedCreateWithoutSource_connection_secretsInput.schema';
import { source_connectionsCreateOrConnectWithoutSource_connection_secretsInputObjectSchema } from './source_connectionsCreateOrConnectWithoutSource_connection_secretsInput.schema';
import { source_connectionsWhereUniqueInputObjectSchema } from './source_connectionsWhereUniqueInput.schema'

export const source_connectionsCreateNestedOneWithoutSource_connection_secretsInputObjectSchema: z.ZodType<Prisma.source_connectionsCreateNestedOneWithoutSource_connection_secretsInput, Prisma.source_connectionsCreateNestedOneWithoutSource_connection_secretsInput> = z.object({
  create: z.union([z.lazy(() => source_connectionsCreateWithoutSource_connection_secretsInputObjectSchema), z.lazy(() => source_connectionsUncheckedCreateWithoutSource_connection_secretsInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => source_connectionsCreateOrConnectWithoutSource_connection_secretsInputObjectSchema).optional(),
  connect: z.lazy(() => source_connectionsWhereUniqueInputObjectSchema).optional()
}).strict();
export const source_connectionsCreateNestedOneWithoutSource_connection_secretsInputObjectZodSchema = z.object({
  create: z.union([z.lazy(() => source_connectionsCreateWithoutSource_connection_secretsInputObjectSchema), z.lazy(() => source_connectionsUncheckedCreateWithoutSource_connection_secretsInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => source_connectionsCreateOrConnectWithoutSource_connection_secretsInputObjectSchema).optional(),
  connect: z.lazy(() => source_connectionsWhereUniqueInputObjectSchema).optional()
}).strict();
