// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { source_connection_secretsWhereInputObjectSchema } from './source_connection_secretsWhereInput.schema';
import { source_connection_secretsUpdateWithoutSource_connectionsInputObjectSchema } from './source_connection_secretsUpdateWithoutSource_connectionsInput.schema';
import { source_connection_secretsUncheckedUpdateWithoutSource_connectionsInputObjectSchema } from './source_connection_secretsUncheckedUpdateWithoutSource_connectionsInput.schema'

export const source_connection_secretsUpdateToOneWithWhereWithoutSource_connectionsInputObjectSchema: z.ZodType<Prisma.source_connection_secretsUpdateToOneWithWhereWithoutSource_connectionsInput, Prisma.source_connection_secretsUpdateToOneWithWhereWithoutSource_connectionsInput> = z.object({
  where: z.lazy(() => source_connection_secretsWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => source_connection_secretsUpdateWithoutSource_connectionsInputObjectSchema), z.lazy(() => source_connection_secretsUncheckedUpdateWithoutSource_connectionsInputObjectSchema)])
}).strict();
export const source_connection_secretsUpdateToOneWithWhereWithoutSource_connectionsInputObjectZodSchema = z.object({
  where: z.lazy(() => source_connection_secretsWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => source_connection_secretsUpdateWithoutSource_connectionsInputObjectSchema), z.lazy(() => source_connection_secretsUncheckedUpdateWithoutSource_connectionsInputObjectSchema)])
}).strict();
