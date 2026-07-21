// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { source_connectionsWhereUniqueInputObjectSchema } from './source_connectionsWhereUniqueInput.schema';
import { source_connectionsCreateWithoutSource_connection_secretsInputObjectSchema } from './source_connectionsCreateWithoutSource_connection_secretsInput.schema';
import { source_connectionsUncheckedCreateWithoutSource_connection_secretsInputObjectSchema } from './source_connectionsUncheckedCreateWithoutSource_connection_secretsInput.schema'

export const source_connectionsCreateOrConnectWithoutSource_connection_secretsInputObjectSchema: z.ZodType<Prisma.source_connectionsCreateOrConnectWithoutSource_connection_secretsInput, Prisma.source_connectionsCreateOrConnectWithoutSource_connection_secretsInput> = z.object({
  where: z.lazy(() => source_connectionsWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => source_connectionsCreateWithoutSource_connection_secretsInputObjectSchema), z.lazy(() => source_connectionsUncheckedCreateWithoutSource_connection_secretsInputObjectSchema)])
}).strict();
export const source_connectionsCreateOrConnectWithoutSource_connection_secretsInputObjectZodSchema = z.object({
  where: z.lazy(() => source_connectionsWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => source_connectionsCreateWithoutSource_connection_secretsInputObjectSchema), z.lazy(() => source_connectionsUncheckedCreateWithoutSource_connection_secretsInputObjectSchema)])
}).strict();
